/**
 * ============================================================================
 * Master Media Library
 * ============================================================================
 * Single source of truth for ALL image assets across every agent website.
 *
 * HOW IT WORKS
 * - All assets live in `public/media/` (local dev) or a CDN (production).
 * - Set NEXT_PUBLIC_MEDIA_BASE_URL in your .env.local for a CDN base URL.
 *   Leave it empty (or unset) and images resolve to /media/... locally.
 *
 * HOW TO ADD A NEW IMAGE
 * 1. Drop the file into the appropriate `public/media/<category>/<slug>/` folder.
 * 2. Add the path constant here using the `m()` helper.
 * 3. Import and use the constant in your component — never hardcode strings.
 *
 * MIGRATION TO CDN (Supabase Storage / Cloudflare R2)
 * - Upload `public/media/` to your bucket.
 * - Set NEXT_PUBLIC_MEDIA_BASE_URL=https://your-cdn.example.com
 * - Zero code changes required.
 * ============================================================================
 */

const BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '').replace(/\/$/, '')

/** Resolve a media path against the base URL. */
const m = (path: string) => `${BASE}${path}`

// ─── Hotel Program Logos ──────────────────────────────────────────────────────

export const HOTEL_LOGOS = {
  // Invitation-only programmes (colour logos)
  belmondBelliniClub:         m('/media/hotel-programs/logos/belmond-bellini-club.jpg'),
  dorchesterDiamondClub:      m('/media/hotel-programs/logos/dorchester-diamond-club.jpg'),
  fourSeasonsPreferred:       m('/media/hotel-programs/logos/four-seasons-preferred-partner.jpg'),
  hyattPrive:                 m('/media/hotel-programs/logos/hyatt-prive.jpg'),
  hyattPriveWhite:            m('/media/hotel-programs/logos/hyatt-prive-white.png'),
  mandarinFanClub:            m('/media/hotel-programs/logos/mandarin-oriental-fan-club.jpg'),
  peninsulaPenClub:           m('/media/hotel-programs/logos/peninsula-pen-club.jpg'),
  ritzCarltonStars:           m('/media/hotel-programs/logos/ritz-carlton-stars.jpg'),
  roccoForte:                 m('/media/hotel-programs/logos/rocco-forte-hotels.jpg'),
  rosewoodElite:              m('/media/hotel-programs/logos/rosewood-elite.jpg'),
  shangriLaLuxuryCircle:      m('/media/hotel-programs/logos/shangri-la-luxury-circle.jpg'),
  kempinskiClub1897:          m('/media/hotel-programs/logos/kempinski-club1897.jpg'),
  oetkerPearl:                m('/media/hotel-programs/logos/oetker-pearl.jpg'),

  // Brand programmes (colour logos)
  aman:                       m('/media/hotel-programs/logos/aman.jpg'),
  aubergeResorts:             m('/media/hotel-programs/logos/auberge-resorts.jpg'),
  comoHotels:                 m('/media/hotel-programs/logos/como-hotels.jpg'),
  montage:                    m('/media/hotel-programs/logos/montage-hotels.jpg'),
  oneAndOnly:                 m('/media/hotel-programs/logos/one-and-only.jpg'),

  // Global networks (colour logos)
  accorHera:                  m('/media/hotel-programs/logos/accor-hera.jpg'),
  marriottLuminous:           m('/media/hotel-programs/logos/marriott-luminous.jpg'),
  leadingHotels:              m('/media/suppliers/logos/leading-hotels-black-600.jpg'),

  // ── White transparent logos (for dark hero backgrounds) ──────────────────────
  belmondBelliniClubWhite:    m('/assets/supplier logos/white transparent/belmond-bellini_club.webp'),
  dorchesterDiamondClubWhite: m('/assets/supplier logos/white transparent/dorchester-logo-white.webp'),
  fourSeasonsPreferredWhite:  m('/assets/supplier logos/white transparent/FS_preferred-600.webp'),
  hyattPriveTransparent:      m('/assets/supplier logos/white transparent/HyattPrive_white-transparent.webp'),
  mandarinFanClubWhite:       m('/assets/supplier logos/white transparent/mandarin-oriental-fan-club-Mandarin-white-600.webp'),
  peninsulaPenClubWhite:      m('/assets/supplier logos/white transparent/Peninsula_PenClub-white-600.webp'),
  ritzCarltonStarsWhite:      m('/assets/supplier logos/white transparent/ritz-carlton-stars-white.png'),
  roccoForteWhite:            m('/assets/supplier logos/white transparent/Rocco_Forte-White-600.webp'),
  rosewoodEliteWhite:         m('/assets/supplier logos/white transparent/rosewood-elite-white.webp'),
  shangriLaLuxuryCircleWhite: m('/assets/supplier logos/white transparent/ShangriLa-white-600.webp'),
  kempinskiClub1897White:     m('/assets/supplier logos/white transparent/Kempinski-Club1897-white-600.webp'),
  oetkerPearlWhite:           m('/assets/supplier logos/white transparent/oetker-pearl-white-600.webp'),
  amanWhite:                  m('/assets/supplier logos/white transparent/Aman-white-600.png'),
  aubergeResortsWhite:        m('/assets/supplier logos/white transparent/auberge-logo-white-600.webp'),
  comoHotelsWhite:            m('/assets/supplier logos/white transparent/como-hotels-white.png'),
  oneAndOnlyWhite:            m('/assets/supplier logos/white transparent/one&only-white-600.webp'),
  accorHeraWhite:             m('/assets/supplier logos/white transparent/accor-hera-white.png'),
  marriottLuminousWhite:      m('/assets/supplier logos/white transparent/marriott-stars_luminous.webp'),
  leadingHotelsWhite:         m('/assets/supplier logos/white transparent/leading_hotels-white-600.png'),
  jumeirahWhite:              m('/assets/supplier logos/white transparent/jumeirah-passport-logo-white-600.webp'),
  sixSensesWhite:             m('/assets/supplier logos/white transparent/SixSenses-logo-white-600.webp'),
  montageWhite:               m('/assets/supplier logos/white transparent/montage-white-600.webp'),
  coutureWhite:               m('/assets/supplier logos/white transparent/couture-logo-white-600.webp'),
} as const

