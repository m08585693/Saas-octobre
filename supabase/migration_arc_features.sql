-- Arc — Fonctionnalités de groupe (freezes, historique, réactions)
-- À exécuter dans le SQL Editor Supabase (une seule fois).
-- Idempotent : peut être relancé sans risque.

-- 1) Jokers de freeze sur chaque appartenance de groupe (2/mois)
alter table public.group_members
  add column if not exists freezes_left integer not null default 2,
  add column if not exists freezes_month text;

-- 2) Historique quotidien des check-ins (alimente heatmap + activité temps réel)
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  group_id uuid not null references public.groups (id) on delete cascade,
  date date not null,
  created_at timestamptz not null default now(),
  unique (user_id, group_id, date)
);

create index if not exists checkins_group_date_idx
  on public.checkins (group_id, date desc);
create index if not exists checkins_user_group_idx
  on public.checkins (user_id, group_id, date desc);

-- 3) Réactions rapides (🔥 💪 👏) sur un check-in
create table if not exists public.checkin_reactions (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (checkin_id, user_id, emoji)
);

create index if not exists checkin_reactions_checkin_idx
  on public.checkin_reactions (checkin_id);

-- 4) Sécurité au niveau des lignes (lecture dans le groupe uniquement)
alter table public.checkins enable row level security;
alter table public.checkin_reactions enable row level security;

drop policy if exists "checkins_select" on public.checkins;
create policy "checkins_select" on public.checkins
  for select to authenticated using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = checkins.group_id and gm.user_id = auth.uid()
    )
  );

drop policy if exists "checkins_insert" on public.checkins;
create policy "checkins_insert" on public.checkins
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "reactions_select" on public.checkin_reactions;
create policy "reactions_select" on public.checkin_reactions
  for select to authenticated using (
    exists (
      select 1 from public.checkins c
      join public.group_members gm on gm.group_id = c.group_id and gm.user_id = auth.uid()
      where c.id = checkin_reactions.checkin_id
    )
  );

drop policy if exists "reactions_insert" on public.checkin_reactions;
create policy "reactions_insert" on public.checkin_reactions
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "reactions_delete" on public.checkin_reactions;
create policy "reactions_delete" on public.checkin_reactions
  for delete to authenticated using (user_id = auth.uid());