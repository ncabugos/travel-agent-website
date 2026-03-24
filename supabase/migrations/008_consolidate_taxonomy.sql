-- =============================================================================
-- Migration: 008_consolidate_taxonomy.sql
-- Description: Consolidate blog categories (30 → 10) and tags (237 → ~60)
--              for improved SEO pillar structure and cleaner UX.
--
-- Category mapping:
--   Destinations ← Destinations, South Africa, South America, Asia, Europe,
--                   Mexico, Hawaii, Africa, Egypt, France, Caribbean, Brazil, Galapagos
--   Hotels & Resorts ← Hotels
--   Beach & Island ← Beach, Island
--   Adventure ← Adventure, Diving, Safari
--   Culinary & Wine ← Wine Country
--   Cruise ← Cruise, River Cruising
--   Art & Culture ← Art
--   Travel Tips ← Travel Tips, Travel Quotes, Style
--   Family Travel ← Family Travel, EdenFYW Escorted Travel
--   Industry & Press ← Press, Luxury Travel Shows
--
-- Tag cleanup: removed branding (eden for your world, edenfyw), overly generic
-- (travel, luxury, vacation), normalized duplicates, kept SEO-valuable tags.
-- =============================================================================

-- john-oberacker CNT 2025
UPDATE public.blog_posts SET
  categories = '{"Industry & Press"}',
  tags = '{"Awards","Condé Nast Traveler","Virtuoso"}'
  WHERE slug = 'john-oberacker-has-been-named-one-of-conde-nast-travelers-top-travel-specialists-for-2025';

-- john-oberacker most innovative
UPDATE public.blog_posts SET
  categories = '{"Industry & Press","Travel Tips"}',
  tags = '{"Awards","Virtuoso"}'
  WHERE slug = 'john-oberacker-how-virtuosos-most-innovative-advisor-stays-ahead-of-the-curve';

-- john-oberacker wins 2018
UPDATE public.blog_posts SET
  categories = '{"Industry & Press"}',
  tags = '{"Awards","Virtuoso"}'
  WHERE slug = 'john-oberacker-of-eden-for-your-world-wins-virtuoso-2018-most-innovative-advisor-award';

-- turkey
UPDATE public.blog_posts SET
  categories = '{"Adventure","Art & Culture","Destinations","Hotels & Resorts","Travel Tips"}',
  tags = '{"Asia","Cappadocia","Europe","Istanbul","Turkey","Virtuoso"}'
  WHERE slug = 'turkey-an-edenfyw-travelers-view';

-- peru
UPDATE public.blog_posts SET
  categories = '{"Destinations","Family Travel","Hotels & Resorts"}',
  tags = '{"Cusco","Family Travel","History & Heritage","Inca","Machu Picchu","Peru","Sacred Valley","South America","Virtuoso"}'
  WHERE slug = 'peru';

-- private suite lax
UPDATE public.blog_posts SET
  categories = '{"Destinations","Travel Tips"}',
  tags = '{"LAX","Los Angeles","Private Aviation","VIP"}'
  WHERE slug = 'the-private-suite-at-lax';

-- capsule wardrobe
UPDATE public.blog_posts SET
  categories = '{"Travel Tips"}',
  tags = '{"Fashion & Style","Packing"}'
  WHERE slug = 'travel-capsule-wardrobe-by-sin60style';

-- meet kasra
UPDATE public.blog_posts SET
  categories = '{"Family Travel","Hotels & Resorts"}',
  tags = '{"Virtuoso"}'
  WHERE slug = 'meet-kasra-esteghamat-of-eden-for-your-world';

-- epic egypt
UPDATE public.blog_posts SET
  categories = '{"Adventure","Art & Culture","Cruise","Destinations","Hotels & Resorts"}',
  tags = '{"Africa","Aswan","Cairo","Culinary","Egypt","Four Seasons","Great Pyramids","History & Heritage","King Tut","Luxor","Oberoi Hotels","Ritz Carlton"}'
  WHERE slug = 'epic-egypt';

-- galapagos
UPDATE public.blog_posts SET
  categories = '{"Adventure","Beach & Island","Cruise","Destinations"}',
  tags = '{"Diving","Ecuador","Galapagos","Snorkeling","South America","Wildlife","Yacht"}'
  WHERE slug = 'the-galapagos';

-- vietnam
UPDATE public.blog_posts SET
  categories = '{"Adventure","Beach & Island","Destinations","Hotels & Resorts"}',
  tags = '{"Aman Resorts","Amanoi","Asia","Culinary","Da Nang","Diving","Eco Tourism","Hoi An","Honeymoon","Hue","La Residence","Nam Hai","Six Senses","Snorkeling","Spa & Wellness","The Reverie","Vietnam","Virtuoso"}'
  WHERE slug = 'luxurious-hideaways-in-vietnam';

-- paris
UPDATE public.blog_posts SET
  categories = '{"Art & Culture","Culinary & Wine","Destinations","Hotels & Resorts"}',
  tags = '{"Alain Ducasse","Dorchester Collection","Eiffel Tower","France","Le Bristol","Louvre","Oetker Collection","Paris","Plaza Athénée","Virtuoso"}'
  WHERE slug = 'paris-paris-paris';

-- amangiri
UPDATE public.blog_posts SET
  categories = '{"Adventure","Destinations","Hotels & Resorts"}',
  tags = '{"Aman Resorts","Amangiri","Honeymoon","Southwest USA","Utah"}'
  WHERE slug = 'amangiri';

