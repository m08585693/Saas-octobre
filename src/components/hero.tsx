"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-24 pt-14 sm:pt-20">
      {/* Contenu — apparition globale */}
      {reduce ? (
        <div className="relative flex flex-col items-center text-center">
          <Title />
          <Subtitle />
          <Cta />
        </div>
      ) : (
        <motion.div
          className="relative flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Title />
          <Subtitle />
          <Cta />
        </motion.div>
      )}
    </section>
  );
}

function Title() {
  return (
    <h1 className="text-balance font-display text-3xl font-normal leading-tight tracking-tight text-slate-300 sm:text-5xl md:text-6xl">
      Ton{" "}
      <span className="font-extrabold text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]">
        winter arc
      </span>
      , pas tout seul.
    </h1>
  );
}

function Subtitle() {
  return (
    <p className="mx-auto mt-4 max-w-xl text-center text-base text-slate-400 sm:text-lg">
      Rejoins un groupe de 15 personnes qui visent le même objectif que toi.
    </p>
  );
}

function Cta() {
  return (
    <Link
      href="/register"
      className="mt-8 inline-block rounded-md bg-[#3B82F6] px-7 py-3 text-base font-semibold text-white transition-all hover:bg-blue-600 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E17]"
    >
      Rejoindre un groupe
    </Link>
  );
}