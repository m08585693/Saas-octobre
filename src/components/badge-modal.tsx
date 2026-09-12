"use client";

import { motion } from "framer-motion";
import { Award, X } from "lucide-react";

type BadgeModalProps = {
  onClose: () => void;
};

export default function BadgeModal({ onClose }: BadgeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-full max-w-sm overflow-hidden rounded-[16px] border border-amber-400/30 bg-[#12121B] p-8 text-center shadow-[0_0_60px_rgba(251,191,36,0.18)]"
      >
        <div className="absolute -inset-10 -z-10 bg-[radial-gradient(circle,rgba(251,191,36,0.22),transparent_65%)]" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-[10px] border border-[#232334] bg-[#181824] text-[#A1A1AA] transition-colors hover:text-white"
        >
          <X className="size-4" />
        </button>

        <motion.div
          initial={{ rotate: -14, scale: 0.6 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.15 }}
          className="mx-auto flex size-20 items-center justify-center rounded-full border border-amber-400/40 bg-[#1C1C10] shadow-[0_0_32px_rgba(251,191,36,0.35)]"
        >
          <Award className="size-10 text-amber-400" />
        </motion.div>

        <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
          Badge débloqué !
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">
          Tu viens de valider{" "}
          <span className="font-semibold text-amber-400">7 jours</span>{" "}
          consécutifs. Ta discipline commence à faire des étincelles 🏆
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:from-violet-400 hover:to-blue-400"
        >
          Continuer
        </button>
      </motion.div>
    </div>
  );
}