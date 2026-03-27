-- =============================================================================
-- Migration: 010_seed_data.sql
-- Description: Seed data for Template 2 collections.
--              1. 21 cruise lines (ocean/river/yacht)
--              2. Featured partners (cruise category)
--              3. Sample program featured properties (6 per program)
-- =============================================================================

-- =============================================================================
-- 1. CRUISE LINES
-- =============================================================================

insert into public.cruise_lines (name, slug, logo_url, hero_image_url, description, cruise_type, highlights, ships, sort_order) values

-- OCEAN CRUISES
('Regent Seven Seas Cruises', 'regent-seven-seas', '/media/cruises/regent-seven-seas/regent-logo.png', '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',
 'The world''s most luxurious fleet. Every suite, every restaurant, every excursion — everything is included.',
 'ocean',
 '["All-inclusive luxury","Free unlimited shore excursions","Free specialty dining","Free unlimited beverages","Free WiFi","Butler service in every suite"]'::jsonb,
 '[]'::jsonb, 1),

('Silversea Cruises', 'silversea', '/media/cruises/silversea/silversea-logo.png', '/media/cruises/silversea/silversea-hero.jpg',
 'Ultra-luxury, expedition, and classic voyages to all seven continents. Intimate ships, global itineraries.',
 'ocean',
 '["All-inclusive fares","Butler service","Personalized voyages","Intimate ships under 600 guests","Expedition cruises to Antarctica"]'::jsonb,
 '[]'::jsonb, 2),

('Seabourn Cruises', 'seabourn', '/media/cruises/seabourn/seabourn-logo.png', '/media/cruises/seabourn/seabourn-cruises-hero-2000.jpg',
 'Ultra-luxury voyages with curated experiences, an award-winning spa, and Michelin-inspired cuisine.',
 'ocean',
 '["All-inclusive dining","Complimentary premium spirits","Gratuities included","Marina watersports platform","Award-winning spa"]'::jsonb,
 '[]'::jsonb, 3),

('Oceania Cruises', 'oceania', '/media/cruises/oceania/oceania-logo.png', '/media/cruises/oceania/oceania_cruises-oClass-Grand-Dining-Room-hero.jpg',
 'The finest cuisine at sea. Mid-size ships, destination-rich itineraries, and a country-club casual atmosphere.',
 'ocean',
 '["Finest cuisine at sea","Free specialty dining","Destination-rich itineraries","Free WiFi and shuttle service","Mid-size elegance"]'::jsonb,
 '[]'::jsonb, 4),

('Cunard Line', 'cunard', '/media/cruises/cunard/cunard-logo-black-600.jpg', '/media/cruises/cunard/cunard-Grand-Lobby-hero.jpg',
 'Iconic ocean liners with grand transatlantic crossings and voyages around the globe since 1840.',
 'ocean',
 '["Grand transatlantic crossings","Iconic Queen Mary 2","White Star service","Black-tie gala evenings","Planetarium at sea"]'::jsonb,
 '[]'::jsonb, 5),

('Ponant Cruises', 'ponant', '/media/cruises/ponant/PONANT_Logo_white-500.png', '/media/cruises/ponant/ponant-hero-2200.jpg',
 'French luxury expedition cruises to the world''s most remote and pristine destinations.',
 'ocean',
 '["French luxury heritage","Expedition and cultural cruises","Small ships under 300 guests","Open-air marina","Zodiac excursions"]'::jsonb,
 '[]'::jsonb, 6),

('Azamara', 'azamara', '/media/cruises/azamara/azamara-logo-black-600.jpg', '/media/cruises/azamara/azamara-hero-2200.jpg',
 'Destination-immersive boutique cruises with longer stays and night touring in port.',
 'ocean',
 '["Longer port stays","Night touring","Boutique mid-size ships","Destination immersion","Inclusive beverages"]'::jsonb,
 '[]'::jsonb, 7),

('Celebrity Cruises', 'celebrity', '/media/cruises/celebrity/celebrity-logo.png', '/media/cruises/celebrity/celebrity-hero-2500.jpg',
 'Modern luxury at sea with award-winning design, globally inspired dining, and transformative spa experiences.',
 'ocean',
 '["Modern luxury design","Globally inspired cuisine","Transformative spa","The Retreat suite experience","Always Included pricing"]'::jsonb,
 '[]'::jsonb, 8),

