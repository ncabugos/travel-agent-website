-- =============================================================================
-- Migration: 050_hotel_programs_image_slider.sql
-- Purpose:   Complete the DB-source-of-truth migration for hotel_programs.
--            Migration 046 moved LOGOS + COPY into the DB but never added the
--            hero photo or gallery columns, so every live hotel detail page
--            (/t2|t3|t4/[agentId]/book-hotel/[slug]) rendered a logo-only hero
--            with no photography and no gallery — identical across all tenants.
--
--              1. Add image_url (hero) + slider_images (gallery) columns.
--              2. Populate them for all programmes that have imagery, copied
--                 byte-for-byte from MOCK_HOTEL_PROGRAMS (lib/hotel-programs.ts),
--                 the offline fallback we keep in sync.
--
--            Programmes without curated imagery yet (six-senses, jumeirah-
--            passport, preferred-hotels-resorts, couture) are left NULL and
--            keep their graceful logo-only hero. Safe to re-run.
-- =============================================================================

ALTER TABLE public.hotel_programs
  ADD COLUMN IF NOT EXISTS image_url      text,
  ADD COLUMN IF NOT EXISTS slider_images  jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.hotel_programs.image_url     IS 'Hero / CTA background photo (full-bleed). Path under /public or absolute storage URL.';
COMMENT ON COLUMN public.hotel_programs.slider_images IS 'JSONB array of gallery image URLs shown in the program detail T2HotelGallery.';

-- Belmond Bellini Club
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg',
  slider_images = '["/media/hotel-programs/belmond-bellini-club/belmond-slider-1-1500.jpg","/media/hotel-programs/belmond-bellini-club/belmond-slider-2-1500.jpg","/media/hotel-programs/belmond-bellini-club/belmond-slider-4-1500.jpg","/media/hotel-programs/belmond-bellini-club/home-slider-image-Belmond-Leapard.jpg","/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg","/media/hotel-programs/belmond-bellini-club/belmond-reids-1500.jpg","/media/hotel-programs/belmond-bellini-club/belmond-siem-1500.jpg"]'::jsonb
WHERE slug = 'belmond-bellini-club';

-- Diamond Club — Dorchester Collection
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/dorchester/dorchester-hero-2000.jpg',
  slider_images = '["https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-intro-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-pool-belair-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-front-BH-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-dining-belair-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-front-rome-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-drink-rome-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-lounge-belair-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-pool-milan-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-bath-milan-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-bed-belair-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-cafe-BH-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-dinner-belair-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-events-belair-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-food-rome-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-pool-BH-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-pres-milan-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-restaurant-belair-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-room-rome-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-service-1500.jpg","https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-sign-BH-1500.jpg"]'::jsonb
WHERE slug = 'dorchester-diamond-club';

-- Four Seasons Preferred Partner
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/four-seasons/fs-hero-2200.jpg',
  slider_images = '["/media/hotel-programs/four-seasons/fs-hero_v2-2200.jpg","/media/hotel-programs/four-seasons/fs-paris-1500.jpg","/media/hotel-programs/four-seasons/fs-hawaii-1500.jpg","/media/hotel-programs/four-seasons/fs-Golden_pool-1500.jpg","/media/hotel-programs/four-seasons/fs-sayan_bali-1200.jpg","/media/hotel-programs/four-seasons/fs-miami_surf-1500.jpg","/media/hotel-programs/four-seasons/fs-explore_lodge-1500.jpg","/media/hotel-programs/four-seasons/fs-lanai_wellness-1500.jpg","/media/hotel-programs/four-seasons/fs-hangzhou-1500.jpg","/media/hotel-programs/four-seasons/MAN_965_aspect16x9.jpg","/media/hotel-programs/four-seasons/FS-residences-1500-video-bg.jpg","/media/hotel-programs/four-seasons/fs-taormina-pool-couple-1080x1350.jpg"]'::jsonb
WHERE slug = 'four-seasons-preferred-partner';

