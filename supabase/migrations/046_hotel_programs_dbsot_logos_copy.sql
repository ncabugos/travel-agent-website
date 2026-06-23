-- =============================================================================
-- Migration: 046_hotel_programs_dbsot_logos_copy.sql
-- Purpose:   Make hotel_programs the single source of truth for program LOGOS
--            and client-facing COPY across every tenant site (demo + live).
--              1. Add logo_url_white / logo_url_black columns (idempotent —
--                 migration 033 was never applied to all environments).
--              2. Insert the 20th program, Leading Hotels of the World, if it
--                 is not already present.
--              3. Set logo paths (color/white/black) + the rewritten
--                 client-facing tagline + description on all 20 programs.
--            MOCK_HOTEL_PROGRAMS (lib/hotel-programs.ts) is kept byte-for-byte
--            in sync as the offline fallback. Safe to re-run.
-- =============================================================================

ALTER TABLE public.hotel_programs
  ADD COLUMN IF NOT EXISTS logo_url_white text,
  ADD COLUMN IF NOT EXISTS logo_url_black text;

-- ── 20th program: Leading Hotels of the World (insert only if missing) ───────
INSERT INTO public.hotel_programs
  (slug, name, logo_url, logo_url_white, logo_url_black, tagline, description,
   category, property_count, benefits, eligibility_notes, booking_notes, sort_order, is_active)
SELECT
  'leading-hotels-of-the-world',
  'The Leading Hotels of the World',
  '/media/suppliers/logos/leading-hotels-black-600.png',
  '/assets/supplier logos/white transparent/leading_hotels-white-600.png',
  '/assets/supplier logos/black transparent/LeadingHotels-black-600.png',
  'Over 400 independent houses — each unmistakably of its place.',
  'As a Leading Hotels partner, we arrange a room upgrade on arrival, daily breakfast, and early check-in across more than 400 independent hotels worldwide.',
  'global_network',
  400,
  '[{"title":"Upgrade Priority at Arrival","description":"Priority upgrade to a superior room upon arrival, subject to availability."},{"title":"Daily Continental Breakfast for Two","description":"Complimentary continental breakfast for two guests, served daily."},{"title":"Early Check-In & Late Check-Out","description":"Early check-in and late check-out based on availability."},{"title":"Complimentary Wi-Fi","description":"High-speed Wi-Fi complimentary throughout the duration of the stay."}]'::jsonb,
  'Benefits apply at participating Leading Hotels of the World properties when booked through a preferred partner.',
  'Reference the Leading Hotels preferred partner programme at booking to activate all benefits.',
  20,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.hotel_programs WHERE slug = 'leading-hotels-of-the-world'
);

-- ── Logos + client-facing copy for all programs ─────────────────────────────
UPDATE public.hotel_programs AS hp SET
  logo_url       = v.logo_url,
  logo_url_white = v.logo_url_white,
  logo_url_black = v.logo_url_black,
  tagline        = v.tagline,
  description    = v.description
