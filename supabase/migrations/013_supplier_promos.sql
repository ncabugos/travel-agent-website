-- Migration 013: supplier_promos
-- Allows hotel programs and cruise lines to have an active promotional banner
-- managed via the supplier admin panel (future feature).

CREATE TABLE IF NOT EXISTS supplier_promos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_type   text NOT NULL CHECK (supplier_type IN ('hotel_program', 'cruise_line')),
  supplier_slug   text NOT NULL,
  headline        text NOT NULL,
  subheading      text,
  cta_label       text DEFAULT 'Enquire Now',
  cta_url         text,
  image_url       text,
  is_active       boolean NOT NULL DEFAULT true,
  starts_at       timestamptz,
  ends_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Index for fast slug look-ups in the front-end
CREATE INDEX IF NOT EXISTS supplier_promos_slug_idx
  ON supplier_promos (supplier_type, supplier_slug, is_active);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_supplier_promos_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS supplier_promos_updated_at ON supplier_promos;
CREATE TRIGGER supplier_promos_updated_at
  BEFORE UPDATE ON supplier_promos
  FOR EACH ROW EXECUTE FUNCTION update_supplier_promos_updated_at();

-- ── Placeholder seed data ─────────────────────────────────────────────────────
-- One promo per hotel program and cruise line (can be edited in admin later).

INSERT INTO supplier_promos (supplier_type, supplier_slug, headline, subheading, cta_label, image_url) VALUES

-- Hotel Programs
('hotel_program', 'belmond-bellini-club',
  'Experience Belmond Like Never Before',
  'Exclusively for guests of Eden for Your World — unlock complimentary upgrades, curated welcome amenities, and preferred status at 50+ legendary properties worldwide.',
  'Book Through Us',
  '/media/hotel-programs/belmond-bellini-club/belmond-slider-1-1500.jpg'),

('hotel_program', 'dorchester-diamond-club',
  'The Ultimate in London Luxury Awaits',
  'Diamond Club privileges at The Dorchester, 45 Park Lane, Coworth Park, and the full Dorchester Collection. Breakfast, room upgrades, and property credits — exclusively through Eden.',
  'Reserve Your Stay',
  '/media/hotel-programs/dorchester/dorchester-slider-1-1500.jpg'),

('hotel_program', 'four-seasons-preferred-partner',
  'Four Seasons, Elevated',
  'Partner in the world''s most celebrated hotel brand. Daily breakfast, complimentary upgrades, and a generous amenity await every guest who books through Eden for Your World.',
  'Plan Your Stay',
  '/media/hotel-programs/four-seasons/fs-hawaii-1500.jpg'),

('hotel_program', 'aman',
  'An Aman Awaits',
  'Aman resorts are among the most sought-after sanctuaries on earth. Booked through Eden, you receive preferred status and exclusive access to amenities beyond the standard experience.',
  'Enquire Now',
  '/media/hotel-programs/aman/aman-hero-2000.jpg'),

('hotel_program', 'rosewood-elite',
  'Rosewood Elite — Curated Luxury',
  'Stay at Rosewood''s treasured collection with complimentary daily breakfast, signature welcome amenity, and $100 hotel credit — exclusively when booked through Eden.',
  'Book Today',
  '/media/hotel-programs/rosewood-elite/rosewood-slider-1-1500.jpg'),

('hotel_program', 'mandarin-oriental',
  'Fans of MO — Insider Access',
  'Partnered access to the Fans of MO programme — complimentary upgrades, favourite room recognition, and VIP attention at 35 legendary addresses worldwide.',
  'Reserve Now',
  '/media/hotel-programs/mandarin-oriental/mandarin-hero-2000.jpg'),

('hotel_program', 'peninsula-penclub',
  'The Palestinian Lifestyle Awaits',
  'PenClub privileges at The Peninsula''s iconic city retreats — Hong Kong, Paris, New York, Tokyo, and beyond. Daily breakfast, upgrades, and property credit on every stay.',
  'Explore The Peninsula',
  '/media/hotel-programs/peninsula-penclub/peninsula-hero-2000.jpg'),

('hotel_program', 'kempinski-1897',
  'Kempinski — Europe''s Finest',
  'Exclusive Kempinski benefits reserved for Eden clients — room upgrades, daily breakfast, and VIP recognition at palatial addresses from the Swiss Alps to the Middle East.',
  'Plan Your Stay',
  '/media/hotel-programs/kempinski-1897/kempinski-hero-2000.jpg'),

-- Cruise Lines
('cruise_line', 'regent-seven-seas',
  'All-Inclusive Luxury at Sea — Elevated',
  'All-suite, all-inclusive cruising with Virtuoso benefits layered on top. Shipboard credits, pre-cruise nights, and private shore excursions — exclusively through Eden.',
  'Plan This Voyage',
  '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg'),

('cruise_line', 'silversea',
  'Silversea — Where the World is Your Destination',
  'Ultra-luxury expedition and ocean cruising. Through Eden, add Virtuoso onboard credits and exclusive cocktail receptions to an already unmatched luxury experience.',
  'Enquire Now',
  '/media/cruises/silversea/silversea-expedition-2021-world_cruise.jpg'),

('cruise_line', 'seabourn',
  'The Seabourn Way — Intimacy at Its Finest',
  'Small-ship luxury with impeccable service and Virtuoso privileges that take every voyage further. Book through Eden and enjoy exclusive onboard amenities from day one.',
  'Set Sail',
  '/media/cruises/seabourn/seabourn-hero-2000.jpg'),

('cruise_line', 'oceania',
  'The Finest Cuisine at Sea',
  'Oceania''s award-winning culinary experience is legendary. Virtuoso benefits through Eden add exclusive pre-cruise hotel nights, onboard credits, and shore excursions.',
  'Reserve Your Voyage',
  '/media/cruises/oceania/oceania-hero-2000.jpg'),

('cruise_line', 'viking',
  'Discover the World, Viking''s Way',
  'River, ocean, or expedition — Viking delivers culturally rich journeys in serene surroundings. Book through Eden for exclusive Virtuoso amenities and expert advice.',
  'Start Planning',
  '/media/cruises/viking/viking-hero-2000.jpg'),

('cruise_line', 'crystal',
  'Crystal — A New Chapter in Luxury',
  'Crystal Cruises has reimagined ultra-luxury at sea. Through Eden, experience Virtuoso privileges, shipboard credits, and preferred stateroom categories on every voyage.',
  'Enquire Now',
  '/media/cruises/crystal/crystal-hero-2000.jpg');