-- virtuoso travel week 2014
UPDATE public.blog_posts SET
  categories = '{"Destinations","Hotels & Resorts","Industry & Press"}',
  tags = '{"Las Vegas","Virtuoso","Virtuoso Travel Week"}'
  WHERE slug = 'virtuoso-travel-week-2014';

-- maui hawaii
UPDATE public.blog_posts SET
  categories = '{"Beach & Island","Destinations","Hotels & Resorts"}',
  tags = '{"Andaz","Hawaii","Kapalua","Maui","Montage","Virtuoso","Wailea"}'
  WHERE slug = 'a-piece-of-eden-in-maui-hawaii';

-- virtuoso rising star
UPDATE public.blog_posts SET
  categories = '{"Industry & Press"}',
  tags = '{"Awards","Virtuoso","Virtuoso Travel Week"}'
  WHERE slug = 'virtuoso-rising-star-2014';

-- st barth
UPDATE public.blog_posts SET
  categories = '{"Beach & Island","Destinations","Hotels & Resorts"}',
  tags = '{"Caribbean","Le Toiny","Saint Barthélemy","Virtuoso"}'
  WHERE slug = 'la-vie-est-belle-en-st-barth';

-- buenos aires
UPDATE public.blog_posts SET
  categories = '{"Art & Culture","Culinary & Wine","Destinations","Hotels & Resorts"}',
  tags = '{"Argentina","Buenos Aires","Dining","Faena","Four Seasons","Park Hyatt","Shopping","Wine"}'
  WHERE slug = 'buenos-aires-argentina';

-- sao paolo
UPDATE public.blog_posts SET
  categories = '{"Destinations","Industry & Press"}',
  tags = '{"Brazil","ILTM","Sao Paolo"}'
  WHERE slug = 'travel-weeks-sao-paolo-2014';

-- jason decaires taylor
UPDATE public.blog_posts SET
  categories = '{"Adventure","Art & Culture","Beach & Island","Destinations"}',
  tags = '{"Diving","Jason deCaires Taylor","Mexico","SCUBA","Snorkeling","Underwater Art"}'
  WHERE slug = 'jason-decaires-taylor';

-- get up off the couch
UPDATE public.blog_posts SET
  categories = '{"Beach & Island","Destinations","Travel Tips"}',
  tags = '{"Brazil","Quotes","Rio de Janeiro"}'
  WHERE slug = 'get-up-off-the-couch';

-- get your hotel perks
UPDATE public.blog_posts SET
  categories = '{"Destinations","Hotels & Resorts"}',
  tags = '{"Dorchester Collection","Four Seasons","Mandarin Oriental","Peninsula","Ritz Carlton","Rocco Forte","Rosewood","VIP"}'
  WHERE slug = 'get-your-hotel-perks';

-- we give you the world
UPDATE public.blog_posts SET
  categories = '{"Travel Tips"}',
  tags = '{"Quotes","Virtuoso"}'
  WHERE slug = 'we-give-you-the-world';

-- hermanus south africa
UPDATE public.blog_posts SET
  categories = '{"Adventure","Beach & Island","Destinations","Hotels & Resorts"}',
  tags = '{"Africa","Birkenhead House","Great White Shark","Hermanus","Royal Portfolio","South Africa","Whales"}'
  WHERE slug = 'hermanus-and-birkenhead-house-south-africa';

-- cape town
UPDATE public.blog_posts SET
  categories = '{"Adventure","Art & Culture","Beach & Island","Destinations","Hotels & Resorts"}',
  tags = '{"Africa","Cape Grace","Cape Town","Mount Nelson Hotel","South Africa","Table Mountain","The Twelve Apostles"}'
  WHERE slug = 'cape-town-south-africa';

-- la residence franschhoek
UPDATE public.blog_posts SET
  categories = '{"Art & Culture","Culinary & Wine","Destinations","Hotels & Resorts"}',
  tags = '{"Franschhoek","La Residence","Royal Portfolio","South Africa","Wine"}'
  WHERE slug = 'la-residence-franschhoek-south-africa';

-- royal malewane
UPDATE public.blog_posts SET
  categories = '{"Adventure","Destinations","Hotels & Resorts"}',
  tags = '{"Africa","Royal Malewane","Safari","South Africa"}'
  WHERE slug = 'royal-malewane-thornybush-game-reserve-south-africa';

-- singita lebombo
UPDATE public.blog_posts SET
  categories = '{"Adventure","Destinations","Hotels & Resorts"}',
  tags = '{"Africa","Kruger National Park","Safari","Singita","South Africa"}'
  WHERE slug = 'singita-lebombo-lodge-kruger-national-park-south-africa';

-- phinda
UPDATE public.blog_posts SET
  categories = '{"Adventure","Destinations","Hotels & Resorts"}',
  tags = '{"Africa","Phinda","Safari","South Africa"}'
  WHERE slug = 'phinda-private-game-reserve-south-africa';

-- johannesburg
UPDATE public.blog_posts SET
  categories = '{"Destinations","Hotels & Resorts"}',
  tags = '{"Africa","Johannesburg","Mandela","Saxon Hotel","South Africa"}'
  WHERE slug = 'johannesburg-south-africa';

-- buddha quote
UPDATE public.blog_posts SET
  categories = '{"Travel Tips"}',
  tags = '{"Hong Kong","Quotes","Tian Tan Buddha"}'
  WHERE slug = 'buddhas-good-word-travel';

-- peace love travel
UPDATE public.blog_posts SET
  categories = '{"Art & Culture","Hotels & Resorts"}',
  tags = '{}'
  WHERE slug = 'peace-love-travel';
