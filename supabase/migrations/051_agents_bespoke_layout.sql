-- =============================================================================
-- Migration: 051_agents_bespoke_layout.sql
-- Purpose:   Let a tenant opt into a hand-built (bespoke) homepage without
--            hardcoding its UUID into the render path. The t2 page reads
--            agents.bespoke_layout and, when set, serves the matching bespoke
--            build instead of the generic Vista composition.
--
--              'wwt' → Wine & Wellness Travel flagship build
--
--            Setting the value on a live record (e.g. wineandwellnesstravel.com)
--            is a deliberate go-live step done separately after sign-off — this
--            migration only adds the column. Safe to re-run.
-- =============================================================================

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS bespoke_layout text;

COMMENT ON COLUMN public.agents.bespoke_layout IS
  'Optional bespoke homepage key (e.g. ''wwt''). When set, the public template serves a hand-built layout for this tenant instead of the generic composition.';
