"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Flame,
  LogOut,
  Plus,
  Settings,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { logout } from "@/app/actions";

type WelcomeScreenProps = {
  displayName: string;
  handle: string;
  initials: string;
};

export default function WelcomeScreen({
  displayName,
  handle,
  initials,
}: WelcomeScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.09 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <div className="flex min-h-full bg-[#0A0A10]">
      {/* Sidebar fine (style Discord) */}
      <aside className="hidden w-[76px] shrink-0 flex-col items-center gap-3 border-r border-[#232334] bg-[#0C0C14] py-5 sm:flex">
        <Link
          href="/"
          className="flex size-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_0_20px_rgba(139,92,246,0.45)]"
        >
          <Zap className="size-5 text-white" fill="currentColor" />
        </Link>

        <div className="h-px w-8 bg-[#232334]" />

        {/* Ronds d'avatars : groupes rejoints (décoratifs au onboarding) */}
        <div className="relative">
          <div className="flex size-10 items-center justify-center rounded-full border border-[#232334] bg-[#12121B]">
            <Zap className="size-4 text-amber-400" fill="currentColor" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#0C0C14] bg-emerald-400" />
        </div>

        <div className="relative">
          <div className="flex size-10 items-center justify-center rounded-full border border-[#232334] bg-[#12121B]">
            <Flame className="size-4 text-orange-400" fill="currentColor" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#0C0C14] bg-violet-400" />
        </div>

        <div className="flex-1" />

        {/* Ajouter / chercher un groupe */}
        <Link
          href="/groups"
          title="Ajouter ou chercher un groupe"
          className="flex size-10 items-center justify-center rounded-full border border-[#232334] bg-[#12121B] text-[#A1A1AA] transition-all hover:border-violet-400/70 hover:text-white hover:shadow-[0_0_16px_rgba(139,92,246,0.35)]"
        >
          <Plus className="size-4" />
        </Link>
      </aside>

      {/* Zone principale */}
      <main className="relative flex-1 overflow-hidden">
        {/* Halos */}
        <div className="landing-halo right-[-120px] top-[-100px] size-[380px] bg-violet-600/20" />
        <div className="landing-halo bottom-[-140px] left-[-100px] size-[360px] bg-blue-600/15" />

        {/* Header : avatar profil + pseudo */}
        <header className="relative flex items-center justify-end px-6 py-5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-full border border-[#232334] bg-[#0F0F16]/70 py-1.5 pl-1.5 pr-3 transition-colors hover:border-[#3E3E4E]"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
                {initials}
              </span>
              <span className="text-sm text-white">@{handle}</span>
              <ChevronDown
                className={`size-3.5 text-[#A1A1AA] transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-48 rounded-[12px] border border-[#232334] bg-[#0F0F16]/95 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur">
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-sm text-[#A1A1AA] transition-colors hover:bg-[#191926] hover:text-white"
                >
                  <Settings className="size-4" />
                  Réglages
                  <span className="ml-auto rounded-full border border-[#232334] px-1.5 py-0.5 text-[10px] text-[#A1A1AA]">
                    bientôt
                  </span>
                </button>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-sm text-[#A1A1AA] transition-colors hover:bg-[#191926] hover:text-red-300"
                  >
                    <LogOut className="size-4" />
                    Se déconnecter
                  </button>
                </form>
              </div>
            )}
          </div>
        </header>

        {/* Contenu central */}
        <div className="relative flex flex-col items-center px-6 pb-16 pt-6 sm:pt-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex w-full max-w-3xl flex-col items-center text-center"
          >
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-[#232334] bg-[#0F0F16]/70 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#A1A1AA] shadow-[0_0_16px_rgba(139,92,246,0.15)] backdrop-blur"
            >
              <Zap className="size-3.5 text-violet-400" fill="currentColor" />
              Étape 1 sur 2 : Configuration
            </motion.span>

            <motion.h1
              variants={item}
              className="mt-6 font-display text-4xl font-bold tracking-tight text-white text-balance sm:text-5xl"
            >
              Bienvenue dans ton Winter Arc, {displayName} 👋
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-4 max-w-md text-[#A1A1AA] sm:text-lg"
            >
              Comment souhaites-tu commencer ton aventure aujourd&apos;hui ?
            </motion.p>

            {/* Les 2 cartes de choix */}
            <motion.div
              variants={item}
              className="mt-10 grid w-full grid-cols-1 gap-5 md:grid-cols-2"
            >
              {/* Carte 1 : Créer ton objectif */}
              <div className="group flex flex-col rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-7 text-left backdrop-blur transition-all hover:border-violet-400/60 hover:shadow-[0_0_32px_rgba(139,92,246,0.18)]">
                <div className="relative inline-flex">
                  <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.4),transparent_70%)] blur-[6px]" />
                  <div className="flex size-12 items-center justify-center rounded-full border border-violet-400/40 bg-[#191926]">
                    <Target className="size-5 text-violet-400" />
                  </div>
                </div>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#A1A1AA]">
                  Créer ton objectif
                </p>
                <h2 className="mt-1.5 font-display text-xl font-bold tracking-tight text-white">
                  Créer un objectif personnel
                </h2>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#A1A1AA]">
                  Définis tes métriques de discipline, tes rituels quotidiens
                  et tes règles pour ce Winter Arc.
                </p>
                <Link
                  href="/create"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:from-violet-400 hover:to-blue-400"
                >
                  Configurer mon objectif
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              {/* Carte 2 : Rejoindre un groupe */}
              <div className="group flex flex-col rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-7 text-left backdrop-blur transition-all hover:border-blue-400/60 hover:shadow-[0_0_32px_rgba(59,130,246,0.18)]">
                <div className="relative inline-flex">
                  <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.4),transparent_70%)] blur-[6px]" />
                  <div className="flex size-12 items-center justify-center rounded-full border border-blue-400/40 bg-[#191926]">
                    <Users className="size-5 text-blue-400" />
                  </div>
                </div>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#A1A1AA]">
                  Rejoindre un groupe
                </p>
                <h2 className="mt-1.5 font-display text-xl font-bold tracking-tight text-white">
                  Rejoindre une escouade
                </h2>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#A1A1AA]">
                  Reste redevable avec d&apos;autres membres, partage ta
                  progression et affronte le Winter Arc en équipe.
                </p>
                <Link
                  href="/groups"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#3E3E4E] bg-[#12121B] px-5 py-3 text-sm font-semibold text-white transition-all hover:border-blue-400/70 hover:bg-[#191926] hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                >
                  Trouver un groupe
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}