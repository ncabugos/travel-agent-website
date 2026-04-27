-- =============================================================================
-- Migration: 023_agent_hotel_program_selections.sql
-- Description: Per-agent curated list of Hotel Programs that appear on their
--              public site (/experiences and homepage teaser). Mirrors the
--              pattern from 016 (agent_blog_preferences).
-- =============================================================================

create table if not exists public.agent_hotel_program_selections (
  agent_id    uuid        not null references public.agents(id)         on delete cascade,
  program_id  uuid        not null references public.hotel_programs(id) on delete cascade,
  is_enabled  boolean     not null default true,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  primary key (agent_id, program_id)
);

comment on table public.agent_hotel_program_selections is
  'Per-agent curated list of Hotel Programs. If an agent has zero rows here, '
  'their site falls back to the global active set ordered by hotel_programs.sort_order.';

create index if not exists idx_agent_hotel_program_selections_agent
  on public.agent_hotel_program_selections(agent_id, is_enabled, sort_order);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
alter table public.agent_hotel_program_selections enable row level security;

-- Public read so the public site can render the selections without auth.
-- (Same posture as hotel_programs and agent_blog_preferences on read.)
create policy "agent_hotel_program_selections: public read"
  on public.agent_hotel_program_selections for select
  using (true);

-- Agent manages their own rows (writes gated to auth.uid() = agent_id).
-- Admin uses service_role which bypasses RLS.
create policy "agent_hotel_program_selections: insert own"
  on public.agent_hotel_program_selections for insert
  with check (auth.uid() = agent_id);

create policy "agent_hotel_program_selections: update own"
  on public.agent_hotel_program_selections for update
  using (auth.uid() = agent_id);

create policy "agent_hotel_program_selections: delete own"
  on public.agent_hotel_program_selections for delete
  using (auth.uid() = agent_id);
