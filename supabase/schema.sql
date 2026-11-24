create extension if not exists pgcrypto;

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  home_team text not null,
  away_team text not null,
  venue text not null,
  starts_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint matches_distinct_teams check (home_team <> away_team)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  match_id uuid not null references public.matches (id) on delete restrict,
  quantity integer not null check (quantity between 1 and 10),
  stand text not null check (stand in ('general', 'premium', 'hospitality')),
  created_at timestamptz not null default now()
);

create index if not exists matches_starts_at_idx
  on public.matches (starts_at);
create index if not exists bookings_user_id_created_at_idx
  on public.bookings (user_id, created_at desc);

alter table public.matches enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Anyone can view matches" on public.matches;
create policy "Anyone can view matches"
  on public.matches for select
  using (true);

drop policy if exists "Users can view their own bookings" on public.bookings;
create policy "Users can view their own bookings"
  on public.bookings for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own bookings" on public.bookings;
create policy "Users can create their own bookings"
  on public.bookings for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own bookings" on public.bookings;
create policy "Users can update their own bookings"
  on public.bookings for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can cancel their own bookings" on public.bookings;
create policy "Users can cancel their own bookings"
  on public.bookings for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select on public.matches to anon, authenticated;
grant select, insert, update, delete on public.bookings to authenticated;