export type HotelLogoKey = keyof typeof HOTEL_LOGOS

// ─── Hotel Program Gallery Images ────────────────────────────────────────────

/**
 * Gallery images keyed by hotel-program slug.
 * Each array is ordered: first image is used as the hero/cover.
 */
export const HOTEL_GALLERY: Record<string, string[]> = {
  'four-seasons-preferred-partner': [
    m('/media/hotel-programs/four-seasons/fs-hero-2200.jpg'),
    m('/media/hotel-programs/four-seasons/fs-hero_v2-2200.jpg'),
    m('/media/hotel-programs/four-seasons/fs-paris-1500.jpg'),
    m('/media/hotel-programs/four-seasons/fs-hawaii-1500.jpg'),
    m('/media/hotel-programs/four-seasons/fs-Golden_pool-1500.jpg'),
    m('/media/hotel-programs/four-seasons/fs-sayan_bali-1200.jpg'),
    m('/media/hotel-programs/four-seasons/fs-miami_surf-1500.jpg'),
    m('/media/hotel-programs/four-seasons/fs-explore_lodge-1500.jpg'),
    m('/media/hotel-programs/four-seasons/fs-lanai_wellness-1500.jpg'),
    m('/media/hotel-programs/four-seasons/fs-hangzhou-1500.jpg'),
    m('/media/hotel-programs/four-seasons/MAN_965_aspect16x9.jpg'),
    m('/media/hotel-programs/four-seasons/FS-residences-1500-video-bg.jpg'),
    m('/media/hotel-programs/four-seasons/fs-slider-1-1500.jpg'),
    m('/media/hotel-programs/four-seasons/fs-slider-2-1500.jpg'),
    m('/media/hotel-programs/four-seasons/fs-slider-3-1500.jpg'),
    m('/media/hotel-programs/four-seasons/fs-slider-4-1500.jpg'),
    m('/media/hotel-programs/four-seasons/fs-slider-5-1500.jpg'),
  ],
  'aman-hotels-and-resorts': [
    m('/media/hotel-programs/aman/aman-hero-2000.jpg'),
    m('/media/hotel-programs/aman/aman-featured-1500.jpg'),
    m('/media/hotel-programs/aman/aman-slider-1-1500.jpg'),
    m('/media/hotel-programs/aman/aman-slider-2-1500.jpg'),
    m('/media/hotel-programs/aman/aman-slider-3-1500.jpg'),
    m('/media/hotel-programs/aman/home-slider-image-AmanPuri-Thailand.jpg'),
    m('/media/hotel-programs/aman/overwater_c42d1ec6ef-scaled.jpg'),
  ],
  'belmond-bellini-club': [
    m('/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg'),
    m('/media/hotel-programs/belmond-bellini-club/belmond-slider-1-1500.jpg'),
    m('/media/hotel-programs/belmond-bellini-club/belmond-slider-2-1500.jpg'),
    m('/media/hotel-programs/belmond-bellini-club/belmond-slider-3-1500.jpg'),
    m('/media/hotel-programs/belmond-bellini-club/belmond-slider-4-1500.jpg'),
    m('/media/hotel-programs/belmond-bellini-club/home-slider-image-Belmond-Leapard.jpg'),
  ],
  'dorchester-diamond-club': [
    m('/media/hotel-programs/dorchester/dorchester-hero-2000.jpg'),
    m('/media/hotel-programs/dorchester/dorchester-slider-1-1500.jpg'),
    m('/media/hotel-programs/dorchester/dorchester-slider-2-1500.jpg'),
    m('/media/hotel-programs/dorchester/dorchester-slider-3-1500.jpg'),
    m('/media/hotel-programs/dorchester/dorchester-slider-4-1500.jpg'),
  ],
  'ritz-carlton-stars': [
    m('/media/hotel-programs/marriott-luminous/Ritz-SB-hero-scaled.jpg'),
    m('/media/hotel-programs/marriott-luminous/st-regis-maldives-1500.jpg'),
    m('/media/hotel-programs/marriott-luminous/marriott-hero-2200.jpg'),
    m('/media/hotel-programs/marriott-luminous/marriott-slider-1-1500.jpg'),
    m('/media/hotel-programs/marriott-luminous/marriott-slider-2-1500.jpg'),
  ],
  'rosewood-elite': [
    m('/media/hotel-programs/rosewood-elite/rosewood-hero-sb.jpg'),
    m('/media/hotel-programs/rosewood-elite/rosewood-miramar-hero-scaled.jpg'),
    m('/media/hotel-programs/rosewood-elite/rosewood-slider-1-1500.jpg'),
    m('/media/hotel-programs/rosewood-elite/rosewood-slider-2-1500.jpg'),
    m('/media/hotel-programs/rosewood-elite/rosewood-slider-3-1500.jpg'),
    m('/media/hotel-programs/rosewood-elite/rosewood-slider-4-1500.jpg'),
    m('/media/hotel-programs/rosewood-elite/rosewood-slider-5-1500.jpg'),
  ],
  'mandarin-oriental-fan-club': [
    m('/media/hotel-programs/mandarin-oriental/mandarin-hero-2000.jpg'),
    m('/media/hotel-programs/mandarin-oriental/mandarin-slider-1-1500.jpg'),
    m('/media/hotel-programs/mandarin-oriental/mandarin-slider-2-1500.jpg'),
    m('/media/hotel-programs/mandarin-oriental/mandarin-slider-3-1500.jpg'),
    m('/media/hotel-programs/mandarin-oriental/mandarin-slider-4-1500.jpg'),
  ],
  'shangri-la-hotels-the-luxury-circle': [
    m('/media/hotel-programs/shangri-la/shangri-featured-1500.jpg'),
    m('/media/hotel-programs/shangri-la/shangri-slider-1-1500.jpg'),
    m('/media/hotel-programs/shangri-la/shangri-slider-2-1500.jpg'),
    m('/media/hotel-programs/shangri-la/shangri-slider-3-1500.jpg'),
    m('/media/hotel-programs/shangri-la/shangri-slider-4-1500.jpg'),
  ],
  'rocco-forte-hotels': [
    m('/media/hotel-programs/rocco-forte/roccoforte-hero-2000.jpg'),
    m('/media/hotel-programs/rocco-forte/roccoforte-featured-1500.jpg'),
    m('/media/hotel-programs/rocco-forte/roccoforte-slider-1-1500.jpg'),
    m('/media/hotel-programs/rocco-forte/roccoforte-slider-2-1500.jpg'),
    m('/media/hotel-programs/rocco-forte/roccoforte-slider-3-1500.jpg'),
  ],
  'peninsula-pen-club': [
    m('/media/hotel-programs/peninsula/peninsula-hero.jpg'),
    m('/media/hotel-programs/peninsula/peninsula-brand-hero-2000.jpg'),
    m('/media/hotel-programs/peninsula/peninsula-slider-1-1500.jpg'),
    m('/media/hotel-programs/peninsula/peninsula-slider-2-1500.jpg'),
    m('/media/hotel-programs/peninsula/peninsula-slider-3-1500.jpg'),
    m('/media/hotel-programs/peninsula/peninsula-slider-4-1500.jpg'),
  ],
  'hyatt-prive': [
    m('/media/hotel-programs/hyatt-prive/hyatt-hero-2000.jpg'),
    m('/media/hotel-programs/hyatt-prive/hyatt-slider-1-1500.jpg'),
    m('/media/hotel-programs/hyatt-prive/hyatt-slider-2-1500.jpg'),
    m('/media/hotel-programs/hyatt-prive/hyatt-slider-3-1500.jpg'),
    m('/media/hotel-programs/hyatt-prive/hyatt-slider-4-1500.jpg'),
  ],
  'kempinski-club-1897': [
    m('/media/hotel-programs/kempinski/kempinski-hero-scaled.jpg'),
    m('/media/hotel-programs/kempinski/kempinski-slider-1-1500.jpg'),
    m('/media/hotel-programs/kempinski/kempinski-slider-2-1500.jpg'),
    m('/media/hotel-programs/kempinski/kempinski-slider-3-1500.jpg'),
    m('/media/hotel-programs/kempinski/kempinski-featured-1080.jpg'),
  ],
  'one-and-only-hotels-and-resorts': [
    m('/media/hotel-programs/one-and-only/oneandonly-resorts-Hero-2000.jpg'),
    m('/media/hotel-programs/one-and-only/oneandonly-slider-1-1500.jpg'),
    m('/media/hotel-programs/one-and-only/oneandonly-slider-2-1500.jpg'),
    m('/media/hotel-programs/one-and-only/oneandonly-slider-3-1500.jpg'),
    m('/media/hotel-programs/one-and-only/oneandonly-slider-4-1500.jpg'),
    m('/media/hotel-programs/one-and-only/oneandonly-featured-1500.jpg'),
  ],
  'auberge-resorts-collection': [
    m('/media/hotel-programs/auberge-resorts/auberge-hero-2000.jpg'),
    m('/media/hotel-programs/auberge-resorts/auberge-slider-1-1500.jpg'),
    m('/media/hotel-programs/auberge-resorts/auberge-slider-2-1500.jpg'),
    m('/media/hotel-programs/auberge-resorts/auberge-slider-3-1500.jpg'),
    m('/media/hotel-programs/auberge-resorts/auberge-resorts-Featured-Slider-4-1500.jpg'),
    m('/media/hotel-programs/auberge-resorts/auberge-featured-1500.jpg'),
  ],
  'montage-hotels': [
    m('/media/hotel-programs/montage/montage-cabo-spa_pool-1500.jpg'),
    m('/media/hotel-programs/montage/montage-slider-1-1500.jpg'),
    m('/media/hotel-programs/montage/montage-slider-2-1500.jpg'),
    m('/media/hotel-programs/montage/montage-slider-3-1500.jpg'),
    m('/media/hotel-programs/montage/montage-slider-4-1500.jpg'),
  ],
  'oetker-hotel-collection-pearl-partner': [
    m('/media/hotel-programs/oetker-pearl/oetker-ducap-1500.jpg'),
    m('/media/hotel-programs/oetker-pearl/oetker-eden_rock_villa-1500.jpg'),
    m('/media/hotel-programs/oetker-pearl/oetker-estate-1500.jpg'),
    m('/media/hotel-programs/oetker-pearl/oetker-lifestyle-couple-1500.jpg'),
    m('/media/hotel-programs/oetker-pearl/oetker-eden_villa-1500.jpg'),
    m('/media/hotel-programs/oetker-pearl/oetker-featured.jpg'),
  ],
  'hera-accor-hotels': [
    m('/media/hotel-programs/hera-accor/accor-hotels-1500-1.jpg'),
    m('/media/hotel-programs/hera-accor/accor-hotels-1500-2.jpg'),
    m('/media/hotel-programs/hera-accor/accor-hotels-1500-3.jpg'),
    m('/media/hotel-programs/hera-accor/Orient-express-1830x1200-1.jpg'),
  ],
  'marriott-international-luminous': [
    m('/media/hotel-programs/marriott-luminous/marriott-hero-2200.jpg'),
    m('/media/hotel-programs/marriott-luminous/marriott-slider-1-1500.jpg'),
    m('/media/hotel-programs/marriott-luminous/marriott-slider-2-1500.jpg'),
    m('/media/hotel-programs/marriott-luminous/marriott-slider-3-1500.jpg'),
    m('/media/hotel-programs/marriott-luminous/marriott-slider-4-1500.jpg'),
    m('/media/hotel-programs/marriott-luminous/marriott-hotels-1500-1.jpg'),
    m('/media/hotel-programs/marriott-luminous/marriott-hotels-1500-2.jpg'),
    m('/media/hotel-programs/marriott-luminous/marriott-hotels-1500-3.jpg'),
  ],
  'leading-hotels-of-the-world': [
    m('/media/hotel-programs/leading-hotels/leading-hotels-hero-2000.jpg'),
    m('/media/hotel-programs/leading-hotels/leading-hotels-slider-1-1500.jpg'),
    m('/media/hotel-programs/leading-hotels/leading-hotels-slider-2-1500.jpg'),
    m('/media/hotel-programs/leading-hotels/leading-hotels-slider-3-1500.jpg'),
    m('/media/hotel-programs/leading-hotels/leading-hotels-featured-1500.jpg'),
  ],
  'como-hotels': [
    m('/media/hotel-programs/dorchester/Como-hero-tuscany-2200.jpg'),
    m('/media/hotel-programs/dorchester/COMO-hotels-1500-1.jpg'),
    m('/media/hotel-programs/dorchester/COMO-hotels-1500-2.jpg'),
    m('/media/hotel-programs/dorchester/COMO-hotels-1500-3.jpg'),
  ],
}