-- STARS — The Ritz-Carlton
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/marriott-luminous/Ritz-SB-hero-scaled.jpg',
  slider_images = '["/media/hotel-programs/marriott-luminous/st-regis-maldives-1500.jpg","/media/hotel-programs/marriott-luminous/marriott-hero-2200.jpg","/media/hotel-programs/marriott-luminous/marriott-slider-1-1500.jpg","/media/hotel-programs/marriott-luminous/marriott-slider-2-1500.jpg","/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-1-1500.jpg","/media/hotel-programs/marriott-stars---luminous/ritz-yacht-santorini-1500.jpg","/media/hotel-programs/marriott-stars---luminous/ritz-yacht-rear-1500.jpg","/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-4-1500.jpg"]'::jsonb
WHERE slug = 'ritz-carlton-stars';

-- Rosewood Elite
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/rosewood-elite/rosewood-hero-sb.jpg',
  slider_images = '["/media/hotel-programs/rosewood-elite/rosewood-miramar-hero-scaled.jpg","/media/hotel-programs/rosewood-elite/rosewood-slider-1-1500.jpg","/media/hotel-programs/rosewood-elite/rosewood-slider-2-1500.jpg","/media/hotel-programs/rosewood-elite/rosewood-slider-3-1500.jpg","/media/hotel-programs/rosewood-elite/rosewood-slider-4-1500.jpg","/media/hotel-programs/rosewood-elite/rosewood-slider-5-1500.jpg","/media/hotel-programs/rosewood-elite/guanzhou-rosewood-1500.jpg","/media/hotel-programs/rosewood-elite/beijing-rosewood-1500.jpg"]'::jsonb
WHERE slug = 'rosewood-elite';

-- Accor Preferred by HERA
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/hera-accor/accor-hotels-1500-1.jpg',
  slider_images = '["/media/hotel-programs/hera-accor/accor-hotels-1500-2.jpg","/media/hotel-programs/hera-accor/accor-hotels-1500-3.jpg","/media/hotel-programs/hera-accor/Orient-express-1830x1200-1.jpg","/media/hotel-programs/hera-accor/accor-FAENA-pool-1920.jpg"]'::jsonb
WHERE slug = 'hera-accor-hotels';

-- Mandarin Oriental Fan Club
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/mandarin-oriental/mandarin-hero-2000.jpg',
  slider_images = '["/media/hotel-programs/mandarin-oriental/mandarin-slider-1-1500.jpg","/media/hotel-programs/mandarin-oriental/mandarin-slider-2-1500.jpg","/media/hotel-programs/mandarin-oriental/mandarin-slider-3-1500.jpg","/media/hotel-programs/mandarin-oriental/mandarin-slider-4-1500.jpg","/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Featured-Slider-5-1500.jpg","/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Featured Slider 6 1500.jpg"]'::jsonb
WHERE slug = 'mandarin-oriental-fan-club';

-- Shangri-La — The Luxury Circle
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/shangri-la/shangri-featured-1500.jpg',
  slider_images = '["/media/hotel-programs/shangri-la/shangri-slider-1-1500.jpg","/media/hotel-programs/shangri-la/shangri-slider-2-1500.jpg","/media/hotel-programs/shangri-la/shangri-slider-3-1500.jpg","/media/hotel-programs/shangri-la/shangri-slider-4-1500.jpg","/media/hotel-programs/shangri-la/ShangriLa-hotels-Hero-2000.jpg","/media/hotel-programs/shangri-la/ShangriLa-hotels-Featured Slider 5 1500.jpg","/media/hotel-programs/shangri-la/ShangriLa-hotels-Featured Slider 6 1500.jpg"]'::jsonb
WHERE slug = 'shangri-la-hotels-the-luxury-circle';

-- Sir Rocco's Knights — Rocco Forte Hotels
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/rocco-forte/roccoforte-hero-2000.jpg',
  slider_images = '["/media/hotel-programs/rocco-forte/roccoforte-featured-1500.jpg","/media/hotel-programs/rocco-forte/roccoforte-slider-1-1500.jpg","/media/hotel-programs/rocco-forte/roccoforte-slider-2-1500.jpg","/media/hotel-programs/rocco-forte/roccoforte-slider-3-1500.jpg"]'::jsonb
