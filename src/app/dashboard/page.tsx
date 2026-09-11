import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell, {
  type DashboardGroup,
} from "@/components/dashboard-shell";

type Params = Promise<{ id?: string }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group: initialGroupId } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("group_members")
    .select(
      "id, streak_count, last_check_in, groups!inner(id, name, description, category, frequency, duration_days)"
    )
    .eq("user_id", user.id);

  const joined = ((memberships ?? []) as unknown as {
    streak_count: number;
    last_check_in: string | null;
    groups: {
      id: string;
      name: string;
      description: string | null;
      category: string | null;
      frequency: string | null;
      duration_days: number | null;
    };
  }[]).map((m) => ({
    id: m.groups.id,
    name: m.groups.name,
    description: m.groups.description,
    category: m.groups.category ?? "autre",
    frequency: m.groups.frequency ?? "daily",
    durationDays: m.groups.duration_days ?? null,
    myStreak: m.streak_count,
    myLastCheckIn: m.last_check_in,
  }));

  const groupIds = joined.map((g) => g.id);

  // Récupérer tous les membres des groupes pour calculer streaks & rangs
  let allMembers: {
    group_id: string;
    user_id: string;
    display_name: string | null;
    streak_count: number;
    last_check_in: string | null;
  }[] = [];

  if (groupIds.length > 0) {
    const { data } = await supabase
      .from("group_members")
      .select("group_id, user_id, display_name, streak_count, last_check_in")
      .in("group_id", groupIds);

    allMembers = (data ?? []) as typeof allMembers;
  }

  const byGroup = new Map<
    string,
    (typeof allMembers)[number][]
  >();
  for (const m of allMembers) {
    const list = byGroup.get(m.group_id) ?? [];
    list.push(m);
    byGroup.set(m.group_id, list);
  }

  const today = new Date().toISOString().slice(0, 10);

  const groups: DashboardGroup[] = joined.map((g) => {
    const members = (byGroup.get(g.id) ?? [])
      .map((m) => ({
        userId: m.user_id,
        name: m.display_name ?? "Membre",
        streak: m.streak_count,
      }))
      .sort((a, b) => b.streak - a.streak);

    const myRank =
      members.findIndex((m) => m.userId === user.id) + 1 || null;

    return {
      id: g.id,
      name: g.name,
      description: g.description,
      category: g.category,
      frequency: g.frequency,
      durationDays: g.durationDays,
      members,
      myStreak: g.myStreak,
      myRank,
      checkedToday: g.myLastCheckIn === today,
    };
  });

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
    <DashboardShell
      userId={user.id}
      displayName={displayName}
      handle={emailLocal}
      initials={initials}
      groups={groups}
      initialGroupId={initialGroupId}
    />
  );
}