/**
 * Get the gallery for a hotel program slug.
 * Falls back to an empty array if no images are mapped yet.
 */
export function getHotelGallery(slug: string): string[] {
  return HOTEL_GALLERY[slug] ?? []
}

/**
 * Get the hero/cover image for a hotel program (first gallery image).
 */
export function getHotelHero(slug: string): string | null {
  return HOTEL_GALLERY[slug]?.[0] ?? null
}

// ─── Cruise Logos & Galleries ─────────────────────────────────────────────────

export const CRUISE_LOGOS: Record<string, string> = {
  'ama-waterways':      m('/media/cruises/logos/ama-waterways.jpg'),
  'azamara':            m('/media/cruises/logos/azamara.jpg'),
  'celebrity':          m('/media/cruises/logos/celebrity-cruises.jpg'),
  'crystal':            m('/media/cruises/logos/crystal-cruises.jpg'),
  'cunard':             m('/media/cruises/logos/cunard.jpg'),
  'holland-america':    m('/media/cruises/logos/holland-america.jpg'),
  'lindblad':           m('/media/cruises/logos/lindblad.jpg'),
  'norwegian':          m('/media/cruises/logos/norwegian.jpg'),
  'oceania':            m('/media/cruises/logos/oceania.jpg'),
  'ponant':             m('/media/cruises/logos/ponant.jpg'),
  'princess':           m('/media/cruises/logos/princess.jpg'),
  'regent-seven-seas':  m('/media/cruises/logos/regent-seven-seas.jpg'),
  'royal-caribbean':    m('/media/cruises/logos/royal-caribbean.jpg'),
  'seabourn':           m('/media/cruises/logos/seabourn.jpg'),
  'silversea':          m('/media/cruises/logos/silversea.jpg'),
  'uniworld':           m('/media/cruises/logos/uniworld.jpg'),
  'viking':             m('/media/cruises/logos/viking.jpg'),
  'virgin-voyages':     m('/media/cruises/logos/virgin-voyages.jpg'),
  'windstar':           m('/media/cruises/logos/windstar.jpg'),
}

