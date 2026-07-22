-- 053_agent_modules.sql
-- Per-module entitlements (business model v2, docs/business-model-v2.md).
--
-- agent_modules is the source of truth for which à-la-carte modules an agent
-- has purchased. Billing rides the agent's existing Stripe subscription as
-- subscription items; the webhook and the portal module API keep this table in
-- sync with Stripe. Legacy Growth/Custom tiers keep their bundled features via
-- lib/tier-features.ts (featureAllowed checks tier OR module) — this table only
-- records modules bought à la carte.
--
-- agents.active_modules is a derived cache of the active module keys, refreshed
-- on every write to agent_modules, so the public template pages (which already
-- select the agent row on every request) get entitlements without a join.

create table if not exists public.agent_modules (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  module_key text not null check (module_key in (
    'editorial', 'editorial-plus', 'directories', 'instagram', 'villas'
  )),
  status text not null default 'active' check (status in ('active', 'canceled')),
  stripe_subscription_item_id text,
  stripe_price_id text,
  activated_at timestamptz not null default now(),
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (agent_id, module_key)
);

create index if not exists agent_modules_agent_idx on public.agent_modules (agent_id);

alter table public.agent_modules enable row level security;

-- Agents read their own module rows (agents.id = auth.uid()).
drop policy if exists "agent_modules: own read" on public.agent_modules;
create policy "agent_modules: own read"
  on public.agent_modules for select
  using (agent_id = auth.uid());

-- super_admin full access (writes normally come from the service-role client,
-- which bypasses RLS; this covers admin-console reads via the RSC client).
drop policy if exists "agent_modules: super_admin all" on public.agent_modules;
create policy "agent_modules: super_admin all"
  on public.agent_modules for all
  using (exists (select 1 from public.agents where id = auth.uid() and role = 'super_admin'))
  with check (exists (select 1 from public.agents where id = auth.uid() and role = 'super_admin'));

-- Derived cache of active module keys on the agent row.
alter table public.agents
  add column if not exists active_modules text[] not null default '{}';

comment on column public.agents.active_modules is
  'Derived cache of active agent_modules.module_key values. Maintained by the module API and Stripe webhook; do not write directly.';
