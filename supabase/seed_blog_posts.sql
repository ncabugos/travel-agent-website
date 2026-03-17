-- =============================================================================
-- Seed: seed_blog_posts.sql
-- Description: Seeds 10 blog posts for the Eden For Your World demo agent.
--              Run AFTER migration 003_blog_posts.sql.
--
-- IMPORTANT: Replace the agent_id UUID below with your actual agent UUID
-- from the agents table. You can find it by running:
--   SELECT id FROM public.agents LIMIT 1;
-- =============================================================================

-- Set your agent UUID here:
\set eden_agent_id '''00000000-0000-0000-0000-000000000001'''

insert into public.blog_posts
  (agent_id, title, slug, published_at, excerpt, body_html, cover_image_url, categories, tags, status)
values

-- 1. Condé Nast Top Travel Specialist 2025
(
  :eden_agent_id::uuid,
  'John Oberacker Named Condé Nast Top Travel Specialist 2025',
  'conde-nast-top-travel-specialist-2025',
  '2025-10-15T00:00:00Z',
  'We''re proud to share that John Oberacker has been named one of Condé Nast Traveler''s Top Travel Specialists for 2025, a distinction reserved for the most trusted names in luxury travel.',
  '<p>We''re proud to share that John Oberacker has been named one of Condé Nast Traveler''s Top Travel Specialists for 2025, a distinction reserved for the most trusted names in luxury travel.</p>
<p>When Condé Nast Traveler set out to identify the definitive voices shaping the future of elite travel, they turned to a highly selective group of experts with unrivaled access and insight. John was one of them.</p>
<p>From private safaris in remote corners of Africa to behind-the-scenes cultural immersions in the world''s great cities, bespoke rail journeys, ultra-luxury yacht charters, and yes… even fly-fishing in pristine, off-the-grid locales, John curates experiences that are as singular as they are seamless.</p>
<p>His clients don''t just travel; they collect extraordinary moments crafted with intention, precision, and absolute discretion.</p>
<p>If you''re ready to experience the world on your own terms with every detail expertly handled — he is your trusted architect of the exceptional.</p>',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=85',
  '{press,awards}',
  '{virtuoso-travel,award,luxury-travel}',
  'published'
),

-- 2. Virtuoso Most Innovative Advisor
(
  :eden_agent_id::uuid,
  'How Virtuoso''s Most Innovative Advisor Stays Ahead of the Curve',
  'virtuoso-most-innovative-advisor',
  '2018-10-10T00:00:00Z',
  'Staying ahead of the curve in the luxury travel industry and setting the trends instead of following them is a tall order — especially when the definition of "luxury" is ever-changing.',
  '<p>Staying ahead of the curve in the luxury travel industry and setting the trends instead of following them is a tall order — especially when the definition of "luxury" is ever-changing — but it''s what makes the advisors who pull it off so special.</p>
<p>John Oberacker of Eden for Your World has consistently pushed boundaries in luxury travel, earning recognition as Virtuoso''s Most Innovative Advisor. His approach combines deeply personal client relationships with cutting-edge technology and an insatiable passion for discovering the world''s hidden gems.</p>
<p>"Innovation isn''t about flashy gadgets," John explains. "It''s about understanding what your clients need before they know they need it. It''s about creating experiences that don''t exist in any brochure."</p>',
  'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=85',
  '{press,awards}',
  '{virtuoso-travel,innovation}',
  'published'
),

-- 3. Turkey – An EdenFYW Traveler''s View
(
  :eden_agent_id::uuid,
  'Turkey – An EdenFYW Traveler''s View',
  'turkey-edenfyw-travelers-view',
  '2018-05-15T00:00:00Z',
  'Please put away any preconceived ideas you have about the country of Turkey! My husband and I recently visited Istanbul, Cappadocia, and Izmir. In a nutshell, it is very safe and incredibly clean.',
  '<p>Please put away any preconceived ideas you have about the country of Turkey! My husband and I recently visited Istanbul, Cappadocia, and Izmir. In a nutshell, it is very safe and incredibly clean.</p>
<p>The food was outstanding – fresh, flavourful, and presented with care at every turn. The people were warm and welcoming, and the history was simply unparalleled. Walking through the Hagia Sophia, cruising the Bosphorus, and witnessing the surreal landscape of Cappadocia from a hot air balloon at sunrise were moments we will never forget.</p>
<p>Turkey has so much more to offer than most travellers realise. From boutique cave hotels in Cappadocia to five-star resorts along the Aegean coast, this country is a treasure trove of luxury experiences waiting to be discovered.</p>',
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&q=85',
  '{destinations,europe}',
  '{turkey,istanbul,cappadocia}',
  'published'
),

