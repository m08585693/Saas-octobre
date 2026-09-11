"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  { title: "Votre objectif", options: ["Générer des revenus", "Développer mon audience", "Gagner du temps"] },
  { title: "Votre plateforme", options: ["TikTok", "YouTube Shorts", "Instagram Reels"] },
  { title: "Votre rythme", options: ["Quelques vidéos", "Chaque semaine", "Tous les jours"] },
];

const features = [
  ["01", "Vues = Argent", "Transformez chaque vue en opportunité avec des formats qui captent l’attention."],
  ["02", "Automatisations", "De l’idée à la publication, Remakeit orchestre votre workflow sans friction."],
  ["03", "Tout en un", "Scripts, montage, sous-titres et déclinaisons réunis dans un seul espace."],
];

export function Landing() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const current = steps[step];

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">REMAKEIT<span className="text-primary">.</span></Link>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex"><a href="#fonctionnalites">Fonctionnalités</a><a href="#process">Comment ça marche</a><a href="#dashboard">Aperçu</a></div>
        <Link href="/register" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary">Commencer</Link>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-32 lg:pt-24">
        <div className="absolute inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(111,57,255,.18),transparent_65%)]" />
        <div className="relative z-10">
          <div className="mb-7 inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-wide text-primary">#1 OUTIL IA <span className="mx-2 text-muted-foreground">/</span> +50k utilisateurs actifs</div>
          <h1 className="max-w-3xl font-display text-5xl font-bold leading-[.98] tracking-[-.055em] text-balance sm:text-7xl lg:text-[6.4rem]">Créez des vidéos<br /><span className="text-primary">virales</span> qui<br />rapportent.</h1>
          <p className="mt-8 max-w-xl text-lg leading-7 text-muted-foreground">Remakeit transforme vos idées en contenus courts qui attirent les vues, construisent votre audience et génèrent des revenus — automatiquement.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4"><Link href="/register" className="rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-[0_0_30px_rgba(124,77,255,.3)] transition hover:scale-[1.02]">Créer ma première vidéo <span className="ml-2">↗</span></Link><a href="#process" className="rounded-full border border-border px-7 py-4 font-semibold transition hover:border-primary">Voir comment ça marche</a></div>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground"><span className="flex -space-x-2"><span className="size-7 rounded-full border-2 border-background bg-primary/70" /><span className="size-7 rounded-full border-2 border-background bg-secondary" /><span className="size-7 rounded-full border-2 border-background bg-accent" /></span> Rejoignez 50 000 créateurs · Sans carte bancaire</div>
        </div>
        <div className="relative z-10 min-h-[390px] rounded-[2rem] border border-border bg-card p-5 shadow-2xl shadow-primary/10 sm:p-7">
          <div className="mb-7 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-primary">Studio / onboarding</p><p className="mt-2 font-display text-2xl font-semibold">Construisons votre machine à contenu.</p></div><span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">0{step + 1} / 03</span></div>
          <div className="mb-8 flex gap-2">{steps.map((_, index) => <div key={index} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-primary" : "bg-secondary"}`} />)}</div>
          <p className="mb-4 text-sm text-muted-foreground">Étape {step + 1}</p><h2 className="font-display text-3xl font-semibold">{current.title}</h2>
          <div className="mt-6 grid gap-3">{current.options.map((option) => <button key={option} onClick={() => setSelected(option)} className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left transition ${selected === option ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background/40 text-muted-foreground hover:border-primary/50"}`}>{option}<span className={selected === option ? "text-primary" : "text-muted-foreground"}>↗</span></button>)}</div>
          <button onClick={() => { setStep((step + 1) % steps.length); setSelected(""); }} className="mt-6 w-full rounded-xl bg-foreground px-4 py-3 font-semibold text-background transition hover:bg-primary hover:text-primary-foreground">{step === steps.length - 1 ? "Lancer mon espace" : "Continuer"}</button>
        </div>
      </section>

      <section id="fonctionnalites" className="border-y border-border bg-card/40 px-6 py-20 lg:px-10"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[.2em] text-primary">Une seule plateforme</p><h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">Votre contenu.<br /><span className="text-muted-foreground">En pilote automatique.</span></h2></div><div className="mt-14 grid gap-4 md:grid-cols-3">{features.map(([number, title, copy]) => <article key={number} className="group min-h-64 rounded-2xl border border-border bg-background p-7 transition hover:-translate-y-1 hover:border-primary/60"><span className="font-mono text-sm text-primary">{number}</span><div className="mt-20"><h3 className="font-display text-2xl font-semibold">{title}</h3><p className="mt-3 leading-6 text-muted-foreground">{copy}</p></div></article>)}</div></div></section>

      <section id="process" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-primary">Le système Remakeit</p><h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">Une idée.<br />Des milliers de vues.</h2></div><div className="flex flex-col gap-8 text-lg leading-7 text-muted-foreground"><p><span className="mr-4 font-mono text-primary">→</span>Décrivez votre idée et choisissez le ton qui vous ressemble.</p><p><span className="mr-4 font-mono text-primary">→</span>L&apos;IA écrit, monte et décline votre contenu pour chaque plateforme.</p><p><span className="mr-4 font-mono text-primary">→</span>Publiez, analysez et recommencez avec ce qui fonctionne vraiment.</p><Link href="/register" className="mt-3 w-fit rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground">Entrer dans le studio ↗</Link></div></section>

      <footer className="border-t border-border px-6 py-8 text-sm text-muted-foreground lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span className="font-display font-bold text-foreground">REMAKEIT<span className="text-primary">.</span></span><span>© 2026 Remakeit. Créé pour les créateurs.</span></div></footer>
    </main>
  );
}

export default Landing;
