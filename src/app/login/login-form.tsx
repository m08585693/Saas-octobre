"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";
import AuthForm from "@/components/auth-form";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {});

  return (
    <AuthForm
      action={action}
      pending={pending}
      error={state?.error}
      title="Connexion"
      subtitle="Retrouvez vos groupes de motivation"
      submitLabel="Se connecter"
      footerLabel="Pas encore de compte ?"
      footerHref="/register"
      footerLinkLabel="S'inscrire"
    />
  );
}