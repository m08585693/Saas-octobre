"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BatteryLow,
  BookOpen,
  Check,
  Dumbbell,
  Flame,
  RefreshCcw,
  Sprout,
  Target,
  Trophy,
  Waves,
  Zap,
} from "lucide-react";

type Option = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type Step = {
  question: string;
  options: Option[];
};

const STEPS: Step[] = [
  {
    question: "Ton objectif principal pour ce Winter Arc ?",
    options: [
      { id: "mass", label: "Prise de masse", icon: Dumbbell },
      { id: "cut", label: "Séche", icon: Flame },
      { id: "discipline", label: "Discipline", icon: Target },
    ],
  },
  {
    question: "Ton niveau actuel en nutrition ?",
    options: [
      { id: "beginner", label: "Je débute", icon: Sprout },
      { id: "intermediate", label: "Je me débrouille", icon: BookOpen },
      { id: "advanced", label: "Je suis rigoureux", icon: Trophy },
    ],
  },
  {
    question: "Ton niveau de motivation en ce moment ?",
    options: [
      { id: "low", label: "Au plus bas", icon: BatteryLow },
      { id: "wavy", label: "En dents de scie", icon: Waves },
      { id: "high", label: "Au top", icon: Zap },
    ],
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string[]>(() =>
    STEPS.map(() => "")
  );

  const finished = current >= STEPS.length;
  const choice = selected[current] ?? "";

  function select(id: string) {
    setSelected((prev) => {
      const next = [...prev];
      next[current] = id;
      return next;
    });
  }

  function next() {
    if (!choice) return;
    setCurrent((c) => c + 1);
  }

  function reset() {
    setSelected(STEPS.map(() => ""));
    setCurrent(0);
  }

  const progress = finished
    ? 100
    : ((current + 1) / STEPS.length) * 100;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-8 -z-10 rounded-[24px] bg-[radial-gradient(circle,rgba(124,58,237,0.18),transparent_65%)]" />

      <div className="rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-5 shadow-[0_0_40px_rgba(59,130,246,0.06)] backdrop-blur-xl sm:p-7">
        {/* Barre de progression */}
        <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-[#232334]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A1A1AA]">
            {finished
              ? "Ton plan Winter Arc"
              : `Question ${current + 1} / ${STEPS.length}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                {STEPS[current].question}
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {STEPS[current].options.map((opt) => {
                  const active = choice === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => select(opt.id)}
                      className={`group flex flex-col items-center gap-3 rounded-[12px] border px-4 py-5 text-center transition-all duration-150 ${
                        active
                          ? "border-violet-400/80 bg-[#191926] shadow-[0_0_24px_rgba(139,92,246,0.35)]"
                          : "border-[#232334] bg-[#12121B]/60 hover:border-[#3E3E4E] hover:bg-[#15151F]"
                      }`}
                    >
                      <Icon
                        className={`size-6 transition-colors ${
                          active
                            ? "text-violet-400"
                            : "text-[#A1A1AA] group-hover:text-white"
                        }`}
                        strokeWidth={2}
                      />
                      <span
                        className={`text-sm font-medium ${
                          active ? "text-white" : "text-[#A1A1AA]"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  disabled={current === 0}
                  className="rounded-full px-4 py-2.5 text-sm text-[#A1A1AA] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!choice}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:from-violet-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  {current === STEPS.length - 1 ? "Voir mon plan" : "Suivant"}
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                Ton Winter Arc est prêt.
              </h3>
              <p className="mt-2 text-sm text-[#A1A1AA]">
                Crée ton compte gratuit pour rejoindre un groupe qui suit le
                même plan et commence dès aujourd&apos;hui.
              </p>

              <ul className="mt-6 flex flex-col gap-2">
                {STEPS.map((step, i) => {
                  const opt = step.options.find((o) => o.id === selected[i]);
                  if (!opt) return null;
                  const Icon = opt.icon;
                  return (
                    <li
                      key={step.question}
                      className="flex items-center gap-3 rounded-[10px] border border-[#232334] bg-[#12121B]/60 px-4 py-3"
                    >
                      <span className="flex size-6 items-center justify-center rounded-full bg-violet-500/20">
                        <Icon className="size-3.5 text-violet-400" />
                      </span>
                      <span className="flex-1 truncate text-sm text-[#A1A1AA]">
                        {step.question}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                        <Check className="size-3.5 text-violet-400" />
                        {opt.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:from-violet-400 hover:to-blue-400"
                >
                  Créer mon compte gratuit
                  <ArrowRight className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#232334] px-6 py-3 text-sm text-[#A1A1AA] transition-colors hover:text-white"
                >
                  <RefreshCcw className="size-4" />
                  Recommencer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}