import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import GroupsExplorer from "@/components/groups-explorer";

export default async function GroupsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, description, category, group_members(user_id, streak_count)");

  const { data: memberships } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id);

  const joinedIds = new Set(
    (memberships ?? []).map((m) => m.group_id as string)
  );

  const rows = (groups ?? []).map((g: any) => {
    const members: { streak_count: number }[] = g.group_members ?? [];
    const memberCount = members.length;
    const avgStreak =
      memberCount > 0
        ? Math.round(
            members.reduce((acc, m) => acc + Number(m.streak_count ?? 0), 0) /
              memberCount
          )
        : 0;
    return {
      id: g.id as string,
      name: g.name as string,
      description: (g.description ?? "") as string,
      category: (g.category ?? "autre") as string,
      memberCount,
      avgStreak,
    };
  });

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#0A0A10]">
      <div className="landing-halo left-[-140px] top-[-120px] size-[420px] bg-violet-600/25" />
      <div className="landing-halo bottom-[-160px] right-[-120px] size-[460px] bg-blue-600/20" />
      <div className="landing-grid pointer-events-none absolute inset-0" />

      <div className="relative">
        <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_0_16px_rgba(139,92,246,0.4)]">
              <Zap className="size-4 text-white" fill="currentColor" />
            </span>
            <span className="font-display text-base font-bold text-white">
              WinterArc
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-[#A1A1AA] transition-colors hover:text-white"
          >
            Retour au dashboard
          </Link>
        </header>

        <main className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8">
          <GroupsExplorer rows={rows} joinedIds={Array.from(joinedIds)} />
        </main>
      </div>
    </div>
  );
}