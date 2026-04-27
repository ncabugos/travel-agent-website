-- =============================================================================
-- Migration: 020_onboarding.sql
-- Description: Adds agent onboarding fields — travel specialties, destination
--              specialties, preferred suppliers, travel types, template
--              preference, and an onboarding completion timestamp.
--              Also creates admin_notifications table for onboarding alerts.
-- =============================================================================

-- ─── Onboarding completion flag ────────────────────────────────────────────────
ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- ─── Travel profile fields (JSONB arrays for flexible tagging) ─────────────────
ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS travel_specialties TEXT[] DEFAULT '{}';

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS destination_specialties TEXT[] DEFAULT '{}';

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS preferred_suppliers TEXT[] DEFAULT '{}';

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS travel_types TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.agents.travel_specialties     IS 'E.g. luxury, adventure, honeymoons, family, wellness';
COMMENT ON COLUMN public.agents.destination_specialties IS 'E.g. Europe, Caribbean, Asia-Pacific, Africa';
COMMENT ON COLUMN public.agents.preferred_suppliers     IS 'E.g. Virtuoso, Aman, Four Seasons, Regent Seven Seas';
COMMENT ON COLUMN public.agents.travel_types            IS 'E.g. cruises, all-inclusive, bespoke itineraries, group travel';

-- ─── Admin notifications ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT        NOT NULL,  -- 'onboarding_complete', 'edit_request', etc.
  title       TEXT        NOT NULL,
  body        TEXT,
  metadata    JSONB       DEFAULT '{}',
  is_read     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.admin_notifications              IS 'Notifications for platform admins (super_admin role).';
COMMENT ON COLUMN public.admin_notifications.type         IS 'Notification category for filtering.';
COMMENT ON COLUMN public.admin_notifications.metadata     IS 'Flexible payload — agent_id, tier, email, etc.';

-- No RLS needed — admin_notifications are only accessed server-side via service role
