-- =============================================================================
-- Migration: 031_agent_founding_plan.sql
-- Description: Adds founding-cohort billing fields to agents for the beta launch
--              ("Founding Advisor" offer — $0 setup, 90-day free trial, then a
--              locked founding monthly rate). See EAH_Beta_Launch_Build_Kit.md
--              Part A.
--
--                • plan        — 'standard' (default, public pricing) | 'founding'
--                • beta_cohort — e.g. 'beta-1'; NULL for standard plans
--
--              Both columns are BILLING-CONTROLLED: they are written only by the
--              Stripe webhook (service role) from the subscription metadata. An
--              advisor must never be able to grant themselves the founding rate.
--
--              Postgres RLS is row-level, not column-level, and the existing
--              "agents: update own row" policy already lets an authenticated
--              advisor patch their own row through the anon key (see
--              app/agent-portal/profile/page.tsx). A plain policy therefore
--              cannot stop a self-update from flipping plan -> 'founding'. We
--              guard the two columns with a BEFORE UPDATE trigger that rejects
--              changes coming from the PostgREST-exposed roles (anon /
--              authenticated). The service role (webhook, admin) and superuser
--              migrations are unaffected.
-- =============================================================================

alter table public.agents
  add column if not exists plan        text not null default 'standard'
    check (plan in ('standard', 'founding')),
  add column if not exists beta_cohort text;

comment on column public.agents.plan is
  'Billing plan: ''standard'' (public pricing) or ''founding'' (invitation-only beta rate). Written only by the Stripe webhook from subscription metadata.';
comment on column public.agents.beta_cohort is
  'Beta cohort label (e.g. ''beta-1'') for founding advisors. NULL for standard plans. Written only by the Stripe webhook.';

-- -----------------------------------------------------------------------------
-- Column-level guard for the billing-controlled columns.
-- Only the service role (Stripe webhook / admin tooling) may set or change
-- plan / beta_cohort. Without this, the "agents: update own row" RLS policy
-- would let an advisor self-assign plan = 'founding' via the anon key.
-- -----------------------------------------------------------------------------
create or replace function public.guard_agent_billing_columns()
returns trigger
language plpgsql
as $$
begin
  -- current_user reflects the role PostgREST switched into for the request:
  --   'anon'          → the public
  --   'authenticated' → a logged-in advisor (must NOT change billing columns)
  --   'service_role'  → the Stripe webhook / admin (allowed; not matched here)
  -- Superuser-run migrations also bypass this branch.
  if current_user in ('anon', 'authenticated')
     and (new.plan        is distinct from old.plan
       or new.beta_cohort is distinct from old.beta_cohort)
  then
    raise exception
      'agents.plan and agents.beta_cohort are billing-controlled and may only be changed by the Stripe webhook (service role)';
  end if;
  return new;
end;
$$;

create trigger agents_guard_billing_columns
  before update on public.agents
  for each row
  execute procedure public.guard_agent_billing_columns();
