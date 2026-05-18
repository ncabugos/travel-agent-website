-- Migration: 033_hotel_programs_logo_variants.sql
-- Purpose: ensure hotel_programs has logo_url_white and logo_url_black columns,
--         and backfill them for the existing 20 programs so the t3 partner grid
--         can render transparent PNGs on cream/light backgrounds instead of the
--         JPG lockups (which have baked-in white boxes).
-- Idempotent: safe to run multiple times.

ALTER TABLE public.hotel_programs
  ADD COLUMN IF NOT EXISTS logo_url_white text,
  ADD COLUMN IF NOT EXISTS logo_url_black text;

COMMENT ON COLUMN public.hotel_programs.logo_url_white IS
  'Transparent white logo for dark hero backgrounds.';
COMMENT ON COLUMN public.hotel_programs.logo_url_black IS
  'Transparent black logo for cream/light backgrounds (e.g. t3 partner grid).';

-- Backfill logo_url_white + logo_url_black per program. Paths match the asset
-- filenames in public/assets/supplier logos/{white,black} transparent/.
UPDATE public.hotel_programs AS hp SET
  logo_url_white = v.logo_url_white,
  logo_url_black = v.logo_url_black
FROM (VALUES
  ('belmond-bellini-club',
    '/assets/supplier logos/white transparent/belmond-bellini_club.webp',
    '/assets/supplier logos/black transparent/belmond_bellini-logo-black-600.png'),
  ('dorchester-diamond-club',
    '/assets/supplier logos/white transparent/dorchester-logo-white.webp',
    '/assets/supplier logos/black transparent/dorchester_diamond-logo-black-600.png'),
  ('four-seasons-preferred-partner',
    '/assets/supplier logos/white transparent/FS_preferred-600.webp',
    '/assets/supplier logos/black transparent/FS_preferred-600-black.png'),
  ('ritz-carlton-stars',
    '/assets/supplier logos/white transparent/ritz-carlton-stars-white.png',
    '/assets/supplier logos/black transparent/ritz-carlton-stars-black-600.png'),
  ('rosewood-elite',
    '/assets/supplier logos/white transparent/rosewood-elite-white.webp',
    '/assets/supplier logos/black transparent/rosewood_elite-black-600.png'),
  ('hera-accor-hotels',
    '/assets/supplier logos/white transparent/accor-hera-white.png',
    '/assets/supplier logos/black transparent/accor-hera-black-600.png'),
  ('mandarin-oriental-fan-club',
    '/assets/supplier logos/white transparent/mandarin-oriental-fan-club-Mandarin-white-600.webp',
    '/assets/supplier logos/black transparent/mandarin-oriental-fan-club-Mandarin-black-600.png'),
  ('shangri-la-hotels-the-luxury-circle',
    '/assets/supplier logos/white transparent/ShangriLa-white-600.webp',
    '/assets/supplier logos/black transparent/ShangriLa-black-600.png'),
  ('rocco-forte-hotels',
    '/assets/supplier logos/white transparent/Rocco_Forte-White-600.webp',
    '/assets/supplier logos/black transparent/Rocco_Forte-black-600.png'),
  ('one-and-only-hotels-and-resorts',
    '/assets/supplier logos/white transparent/one&only-white-600.webp',
    '/assets/supplier logos/black transparent/one%26only-black-600.png'),
  ('auberge-resorts-collection',
    '/assets/supplier logos/white transparent/auberge-logo-white-600.webp',
    '/assets/supplier logos/black transparent/auberge-logo-black-600.png'),
  ('hyatt-prive',
    '/assets/supplier logos/white transparent/HyattPrive_white-transparent.webp',
    '/assets/supplier logos/black transparent/HyattPrive-black-600.png'),
  ('kempinski-club-1897',
    '/assets/supplier logos/white transparent/Kempinski-Club1897-white-600.webp',
    '/assets/supplier logos/black transparent/Kempinski-Club1897-black-600.png'),
  ('peninsula-pen-club',
    '/assets/supplier logos/white transparent/Peninsula_PenClub-white-600.webp',
    '/assets/supplier logos/black transparent/Peninsula_PenClub-black-600.png'),
  ('como-hotels',
    '/assets/supplier logos/white transparent/como-hotels-white.png',
    '/assets/supplier logos/black transparent/como-hotels-black-600.png'),
  ('oetker-hotel-collection-pearl-partner',
    '/assets/supplier logos/white transparent/oetker-pearl-white-600.webp',
    '/assets/supplier logos/black transparent/oetker-pearl-black-600.png'),
  ('aman-hotels-and-resorts',
    '/assets/supplier logos/white transparent/Aman-white-600.png',
    '/assets/supplier logos/black transparent/Aman-black-600.png'),
  ('montage-hotels',
    '/assets/supplier logos/white transparent/montage-white-600.webp',
    '/assets/supplier logos/black transparent/montage-black-600.png'),
  ('marriott-international-luminous',
    '/assets/supplier logos/white transparent/marriott-stars_luminous.webp',
    '/assets/supplier logos/black transparent/Marriott_stars_luminous-black-600.png'),
  ('leading-hotels-of-the-world',
    '/assets/supplier logos/white transparent/leading_hotels-white-600.png',
    '/assets/supplier logos/black transparent/LeadingHotels-black-600.png')
) AS v(slug, logo_url_white, logo_url_black)
WHERE hp.slug = v.slug;

-- ── Side fix: a few cruise_lines.hero_image_url rows point at files that don't
-- exist in /public/media/cruises/. Point them at the asset paths we ship now.
UPDATE public.cruise_lines AS cl SET hero_image_url = v.hero_image_url
FROM (VALUES
  ('explora-journeys', '/media/cruises/explora/explora-hero.webp')
) AS v(slug, hero_image_url)
WHERE cl.slug = v.slug;
