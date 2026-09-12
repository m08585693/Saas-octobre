import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell, {
  type DashboardGroup,
} from "@/components/dashboard-shell";
import {
  FREEZES_PER_MONTH,
  initialsOf,
  nextBadge,
  buildMonthCells,
} from "@/lib/arc";

type MemberRow = {
  group_id: string;
  user_id: string;
  display_name: string | null;
  streak_count: number;
  last_check_in: string | null;
};

type TodayCheckin = { id: string; user_id: string; group_id: string };
type ReactionRow = {
  checkin_id: string;
  emoji: string;
  user_id: string;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    group?: string;
    badge?: string;
    paywall?: string;
    checked?: string;
  }>;
}) {
  const { group: initialGroupId, badge, paywall, checked } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .maybeSingle();
  const plan = profile?.plan ?? "free";

  const { data: memberships } = await supabase
    .from("group_members")
    .select(
      "id, streak_count, last_check_in, freezes_left, freezes_month, groups!inner(id, name, description, category, frequency, duration_days)"
    )
    .eq("user_id", user.id);

  const joined = ((memberships ?? []) as unknown as {
    streak_count: number;
    last_check_in: string | null;
    freezes_left: number | null;
    freezes_month: string | null;
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
    freezesLeft: m.freezes_month === todayMonth() ? m.freezes_left : null,
  }));

  const groupIds = joined.map((g) => g.id);

  // Récupérer tous les membres des groupes pour calculer streaks & rangs
  let allMembers: MemberRow[] = [];
  if (groupIds.length > 0) {
    const { data } = await supabase
      .from("group_members")
      .select("group_id, user_id, display_name, streak_count, last_check_in")
      .in("group_id", groupIds);
    allMembers = (data ?? []) as MemberRow[];
  }

  // Check-ins du jour pour les réactions
  const todayCheckinsByGroup: Record<string, TodayCheckin[]> = {};
  if (groupIds.length > 0) {
    const { data, error } = await supabase
      .from("checkins")
      .select("id, user_id, group_id")
      .in("group_id", groupIds)
      .eq("date", todayString());
    if (!error) {
      for (const c of (data ?? []) as TodayCheckin[]) {
        (todayCheckinsByGroup[c.group_id] ??= []).push(c);
      }
    }
  }

  // Réactions associées aux check-ins du jour
  const reactionsByCheckin: Record<string, ReactionRow[]> = {};
  const allCheckinIds = Object.values(todayCheckinsByGroup)
    .flat()
    .map((c) => c.id);
  if (allCheckinIds.length > 0) {
    const { data, error } = await supabase
      .from("checkin_reactions")
      .select("checkin_id, emoji, user_id")
      .in("checkin_id", allCheckinIds);
    if (!error) {
      for (const r of (data ?? []) as ReactionRow[]) {
        (reactionsByCheckin[r.checkin_id] ??= []).push(r);
      }
    }
  }

  // Historique du mois courant (heatmap de l'utilisateur)
  const monthCheckinsByGroup: Record<string, string[]> = {};
  if (groupIds.length > 0) {
    const { data, error } = await supabase
      .from("checkins")
      .select("group_id, date")
      .eq("user_id", user.id)
      .in("group_id", groupIds)
      .gte("date", monthStart());
    if (!error) {
      for (const c of (data ?? []) as { group_id: string; date: string }[]) {
        (monthCheckinsByGroup[c.group_id] ??= []).push(c.date);
      }
    }
  }

  const byGroup = new Map<string, MemberRow[]>();
  for (const m of allMembers) {
    const list = byGroup.get(m.group_id) ?? [];
    list.push(m);
    byGroup.set(m.group_id, list);
  }

  const today = todayString();

  const groups: DashboardGroup[] = joined.map((g) => {
    const members = (byGroup.get(g.id) ?? []).map((m) => {
      const checkin = (todayCheckinsByGroup[g.id] ?? []).find(
        (c) => c.user_id === m.user_id
      );
      const reactions = checkin
        ? summarizeReactions((reactionsByCheckin[checkin.id] ?? []), user.id)
        : undefined;
      return {
        userId: m.user_id,
        name: m.display_name ?? "Membre",
        streak: m.streak_count,
        checkedToday: m.last_check_in === today,
        initials: initialsOf(m.display_name ?? "Membre"),
        todayCheckInId: checkin?.id,
        reactions,
      };
    }).sort((a, b) => b.streak - a.streak);

    const myRank = members.findIndex((m) => m.userId === user.id) + 1 || null;

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
      freezesLeft: g.freezesLeft ?? FREEZES_PER_MONTH,
      monthCells: buildMonthCells(monthCheckinsByGroup[g.id] ?? [], new Date()),
      nextBadge: nextBadge(g.myStreak),
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
      plan={plan}
      badgeUnlocked={badge}
      justChecked={checked === "1"}
      paywallRequested={paywall === "1"}
    />
  );
}

function summarizeReactions(
  rows: ReactionRow[],
  myId: string
): { emoji: string; count: number; mine: boolean }[] {
  const summary = new Map<string, { count: number; mine: boolean }>();
  for (const r of rows) {
    const cur = summary.get(r.emoji) ?? { count: 0, mine: false };
    cur.count += 1;
    if (r.user_id === myId) cur.mine = true;
    summary.set(r.emoji, cur);
  }
  return Array.from(summary.entries()).map(([emoji, v]) => ({
    emoji,
    count: v.count,
    mine: v.mine,
  }));
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function todayMonth(): string {
  return todayString().slice(0, 7);
}

function monthStart(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
}