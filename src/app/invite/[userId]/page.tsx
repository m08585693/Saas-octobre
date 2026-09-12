import Link from "next/link";
import { Zap, Gift } from "lucide-react";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const ref = /^[0-9a-fA-F-]{36}$/.test(userId) ? userId : "";

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
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-20 pt-10">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-8 -z-10 rounded-[24px] bg-[radial-gradient(circle,rgba(124,58,237,0.18),transparent_65%)]" />

            <div className="rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-8 text-center shadow-[0_0_40px_rgba(139,92,246,0.08)] backdrop-blur-md">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-violet-400/40 bg-[#191926] shadow-[0_0_28px_rgba(139,92,246,0.28)]">
                <Gift className="size-8 text-violet-400" />
              </div>

              <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white">
                On t&apos;a invité à faire un Winter Arc 🔥
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">
                Rejoins un mouvement de discipline, bataille en groupe et
                transforme tes objectifs en réalité. Ton ami t&apos;attend au
                camp.
              </p>

              <Link
                href={ref ? `/register?ref=${ref}` : "/register"}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:from-violet-400 hover:to-blue-400"
              >
                <Zap className="size-4" fill="currentColor" />
                Rejoindre maintenant
              </Link>

              <p className="mt-5 text-sm text-[#A1A1AA]">
                Déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-violet-400 hover:text-violet-300"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}