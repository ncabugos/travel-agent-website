-- =============================================================================
-- Migration 034 — Remove Sea Cloud Cruises and Amadeus River Cruises
-- =============================================================================
-- These were seeded in 010_seed_data.sql but are no longer offered as
-- partners. The /find-cruise pages were showing them via the live Supabase
-- cruise_lines query. No FK relationships exist to other tables (verified
-- via grep against migrations directory), so a simple DELETE is sufficient.
--
-- Also strips the matching slug from any agent_cruise_line_selections
-- junction rows defensively, in case future migrations add curation tables.

DELETE FROM cruise_lines WHERE slug IN ('sea-cloud', 'amadeus');

-- Defensive — no-op if the table doesn't exist.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'agent_cruise_line_selections'
  ) THEN
    EXECUTE 'DELETE FROM agent_cruise_line_selections WHERE cruise_line_slug IN (''sea-cloud'', ''amadeus'')';
  END IF;
END $$;
