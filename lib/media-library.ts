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
