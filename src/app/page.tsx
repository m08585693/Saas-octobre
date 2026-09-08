import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/reveal";
import Steps from "@/components/steps";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-full">
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-6 items-center justify-center rounded-[4px] bg-[#3B82F6]">
            <span className="text-[11px] font-bold text-white font-display">
              A
            </span>
          </div>
          <span className="font-display text-[17px] font-semibold tracking-tight">
            Arc
          </span>
        </Link>
        <Link
          href="/login"
          className="rounded-[4px] border border-white/10 px-4 py-2 text-sm text-[#9AA3B2] transition-colors hover:border-white/25 hover:text-[#F5F5F5]"
        >
          Se connecter
        </Link>
      </header>

      <main>
        {/* Hero + hook + 3 étapes */}
        <section className="relative overflow-hidden pb-10 pt-14 sm:pt-16">
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
            <div className="size-[520px] shrink-0 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_65%)]" />
          </div>
          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <Reveal />
            <p className="mx-auto mt-5 max-w-xl font-display text-xl font-medium text-[#9AA3B2] sm:text-2xl">
              La constance n&apos;est pas une force de caractère, c&apos;est un
              système.
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/register"
                className="rounded-[4px] bg-[#3B82F6] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5B93FF]"
              >
                Commencer gratuitement
              </Link>
            </div>
            <div className="mx-auto mt-12 max-w-4xl border-t border-white/10 pt-10">
              <Steps />
            </div>
          </div>
        </section>

        {/* Preuve sociale */}
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="font-display text-4xl font-bold tracking-tight text-[#F5F5F5]">
                87&nbsp;%
              </p>
              <p className="mt-1 text-sm text-[#9AA3B2]">
                passent les 14 premiers jours
              </p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold tracking-tight text-[#F5F5F5]">
                12&nbsp;400+
              </p>
              <p className="mt-1 text-sm text-[#9AA3B2]">
                personnes actives dans un groupe
              </p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold tracking-tight text-[#F5F5F5]">
                3,5&nbsp;j
              </p>
              <p className="mt-1 text-sm text-[#9AA3B2]">
                durée moyenne d&apos;une tentative seule
              </p>
            </div>
          </div>
        </section>

        {/* Aperçu produit */}
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5B93FF]">
                Un groupe, en vrai
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F5F5F5]">
                Le classement te place. La série te retient.
              </h2>
              <p className="mt-3 text-[#9AA3B2]">
                Quatre membres, quatre séries. Personne ne veut laisser sa
                série tomber — surtout quand les autres la voient.
              </p>
            </div>
            <div className="rounded-[4px] border border-white/10 bg-[#151A24] p-6 lg:col-span-6">
              <div className="mb-4 flex items-baseline justify-between border-b border-white/10 pb-4">
                <h3 className="font-display text-base font-semibold text-[#F5F5F5]">
                  Running — 10&nbsp;km
                </h3>
                <span className="font-mono text-xs text-[#9AA3B2]">
                  4 membres
                </span>
              </div>
              <ul className="flex flex-col gap-1">
                {[
                  { rank: 1, name: "Sofia", days: 42 },
                  { rank: 2, name: "Lucas", days: 31 },
                  { rank: 3, name: "Inès", days: 28 },
                  { rank: 4, name: "Hugo", days: 17 },
                ].map((m) => (
                  <li
                    key={m.rank}
                    className="flex items-center gap-4 rounded-[4px] px-4 py-2.5 odd:bg-[#0A0E17]"
                  >
                    <span className="font-mono text-xs text-[#9AA3B2]">
                      {String(m.rank).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm">{m.name}</span>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span className="size-1.5 rounded-full bg-[#3B82F6]" />
                      {m.days} jours
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Tarifs */}
        <section className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#F5F5F5]">
            Gratuit pour commencer. Payant si ça marche.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-[4px] border border-white/10 bg-[#151A24] p-8">
              <p className="font-display font-semibold text-[#F5F5F5]">
                Gratuit
              </p>
              <p className="mt-4 font-display text-4xl font-bold tracking-tight text-[#F5F5F5]">
                0&nbsp;€
              </p>
              <ul className="mt-6 flex flex-col gap-2.5 text-sm text-[#9AA3B2]">
                <li>Rejoindre des groupes</li>
                <li>Check-in quotidien</li>
                <li>Classement du groupe</li>
                <li>Ton streak, sans limite</li>
              </ul>
              <div className="mt-7">
                <Link
                  href="/register"
                  className="block w-full rounded-[4px] bg-[#3B82F6] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#5B93FF]"
                >
                  Commencer gratuitement
                </Link>
              </div>
            </div>
            <div className="rounded-[4px] border border-white/10 bg-[#151A24] p-8">
              <p className="font-display font-semibold text-[#F5F5F5]">
                Payant
              </p>
              <p className="mt-4 text-xs text-[#5B93FF]">bientôt</p>
              <ul className="mt-6 flex flex-col gap-2.5 text-sm text-[#9AA3B2]">
                <li>Créer tes propres groupes</li>
                <li>Groupes privés</li>
                <li>Rappels quotidiens par email</li>
                <li>Soutient le projet</li>
              </ul>
              <div className="mt-7">
                <div className="block w-full cursor-not-allowed rounded-[4px] border border-white/10 bg-[#0A0E17] px-4 py-3 text-center text-sm font-semibold text-[#9AA3B2]">
                  Bientôt disponible
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-2">
          <div className="rounded-[4px] border border-white/10 bg-[#151A24] px-6 py-14 text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#F5F5F5] sm:text-3xl">
              Rejoins un groupe. Compte avec eux.
            </h2>
            <div className="mt-6 flex justify-center">
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-5 items-center justify-center rounded-[4px] bg-[#3B82F6]">
              <span className="text-[10px] font-bold text-white font-display">
                A
              </span>
            </div>
            <span className="font-display text-sm font-semibold tracking-tight">
              Arc
            </span>
          </Link>
          <p className="text-xs text-[#9AA3B2]">
            © {new Date().getFullYear()} Arc
          </p>
        </div>
      </footer>
    </div>
  );
}