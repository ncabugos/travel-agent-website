-- =============================================================================
-- Migration: 047_hotel_programs_add_brands.sql
-- Purpose:   Add four supplier brands to the hotel_programs catalog so they
--            render across every tenant site (and the marketing wall):
--            Six Senses, Jumeirah Passport, Preferred Hotels & Resorts, Couture.
--            Logos only + brand-level copy; benefits intentionally empty
--            (no fabricated perks) — fill via the admin editor once verified.
--            Run AFTER 046 (needs the logo_url_white/black columns). Idempotent
--            via ON CONFLICT (slug).
--
--   NOTE: uses a direct multi-row INSERT … VALUES (not INSERT … SELECT FROM
--   (VALUES …)). The `category` column is an enum; direct VALUES string
--   literals are untyped and cast implicitly, whereas a SELECT-from-VALUES
--   types them as `text` and the enum cast is rejected.
-- =============================================================================

INSERT INTO public.hotel_programs
  (slug, name, logo_url, logo_url_white, logo_url_black, tagline, description,
   category, property_count, benefits, sort_order, is_active)
VALUES
  (
    'six-senses', 'Six Senses',
    '/assets/supplier logos/black transparent/SixSenses-logo-black-600.png',
    '/assets/supplier logos/white transparent/SixSenses-logo-white-600.png',
    '/assets/supplier logos/black transparent/SixSenses-logo-black-600.png',
    'Wellness, sustainability, and the quiet corners of the world.',
    'Six Senses resorts and spas, booked through our preferred partnership — with the recognition and on-property privileges it carries.',
    'brand_programme', NULL, '[]'::jsonb, 21, true
  ),
  (
    'jumeirah-passport', 'Jumeirah Passport',
    '/assets/supplier logos/black transparent/jumeirah_passport-black-600.png',
    '/assets/supplier logos/white transparent/jumeirah-passport-logo-white-600.png',
    '/assets/supplier logos/black transparent/jumeirah_passport-black-600.png',
    'Jumeirah''s landmark hotels — Dubai, London, and beyond.',
    'Jumeirah''s flagship properties, booked through the Passport partnership — with the recognition and added privileges reserved for it.',
    'brand_programme', NULL, '[]'::jsonb, 22, true
  ),
  (
    'preferred-hotels-resorts', 'Preferred Hotels & Resorts',
    '/assets/supplier logos/black transparent/preferredHotels-logo-black-600.png',
    '/assets/supplier logos/white transparent/preferredHotels-logo-white-600.png',
    '/assets/supplier logos/black transparent/preferredHotels-logo-black-600.png',
    'Independent hotels of character, the world over.',
    'A global collection of independent luxury hotels, booked through our Preferred partnership — with member recognition and on-property benefits.',
    'global_network', NULL, '[]'::jsonb, 23, true
  ),
  (
    'couture', 'Couture',
    '/assets/supplier logos/black transparent/couture-logo-black-600.png',
    '/assets/supplier logos/white transparent/couture-logo-white-600.png',
    '/assets/supplier logos/black transparent/couture-logo-black-600.png',
    'The hand-selected best of the independent world.',
    'Couture is the most exclusive tier of the Preferred collection — a curated set of hotels with the highest level of partner recognition and privileges.',
    'invitation_only', NULL, '[]'::jsonb, 24, true
  )
ON CONFLICT (slug) DO NOTHING;
