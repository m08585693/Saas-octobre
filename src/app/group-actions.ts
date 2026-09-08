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
  redirect(`/dashboard?group=${groupId}`);
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

  revalidatePath("/dashboard");
  redirect(`/dashboard?group=${groupId}`);
}