-- 4. Epic Egypt
(
  :eden_agent_id::uuid,
  'Epic Egypt',
  'epic-egypt',
  '2017-04-20T00:00:00Z',
  'We thought we''d have checked Egypt off our bucket list after our recent visit. It turns out we are going to keep it on, because it''s a destination worthy of a return.',
  '<p>We thought we''d have checked Egypt off our bucket list after our recent visit. It turns out we are going to keep it on, because it''s a destination worthy of a return. There is so much to see, so much to take in!</p>
<p>The pyramids at Giza are a given — they''re magnificent, humbling, and exactly as awe-inspiring as you''d imagine. But what surprised us was everything else: the treasures of the Egyptian Museum, the tranquility of a felucca on the Nile at sunset, and the sheer magic of Luxor''s temples illuminated at night.</p>
<p>Egypt is a place that demands your full attention, rewards your curiosity, and stays with you long after you leave.</p>',
  'https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=900&q=85',
  '{destinations,africa}',
  '{egypt,pyramids,nile}',
  'published'
),

-- 5. The Galapagos
(
  :eden_agent_id::uuid,
  'The Galapagos',
  'the-galapagos',
  '2015-08-10T00:00:00Z',
  'Eden For Your World does the Galapagos – but, not the blog. Please enjoy the following guest blog post from our dear guest Mrs. Josephine M., who accompanied us to experience the magic of the islands!',
  '<p>Eden For Your World does the Galapagos – but, not the blog. Please enjoy the following guest blog post from our dear guest Mrs. Josephine M., who accompanied us, along with her family, to experience the magic of the islands!</p>
<p>The Galapagos are unlike anywhere else on earth. The wildlife has no fear of humans — sea lions sleep on park benches, blue-footed boobies do their courting dance metres from your camera, and giant tortoises move at their glacial pace while you stand in open-mouthed wonder.</p>
<p>Sailing between the islands aboard a luxury expedition yacht brought a daily parade of natural marvel. Snorkelling alongside marine iguanas, sea turtles, and playful sea lion pups was a privilege that words can barely capture.</p>',
  'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=900&q=85',
  '{destinations,adventure}',
  '{galapagos,wildlife,south-america}',
  'published'
),

-- 6. Incredible India
(
  :eden_agent_id::uuid,
  'Incredible India',
  'incredible-india',
  '2015-07-05T00:00:00Z',
  'India – the one land that all men desire to see, and having seen once, by even a glimpse, would not give that glimpse for all the shows of all the rest of the globe combined.',
  '<p>"India – the one land that all men desire to see, and having seen once, by even a glimpse, would not give that glimpse for all the shows of all the rest of the globe combined." — Mark Twain</p>
<p>Incredible India lived up to every expectation and then shattered them. The Taj Mahal at dawn is a vision of perfection that no photograph can ever truly convey. The palaces of Rajasthan — Udaipur, Jaipur, Jodhpur — are a riot of colour, history, and romance.</p>
<p>But perhaps the most memorable moments were the simplest: the scent of jasmine in a hotel garden, the warm chai offered by a street vendor, the sound of temple bells at dusk. India is a feast for every sense.</p>',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=85',
  '{destinations,asia}',
  '{india,taj-mahal,rajasthan}',
  'published'
),

