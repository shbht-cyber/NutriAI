create table if not exists public.food_entries (
  id uuid primary key default gen_random_uuid(),
  app_user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  meal text not null check (meal in ('breakfast', 'lunch', 'dinner', 'snacks')),
  items jsonb not null default '[]'::jsonb,
  totals jsonb not null default '{"calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  app_user_id uuid primary key references auth.users(id) on delete cascade,
  goals jsonb not null default '{"calories":2200,"protein":140,"carbs":220,"fat":70,"fiber":30,"waterGlasses":8,"weightKg":72,"steps":10000}'::jsonb,
  water integer not null default 0,
  theme text not null default 'dark' check (theme in ('light', 'dark')),
  updated_at timestamptz not null default now()
);

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  app_user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.step_logs (
  id uuid primary key default gen_random_uuid(),
  app_user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  steps integer not null default 0 check (steps >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (app_user_id, log_date)
);

create index if not exists food_entries_app_user_created_idx
  on public.food_entries (app_user_id, created_at desc);

create index if not exists weight_logs_app_user_created_idx
  on public.weight_logs (app_user_id, created_at desc);

create index if not exists step_logs_app_user_date_idx
  on public.step_logs (app_user_id, log_date desc);

alter table public.food_entries enable row level security;
alter table public.user_settings enable row level security;
alter table public.weight_logs enable row level security;
alter table public.step_logs enable row level security;

drop policy if exists "Users can manage their food entries" on public.food_entries;
create policy "Users can manage their food entries"
  on public.food_entries
  for all
  using (auth.uid() = app_user_id)
  with check (auth.uid() = app_user_id);

drop policy if exists "Users can manage their settings" on public.user_settings;
create policy "Users can manage their settings"
  on public.user_settings
  for all
  using (auth.uid() = app_user_id)
  with check (auth.uid() = app_user_id);

drop policy if exists "Users can manage their weight logs" on public.weight_logs;
create policy "Users can manage their weight logs"
  on public.weight_logs
  for all
  using (auth.uid() = app_user_id)
  with check (auth.uid() = app_user_id);

drop policy if exists "Users can manage their step logs" on public.step_logs;
create policy "Users can manage their step logs"
  on public.step_logs
  for all
  using (auth.uid() = app_user_id)
  with check (auth.uid() = app_user_id);
