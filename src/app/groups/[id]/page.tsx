import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import GroupDetailView from "@/components/group-detail-view";

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

  const members = (detail.group_members ?? [])
    .map((m) => ({
      userId: m.user_id as string,
      name: m.display_name ?? "Membre",
      streak: m.streak_count as number,
      lastCheckIn: m.last_check_in as string | null,
    }))
    .sort((a, b) => b.streak - a.streak);

  const myMembership = members.find((m) => m.userId === user.id);
  const myStreak = myMembership?.streak ?? 0;
  const myRank = myMembership
    ? members.findIndex((m) => m.userId === user.id) + 1
    : null;
  const checkedToday =
    new Date().toISOString().slice(0, 10) === myMembership?.lastCheckIn;

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#0A0A10]">
      <div className="landing-halo left-[-140px] top-[-120px] size-[420px] bg-violet-600/25" />
      <div className="landing-halo bottom-[-160px] right-[-120px] size-[460px] bg-blue-600/20" />
      <div className="landing-grid pointer-events-none absolute inset-0" />

      <div className="relative">
        <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_0_16px_rgba(139,92,246,0.4)]">
              <Zap className="size-4 text-white" fill="currentColor" />
            </span>
            <span className="font-display text-base font-bold text-white">
              WinterArc
            </span>
          </Link>
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
            members={members.map((m) => ({
              userId: m.userId,
              name: m.name,
              streak: m.streak,
            }))}
            currentUserId={user.id}
            myStreak={myStreak}
            myRank={myRank}
            checkedToday={checkedToday}
          />
        </main>
      </div>
    </div>
  );
}