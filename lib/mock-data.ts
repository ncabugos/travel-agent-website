/**
 * mock-data.ts
 * Seed data for the demo agent page (/frontend/demo-agent).
 * Used as a fallback when no Supabase credentials are configured.
 */

import type { VirtuosoPerks } from '@/types/database'

// ─── Agent ────────────────────────────────────────────────────────────────────

export interface MockAgent {
  id: string
  full_name: string
  /** Used by the {{advisor_first_name}} blog token. Empty/missing → falls back to "your advisor". */
  first_name?: string
  agency_name: string
  tagline: string
  email: string
  phone?: string
  address?: string
  cst_number?: string
  instagram_url?: string
  facebook_url?: string
  youtube_url?: string
  tiktok_url?: string
  website_url?: string
  custom_domain: string | null
  avatar_url: string | null
  logo_url?: string | null          // white/light version (nav on hero, overlay)
  logo_url_dark?: string | null     // dark version (footer on light bg)
  nav_links?: { label: string; href: string }[]

  // Subscription tier — drives tier-aware feature gating on public sites
  // (e.g. Starter → curated grids, Growth+ → searchable directories).
  // Optional so existing demos that don't set it default to Growth behaviour.
  tier?: 'starter' | 'growth' | 'custom' | 'agency' | null

  // ── Onboarding-collected profile fields ────────────────────────────────
  // All optional so existing demos that don't set them still type-check.
  bio?: string
  travel_specialties?: string[]
  destination_specialties?: string[]
  preferred_suppliers?: string[]
  travel_types?: string[]
}

export const MOCK_AGENT: MockAgent = {
  id: 'demo-agent',
  full_name: 'John Oberacker',
  first_name: 'John',
  agency_name: 'Eden For Your World',
  tagline: 'Curating the world\'s most extraordinary journeys — with precision, passion, and white-glove care.',
  email: 'info@edenforyourworld.com',
  phone: '+1 (562) 856-8603',
  address: '5318 E. 2nd St. #520, Long Beach, CA 90803',
  cst_number: '2097184-40',
  instagram_url: 'https://www.instagram.com/edenforyourworld',
  facebook_url: 'https://www.facebook.com/edenforyourworld',
  youtube_url: undefined,
  tiktok_url: undefined,
  website_url: 'https://www.edenforyourworld.com',
  custom_domain: null,
  avatar_url: null,
  bio: 'After two decades curating bespoke itineraries for executives, families, and discerning honeymooners, I founded Eden For Your World on a single belief: extraordinary travel begins with someone who has already been there, and knows the right person at the front desk. Every trip we craft is built around small, considered details — a private balcony breakfast in Positano, a midnight stargazing session in the Atacama, a sommelier waiting at the cellar door. We do not sell catalogues. We send you somewhere unforgettable, and we are on call from your first message to your last night.',
  travel_specialties: [
    'Luxury',
    'Honeymoons & Romance',
    'Family',
    'Wellness & Spa',
    'Culinary & Wine',
    'Cultural & Heritage',
  ],
  destination_specialties: [
    'Europe',
    'Mediterranean',
    'Caribbean',
    'Asia-Pacific',
    'Africa',
    'South Pacific',
  ],
  preferred_suppliers: [
    'Virtuoso',
    'Aman',
    'Four Seasons',
    'Belmond',
    'Rosewood',
    'Regent Seven Seas',
    'Silversea',
  ],
  travel_types: [
    'Bespoke Itineraries',
    'Cruises',
    'Luxury Villas',
    'All-Inclusive Resorts',
    'Escorted Tours',
  ],
}

/**
 * Placeholder agent for the Template 2 demo route (/t2/demo).
 * All contact info is generic — no real agent data.
 */
