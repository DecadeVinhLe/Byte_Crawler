-- ByteCrawler database schema (Supabase / PostgreSQL).
-- Run this once: Supabase dashboard > SQL Editor > New query > paste > Run.
-- It is safe to run again; every statement checks before it creates.

-- 1. Profiles: one row per account, holds the display name.
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Adventurer'
                 check (char_length(display_name) between 2 and 40),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 2. Progress: one row per account, holds everything the game remembers.
--    done  = cleared checkpoints, e.g. {"0":1,"1":1}
--    quiz  = answered quick challenges, e.g. {"0":{"p":2}}
--    rec   = boss record: {best,last,wins,losses,hist:[{ok,ms,at}]}
create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  xp         integer not null default 0 check (xp between 0 and 100000),
  done       jsonb   not null default '{}'::jsonb check (jsonb_typeof(done) = 'object'),
  quiz       jsonb   not null default '{}'::jsonb check (jsonb_typeof(quiz) = 'object'),
  boss       smallint not null default 0 check (boss in (0, 1)),
  rec        jsonb   not null default '{}'::jsonb check (jsonb_typeof(rec) = 'object'),
  updated_at timestamptz not null default now()
);

-- 3. Keep updated_at current on every change.
create or replace function public.bc_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists bc_profiles_touch on public.profiles;
create trigger bc_profiles_touch before update on public.profiles
  for each row execute function public.bc_touch_updated_at();

drop trigger if exists bc_progress_touch on public.progress;
create trigger bc_progress_touch before update on public.progress
  for each row execute function public.bc_touch_updated_at();

-- 4. When someone signs up, create their profile and an empty progress row.
--    The name comes from the sign-up form (stored as user metadata "name").
create or replace function public.bc_handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  nm text := left(trim(coalesce(new.raw_user_meta_data ->> 'name', '')), 40);
begin
  if char_length(nm) < 2 then
    nm := left(coalesce(split_part(new.email, '@', 1), ''), 40);
  end if;
  if char_length(nm) < 2 then
    nm := 'Adventurer';
  end if;
  insert into public.profiles (id, display_name) values (new.id, nm)
    on conflict (id) do nothing;
  insert into public.progress (user_id) values (new.id)
    on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists bc_on_auth_user_created on auth.users;
create trigger bc_on_auth_user_created after insert on auth.users
  for each row execute function public.bc_handle_new_user();

-- 5. Row Level Security: a signed-in user can only see and change their own rows.
--    The public "anon" key in js/config.js can do nothing without a login.
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own" on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "progress: read own" on public.progress;
create policy "progress: read own" on public.progress
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "progress: insert own" on public.progress;
create policy "progress: insert own" on public.progress
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "progress: update own" on public.progress;
create policy "progress: update own" on public.progress
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- No delete policies: accounts are removed from the Supabase dashboard
-- (Authentication > Users), which deletes the rows above automatically.

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.progress to authenticated;