export const CRUISE_GALLERY: Record<string, string[]> = {
  // Will be populated as cruise assets are imported
}

export function getCruiseGallery(slug: string): string[] {
  return CRUISE_GALLERY[slug] ?? []
}

// ─── Tour Logos & Galleries ───────────────────────────────────────────────────

export const TOUR_LOGOS: Record<string, string> = {
  'ak':                 m('/media/tours/logos/ak.jpg'),
  'globus':             m('/media/tours/logos/globus.jpg'),
  'tauck':              m('/media/tours/logos/tauck.jpg'),
  'insight-vacations':  m('/media/tours/logos/insight-vacations-white.png'),
}

export const TOUR_GALLERY: Record<string, string[]> = {
  'insight-vacations': [
    m('/media/tours/insight-vacations/insight-UK-hero-2000.jpg'),
    m('/media/tours/insight-vacations/insight-barcelona-hero-2000.jpg'),
    m('/media/tours/insight-vacations/insight-video-banner.jpg'),
  ],
}

export function getTourGallery(slug: string): string[] {
  return TOUR_GALLERY[slug] ?? []
}

// ─── Supplier Logos ───────────────────────────────────────────────────────────

export const SUPPLIER_LOGOS = {
  leadingHotelsBlack:   m('/media/suppliers/logos/leading-hotels-black-600.jpg'),
  leadingHotelsWhite:   m('/media/suppliers/logos/leading_hotels-Logo.png'),
  colletteBlack:        m('/media/suppliers/logos/collette-black.jpg'),
  colletteWhite:        m('/media/suppliers/logos/collette-white.png'),
  exploraBlack:         m('/media/suppliers/logos/explora-black.jpg'),
  pureGermanyBlack:     m('/media/suppliers/logos/pure-germany-black.jpg'),
  pureGermanyWhite:     m('/media/suppliers/logos/pure-germany-white.png'),
} as const

