-- =============================================================================
-- Migration: 017_agent_portal.sql
-- Description: Creates edit_requests table for agent site modifications.
-- =============================================================================

create type public.edit_request_status as enum ('pending', 'in_progress', 'completed', 'rejected');

create table public.edit_requests (
  id              uuid        primary key default gen_random_uuid(),
  agent_id        uuid        not null references public.agents(id) on delete cascade,
  subject         text        not null,
  description     text,
  attachment_urls text[]      not null default '{}',
  status          public.edit_request_status not null default 'pending',
  admin_notes     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.edit_requests is 'Agent requests for site changes.';

create trigger edit_requests_updated_at
  before update on public.edit_requests
  for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.edit_requests enable row level security;

create policy "edit_requests: select own"
  on public.edit_requests for select using (auth.uid() = agent_id);

create policy "edit_requests: insert own"
  on public.edit_requests for insert with check (auth.uid() = agent_id);

-- Only service_role can update status/admin_notes, so no update policy for agents
-- (Except maybe if they want to cancel or edit before it's worked on, but keeping it simple for now)