('Windstar Cruises', 'windstar', '/media/cruises/windstar/windstar-logo.png', '/media/cruises/windstar/windstar-hero.png',
 'Small ships and sailing yachts with a casually elegant atmosphere. 148 to 342 guests.',
 'ocean',
 '["Small ship intimacy","Sailing yacht fleet","Watersports platform","Open bridge policy","All-inclusive packages"]'::jsonb,
 '[]'::jsonb, 9),

('Lindblad Expeditions', 'lindblad', '/media/cruises/lindblad/lindblad-logo.png', '/media/cruises/lindblad/lindblad-hero.jpg',
 'National Geographic expedition cruises — immersive adventures to the planet''s wildest places.',
 'ocean',
 '["National Geographic partnership","Expert naturalists onboard","Expedition landings","Undersea specialists","Photography program"]'::jsonb,
 '[]'::jsonb, 10),

('UnCruise Adventures', 'uncruise', '/media/cruises/uncruise/uncruise-logo-black-540.jpg', '/media/cruises/uncruise/UnCruise-hero-1400x624-Snorkeling_Baja_California--Ellen-Barone.jpg',
 'Small ship adventure cruises in Alaska, Hawaii, Galápagos, and the Pacific Northwest.',
 'ocean',
 '["22-86 guests per ship","Adventure focused","Kayaking and snorkeling","Wilderness hiking","All-inclusive"]'::jsonb,
 '[]'::jsonb, 11),

('Star Clippers', 'star-clippers', '/media/cruises/star-clippers/star-clippers-logo.png', '/media/cruises/star-clippers/star_clippers-hero_v2-2000.jpg',
 'The world''s largest fleet of tall sailing ships — an authentic sailing experience with mega-yacht intimacy.',
 'ocean',
 '["Authentic tall ship sailing","170-227 guests","Watersports platform","Informal barefoot elegance","Unique ports of call"]'::jsonb,
 '[]'::jsonb, 12),

('Paul Gauguin Cruises', 'paul-gauguin', '/media/cruises/paul-gauguin/pg-logo.png', '/media/cruises/paul-gauguin/pg-borabora-hero.jpg',
 'The award-winning luxury cruise line of French Polynesia. Year-round voyages through Tahiti, Bora Bora, and the Society Islands.',
 'ocean',
 '["Year-round in Tahiti","All-inclusive luxury","Watersports marina","332-guest boutique ship","Les Gauguines cultural hosts"]'::jsonb,
 '[]'::jsonb, 13),

('Explora Journeys', 'explora-journeys', '/media/cruises/explora/explora-logo.png', '/media/cruises/explora/explora-hero.jpg',
 'The ocean lifestyle brand by MSC Group. A new standard of luxury at sea with ocean residences and suites.',
 'ocean',
 '["All-suite ocean residences","9 dining experiences","Helios Pool & Spa","Inclusive fine dining and beverages","Ocean Residences from 377 sq ft"]'::jsonb,
 '[]'::jsonb, 14),

-- RIVER CRUISES
('AmaWaterways', 'amawaterways', '/media/cruises/ama-waterways/amawaterways-logo.png', '/media/cruises/ama-waterways/amawaterways-amamagna-hero-2200.jpg',
 'Award-winning luxury river cruises through the heart of Europe, Asia, Africa, and South America.',
 'river',
 '["Included shore excursions","Chef''s Table specialty dining","Bikes and hiking programs","Wellness program with fitness classes","Twin balcony staterooms"]'::jsonb,
 '[]'::jsonb, 15),

('Uniworld Boutique River Cruises', 'uniworld', '/media/cruises/uniworld/uniworld-logo.png', '/media/cruises/uniworld/uniworld-sunset-hero-2000.jpg',
 'The world''s most luxurious all-inclusive river cruise line. Each ship is a floating boutique hotel.',
 'river',
 '["All-inclusive luxury","One-of-a-kind ship designs","Unlimited included excursions","Farm-to-table cuisine","Butler service in top suites"]'::jsonb,
 '[]'::jsonb, 16),

('Viking Cruises', 'viking', '/media/cruises/viking/viking-logo.png', '/media/cruises/viking/Viking_Longship_hero.jpg',
 'Destination-focused river, ocean, and expedition cruises for curious travellers. Award-winning Scandinavian design.',
 'river',
 '["Destination-focused itineraries","Scandinavian design","Included cultural excursions","The Spa on every ship","Complimentary beer and wine at meals"]'::jsonb,
 '[]'::jsonb, 17),

