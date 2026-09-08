import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { joinGroup } from "@/app/group-actions";

export default async function GroupsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, description, group_members(count)")
    .order("name");

  const { data: memberships } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id);

  const joinedIds = new Set(
    (memberships ?? []).map((m) => m.group_id as string)
  );

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Groupes disponibles
          </h1>
          <p className="mt-1 text-sm text-[#9AA3B2]">
            Choisis un objectif — tu pourras toujours en rejoindre d&apos;autres.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-[4px] border border-white/10 px-4 py-2 text-sm text-[#9AA3B2] transition-colors hover:text-[#F5F5F5]"
        >
          Retour au dashboard
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {(groups ?? []).map((group: any) => {
          const memberCount = group.group_members?.[0]?.count ?? 0;
          const joined = joinedIds.has(group.id);
          return (
            <div
              key={group.id}
              className="flex items-center gap-4 rounded-[4px] border border-white/10 bg-[#151A24] px-5 py-4"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#F5F5F5]">
                  {group.name}
                </p>
                <p className="mt-0.5 text-sm text-[#9AA3B2]">
                  {group.description}
                </p>
                <p className="mt-1 text-xs text-[#9AA3B2]/70">
                  {memberCount} membre{memberCount > 1 ? "s" : ""}
                </p>
              </div>
              {joined ? (
                <Link
                  href={`/dashboard?group=${group.id}`}
                  className="shrink-0 rounded-[4px] border border-white/10 px-4 py-2.5 text-sm font-medium text-[#9AA3B2] transition-colors hover:text-[#F5F5F5]"
                >
                  Rejoint ✓
                </Link>
              ) : (
                <form action={joinGroup}>
                  <input type="hidden" name="groupId" value={group.id} />
                  <button
                    type="submit"
                    className="shrink-0 rounded-[4px] bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5B93FF]"
                  >
                    Rejoindre
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      {(groups ?? []).length === 0 && (
        <p className="text-sm text-[#9AA3B2]">Aucun groupe pour l&apos;instant.</p>
      )}
    </div>
  );
}