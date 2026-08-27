-- Migracia 002: zvoncek.
-- Spusti v Supabase SQL editore. Prva davka (supabase.sql) uz bezi.

create table if not exists public.watchers (
  id         uuid primary key,
  report_id  uuid not null references public.reports(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists watchers_unique
  on public.watchers (report_id, lower(email));

create index if not exists watchers_report_idx on public.watchers (report_id);

alter table public.watchers enable row level security;