WHERE slug = 'rocco-forte-hotels';

-- One&Only
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/one-and-only/oneandonly-resorts-Hero-2000.jpg',
  slider_images = '["/media/hotel-programs/one-and-only/oneandonly-slider-1-1500.jpg","/media/hotel-programs/one-and-only/oneandonly-slider-2-1500.jpg","/media/hotel-programs/one-and-only/oneandonly-slider-3-1500.jpg","/media/hotel-programs/one-and-only/oneandonly-slider-4-1500.jpg","/media/hotel-programs/one-and-only/oneandonly-featured-1500.jpg"]'::jsonb
WHERE slug = 'one-and-only-hotels-and-resorts';

-- Auberge Resorts Collection
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/auberge-resorts/auberge-hero-2000.jpg',
  slider_images = '["/media/hotel-programs/auberge-resorts/auberge-slider-1-1500.jpg","/media/hotel-programs/auberge-resorts/auberge-slider-2-1500.jpg","/media/hotel-programs/auberge-resorts/auberge-slider-3-1500.jpg","/media/hotel-programs/auberge-resorts/auberge-resorts-Featured-Slider-4-1500.jpg","/media/hotel-programs/auberge-resorts/auberge-featured-1500.jpg"]'::jsonb
WHERE slug = 'auberge-resorts-collection';

-- World of Hyatt Privé
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/hyatt-prive/hyatt-hero-2000.jpg',
  slider_images = '["/media/hotel-programs/hyatt-prive/hyatt-slider-1-1500.jpg","/media/hotel-programs/hyatt-prive/hyatt-slider-2-1500.jpg","/media/hotel-programs/hyatt-prive/hyatt-slider-3-1500.jpg","/media/hotel-programs/hyatt-prive/hyatt-slider-4-1500.jpg","/media/hotel-programs/hyatt-prive/hyatt-slider-5-1500.jpg","/media/hotel-programs/hyatt-prive/hyatt-slider-6-1500.jpg"]'::jsonb
WHERE slug = 'hyatt-prive';

-- Club 1897 — Kempinski
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/kempinski-1897/kempinski-hero-scaled.jpg',
  slider_images = '["/media/hotel-programs/kempinski-1897/kempinski-slider-1-1500.jpg","/media/hotel-programs/kempinski-1897/kempinski-slider-2-1500.jpg","/media/hotel-programs/kempinski-1897/kempinski-slider-3-1500.jpg","/media/hotel-programs/kempinski-1897/kempinski-featured-1080.jpg"]'::jsonb
WHERE slug = 'kempinski-club-1897';

-- The Peninsula PenClub
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/peninsula/peninsula-hero.jpg',
  slider_images = '["/media/hotel-programs/peninsula/peninsula-brand-hero-2000.jpg","/media/hotel-programs/peninsula/peninsula-slider-1-1500.jpg","/media/hotel-programs/peninsula/peninsula-slider-2-1500.jpg","/media/hotel-programs/peninsula/peninsula-slider-3-1500.jpg","/media/hotel-programs/peninsula/peninsula-slider-4-1500.jpg","/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Featured Slider 5 1500.jpg","/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Featured Slider 6 1500.jpg"]'::jsonb
WHERE slug = 'peninsula-pen-club';

-- COMO Hotels and Resorts
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg',
  slider_images = '["/media/hotel-programs/como-hotels/COMO-hotels-1500-1.jpg","/media/hotel-programs/como-hotels/COMO-hotels-1500-2.jpg","/media/hotel-programs/como-hotels/COMO-hotels-1500-3.jpg"]'::jsonb
WHERE slug = 'como-hotels';

