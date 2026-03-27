-- =============================================================================
-- Migration: 014_villas.sql
-- Description: Villa Collection — luxury private villa rentals
--              Filterable by country, bedrooms, price. 9 per page.
-- =============================================================================

create table public.villas (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  slug            text        not null unique,
  country         text        not null,
  neighborhood    text,
  city_region     text,
  villa_type      text        not null default 'Villa',
  bedrooms        int,
  bathrooms       int,
  max_guests      int,
  price_per_night numeric(10,2),
  cover_image_url text,
  source_url      text,
  source          text        not null default 'onefinestay',
  is_active       boolean     not null default true,
  sort_order      int         not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table  public.villas                  is 'Luxury private villa collection — sourced from onefinestay.';
comment on column public.villas.slug             is 'URL-safe unique identifier, e.g. villa-melissa-barbados';
comment on column public.villas.cover_image_url  is 'og:image scraped from source_url or manually set';
comment on column public.villas.price_per_night  is 'Starting price per night in USD';

-- Country filter index (primary filter UI)
create index idx_villas_country         on public.villas(country, is_active, sort_order);
-- Bedroom filter index
create index idx_villas_bedrooms        on public.villas(bedrooms, is_active);
-- Price sort index
create index idx_villas_price           on public.villas(price_per_night, is_active);

create trigger villas_updated_at
  before update on public.villas
  for each row execute procedure public.handle_updated_at();

alter table public.villas enable row level security;
create policy "villas: public read"
  on public.villas for select using (true);
