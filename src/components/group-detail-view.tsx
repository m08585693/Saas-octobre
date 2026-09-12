"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  CalendarDays,
  Gift,
  Medal,
  Share2,
  Snowflake,
  Users,
} from "lucide-react";
import { checkIn } from "@/app/group-actions";
import { REACTION_EMOJIS, flameClass, streakFlame } from "@/lib/arc";

export type ReactionSummary = {
  emoji: string;
  count: number;
  mine: boolean;
};

export type GroupMemberView = {
  userId: string;
  name: string;
  streak: number;
  checkedToday: boolean;
  initials: string;
  todayCheckInId?: string;
  reactions?: ReactionSummary[];
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
  freezesLeft?: number;
  monthCells?: ({ day: number; done: boolean } | null)[];
  nextBadge?: { threshold: number; daysLeft: number } | null;
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

const PODIUM = ["🥇", "🥈", "🥉"];

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
  freezesLeft,
  monthCells,
  nextBadge,
}: GroupDetailViewProps) {
  const categoryLabel = CATEGORY_LABELS[category] ?? "Autre";
  const frequencyLabel =
    frequency === "daily" ? "Tous les jours" : `Jours : ${frequency}`;

  const [inviteUrl] = useState(() =>
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/invite/${currentUserId}`
  );
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  function getInviteUrl() {
    if (inviteUrl) return inviteUrl;
    return `${window.location.origin}/invite/${currentUserId}`;
  }

  useEffect(() => {
    if (!copied && !shared) return;
    const t = setTimeout(() => {
      setCopied(false);
      setShared(false);
    }, 2200);
    return () => clearTimeout(t);
  }, [copied, shared]);

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(getInviteUrl());
      setCopied(true);
    } catch {
      // Presse-papier indisponible : on ignore
    }
  }

  async function shareInvite() {
    const url = getInviteUrl();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: name,
          text: `Rejoins mon Winter Arc « ${name} » : restons disciplinés ensemble.`,
          url,
        });
        setShared(true);
      } catch {
        // Partager annulé par l'utilisateur : on ignore
      }
    } else {
      await copyInvite();
    }
  }

  // Countdown de reset du check-in quotidien
  const [resetIn, setResetIn] = useState("");

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0);
      const ms = Math.max(0, next.getTime() - now.getTime());
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      setResetIn(
        `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`
      );
    };
    fmt();
    const iv = setInterval(fmt, 60_000);
    return () => clearInterval(iv);
  }, []);

  // Réactions : état local synchronisé par remontage (key) du composant
  const [membersState, setMembersState] = useState(members);

  async function toggleReaction(checkinId: string, emoji: string) {
    const res = await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkinId, emoji }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as { action?: string };
    setMembersState((prev) =>
      prev.map((m) => {
        if (m.todayCheckInId !== checkinId) return m;
        const reactions = m.reactions ?? [];
        if (data.action === "removed") {
          return {
            ...m,
            reactions: reactions
              .map((r) =>
                r.emoji === emoji
                  ? { ...r, count: Math.max(0, r.count - 1), mine: false }
                  : r
              )
              .filter((r) => r.count > 0 || r.mine),
          };
        }
        const existing = reactions.find((r) => r.emoji === emoji);
        if (existing) {
          return {
            ...m,
            reactions: reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r
            ),
          };
        }
        return {
          ...m,
          reactions: [...reactions, { emoji, count: 1, mine: true }],
        };
      })
    );
  }

  // Toast temps réel : un membre vient de faire son check-in
  const [activityToast, setActivityToast] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const lastSeenRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastSeenRef.current === null) {
      lastSeenRef.current = new Date().toISOString();
    }
    let alive = true;
    const shown = new Set<string>();
    const tick = async () => {
      try {
        const since = lastSeenRef.current!;
        const res = await fetch(
          `/api/activity?groupId=${encodeURIComponent(groupId)}&after=${encodeURIComponent(since)}`,
          { cache: "no-store" }
        );
        if (!res.ok || !alive) return;
        const data = (await res.json()) as {
          events: { id: string; name: string; createdAt: string }[];
        };
        const events = data.events ?? [];
        for (const ev of events) {
          if (!shown.has(ev.id)) {
            shown.add(ev.id);
            setActivityToast({ id: ev.id, name: ev.name });
          }
        }
        if (events.length > 0) {
          lastSeenRef.current = events[events.length - 1].createdAt;
        }
      } catch {
        // Réseau indisponible : on retentera au prochain tick
      }
    };
    tick();
    const iv = setInterval(tick, 15_000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [groupId]);

  useEffect(() => {
    if (!activityToast) return;
    const t = setTimeout(() => setActivityToast(null), 4000);
    return () => clearTimeout(t);
  }, [activityToast]);

  const doneCount = (monthCells ?? []).filter((c) => c?.done).length;
  const todayCount = (monthCells ?? []).filter((c) => c !== null).length;

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
            <span className={`text-base leading-none ${flameClass(myStreak)}`}>
              {streakFlame(myStreak)}
            </span>
            Ton streak
          </p>
          <p className="mt-1.5 font-display text-3xl font-bold text-white">
            {myStreak} <span className="text-lg text-[#A1A1AA]">jours</span>
          </p>
          {typeof freezesLeft === "number" && (
            <p
              className="mt-2 flex items-center gap-1.5 text-xs text-[#A1A1AA]"
              title="Un joker saute automatiquement le check-in manqué sans casser ta série."
            >
              <Snowflake className="size-3.5 text-sky-400" />
              Jokers : {freezesLeft}{" "}
              <span className="text-[#71717A]">/2</span>
            </p>
          )}
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
        <div className="mb-2 flex items-center justify-end gap-4 px-2 pt-1 text-[11px] text-[#71717A]">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400" />
            Check-in fait
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-orange-400" />
            En attente
          </span>
        </div>
        <ul className="flex flex-col gap-1">
          {membersState.map((m, i) => {
            const isMe = m.userId === currentUserId;
            const reactions = m.reactions ?? [];
            return (
              <li
                key={`${m.userId}-${i}`}
                className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-[12px] px-4 py-3 ${
                  isMe
                    ? "bg-gradient-to-r from-violet-500/15 to-blue-500/15"
                    : "bg-[#0F0F16]"
                }`}
              >
                <span className="w-6 text-center font-mono text-xs text-[#A1A1AA]">
                  {i < 3 ? (
                    <span className="font-sans text-base leading-none">
                      {PODIUM[i]}
                    </span>
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-[10px] font-bold text-white">
                  {m.initials}
                </span>
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      m.checkedToday
                        ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]"
                        : "bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.9)]"
                    }`}
                    title={m.checkedToday ? "Check-in fait" : "En attente"}
                  />
                  <span className="truncate text-sm font-medium text-white">
                    {isMe ? "Toi" : m.name}
                  </span>
                </span>
                {m.todayCheckInId && (
                  <div className="flex items-center gap-1">
                    {REACTION_EMOJIS.map((emoji) => {
                      const meta =
                        reactions.find((r) => r.emoji === emoji) ?? {
                          count: 0,
                          mine: false,
                        };
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() =>
                            toggleReaction(m.todayCheckInId!, emoji)
                          }
                          aria-label={`Réagir ${emoji}`}
                          title={
                            meta.mine
                              ? `Retirer ${emoji}`
                              : `Réagir ${emoji}`
                          }
                          className={`flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs transition-colors ${
                            meta.mine
                              ? "border-violet-400/60 bg-violet-400/15"
                              : "border-[#232334] bg-[#12121B]/70 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <span>{emoji}</span>
                          {meta.count > 0 && (
                            <span className="font-semibold text-[#A1A1AA]">
                              {meta.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-[#A1A1AA]">
                  <span className={flameClass(m.streak)}>
                    {streakFlame(m.streak)}
                  </span>
                  {m.streak} j
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Prochain badge */}
      {nextBadge && (
        <div className="mt-3 flex items-center justify-between rounded-[14px] border border-amber-400/25 bg-[#12121B] px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm text-[#A1A1AA]">
            <Award className="size-4 text-amber-400" />
            Prochain badge · {nextBadge.threshold} jours
          </span>
          <span className="text-sm font-semibold text-amber-300">
            dans {nextBadge.daysLeft} jour{nextBadge.daysLeft > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Heatmap du mois en cours */}
      {monthCells && monthCells.length > 0 && (
        <div className="mt-4 rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A1A1AA]">
              Ce mois-ci
            </p>
            <p className="text-[11px] text-[#71717A]">
              {doneCount}/{todayCount} jours
            </p>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {monthCells.map((cell, i) =>
              cell ? (
                <span
                  key={i}
                  className={`flex aspect-square items-center justify-center rounded-[6px] text-[10px] font-semibold ${
                    cell.done
                      ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                      : "border border-[#232334] bg-[#12121B] text-[#71717A]"
                  }`}
                >
                  {cell.day}
                </span>
              ) : (
                <span key={i} />
              )
            )}
          </div>
        </div>
      )}

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
        {checkedToday && (
          <p className="mt-2 text-center text-xs text-[#71717A]">
            Reset dans {resetIn}
          </p>
        )}
      </form>

      {/* Invitation */}
      <div className="mt-5 rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-5 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A1A1AA]">
          Inviter des amis
        </p>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          Copie ton lien unique et partage le Winter Arc avec ton entourage.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={copyInvite}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#3E3E4E] bg-[#12121B] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-violet-400/70 hover:bg-[#191926]"
          >
            <Gift className="size-4 text-violet-400" />
            {copied ? "Lien copié !" : "Copier mon lien d'invitation"}
          </button>
          <button
            type="button"
            onClick={shareInvite}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all hover:from-violet-400 hover:to-blue-400"
          >
            <Share2 className="size-4" />
            Partager mon lien d&apos;invitation
          </button>
        </div>
      </div>

      {/* Toasts copie / partage / activité */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
          >
            <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-emerald-500/30 bg-[#12121B] px-4 py-2.5 text-sm font-semibold text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.25)]">
              <Gift className="size-4" />
              Lien d&apos;invitation copié !
            </span>
          </motion.div>
        )}
        {shared && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
          >
            <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-blue-500/30 bg-[#12121B] px-4 py-2.5 text-sm font-semibold text-blue-300 shadow-[0_0_24px_rgba(59,130,246,0.25)]">
              <Share2 className="size-4" />
              Lien d&apos;invitation partagé !
            </span>
          </motion.div>
        )}
        {activityToast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 left-1/2 z-[60] -translate-x-1/2"
          >
            <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-violet-500/30 bg-[#12121B] px-4 py-2.5 text-sm font-semibold text-violet-300 shadow-[0_0_24px_rgba(139,92,246,0.25)]">
              {activityToast.name} a fait son check-in 🔥
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}