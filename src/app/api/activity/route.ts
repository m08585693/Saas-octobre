import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ActivityRow = {
  id: string;
  created_at: string;
  user_id: string;
  group_members: { display_name: string | null }[] | null;
};

export async function GET(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const url = new URL(req.url);
  const groupId = url.searchParams.get("groupId");
  const after = url.searchParams.get("after");
  if (!groupId) {
    return NextResponse.json({ error: "groupId manquant" }, { status: 400 });
  }

  try {
    const since = after ?? new Date(Date.now() - 60_000).toISOString();
    const query = supabase
      .from("checkins")
      .select("id, created_at, user_id, group_members(display_name)")
      .eq("group_id", groupId)
      .gt("created_at", since)
      .neq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(10);

    const { data, error } = await query;
    if (error) throw error;

    const events = ((data ?? []) as ActivityRow[])
      .filter((c) => c.user_id !== user.id)
      .map((c) => ({
        id: c.id,
        name:
          c.group_members?.[0]?.display_name?.trim() || "Quelqu'un",
        createdAt: c.created_at,
      }));

    return NextResponse.json({ events });
  } catch {
    // Table checkins absente (migration non appliquée) : aucune activité
    return NextResponse.json({ events: [] });
  }
}