('Scenic Cruises', 'scenic', '/media/cruises/scenic/scenic-logo.png', '/media/cruises/scenic/Scenic-Eclipse-Antarctica-On-the-Ice---Emperor-hero-2000.jpg',
 'All-inclusive, 5-star luxury river and ocean cruises. Space ships with innovative design.',
 'river',
 '["All-inclusive 5-star luxury","Sun Lounge balcony suites","Unlimited premium beverages","Butler service","Scenic Enrich exclusive experiences"]'::jsonb,
 '[]'::jsonb, 18),

('Amadeus River Cruises', 'amadeus', '/media/cruises/amadeus/amadeus-logo.png', '/media/cruises/amadeus/amadeus-hero.jpg',
 'European river cruises with classic Viennese elegance and exceptional culinary experiences.',
 'river',
 '["Classic European elegance","Panoramic twin balcony suites","Lido bar on top deck","Classical music program","Culinary excellence"]'::jsonb,
 '[]'::jsonb, 19),

-- YACHT CRUISES
('Four Seasons Yachts', 'four-seasons-yachts', '/media/cruises/four_seasons_yacht/fs-yacht-logo.png', '/media/cruises/four_seasons_yacht/YCT_207_aspect16x9.jpg',
 'The legendary Four Seasons experience, now at sea. Ultra-luxury yacht cruises with the brand''s signature service.',
 'yacht',
 '["Four Seasons legendary service","All-suite yacht","Michelin-level dining","Transformative spa","1:1 guest-to-staff ratio"]'::jsonb,
 '[]'::jsonb, 20),

('Sea Cloud Cruises', 'sea-cloud', '/media/cruises/sea-cloud/sea-cloud-logo.png', '/media/cruises/sea-cloud/sea-cloud-hero.jpg',
 'Sailing on original tall ships — maritime heritage meets world-class luxury on the open sea.',
 'yacht',
 '["Historic tall sailing ships","64-136 guests","Hand-set sails by crew","Gourmet international dining","Unique ports unreachable by larger ships"]'::jsonb,
 '[]'::jsonb, 21);


-- =============================================================================
-- 2. FEATURED PARTNERS (cruise category from cruise_lines)
-- =============================================================================

insert into public.featured_partners (name, slug, logo_url, category, is_preferred, sort_order)
select cl.name, cl.slug, cl.logo_url, 'cruise', true, cl.sort_order
from public.cruise_lines cl
where cl.is_active = true
on conflict (slug) do nothing;

-- Add hotel programs as featured partners (hotel category)
insert into public.featured_partners (name, slug, logo_url, category, is_preferred, sort_order) values
('Belmond Bellini Club',            'belmond-bellini-club-partner',     '/assets/supplier logos/hotel-programs/belmond-bellini-club.png',    'hotel', true, 1),
('Four Seasons Preferred Partner',  'four-seasons-partner',             '/assets/supplier logos/hotel-programs/four-seasons-preferred.png',  'hotel', true, 2),
('Aman Hotels',                     'aman-partner',                     '/assets/supplier logos/hotel-programs/aman.png',                    'hotel', true, 3),
('Auberge Resorts Collection',      'auberge-partner',                  '/assets/supplier logos/hotel-programs/auberge.png',                 'hotel', true, 4),
('Rosewood Elite',                  'rosewood-partner',                 '/assets/supplier logos/hotel-programs/rosewood.png',                'hotel', true, 5),
('Mandarin Oriental Fan Club',      'mandarin-oriental-partner',        '/assets/supplier logos/hotel-programs/mandarin-oriental.png',       'hotel', true, 6),
('One&Only',                        'one-and-only-partner',             '/assets/supplier logos/hotel-programs/one-and-only.png',            'hotel', true, 7),
('World of Hyatt Privé',            'hyatt-prive-partner',              '/assets/supplier logos/hotel-programs/hyatt-prive.png',             'hotel', true, 8),
('The Ritz-Carlton STARS',          'ritz-carlton-partner',             '/assets/supplier logos/hotel-programs/ritz-carlton.png',            'hotel', true, 9),
('The Peninsula PenClub',           'peninsula-partner',                '/assets/supplier logos/hotel-programs/peninsula.png',               'hotel', true, 10)
on conflict (slug) do nothing;


-- =============================================================================
-- 3. PROGRAM FEATURED PROPERTIES (6 per hotel program)
-- =============================================================================

