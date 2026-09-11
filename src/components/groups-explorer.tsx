"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Users } from "lucide-react";
import { joinGroup } from "@/app/group-actions";

type GroupRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  avgStreak: number;
};

const CATEGORIES: { value: string; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "sport", label: "Sport" },
  { value: "discipline", label: "Discipline" },
  { value: "sommeil", label: "Sommeil" },
  { value: "nutrition", label: "Nutrition" },
  { value: "lecture", label: "Lecture" },
  { value: "ecrans", label: "Écrans" },
  { value: "autre", label: "Autre" },
];

export default function GroupsExplorer({
  rows,
  joinedIds,
}: {
  rows: GroupRow[];
  joinedIds: string[];
}) {
  const [filter, setFilter] = useState("toutes");

  const filtered =
    filter === "toutes"
      ? rows
      : rows.filter((g) => g.category === filter);

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#232334] bg-[#0F0F16]/70 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#A1A1AA]">
            <Users className="size-3.5 text-blue-400" />
            Rejoindre une escouade
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white">
            Trouve ton groupe
          </h1>
          <p className="mt-2 text-sm text-[#A1A1AA]">
            Reste redevable avec d&apos;autres membres et tiens bon jusqu&apos;au
            bout.
          </p>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = filter === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                active
                  ? "border-violet-400/70 bg-[#191926] text-white shadow-[0_0_14px_rgba(139,92,246,0.25)]"
                  : "border-[#232334] bg-[#12121B] text-[#A1A1AA] hover:border-[#3E3E4E] hover:text-white"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Liste */}
      <motion.div
        key={filter}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-3"
      >
        {filtered.map((g) => {
          const joined = joinedIds.includes(g.id);
          return (
            <div
              key={g.id}
              className="flex items-center gap-4 rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 px-5 py-4 backdrop-blur transition-all hover:border-[#3E3E4E]"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{g.name}</p>
                {g.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-[#A1A1AA]">
                    {g.description}
                  </p>
                )}
                <p className="mt-1.5 flex items-center gap-3 text-xs text-[#A1A1AA]">
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    {g.memberCount} membre{g.memberCount > 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="size-3.5 text-orange-400" />
                    streak moyen {g.avgStreak} j
                  </span>
                </p>
              </div>

              {joined ? (
                <Link
                  href={`/groups/${g.id}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#3E3E4E] bg-[#12121B] px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-violet-400/70 hover:shadow-[0_0_14px_rgba(139,92,246,0.2)]"
                >
                  Rejoint ✓
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <form action={joinGroup}>
                  <input type="hidden" name="groupId" value={g.id} />
                  <button
                    type="submit"
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#3E3E4E] bg-[#12121B] px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-blue-400/70 hover:bg-[#191926] hover:shadow-[0_0_14px_rgba(59,130,246,0.25)]"
                  >
                    Rejoindre
                    <ArrowRight className="size-4" />
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div className="rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 px-6 py-10 text-center">
          <p className="text-sm text-[#A1A1AA]">
            Aucun groupe dans cette catégorie pour l&apos;instant.
          </p>
          <Link
            href="/create"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.3)] transition-all hover:from-violet-400 hover:to-blue-400"
          >
            Créer le tien
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}