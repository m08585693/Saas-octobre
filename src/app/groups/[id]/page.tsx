import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  Flame,
  Medal,
  Users,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { checkIn } from "@/app/group-actions";

const CATEGORY_LABELS: Record<string, string> = {
  sport: "Sport",
  discipline: "Discipline",
  sommeil: "Sommeil",
  nutrition: "Nutrition",
  lecture: "Lecture",
  ecrans: "Écrans",
  autre: "Autre",
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

  const categoryLabel = CATEGORY_LABELS[detail.category as string] ?? "Autre";
  const frequencyLabel =
    detail.frequency === "daily" ? "Tous les jours" : `Jours : ${detail.frequency}`;

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

        <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-8">
          {/* En-tête du groupe */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white">
                {detail.name as string}
              </h1>
              {detail.description && (
                <p className="mt-1 text-sm text-[#A1A1AA]">
                  {detail.description as string}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#A1A1AA]">
                <span className="rounded-full border border-[#232334] bg-[#12121B] px-3 py-1">
                  {categoryLabel}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-[#232334] bg-[#12121B] px-3 py-1">
                  <CalendarDays className="size-3.5" />
                  {frequencyLabel}
                </span>
                <span className="rounded-full border border-[#232334] bg-[#12121B] px-3 py-1">
                  {detail.duration_days ?? 30} jours
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-[#232334] bg-[#12121B] px-3 py-1">
                  <Users className="size-3.5" />
                  {members.length} membre{members.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Stats personnelles */}
          <div className="mt-8 grid max-w-lg grid-cols-2 gap-4">
            <div className="rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-5 backdrop-blur">
              <p className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                <Flame className="size-3.5 text-orange-400" />
                Ton streak
              </p>
              <p className="mt-1.5 font-display text-3xl font-bold text-white">
                {myStreak} <span className="text-lg text-[#A1A1AA]">jours</span>
              </p>
            </div>
            <div className="rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-5 backdrop-blur">
              <p className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                <Medal className="size-3.5 text-blue-400" />
                Ton rang
              </p>
              <p className="mt-1.5 font-display text-3xl font-bold text-white">
                {myRank ? `#${myRank}` : "—"}{" "}
                <span className="text-lg text-[#A1A1AA]">
                  {myRank ? `/ ${members.length}` : ""}
                </span>
              </p>
            </div>
          </div>

          {/* Classement */}
          <div className="mt-6 rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-2 backdrop-blur">
            <ul className="flex flex-col gap-1">
              {members.map((m, i) => {
                const isMe = m.userId === user.id;
                return (
                  <li
                    key={`${m.userId}-${i}`}
                    className={`flex items-center gap-4 rounded-[12px] px-4 py-3 ${
                      isMe
                        ? "bg-gradient-to-r from-violet-500/15 to-blue-500/15"
                        : "bg-[#0F0F16]"
                    }`}
                  >
                    <span className="w-6 text-center font-mono text-xs text-[#A1A1AA]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-medium text-white">
                      {isMe ? "Toi" : m.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-[#A1A1AA]">
                      <Flame className="size-3.5 text-orange-400" />
                      {m.streak} j
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Check-in */}
          <form action={checkIn} className="mt-6">
            <input type="hidden" name="groupId" value={detail.id as string} />
            <button
              type="submit"
              disabled={checkedToday}
              className="w-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:from-violet-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {checkedToday
                ? "Check-in effectué aujourd'hui ✓"
                : "Check-in — valider ta journée"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}