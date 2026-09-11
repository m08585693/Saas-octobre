"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayString(): string {
  return new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
}

export async function joinGroup(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const groupId = String(formData.get("groupId"));

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

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/dashboard");
  redirect(`/dashboard?group=${groupId}`);
}