export const DEMO_T2_AGENT: MockAgent = {
  id: 't2-demo',
  full_name: 'Your Travel Advisor',
  agency_name: 'Luxury Travel Co.',
  tagline: 'Curating the world\'s most extraordinary journeys — with precision, passion, and white-glove care.',
  email: 'hello@luxurytravelco.com',
  phone: '+1 (800) 555-0100',
  address: '123 Grand Avenue, Suite 400, Beverly Hills, CA 90210',
  cst_number: 'XXXXXXXX-XX',
  instagram_url: '#',
  facebook_url: '#',
  youtube_url: undefined,
  custom_domain: null,
  avatar_url: null,
  // Canonical Vista/Growth demo — searchable directories, Experiences, etc.
  tier: 'growth',
}

/**
 * Demo agent for Your Travel Center (YTC) Spokane — Demo 3.
 * Replicates the real YTC agency identity using the T2 template with YTC branding.
 */
export const DEMO_YTC_AGENT: MockAgent = {
  id: 'ytc-demo',
  full_name: 'Your Travel Center',
  agency_name: 'Your Travel Center',
  tagline: 'Full-service global experiences — crafted by Spokane\'s most trusted travel experts.',
  email: 'spokane@ytc.com',
  phone: '(509) 327-9585',
  address: '27 E Augusta Ave. Spokane, WA 99207',
  cst_number: undefined,
  instagram_url: '#',
  facebook_url: '#',
  youtube_url: undefined,
  custom_domain: null,
  avatar_url: null,
  logo_url: '/assets/ytc/ytc-white-800.png',
  logo_url_dark: '/assets/ytc/ytc-black-800.png',
  nav_links: [
    { label: 'About',    href: '/about' },
    { label: 'Cruises', href: '/find-cruise' },
    { label: 'Hotels',  href: '/book-hotel' },
    { label: 'Villas',  href: '/book-villa' },
    { label: 'Contact', href: '/contact' },
  ],
}

/**
 * Demo agent for Template 3 — "Modern Editorial" (Belmond-inspired).
 * Sans-serif design system, generous whitespace, warm ivory + bronze palette.
 */
export const DEMO_T3_AGENT: MockAgent = {
  id: 't3-demo',
  full_name: 'Eleanor Price',
  first_name: 'Eleanor',
  agency_name: 'Meridian & Company',
  tagline: 'Quietly extraordinary journeys, considered down to the last detail.',
  email: 'hello@meridianandco.com',
  phone: '+1 (800) 555-0103',
  address: '1 Beacon Street, Suite 1800, Boston, MA 02108',
  cst_number: 'XXXXXXXX-XX',
  instagram_url: '#',
  facebook_url: '#',
  youtube_url: undefined,
  tiktok_url: undefined,
  website_url: 'https://meridianandco.com',
  custom_domain: null,
  avatar_url: null,
  bio: 'A former hotelier turned advisor, Eleanor founded Meridian & Company after two decades inside luxury hospitality — most recently as guest experience director at one of Europe\'s most celebrated private-island resorts. Her relationships span three generations of the industry, from general managers and head butlers to head chefs and front-of-house teams. The result is the kind of access that no algorithm can replicate: the suite that was never listed, the table no one else can book, the guide who usually only works privately for a single family.',
  travel_specialties: [
    'Luxury',
    'Honeymoons & Romance',
    'Wellness & Spa',
    'Culinary & Wine',
    'Cultural & Heritage',
    'Solo Travel',
  ],
  destination_specialties: [
    'Europe',
    'Mediterranean',
    'Asia-Pacific',
    'South Pacific',
    'Africa',
    'Antarctica',
  ],
  preferred_suppliers: [
    'Virtuoso',
    'Aman',
    'Belmond',
    'Rosewood',
    'Four Seasons',
    'Regent Seven Seas',
    'Silversea',
    'Lindblad Expeditions',
  ],
  travel_types: [
    'Bespoke Itineraries',
    'Luxury Villas',
    'Expedition Cruises',
    'Rail Journeys',
    'Escorted Tours',
  ],
}

/**
 * Wine & Wellness Travel — the user's own client record.
 * Aethos-inspired T2 build. Personal fields (legal name / phone / email /
 * address / CST / headshot) are intentionally set as placeholders the user
 * will fill in before this is promoted from /t2/wwt-demo to a production
 * custom-domain site.
 */
