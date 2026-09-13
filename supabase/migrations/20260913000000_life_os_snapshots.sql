create table if not exists public.life_os_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists life_os_snapshots_user_key_idx
  on public.life_os_snapshots (user_key);

alter table public.life_os_snapshots enable row level security;

create policy life_os_snapshots_anon_local
  on public.life_os_snapshots
  for all
  to anon
  using (user_key = 'local')
  with check (user_key = 'local');

create policy life_os_snapshots_authenticated_local
  on public.life_os_snapshots
  for all
  to authenticated
  using (user_key = 'local')
  with check (user_key = 'local');

comment on table public.life_os_snapshots is 'Personal Life OS complete RepositorySnapshot backups';
comment on column public.life_os_snapshots.payload is 'Complete versioned RepositorySnapshot JSON';
