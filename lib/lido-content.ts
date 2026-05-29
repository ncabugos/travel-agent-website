/**
 * lib/lido-content.ts
 * Shared placeholder content for The Lido Collective (Agency demo).
 *
 * Single source of truth for destinations + journal teasers so the homepage,
 * destination index, and destination detail pages stay in sync. All copy is
 * placeholder editorial — no DB tables. Destination "Properties" sections hook
 * into the existing `getHotels({ country })` query via the `countries` allowlist.
 */

export interface LidoDestination {
  slug: string
  label: string
  /** 1-line editorial hook for cards. */
  hook: string
  /** Massive stacked hero headline (detail page). */
  headline: string
  /** 2-sentence intro under the hero. */
  intro: string
  /** 3–4 paragraphs of editorial body copy. */
  body: string[]
  /** Bodoni italic pull-quote. */
  pullQuote: string
  heroImage: string
  cardImage: string
  /** Two stacked images for the editorial split. */
  editorialImages: [string, string]
  /** Three atmospheric gallery stills. */
  galleryImages: [string, string, string]
  /** luxury_hotels.country values to surface in the Properties section. */
  countries: string[]
}

export const LIDO_DESTINATIONS: LidoDestination[] = [
  {
    slug: 'mediterranean',
    label: 'Mediterranean',
    hook: 'Sicily, the Aegean, the Amalfi — by yacht and by villa.',
    headline: 'From the Amalfi\nto the Aegean.',
    intro:
      'The Mediterranean is the sea everyone thinks they know. We send you to the version they do not — the cove the captain reaches before the day boats, the table held on the right night.',
    body: [
      'There is the Mediterranean of the brochure, and there is the one our advisors actually travel. The difference is access: a private gulet that moors where the ferries cannot, a palazzo let to one family at a time, a chef who opens his kitchen because someone made a call.',
      'We build the Mediterranean season around the light. June in the Aegean, before the meltemi. September on the Amalfi, after the crowds. The yacht is not the trip — it is the way you reach the parts of the trip no one else does.',
      'Aman at sea. The Orient Express sailing yachts. A working vineyard above the Tyrrhenian that takes no public bookings. You will not find these on a search engine. You will find them through the person who has already stayed.',
    ],
    pullQuote: 'The cove the captain reaches before the day boats.',
    heroImage: '/media/hero images/four-seasons-taormina-pool-hero.jpg',
    cardImage: '/media/hero images/four-seasons-astir-hero.jpg',
    editorialImages: [
      '/media/hero images/four-seasons-taormina-exterior-hero.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg',
    ],
    galleryImages: [
      '/media/hero images/four-seasons-astir-hero.jpg',
      '/media/hero images/four-seasons-taormina-pool-hero.jpg',
      '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg',
    ],
    countries: ['Italy', 'Greece', 'Spain', 'France', 'Turkey', 'Croatia'],
  },
  {
    slug: 'europe',
    label: 'Europe',
    hook: 'The estates, the grand houses, the cities you return to.',
    headline: 'The houses that\nnever advertise.',
    intro:
      'Europe rewards the traveler who slows down. We build journeys around the private estates and grand houses that open only to those who know the family — not the booking engine.',
    body: [
      'Europe is not a destination so much as a hundred of them, and the art is in the editing. We do not hand you a grand tour. We hand you a fortnight in the Langhe, a long weekend in a Loire château let to one party, a city you thought you knew, reframed by someone who lives there.',
      'Our founder built the Collective on the European estates that no platform will ever list — the villa above Florence, the shooting lodge in the Highlands, the apartment on a Paris courtyard that belongs to a friend.',
      'The result is a continent that feels private. Dinner cooked by the family that has farmed the hillside for four generations. A museum opened after hours. The slow return that good travel is supposed to be.',
    ],
    pullQuote: 'A continent that feels, somehow, private.',
    heroImage: '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg',
    cardImage: '/media/hero images/four-seasons-CapFerrat_garden-hero.jpg',
    editorialImages: [
      '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg',
      '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg',
    ],
    galleryImages: [
      '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg',
      '/media/hero images/four-seasons-CapFerrat_garden-hero.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg',
    ],
    countries: ['France', 'Italy', 'United Kingdom', 'Switzerland', 'Spain', 'Portugal'],
  },
  {
    slug: 'indian-ocean',
    label: 'Indian Ocean',
    hook: 'Safari by day, barefoot on the water by night.',
    headline: 'Safari, then\nthe open water.',
    intro:
      'The Indian Ocean is where the great safari ends and the great unwinding begins. We pair the camps of East Africa with the private islands of the Seychelles and Maldives — one seamless arc.',
    body: [
      'The classic mistake is to treat the safari and the beach as two trips. We treat them as one breath in, one breath out: dawn in the Luangwa Valley on foot, then a week on an island reached only by seaplane, where the staff outnumber the guests.',
      'Our Africa and Indian Ocean specialist places clients in the conservation-led camps that give back more than they take, then on the overwater houses where the only schedule is the tide.',
      'Seychelles. The Maldives. Zanzibar. The water here is not a backdrop — it is the point. We make sure you reach the part of it no day-tripper ever will.',
    ],
    pullQuote: 'One breath in. One breath out.',
    heroImage: '/media/hero images/four-seasons-sayan-hero.jpg',
    cardImage: '/media/hotel-programs/aman/aman-hero-2000.jpg',
    editorialImages: [
      '/media/hotel-programs/aman/aman-hero-2000.jpg',
      '/media/hero images/four-seasons-sayan-hero.jpg',
    ],
    galleryImages: [
      '/media/hotel-programs/aman/aman-hero-2000.jpg',
      '/media/hero images/four-seasons-sayan-hero.jpg',
      '/media/hero images/four-seasons-astir-hero.jpg',
    ],
    countries: ['Maldives', 'Seychelles', 'Mauritius', 'Tanzania', 'South Africa', 'Zanzibar'],
  },
  {
    slug: 'caribbean-mexico',
    label: 'Caribbean & Mexico',
    hook: 'Private islands, and the houses you take whole.',
    headline: 'Take the island.\nNot the room.',
    intro:
      'The Caribbean we know is not the cruise-port one. It is the private island let to a single family, the Pacific-coast house with its own cove, the corner of Mexico the guidebooks never reach.',
    body: [
      'The luxury here is space, and privacy, and a staff who learn your name on the first morning. We place clients in the villas and private islands that release no public inventory — the ones you reach by tender, by puddle-jumper, by knowing someone.',
      'From St. Barths to the Riviera Maya, from a great house above the Caribbean Sea to a surf-and-spa hideaway on the Pacific, the brief is the same: yours, entirely, for the week.',
      'And when you want the buzz, we know which night, which table, which beach club still feels like a secret. Then back to the house, where no one knows you are there.',
    ],
    pullQuote: 'Yours, entirely, for the week.',
    heroImage: '/media/hotel-programs/oetker-pearl/eden-rock-st-barths-hero.jpg',
    cardImage: '/media/hero images/four-seasons-maimi-hero.jpg',
    editorialImages: [
      '/media/hotel-programs/oetker-pearl/eden-rock-st-barths-hero.jpg',
      '/media/hero images/four-seasons-maimi-hero.jpg',
    ],
    galleryImages: [
      '/media/hotel-programs/oetker-pearl/eden-rock-st-barths-hero.jpg',
      '/media/hero images/four-seasons-maimi-hero.jpg',
      '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg',
    ],
    countries: ['Mexico', 'Bahamas', 'Saint Lucia', 'Turks and Caicos', 'Jamaica', 'Barbados', 'United States'],
  },
  {
    slug: 'asia-pacific',
    label: 'Asia Pacific',
    hook: 'Japan, Bali, Bhutan — access, not itinerary.',
    headline: 'Access,\nnot itinerary.',
    intro:
      'Asia Pacific is the region where the right introduction changes everything. We open the doors — the temple at dawn, the kaiseki counter of eight seats, the Himalayan kingdom that limits who enters.',
    body: [
      'Our Asia-Pacific specialist lives between Kyoto and Singapore, and she travels the region the way an insider does: a private tea ceremony with a master who takes no tourists, a Balinese compound staffed for one family, a trek into Bhutan arranged with the people who guard the passes.',
      'This is not a checklist of cities. It is a sequence of moments you could not engineer on your own — the kind that send clients home changed, not merely rested.',
      'Japan. Bali. The Maldives. Bhutan. Each one earned through twenty years of relationships, and each one yours through a single phone call.',
    ],
    pullQuote: 'Moments you could not engineer on your own.',
    heroImage: '/media/hero images/four-seasons-sayan-hero.jpg',
    cardImage: '/media/hotel-programs/jumeirah/Burj-Al-Arab-Jumeirah-hero-2500.jpg',
    editorialImages: [
      '/media/hero images/four-seasons-sayan-hero.jpg',
      '/media/hotel-programs/aman/aman-hero-2000.jpg',
    ],
    galleryImages: [
      '/media/hero images/four-seasons-sayan-hero.jpg',
      '/media/hotel-programs/aman/aman-hero-2000.jpg',
      '/media/hotel-programs/jumeirah/Burj-Al-Arab-Jumeirah-hero-2500.jpg',
    ],
    countries: ['Japan', 'Thailand', 'Indonesia', 'Vietnam', 'Australia', 'Cambodia', 'Maldives'],
  },
]

