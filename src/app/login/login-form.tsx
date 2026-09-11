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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4 text-[#5865F2]"
      aria-hidden="true"
    >
      <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.45.87-.61 1.26a18.3 18.3 0 0 0-5.48 0 12.6 12.6 0 0 0-.62-1.26.08.08 0 0 0-.08-.04 19.75 19.75 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06c0 .03 0 .05.03.06a19.9 19.9 0 0 0 6 3.03.08.08 0 0 0 .08-.03c.46-.63.88-1.3 1.24-2a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.9-.9.08.08 0 0 1-.01-.13c.13-.1.25-.2.37-.3a.07.07 0 0 1 .08-.01c3.99 1.82 8.31 1.82 12.25 0a.07.07 0 0 1 .08 0c.12.1.25.21.37.3a.08.08 0 0 1-.01.13c-.6.35-1.24.64-1.91.9a.08.08 0 0 0-.04.11c.36.7.79 1.37 1.24 2a.08.08 0 0 0 .08.03 19.84 19.84 0 0 0 6.02-3.03.08.08 0 0 0 .03-.06c.5-5.17-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.2 0 2.17 1.09 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.2 0 2.17 1.09 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Z" />
    </svg>
  );
}

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

        {/* Social logins */}
        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 rounded-full border border-[#232334] bg-[#12121B] py-2.5 text-sm font-medium text-white transition-all hover:border-violet-400/60 hover:shadow-[0_0_16px_rgba(139,92,246,0.2)]"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 rounded-full border border-[#232334] bg-[#12121B] py-2.5 text-sm font-medium text-white transition-all hover:border-indigo-400/60 hover:shadow-[0_0_16px_rgba(88,101,242,0.25)]"
          >
            <DiscordIcon />
            Discord
          </button>
        </div>

        {/* Séparateur */}
        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-[#232334]" />
          <span className="text-xs text-[#A1A1AA]">ou avec ton email</span>
          <span className="h-px flex-1 bg-[#232334]" />
        </div>

        {/* Formulaire */}
        <form action={action} className="flex flex-col gap-5">
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