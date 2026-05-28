-- Migration 032: Add The Lana Dubai (10th Dorchester Collection property)
-- Cover image already uploaded to hotel-covers/the-lana-dubai.jpg

INSERT INTO public.luxury_hotels (
  hotel_id, name, slug, city, state_region, country, neighborhood,
  hotel_company, hotel_type, room_count, room_style,
  vibe, experiences, description, cover_image_url, detail_url, is_active, sort_order
) VALUES (
  'DC-010',
  'The Lana',
  'the-lana-dubai',
  'Dubai', NULL, 'United Arab Emirates', 'Marasi Bay Marina',
  'Dorchester Collection', 'Luxury Hotel', 225,
  'Contemporary suites by Gilles & Boissier blending traditional and modern touches with marina and skyline views',
  'Glamorous',
  ARRAY['Fine Dining','Rooftop Bar','Dior Spa','Pool & Cabanas','Bar & Cocktails','Romance','Business'],
  'Rising above the sparkling waters of Marasi Bay Marina, The Lana is the Dorchester Collection''s first Middle Eastern address — a soaring tower of light and space where designers Gilles & Boissier weave the bold spirit of Dubai into every detail. Five acclaimed restaurants and bars, including concepts by 12-Michelin-starred Martín Berasategui and star chef Jean Imbert, make The Lana the city''s most exciting dining destination. The Dior Spa, rooftop High Society club, and impeccable service complete a stay that sets a new benchmark for luxury in the UAE.',
  'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/the-lana-dubai.jpg',
  'https://www.dorchestercollection.com/dubai/the-lana/',
  true, 109
)
ON CONFLICT (slug) DO UPDATE SET
  name           = EXCLUDED.name,
  city           = EXCLUDED.city,
  country        = EXCLUDED.country,
  neighborhood   = EXCLUDED.neighborhood,
  hotel_company  = EXCLUDED.hotel_company,
  hotel_type     = EXCLUDED.hotel_type,
  room_count     = EXCLUDED.room_count,
  room_style     = EXCLUDED.room_style,
  vibe           = EXCLUDED.vibe,
  experiences    = EXCLUDED.experiences,
  description    = EXCLUDED.description,
  cover_image_url= EXCLUDED.cover_image_url,
  detail_url     = EXCLUDED.detail_url,
  is_active      = EXCLUDED.is_active,
  sort_order     = EXCLUDED.sort_order,
  updated_at     = now();
