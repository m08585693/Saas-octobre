"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SupabaseLike = Awaited<ReturnType<typeof createClient>>;

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayString(): string {
  return new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
}

const FREE_MAX_GROUPS = 1;

async function getPlan(
  supabase: SupabaseLike,
  userId: string
): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.plan ?? "free";
}

async function countUserGroups(
  supabase: SupabaseLike,
  userId: string
): Promise<number> {
  const { count } = await supabase
    .from("group_members")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

// Redirige vers le paywall si le plan gratuit n'autorise pas ce groupe de plus.
async function enforceGroupLimit(
  supabase: SupabaseLike,
  userId: string,
  groupId?: string
): Promise<boolean> {
  const plan = await getPlan(supabase, userId);
  if (plan === "pro") return false;
  const count = await countUserGroups(supabase, userId);
  const alreadyInThisGroup = groupId
    ? ((await supabase
        .from("group_members")
        .select("id")
        .eq("user_id", userId)
        .eq("group_id", groupId)
        .maybeSingle()).data !== null)
    : false;
  if (count - (alreadyInThisGroup ? 1 : 0) >= FREE_MAX_GROUPS) {
    redirect("/dashboard?paywall=1");
  }
  return true;
}

export async function joinGroup(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const groupId = String(formData.get("groupId"));
  await enforceGroupLimit(supabase, user.id, groupId);

  const { data: existing } = await supabase
    .from("group_members")
    .select("id")
    .eq("user_id", user.id)
    .eq("group_id", groupId)
    .maybeSingle();

  if (!existing) {
    const displayName = user.email?.split("@")[0] ?? "Membre";
    await supabase.from("group_members").insert({
      user_id: user.id,
      group_id: groupId,
      display_name: displayName,
      streak_count: 0,
    });
  }

  revalidatePath("/groups");
  revalidatePath("/dashboard");
  redirect(`/dashboard?group=${groupId}`);
}

const CATEGORIES = [
  "sport",
  "discipline",
  "sommeil",
  "nutrition",
  "lecture",
  "ecrans",
  "autre",
];

export async function createGroup(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await enforceGroupLimit(supabase, user.id);

  const name = String(formData.get("name")).trim();
  const category = String(formData.get("category"));
  const frequency = String(formData.get("frequency"));
  const duration = Number(formData.get("duration"));
  const days = formData
    .getAll("days")
    .map((d) => String(d))
    .join(",");

  // Validation serveur : champs requis sinon retour formulaire
  if (
    !name ||
    !CATEGORIES.includes(category) ||
    !["daily", "weekly"].includes(frequency) ||
    !duration
  ) {
    redirect("/create");
  }
  if (frequency === "weekly" && !days) {
    redirect("/create");
  }

  const displayName = user.email?.split("@")[0] ?? "Membre";
  const description = `Objectif créé par ${displayName}`;

  const { data: created, error } = await supabase
    .from("groups")
    .insert({
      name,
      description,
      category,
      frequency: frequency === "daily" ? "daily" : days,
      duration_days: duration,
    })
    .select("id")
    .single();

  if (error || !created) {
    redirect("/create");
  }

  await supabase.from("group_members").insert({
    user_id: user.id,
    group_id: created.id,
    display_name: displayName,
    streak_count: 0,
  });

  revalidatePath("/groups");
  revalidatePath("/dashboard");
  redirect(`/dashboard?group=${created.id}`);
}

export async function checkIn(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const groupId = String(formData.get("groupId"));

  const { data: membership } = await supabase
    .from("group_members")
    .select("id, streak_count, last_check_in")
    .eq("user_id", user.id)
    .eq("group_id", groupId)
    .maybeSingle();

  if (!membership) redirect("/dashboard");

  const today = todayString();
  const yesterday = yesterdayString();

  // Déjà check-in aujourd'hui : on ne fait rien
  if (membership.last_check_in === today) {
    redirect(`/dashboard?group=${groupId}`);
  }

  let newStreak: number;
  if (membership.last_check_in === yesterday) {
    newStreak = membership.streak_count + 1;
  } else {
    // Rupture de série : on repart à 1
    newStreak = 1;
  }

  await supabase
    .from("group_members")
    .update({ streak_count: newStreak, last_check_in: today })
    .eq("id", membership.id);

  // Badge 7 jours : dès qu'un streak atteint 7 jours consécutifs
  let badgeUnlocked = false;
  if (newStreak >= 7) {
    const { data: existingBadge } = await supabase
      .from("user_badges")
      .select("id")
      .eq("user_id", user.id)
      .eq("badge_key", "7_days")
      .maybeSingle();

    if (!existingBadge) {
      const { error } = await supabase.from("user_badges").insert({
        user_id: user.id,
        group_id: groupId,
        badge_key: "7_days",
      });
      badgeUnlocked = !error;
    }
  }

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/dashboard");

  const query = badgeUnlocked ? `?badge=7&group=${groupId}` : `?group=${groupId}`;
  redirect(`/dashboard${query}`);
}