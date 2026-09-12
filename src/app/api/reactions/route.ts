import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { REACTION_EMOJIS } from "@/lib/arc";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    checkinId?: string;
    emoji?: string;
  };
  const { checkinId, emoji } = body;
  if (!checkinId || !emoji || !(REACTION_EMOJIS as readonly string[]).includes(emoji)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  try {
    const { data: existing } = await supabase
      .from("checkin_reactions")
      .select("id")
      .eq("checkin_id", checkinId)
      .eq("user_id", user.id)
      .eq("emoji", emoji)
      .maybeSingle();

    if (existing) {
      await supabase.from("checkin_reactions").delete().eq("id", existing.id);
      return NextResponse.json({ action: "removed" });
    }

    await supabase.from("checkin_reactions").insert({
      checkin_id: checkinId,
      user_id: user.id,
      emoji,
    });
    return NextResponse.json({ action: "added" });
  } catch {
    // Table absente (migration non appliquée) : on ne plante pas la page
    return NextResponse.json({ error: "Réaction indisponible" }, { status: 503 });
  }
}