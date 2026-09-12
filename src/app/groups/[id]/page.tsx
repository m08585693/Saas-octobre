import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BrandLogo from "@/components/brand";
import GroupDetailView from "@/components/group-detail-view";
import {
  FREEZES_PER_MONTH,
  buildMonthCells,
  initialsOf,
  nextBadge,
} from "@/lib/arc";

type MemberRow = {
  user_id: string;
  display_name: string | null;
  streak_count: number;
  last_check_in: string | null;
};

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: detail } = await supabase
    .from("groups")
    .select(
      "id, name, description, category, frequency, duration_days, group_members(user_id, display_name, streak_count, last_check_in)"
    )
    .eq("id", id)
    .single();

  if (!detail) redirect("/dashboard");

  const rawMembers = (detail.group_members ?? []) as MemberRow[];

  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);

  // Check-ins du jour (réactions)
  const todayCheckins = new Map<string, string>();
  {
    const { data, error } = await supabase
      .from("checkins")
      .select("id, user_id")
      .eq("group_id", id)
      .eq("date", today);
    if (!error) {
      for (const c of (data ?? []) as { id: string; user_id: string }[]) {
        todayCheckins.set(c.user_id, c.id);
      }
    }
  }

  // Réactions des check-ins du jour
  const reactionsByUser = new Map<string, { emoji: string; count: number; mine: boolean }[]>();
  {
    const ids = Array.from(todayCheckins.values());
    if (ids.length > 0) {
      const { data, error } = await supabase
        .from("checkin_reactions")
        .select("checkin_id, emoji, user_id")
        .in("checkin_id", ids);
      if (!error) {
        for (const c of Array.from(todayCheckins.entries())) {
          const [uid, checkinId] = c;
          const rows = (data ?? []).filter((r) => r.checkin_id === checkinId);
          const summary = new Map<string, { count: number; mine: boolean }>();
          for (const r of rows) {
            const cur = summary.get(r.emoji) ?? { count: 0, mine: false };
            cur.count += 1;
            if (r.user_id === user.id) cur.mine = true;
            summary.set(r.emoji, cur);
          }
          reactionsByUser.set(
            uid,
            Array.from(summary.entries()).map(([emoji, v]) => ({
              emoji,
              count: v.count,
              mine: v.mine,
            }))
          );
        }
      }
    }
  }

  // Historique du mois (heatmap) pour l'utilisateur
  const monthStart = `${month}-01`;
  const userMonthDates: string[] = [];
  {
    const { data, error } = await supabase
      .from("checkins")
      .select("date")
      .eq("user_id", user.id)
      .eq("group_id", id)
      .gte("date", monthStart);
    if (!error) {
      for (const c of (data ?? []) as { date: string }[]) {
        userMonthDates.push(c.date);
      }
    }
  }

  // Jokers de freeze du membre courant
  let freezesLeft: number = FREEZES_PER_MONTH;
  {
    const { data: myMembership } = await supabase
      .from("group_members")
      .select("freezes_left, freezes_month")
      .eq("user_id", user.id)
      .eq("group_id", id)
      .maybeSingle();
    if (myMembership) {
      freezesLeft =
        myMembership.freezes_month === month
          ? typeof myMembership.freezes_left === "number"
            ? myMembership.freezes_left
            : FREEZES_PER_MONTH
          : FREEZES_PER_MONTH;
    }
  }

  const members = rawMembers
    .map((m) => ({
      userId: m.user_id,
      name: m.display_name ?? "Membre",
      streak: m.streak_count,
      checkedToday: m.last_check_in === today,
      initials: initialsOf(m.display_name ?? "Membre"),
      todayCheckInId: todayCheckins.get(m.user_id),
      reactions: todayCheckins.has(m.user_id)
        ? reactionsByUser.get(m.user_id)
        : undefined,
    }))
    .sort((a, b) => b.streak - a.streak);

  const myMembership = rawMembers.find((m) => m.user_id === user.id);
  const myStreak = myMembership?.streak_count ?? 0;
  const myRank = myMembership
    ? members.findIndex((m) => m.userId === user.id) + 1
    : null;
  const checkedToday =
    today === (myMembership?.last_check_in ?? undefined);

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#0A0A10]">
      <div className="landing-halo left-[-140px] top-[-120px] size-[420px] bg-violet-600/25" />
      <div className="landing-halo bottom-[-160px] right-[-120px] size-[460px] bg-blue-600/20" />
      <div className="landing-grid pointer-events-none absolute inset-0" />

      <div className="relative">
        <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
          <BrandLogo />
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-sm text-[#A1A1AA] transition-colors hover:text-white"
          >
            <ChevronLeft className="size-4" />
            Accueil
          </Link>
        </header>

        <main className="flex flex-col items-center px-6 pb-20 pt-8">
          <GroupDetailView
            groupId={detail.id as string}
            name={detail.name as string}
            description={(detail.description as string | null) ?? null}
            category={(detail.category as string) ?? "autre"}
            frequency={(detail.frequency as string) ?? "daily"}
            durationDays={(detail.duration_days as number | null) ?? null}
            members={members}
            currentUserId={user.id}
            myStreak={myStreak}
            myRank={myRank}
            checkedToday={checkedToday}
            freezesLeft={freezesLeft}
            monthCells={buildMonthCells(userMonthDates, new Date())}
            nextBadge={nextBadge(myStreak)}
          />
        </main>
      </div>
    </div>
  );
}