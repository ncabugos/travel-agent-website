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
  agency_name: string
  tagline: string
  email: string
  phone?: string
  address?: string
  cst_number?: string
  instagram_url?: string
  facebook_url?: string
  youtube_url?: string
  custom_domain: string | null
  avatar_url: string | null
  logo_url?: string | null          // white/light version (nav on hero, overlay)
  logo_url_dark?: string | null     // dark version (footer on light bg)
  nav_links?: { label: string; href: string }[]
}

export const MOCK_AGENT: MockAgent = {
  id: 'demo-agent',
  full_name: 'John Oberacker',
  agency_name: 'Eden For Your World',
  tagline: 'Curating the world\'s most extraordinary journeys — with precision, passion, and white-glove care.',
  email: 'info@edenforyourworld.com',
  phone: '+1 (562) 856-8603',
  address: '5318 E. 2nd St. #520, Long Beach, CA 90803',
  cst_number: '2097184-40',
  instagram_url: 'https://www.instagram.com/edenforyourworld',
  facebook_url: 'https://www.facebook.com/edenforyourworld',
  youtube_url: undefined,
  custom_domain: null,
  avatar_url: null,
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
