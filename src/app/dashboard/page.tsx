import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkIn } from "@/app/group-actions";
import { logout } from "@/app/actions";

type SearchParams = Promise<{ group?: string }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { group: selectedId } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("group_members")
    .select("id, streak_count, last_check_in, groups!inner(id, name, description)")
    .eq("user_id", user.id);

  const myGroups = ((memberships ?? []) as unknown as {
    groups: { id: string; name: string; description: string | null };
    streak_count: number;
  }[]).map((m) => ({
    id: m.groups.id,
    name: m.groups.name,
    streak: m.streak_count,
  }));

  // Si le groupe sélectionné n'est pas valide (absent, supprimé), on repart vide
  const selected = myGroups.find((g) => g.id === selectedId);

  let groupView = null;
  let myStreak: number | null = null;
  let myRank: number | null = null;
  let checkedToday = false;

  if (selected) {
    const { data: detail } = await supabase
      .from("groups")
      .select(
        "id, name, description, group_members(user_id, display_name, streak_count, last_check_in)"
      )
      .eq("id", selected.id)
      .single();

    const members = (detail?.group_members ?? [])
      .map((m) => ({
        userId: m.user_id as string,
        name: m.display_name ?? "Membre",
        streak: m.streak_count as number,
        lastCheckIn: m.last_check_in as string | null,
      }))
      .sort((a, b) => b.streak - a.streak);

    myStreak =
      members.find((m) => m.userId === user.id)?.streak ?? 0;
    myRank = members.findIndex((m) => m.userId === user.id) + 1;
    if (myRank === 0) myRank = null;
    checkedToday =
      new Date().toISOString().slice(0, 10) ===
      members.find((m) => m.userId === user.id)?.lastCheckIn;

    groupView = { id: detail!.id, name: detail!.name, members };
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Colonne de gauche : les groupes de l'utilisateur */}
      <aside className="border-b border-white/10 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex gap-2 overflow-x-auto p-4 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-4">
          {myGroups.map((g) => {
            const active = selected?.id === g.id;
            return (
              <Link
                key={g.id}
                href={`/dashboard?group=${g.id}`}
                className={`flex shrink-0 items-center gap-2.5 rounded-[4px] border px-3 py-2.5 transition-colors lg:w-full ${
                  active
                    ? "border-[#3B82F6]/60 bg-[#151A24]"
                    : "border-transparent hover:bg-[#151A24]/50"
                }`}
              >
                <span className="flex-1 truncate text-sm font-medium text-[#F5F5F5]">
                  {g.name}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#9AA3B2]">
                  <span className="size-1.5 rounded-full bg-[#3B82F6]" />
                  {g.streak} j
                </span>
              </Link>
            );
          })}

          {myGroups.length === 0 && (
            <p className="px-3 py-2 text-sm text-[#9AA3B2]">
              Aucun groupe rejoint pour l&apos;instant.
            </p>
          )}
        </div>
      </aside>

      {/* Zone centrale */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:py-16">
        {groupView ? (
          <div className="w-full max-w-2xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-[#F5F5F5]">
                  {groupView.name}
                </h1>
                {groupView.members.length > 0 && (
                  <p className="mt-1 text-sm text-[#9AA3B2]">
                    {groupView.members.length} membre
                    {groupView.members.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-[4px] border border-white/10 px-4 py-2 text-sm text-[#9AA3B2] transition-colors hover:text-[#F5F5F5]"
                >
                  Se déconnecter
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[4px] border border-white/10 bg-[#151A24] p-5">
                <p className="text-xs text-[#9AA3B2]">Ton streak</p>
                <p className="mt-1 font-display text-3xl font-bold text-[#F5F5F5]">
                  {myStreak} <span className="text-lg text-[#9AA3B2]">jours</span>
                </p>
              </div>
              <div className="rounded-[4px] border border-white/10 bg-[#151A24] p-5">
                <p className="text-xs text-[#9AA3B2]">Ton rang</p>
                <p className="mt-1 font-display text-3xl font-bold text-[#F5F5F5]">
                  {myRank ? `#${myRank}` : "—"}
                  <span className="text-lg text-[#9AA3B2]">
                    {myRank ? ` / ${groupView.members.length}` : ""}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[4px] border border-white/10 bg-[#151A24] p-2">
              <ul className="flex flex-col gap-1">
                {groupView.members.map((m, i) => {
                  const isMe = m.userId === user.id;
                  return (
                    <li
                      key={i}
                      className={`flex items-center gap-4 rounded-[4px] px-4 py-3 ${
                        isMe ? "bg-[#3B82F6]/10" : i % 2 === 0 ? "bg-[#0A0E17]" : ""
                      }`}
                    >
                      <span className="w-5 text-center font-mono text-xs text-[#9AA3B2]">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm font-medium text-[#F5F5F5]">
                        {isMe ? "Toi" : m.name}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-[#9AA3B2]">
                        <span className="size-1.5 rounded-full bg-[#3B82F6]" />
                        {m.streak} j
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <form action={checkIn} className="mt-6">
              <input type="hidden" name="groupId" value={groupView.id} />
              <button
                type="submit"
                disabled={checkedToday}
                className="w-full rounded-[4px] bg-[#3B82F6] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#5B93FF] disabled:cursor-not-allowed disabled:bg-[#151A24] disabled:text-[#9AA3B2]"
              >
                {checkedToday
                  ? "Check-in effectué aujourd'hui ✓"
                  : "Check-in — valider ta journée"}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-[4px] bg-[#151A24]">
              <span className="font-display text-lg font-bold text-[#3B82F6]">
                +
              </span>
            </div>
            <h1 className="font-display text-xl font-bold tracking-tight text-[#F5F5F5]">
              {myGroups.length === 0
                ? "Aucun groupe pour l'instant"
                : "Sélectionne un groupe"}
            </h1>
            <p className="mt-3 text-sm text-[#9AA3B2]">
              {myGroups.length === 0
                ? "Rejoins un groupe pour commencer à construire ton streak."
                : "Choisis un groupe dans la liste pour voir son classement."}
            </p>
            <Link
              href="/groups"
              className="mt-7 inline-block rounded-[4px] bg-[#3B82F6] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#5B93FF]"
            >
              {myGroups.length === 0 ? "Chercher un groupe" : "Voir les groupes"}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}