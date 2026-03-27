-- =============================================================================
-- Migration: 009_template2_collections.sql
-- Description: Shared CMS collections for Template 2 (Baseline Travel Template V1)
--              Also used by any future template. Creates:
--              1. properties_destinations  (Collection A)
--              2. exclusive_experiences    (Collection B)
--              3. featured_partners        (Collection C)
--              4. agent_partner_toggles    (junction)
--              5. cruise_lines             (Cruise Verticals)
--              6. program_featured_properties (Hotel Program Properties)
-- =============================================================================


-- =============================================================================
-- 1. properties_destinations
-- =============================================================================

create table public.properties_destinations (
  id             uuid        primary key default gen_random_uuid(),
  name           text        not null,
  location       text        not null,
  description    text,
  image_gallery  jsonb       not null default '[]'::jsonb,
  booking_link   text,
  is_featured    boolean     not null default false,
  sort_order     int         not null default 0,
  is_active      boolean     not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table  public.properties_destinations              is 'Global catalogue of luxury properties & destinations (Collection A).';
comment on column public.properties_destinations.image_gallery is 'JSONB array of image URLs: ["url1","url2",...]';

create index idx_properties_destinations_active
  on public.properties_destinations(is_active, sort_order);

create trigger properties_destinations_updated_at
  before update on public.properties_destinations
  for each row execute procedure public.handle_updated_at();

alter table public.properties_destinations enable row level security;
create policy "properties_destinations: public read"
  on public.properties_destinations for select using (true);


-- =============================================================================
-- 2. exclusive_experiences
-- =============================================================================

create table public.exclusive_experiences (
  id                uuid        primary key default gen_random_uuid(),
  title             text        not null,
  supplier_tag      text,
  location_tag      text,
  description       text,
  image_url         text,
  itinerary_length  text,
  sort_order        int         not null default 0,
  is_active         boolean     not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.exclusive_experiences is 'Curated travel experiences / packages (Collection B).';

create index idx_exclusive_experiences_active
  on public.exclusive_experiences(is_active, sort_order);

create trigger exclusive_experiences_updated_at
  before update on public.exclusive_experiences
  for each row execute procedure public.handle_updated_at();

alter table public.exclusive_experiences enable row level security;
create policy "exclusive_experiences: public read"
  on public.exclusive_experiences for select using (true);


-- =============================================================================
-- 3. featured_partners
-- =============================================================================

create table public.featured_partners (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  slug         text        not null unique,
  logo_url     text,
  category     text        not null check (category in ('cruise', 'hotel', 'tour', 'air')),
  is_preferred boolean     not null default false,
  sort_order   int         not null default 0,
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table  public.featured_partners          is 'Partner logos for the Featured Partners grid (Collection C).';
comment on column public.featured_partners.category is 'cruise | hotel | tour | air';

create index idx_featured_partners_category_active
  on public.featured_partners(category, is_active, sort_order);

create trigger featured_partners_updated_at
  before update on public.featured_partners
  for each row execute procedure public.handle_updated_at();

alter table public.featured_partners enable row level security;
create policy "featured_partners: public read"
  on public.featured_partners for select using (true);


-- =============================================================================
-- 4. agent_partner_toggles (junction)
-- =============================================================================

create table public.agent_partner_toggles (
  id         uuid    primary key default gen_random_uuid(),
  agent_id   uuid    not null references public.agents(id) on delete cascade,
  partner_id uuid    not null references public.featured_partners(id) on delete cascade,
  is_visible boolean not null default true,
  unique(agent_id, partner_id)
);

comment on table public.agent_partner_toggles is 'Per-agent visibility toggles for featured partners.';

create index idx_agent_partner_toggles_agent
  on public.agent_partner_toggles(agent_id);

alter table public.agent_partner_toggles enable row level security;
create policy "agent_partner_toggles: select own"
  on public.agent_partner_toggles for select using (auth.uid() = agent_id);
create policy "agent_partner_toggles: insert own"
  on public.agent_partner_toggles for insert with check (auth.uid() = agent_id);
create policy "agent_partner_toggles: update own"
  on public.agent_partner_toggles for update using (auth.uid() = agent_id) with check (auth.uid() = agent_id);
create policy "agent_partner_toggles: delete own"
  on public.agent_partner_toggles for delete using (auth.uid() = agent_id);


-- =============================================================================
-- 5. cruise_lines
-- =============================================================================

create table public.cruise_lines (
  id             uuid        primary key default gen_random_uuid(),
  name           text        not null,
  slug           text        not null unique,
  logo_url       text,
  hero_image_url text,
  description    text,
  cruise_type    text        not null check (cruise_type in ('ocean', 'river', 'yacht')),
  highlights     jsonb       not null default '[]'::jsonb,
  ships          jsonb       not null default '[]'::jsonb,
  sort_order     int         not null default 0,
  is_active      boolean     not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table  public.cruise_lines              is 'Luxury cruise lines — ocean, river, and yacht.';
comment on column public.cruise_lines.cruise_type  is 'ocean | river | yacht';
comment on column public.cruise_lines.highlights   is 'JSONB array of strings: ["All-inclusive luxury","Butler service",...]';
comment on column public.cruise_lines.ships        is 'JSONB array: [{"name":"Seven Seas Splendor","image":"/media/..."}]';

create index idx_cruise_lines_type_active
  on public.cruise_lines(cruise_type, is_active, sort_order);

create trigger cruise_lines_updated_at
  before update on public.cruise_lines
  for each row execute procedure public.handle_updated_at();

alter table public.cruise_lines enable row level security;
create policy "cruise_lines: public read"
  on public.cruise_lines for select using (true);


-- =============================================================================
-- 6. program_featured_properties
-- =============================================================================

create table public.program_featured_properties (
  id            uuid        primary key default gen_random_uuid(),
  program_slug  text        not null,
  name          text        not null,
  location      text        not null,
  image_url     text,
  description   text,
  booking_link  text,
  sort_order    int         not null default 0,
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table  public.program_featured_properties              is '6 featured properties per hotel program, shown on program detail pages.';
comment on column public.program_featured_properties.program_slug is 'Matches hotel_programs.slug. Logical FK for flexibility.';

create index idx_program_featured_properties_slug
  on public.program_featured_properties(program_slug, is_active, sort_order);

create trigger program_featured_properties_updated_at
  before update on public.program_featured_properties
  for each row execute procedure public.handle_updated_at();

alter table public.program_featured_properties enable row level security;
create policy "program_featured_properties: public read"
  on public.program_featured_properties for select using (true);
