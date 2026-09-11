import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WelcomeScreen from "@/components/welcome-screen";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("group_members")
    .select("id, streak_count, last_check_in, groups!inner(id, name, description)")
    .eq("user_id", user.id);

  const myGroups = ((memberships ?? []) as unknown as {
    groups: { id: string; name: string; description: string | null };
    streak_count: number;
  }[]).map((m) => ({
    id: m.groups.id,
    name: m.groups.name,
    streak: m.streak_count,
  }));

  // Rangs : tri des membres par groupe pour positionner l'utilisateur
  const groupIds = myGroups.map((g) => g.id);
  let groupsWithRank: {
    id: string;
    name: string;
    streak: number;
    rank: number | null;
  }[] = myGroups.map((g) => ({ ...g, rank: null }));

  if (groupIds.length > 0) {
    const { data: allMembers } = await supabase
      .from("group_members")
      .select("group_id, user_id, streak_count")
      .in("group_id", groupIds);

    const byGroup = new Map<
      string,
      { user_id: string; streak_count: number }[]
    >();
    for (const m of allMembers ?? []) {
      const list = byGroup.get(m.group_id as string) ?? [];
      list.push({
        user_id: m.user_id as string,
        streak_count: m.streak_count as number,
      });
      byGroup.set(m.group_id as string, list);
    }

    groupsWithRank = myGroups.map((g) => {
      const members = (byGroup.get(g.id) ?? []).sort(
        (a, b) => b.streak_count - a.streak_count
      );
      const rank = members.findIndex((m) => m.user_id === user.id) + 1;
      return { ...g, rank: rank > 0 ? rank : null };
    });
  }

  const emailLocal = (user.email ?? "").split("@")[0] ?? "toi";
  const metaName =
    typeof user.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : "";
  const displayName =
    metaName || emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1);
  const initials = (metaName || emailLocal).slice(0, 2).toUpperCase();

  return (
    <WelcomeScreen
      displayName={displayName || "toi"}
      handle={emailLocal}
      initials={initials}
      groups={groupsWithRank}
    />
  );
}