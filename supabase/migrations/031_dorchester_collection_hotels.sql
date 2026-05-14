-- Migration 031: Seed Dorchester Collection hotels
-- 9 properties across London, Paris, Rome, Milan, Los Angeles, and Beverly Hills.
-- cover_image_url will be set separately once client images are uploaded to storage.

INSERT INTO public.luxury_hotels (
  hotel_id, name, slug, city, state_region, country, neighborhood,
  hotel_company, hotel_type, room_count, room_style,
  vibe, experiences, description, detail_url, is_active, sort_order
) VALUES

-- ── United Kingdom ─────────────────────────────────────────────────────────

(
  'DC-001',
  'The Dorchester',
  'the-dorchester-united-kingdom',
  'London', NULL, 'United Kingdom', 'Mayfair',
  'Dorchester Collection', 'Luxury Hotel', 250,
  'Art Deco grandeur with hand-embroidered fabrics, marble bathrooms, and Hyde Park views',
  'Iconic',
  ARRAY['Fine Dining','Spa','Afternoon Tea','Bar & Cocktails','Romance','Celebrations'],
  'Overlooking Hyde Park since 1931, The Dorchester is London''s most storied luxury address, synonymous with celebrity, royalty, and impeccable British service. Its Art Deco interiors, celebrated Alain Ducasse restaurant, and the legendary Promenade set the gold standard for Mayfair grandeur. The 1930s-era Dorchester Spa and gold-leaf ballroom make it the definitive choice for discerning travellers seeking London at its most magnificent.',
  'https://www.dorchestercollection.com/london/the-dorchester/',
  true, 100
),

(
  'DC-002',
  '45 Park Lane',
  '45-park-lane-united-kingdom',
  'London', NULL, 'United Kingdom', 'Mayfair',
  'Dorchester Collection', 'Luxury Hotel', 54,
  'Contemporary art-filled suites with floor-to-ceiling windows and Hyde Park panoramas',
  'Contemporary',
  ARRAY['Fine Dining','Bar & Cocktails','Art & Culture','Romance','Wellness'],
  'A sleek, art-forward counterpart to its neighbour The Dorchester, 45 Park Lane opened in 2011 as London''s most design-conscious luxury hotel. Just 54 rooms and suites showcase an original modern art collection — including works by Damien Hirst — while CUT by Wolfgang Puck delivers the city''s most celebrated steakhouse. The intimate scale, Hyde Park views, and ultra-contemporary aesthetic attract a creative, style-savvy clientele.',
  'https://www.dorchestercollection.com/london/45-park-lane/',
  true, 101
),

(
  'DC-003',
  'Coworth Park',
  'coworth-park-united-kingdom',
  'Ascot', 'Berkshire', 'United Kingdom', 'Sunningdale',
  'Dorchester Collection', 'Country House Hotel', 70,
  'Country-house elegance with bespoke fabrics, four-poster beds, and parkland estate views',
  'Pastoral',
  ARRAY['Spa','Equestrian & Polo','Fine Dining','Wellness','Countryside Escapes','Romance'],
  'Set on 240 acres of Berkshire parkland adjacent to Windsor Great Park, Coworth Park is the Dorchester Collection''s only country-house hotel and the UK''s only hotel with its own polo field. The Regency mansion and surrounding cottages blend refined interiors with a world-class spa and equestrian programme, making it the consummate rural retreat within an hour of London. The Barn restaurant champions seasonal British cuisine rooted in the surrounding countryside.',
  'https://www.dorchestercollection.com/ascot/coworth-park/',
  true, 102
),

-- ── France ─────────────────────────────────────────────────────────────────

(
  'DC-004',
  'Le Meurice',
  'le-meurice-france',
  'Paris', NULL, 'France', '1st Arrondissement',
  'Dorchester Collection', 'Palace Hotel', 160,
  '18th-century Versailles-inspired interiors with gilded mouldings, Murano chandeliers, and Tuileries Garden views',
  'Regal',
  ARRAY['Fine Dining','Spa','Afternoon Tea','Bar & Cocktails','Art & Culture','Romance','Shopping'],
  'Facing the Tuileries Garden since 1835, Le Meurice is Paris''s original palace hotel and has welcomed Picasso, Dalí, and countless heads of state beneath its gilded, Louis XVI-inspired ceilings. The two-Michelin-starred Restaurant Le Meurice Alain Ducasse and the playful Bar 228 balance historical grandeur with witty contemporary art curated throughout. A discreet spa and impeccable address between the Louvre and Place de la Concorde make it the definitive Parisian palace.',
  'https://www.dorchestercollection.com/paris/le-meurice/',
  true, 103
),

(
  'DC-005',
  'Hôtel Plaza Athénée',
  'hotel-plaza-athenee-france',
  'Paris', NULL, 'France', '8th Arrondissement',
  'Dorchester Collection', 'Palace Hotel', 208,
  'Belle Époque elegance with iconic red geranium-draped balconies, brocade silks, and Eiffel Tower suite views',
  'Romantic',
  ARRAY['Fine Dining','Spa','Bar & Cocktails','Fashion & Shopping','Romance','Afternoon Tea','Weddings'],
  'Draped in signature crimson geraniums on Avenue Montaigne since 1913, Hôtel Plaza Athénée is the heart of Paris''s haute couture golden triangle — steps from Dior, Chanel, and Louis Vuitton. Alain Ducasse''s three-Michelin-starred restaurant and the legendary Bar du Plaza Athénée are Parisian dining institutions, while the Dior Institut spa brings couture wellness to the grandest scale. Suites gazing upon the Eiffel Tower solidify its status as Paris''s most romantic luxury address.',
  'https://www.dorchestercollection.com/paris/hotel-plaza-athenee/',
  true, 104
),

