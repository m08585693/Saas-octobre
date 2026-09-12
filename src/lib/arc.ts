export const BADGE_TIERS = [7, 14, 30, 60, 100] as const;

export const BADGE_LABELS: Record<number, string> = {
  7: "7 jours",
  14: "14 jours",
  30: "30 jours",
  60: "60 jours",
  100: "100 jours",
};

export const FREEZES_PER_MONTH = 2;

export const REACTION_EMOJIS = ["🔥", "💪", "👏"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export function nextBadge(
  streak: number
): { threshold: number; daysLeft: number } | null {
  for (const t of BADGE_TIERS) {
    if (streak < t) return { threshold: t, daysLeft: t - streak };
  }
  return null;
}

export function streakFlame(streak: number): string {
  if (streak >= 30) return "🔥🔥";
  return "🔥";
}

export function flameClass(streak: number): string {
  if (streak >= 7) {
    return "drop-shadow-[0_0_8px_rgba(251,191,36,0.95)]";
  }
  return "opacity-90";
}

export function buildMonthCells(
  doneDates: string[],
  now: Date
): ({ day: number; done: boolean } | null)[] {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const first = new Date(Date.UTC(y, m, 1));
  const startOffset = (first.getUTCDay() + 6) % 7;
  const today = now.getUTCDate();
  const set = new Set(doneDates);

  const cells: ({ day: number; done: boolean } | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= today; d++) {
    const date = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, done: set.has(date) });
  }
  return cells;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}