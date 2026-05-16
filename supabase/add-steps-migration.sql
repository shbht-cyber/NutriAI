create table if not exists public.step_logs (
  id uuid primary key default gen_random_uuid(),
  app_user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  steps integer not null default 0 check (steps >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (app_user_id, log_date)
);

create index if not exists step_logs_app_user_date_idx
  on public.step_logs (app_user_id, log_date desc);

alter table public.step_logs enable row level security;

drop policy if exists "Users can manage their step logs" on public.step_logs;
create policy "Users can manage their step logs"
  on public.step_logs
  for all
  using (auth.uid() = app_user_id)
  with check (auth.uid() = app_user_id);

update public.user_settings
set goals = goals || '{"steps":10000}'::jsonb
where not (goals ? 'steps');
