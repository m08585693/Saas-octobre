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
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-6 items-center justify-center rounded-[4px] bg-[#3B82F6]">
            <span className="text-[11px] font-bold text-white font-display">
              A
            </span>
          </div>
          <span className="text-[17px] font-semibold tracking-tight font-display">
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
        {/* 1. Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
            <div className="size-[520px] shrink-0 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_65%)]" />
          </div>
          <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-20 sm:pt-28">
            <Reveal />
            <p className="mx-auto mt-6 max-w-md text-base text-[#9AA3B2]">
              Tu décides de tenir un objectif, un groupe compte les jours avec
              toi, et ta série devient visible.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="/register"
                className="rounded-[4px] bg-[#3B82F6] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5B93FF]"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Le problème */}
        <section className="mx-auto max-w-3xl px-6 pt-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[#F5F5F5] font-display sm:text-3xl">
            Tu commences plein de bonnes résolutions seul.
            <br />
            Vous abandonnez après une semaine, sans témoin.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center text-[#9AA3B2]">
            Pas parce que tu n&apos;as pas de volonté. Parce que personne ne
            remarque quand tu arrêtes. Une résolution sans regard, ça finit
            par glisser.
          </p>
        </section>

        {/* 3. Comment ça marche */}
        <section className="mx-auto max-w-6xl px-6 py-28">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5B93FF]">
            Comment ça marche
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-[#F5F5F5] font-display">
            La constance n&apos;est pas une force de caractère. C&apos;est un système.
          </h2>
          <div className="mt-14">
            <Steps />
          </div>
        </section>

        {/* 4. Preuve sociale */}
        <section className="mx-auto max-w-6xl px-6 pb-28">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5B93FF]">
            Déjà en train de tenir
          </p>
          <div className="mt-8 grid grid-cols-1 gap-12 text-center sm:grid-cols-3 sm:text-left">
            <div>
              <p className="text-5xl font-bold tracking-tight text-[#F5F5F5] font-display">
                87&nbsp;%
              </p>
              <p className="mt-2 max-w-xs text-sm text-[#9AA3B2]">
                des membres passent les 14 premiers jours — c&apos;est la période
                où on abandonne d&apos;habitude.
              </p>
            </div>
            <div>
              <p className="text-5xl font-bold tracking-tight text-[#F5F5F5] font-display">
                12&nbsp;400+
              </p>
              <p className="mt-2 max-w-xs text-sm text-[#9AA3B2]">
                personnes sont actives dans un groupe de motivation en ce
                moment.
              </p>
            </div>
            <div>
              <p className="text-5xl font-bold tracking-tight text-[#F5F5F5] font-display">
                3,5&nbsp;j
              </p>
              <p className="mt-2 max-w-xs text-sm text-[#9AA3B2]">
                c&apos;est la durée moyenne d&apos;une tentative en solitaire. Le
                groupe multiplie ce chiffre.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Aperçu produit */}
        <section className="mx-auto max-w-6xl px-6 pb-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5B93FF]">
                Un groupe, en vrai
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#F5F5F5] font-display">
                Le classement te place. La série te retient.
              </h2>
              <p className="mt-4 text-[#9AA3B2]">
                Un groupe de sport, quatre membres, quatre séries. Le
                classement n&apos;est pas là pour humilier — il est là pour
                qu&apos;on continue.
              </p>
            </div>
            <div className="rounded-[4px] border border-white/10 bg-[#151A24] p-6 lg:col-span-7">
              <div className="mb-5 flex items-baseline justify-between border-b border-white/10 pb-4">
                <h3 className="text-base font-semibold text-[#F5F5F5] font-display">
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
                    className="flex items-center gap-4 rounded-[4px] px-4 py-3 odd:bg-[#0A0E17]"
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

        {/* 6. Tarifs */}
        <section className="mx-auto max-w-6xl px-6 pb-28">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5B93FF]">
            Prix
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-[#F5F5F5] font-display">
            Gratuit pour commencer. Payant si ça marche.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-[4px] border border-white/10 bg-[#151A24] p-8">
              <p className="font-semibold text-[#F5F5F5] font-display">
                Gratuit
              </p>
              <p className="mt-5 text-4xl font-bold tracking-tight text-[#F5F5F5] font-display">
                0&nbsp;€
              </p>
              <p className="mt-1 text-xs text-[#9AA3B2]">pour toujours</p>
              <ul className="mt-8 flex flex-col gap-3 text-sm text-[#9AA3B2]">
                <li>Rejoindre des groupes</li>
                <li>Check-in quotidien</li>
                <li>Classement du groupe</li>
                <li>Ton streak, sans limite</li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="block w-full rounded-[4px] bg-[#3B82F6] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#5B93FF]"
                >
                  Commencer gratuitement
                </Link>
              </div>
            </div>
            <div className="rounded-[4px] border border-white/10 bg-[#151A24] p-8">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#F5F5F5] font-display">
                  Payant
                </p>
                <span className="text-[11px] text-[#9AA3B2]">bientôt</span>
              </div>
              <p className="mt-5 text-4xl font-bold tracking-tight text-[#F5F5F5] font-display">
                —
              </p>
              <p className="mt-1 text-xs text-[#9AA3B2]">
                deux fois plus motivé qu&apos;un homme moyen
              </p>
              <ul className="mt-8 flex flex-col gap-3 text-sm text-[#9AA3B2]">
                <li>Créer tes propres groupes</li>
                <li>Groupes privés</li>
                <li>Rappels quotidiens par email</li>
                <li>Soutient le projet</li>
              </ul>
              <div className="mt-8">
                <div className="block w-full cursor-not-allowed rounded-[4px] border border-white/10 bg-[#0A0E17] px-4 py-3 text-center text-sm font-semibold text-[#9AA3B2]">
                  Bientôt disponible
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CTA final */}
        <section className="mx-auto max-w-6xl px-6 pb-32">
          <div className="rounded-[4px] border border-white/10 bg-[#151A24] px-6 py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#F5F5F5] font-display">
              Tu as déjà tout ce qu&apos;il faut pour recommencer.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[#9AA3B2]">
              Sauf une chose&nbsp;: quelqu&apos;un qui regarde, et qui compte les
              jours avec toi. Rejoins un groupe.
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
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-5 items-center justify-center rounded-[4px] bg-[#3B82F6]">
              <span className="text-[10px] font-bold text-white font-display">
                A
              </span>
            </div>
            <span className="text-sm font-semibold tracking-tight font-display">
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