-- ── Italy ──────────────────────────────────────────────────────────────────

(
  'DC-006',
  'Hotel Eden',
  'hotel-eden-italy',
  'Rome', NULL, 'Italy', 'Via Veneto',
  'Dorchester Collection', 'Luxury Hotel', 98,
  'Belle Époque Roman elegance with warm terracotta tones, hand-painted frescoes, and panoramic rooftop terrace views',
  'Romantic',
  ARRAY['Fine Dining','Rooftop Dining','Spa','Romance','Sightseeing','Weddings'],
  'Perched on the Pincian Hill overlooking Rome''s skyline since 1889, Hotel Eden occupies one of the city''s most privileged positions, just steps from the Via Veneto and Villa Borghese. Its rooftop restaurant La Terrazza offers one of Rome''s most spectacular dining panoramas — a sea of domes and spires at golden hour. Interiors restored in 2017 blend Belle Époque heritage with warm contemporary Italian design and deeply personal service.',
  'https://www.dorchestercollection.com/rome/hotel-eden/',
  true, 105
),

(
  'DC-007',
  'Hotel Principe di Savoia',
  'hotel-principe-di-savoia-italy',
  'Milan', NULL, 'Italy', 'Porta Nuova',
  'Dorchester Collection', 'Grand Hotel', 301,
  '1920s Italian Liberty-style grandeur with frescoed ceilings, Murano glass, and bespoke Milanese craftsmanship',
  'Grand',
  ARRAY['Fine Dining','Spa & Pool','Bar & Cocktails','Fashion & Shopping','Business','Weddings','Private Events'],
  'A Milanese landmark since 1927, Hotel Principe di Savoia reigns over Piazza della Repubblica as the city''s grandest luxury address, favoured by fashion editors, business magnates, and royalty alike. Its opulent Italian Liberty-style interiors — frescoed ceilings, gilded columns, Murano chandeliers — are matched by the legendary Club 10 spa with its frescoed indoor pool, and a Presidential Suite with its own private swimming pool. Steps from the Quadrilatero della Moda, it remains Milan''s ultimate power address.',
  'https://www.dorchestercollection.com/milan/hotel-principe-di-savoia/',
  true, 106
),

-- ── United States ──────────────────────────────────────────────────────────

(
  'DC-008',
  'Hotel Bel-Air',
  'hotel-bel-air-united-states',
  'Los Angeles', 'California', 'United States', 'Bel Air',
  'Dorchester Collection', 'Boutique Hotel', 103,
  'California Hacienda-style bungalows nestled among swan-lake gardens with private terraces and fireplaces',
  'Secluded',
  ARRAY['Fine Dining','Spa','Pool','Romance','Wellness','Garden Weddings'],
  'Hidden behind a stone bridge and swan lake in the canyons of Bel Air, Hotel Bel-Air has been Hollywood''s most cherished secret since 1946. Its 12 acres of magnificent gardens and Mission Revival bungalows — where Grace Kelly, Marilyn Monroe, and John Wayne once retreated — offer a rare seclusion and romance just minutes from Beverly Hills. Wolfgang Puck''s acclaimed restaurant, a serene spa, and a heated outdoor pool complete an experience entirely apart from Los Angeles while remaining at its heart.',
  'https://www.dorchestercollection.com/los-angeles/hotel-bel-air/',
  true, 107
),

(
  'DC-009',
  'The Beverly Hills Hotel',
  'the-beverly-hills-hotel-united-states',
  'Beverly Hills', 'California', 'United States', 'Sunset Boulevard',
  'Dorchester Collection', 'Iconic Resort', 210,
  'Hollywood Regency bungalows and suites with signature banana-leaf print fabrics and lush private garden settings',
  'Iconic',
  ARRAY['Fine Dining','Pool & Cabanas','Spa','Bar & Cocktails','Romance','Weddings','Celebrity Culture'],
  'The Pink Palace of Hollywood has defined Beverly Hills luxury since opening in 1912, its flamingo-pink facade and banana-leaf interiors synonymous with old-Hollywood glamour. The legendary Polo Lounge has been the power-lunch table for entertainment royalty for over a century, while the pool and bungalows — favourites of Marilyn Monroe, Frank Sinatra, and Elizabeth Taylor — remain the most coveted sun loungers in Los Angeles. Impeccable Dorchester Collection stewardship brings contemporary service to this irreplaceable icon of American luxury.',
  'https://www.dorchestercollection.com/beverly-hills/the-beverly-hills-hotel/',
  true, 108
)

ON CONFLICT (slug) DO UPDATE SET
  name           = EXCLUDED.name,
  city           = EXCLUDED.city,
  state_region   = EXCLUDED.state_region,
  country        = EXCLUDED.country,
  neighborhood   = EXCLUDED.neighborhood,
  hotel_company  = EXCLUDED.hotel_company,
  hotel_type     = EXCLUDED.hotel_type,
  room_count     = EXCLUDED.room_count,
  room_style     = EXCLUDED.room_style,
  vibe           = EXCLUDED.vibe,
  experiences    = EXCLUDED.experiences,
  description    = EXCLUDED.description,
  detail_url     = EXCLUDED.detail_url,
  is_active      = EXCLUDED.is_active,
  sort_order     = EXCLUDED.sort_order,
  updated_at     = now();
