import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const PLANS: Record<string, { priceEnv: string; monthly: number }> = {
  monthly: { priceEnv: process.env.STRIPE_PRICE_MONTHLY ?? "", monthly: 499 },
  yearly: { priceEnv: process.env.STRIPE_PRICE_YEARLY ?? "", monthly: 0 },
};

function getOrigin(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-host");
  if (forwarded) {
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    return `${proto}://${forwarded}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Paiement non configuré (clé Stripe manquante)" },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as { plan?: string };
  const plan = body.plan === "yearly" ? "yearly" : "monthly";
  const priceId = PLANS[plan].priceEnv;
  if (!priceId) {
    return NextResponse.json(
      { error: "Prix Stripe non configuré" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey);
  const origin = getOrigin(req);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/dashboard?paywall=1`,
      metadata: { user_id: user.id },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Échec de création de la session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Erreur Stripe lors de la création de la session" },
      { status: 500 }
    );
  }
}