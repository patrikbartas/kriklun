-- Kriklun: cela databaza. Prilep do Supabase SQL editora a spusti.
-- Dve tabulky a nic viac. Ziadny register prvkov, ziadne podorysy.
-- Fotka je popis problemu aj jeho lokalizacia zaroven.

create table if not exists public.reports (
  id          uuid primary key,
  kind        text not null default 'problem',   -- 'problem' | 'oznam'
  text        text not null default '',
  zone        text not null,
  author      text not null,
  photo_url   text,
  status      text not null default 'nahlasene', -- nahlasene|vidime|riesi_sa|teraz_nejde|hotove
  status_note text,
  expires_at  timestamptz,
  plus_ones   integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists reports_created_idx on public.reports (created_at desc);

-- RLS je zapnute a zamerne bez politik.
-- Klient nikdy nesiaha na databazu priamo, vsetko ide cez /api/* so service role klucom.
-- Takze anon kluc nema pristup k nicomu a netreba riesit ziadne pravidla.
alter table public.reports enable row level security;

-- Atomicke +1, aby sa dva sucasne kliky neprepisali.
create or replace function public.plus_one(row_id uuid)
returns public.reports
language sql
as $$
  update public.reports
     set plus_ones = plus_ones + 1
   where id = row_id
  returning *;
$$;

-- Bucket na fotky, verejne citatelny (zapisuje len server).
insert into storage.buckets (id, name, public)
values ('fotky', 'fotky', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Zvoncek: kto chce dostat mail, ked sa zmeni stav konkretneho hlasenia.
-- Ziadny ucet, len mailova adresa naviazana na jedno hlasenie.
-- ---------------------------------------------------------------------------

create table if not exists public.watchers (
  id         uuid primary key,
  report_id  uuid not null references public.reports(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

-- Jeden mail moze sledovat jedno hlasenie iba raz.
create unique index if not exists watchers_unique
  on public.watchers (report_id, lower(email));

create index if not exists watchers_report_idx on public.watchers (report_id);

alter table public.watchers enable row level security;
