"use client";

import { useActionState } from "react";
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
        <h1 className="mb-2 text-2xl font-semibold text-[#F5F5F5]">{title}</h1>
        <p className="mb-8 text-sm text-[#9A9A9E]">{subtitle}</p>

        {success ? (
          <div className="rounded-lg border border-white/10 bg-[#17171B] p-6 text-sm text-[#F5F5F5]">
            <p className="mb-4">
              Compte créé avec succès ! Vérifiez votre boîte mail pour
              confirmer votre adresse email.
            </p>
            <Link
              href="/login"
              className="font-medium text-[#3ECF8E] hover:underline"
            >
              Aller à la page de connexion
            </Link>
          </div>
        ) : (
          <form
            action={action}
            className="rounded-lg border border-white/10 bg-[#17171B] p-8"
          >
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-[#9A9A9E]"
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
              className="mb-6 w-full rounded-lg border border-white/10 bg-[#0B0B0E] px-4 py-3 text-sm text-white placeholder:text-[#9A9A9E]/60 focus:border-white/30 focus:outline-none"
            />

            <label
              htmlFor="password"
              className="mb-2 block text-sm text-[#9A9A9E]"
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
              className="mb-6 w-full rounded-lg border border-white/10 bg-[#0B0B0E] px-4 py-3 text-sm text-white placeholder:text-[#9A9A9E]/60 focus:border-white/30 focus:outline-none"
            />

            {error && (
              <p className="mb-4 text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-[#3ECF8E] px-4 py-3 text-sm font-semibold text-[#0B0B0E] transition-colors hover:bg-[#53d99c] disabled:opacity-60"
            >
              {pending ? "..." : submitLabel}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#9A9A9E]">
          {footerLabel}{" "}
          <Link href={footerHref} className="font-medium text-[#3ECF8E] hover:underline">
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}