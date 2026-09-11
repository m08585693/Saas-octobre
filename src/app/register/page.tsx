import Link from "next/link";
import { Zap } from "lucide-react";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#0A0A10]">
      <div className="landing-halo left-[-140px] top-[-120px] size-[420px] bg-violet-600/25" />
      <div className="landing-halo bottom-[-160px] right-[-120px] size-[460px] bg-blue-600/20" />
      <div className="landing-grid pointer-events-none absolute inset-0" />

      <div className="relative">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_0_16px_rgba(139,92,246,0.4)]">
              <Zap className="size-4 text-white" fill="currentColor" />
            </span>
            <span className="font-display text-base font-bold text-white">
              WinterArc
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#A1A1AA] transition-colors hover:text-white"
          >
            Retour à l&apos;accueil
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-20 pt-8">
          <RegisterForm />
        </main>
      </div>
    </div>
  );
}