-- Belmond Bellini Club
insert into public.program_featured_properties (program_slug, name, location, image_url, description, sort_order) values
('belmond-bellini-club', 'Belmond Hotel Cipriani',        'Venice, Italy',             '/media/hotel-programs/belmond-bellini-club/cipriani.jpg',         'An iconic retreat on Giudecca island, steps from St. Mark''s Square.', 1),
('belmond-bellini-club', 'Belmond Hotel Splendido',       'Portofino, Italy',          '/media/hotel-programs/belmond-bellini-club/splendido.jpg',        'A former monastery perched on the hillside above Portofino harbour.', 2),
('belmond-bellini-club', 'Belmond Cap Juluca',            'Anguilla, Caribbean',       '/media/hotel-programs/belmond-bellini-club/cap-juluca.jpg',       'A Moorish-inspired beachfront sanctuary on Maundays Bay.', 3),
('belmond-bellini-club', 'Belmond Maroma Resort & Spa',   'Riviera Maya, Mexico',      '/media/hotel-programs/belmond-bellini-club/maroma.jpg',           'An intimate hideaway on a pristine stretch of Caribbean coastline.', 4),
('belmond-bellini-club', 'Belmond Mount Nelson Hotel',    'Cape Town, South Africa',   '/media/hotel-programs/belmond-bellini-club/mount-nelson.jpg',     'The iconic Pink Lady of Cape Town, set in nine acres of gardens.', 5),
('belmond-bellini-club', 'Belmond Sanctuary Lodge',       'Cusco, Peru',               '/media/hotel-programs/belmond-bellini-club/sanctuary-lodge.jpg',  'The only hotel at the gates of Machu Picchu.', 6),

-- Four Seasons Preferred Partner
('four-seasons-preferred-partner', 'Four Seasons Resort Maui',        'Wailea, Hawaii',            '/media/hotel-programs/four-seasons/fs-maui-ocean_suite-3840x2160.jpg',  'An oceanfront paradise on Maui''s most stunning shoreline.', 1),
('four-seasons-preferred-partner', 'Four Seasons Resort Bora Bora',   'Bora Bora, French Polynesia', '/media/hotel-programs/four-seasons/fs-borabora.jpg',                 'Overwater bungalows on a private islet in a turquoise lagoon.', 2),
('four-seasons-preferred-partner', 'Four Seasons Grand-Hôtel du Cap-Ferrat', 'Saint-Jean-Cap-Ferrat, France', '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg',    'A legendary Riviera palace on 17 acres of lush gardens.', 3),
('four-seasons-preferred-partner', 'Four Seasons San Domenico Palace', 'Taormina, Sicily',         '/media/hero images/four-seasons-taormina-pool-hero.jpg',             'A 15th-century Dominican convent overlooking Mount Etna.', 4),
('four-seasons-preferred-partner', 'Four Seasons Resort at The Surf Club', 'Surfside, Florida',    '/media/hotel-programs/four-seasons/fs-surfclub.jpg',                 'Where old Hollywood glamour meets modern Miami luxury.', 5),
('four-seasons-preferred-partner', 'Four Seasons Hotel Astir Palace', 'Athens, Greece',             '/media/hero images/four-seasons-astir-hero.jpg',                    'A private peninsula resort on the Athenian Riviera.', 6),

-- Rosewood Elite
('rosewood-elite', 'Rosewood Hong Kong',          'Kowloon, Hong Kong',         '/media/hotel-programs/rosewood/rosewood-hk.jpg',            'A contemporary urban resort on Victoria Harbour.', 1),
('rosewood-elite', 'Rosewood London',             'London, United Kingdom',     '/media/hotel-programs/rosewood/rosewood-london.jpg',         'A grand Edwardian manor house in the heart of Holborn.', 2),
('rosewood-elite', 'Rosewood Castiglion del Bosco', 'Montalcino, Italy',       '/media/hotel-programs/rosewood/rosewood-castiglion.jpg',     'A Tuscan estate surrounded by vineyards and olive groves.', 3),
('rosewood-elite', 'Rosewood Baha Mar',           'Nassau, Bahamas',            '/media/hotel-programs/rosewood/rosewood-baha-mar.jpg',       'A beachfront Caribbean resort on Cable Beach.', 4),
('rosewood-elite', 'Rosewood Miramar Beach',      'Montecito, California',      '/media/hotel-programs/rosewood/rosewood-miramar.jpg',        'A coastal sanctuary on storied Miramar Beach.', 5),
('rosewood-elite', 'Rosewood São Paulo',           'São Paulo, Brazil',         '/media/hotel-programs/rosewood/rosewood-sao-paulo.jpg',      'A vertical garden tower in Brazil''s vibrant cultural capital.', 6),

