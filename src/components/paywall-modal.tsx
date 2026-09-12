"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Loader2, Lock, X } from "lucide-react";

type PaywallModalProps = {
  onClose: () => void;
};

const FEATURES = [
  "Groupes illimités",
  "Badges exclusifs",
  "Statistiques avancées",
  "Support prioritaire",
];

export default function PaywallModal({ onClose }: PaywallModalProps) {
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative w-full max-w-md overflow-hidden rounded-[16px] border border-[#232334] bg-[#0F0F16] shadow-[0_0_60px_rgba(139,92,246,0.15)]"
      >
        <div className="absolute -inset-10 -z-10 bg-[radial-gradient(circle,rgba(139,92,246,0.2),transparent_60%)]" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-[10px] border border-[#232334] bg-[#181824] text-[#A1A1AA] transition-colors hover:text-white"
        >
          <X className="size-4" />
        </button>

        <div className="px-7 pb-8 pt-7">
          <motion.div
            initial={{ scale: 0.6, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.1 }}
            className="mx-auto flex size-14 items-center justify-center rounded-full border border-violet-400/40 bg-[#191926] shadow-[0_0_24px_rgba(139,92,246,0.3)]"
          >
            <Crown className="size-7 text-violet-400" />
          </motion.div>

          <h2 className="mt-4 text-center font-display text-2xl font-bold tracking-tight text-white">
            Passe au plan Pro
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-[#A1A1AA]">
            Débloque des groupes illimités et transforme complètement ton Winter
            Arc.
          </p>

          {/* Offres */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPlan("monthly")}
              className={`rounded-[14px] border p-4 text-left transition-all ${
                plan === "monthly"
                  ? "border-violet-400/70 bg-[#191926] shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                  : "border-[#232334] bg-[#12121B] hover:border-[#3E3E4E]"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                Mensuel
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-white">
                4,99 €
                <span className="text-sm font-medium text-[#A1A1AA]">/mo</span>
              </p>
            </button>
            <button
              type="button"
              onClick={() => setPlan("yearly")}
              className={`relative rounded-[14px] border p-4 text-left transition-all ${
                plan === "yearly"
                  ? "border-blue-400/70 bg-[#191926] shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                  : "border-[#232334] bg-[#12121B] hover:border-[#3E3E4E]"
              }`}
            >
              <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">
                −35%
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                Annuel
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-white">
                39 €
                <span className="text-sm font-medium text-[#A1A1AA]">/an</span>
              </p>
            </button>
          </div>

          {/* Features */}
          <ul className="mt-5 flex flex-col gap-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-[#D4D4D8]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15">
                  <Check className="size-3 text-emerald-400" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {error && (
            <p className="mt-4 rounded-[8px] border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleCheckout}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:from-violet-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Redirection en cours...
              </>
            ) : (
              <>
                <Crown className="size-4" />
                Passer au plan Pro
              </>
            )}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#A1A1AA]">
            <Lock className="size-3" />
            Paiement sécurisé · Annulable à tout moment
          </p>
        </div>
      </motion.div>
    </div>
  );
}