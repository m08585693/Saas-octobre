import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Flame,
  Sunrise,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Quiz from "@/components/quiz";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#0A0A10]">
      {/* Halo arrière-plan */}
      <div className="landing-halo left-[-120px] top-[-80px] size-[420px] bg-violet-600/25" />
      <div className="landing-halo right-[-100px] top-[140px] size-[380px] bg-blue-600/20" />
      <div className="landing-halo bottom-[-160px] left-1/2 size-[520px] -translate-x-1/2 bg-violet-700/15" />

      {/* Grille subtile */}
      <div className="landing-grid pointer-events-none absolute inset-0" />

      <div className="relative">
        {/* Header */}
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-lg font-bold text-white">
            WinterArc SaaS
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-[#A1A1AA] sm:flex">
            <a href="#apercu" className="transition-colors hover:text-white">
              Aperçu
            </a>
            <a
              href="#fonctionnalites"
              className="transition-colors hover:text-white"
            >
              Fonctionnalités
            </a>
          </nav>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.35)] transition-all hover:from-violet-400 hover:to-blue-400"
          >
            Commencer
            <ArrowRight className="size-3.5" />
          </Link>
        </header>

        {/* Hero */}
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-20 pt-10 sm:pt-14">
          <div className="flex items-center gap-2 rounded-full border border-[#232334] bg-[#0F0F16]/70 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#A1A1AA] shadow-[0_0_16px_rgba(139,92,246,0.15)] backdrop-blur">
            <Zap className="size-3.5 text-violet-400" fill="currentColor" />
            #1 OUTIL WINTER ARC
          </div>

          <h1 className="mt-6 max-w-3xl text-center font-display text-4xl font-bold tracking-tight text-white text-balance sm:text-6xl">
            Construis ton Winter Arc sur-mesure
          </h1>
          <p className="mx-auto mt-4 max-w-md text-center text-base text-[#A1A1AA] sm:text-lg">
            Réponds à 3 questions. On te construit ton plan de discipline, de
            rituels et de motivation sur-mesure.
          </p>

          <div className="mt-10 w-full">
            <Quiz />
          </div>
        </section>

        {/* Aperçu / Mockup */}
        <section
          id="apercu"
          className="mx-auto w-full max-w-5xl px-6 pb-20"
        >
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
              Une fois le quiz rempli
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ton groupe. Ton classement. Ta série.
            </h2>
            <p className="mt-3 max-w-lg text-[#A1A1AA]">
              Ton dashboard se débloque : rejoins un groupe, check-in chaque
              jour, grimpe dans le classement.
            </p>
          </div>

          {/* Mockup 3D */}
          <div className="relative mx-auto mt-12 max-w-4xl">
            <div className="absolute -inset-6 -z-10 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.18),transparent_65%)]" />
            <div className="overflow-hidden rounded-[16px] border border-[#232334] bg-[#0F0F16] shadow-[0_24px_80px_rgba(0,0,0,0.6)] [transform:perspective(1200px)_rotateX(6deg)]">
              {/* Barre de navigateur */}
              <div className="flex items-center gap-2 border-b border-[#232334] bg-[#12121B] px-4 py-3">
                <span className="size-2.5 rounded-full bg-[#3E3E4E]" />
                <span className="size-2.5 rounded-full bg-[#3E3E4E]" />
                <span className="size-2.5 rounded-full bg-[#3E3E4E]" />
                <div className="ml-3 flex-1 rounded-full bg-[#1A1A26] px-4 py-1.5 text-xs text-[#A1A1AA]">
                  arc.app/dashboard
                </div>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="hidden w-44 shrink-0 flex-col gap-1 border-r border-[#232334] p-4 sm:flex">
                  <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
                    Mes groupes
                  </p>
                  {["Running — 10 km", "Écriture", "Lecture"].map((g, i) => (
                    <div
                      key={g}
                      className={`flex items-center justify-between rounded-[8px] px-3 py-2 text-xs ${
                        i === 0
                          ? "border border-violet-400/60 bg-[#191926] text-white"
                          : "text-[#A1A1AA]"
                      }`}
                    >
                      <span className="truncate">{g}</span>
                      <span className="ml-2 text-[10px] font-semibold text-violet-400">
                        {12 - i * 4} j
                      </span>
                    </div>
                  ))}
                </div>

                {/* Contenu */}
                <div className="flex-1 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Running — 10 km
                      </p>
                      <p className="text-xs text-[#A1A1AA]">Groupe de 4</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-violet-400/50 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
                      <CalendarCheck className="size-3.5" />
                      Check-in
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {[
                      { name: "Sofia", days: 42, me: false },
                      { name: "Lucas", days: 31, me: false },
                      { name: "Inès", days: 28, me: false },
                      { name: "Toi", days: 17, me: true },
                    ].map((m, i) => (
                      <div
                        key={m.name}
                        className={`flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-xs ${
                          m.me
                            ? "bg-violet-500/10"
                            : i % 2 === 0
                              ? "bg-[#12121B]"
                              : ""
                        }`}
                      >
                        <span className="font-mono text-[10px] text-[#A1A1AA]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 text-[13px] text-white">
                          {m.name}
                        </span>
                        <span className="font-semibold text-[#A1A1AA]">
                          {m.days} j
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section
          id="fonctionnalites"
          className="mx-auto w-full max-w-5xl px-6 pb-24 pt-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Boost & rituels — grande carte */}
            <div className="rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-6 backdrop-blur transition-colors hover:border-[#3E3E4E] md:col-span-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-violet-500/15">
                <Sunrise className="size-5 text-violet-400" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">
                Boost & rituels de motivation quotidiens
              </h3>
              <p className="mt-2 text-sm text-[#A1A1AA]">
                Un rituel chaque matin, une dose de motivation, et ton groupe
                qui veille sur ta série. Personne ne veut l&apos;abandonner —
                c&apos;est fait exprès.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Rituel matin", "Citation du jour", "Défis hebdo"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#232334] bg-[#12121B] px-3 py-1 text-xs text-[#A1A1AA]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Tracker discipline */}
            <div className="rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-6 backdrop-blur transition-colors hover:border-[#3E3E4E]">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle2 className="size-5 text-emerald-400" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">
                Tracker de discipline & habitudes strict
              </h3>
              <p className="mt-2 text-sm text-[#A1A1AA]">
                Check-in chaque jour. Le classement te place, la série te
                retient.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <Flame className="size-4 text-orange-400" />
                <span className="text-xs text-[#A1A1AA]">Série du jour :</span>
                <span className="text-xs font-semibold text-white">
                  12 jours
                </span>
              </div>
            </div>

            {/* Dashboard progression */}
            <div className="rounded-[16px] border border-[#232334] bg-[#0F0F16]/70 p-6 backdrop-blur transition-colors hover:border-[#3E3E4E]">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/15">
                <BarChart3 className="size-5 text-blue-400" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">
                Dashboard de progression & objectifs Winter Arc
              </h3>
              <p className="mt-2 text-sm text-[#A1A1AA]">
                Vois ta progression semaine après semaine et tiens ton objectif
                jusqu&apos;au bout.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {[
                  { label: "Régularité", value: "w-3/4" },
                  { label: "Objectif saison", value: "w-1/2" },
                ].map((p) => (
                  <div key={p.label} className="flex items-center gap-2">
                    <span className="w-24 text-xs text-[#A1A1AA]">
                      {p.label}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#232334]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 ${p.value}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div className="mt-16 flex flex-col items-center text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white">
              Prêt à tenir jusqu&apos;au bout ?
            </h2>
            <p className="mt-3 max-w-md text-[#A1A1AA]">
              3 questions et tu rejoins le bon groupe. Sans carte bancaire.
            </p>
            <Link
              href="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.4)] transition-all hover:from-violet-400 hover:to-blue-400"
            >
              Commencer gratuitement
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}