-- Pearl Partner — Oetker Collection
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/oetker-pearl/oetker-ducap-1500.jpg',
  slider_images = '["/media/hotel-programs/oetker-pearl/oetker-eden_rock_villa-1500.jpg","/media/hotel-programs/oetker-pearl/oetker-estate-1500.jpg","/media/hotel-programs/oetker-pearl/oetker-lifestyle-couple-1500.jpg","/media/hotel-programs/oetker-pearl/oetker-eden_villa-1500.jpg","/media/hotel-programs/oetker-pearl/oetker-featured.jpg"]'::jsonb
WHERE slug = 'oetker-hotel-collection-pearl-partner';

-- AMAN
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/aman/aman-hero-2000.jpg',
  slider_images = '["/media/hotel-programs/aman/aman-featured-1500.jpg","/media/hotel-programs/aman/aman-slider-1-1500.jpg","/media/hotel-programs/aman/aman-slider-2-1500.jpg","/media/hotel-programs/aman/aman-slider-3-1500.jpg","/media/hotel-programs/aman/home-slider-image-AmanPuri-Thailand.jpg"]'::jsonb
WHERE slug = 'aman-hotels-and-resorts';

-- Montage Hotels & Resorts
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/montage/montage-cabo-spa_pool-1500.jpg',
  slider_images = '["/media/hotel-programs/montage/montage-slider-1-1500.jpg","/media/hotel-programs/montage/montage-slider-2-1500.jpg","/media/hotel-programs/montage/montage-slider-3-1500.jpg","/media/hotel-programs/montage/montage-slider-4-1500.jpg"]'::jsonb
WHERE slug = 'montage-hotels';

-- Marriott International — Stars & Luminous
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/marriott-luminous/marriott-hero-2200.jpg',
  slider_images = '["/media/hotel-programs/marriott-luminous/marriott-slider-1-1500.jpg","/media/hotel-programs/marriott-luminous/marriott-slider-2-1500.jpg","/media/hotel-programs/marriott-luminous/marriott-slider-3-1500.jpg","/media/hotel-programs/marriott-luminous/marriott-slider-4-1500.jpg","/media/hotel-programs/marriott-luminous/marriott-hotels-1500-1.jpg","/media/hotel-programs/marriott-luminous/marriott-hotels-1500-2.jpg","/media/hotel-programs/marriott-luminous/marriott-hotels-1500-3.jpg","/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-1-1500.jpg","/media/hotel-programs/marriott-stars---luminous/edition-weho-1500.jpg","/media/hotel-programs/marriott-stars---luminous/st-regis-maldives-1500.jpg","/media/hotel-programs/marriott-stars---luminous/marriott-rome-1500.jpg","/media/hotel-programs/marriott-stars---luminous/st-regis-glasshouse-china-1500.jpg","/media/hotel-programs/marriott-stars---luminous/marriott-vancouver-1500.jpg","/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-6-1500.jpg","/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-7-1500.jpg","/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-8-1500.jpg"]'::jsonb
WHERE slug = 'marriott-international-luminous';

-- The Leading Hotels of the World
UPDATE public.hotel_programs SET
  image_url     = '/media/hotel-programs/leading-hotels/leading-hotels-hero-2000.jpg',
  slider_images = '["/media/hotel-programs/leading-hotels/le-sirenuse.webp","/media/hotel-programs/leading-hotels/hotel-hassler.webp","/media/hotel-programs/leading-hotels/la-mamounia.webp","/media/hotel-programs/leading-hotels/dangleterre.webp","/media/hotel-programs/leading-hotels/thelowell.webp","/media/hotel-programs/leading-hotels/sukhothai-suite-01.webp","/media/hotel-programs/leading-hotels/leading-hotels-slider-1-1500.jpg","/media/hotel-programs/leading-hotels/leading-hotels-slider-2-1500.jpg","/media/hotel-programs/leading-hotels/leading-hotels-slider-3-1500.jpg","/media/hotel-programs/leading-hotels/leading-hotels-featured-1500.jpg"]'::jsonb
WHERE slug = 'leading-hotels-of-the-world';

-- Programmes populated: 20 / 24
