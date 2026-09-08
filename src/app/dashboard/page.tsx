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
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#17171B] p-8">
        <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-[#3ECF8E]/15 text-lg font-bold text-[#3ECF8E]">
          A
        </div>
        <h1 className="mb-2 text-xl font-semibold text-[#F5F5F5]">
          Bienvenue sur Arc
        </h1>
        <p className="mb-8 text-sm text-[#9A9A9E]">
          Authentification réussie !
        </p>

        <div className="rounded-lg border border-white/10 bg-[#0B0B0E] px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-[#9A9A9E]">
            Email connecté
          </p>
          <p className="mt-1 text-sm font-medium text-[#F5F5F5]">
            {user.email}
          </p>
        </div>

        <form action={logout} className="mt-8">
          <button
            type="submit"
            className="w-full rounded-lg bg-[#3ECF8E] px-4 py-3 text-sm font-semibold text-[#0B0B0E] transition-colors hover:bg-[#53d99c]"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}