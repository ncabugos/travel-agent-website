-- Full itinerary pages: day-by-day content, sailing dates, and what each line includes.
--
-- Direction and ship belong to a sailing, not the itinerary: the same route runs
-- both ways on different ships, sometimes on the same day. So they live on
-- cruise_itinerary_departures. days_direction says which way `days` is written.
--
-- departures_note flags a list known to be partial, because a line's site did not
-- show every sailing.

alter table public.cruise_itineraries
  add column if not exists overview text,
  add column if not exists highlights jsonb not null default '[]'::jsonb,
  add column if not exists region text,
  add column if not exists countries text,
  add column if not exists days_direction text,
  add column if not exists days jsonb not null default '[]'::jsonb,
  add column if not exists departures_note text;

alter table public.cruise_lines
  add column if not exists included jsonb not null default '[]'::jsonb;

create table if not exists public.cruise_itinerary_departures (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references public.cruise_itineraries(id) on delete cascade,
  departs_on date not null,
  embark text not null,
  disembark text not null,
  ship text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists cruise_itinerary_departures_unique_idx
  on public.cruise_itinerary_departures (itinerary_id, departs_on, embark, disembark, coalesce(ship, ''));

create index if not exists cruise_itinerary_departures_itinerary_date_idx
  on public.cruise_itinerary_departures (itinerary_id, departs_on);

alter table public.cruise_itinerary_departures enable row level security;

create policy "cruise_itinerary_departures: public read active"
  on public.cruise_itinerary_departures for select
  using (
    exists (
      select 1 from public.cruise_itineraries i
      where i.id = itinerary_id and i.is_active
    )
  );

create policy "cruise_itinerary_departures: super_admin read"
  on public.cruise_itinerary_departures for select
  using (
    exists (
      select 1 from public.agents a
      where a.id = auth.uid() and a.role = 'super_admin'
    )
  );
