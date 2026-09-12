"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const NODES: [number, number][] = [
  [60, 90],
  [140, 210],
  [110, 340],
  [250, 100],
  [280, 230],
  [230, 370],
  [410, 70],
  [440, 210],
  [410, 350],
  [570, 130],
  [600, 270],
  [530, 390],
  [710, 80],
  [750, 230],
  [830, 310],
  [860, 150],
];

const LINKS: [number, number][] = [
  [0, 1],
  [0, 3],
  [1, 4],
  [1, 2],
  [2, 5],
  [3, 4],
  [3, 6],
  [4, 5],
  [4, 7],
  [5, 8],
  [6, 7],
  [6, 9],
  [7, 8],
  [7, 10],
  [8, 11],
  [9, 10],
  [9, 12],
  [10, 11],
  [10, 13],
  [11, 14],
  [12, 13],
  [13, 14],
  [14, 15],
];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center overflow-hidden px-6 pb-24 pt-14 sm:pt-20">
      {/* Réseau de groupe (fond) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={reduce ? undefined : { opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 900 420"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <radialGradient id="heroNodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {LINKS.map(([a, b], i) => {
            const [x1, y1] = NODES[a];
            const [x2, y2] = NODES[b];
            return (
              <line
                key={`l-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#3B82F6"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
            );
          })}

          {NODES.map(([x, y], i) => (
            <g key={`n-${i}`}>
              <circle cx={x} cy={y} r="30" fill="url(#heroNodeGlow)" />
              <circle
                cx={x}
                cy={y}
                r={i % 3 === 0 ? 3.5 : 2.5}
                fill={i % 3 === 0 ? "#3B82F6" : "#151A24"}
                fillOpacity={i % 3 === 0 ? 0.55 : 0.7}
              />
            </g>
          ))}
        </svg>
      </motion.div>

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