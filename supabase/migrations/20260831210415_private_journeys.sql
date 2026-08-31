-- 056_private_journeys.sql
-- Creates public.private_journeys — the catalogue behind /private-jets and
-- /safaris.
--
-- Four Seasons Private Jet, Abercrombie & Kent and Micato Safaris share a
-- shape: a brand, a hero, a gallery, an intro, the regions it covers, what the
-- experience is like, illustrative itineraries, and the partner benefits we add.
-- That is the same shape `cruise_lines` already carries, so this mirrors it
-- rather than inventing a second vocabulary.
--
-- `journey_type` discriminates the two public surfaces the same way
-- `cruise_lines.cruise_type` discriminates ocean / river / yacht behind three
-- different presentations. Splitting these into two tables would duplicate the
-- schema, the reader, and the admin surface for no gain.
--
-- `price_from_usd` is a real column rather than prose because these are the
-- products where the number is the positioning — a private-jet itinerary is
-- sold on being a $150k decision. `price_note` carries the qualifier
-- ("per person, double occupancy", "2026 departures") so the figure is never
-- shown bare.

create table if not exists public.private_journeys (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  journey_type text not null check (journey_type in ('jet', 'safari', 'tour')),

  logo_url text,
  logo_url_white text,
  logo_url_black text,
  hero_image_url text,
  slider_images jsonb not null default '[]'::jsonb,

  tagline text,
  description text,
  intro jsonb,

  destinations jsonb not null default '[]'::jsonb,
  experiences jsonb not null default '[]'::jsonb,
  sample_journeys jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,

  price_from_usd integer,
  price_note text,

  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Both public surfaces read "active journeys of this type, in display order".
create index if not exists private_journeys_type_sort_idx
  on public.private_journeys (journey_type, sort_order)
  where is_active;

alter table public.private_journeys enable row level security;

-- Public read of active rows only. Matches the hotel_programs / cruise_lines
-- catalogues: the content is marketing copy shown on public advisor sites.
-- Inactive rows stay invisible so the operator can stage a brand before launch.
drop policy if exists "private_journeys: public read active" on public.private_journeys;
create policy "private_journeys: public read active"
  on public.private_journeys for select
  to anon, authenticated
  using (is_active);

-- Super admins read everything, including staged rows.
drop policy if exists "private_journeys: super_admin read" on public.private_journeys;
create policy "private_journeys: super_admin read"
  on public.private_journeys for select
  using (
    exists (
      select 1 from public.agents a
      where a.id = auth.uid() and a.role = 'super_admin'
    )
  );

-- No INSERT/UPDATE/DELETE policies: writes go through the service-role client
-- (admin console + seeds), which bypasses RLS. Same posture as hotel_programs.
