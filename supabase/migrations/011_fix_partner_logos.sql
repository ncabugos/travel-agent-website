-- Migration 011: Fix partner logo paths to confirmed existing files
-- Updates the featured_partners table with verified logo paths from /public/media/hotel-programs/logos/

UPDATE featured_partners SET logo_url = '/media/hotel-programs/logos/four-seasons-preferred-partner.jpg' WHERE slug = 'four-seasons-partner' OR name ILIKE '%Four Seasons%';
UPDATE featured_partners SET logo_url = '/media/hotel-programs/logos/aman.jpg' WHERE slug = 'aman-partner' OR name ILIKE '%Aman%';

-- Update cruise partners with logos that exist
UPDATE featured_partners SET logo_url = '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg' WHERE slug = 'oceania' OR name ILIKE '%Oceania%';

-- Insert or update hotel program partners with confirmed logos
INSERT INTO featured_partners (id, name, slug, logo_url, category, is_preferred, sort_order, is_active)
VALUES
  ('hp-1',  'Four Seasons Preferred Partner',  'four-seasons-preferred',   '/media/hotel-programs/logos/four-seasons-preferred-partner.jpg',   'hotel', true,  1,  true),
  ('hp-2',  'Belmond Bellini Club',             'belmond-bellini-club',      '/media/hotel-programs/logos/belmond-bellini-club.jpg',              'hotel', true,  2,  true),
  ('hp-3',  'Mandarin Oriental Fan Club',       'mandarin-fan-club',         '/media/hotel-programs/logos/mandarin-oriental-fan-club.jpg',        'hotel', true,  3,  true),
  ('hp-4',  'Rosewood Elite',                   'rosewood-elite',            '/media/hotel-programs/logos/rosewood-elite.jpg',                    'hotel', true,  4,  true),
  ('hp-5',  'Hyatt Privé',                      'hyatt-prive',               '/media/hotel-programs/logos/hyatt-prive.jpg',                       'hotel', true,  5,  true),
  ('hp-6',  'Peninsula Pen Club',               'peninsula-pen-club',        '/media/hotel-programs/logos/peninsula-pen-club.jpg',                'hotel', true,  6,  true),
  ('hp-7',  'Dorchester Diamond Club',          'dorchester-diamond-club',   '/media/hotel-programs/logos/dorchester-diamond-club.jpg',           'hotel', true,  7,  true),
  ('hp-8',  'Ritz-Carlton Stars',               'ritz-carlton-stars',        '/media/hotel-programs/logos/ritz-carlton-stars.jpg',                'hotel', true,  8,  true),
  ('hp-9',  'Rocco Forte Hotels',               'rocco-forte',               '/media/hotel-programs/logos/rocco-forte-hotels.jpg',                'hotel', true,  9,  true),
  ('hp-10', 'Shangri-La Luxury Circle',         'shangri-la-luxury-circle',  '/media/hotel-programs/logos/shangri-la-luxury-circle.jpg',          'hotel', true,  10, true),
  ('hp-11', 'Aman',                             'aman',                      '/media/hotel-programs/logos/aman.jpg',                              'hotel', true,  11, true),
  ('hp-12', 'Auberge Resorts',                  'auberge-resorts',           '/media/hotel-programs/logos/auberge-resorts.jpg',                   'hotel', false, 12, true),
  ('hp-13', 'One & Only',                       'one-and-only',              '/media/hotel-programs/logos/one-and-only.jpg',                      'hotel', false, 13, true),
  ('hp-14', 'Oetker Collection Pearl',          'oetker-pearl',              '/media/hotel-programs/logos/oetker-pearl.jpg',                      'hotel', false, 14, true),
  ('hp-15', 'Montage Hotels',                   'montage',                   '/media/hotel-programs/logos/montage-hotels.jpg',                    'hotel', false, 15, true),
  ('hp-16', 'Marriott Luminous',                'marriott-luminous',         '/media/hotel-programs/logos/marriott-luminous.jpg',                 'hotel', false, 16, true),
  ('hp-17', 'Kempinski Club 1897',              'kempinski-club1897',        '/media/hotel-programs/logos/kempinski-club1897.jpg',                'hotel', false, 17, true),
  ('hp-18', 'COMO Hotels',                      'como-hotels',               '/media/hotel-programs/logos/como-hotels.jpg',                       'hotel', false, 18, true)
ON CONFLICT (slug) DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  is_active = EXCLUDED.is_active;
