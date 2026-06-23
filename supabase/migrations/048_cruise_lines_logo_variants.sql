-- =============================================================================
-- Migration: 048_cruise_lines_logo_variants.sql
-- Purpose:   Make cruise_lines the single source of truth for cruise LOGOS
--            (mirror of the hotel_programs work). Adds the white/black logo
--            variant columns (the table had neither) and populates them for
--            all cruise lines from the canonical transparent-logo assets.
--            logo_url is left as-is (already populated). MOCK_CRUISE_LINES in
--            lib/cruise-lines.ts is the offline fallback. Safe to re-run.
--            NOTE: 5 lines have no white logo yet (seabourn, lindblad, uniworld,
--            holland-america, virgin-voyages) — left NULL; upload via the admin
--            Cruise Lines editor. 3 of those also lack black and fall back to
--            logo_url on light surfaces.
-- =============================================================================

ALTER TABLE public.cruise_lines
  ADD COLUMN IF NOT EXISTS logo_url_white text,
  ADD COLUMN IF NOT EXISTS logo_url_black text;

UPDATE public.cruise_lines AS cl SET
  logo_url_white = v.logo_url_white,
  logo_url_black = v.logo_url_black
FROM (VALUES
    ('explora-journeys', '/assets/supplier logos/white transparent/cruise/explora-white-600.png', '/assets/supplier logos/black transparent/cruise/explora-black-600.png'),
    ('regent-seven-seas', '/assets/supplier logos/white transparent/cruise/regent-white-600.png', '/assets/supplier logos/black transparent/cruise/regent-black-600.png'),
    ('silversea', '/assets/supplier logos/white transparent/cruise/silverSea-wnite-600.png', '/assets/supplier logos/black transparent/cruise/silverSea-black-600.png'),
    ('oceania', '/assets/supplier logos/white transparent/cruise/oceaniaCruises-white-600.png', '/assets/supplier logos/black transparent/cruise/oceaniaCruises-black-600.png'),
    ('cunard', '/assets/supplier logos/white transparent/cruise/cunard-white-600.png', '/assets/supplier logos/black transparent/cruise/cunard-black-600.png'),
    ('azamara', '/assets/supplier logos/white transparent/cruise/azamara-white-600.png', '/assets/supplier logos/black transparent/cruise/azamara-black-600.png'),
    ('celebrity', '/assets/supplier logos/white transparent/cruise/celebrityCruises-white-600.png', '/assets/supplier logos/black transparent/cruise/celebrityCruises-black-600.png'),
    ('orient-express-sailing-yachts', '/assets/supplier logos/white transparent/cruise/orient_express_sailing-white-600.png', '/assets/supplier logos/black transparent/cruise/orient_express_sailing-black-600.png'),
    ('seabourn', NULL, '/assets/supplier logos/black transparent/cruise/seabourn-black-600.png'),
    ('ponant', '/assets/supplier logos/white transparent/cruise/ponant-white-600.png', '/assets/supplier logos/black transparent/cruise/Ponant-black-600.png'),
    ('four-seasons-yachts', '/assets/supplier logos/white transparent/cruise/FourSeasons_Yacht-white-600.png', NULL),
    ('aman-at-sea', '/assets/supplier logos/white transparent/cruise/aman_at_sea-white-600.png', '/assets/supplier logos/black transparent/cruise/aman_at_sea-black-600.png'),
    ('windstar', '/assets/supplier logos/white transparent/cruise/windstarCruises-white-600.png', '/assets/supplier logos/black transparent/cruise/windstarCruises-black-600.png'),
    ('lindblad', NULL, NULL),
    ('uncruise', '/assets/supplier logos/white transparent/cruise/uncruise-white-600.png', '/assets/supplier logos/black transparent/cruise/uncruise-black-600.png'),
    ('star-clippers', '/assets/supplier logos/white transparent/cruise/starClippers-white-600.png', '/assets/supplier logos/black transparent/cruise/starClippers-black-600.png'),
    ('viking', '/assets/supplier logos/white transparent/cruise/VikingCruises-white-600.png', '/assets/supplier logos/black transparent/cruise/vikingCruises-black-600.png'),
    ('scenic', '/assets/supplier logos/white transparent/cruise/scenicCruises-white-600.png', '/assets/supplier logos/black transparent/cruise/sceniceCruises-black-600.png'),
    ('ritz-carlton-yacht', '/assets/supplier logos/white transparent/cruise/RitzCarlton_Yacht-white-600.png', '/assets/supplier logos/black transparent/cruise/ritzCarlton_yacht-black-600.png'),
    ('paul-gauguin', '/assets/supplier logos/white transparent/cruise/paulGauguin-white-600.png', '/assets/supplier logos/black transparent/cruise/paulGauguin-black-600.png'),
    ('amawaterways', '/assets/supplier logos/white transparent/cruise/amaWaterways-white-600.png', '/assets/supplier logos/black transparent/cruise/amaWaterways-black-600.png'),
    ('uniworld', NULL, '/assets/supplier logos/black transparent/cruise/uniworld-black-600.png'),
    ('holland-america', NULL, NULL),
    ('norwegian', '/assets/supplier logos/white transparent/cruise/norwegian-white-600.png', '/assets/supplier logos/black transparent/cruise/Norwegian-black-600.png'),
    ('royal-caribbean', '/assets/supplier logos/white transparent/cruise/royalCaribbean-white-600.png', '/assets/supplier logos/black transparent/cruise/royalCaribbean-black-600.png'),
    ('princess', '/assets/supplier logos/white transparent/cruise/princessCruises-white-600.png', '/assets/supplier logos/black transparent/cruise/princessCruises-black-600.png'),
    ('crystal', '/assets/supplier logos/white transparent/cruise/crystalCruises-white-600.png', '/assets/supplier logos/black transparent/cruise/crystalCruises-black-600.png'),
    ('virgin-voyages', NULL, NULL)
) AS v(slug, logo_url_white, logo_url_black)
WHERE cl.slug = v.slug;
