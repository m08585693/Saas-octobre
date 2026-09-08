"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AuthFormProps = {
  action: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  footerLabel: string;
  footerHref: string;
  footerLinkLabel: string;
  success?: boolean;
  registerMode?: boolean;
};

export default function AuthForm({
  action,
  pending,
  error,
  title,
  subtitle,
  submitLabel,
  footerLabel,
  footerHref,
  footerLinkLabel,
  success,
  registerMode,
}: AuthFormProps): ReactNode {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex size-9 items-center justify-center rounded-[4px] bg-[#3B82F6]">
          <span className="text-base font-bold text-white font-display">A</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-[#F5F5F5] font-display">
          {title}
        </h1>
        <p className="mb-8 text-sm text-[#9AA3B2]">{subtitle}</p>

        {success ? (
          <div className="rounded-[4px] border border-white/10 bg-[#151A24] p-6 text-sm text-[#F5F5F5]">
            <p className="mb-4">
              Compte créé avec succès ! Vérifiez votre boîte mail pour
              confirmer votre adresse email.
            </p>
            <Link
              href="/login"
              className="font-medium text-[#3B82F6] hover:underline"
            >
              Aller à la page de connexion
            </Link>
          </div>
        ) : (
          <form
            action={action}
            className="rounded-[4px] border border-white/10 bg-[#151A24] p-8"
          >
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-[#9AA3B2]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="vous@exemple.com"
              className="mb-6 w-full rounded-[4px] border border-white/10 bg-[#0A0E17] px-4 py-3 text-sm text-white placeholder:text-[#9AA3B2]/60 focus:border-white/30 focus:outline-none"
            />

            <label
              htmlFor="password"
              className="mb-2 block text-sm text-[#9AA3B2]"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={registerMode ? "new-password" : "current-password"}
              required
              minLength={6}
              placeholder="••••••••"
              className="mb-6 w-full rounded-[4px] border border-white/10 bg-[#0A0E17] px-4 py-3 text-sm text-white placeholder:text-[#9AA3B2]/60 focus:border-white/30 focus:outline-none"
            />

            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-[4px] bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5B93FF] disabled:opacity-60"
            >
              {pending ? "..." : submitLabel}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#9AA3B2]">
          {footerLabel}{" "}
          <Link
            href={footerHref}
            className="font-medium text-[#3B82F6] hover:underline"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}