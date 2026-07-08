-- =============================================================================
-- Migration: 052_consultation_studio_source.sql
-- Purpose:   Let the public "Studio" services page (/studio) capture leads into
--            the shared consultation_requests inbox, the same way /beta reuses it
--            (migration 036 added source='beta-waitlist').
--
--            Two changes, both additive and safe to re-run:
--              1. Extend the `source` CHECK to allow 'studio'.
--              2. Add a nullable `plan_interest` column recording which Studio
--                 plan the visitor selected (Essential / Professional /
--                 Full Service / Agency / unsure). Null for every other source.
--
--            No new RLS is needed — the existing policies on consultation_requests
--            (public insert, super_admin read/update) already cover this source.
-- =============================================================================

-- 1. Allow 'studio' alongside the existing sources. The inline CHECK added in
--    036 is named consultation_requests_source_check by Postgres convention;
--    drop-if-exists keeps this idempotent even if it was named differently.
ALTER TABLE public.consultation_requests
  DROP CONSTRAINT IF EXISTS consultation_requests_source_check;

ALTER TABLE public.consultation_requests
  ADD CONSTRAINT consultation_requests_source_check
  CHECK (source IN ('consultation', 'beta-waitlist', 'studio'));

-- 2. Which Studio plan the lead is interested in. Nullable; only populated for
--    source='studio'. Constrained to the known plan slugs (plus 'unsure').
ALTER TABLE public.consultation_requests
  ADD COLUMN IF NOT EXISTS plan_interest text;

ALTER TABLE public.consultation_requests
  DROP CONSTRAINT IF EXISTS consultation_requests_plan_interest_check;

ALTER TABLE public.consultation_requests
  ADD CONSTRAINT consultation_requests_plan_interest_check
  CHECK (plan_interest IS NULL OR plan_interest IN ('essential', 'professional', 'full-service', 'agency', 'unsure'));

COMMENT ON COLUMN public.consultation_requests.plan_interest IS
  'For source=''studio'': which Studio plan the lead selected (essential | professional | full-service | agency | unsure). Null for other sources.';
