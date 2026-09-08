import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/reveal";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-full bg-[#0A0E17] text-[#F5F5F5]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
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
        <section className="mx-auto max-w-6xl px-6 pb-28 pt-20 sm:pt-28">
          <p className="mb-7 max-w-xs text-xs font-medium uppercase tracking-[0.2em] text-[#5B93FF]">
            Tu as déjà abandonné une résolution. Ça arrive.
          </p>
          <Reveal />
          <p className="mx-auto mt-6 max-w-md text-base text-[#9AA3B2]">
            Un groupe change la donne&nbsp;: tu valides chaque jour, et une
            série se construit. Tu ne veux pas la casser — surtout quand les
            autres voient ta progression.
          </p>
          <div className="mt-10 flex justify-start">
            <Link
              href="/register"
              className="rounded-[4px] bg-[#3B82F6] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5B93FF]"
            >
              Commencer gratuitement
            </Link>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0D1220]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="text-sm text-[#9AA3B2]">
              Ce ne sont pas des promesses de produit. C&apos;est ce qui se
              passe réellement chez les membres qui restent.
            </p>
            <div className="mt-10 flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-5xl font-bold tracking-tight font-display">
                  87&nbsp;%
                </p>
                <p className="mt-2 text-sm text-[#9AA3B2]">
                  des membres tiennent plus de 14 jours
                </p>
              </div>
              <div>
                <p className="text-5xl font-bold tracking-tight font-display">
                  12&nbsp;400+
                </p>
                <p className="mt-2 text-sm text-[#9AA3B2]">
                  personnes actives dans un groupe
                </p>
              </div>
              <div>
                <p className="text-5xl font-bold tracking-tight font-display">
                  3,5&nbsp;j
                </p>
                <p className="mt-2 text-sm text-[#9AA3B2]">
                  c&apos;est là que la plupart abandonnent sans groupe
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-28">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5B93FF]">
                Le mécanisme
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight font-display">
                La constance n&apos;est pas une force de caractère. C&apos;est un système.
              </h2>
              <p className="mt-4 text-[#9AA3B2]">
                Personne ne décide de tenir trois mois. On décide de tenir
                aujourd&apos;hui, et on s&apos;arrange pour que ce soit facile à dire
                oui.
              </p>
            </div>

            <div className="flex flex-col gap-px lg:col-span-7">
              <div className="border-l-2 border-[#3B82F6] bg-[#151A24] px-6 py-7">
                <p className="font-mono text-sm text-[#5B93FF]">01</p>
                <h3 className="mt-3 text-lg font-semibold font-display">
                  Rejoins un groupe
                </h3>
                <p className="mt-2 text-sm text-[#9AA3B2]">
                  Pas un cours, pas un coach. Des gens qui poursuivent le même
                  objectif que toi, à ta portée.
                </p>
              </div>
              <div className="bg-[#151A24] px-6 py-7">
                <p className="font-mono text-sm text-[#5B93FF]">02</p>
                <h3 className="mt-3 text-lg font-semibold font-display">
                  Check-in chaque jour
                </h3>
                <p className="mt-2 text-sm text-[#9AA3B2]">
                  Un clic, chaque jour. Le jour où tu hésites, la série est là
                  pour te rappeler ce que tu as déjà construit.
                </p>
              </div>
              <div className="bg-[#151A24] px-6 py-7">
                <p className="font-mono text-sm text-[#5B93FF]">03</p>
                <h3 className="mt-3 text-lg font-semibold font-display">
                  Ta progression se voit
                </h3>
                <p className="mt-2 text-sm text-[#9AA3B2]">
                  Le classement du groupe t&apos;assigne une position. Tu n&apos;es
                  plus seul à te motiver.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0D1220]">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5B93FF]">
                  Exemple réel
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight font-display">
                  Un groupe qui court 10&nbsp;km
                </h2>
                <p className="mt-4 text-[#9AA3B2]">
                  Quatre personnes, quatre séries. Le classement n&apos;est pas là
                  pour humilier — il est là pour qu&apos;on continue.
                </p>
              </div>
              <div className="rounded-[4px] border border-white/10 bg-[#151A24] p-6 lg:col-span-7">
                <div className="mb-5 flex items-baseline justify-between border-b border-white/10 pb-4">
                  <h3 className="text-base font-semibold font-display">
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
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight font-display">
              Tu as déjà tout ce qu&apos;il faut pour recommencer.
            </h2>
            <p className="mt-4 text-[#9AA3B2]">
              Sauf une chose&nbsp;: quelqu&apos;un qui regarde, et qui compte les
              jours avec toi. Rejoins un groupe.
            </p>
            <div className="mt-8">
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