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

  return (
    <div className="flex min-h-full flex-col">
      <header>
        <Link
          href="/"
          className="inline-block p-4 sm:p-6 font-display text-[20px] font-semibold text-white"
        >
          Arc
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#F5F5F5] text-balance sm:text-5xl">
            Ton Winter Arc, mais à 15.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-[#9AA3B2] text-pretty sm:text-lg">
            Rejoins un groupe de personnes qui visent le même objectif que toi.
            Check-in chaque jour, grimpe dans le classement, ne lâche rien
            jusqu&apos;au bout.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className="rounded-[4px] bg-[#3B82F6] px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-[#5B93FF]"
            >
              Commencer gratuitement
            </Link>
          </div>
          <p className="mt-4 text-xs text-[#9AA3B2]">
            Sans carte bancaire · 1 groupe gratuit à vie
          </p>
        </div>
      </main>

      <footer className="pb-6 pt-6 text-center">
        <p className="text-xs text-[#9AA3B2]">© 2026 Arc</p>
      </footer>
    </div>
  );
}