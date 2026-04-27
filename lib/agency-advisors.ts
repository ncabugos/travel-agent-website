/**
 * Agency advisors — the team roster for agency-tier sites.
 *
 * For the YTC demo this is a hard-coded list. When the platform ships real
 * multi-advisor agency accounts, swap `getAgencyAdvisors(agencyId)` for a
 * Supabase query against a future `agency_advisors` table (or similar).
 *
 * Schema shape intentionally mirrors what that future table will look like
 * so the component layer doesn't need to change.
 */

export interface AgencyAdvisor {
  slug: string
  name: string
  title: string
  photo: string
  bio: string
  specialties: string[]
  destinations: string[]
  languages?: string[]
  years_advising?: number
  email?: string
  phone?: string
  /** Inline pull-quote / tagline that shows under the name */
  tagline?: string
}

// ── YTC roster ───────────────────────────────────────────────────────────────
const YTC_ADVISORS: AgencyAdvisor[] = [
  {
    slug: 'margaret-ashworth',
    name: 'Margaret Ashworth',
    title: 'Founder & Principal Advisor',
    photo: '/media/team/agent-sarah-chen.png',
    tagline: 'Europe, Africa, and multi-generational family travel.',
    bio: 'Margaret founded YTC in 1998 after fifteen years running guest relations at two of Europe\'s most storied grand hotels. She is a Virtuoso Travel Advisor of the Year recipient and personally plans every multi-generational trip the agency books.',
    specialties: ['Multi-Generational Travel', 'Safari & Wildlife', 'European Grand Hotels', 'Honeymoons & Romance'],
    destinations: ['Europe', 'Africa', 'Mediterranean'],
    languages: ['English', 'French', 'Italian'],
    years_advising: 27,
    email: 'margaret@ytctravel.com',
  },
  {
    slug: 'james-whitmore',
    name: 'James Whitmore',
    title: 'Voyages & Expedition Lead',
    photo: '/media/team/agent-james-whitmore.png',
    tagline: 'Ultra-luxury ocean, private yacht, and polar expedition.',
    bio: 'James spent a decade designing private yacht charters in the Mediterranean and Caribbean before joining YTC to lead the cruise and expedition practice. He holds preferred advisor status with every major ultra-luxury line and has personally sailed the Northwest Passage twice.',
    specialties: ['Ultra-Luxury Ocean', 'Private Yacht Charters', 'Polar & Expedition', 'River Cruising'],
    destinations: ['Mediterranean', 'Antarctica & Arctic', 'South Pacific', 'Norwegian Fjords'],
    languages: ['English', 'Spanish'],
    years_advising: 14,
    email: 'james@ytctravel.com',
  },
  {
    slug: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    title: 'Asia-Pacific Specialist',
    photo: '/media/team/agent-isabelle-moreau.png',
    tagline: 'The Japan specialist with the black book.',
    bio: 'Based between Kyoto and Singapore, Yuki opens doors across Asia that are quite simply invisible from the outside. A former curator at a private museum in Tokyo, she blends art, cuisine, and access in a way that is impossible to replicate.',
    specialties: ['Japan & Korea', 'Private Access & Art', 'Cultural Immersion', 'Wellness & Spa'],
    destinations: ['Japan', 'Korea', 'Singapore', 'Southeast Asia', 'Bhutan'],
    languages: ['English', 'Japanese', 'Mandarin'],
    years_advising: 11,
    email: 'yuki@ytctravel.com',
  },
  {
    slug: 'david-kessler',
    name: 'David Kessler',
    title: 'Americas & Adventure Lead',
    photo: '/media/team/agent-sarah-chen.png',
    tagline: 'Patagonia to the Yukon — and everything in between.',
    bio: 'David has guided trekking expeditions across Patagonia, paddled the Grand Canyon three times, and built the Americas practice at YTC around the kind of adventure travel that still feels like adventure. He spends six months a year in the field.',
    specialties: ['Adventure & Expedition', 'National Parks', 'Luxury Camps & Lodges', 'Photography Journeys'],
    destinations: ['Patagonia', 'Alaska & Yukon', 'Western USA', 'Galápagos', 'Canadian Rockies'],
    languages: ['English', 'Spanish', 'Portuguese'],
    years_advising: 18,
    email: 'david@ytctravel.com',
  },
  {
    slug: 'priya-shah',
    name: 'Priya Shah',
    title: 'Middle East & Indian Subcontinent',
    photo: '/media/team/agent-isabelle-moreau.png',
    tagline: 'Rajasthan, the Emirates, and the classic Silk Road.',
    bio: 'Priya grew up between Mumbai and Dubai and has spent the last decade placing clients in the palaces, desert camps, and private estates that define luxury travel across her region. She arranges elephant safaris in Karnataka and private dinners at the Taj Falaknuma as easily as the average advisor books a hotel.',
    specialties: ['Cultural & Heritage', 'Palaces & Private Estates', 'Desert & Wildlife', 'Wellness & Ayurveda'],
    destinations: ['India', 'UAE', 'Oman', 'Sri Lanka', 'Maldives'],
    languages: ['English', 'Hindi', 'Gujarati', 'Arabic'],
    years_advising: 12,
    email: 'priya@ytctravel.com',
  },
  {
    slug: 'sophia-laurent',
    name: 'Sophia Laurent',
    title: 'Honeymoons & Celebration Travel',
    photo: '/media/team/agent-sarah-chen.png',
    tagline: 'Once-in-a-lifetime trips, every time.',
    bio: 'Sophia designs celebration travel exclusively — honeymoons, milestone anniversaries, significant birthdays. Her average client plans six to nine months ahead, and every trip she books includes at least one moment that makes someone cry in the good way.',
    specialties: ['Honeymoons & Romance', 'Milestone Travel', 'Private Islands', 'Beach & Island'],
    destinations: ['Maldives', 'French Polynesia', 'Seychelles', 'Greek Islands', 'Italian Riviera'],
    languages: ['English', 'French'],
    years_advising: 9,
    email: 'sophia@ytctravel.com',
  },
]

const ROSTERS: Record<string, AgencyAdvisor[]> = {
  'ytc-demo': YTC_ADVISORS,
}

/**
 * Returns the advisor roster for an agency-tier agent. Returns an empty
 * array for agents that don't have a multi-advisor team configured.
 */
export async function getAgencyAdvisors(agentId: string): Promise<AgencyAdvisor[]> {
  return ROSTERS[agentId] ?? []
}

export async function getAgencyAdvisor(
  agentId: string,
  advisorSlug: string,
): Promise<AgencyAdvisor | null> {
  const roster = await getAgencyAdvisors(agentId)
  return roster.find((a) => a.slug === advisorSlug) ?? null
}

export async function getAllAgencyAdvisorSlugs(
  agentId: string,
): Promise<string[]> {
  const roster = await getAgencyAdvisors(agentId)
  return roster.map((a) => a.slug)
}
