"use client";

import {
  CalendarDays,
  Flame,
  Medal,
  Users,
} from "lucide-react";
import { checkIn } from "@/app/group-actions";

export type GroupMemberView = {
  userId: string;
  name: string;
  streak: number;
};

export type GroupDetailViewProps = {
  groupId: string;
  name: string;
  description: string | null;
  category: string;
  frequency: string;
  durationDays: number | null;
  members: GroupMemberView[];
  currentUserId: string;
  myStreak: number;
  myRank: number | null;
  checkedToday: boolean;
};

const CATEGORY_LABELS: Record<string, string> = {
  sport: "Sport",
  discipline: "Discipline",
  sommeil: "Sommeil",
  nutrition: "Nutrition",
  lecture: "Lecture",
  ecrans: "Écrans",
  autre: "Autre",
};

export default function GroupDetailView({
  groupId,
  name,
  description,
  category,
  frequency,
  durationDays,
  members,
  currentUserId,
  myStreak,
  myRank,
  checkedToday,
}: GroupDetailViewProps) {
  const categoryLabel = CATEGORY_LABELS[category] ?? "Autre";
  const frequencyLabel =
    frequency === "daily" ? "Tous les jours" : `Jours : ${frequency}`;

  return (
    <div className="w-full max-w-2xl">
      {/* En-tête du groupe */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">
          {name}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[#A1A1AA]">{description}</p>
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
            {durationDays ?? 30} jours
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-[#232334] bg-[#12121B] px-3 py-1">
            <Users className="size-3.5" />
            {members.length} membre{members.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Stats personnelles */}
      <div className="mt-8 grid grid-cols-2 gap-4">
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
            const isMe = m.userId === currentUserId;
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
        <input type="hidden" name="groupId" value={groupId} />
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
    </div>
  );
}