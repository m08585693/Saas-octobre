"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdmin } from "@/lib/supabase/admin";

async function getSiteOrigin(): Promise<string> {
  const headersList = await headers();
  const host = await headersList.get("x-forwarded-host") ?? await headersList.get("host");
  const proto = await headersList.get("x-forwarded-proto") ?? "https";
  if (host) {
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export type AuthState = {
  error?: string;
};

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function register(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const name = String(formData.get("name") ?? "").trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Profil par défaut (plan gratuit)
  if (data.user) {
    await supabase.from("profiles").upsert(
      { user_id: data.user.id, plan: "free" },
      { onConflict: "user_id" }
    );
  }

  // Parrainage : l'utilisateur arrive via un lien d'invitation
  const refCode = String(formData.get("ref") ?? "").trim();
  if (data.user && refCode && refCode !== data.user.id) {
    const { data: referrer } = await createAdmin()
      .from("profiles")
      .select("user_id")
      .eq("user_id", refCode)
      .maybeSingle();

    if (referrer) {
      await createAdmin().from("referrals").insert({
        referrer_id: refCode,
        referred_user_id: data.user.id,
      });
    }
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}