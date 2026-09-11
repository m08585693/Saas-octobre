"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Flag,
  Sparkles,
  Zap,
} from "lucide-react";
import { createGroup } from "@/app/group-actions";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const CATEGORIES = [
  { value: "", label: "Choisir une catégorie" },
  { value: "sport", label: "Sport" },
  { value: "discipline", label: "Discipline" },
  { value: "sommeil", label: "Sommeil" },
  { value: "nutrition", label: "Nutrition" },
  { value: "lecture", label: "Lecture" },
  { value: "ecrans", label: "Écrans" },
  { value: "autre", label: "Autre" },
];

const WEEK_DAYS = [
  { value: "lun", label: "L" },
  { value: "mar", label: "M" },
  { value: "mer", label: "M" },
  { value: "jeu", label: "J" },
  { value: "ven", label: "V" },
  { value: "sam", label: "S" },
  { value: "dim", label: "D" },
];

const DURATIONS = [30, 60, 90];

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:from-violet-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
    >
      {pending ? "Création..." : "Créer mon groupe"}
      <ArrowRight className="size-4" />
    </button>
  );
}

export default function CreateObjectiveForm() {
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "">("");
  const [days, setDays] = useState<string[]>([]);
  const [duration, setDuration] = useState<number | null>(null);

  const canSubmit =
    category !== "" &&
    frequency !== "" &&
    duration !== null &&
    (frequency === "daily" || days.length > 0);

  function toggleDay(day: string) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative w-full max-w-lg"
    >
      <div className="absolute -inset-8 -z-10 rounded-[24px] bg-[radial-gradient(circle,rgba(124,58,237,0.16),transparent_65%)]" />

      <motion.div
        variants={item}
        className="rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-7 shadow-[0_0_40px_rgba(59,130,246,0.06)] backdrop-blur-md transition-all hover:shadow-[0_0_48px_rgba(139,92,246,0.14)] sm:p-9"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-[#232334] bg-[#12121B] px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#A1A1AA]">
          <Sparkles className="size-3.5 text-violet-400" />
          Créer ton objectif
        </span>

        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white">
          Définis ton défi
        </h1>
        <p className="mt-2 text-sm text-[#A1A1AA]">
          Un objectif clair, des règles simples. Ton groupe se crée avec toi
          comme premier membre.
        </p>

        <form action={createGroup} className="mt-7 flex flex-col gap-5">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-[#A1A1AA]">
              Nom de l&apos;objectif
            </label>
            <div className="relative">
              <Flag className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#A1A1AA]" />
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="ex: Réveil à 6h"
                className="w-full rounded-[12px] border border-[#232334] bg-[#12121C] py-3 pl-10 pr-4 text-sm text-white transition-all placeholder:text-[#A1A1AA]/50 focus:border-violet-400/70 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.30),0_0_16px_rgba(139,92,246,0.12)] focus:outline-none"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm text-[#A1A1AA]"
            >
              Catégorie
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full appearance-none rounded-[12px] border border-[#232334] bg-[#12121C] py-3 pl-4 pr-10 text-sm text-white transition-all focus:border-violet-400/70 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.30),0_0_16px_rgba(139,92,246,0.12)] focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#A1A1AA]" />
            </div>
          </div>

          {/* Fréquence */}
          <div>
            <span className="mb-2 block text-sm text-[#A1A1AA]">
              Fréquence du check-in
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFrequency("daily")}
                className={`rounded-[12px] border py-2.5 text-sm font-medium transition-all ${
                  frequency === "daily"
                    ? "border-violet-400/70 bg-[#191926] text-white shadow-[0_0_16px_rgba(139,92,246,0.25)]"
                    : "border-[#232334] bg-[#12121B] text-[#A1A1AA] hover:border-[#3E3E4E]"
                }`}
              >
                Tous les jours
              </button>
              <button
                type="button"
                onClick={() => setFrequency("weekly")}
                className={`rounded-[12px] border py-2.5 text-sm font-medium transition-all ${
                  frequency === "weekly"
                    ? "border-violet-400/70 bg-[#191926] text-white shadow-[0_0_16px_rgba(139,92,246,0.25)]"
                    : "border-[#232334] bg-[#12121B] text-[#A1A1AA] hover:border-[#3E3E4E]"
                }`}
              >
                Jours choisis
              </button>
            </div>
            <input
              type="hidden"
              name="frequency"
              value={frequency}
            />
          </div>

          {/* Jours de la semaine */}
          {frequency === "weekly" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.25 }}
            >
              <span className="mb-2 block text-sm text-[#A1A1AA]">
                Jours de la semaine
              </span>
              <div className="grid grid-cols-7 gap-1.5">
                {WEEK_DAYS.map((d) => {
                  const active = days.includes(d.value);
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => toggleDay(d.value)}
                      className={`flex h-10 items-center justify-center rounded-[10px] border text-sm font-semibold transition-all ${
                        active
                          ? "border-violet-400/70 bg-[#191926] text-white shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                          : "border-[#232334] bg-[#12121B] text-[#A1A1AA] hover:border-[#3E3E4E]"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
          {frequency === "weekly" &&
            days.map((d) => (
              <input key={d} type="hidden" name="days" value={d} />
            ))}

          {/* Durée */}
          <div>
            <span className="mb-2 block text-sm text-[#A1A1AA]">
              Durée du défi
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`rounded-[12px] border py-2.5 text-sm font-semibold transition-all ${
                    duration === d
                      ? "border-blue-400/70 bg-[#191926] text-white shadow-[0_0_16px_rgba(59,130,246,0.25)]"
                      : "border-[#232334] bg-[#12121B] text-[#A1A1AA] hover:border-[#3E3E4E]"
                  }`}
                >
                  {d} j
                </button>
              ))}
            </div>
            <input type="hidden" name="duration" value={duration ?? ""} />
          </div>

          <SubmitButton disabled={!canSubmit} />
        </form>
      </motion.div>
    </motion.div>
  );
}