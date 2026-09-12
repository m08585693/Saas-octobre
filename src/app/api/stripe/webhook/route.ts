import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const stripe = new Stripe(secretKey);
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      signature,
      webhookSecret
    );
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id ?? session.metadata?.user_id;

    if (userId) {
      await createAdmin()
        .from("profiles")
        .upsert(
          {
            user_id: userId,
            plan: "pro",
            stripe_customer_id:
              typeof session.customer === "string" ? session.customer : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === "string" ? sub.customer : null;
    if (customerId) {
      const { data } = await createAdmin()
        .from("profiles")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .maybeSingle();
      if (data) {
        await createAdmin()
          .from("profiles")
          .update({ plan: "free", updated_at: new Date().toISOString() })
          .eq("user_id", data.user_id);
      }
    }
  }

  return NextResponse.json({ received: true });
}