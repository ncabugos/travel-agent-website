-- Trial onboarding intake submissions (from /onboarding page)
--
-- Applied to production on 2026-07-24 via the Supabase dashboard/MCP and
-- recorded in the migration ledger as version 20260724084247, but the file
-- was never committed. Restored from the ledger's stored statements on
-- 2026-09-02 so `supabase db push` in CI stops aborting with "Remote migration
-- versions not found in local migrations directory". Idempotent by design.
create table if not exists public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- who
  full_name text not null,
  agency_name text not null,
  email text not null,
  phone text,
  advisor_role text check (advisor_role in ('solo','agency')) default 'solo',
  years_in_travel text,
  -- affiliations
  host_agency text,
  consortium text,
  supplier_programs text,
  -- brand
  current_website text,
  owns_domain boolean,
  domain_name text,
  logo_url text,
  brand_colors text,
  headshot_url text,
  bio text,
  instagram_url text,
  facebook_url text,
  linkedin_url text,
  -- offering
  specialties text[] default '{}',
  top_destinations text,
  signature_trips text,
  testimonials text,
  -- finishing touches
  contact_method text,
  scheduling_link text,
  notes text,
  -- workflow
  status text not null default 'new' check (status in ('new','in_build','site_ready','archived'))
);

comment on table public.onboarding_submissions is 'Trial advisor intake form submissions from /onboarding. status drives the build pipeline and suppresses the day-2 nudge email.';

alter table public.onboarding_submissions enable row level security;
-- No anon/authenticated policies: inserts happen server-side via service role from the /api/onboarding route.

create index if not exists onboarding_submissions_email_idx on public.onboarding_submissions (email);
create index if not exists onboarding_submissions_status_idx on public.onboarding_submissions (status);

-- Private storage bucket for logo + headshot uploads (written server-side via service role)
insert into storage.buckets (id, name, public)
values ('onboarding', 'onboarding', false)
on conflict (id) do nothing;
