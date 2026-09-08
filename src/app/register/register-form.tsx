"use client";

import { useActionState } from "react";
import { register } from "@/app/actions";
import AuthForm from "@/components/auth-form";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(register, {});

  return (
    <AuthForm
      action={action}
      pending={pending}
      error={state?.error}
      title="Créer un compte"
      subtitle="Rejoignez des groupes de motivation et tenez vos objectifs"
      submitLabel="S'inscrire"
      footerLabel="Déjà un compte ?"
      footerHref="/login"
      footerLinkLabel="Se connecter"
      registerMode
      success={state?.success}
    />
  );
}