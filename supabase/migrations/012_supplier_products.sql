-- Migration 012: Supplier Products table for Experiences page
-- This table stores rich supplier product listings (cruises, hotel packages,
-- experiences, tours) that appear on the Experiences page across ALL agent websites.
-- Agents can optionally override visibility via the agent_product_toggles junction.

CREATE TABLE IF NOT EXISTS supplier_products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  supplier_name TEXT NOT NULL,                          -- e.g. "Regent Seven Seas"
  category      TEXT NOT NULL                           -- 'cruise' | 'hotel' | 'experience' | 'tour'
                  CHECK (category IN ('cruise', 'hotel', 'experience', 'tour')),
  subcategory   TEXT,                                   -- e.g. "River Cruise", "Wellness Retreat"
  location      TEXT,                                   -- e.g. "Mediterranean"
  description   TEXT,
  highlights    TEXT[],                                 -- bullet points / selling features
  image_url     TEXT,
  logo_url      TEXT,                                   -- supplier logo
  duration      TEXT,                                   -- e.g. "7 nights", "10 days"
  starting_from TEXT,                                   -- optional price anchor, e.g. "from $6,500 pp"
  booking_link  TEXT,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional agent-level toggle (agent can hide/override certain products)
CREATE TABLE IF NOT EXISTS agent_product_toggles (
  agent_id    TEXT NOT NULL,
  product_id  UUID NOT NULL REFERENCES supplier_products(id) ON DELETE CASCADE,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (agent_id, product_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_supplier_products_category    ON supplier_products(category);
CREATE INDEX IF NOT EXISTS idx_supplier_products_is_featured ON supplier_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_supplier_products_is_active   ON supplier_products(is_active);
CREATE INDEX IF NOT EXISTS idx_supplier_products_sort_order  ON supplier_products(sort_order);

-- RLS
ALTER TABLE supplier_products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_product_toggles  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "supplier_products_public_read"
  ON supplier_products FOR SELECT USING (is_active = TRUE);

CREATE POLICY "agent_product_toggles_public_read"
  ON agent_product_toggles FOR SELECT USING (TRUE);

-- ── Seed data (mock) ──────────────────────────────────────────────────────────

INSERT INTO supplier_products (title, supplier_name, category, subcategory, location, description, highlights, image_url, logo_url, duration, starting_from, is_featured, sort_order) VALUES

-- Cruises
('Grand Mediterranean Voyage',
 'Regent Seven Seas', 'cruise', 'Ocean Cruise', 'Mediterranean',
 'Sail the storied coasts of Italy, Greece, Croatia and Monaco aboard the all-inclusive Seven Seas Splendor.',
 ARRAY['All-inclusive fares — flights, excursions, gratuities', 'Michelin-calibre dining aboard', 'Exclusive Virtuoso amenities worth up to $1,500'],
 '/media/cruises/regent-seven-seas/regent-hero.jpg',
 '/media/cruises/regent-seven-seas/regent-black-500.png',
 '10 nights', 'from $8,200 pp', TRUE, 10),

('Alaska Expedition Voyage',
 'Silversea Cruises', 'cruise', 'Expedition Cruise', 'Alaska & Pacific Northwest',
 'Discover the raw grandeur of Alaska aboard Silver Endeavour — Silversea''s purpose-built polar expedition vessel.',
 ARRAY['Zodiac and kayak excursions included', 'Expert naturalist expedition team', 'Butler service in every suite'],
 '/media/cruises/silversea/silversea-southpacific-1500.jpg',
 '/media/cruises/silversea/featured-image-silversea.jpg',
 '12 nights', 'from $11,000 pp', TRUE, 20),

('Japan & Korea Passage',
 'Seabourn Cruises', 'cruise', 'Ocean Cruise', 'Asia Pacific',
 'An intimate exploration of Japan and South Korea on one of Seabourn''s sleek ultra-luxury ships.',
 ARRAY['Ultra-small ship, maximum 450 guests', 'Immersive Ventures™ excursion program', 'All spirits, wines & champagne included'],
 '/media/cruises/seabourn/seabourn-cruises-hero-2000.jpg',
 '/media/cruises/seabourn/seabourn-600.png',
 '14 nights', 'from $9,400 pp', FALSE, 30),

('South Pacific Islands Journey',
 'Oceania Cruises', 'cruise', 'Ocean Cruise', 'South Pacific',
 'Island-hop across French Polynesia, Fiji, and Tonga aboard the intimate Riviera.',
 ARRAY['The Finest Cuisine at Sea™ — six restaurants included', 'Free shore excursions in select ports', 'Virtuoso: shipboard credit + private shore event'],
 '/media/cruises/oceania/oceania-cruises-hero.jpg',
 '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg',
 '16 nights', 'from $6,800 pp', FALSE, 40),

-- Hotels
('Four Seasons Preferred Partner Stay',
 'Four Seasons', 'hotel', 'Resort', 'Global',
 'Book any Four Seasons property through Eden Travel and unlock exclusive Preferred Partner amenities unavailable online.',
 ARRAY['Daily breakfast for two', 'Room upgrade on arrival (subject to availability)', '$100 hotel credit per stay', 'Priority early check-in / late check-out'],
 '/media/hotel-programs/four-seasons/fs-taormina-pool-couple-1080x1350.jpg',
 '/media/hotel-programs/logos/four-seasons-preferred-partner.jpg',
 'Flexible', NULL, TRUE, 50),

('Aman Global Access',
 'Aman', 'hotel', 'Resort & Residences', 'Global',
 'Aman''s ultra-private resorts across Asia, Europe and the Americas — accessed through our preferred advisor relationship.',
 ARRAY['Exclusive rates not available directly', 'Personalized pre-arrival concierge', 'Complimentary room category upgrade'],
 '/media/hotel-programs/aman/aman-hero-2000.jpg',
 '/media/hotel-programs/logos/aman.jpg',
 'Flexible', NULL, TRUE, 60),

('Belmond Bellini Club Benefits',
 'Belmond', 'hotel', 'Hotels & Trains', 'Global',
 'From Venice''s Hotel Cipriani to the Orient-Express — Belmond Bellini Club perks on every booking.',
 ARRAY['Upgrade on arrival', 'Daily à la carte breakfast', 'Bellini cocktail welcome amenity', 'Flexible late check-out'],
 '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg',
 '/media/hotel-programs/logos/belmond-bellini-club.jpg',
 'Flexible', NULL, FALSE, 70),

('Rosewood Elite Privileges',
 'Rosewood Hotels & Resorts', 'hotel', 'Resort', 'Global',
 'Rosewood Elite status on every booking — from Miramar Beach to Las Ventanas al Paraíso.',
 ARRAY['$100 F&B credit per stay', 'One category room upgrade', 'Complimentary breakfast', 'Priority room assignment'],
 '/media/hotel-programs/rosewood/rosewood-hero.jpg',
 '/media/hotel-programs/logos/rosewood-elite.jpg',
 'Flexible', NULL, FALSE, 80),

-- Experiences
('Private Tuscany Harvest Journey',
 'Eden Travel', 'experience', 'Culinary & Culture', 'Tuscany, Italy',
 'Seven days of olive harvests, private vineyard dinners and truffle hunts across the Chianti countryside.',
 ARRAY['Private farmhouse accommodation', 'Daily guided food & wine experiences', 'Fully customizable itinerary'],
 '/media/hotel-programs/four-seasons/fs-paris-1500.jpg',
 NULL,
 '7 nights', 'from $7,200 pp', TRUE, 90),

('Maldives Seaplane & Dive Experience',
 'Eden Travel', 'experience', 'Adventure', 'Maldives',
 'A curated 10-night journey combining private overwater villa stays with expert-led dive expeditions.',
 ARRAY['Overwater bungalow at a Virtuoso property', 'PADI dive guide included daily', 'Submarine excursion & sunset dhoni cruise'],
 '/media/hotel-programs/aman/aman-hero-2000.jpg',
 NULL,
 '10 nights', 'from $9,800 pp', TRUE, 100),

('Patagonia & Antarctica Expedition',
 'Eden Travel', 'experience', 'Expedition', 'Patagonia & Antarctica',
 'An extraordinary 18-day land and sea expedition from Buenos Aires to the White Continent.',
 ARRAY['Private guiding through Torres del Paine', 'Expedition ship berth — 100-guest vessel', 'Zodiac landings on the Antarctic Peninsula'],
 '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg',
 NULL,
 '18 days', 'from $18,500 pp', FALSE, 110)

ON CONFLICT DO NOTHING;
