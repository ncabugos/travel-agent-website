-- =============================================================================
-- Migration: 049_cruise_lines_yacht_content.sql
-- Purpose:   Enrich cruise_lines into a full yacht/cruise page template — the
--            same DB-single-source-of-truth pattern as hotel_programs. Adds
--            content columns for the rich detail-page sections (overview intro,
--            destinations, onboard experiences, suites, sample journeys),
--            DB-driven benefits (replacing the hardcoded Virtuoso block), and a
--            cinematic video. Every column is nullable / defaults empty, so the
--            existing 24 cruise lines are unaffected and any line can be enriched
--            later by filling these columns.
--
--            Also seeds the first enriched line: Aman at Sea (the yacht
--            Amangati). Identity fields only here — the rich JSON content is
--            authored in MOCK_CRUISE_LINES (lib/cruise-lines.ts) and pushed by
--            scripts/sync-cruise-content.js, which now includes these fields.
--
--            Direct INSERT … VALUES with ON CONFLICT DO NOTHING so re-runs and
--            the migration-048 logo UPDATE (which references this slug) compose
--            cleanly. RLS is already public-read on cruise_lines; no policy change.
--            Safe to re-run.
-- =============================================================================

ALTER TABLE public.cruise_lines
  ADD COLUMN IF NOT EXISTS benefits         jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS video_url        text,
  ADD COLUMN IF NOT EXISTS video_poster_url text,
  ADD COLUMN IF NOT EXISTS intro            jsonb,
  ADD COLUMN IF NOT EXISTS destinations     jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS experiences      jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS suites           jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sample_journeys  jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Seed the Aman at Sea identity row (content synced separately).
INSERT INTO public.cruise_lines
  (name, slug, logo_url, logo_url_white, logo_url_black, hero_image_url,
   tagline, description, cruise_type, cruise_types, sort_order, is_active)
VALUES
  ('Aman at Sea', 'aman-at-sea',
   '/media/cruises/aman-at-sea/aman_at_sea-black-600.png',
   '/media/cruises/aman-at-sea/aman_at_sea-white-600.png',
   '/media/cruises/aman-at-sea/aman_at_sea-black-600.png',
   '/media/cruises/aman-at-sea/aman-hero.webp',
   'A Philosophy in Motion',
   'Amangati — "peaceful motion" in Sanskrit — is Aman''s first yacht: 47 suites for 94 guests, drawn by Sinot and conceived as a private Aman carried across the world''s most storied waters. Setting sail Spring 2027.',
   'yacht', ARRAY['yacht'], 0, true)
ON CONFLICT (slug) DO NOTHING;
