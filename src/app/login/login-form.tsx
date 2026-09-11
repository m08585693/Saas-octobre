"use client";

import { useActionState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Lock, Mail, Zap } from "lucide-react";
import { login } from "@/app/actions";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {});

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative w-full max-w-md"
    >
      <div className="absolute -inset-8 -z-10 rounded-[24px] bg-[radial-gradient(circle,rgba(124,58,237,0.16),transparent_65%)]" />

      <motion.div
        variants={item}
        className="rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-7 shadow-[0_0_40px_rgba(59,130,246,0.06)] backdrop-blur-md transition-all hover:shadow-[0_0_48px_rgba(139,92,246,0.14)] sm:p-9"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-[#232334] bg-[#12121B] px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#A1A1AA]">
          <Zap className="size-3.5 text-violet-400" fill="currentColor" />
          Accès Membre
        </span>

        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white">
          Content de te revoir
        </h1>
        <p className="mt-2 text-sm text-[#A1A1AA]">
          Connecte-toi pour continuer ton Winter Arc.
        </p>

        {/* Formulaire */}
        <form action={action} className="mt-7 flex flex-col gap-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-[#A1A1AA]"
            >
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#A1A1AA]" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="vous@exemple.com"
                className="w-full rounded-[12px] border border-[#232334] bg-[#12121C] py-3 pl-10 pr-4 text-sm text-white transition-all placeholder:text-[#A1A1AA]/50 focus:border-violet-400/70 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.30),0_0_16px_rgba(139,92,246,0.12)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-[#A1A1AA]">
                Mot de passe
              </label>
              <Link
                href="#"
                className="text-xs text-[#A1A1AA] transition-colors hover:text-white"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#A1A1AA]" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full rounded-[12px] border border-[#232334] bg-[#12121C] py-3 pl-10 pr-4 text-sm text-white transition-all placeholder:text-[#A1A1AA]/50 focus:border-violet-400/70 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.30),0_0_16px_rgba(139,92,246,0.12)] focus:outline-none"
              />
            </div>
          </div>

          {state?.error && (
            <p className="rounded-[8px] border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:from-violet-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Connexion..." : "Se connecter"}
            <ArrowRight className="size-4" />
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[#A1A1AA]">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold text-violet-400 transition-colors hover:text-violet-300"
          >
            S&apos;inscrire
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}