FROM (VALUES
    ('belmond-bellini-club', '/media/hotel-programs/logos/belmond-bellini-club.png', '/assets/supplier logos/white transparent/belmond-bellini_club.png', '/assets/supplier logos/black transparent/belmond_bellini-logo-black-600.png', 'The hotels, trains, and river cruises of Belmond — with you recognized at the door.', 'As a handpicked Bellini Club member, we pass on privileges reserved for Belmond''s closest partners — a complimentary upgrade on arrival, a resort credit, and a VIP welcome before you check in.'),
    ('dorchester-diamond-club', '/media/hotel-programs/logos/dorchester-diamond-club.png', '/assets/supplier logos/white transparent/dorchester-logo-white.png', '/assets/supplier logos/black transparent/dorchester_diamond-logo-black-600.png', 'The Dorchester, Le Meurice, Hotel Eden — at their most generous.', 'Our Diamond Club standing brings a room upgrade on arrival, daily breakfast, and a hotel credit at every Dorchester Collection address — arranged before you check in.'),
    ('four-seasons-preferred-partner', '/media/hotel-programs/logos/four-seasons-preferred-partner.png', '/assets/supplier logos/white transparent/FS_preferred-600.png', '/assets/supplier logos/black transparent/FS_preferred-600-black.png', 'Four Seasons, anywhere in the world — with more than a reservation waiting.', 'As a Four Seasons Preferred Partner, we secure daily breakfast, a hotel credit, and a room upgrade on arrival when available — at properties from Bora Bora to Florence.'),
    ('ritz-carlton-stars', '/media/hotel-programs/logos/ritz-carlton-stars.png', '/assets/supplier logos/white transparent/ritz-carlton-stars-white.png', '/assets/supplier logos/black transparent/ritz-carlton-stars-black-600.png', 'Ritz-Carlton stays, elevated by touches arranged before you arrive.', 'Through STARS, a Ritz-Carlton stay carries a personal welcome from management, daily breakfast, a 4 PM checkout, and a room upgrade on arrival when available.'),
    ('rosewood-elite', '/media/hotel-programs/logos/rosewood-elite.png', '/assets/supplier logos/white transparent/rosewood-elite-white.png', '/assets/supplier logos/black transparent/rosewood_elite-black-600.png', 'Rosewood''s sense of place — and a welcome held just for you.', 'Our Rosewood Elite standing brings daily breakfast, a room upgrade on arrival, and a welcome from the property''s managing director — arranged before you arrive.'),
    ('hera-accor-hotels', '/media/hotel-programs/logos/accor-hera.png', '/assets/supplier logos/white transparent/accor-hera-white.png', '/assets/supplier logos/black transparent/accor-hera-black-600.png', 'Raffles, Fairmont, and the Orient Express — across Accor''s finest houses.', 'Booked through us, an Accor stay carries daily breakfast, a property credit, and a room upgrade on arrival — at Raffles, Fairmont, Sofitel, and beyond.'),
    ('mandarin-oriental-fan-club', '/media/hotel-programs/logos/mandarin-oriental-fan-club.png', '/assets/supplier logos/white transparent/mandarin-oriental-fan-club-Mandarin-white-600.png', '/assets/supplier logos/black transparent/mandarin-oriental-fan-club-Mandarin-black-600.png', 'Mandarin Oriental''s legendary service — extended to you.', 'As Fan Club members, we arrange a room upgrade on arrival, daily breakfast, and a dining or spa credit at every Mandarin Oriental — set before you check in.'),
    ('shangri-la-hotels-the-luxury-circle', '/media/hotel-programs/logos/shangri-la-luxury-circle.png', '/assets/supplier logos/white transparent/ShangriLa-white-600.png', '/assets/supplier logos/black transparent/ShangriLa-black-600.png', 'Shangri-La''s hospitality from the heart — at its most generous.', 'Our Luxury Circle standing brings a guaranteed room upgrade, daily breakfast, and a hotel credit at every Shangri-La — with a welcome arranged before you arrive.'),
    ('rocco-forte-hotels', '/media/hotel-programs/logos/rocco-forte-hotels.png', '/assets/supplier logos/white transparent/Rocco_Forte-White-600.png', '/assets/supplier logos/black transparent/Rocco_Forte-black-600.png', 'Rocco Forte''s European houses — Rome, London, Florence, and beyond.', 'Through Sir Rocco''s Knights, we arrange daily breakfast, a dining credit, and a room upgrade across Rocco Forte''s European houses — with a welcome before you arrive.'),
    ('one-and-only-hotels-and-resorts', '/media/hotel-programs/logos/one-and-only.png', '/assets/supplier logos/white transparent/one&only-white-600.png', '/assets/supplier logos/black transparent/one%26only-black-600.png', 'One&Only''s most extraordinary addresses — made personal.', 'Booked through us, a One&Only stay carries daily breakfast, a resort or spa credit, and a room upgrade on arrival — with recognition from the moment you land.'),
    ('auberge-resorts-collection', '/media/hotel-programs/logos/auberge-resorts.png', '/assets/supplier logos/white transparent/auberge-logo-white-600.png', '/assets/supplier logos/black transparent/auberge-logo-black-600.png', 'Auberge''s sense of place, in the world''s most inspiring settings.', 'Our Auberge standing brings daily breakfast, a resort or spa credit, and a room upgrade on arrival — arranged before you ever reach the door.'),
    ('hyatt-prive', '/media/hotel-programs/logos/hyatt-prive.png', '/assets/supplier logos/white transparent/HyattPrive_white-transparent.png', '/assets/supplier logos/black transparent/HyattPrive-black-600.png', 'Park Hyatt, Alila, Andaz — Hyatt''s most exceptional houses.', 'Through World of Hyatt Privé, we arrange daily breakfast, a property credit, and a room upgrade on arrival at Park Hyatt, Alila, Andaz, and Grand Hyatt.'),
    ('kempinski-club-1897', '/media/hotel-programs/logos/kempinski-club1897.png', '/assets/supplier logos/white transparent/Kempinski-Club1897-white-600.png', '/assets/supplier logos/black transparent/Kempinski-Club1897-black-600.png', 'Europe''s oldest luxury house — a passport to its finest addresses.', 'Our Club 1897 standing brings a room upgrade, daily breakfast, and a hotel credit across Kempinski''s palaces and resorts — arranged before you arrive.'),
    ('peninsula-pen-club', '/media/hotel-programs/logos/peninsula-pen-club.png', '/assets/supplier logos/white transparent/Peninsula_PenClub-white-600.png', '/assets/supplier logos/black transparent/Peninsula_PenClub-black-600.png', 'The Peninsula, on your schedule — Hong Kong, Paris, New York, and beyond.', 'As PenClub members, we arrange daily breakfast, a room upgrade, and Peninsula Time — flexible arrival and departure — at every Peninsula, set before you check in.'),
    ('como-hotels', '/media/hotel-programs/logos/como-hotels.png', '/assets/supplier logos/white transparent/como-hotels-white.png', '/assets/supplier logos/black transparent/como-hotels-black-600.png', 'COMO''s wellness and design — in the world''s most beautiful places.', 'Booked through us, a COMO stay carries daily breakfast, a resort or spa credit, and a room upgrade on arrival — with a welcome arranged before you reach the door.'),
    ('oetker-hotel-collection-pearl-partner', '/media/hotel-programs/logos/oetker-pearl.png', '/assets/supplier logos/white transparent/oetker-pearl-white-600.png', '/assets/supplier logos/black transparent/oetker-pearl-black-600.png', 'Oetker''s Masterpiece Hotels — Le Bristol, Eden-Roc, Brenners.', 'Our Pearl Partner standing brings a guaranteed room upgrade, daily breakfast, and a property credit at Oetker''s Masterpiece Hotels — arranged before you arrive.'),
    ('aman-hotels-and-resorts', '/media/hotel-programs/logos/aman.png', '/assets/supplier logos/white transparent/Aman-white-600.png', '/assets/supplier logos/black transparent/Aman-black-600.png', 'Aman''s sanctuaries — quiet, remote, and entirely yours.', 'Booked through us, an Aman stay carries daily breakfast, a resort or spa credit, and a room upgrade on arrival — with a welcome arranged before you reach the door.'),
    ('montage-hotels', '/media/hotel-programs/logos/montage-hotels.png', '/assets/supplier logos/white transparent/montage-white-600.png', '/assets/supplier logos/black transparent/montage-black-600.png', 'Montage''s gracious service, at America''s most celebrated resorts.', 'Our Montage standing brings daily breakfast, a resort or spa credit, and a room upgrade on arrival — arranged before you ever reach the door.'),
    ('marriott-international-luminous', '/media/hotel-programs/logos/marriott-luminous.png', '/assets/supplier logos/white transparent/marriott-stars_luminous.png', '/assets/supplier logos/black transparent/Marriott_stars_luminous-black-600.png', 'St. Regis, EDITION, Bvlgari — Marriott''s luxury houses, elevated.', 'Through Stars & Luminous, we arrange daily breakfast, a hotel credit, and a room upgrade on arrival at St. Regis, EDITION, Bvlgari, and The Luxury Collection.')
) AS v(slug, logo_url, logo_url_white, logo_url_black, tagline, description)
WHERE hp.slug = v.slug;
