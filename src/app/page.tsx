import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const stats = [
    { value: "12 400+", label: "membres actifs" },
    { value: "87 %", label: "atteignent 14 jours" },
    { value: "3,5 jours", label: "de streak moyen" },
  ];

  const steps = [
    {
      number: "01",
      title: "Rejoins un groupe",
      description:
        "Choisis un groupe de motivation autour de ton objectif, avec des personnes au même but.",
    },
    {
      number: "02",
      title: "Check-in chaque jour",
      description:
        "Valide ton engagement en un clic, chaque jour. Ta série de jours consécutifs se construit.",
    },
    {
      number: "03",
      title: "Grimpe dans le classement",
      description:
        "Suis ta position dans le groupe. La régularité devient un jeu collectif.",
    },
  ];

  const members = [
    { name: "Sofia", streak: 42, position: 1 },
    { name: "Lucas", streak: 31, position: 2 },
    { name: "Inès", streak: 28, position: 3 },
    { name: "Hugo", streak: 17, position: 4 },
  ];

  return (
    <div className="min-h-full bg-[#0A0E17] text-[#F5F5F5]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-6 items-center justify-center rounded-[4px] bg-[#3B82F6]">
            <span className="text-[11px] font-bold text-white">A</span>
          </div>
          <span className="text-[17px] font-semibold tracking-tight">Arc</span>
        </div>
        <Link
          href="/login"
          className="rounded-[4px] border border-white/10 px-4 py-2 text-sm text-[#9AA3B2] transition-colors hover:border-white/25 hover:text-[#F5F5F5]"
        >
          Se connecter
        </Link>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center sm:pt-24">
          <p className="mx-auto mb-6 inline-block rounded-[4px] border border-white/10 bg-[#151A24] px-3 py-1.5 text-xs font-medium tracking-wide text-[#9AA3B2]">
            Motivation en groupe
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Tiens ton engagement.
            <br />
            <span className="text-[#9AA3B2]">Avec un groupe.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-[#9AA3B2] sm:text-lg">
            Rejoins un groupe de motivation, valide ton avancée chaque jour et
            construis une série que tu ne voudras pas casser.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/register"
              className="rounded-[4px] bg-[#3B82F6] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5B93FF]"
            >
              Commencer gratuitement
            </Link>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0D1220]">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[#9AA3B2]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-14 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Comment ça marche
            </h2>
            <p className="mt-3 text-[#9AA3B2]">
              Trois gestes simples, chaque jour.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-[6px] border border-white/10 bg-[#151A24] p-7"
              >
                <span className="text-sm font-semibold text-[#3B82F6]">
                  {step.number}
                </span>
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#9AA3B2]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-14 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Le groupe, au cœur
            </h2>
            <p className="mt-3 text-[#9AA3B2]">
              Une vision claire de ta série et de ta position parmi les
              membres.
            </p>
          </div>
          <div className="rounded-[6px] border border-white/10 bg-[#151A24] p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <h3 className="text-base font-semibold">Sport — Running 10 km</h3>
                <p className="mt-1 text-xs text-[#9AA3B2]">
                  4 membres · mis à jour à l&apos;instant
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-[4px] border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1.5 text-xs font-semibold text-[#5B93FF] sm:flex">
                Jour 42
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4 rounded-[4px] bg-[#0A0E17] px-4 py-3">
                <span className="w-6 text-xs text-[#9AA3B2]">1</span>
                <span className="flex-1 text-sm font-medium">Sofia</span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6]">
                  <span className="size-1.5 rounded-full bg-[#3B82F6]" />
                  42 jours
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-[4px] px-4 py-3">
                <span className="w-6 text-xs text-[#9AA3B2]">2</span>
                <span className="flex-1 text-sm font-medium">Lucas</span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6]">
                  <span className="size-1.5 rounded-full bg-[#3B82F6]" />
                  31 jours
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-[4px] px-4 py-3">
                <span className="w-6 text-xs text-[#9AA3B2]">3</span>
                <span className="flex-1 text-sm font-medium">Inès</span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6]">
                  <span className="size-1.5 rounded-full bg-[#3B82F6]" />
                  28 jours
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-[4px] bg-[#0A0E17] px-4 py-3">
                <span className="w-6 text-xs text-[#9AA3B2]">4</span>
                <span className="flex-1 text-sm font-medium">Hugo</span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#9AA3B2]">
                  <span className="size-1.5 rounded-full bg-[#3B82F6]/40" />
                  17 jours
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="rounded-[6px] border border-white/10 bg-[#151A24] px-6 py-16 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Prêt à tenir ton engagement&nbsp;?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[#9AA3B2]">
              Rejoins ton premier groupe aujourd&apos;hui. Gratuit, sans carte
              bancaire.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/register"
                className="rounded-[4px] bg-[#3B82F6] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5B93FF]"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-5 items-center justify-center rounded-[4px] bg-[#3B82F6]">
              <span className="text-[10px] font-bold text-white">A</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">Arc</span>
          </div>
          <p className="text-xs text-[#9AA3B2]">
            © {new Date().getFullYear()} Arc
          </p>
        </div>
      </footer>
    </div>
  );
}