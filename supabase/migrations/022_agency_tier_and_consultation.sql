-- =============================================================================
-- Migration: 022_agency_tier_and_consultation.sql
-- Description: Adds the "agency" tier to the agents table tier CHECK constraint
--              and creates the consultation_requests table used by the marketing
--              site's "Schedule a Consultation" flow (Custom + Agency tiers).
-- =============================================================================

-- ─── 1. Expand agents.tier CHECK to include 'agency' ──────────────────────────
ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS agents_tier_check;
ALTER TABLE public.agents
  ADD CONSTRAINT agents_tier_check
  CHECK (tier IN ('starter', 'growth', 'custom', 'agency'));

-- ─── 2. consultation_requests table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  tier         TEXT CHECK (tier IN ('starter','growth','custom','agency')),

  -- Contact
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  role_title   TEXT,

  -- General qualification
  heard_from   TEXT,
  timeline     TEXT,
  message      TEXT,

  -- Agency-specific (nullable; only populated for tier='agency')
  agency_name          TEXT,
  agency_website       TEXT,
  agency_street        TEXT,
  agency_city          TEXT,
  agency_region        TEXT,
  agency_postal        TEXT,
  agency_country       TEXT,
  num_advisors         INTEGER,
  host_affiliation     TEXT,
  years_in_business    INTEGER,
  specialties          TEXT[],
  existing_website     TEXT,
  wants_custom_domain  BOOLEAN,
  wants_advisor_pages  BOOLEAN,
  wants_team_training  BOOLEAN,

  -- Custom-tier-specific (nullable; only populated for tier='custom')
  design_references    TEXT,
  additional_pages     TEXT,
  integrations_needed  TEXT,

  -- Admin workflow
  status       TEXT NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new','contacted','qualified','won','lost')),
  notes        TEXT
);

CREATE INDEX IF NOT EXISTS consultation_requests_created_at_idx
  ON public.consultation_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS consultation_requests_status_idx
  ON public.consultation_requests (status);

-- ─── 3. Row-level security ────────────────────────────────────────────────────
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) may submit a new request. This is the public marketing
-- form, so inserts are intentionally open. All other access requires super_admin.
CREATE POLICY "consultation_requests: public insert"
  ON public.consultation_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "consultation_requests: admin read all"
  ON public.consultation_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents a
      WHERE a.id = auth.uid() AND a.role = 'super_admin'
    )
  );

CREATE POLICY "consultation_requests: admin update all"
  ON public.consultation_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.agents a
      WHERE a.id = auth.uid() AND a.role = 'super_admin'
    )
  );
