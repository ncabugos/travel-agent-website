-- =============================================================================
-- Migration: 045_bellini_club_logos_copy.sql
-- Purpose:   Update the Belmond Bellini Club hotel program for live agent sites:
--              1. Ensure the logo-variant columns exist (migration 033 was not
--                 applied to all environments — add them idempotently here).
--              2. Set the black/white transparent logo paths + the colour path
--                 (all now serve the refreshed Bellini artwork on disk).
--              3. Replace the trade-voice catalog copy with the client-facing
--                 B2B2C tagline + description used across demo + live sites.
--            Demo sites read MOCK_HOTEL_PROGRAMS (lib/hotel-programs.ts); live
--            sites read this table. Both are updated in the same changeset.
--            Safe to re-run.
-- =============================================================================

ALTER TABLE public.hotel_programs
  ADD COLUMN IF NOT EXISTS logo_url_white text,
  ADD COLUMN IF NOT EXISTS logo_url_black text;

UPDATE public.hotel_programs SET
  logo_url       = '/media/hotel-programs/logos/belmond-bellini-club.png',
  logo_url_white = '/assets/supplier logos/white transparent/belmond-bellini_club.png',
  logo_url_black = '/assets/supplier logos/black transparent/belmond_bellini-logo-black-600.png',
  tagline        = 'The hotels, trains, and river cruises of Belmond — with you recognized at the door.',
  description    = 'As a handpicked Bellini Club member, we pass on privileges reserved for Belmond''s closest partners — a complimentary upgrade on arrival, a resort credit, and a VIP welcome before you check in.'
WHERE slug = 'belmond-bellini-club';