// ─── Eden Brand Assets ────────────────────────────────────────────────────────

export const EDEN = {
  // Logos
  logoGold:         m('/media/eden/logos/eden-gold-header.png'),
  logoWing:         m('/media/eden/logos/eden-wing-gold.png'),
  condeNast2026:    m('/media/eden/logos/conde-nast-2026.png'),
  virtuoso:         m('/media/eden/logos/virtuoso-new.png'),

  // Home page category cards
  cruisesCard:      m('/media/eden/cruises-card.jpg'),
  destinationsCard: m('/media/eden/destinations-card.jpg'),
  hotelsCard:       m('/media/eden/hotels-card.jpg'),
  youtubeBg:        m('/media/eden/youtube-bg.jpg'),
  collageFooter:    m('/media/eden/collage-footer.jpg'),

  // Team
  teamCircle:       m('/media/eden/team/team-eden-circle.png'),

  // Instagram placeholders (used until real IG API data loads)
  instagram: [
    m('/media/eden/instagram/eden-instagram-1.jpeg'),
    m('/media/eden/instagram/eden-instagram-2.jpeg'),
    m('/media/eden/instagram/eden-instagram-3.jpeg'),
    m('/media/eden/instagram/eden-instagram-4.jpeg'),
    m('/media/eden/instagram/eden-instagram-5.jpeg'),
    m('/media/eden/instagram/eden-instagram-6.jpeg'),
  ],
} as const

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Build a full media URL from a partial path.
 * Use when you need dynamic path construction (e.g., loop-generated paths).
 */
export function mediaUrl(path: string): string {
  return m(path)
}