-- Aman
('aman-hotels-and-resorts', 'Aman Venice',            'Venice, Italy',              '/media/hotel-programs/aman/aman-venice.jpg',         'A 16th-century palazzo on the Grand Canal.', 1),
('aman-hotels-and-resorts', 'Aman Tokyo',             'Tokyo, Japan',               '/media/hotel-programs/aman/aman-tokyo.jpg',          'A serene sanctuary in the heart of Otemachi, Tokyo.', 2),
('aman-hotels-and-resorts', 'Amangiri',               'Canyon Point, Utah',         '/media/hotel-programs/aman/amangiri.jpg',            'A desert sanctuary carved into 600 acres of Utah canyon lands.', 3),
('aman-hotels-and-resorts', 'Amanpuri',               'Phuket, Thailand',           '/media/hotel-programs/aman/amanpuri.jpg',            'The original Aman — a coconut palm headland overlooking the Andaman Sea.', 4),
('aman-hotels-and-resorts', 'Aman New York',           'New York City',             '/media/hotel-programs/aman/aman-nyc.jpg',            'An urban sanctuary occupying the Crown Building on Fifth Avenue.', 5),
('aman-hotels-and-resorts', 'Amankila',               'Bali, Indonesia',            '/media/hotel-programs/aman/amankila.jpg',            'A cliffside retreat overlooking the Lombok Strait in East Bali.', 6),

-- Hyatt Privé
('hyatt-prive', 'Park Hyatt New York',          'New York City',              '/media/hotel-programs/hyatt/park-hyatt-nyc.jpg',       'A sophisticated urban retreat overlooking Carnegie Hall.', 1),
('hyatt-prive', 'Park Hyatt Maldives',          'Hadahaa, Maldives',          '/media/hotel-programs/hyatt/park-hyatt-maldives.jpg',  'An intimate island sanctuary in the pristine Gaafu Alifu Atoll.', 2),
('hyatt-prive', 'Park Hyatt Sydney',            'Sydney, Australia',          '/media/hotel-programs/hyatt/park-hyatt-sydney.jpg',    'Harbourfront luxury with uninterrupted Opera House views.', 3),
('hyatt-prive', 'Alila Villas Uluwatu',         'Bali, Indonesia',            '/media/hotel-programs/hyatt/alila-uluwatu.jpg',        'A dramatic cliffside resort on Bali''s Bukit Peninsula.', 4),
('hyatt-prive', 'Andaz Tokyo Toranomon Hills',  'Tokyo, Japan',               '/media/hotel-programs/hyatt/andaz-tokyo.jpg',          'A lifestyle luxury hotel in the soaring Toranomon Hills tower.', 5),
('hyatt-prive', 'Grand Hyatt Baha Mar',         'Nassau, Bahamas',            '/media/hotel-programs/hyatt/grand-hyatt-baha-mar.jpg', 'A vibrant Caribbean resort on Cable Beach.', 6),

-- Mandarin Oriental Fan Club
('mandarin-oriental-fan-club', 'Mandarin Oriental Bangkok',    'Bangkok, Thailand',         '/media/hotel-programs/mandarin-oriental/mo-bangkok.jpg',    'The legendary riverside hotel — an icon of Thai hospitality since 1876.', 1),
('mandarin-oriental-fan-club', 'Mandarin Oriental Hong Kong',  'Central, Hong Kong',        '/media/hotel-programs/mandarin-oriental/mo-hk.jpg',         'The city''s most celebrated address overlooking Victoria Harbour.', 2),
('mandarin-oriental-fan-club', 'Mandarin Oriental London',     'Knightsbridge, London',     '/media/hotel-programs/mandarin-oriental/mo-london.jpg',     'A sophisticated retreat between Hyde Park and Knightsbridge.', 3),
('mandarin-oriental-fan-club', 'Mandarin Oriental Paris',      'Paris, France',             '/media/hotel-programs/mandarin-oriental/mo-paris.jpg',      'Art Deco elegance on the renowned Rue Saint-Honoré.', 4),
('mandarin-oriental-fan-club', 'Mandarin Oriental Ritz Madrid', 'Madrid, Spain',            '/media/hotel-programs/mandarin-oriental/mo-ritz-madrid.jpg','The legendary Ritz Madrid, reimagined by the Mandarin Oriental group.', 5),
('mandarin-oriental-fan-club', 'Mandarin Oriental Canouan',    'Canouan, St. Vincent',      '/media/hotel-programs/mandarin-oriental/mo-canouan.jpg',    'A secluded Caribbean hideaway on a private 26-acre estate.', 6);
