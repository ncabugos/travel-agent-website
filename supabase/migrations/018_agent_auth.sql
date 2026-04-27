-- =============================================================================
-- Migration: 018_agent_auth.sql
-- Description: Adds email to agents table so they can authenticate.
-- =============================================================================

alter table public.agents add column email text unique;

-- Optionally add auth_user_id if linking directly to auth.users, but for magic link mapping we can just look up by email match.
alter table public.agents add column auth_user_id uuid references auth.users(id) on delete set null;

comment on column public.agents.email is 'Agent email address for magic link logins.';
comment on column public.agents.auth_user_id is 'Link to Supabase Auth user record.';
