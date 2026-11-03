-- Reusable cruise itinerary catalog.
--
-- Itineraries lived as JSON inside cruise_lines.sample_journeys, so they could
-- not be edited, grouped across lines, or turned off for one site. They are now
-- rows. Every advisor site shows the active catalog by default, and
-- agent_cruise_itinerary_exclusions records a site's opt-outs, so a new
-- itinerary reaches every site with no setup.
--
-- nights and route stay text: existing values include "Segments available" and
-- regional phrases such as "the Wachau Valley".
--
-- cruise_lines.sample_journeys is left in place, unread once the app reads this
-- table, so rolling back is one code revert.

create table if not exists public.cruise_collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  intro text,
  hero_image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cruise_itineraries (
  id uuid primary key default gen_random_uuid(),
  cruise_line_id uuid not null references public.cruise_lines(id) on delete cascade,
  collection_id uuid references public.cruise_collections(id) on delete set null,
  -- Unique per line: "The Danube" appears on more than one line.
  slug text not null,
  name text not null,
  nights text not null,
  route text not null,
  blurb text,
  image_url text,
  source_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cruise_line_id, slug)
);

create index if not exists cruise_itineraries_line_sort_idx
  on public.cruise_itineraries (cruise_line_id, sort_order)
  where is_active;

create index if not exists cruise_itineraries_collection_sort_idx
  on public.cruise_itineraries (collection_id, sort_order)
  where is_active;

create table if not exists public.agent_cruise_itinerary_exclusions (
  agent_id uuid not null references public.agents(id) on delete cascade,
  itinerary_id uuid not null references public.cruise_itineraries(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (agent_id, itinerary_id)
);

create index if not exists agent_cruise_itinerary_exclusions_itinerary_idx
  on public.agent_cruise_itinerary_exclusions (itinerary_id);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
-- Catalog: same posture as private_journeys. Public reads active rows, super
-- admins read everything, and writes go through the service-role client.
alter table public.cruise_collections enable row level security;
alter table public.cruise_itineraries enable row level security;
alter table public.agent_cruise_itinerary_exclusions enable row level security;

create policy "cruise_collections: public read active"
  on public.cruise_collections for select
  to anon, authenticated
  using (is_active);

create policy "cruise_collections: super_admin read"
  on public.cruise_collections for select
  using (
    exists (
      select 1 from public.agents a
      where a.id = auth.uid() and a.role = 'super_admin'
    )
  );

create policy "cruise_itineraries: public read active"
  on public.cruise_itineraries for select
  to anon, authenticated
  using (is_active);

create policy "cruise_itineraries: super_admin read"
  on public.cruise_itineraries for select
  using (
    exists (
      select 1 from public.agents a
      where a.id = auth.uid() and a.role = 'super_admin'
    )
  );

-- Opt-outs: public read so public sites can render without auth, and advisors
-- manage their own rows. Rows have no mutable columns, so there is no update.
create policy "agent_cruise_itinerary_exclusions: public read"
  on public.agent_cruise_itinerary_exclusions for select
  using (true);

create policy "agent_cruise_itinerary_exclusions: insert own"
  on public.agent_cruise_itinerary_exclusions for insert
  with check (auth.uid() = agent_id);

create policy "agent_cruise_itinerary_exclusions: delete own"
  on public.agent_cruise_itinerary_exclusions for delete
  using (auth.uid() = agent_id);

-- ─── Backfill ─────────────────────────────────────────────────────────────────
-- Keeps each line's existing card order.
insert into public.cruise_itineraries
  (cruise_line_id, slug, name, nights, route, blurb, image_url, sort_order)
select
  cl.id,
  trim(both '-' from regexp_replace(lower(j.value->>'name'), '[^a-z0-9]+', '-', 'g')),
  j.value->>'name',
  j.value->>'nights',
  j.value->>'route',
  j.value->>'blurb',
  j.value->>'image_url',
  j.ordinality::integer
from public.cruise_lines cl
cross join lateral jsonb_array_elements(coalesce(cl.sample_journeys, '[]'::jsonb))
  with ordinality as j(value, ordinality);

-- ─── First collection ─────────────────────────────────────────────────────────
insert into public.cruise_collections (slug, name, intro, hero_image_url, sort_order)
values (
  'christmas-markets',
  'Christmas Market Cruises',
  'River cruises through Europe''s Christmas markets, sailing late November to December. Ask your advisor about current availability.',
  '/media/cruises/ama-waterways/amawaterways-amamagna-xmas_market-1500.jpg',
  1
);

update public.cruise_itineraries i
set collection_id = (select id from public.cruise_collections where slug = 'christmas-markets'),
    source_url = v.source_url
from (values
  ('viking', 'Danube Christmas Delights', 'https://www.vikingrivercruises.com/cruise-destinations/europe/danube-christmas-delights/2026-budapest-passau/index.html'),
  ('viking', 'Christmas on the Rhine', 'https://www.vikingrivercruises.com/cruise-destinations/europe/christmas-on-the-rhine/2026-amsterdam-basel/index.html'),
  ('viking', 'Christmas on the Rhine & Main', 'https://www.vikingrivercruises.com/cruise-destinations/europe/christmas-on-the-rhine-and-main/2026-nuremberg-basel/index.html'),
  ('amawaterways', 'Christmas Markets on the Danube', 'https://www.amawaterways.com/river-cruises/europe/danube/christmas-markets-danube/christmas-markets'),
  ('amawaterways', 'Christmas Markets on the Rhine', 'https://www.amawaterways.com/river-cruises/europe/rhine/christmas-markets-rhine/christmas-markets'),
  ('amawaterways', 'Iconic Christmas Markets', 'https://www.amawaterways.com/river-cruises/europe/danube/iconic-christmas-markets/christmas-markets'),
  ('uniworld', 'Danube Holiday Markets', 'https://www.uniworld.com/us/river-cruise/central-europe/danube/danube-holiday-markets/2026-budapest-to-passau'),
  ('uniworld', 'Rhine Holiday Markets', 'https://www.uniworld.com/us/river-cruise/central-europe/rhine/rhine-holiday-markets/2026-basel-to-cologne'),
  ('uniworld', 'Classic Christmas Markets', 'https://www.uniworld.com/us/river-cruise/central-europe/rhine/classic-christmas-markets/2026-nuremberg-to-frankfurt')
) as v(line_slug, name, source_url)
join public.cruise_lines cl on cl.slug = v.line_slug
where i.cruise_line_id = cl.id and i.name = v.name;