-- 7. AMANGIRI
(
  :eden_agent_id::uuid,
  'AMANGIRI',
  'amangiri',
  '2014-11-07T00:00:00Z',
  'Fused with the ancient rock formations of the Colorado Plateau in Southern Utah, AMANGIRI truly embodies its namesake as a "peaceful mountain."',
  '<p>Fused with the ancient rock formations of the Colorado Plateau in Southern Utah, AMANGIRI truly embodies its namesake as a "peaceful mountain."</p>
<p>This is a resort that feels like it was carved from the earth itself. The minimalist architecture, all concrete and glass, doesn''t compete with its breathtaking surroundings — it amplifies them. Floor-to-ceiling windows frame the desert like living paintings.</p>
<p>The spa, the dining, the guided hikes through slot canyons — every element is designed with intention and restraint. Amangiri is proof that sometimes the most powerful luxury is simply space, silence, and sky.</p>',
  'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=900&q=85',
  '{hotels,destinations}',
  '{amangiri,utah,aman,desert}',
  'published'
),

-- 8. Paris! Paris! Paris!
(
  :eden_agent_id::uuid,
  'Paris! Paris! Paris!',
  'paris-paris-paris',
  '2014-12-15T00:00:00Z',
  'Je suis sous le charme! Paris is magic! Anyone who tells you different is confused!',
  '<p>Je suis sous le charme! Paris is magic! Anyone who tells you different is confused! We happened to fall upon it during the winter holidays. It was the first time we''d been there to witness no leaves on the trees and very little of the quintessential overflow of tourists.</p>
<p>Winter Paris has a charm all its own. The Christmas markets along the Champs-Élysées, the warm glow of café terraces, the way the Seine reflects the city lights on a cold evening — it''s pure romance.</p>
<p>We stayed at the Hôtel Plaza Athénée, naturally. Alain Ducasse''s restaurant was sublime, and the views of the Eiffel Tower from our suite made the chilly mornings entirely worthwhile.</p>',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=85',
  '{destinations,europe}',
  '{paris,france,winter-travel}',
  'published'
),

-- 9. A Piece of Eden in Maui Hawaii
(
  :eden_agent_id::uuid,
  'A Piece of Eden in Maui, Hawaii',
  'piece-of-eden-maui-hawaii',
  '2014-07-16T00:00:00Z',
  'You have to LOVE a place to return to it year after year. Maui, Hawaii, is one of those places for all three of us at Eden For Your World.',
  '<p>You have to LOVE a place to return to it year after year. Maui, Hawaii, is one of those places for all three of us at Eden For Your World. Jill has made annual pilgrimages with her family for years, as have John and I.</p>
<p>There''s something about Maui that never gets old — the Road to Hana, the sunrise at Haleakalā, the whales breaching offshore in winter, the sheer abundance of beauty at every turn.</p>
<p>For our clients, we always recommend the Four Seasons Maui at Wailea or the Montage Kapalua Bay. Both properties offer that perfect blend of Hawaiian warmth and world-class luxury that makes Maui feel like home — even if you''re there for the first time.</p>',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85',
  '{destinations,beach}',
  '{maui,hawaii,beach,four-seasons}',
  'published'
),

-- 10. Rosewood London Calling
(
  :eden_agent_id::uuid,
  'Rosewood London Calling',
  'rosewood-london-calling',
  '2015-01-20T00:00:00Z',
  'London is full of life. There is so much to see and do in the city, that you''ll feel like you can never do it all.',
  '<p>London is full of life. There is so much to see and do in the city, that you''ll feel like you can never do it all. Like any big European city it has museums, cultural sites and arts, shopping, dining and local attractions that can keep you busy for weeks.</p>
<p>We stayed at the Rosewood London, and it was magnificent. The hotel occupies a grand Edwardian building in Holborn — just steps from Covent Garden and the West End. The rooms are spacious, beautifully appointed, and feel like a London townhouse brought to life.</p>
<p>The Scarfes Bar is a destination in itself — voted one of the world''s best bars, with its velvet armchairs, roaring fire, and impeccable cocktails. And the Mirror Room for afternoon tea? Pure elegance.</p>',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=85',
  '{hotels,destinations,europe}',
  '{london,rosewood,england}',
  'published'
)

on conflict (agent_id, slug) do update set
  title           = excluded.title,
  published_at    = excluded.published_at,
  excerpt         = excluded.excerpt,
  body_html       = excluded.body_html,
  cover_image_url = excluded.cover_image_url,
  categories      = excluded.categories,
  tags            = excluded.tags,
  status          = excluded.status,
  updated_at      = now();