export const DEMO_WWT_AGENT: MockAgent = {
  id: 'wwt-demo',
  full_name: 'Your Advisor',
  agency_name: 'Wine & Wellness Travel',
  tagline: 'Journeys poured slowly. Lived wholly. Curated by hand for the conscious traveler.',
  email: 'hello@wineandwellnesstravel.com',
  phone: '+1 (000) 000-0000',
  address: '[Your Business Address]',
  cst_number: undefined,
  instagram_url: 'https://www.instagram.com/wineandwellnesstravel',
  facebook_url: 'https://www.facebook.com/wineandwellnesstravel',
  youtube_url: undefined,
  tiktok_url: undefined,
  website_url: 'https://www.wineandwellnesstravel.com',
  custom_domain: null,
  avatar_url: null,
  bio: "Wine & Wellness Travel was born from a single belief — that travel, at its best, is not a destination but a slow return to yourself. As a proud affiliate of Montecito Village Travel and a member of Virtuoso, the world's leading luxury travel network, I design journeys for the traveler who measures a great trip not by what they ticked off, but by how they felt at the end of it: a private cellar dinner in Piemonte, a silent dawn walk through Kyoto, a barefoot week at a Tuscan farmhouse with nothing on the itinerary but long lunches. Every trip comes with VIP perks, hand-vetted properties, and a single point of contact from first call to last night — so you can stop planning and start being somewhere.",
  travel_specialties: [
    'Wine Country',
    'Wellness & Spa Retreats',
    'Culinary Journeys',
    'Honeymoons & Romance',
    'River & Ocean Cruises',
    'Villa & Private Stays',
  ],
  destination_specialties: [
    'Tuscany & Piemonte',
    'Provence & Bordeaux',
    'Napa & Sonoma',
    'Amalfi Coast',
    'Mendoza',
    'Hawaii',
  ],
  preferred_suppliers: [
    'Virtuoso',
    'Four Seasons',
    'Belmond',
    'Rosewood',
    'Auberge Resorts',
    'Hyatt Privé',
    'Regent Seven Seas',
    'Six Senses',
  ],
  travel_types: [
    'Wine-Country Tours',
    'Wellness Retreats',
    'Luxury Villas',
    'River Cruises',
    'Bespoke Itineraries',
    'All-Inclusive Resorts',
  ],
  nav_links: [
    { label: 'About',         href: '/about' },
    { label: 'Experiences',   href: '/experiences' },
    { label: 'Hotels',        href: '/book-hotel' },
    { label: 'Cruises',       href: '/find-cruise' },
    { label: 'Journal',       href: '#journal' },
    { label: 'Contact',       href: '/contact' },
  ],
}

/**
 * Casa Solis — T4 (Custom) demo. Quiet-luxury editorial for the Custom tier.
 */
