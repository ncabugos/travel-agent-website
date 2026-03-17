-- =============================================================================
-- Migration: 002_hotel_programs.sql
-- Description: Hotel Programs table — luxury consortium program catalogue.
--              Powers the "Exclusive Hotel Programs" section on agent websites.
-- =============================================================================


-- =============================================================================
-- SECTION 1: TABLE
-- =============================================================================

create table public.hotel_programs (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        not null unique,                          -- URL-safe identifier, e.g. "four-seasons-preferred-partner"
  name             text        not null,                                 -- Display name, e.g. "Four Seasons Preferred Partner"
  logo_url         text,                                                 -- Path/URL to consortium logo SVG or PNG
  tagline          text,                                                 -- Short programme tagline (1 sentence)
  description      text,                                                 -- 2-4 sentence description
  category         text        check (category in (                     -- Consortium category
    'invitation_only',
    'brand_programme',
    'luxury_collection',
    'global_network'
  )),
  property_count   int,                                                  -- Approx. number of participating properties
  benefits         jsonb       not null default '[]'::jsonb,            -- Array of { "title": "", "description": "" }
  eligibility_notes text,                                               -- Who qualifies / how to access
  booking_notes    text,                                                -- How to book / what to mention
  sort_order       int         not null default 0,                      -- Manual display ordering
  is_active        boolean     not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table  public.hotel_programs                is 'Luxury hotel consortium programmes — shown on agent "Hotel Programs" pages.';
comment on column public.hotel_programs.slug           is 'Kebab-case URL slug, unique. Used in routing.';
comment on column public.hotel_programs.benefits       is 'JSONB array: [{ "title": "Daily Breakfast", "description": "Full breakfast for two, daily." }]';
comment on column public.hotel_programs.category       is 'invitation_only | brand_programme | luxury_collection | global_network';

-- Index for active ordering
create index idx_hotel_programs_active_order
  on public.hotel_programs(is_active, sort_order);


-- =============================================================================
-- SECTION 2: TRIGGER
-- =============================================================================

create trigger hotel_programs_updated_at
  before update on public.hotel_programs
  for each row execute procedure public.handle_updated_at();


-- =============================================================================
-- SECTION 3: ROW LEVEL SECURITY
-- =============================================================================

alter table public.hotel_programs enable row level security;

-- All authenticated users (and public) can read active programmes
create policy "hotel_programs: public read"
  on public.hotel_programs
  for select
  using (true);

-- Only service-role can insert / update / delete (platform admin only)
