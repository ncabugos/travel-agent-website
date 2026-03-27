-- =============================================================================
-- Migration: 015_hotels.sql
-- Description: Luxury Hotels — Virtuoso partner database
--              1,795 hotels, server-side paginated, filterable by country/vibe/type.
-- =============================================================================

create table public.luxury_hotels (
  id              uuid        primary key default gen_random_uuid(),
  hotel_id        text        unique,
  name            text        not null,
  slug            text        not null unique,
  city            text,
  state_region    text,
  country         text,
  neighborhood    text,
  hotel_company   text,
  hotel_type      text,
  room_count      int,
  room_style      text,
  vibe            text,
  experiences     text[]      not null default '{}',
  description     text,
  cover_image_url text,
  detail_url      text,
  is_active       boolean     not null default true,
  sort_order      int         not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table  public.luxury_hotels                  is 'Virtuoso luxury hotel collection — 1,795 properties worldwide.';
comment on column public.luxury_hotels.hotel_id         is 'Virtuoso Hotel ID from source spreadsheet';
comment on column public.luxury_hotels.slug             is 'URL-safe identifier, e.g. 100-princes-street-uk';
comment on column public.luxury_hotels.experiences      is 'Array of experience tags, e.g. {Local Immersion, Landmarks}';
comment on column public.luxury_hotels.vibe             is 'e.g. Sophisticated, Hip, Romantic, Adventurous';
comment on column public.luxury_hotels.cover_image_url  is 'Virtuoso CDN image URL or local override';

-- Country filter (most common)
create index idx_hotels_country   on public.luxury_hotels(country, is_active, sort_order);
-- Vibe + type filters
create index idx_hotels_vibe      on public.luxury_hotels(vibe, is_active);
create index idx_hotels_type      on public.luxury_hotels(hotel_type, is_active);
-- Full-text search on name + city + country
create index idx_hotels_fts       on public.luxury_hotels
  using gin(to_tsvector('english',
    coalesce(name,'') || ' ' ||
    coalesce(city,'') || ' ' ||
    coalesce(country,'') || ' ' ||
    coalesce(hotel_company,'')
  ));

create trigger luxury_hotels_updated_at
  before update on public.luxury_hotels
  for each row execute procedure public.handle_updated_at();

alter table public.luxury_hotels enable row level security;
create policy "luxury_hotels: public read"
  on public.luxury_hotels for select using (true);
