import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-[4px] border border-white/10 bg-[#151A24] p-8">
        <div className="mb-5 flex size-9 items-center justify-center rounded-[4px] bg-[#3B82F6]">
          <span className="text-base font-bold text-white font-display">A</span>
        </div>
        <h1 className="mb-2 text-xl font-bold tracking-tight text-[#F5F5F5] font-display">
          Bienvenue sur Arc
        </h1>
        <p className="mb-8 text-sm text-[#9AA3B2]">Authentification réussie !</p>

        <div className="rounded-[4px] border border-white/10 bg-[#0A0E17] px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-[#9AA3B2]">
            Email connecté
          </p>
          <p className="mt-1 text-sm font-medium text-[#F5F5F5]">
            {user.email}
          </p>
        </div>

        <form action={logout} className="mt-8">
          <button
            type="submit"
            className="w-full rounded-[4px] bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5B93FF]"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}