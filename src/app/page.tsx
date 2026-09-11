import { redirect } from "next/navigation";
import Link from "next/link";
import { Star, Check, Target } from "lucide-react";
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
      <header className="pt-8">
        <p className="text-center font-display text-[20px] font-bold text-white">
          Arc
        </p>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#F5F5F5] text-balance sm:text-5xl">
            Ton Winter Arc, mais à 15.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-[#9AA3B2] text-pretty sm:text-lg">
            Rejoins un groupe qui vise le même objectif que toi et ne lâche
            rien jusqu&apos;au bout.
          </p>

          {/* Ligne de badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <span className="flex items-center gap-2 rounded-[999px] border border-[#232323] bg-[#141414] px-4 py-2 text-xs font-medium text-[#9AA3B2]">
              <Star className="size-3.5 text-[#3B82F6]" fill="currentColor" />
              1 groupe gratuit à vie
            </span>
            <span className="flex items-center gap-2 rounded-[999px] border border-[#232323] bg-[#141414] px-4 py-2 text-xs font-medium text-[#9AA3B2]">
              <Check className="size-3.5 text-[#3B82F6]" />
              100% gratuit pour commencer
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-center">
            <span className="flex items-center gap-2 rounded-[999px] border border-[#232323] bg-[#141414] px-5 py-2 text-xs font-medium text-[#9AA3B2]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3B82F6] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#3B82F6]" />
              </span>
              de nombreux groupes actifs dès aujourd&apos;hui
            </span>
          </div>

          {/* Feature card */}
          <div className="mt-8 rounded-[12px] border border-[#232323] border-t-[3px] border-t-[#3B82F6] bg-[#141414] p-6 text-left">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#1C1C1C]">
                <Target className="size-7 text-[#3B82F6]" strokeWidth={2} />
              </div>
              <h2 className="font-display text-lg font-bold tracking-tight text-[#F5F5F5]">
                Un groupe. Un objectif. Zéro excuse.
              </h2>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[#9AA3B2]">
              Check-in{" "}
              <span className="font-semibold text-[#F5F5F5]">chaque jour</span>
              , suis ta progression et celle de ton groupe, grimpe dans le{" "}
              <span className="font-semibold text-[#F5F5F5]">classement</span>
              . Le groupe{" "}
              <span className="font-semibold text-[#F5F5F5]">
                voit si tu lâches
              </span>{" "}
              — c&apos;est fait exprès.
            </p>
          </div>

          {/* Notation sociale */}
          <p className="mt-6 text-sm text-[#9AA3B2]">
            ⭐ Rejoins les premiers membres d&apos;Arc
          </p>

          {/* CTA */}
          <div className="mt-5 flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#3B82F6] px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-[#5B93FF]"
            >
              Commencer gratuitement →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}