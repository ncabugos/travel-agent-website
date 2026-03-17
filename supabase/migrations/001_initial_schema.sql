-- =============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Initial schema for the Luxury Travel Agent SaaS platform.
--              Creates agents, global_suppliers, agent_supplier_selections
--              and applies Row Level Security policies.
-- =============================================================================


-- =============================================================================
-- SECTION 1: TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- agents
-- 1:1 extension of auth.users. Created automatically on sign-up via trigger.
-- -----------------------------------------------------------------------------
create table public.agents (
  id            uuid        primary key references auth.users(id) on delete cascade,
  full_name     text        not null,
  agency_name   text        not null,
  custom_domain text        unique,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.agents                is 'Agent profile — one per Supabase auth user.';
comment on column public.agents.id            is 'Mirrors auth.users.id. Not auto-generated.';
comment on column public.agents.custom_domain is 'Optional white-label domain, e.g. travel.myagency.com.';

-- -----------------------------------------------------------------------------
-- global_suppliers
-- Platform-managed master catalogue of hotels, cruises, and luxury partners.
-- Agents can read; only service-role can write.
-- -----------------------------------------------------------------------------
create table public.global_suppliers (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  logo_url        text,
  description     text,
  supplier_type   text        check (supplier_type in ('hotel', 'cruise', 'tour', 'airline', 'other')),
  virtuoso_perks  jsonb,
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now()
);

comment on table public.global_suppliers                 is 'Master supplier catalogue managed by platform admins.';
comment on column public.global_suppliers.virtuoso_perks is 'Flexible JSON: { "breakfast": true, "room_upgrade": true, "spa_credit": "$100", ... }';
comment on column public.global_suppliers.is_active      is 'Soft-delete flag. Inactive suppliers are hidden from agents.';

-- Index for quick filtering by type and active status
create index idx_global_suppliers_type_active
  on public.global_suppliers(supplier_type, is_active);

-- -----------------------------------------------------------------------------
-- agent_supplier_selections
-- Junction table: agents curate a personal shortlist from global_suppliers.
-- -----------------------------------------------------------------------------
create table public.agent_supplier_selections (
  id          uuid        primary key default gen_random_uuid(),
  agent_id    uuid        not null references public.agents(id) on delete cascade,
  supplier_id uuid        not null references public.global_suppliers(id) on delete cascade,
  notes       text,
  pinned_at   timestamptz not null default now(),

  unique(agent_id, supplier_id)
);

comment on table public.agent_supplier_selections        is 'An agent''s curated shortlist of suppliers.';
comment on column public.agent_supplier_selections.notes is 'Private agent-only notes (e.g. preferred contacts, booking tips).';

-- Index for fast per-agent lookups
create index idx_agent_supplier_selections_agent_id
  on public.agent_supplier_selections(agent_id);


-- =============================================================================
-- SECTION 2: FUNCTIONS & TRIGGERS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Auto-update agents.updated_at on every row update
-- -----------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger agents_updated_at
  before update on public.agents
  for each row execute procedure public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- Auto-create agent profile row immediately after a new auth user signs up
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public as $$
begin
  insert into public.agents (id, full_name, agency_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',    'New Agent'),
    coalesce(new.raw_user_meta_data->>'agency_name',  'My Agency')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =============================================================================
-- SECTION 3: ROW LEVEL SECURITY
-- =============================================================================

alter table public.agents                    enable row level security;
alter table public.global_suppliers          enable row level security;
alter table public.agent_supplier_selections enable row level security;

-- -----------------------------------------------------------------------------
-- agents policies
-- An agent can only read or write their own row.
-- DELETE is intentionally omitted — handled server-side via service role.
-- -----------------------------------------------------------------------------
create policy "agents: select own row"
  on public.agents
  for select
  using (auth.uid() = id);

create policy "agents: insert own row"
  on public.agents
  for insert
  with check (auth.uid() = id);

create policy "agents: update own row"
  on public.agents
  for update
  using    (auth.uid() = id)
  with check (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- global_suppliers policies
-- All authenticated users can read. No self-service writes.
-- Platform admins use the service role key (bypasses RLS).
-- -----------------------------------------------------------------------------
create policy "global_suppliers: public read"
  on public.global_suppliers
  for select
  using (true);

-- -----------------------------------------------------------------------------
-- agent_supplier_selections policies
-- Full CRUD, but only on rows belonging to the authenticated agent.
-- -----------------------------------------------------------------------------
create policy "selections: select own"
  on public.agent_supplier_selections
  for select
  using (auth.uid() = agent_id);

create policy "selections: insert own"
  on public.agent_supplier_selections
  for insert
  with check (auth.uid() = agent_id);

create policy "selections: update own"
  on public.agent_supplier_selections
  for update
  using    (auth.uid() = agent_id)
  with check (auth.uid() = agent_id);

create policy "selections: delete own"
  on public.agent_supplier_selections
  for delete
  using (auth.uid() = agent_id);
