-- =============================================================================
-- Migration: 029_agent_first_name.sql
-- Description: Adds first_name to agents for the personalization roadmap
--              (Tier 1.1: {{advisor_first_name}} token). Stored NOT NULL with
--              empty-string default so the render layer can treat empty as
--              "fall back to 'your advisor'".
--              Existing rows are backfilled with the first whitespace token of
--              full_name as a sensible default — operators can override via
--              the agent-portal profile page.
-- =============================================================================

alter table public.agents
  add column if not exists first_name text not null default '';

update public.agents
   set first_name = split_part(trim(full_name), ' ', 1)
 where first_name = ''
   and full_name is not null
   and full_name <> '';

comment on column public.agents.first_name is
  'Advisor''s first name, used in personalized blog CTAs (e.g. "Reach out to {{advisor_first_name}}"). Empty string means "no value set"; the blog render layer falls back to "your advisor".';