export function getLidoDestination(slug: string): LidoDestination | undefined {
  return LIDO_DESTINATIONS.find((d) => d.slug === slug)
}

export interface LidoJournalPost {
  slug: string
  category: string
  title: string
  excerpt: string
  date: string
  image: string
}

/** Static journal teasers — render reliably regardless of broadcast targeting. */
export const LIDO_JOURNAL: LidoJournalPost[] = [
  {
    slug: 'seven-nights-aman-at-sea-aegean',
    category: 'Voyages',
    title: 'Seven Nights on Aman at Sea: The Aegean in June',
    excerpt: 'Before the meltemi, before the day boats — the week the Cyclades belong to almost no one.',
    date: 'May 2026',
    image: '/media/hero images/four-seasons-yacht-hero.jpg',
  },
  {
    slug: 'orient-express-corinthian-first-look',
    category: 'Stays',
    title: 'Orient Express Corinthian: A First Look',
    excerpt: 'The sailing yacht that has the trade talking, and what it actually feels like aboard.',
    date: 'April 2026',
    image: '/media/hero images/four-seasons-yacht-2-hero.jpg',
  },
  {
    slug: 'why-the-maldives-still-wins',
    category: 'Destinations',
    title: 'Why the Maldives Still Wins',
    excerpt: 'Overbuilt, overbooked, over-photographed — and still the easiest place on earth to disappear.',
    date: 'March 2026',
    image: '/media/hotel-programs/aman/aman-hero-2000.jpg',
  },
]