export const DEMO_CASA_SOLIS_AGENT: MockAgent = {
  id: 'casa-solis',
  full_name: 'Casa Solis',
  agency_name: 'Casa Solis',
  tagline: 'A quiet house of travel, arranged slowly — for the few who measure a trip in conversation, not logistics.',
  email: 'hello@casasolis.travel',
  phone: '+1 (000) 000-0000',
  address: '[Studio address]',
  cst_number: undefined,
  custom_domain: null,
  avatar_url: null,
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export interface DisplaySupplier {
  id: string
  name: string
  location: string
  description: string
  cover_image: string
  supplier_type: string
  virtuoso_perks: VirtuosoPerks | null
  is_active: boolean
}

export const MOCK_SUPPLIERS: DisplaySupplier[] = [
  {
    id: '1',
    name: 'Aman Venice',
    location: 'Venice, Italy',
    description:
      'A 16th-century palazzo on the Grand Canal — one of Venice\'s most extraordinary private residences.',
    cover_image:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=900&q=85',
    supplier_type: 'hotel',
    virtuoso_perks: {
      breakfast: true,
      room_upgrade: true,
      spa_credit: '$100',
      welcome_amenity: 'Champagne on arrival',
    },
    is_active: true,
  },
  {
    id: '2',
    name: 'Four Seasons Bora Bora',
    location: 'Bora Bora, French Polynesia',
    description:
      'Overwater bungalows suspended above a turquoise lagoon at the edge of the world.',
    cover_image:
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=900&q=85',
    supplier_type: 'hotel',
    virtuoso_perks: {
      breakfast: true,
      room_upgrade: true,
      spa_credit: '$100',
    },
    is_active: true,
  },
  {
    id: '3',
    name: 'Singita Grumeti',
    location: 'Serengeti, Tanzania',
    description:
      'An exclusive private concession bordering the Serengeti — intimate access to the Great Migration.',
    cover_image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=85',
    supplier_type: 'hotel',
    virtuoso_perks: {
      room_upgrade: true,
      welcome_amenity: 'Sundowner safari experience',
    },
    is_active: true,
  },
  {
    id: '4',
    name: 'The Brando',
    location: 'Tetiaroa, French Polynesia',
    description:
      'Marlon Brando\'s private island resort — an all-inclusive eco-paradise in the South Pacific.',
    cover_image:
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&q=85',
    supplier_type: 'hotel',
    virtuoso_perks: {
      breakfast: true,
      spa_credit: '$75',
    },
    is_active: true,
  },
  {
    id: '5',
    name: "Badrutt's Palace",
    location: 'St. Moritz, Switzerland',
    description:
      'The legendary Alpine palace perched above St. Moritz, a winter destination for over 150 years.',
    cover_image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=85',
    supplier_type: 'hotel',
    virtuoso_perks: {
      breakfast: true,
      room_upgrade: true,
      spa_credit: '$100',
      welcome_amenity: 'Ski concierge service',
    },
    is_active: true,
  },
  {
    id: '6',
    name: 'Amangiri',
    location: 'Canyon Point, Utah',
    description:
      'A desert sanctuary carved into the canyon lands of the American Southwest.',
    cover_image:
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&q=85',
    supplier_type: 'hotel',
    virtuoso_perks: {
      breakfast: true,
      spa_credit: '$100',
    },
    is_active: true,
  },
]

// ─── Instagram Posts ──────────────────────────────────────────────────────────

export interface IgPost {
  id: string
  media_url: string
  thumbnail_url?: string
  permalink: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  timestamp: string
}

export const MOCK_IG_POSTS: IgPost[] = [
  {
    id: '1',
    media_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700&q=80',
    permalink: '#',
    media_type: 'IMAGE',
    timestamp: '2024-03-01T12:00:00Z',
    caption: 'Morning light over the Grand Canal',
  },
  {
    id: '2',
    media_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&q=80',
    permalink: '#',
    media_type: 'IMAGE',
    timestamp: '2024-03-02T12:00:00Z',
  },
  {
    id: '3',
    media_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&q=80',
    permalink: '#',
    media_type: 'IMAGE',
    timestamp: '2024-03-03T12:00:00Z',
  },
  {
    id: '4',
    media_url: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=700&q=80',
    permalink: '#',
    media_type: 'IMAGE',
    timestamp: '2024-03-04T12:00:00Z',
  },
  {
    id: '5',
    media_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
    permalink: '#',
    media_type: 'IMAGE',
    timestamp: '2024-03-05T12:00:00Z',
  },
  {
    id: '6',
    media_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80',
    permalink: '#',
    media_type: 'IMAGE',
    timestamp: '2024-03-06T12:00:00Z',
  },
  {
    id: '7',
    media_url: 'https://images.unsplash.com/photo-1504730655501-fca7454aa3fc?w=700&q=80',
    permalink: '#',
    media_type: 'IMAGE',
    timestamp: '2024-03-07T12:00:00Z',
  },
  {
    id: '8',
    media_url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=700&q=80',
    permalink: '#',
    media_type: 'IMAGE',
    timestamp: '2024-03-08T12:00:00Z',
  },
  {
    id: '9',
    media_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80',
    permalink: '#',
    media_type: 'IMAGE',
    timestamp: '2024-03-09T12:00:00Z',
  },
]
