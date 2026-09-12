"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  LogOut,
  Plus,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { logout } from "@/app/actions";
import GroupDetailView, {
  type GroupMemberView,
} from "@/components/group-detail-view";
import BadgeModal from "@/components/badge-modal";
import PaywallModal from "@/components/paywall-modal";

export type DashboardGroup = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  frequency: string;
  durationDays: number | null;
  members: GroupMemberView[];
  myStreak: number;
  myRank: number | null;
  checkedToday: boolean;
};

type DashboardShellProps = {
  userId: string;
  displayName: string;
  handle: string;
  initials: string;
  groups: DashboardGroup[];
  initialGroupId?: string;
  plan: string;
  badgeUnlocked?: boolean;
  paywallRequested?: boolean;
};

const cardVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function DashboardShell({
  userId,
  displayName,
  handle,
  initials,
  groups,
  initialGroupId,
  plan,
  badgeUnlocked = false,
  paywallRequested = false,
}: DashboardShellProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () =>
      typeof window === "undefined"
        ? false
        : window.matchMedia("(min-width: 1024px)").matches
  );

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const selectedGroup =
    groups.find(
      (g) => g.id === selectedGroupId || g.id === initialGroupId
    ) ??
    groups[0] ??
    null;

  // Plan gratuit : une seule groupe autorisé
  const isFree = plan !== "pro";
  const groupLimitReached = isFree && groups.length >= 1;

  // Modals badges / paywall
  const [showBadge, setShowBadge] = useState(badgeUnlocked);
  const [showPaywall, setShowPaywall] = useState(paywallRequested);

  // Nettoie les params d'URL une fois consommés
  useEffect(() => {
    if (badgeUnlocked || paywallRequested) {
      const params = new URLSearchParams();
      if (selectedGroup) params.set("group", selectedGroup.id);
      router.replace(`/dashboard${params.size ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
    }
  }, [badgeUnlocked, paywallRequested, selectedGroup, router]);

  const openPaywall = () => setShowPaywall(true);
  const closePaywall = () => setShowPaywall(false);

  const handleBadgeClose = () => {
    setShowBadge(false);
    if (isFree) setShowPaywall(true);
  };

  return (
    <div className="relative min-h-full bg-[#0A0A10]">
      {/* Backdrop (ferme la sidebar au clic) */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] transition-opacity"
        />
      )}

      {/* Barre latérale (tiroir overlay animé) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] border-r border-[#232334] bg-[#0C0C14] shadow-[8px_0_32px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-2 py-1"
          >
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_0_16px_rgba(139,92,246,0.4)]">
              <Zap className="size-4 text-white" fill="currentColor" />
            </span>
            <span className="font-display text-base font-bold text-white">
              WinterArc
            </span>
          </Link>

          <div className="mt-4 flex items-center justify-between px-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
              Mes groupes
            </p>
            {groupLimitReached ? (
              <button
                type="button"
                onClick={openPaywall}
                title="Passer au plan Pro pour rejoindre plus de groupes"
                className="text-[#A1A1AA] transition-colors hover:text-white"
              >
                <Plus className="size-4" />
              </button>
            ) : (
              <Link
                href="/groups"
                className="text-[#A1A1AA] transition-colors hover:text-white"
                title="Rejoindre un groupe"
              >
                <Plus className="size-4" />
              </Link>
            )}
          </div>

          <nav className="mt-2 flex flex-col gap-1">
            {groups.length === 0 && (
              <p className="px-2 py-2 text-sm text-[#A1A1AA]">
                Aucun groupe pour l&apos;instant.
              </p>
            )}
            {groups.map((g) => {
              const active = selectedGroup?.id === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? "border-[#3B82F6]/60 bg-[#151A24]"
                      : "border-transparent hover:bg-[#151A24]/60"
                  }`}
                >
                  <span className="flex-1 truncate text-sm font-medium text-[#F5F5F5]">
                    {g.name}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#9AA3B2]">
                    {g.myStreak} j
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 flex flex-col gap-2 border-t border-[#232334] pt-4">
            {groupLimitReached ? (
              <button
                type="button"
                onClick={openPaywall}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.3)] transition-all hover:from-violet-400 hover:to-blue-400"
              >
                <Plus className="size-4" />
                Créer un groupe
              </button>
            ) : (
              <Link
                href="/create"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.3)] transition-all hover:from-violet-400 hover:to-blue-400"
              >
                <Plus className="size-4" />
                Créer un groupe
              </Link>
            )}
            {groupLimitReached ? (
              <button
                type="button"
                onClick={openPaywall}
                className="flex items-center justify-center gap-2 rounded-full border border-[#3E3E4E] bg-[#12121B] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-blue-400/70 hover:bg-[#191926]"
              >
                <Users className="size-4" />
                Rejoindre un groupe
              </button>
            ) : (
              <Link
                href="/groups"
                className="flex items-center justify-center gap-2 rounded-full border border-[#3E3E4E] bg-[#12121B] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-blue-400/70 hover:bg-[#191926]"
              >
                <Users className="size-4" />
                Rejoindre un groupe
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
        <div className="landing-halo left-[-120px] top-[-100px] size-[380px] bg-violet-600/20" />
        <div className="landing-halo bottom-[-140px] right-[-120px] size-[360px] bg-blue-600/15" />
        <div className="landing-grid pointer-events-none absolute inset-0" />

        {/* Barre supérieure permanente */}
        <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-[#0A0A10]/70 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            {/* Toggle sidebar */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen((v) => !v)}
              aria-label="Ouvrir ou fermer la barre latérale"
              title="Barre latérale"
              className="flex size-9 items-center justify-center gap-1 rounded-[10px] border border-[#232334] bg-[#12121B] transition-colors hover:border-violet-400/70"
            >
              {isSidebarOpen ? (
                <span className="flex flex-col gap-[3px]">
                  <span className="h-px w-4 bg-[#A1A1AA]" />
                  <span className="h-px w-4 bg-[#A1A1AA]" />
                </span>
              ) : (
                <span className="flex gap-1">
                  <span className="size-1.5 rounded-full bg-[#A1A1AA]" />
                  <span className="size-1.5 rounded-full bg-[#A1A1AA]" />
                </span>
              )}
            </button>
            <Link
              href="/"
              className="hidden items-center gap-2 font-display text-base font-bold text-white sm:flex"
            >
              WinterArc
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="rounded-full border border-[#232334] bg-[#0F0F16]/70 px-3 py-1.5 text-xs text-[#A1A1AA]">
              @{handle}
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
              {initials}
            </span>
            <form action={logout}>
              <button
                type="submit"
                title="Se déconnecter"
                className="flex size-8 items-center justify-center rounded-[10px] border border-[#232334] bg-[#12121B] text-[#A1A1AA] transition-colors hover:text-red-300"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Zone principale */}
        <main className="relative flex flex-1 flex-col items-center px-4 py-10 sm:px-6 lg:px-10">
          {selectedGroup ? (
            <GroupDetailView
              groupId={selectedGroup.id}
              name={selectedGroup.name}
              description={selectedGroup.description}
              category={selectedGroup.category}
              frequency={selectedGroup.frequency}
              durationDays={selectedGroup.durationDays}
              members={selectedGroup.members}
              currentUserId={userId}
              myStreak={selectedGroup.myStreak}
              myRank={selectedGroup.myRank}
              checkedToday={selectedGroup.checkedToday}
            />
          ) : (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="flex w-full max-w-3xl flex-col items-center text-center"
            >
              <motion.span
                variants={cardItem}
                className="inline-flex items-center gap-2 rounded-full border border-[#232334] bg-[#0F0F16]/70 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#A1A1AA] backdrop-blur"
              >
                <Zap className="size-3.5 text-violet-400" fill="currentColor" />
                Étape 1 sur 2 : Configuration
              </motion.span>

              <motion.h1
                variants={cardItem}
                className="mt-6 font-display text-4xl font-bold tracking-tight text-white text-balance sm:text-5xl"
              >
                Bienvenue dans ton Winter Arc, {displayName} 👋
              </motion.h1>

              <motion.p
                variants={cardItem}
                className="mt-4 max-w-md text-[#A1A1AA] sm:text-lg"
              >
                Comment souhaites-tu commencer ton aventure aujourd&apos;hui ?
              </motion.p>

              <motion.div
                variants={cardItem}
                className="mt-10 grid w-full grid-cols-1 gap-5 md:grid-cols-2"
              >
                <Link
                  href="/create"
                  className="group flex flex-col rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-7 text-left backdrop-blur transition-all hover:border-violet-400/60 hover:shadow-[0_0_32px_rgba(139,92,246,0.18)]"
                >
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.4),transparent_70%)] blur-[6px]" />
                    <div className="flex size-12 items-center justify-center rounded-full border border-violet-400/40 bg-[#191926]">
                      <Target className="size-5 text-violet-400" />
                    </div>
                  </div>
                  <h2 className="mt-5 font-display text-xl font-bold tracking-tight text-white">
                    Créer un objectif personnel
                  </h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#A1A1AA]">
                    Définis tes métriques de discipline, tes rituels quotidiens
                    et tes règles pour ce Winter Arc.
                  </p>
                  <span className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all group-hover:from-violet-400 group-hover:to-blue-400">
                    Configurer mon objectif
                    <ArrowRight className="size-4" />
                  </span>
                </Link>

                <Link
                  href="/groups"
                  className="group flex flex-col rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-7 text-left backdrop-blur transition-all hover:border-blue-400/60 hover:shadow-[0_0_32px_rgba(59,130,246,0.18)]"
                >
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.4),transparent_70%)] blur-[6px]" />
                    <div className="flex size-12 items-center justify-center rounded-full border border-blue-400/40 bg-[#191926]">
                      <Users className="size-5 text-blue-400" />
                    </div>
                  </div>
                  <h2 className="mt-5 font-display text-xl font-bold tracking-tight text-white">
                    Rejoindre une escouade
                  </h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#A1A1AA]">
                    Reste redevable avec d&apos;autres membres, partage ta
                    progression et affronte le Winter Arc en équipe.
                  </p>
                  <span className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#3E3E4E] bg-[#12121B] px-5 py-3 text-sm font-semibold text-white transition-all group-hover:border-blue-400/70 group-hover:bg-[#191926]">
                    Trouver un groupe
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showBadge && <BadgeModal onClose={handleBadgeClose} />}
      {showPaywall && !showBadge && <PaywallModal onClose={closePaywall} />}
    </div>
  );
}