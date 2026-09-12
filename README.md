# Winter Arc

Application SaaS de discipline : définis un objectif (sport, sommeil, lecture…), suis ton streak quotidien et rejoins des escouades pour rester redevable pendant ton Winter Arc.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack, `src/proxy.ts` pour le middleware)
- [Supabase](https://supabase.com) — auth, base de données (RLS)
- [Stripe](https://stripe.com) — abonnements Pro (mensuel 4,99 € / trimestriel 14 €)
- [Tailwind CSS](https://tailwindcss.com) + [framer-motion](https://motion.dev) + [lucide-react](https://lucide.dev)

## Démarrage local

```bash
npm install
cp .env.local.example .env.local   # puis renseigne les clés
npm run dev -- --port 3222
```

Ouvre http://localhost:3222.

## Variables d'environnement

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon (`sb_publishable_…`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (serveur uniquement) |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (http://localhost:3222 en local) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe (`pk_…`) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (`sk_…`) |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe (`whsec_…`) |
| `STRIPE_PRICE_MONTHLY` | Price ID abonnement mensuel |
| `STRIPE_PRICE_QUARTERLY` | Price ID abonnement trimestriel |

`.env.local` est ignoré par git ; seul `.env.local.example` est versionné (aucun secret).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint |
| `npm start` | Lance le build de production |

## Paiement et webhooks Stripe

- `POST /api/stripe/checkout` — crée une session de paiement (abonnements `monthly`/`quarterly`). Requiert un utilisateur connecté.
- `POST /api/stripe/webhook` — met à jour le plan (`pro`/`free`) dans `profiles` à partir des événements `checkout.session.completed` et `customer.subscription.deleted`.

Mode test uniquement (clés `sk_test_…`). Carte de test : `4242 4242 4242 4242`.

## Déploiement

1. Pousse le dépôt GitHub (branche `main`) : Vercel déploie automatiquement.
2. Renseigne les 9 variables ci-dessus dans le dashboard Vercel (Production + Preview).
3. Déclare un webhook Stripe sur l'endpoint `<SITE_URL>/api/stripe/webhook` avec les événements `checkout.session.completed` et `customer.subscription.deleted`, puis copie le secret dans `STRIPE_WEBHOOK_SECRET`.