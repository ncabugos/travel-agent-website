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

  // ── Black transparent logos (for light/cream backgrounds) ────────────────────
  belmondBelliniClubBlack:    m('/assets/supplier logos/black transparent/belmond_bellini-logo-black-600.png'),
  dorchesterDiamondClubBlack: m('/assets/supplier logos/black transparent/dorchester_diamond-logo-black-600.png'),
  fourSeasonsPreferredBlack:  m('/assets/supplier logos/black transparent/FS_preferred-600-black.png'),
  hyattPriveBlack:            m('/assets/supplier logos/black transparent/HyattPrive-black-600.png'),
  mandarinFanClubBlack:       m('/assets/supplier logos/black transparent/mandarin-oriental-fan-club-Mandarin-black-600.png'),
  peninsulaPenClubBlack:      m('/assets/supplier logos/black transparent/Peninsula_PenClub-black-600.png'),
  ritzCarltonStarsBlack:      m('/assets/supplier logos/black transparent/ritz-carlton-stars-black-600.png'),
  roccoForteBlack:            m('/assets/supplier logos/black transparent/Rocco_Forte-black-600.png'),
  rosewoodEliteBlack:         m('/assets/supplier logos/black transparent/rosewood_elite-black-600.png'),
  shangriLaLuxuryCircleBlack: m('/assets/supplier logos/black transparent/ShangriLa-black-600.png'),
  kempinskiClub1897Black:     m('/assets/supplier logos/black transparent/Kempinski-Club1897-black-600.png'),
  oetkerPearlBlack:           m('/assets/supplier logos/black transparent/oetker-pearl-black-600.png'),
  amanBlack:                  m('/assets/supplier logos/black transparent/Aman-black-600.png'),
  aubergeResortsBlack:        m('/assets/supplier logos/black transparent/auberge-logo-black-600.png'),
  comoHotelsBlack:            m('/assets/supplier logos/black transparent/como-hotels-black-600.png'),
  montageBlack:               m('/assets/supplier logos/black transparent/montage-black-600.png'),
  oneAndOnlyBlack:            m('/assets/supplier logos/black transparent/one%26only-black-600.png'),
  accorHeraBlack:             m('/assets/supplier logos/black transparent/accor-hera-black-600.png'),
  marriottLuminousBlack:      m('/assets/supplier logos/black transparent/Marriott_stars_luminous-black-600.png'),
  leadingHotelsBlack:         m('/assets/supplier logos/black transparent/LeadingHotels-black-600.png'),
} as const

export type HotelLogoKey = keyof typeof HOTEL_LOGOS

// ─── Cruise Line Logos (slug → variant URLs) ──────────────────────────────────
// Source assets:
//   public/assets/supplier logos/white transparent/cruise/   ← for dark heroes
//   public/assets/supplier logos/black transparent/cruise/   ← for light grids
// Filename quirks (kept as-is to match the actual files on disk):
//   silverSea-wnite-600.png  ← "wnite" misspelling
//   exploreJourneys-white-600.png  ← "explore" instead of "explora"
//   sceniceCruises-black-600.png   ← "scenice" instead of "scenic"

interface CruiseLogoVariants {
  white: string | null
  black: string | null
}

const cw = (file: string) => m(`/assets/supplier logos/white transparent/cruise/${file}`)
const cb = (file: string) => m(`/assets/supplier logos/black transparent/cruise/${file}`)

export const CRUISE_LOGOS: Record<string, CruiseLogoVariants> = {
  'regent-seven-seas':     { white: cw('regent-white-600.png'),           black: cb('regent-black-600.png') },
  'silversea':             { white: cw('silverSea-wnite-600.png'),        black: cb('silverSea-black-600.png') },
  'seabourn':              { white: null,                                  black: cb('seabourn-black-600.png') },
  'oceania':               { white: cw('oceaniaCruises-white-600.png'),   black: cb('oceaniaCruises-black-600.png') },
  'azamara':               { white: cw('azamara-white-600.png'),          black: cb('azamara-black-600.png') },
  'celebrity':             { white: cw('celebrityCruises-white-600.png'), black: cb('celebrityCruises-black-600.png') },
  'cunard':                { white: cw('cunard-white-600.png'),           black: cb('cunard-black-600.png') },
  'norwegian':             { white: cw('norwegian-white-600.png'),        black: cb('Norwegian-black-600.png') },
  'royal-caribbean':       { white: cw('royalCaribbean-white-600.png'),   black: cb('royalCaribbean-black-600.png') },
  'princess':              { white: cw('princessCruises-white-600.png'),  black: cb('princessCruises-black-600.png') },
  'ponant':                { white: cw('ponant-white-600.png'),           black: cb('Ponant-black-600.png') },
  'uncruise':              { white: cw('uncruise-white-600.png'),         black: cb('uncruise-black-600.png') },
  'paul-gauguin':          { white: cw('paulGauguin-white-600.png'),      black: cb('paulGauguin-black-600.png') },
  'star-clippers':         { white: cw('starClippers-white-600.png'),     black: cb('starClippers-black-600.png') },
  'scenic':                { white: cw('scenicCruises-white-600.png'),    black: cb('sceniceCruises-black-600.png') },
  'crystal-cruises':       { white: cw('crystalCruises-white-600.png'),   black: cb('crystalCruises-black-600.png') },
  'viking':                { white: cw('VikingCruises-white-600.png'),    black: cb('vikingCruises-black-600.png') },
  'ama-waterways':         { white: cw('amaWaterways-white-600.png'),     black: cb('amaWaterways-black-600.png') },
  'uniworld':              { white: null,                                  black: cb('uniworld-black-600.png') },
  'four_seasons_yacht':    { white: cw('FourSeasons_Yacht-white-600.png'), black: null },
  'four-seasons-yacht':    { white: cw('FourSeasons_Yacht-white-600.png'), black: null },
  'windstar':              { white: cw('windstarCruises-white-600.png'),  black: cb('windstarCruises-black-600.png') },
  'explora-journeys':      { white: cw('exploreJourneys-white-600.png'),  black: cb('exploraJourneys-black-600.png') },
  'ritz-carlton-yacht':    { white: cw('RitzCarlton_Yacht-white-600.png'), black: cb('ritzCarlton_yacht-black-600.png') },
  'aman-at-sea':           { white: cw('aman_at_sea-white-600.png'),       black: cb('aman_at_sea-black-600.png') },
  'orient-express-sailing-yachts': { white: cw('orient_express_sailing-white-600.png'), black: cb('orient_express_sailing-black-600.png') },
}

/** Look up a cruise-line logo URL by slug. Returns null if no asset exists. */
export function getCruiseLogo(slug: string, variant: 'white' | 'black'): string | null {
  return CRUISE_LOGOS[slug]?.[variant] ?? null
}

// ─── Cruise Galleries ─────────────────────────────────────────────────────────

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
