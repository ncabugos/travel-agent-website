import { createServiceClient } from '@/lib/supabase/service'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PropertyDestination {
  id: string
  name: string
  location: string
  description: string | null
  image_gallery: string[]
  booking_link: string | null
  is_featured: boolean
  sort_order: number
}

export interface ExclusiveExperience {
  id: string
  title: string
  supplier_tag: string | null
  location_tag: string | null
  description: string | null
  image_url: string | null
  itinerary_length: string | null
  sort_order: number
}

export interface FeaturedPartner {
  id: string
  name: string
  slug: string
  logo_url: string | null
  category: 'cruise' | 'hotel' | 'tour' | 'air'
  is_preferred: boolean
  sort_order: number
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROPERTIES: PropertyDestination[] = [
  { id: '1', name: 'Amanpuri',              location: 'Phuket, Thailand',    description: 'The original Aman resort on a private peninsula.', image_gallery: ['/media/hotel-programs/aman/aman-hero-2000.jpg'], booking_link: null, is_featured: true, sort_order: 1 },
  { id: '2', name: 'Four Seasons Maui',      location: 'Wailea, Hawaii',      description: 'An oceanfront paradise on Maui\'s most stunning shoreline.', image_gallery: ['/media/hotel-programs/four-seasons/fs-maui-ocean_suite-3840x2160.jpg'], booking_link: null, is_featured: true, sort_order: 2 },
  { id: '3', name: 'Belmond Hotel Cipriani', location: 'Venice, Italy',       description: 'An iconic retreat steps from St. Mark\'s Square.', image_gallery: ['/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg'], booking_link: null, is_featured: true, sort_order: 3 },
  { id: '4', name: 'Rosewood Miramar Beach',    location: 'Montecito, California', description: 'A coastal sanctuary on storied Miramar Beach.',          image_gallery: ['/media/hotel-programs/rosewood-elite/rosewood-miramar-hero-scaled.jpg'], booking_link: null, is_featured: true, sort_order: 4 },
  { id: '5', name: 'Park Hyatt Sydney',          location: 'Sydney, Australia',   description: 'Harbourfront luxury with Opera House views.',              image_gallery: ['/media/hotel-programs/hyatt-prive/Hyatt-aviara-2200.jpg'],              booking_link: null, is_featured: true, sort_order: 5 },
  { id: '6', name: 'Mandarin Oriental Bangkok',  location: 'Bangkok, Thailand',   description: 'The legendary riverside icon since 1876.',                 image_gallery: ['/media/hotel-programs/mandarin-oriental/mandarin-hero-2000.jpg'],      booking_link: null, is_featured: true, sort_order: 6 },
]

const MOCK_EXPERIENCES: ExclusiveExperience[] = [
  { id: '1', title: 'Belmond Afloat in France',          supplier_tag: 'Belmond',  location_tag: 'Burgundy, France',  description: 'Cruise the canals of Burgundy aboard a luxury river barge.', image_url: '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg', itinerary_length: '6 nights', sort_order: 1 },
  { id: '2', title: 'Four Seasons Private Jet',           supplier_tag: 'Four Seasons', location_tag: 'Global',        description: 'Around-the-world luxury by private Boeing 757.', image_url: '/media/hotel-programs/four-seasons/fs-maui-ocean_suite-3840x2160.jpg', itinerary_length: '24 days', sort_order: 2 },
  { id: '3', title: 'Aman Wellness Immersion',            supplier_tag: 'Aman',     location_tag: 'Bali, Indonesia',   description: 'A transformative wellness journey at Amandari.', image_url: '/media/hotel-programs/aman/aman-hero-2000.jpg', itinerary_length: '7 nights', sort_order: 3 },
]

const MOCK_PARTNERS: FeaturedPartner[] = [
  { id: '1',  name: 'Regent Seven Seas',           slug: 'regent-seven-seas',       logo_url: '/media/cruises/regent-seven-seas/regent-black-500.jpg',                                  category: 'cruise', is_preferred: true,  sort_order: 1 },
  { id: '2',  name: 'Silversea Cruises',            slug: 'silversea',               logo_url: '/assets/supplier logos/jpg/Silversea-Logo.jpg',                                       category: 'cruise', is_preferred: true,  sort_order: 2 },
  { id: '3',  name: 'Seabourn Cruises',             slug: 'seabourn',                logo_url: '/media/cruises/seabourn/seabourn-600.png',                                            category: 'cruise', is_preferred: true,  sort_order: 3 },
  { id: '4',  name: 'Oceania Cruises',              slug: 'oceania',                 logo_url: '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg',                           category: 'cruise', is_preferred: true,  sort_order: 4 },
  { id: '5',  name: 'Four Seasons',                 slug: 'four-seasons-partner',    logo_url: '/media/hotel-programs/logos/four-seasons-preferred-partner.jpg',                      category: 'hotel',  is_preferred: true,  sort_order: 5 },
  { id: '6',  name: 'Aman',                         slug: 'aman-partner',            logo_url: '/media/hotel-programs/logos/aman.jpg',                                               category: 'hotel',  is_preferred: true,  sort_order: 6 },
  { id: '7',  name: 'Belmond Bellini Club',         slug: 'belmond-bellini-club',    logo_url: '/media/hotel-programs/logos/belmond-bellini-club.jpg',                                category: 'hotel',  is_preferred: true,  sort_order: 7 },
  { id: '8',  name: 'Mandarin Oriental Fan Club',   slug: 'mandarin-fan-club',       logo_url: '/media/hotel-programs/logos/mandarin-oriental-fan-club.jpg',                         category: 'hotel',  is_preferred: true,  sort_order: 8 },
  { id: '9',  name: 'Rosewood Elite',               slug: 'rosewood-elite',          logo_url: '/media/hotel-programs/logos/rosewood-elite.jpg',                                     category: 'hotel',  is_preferred: true,  sort_order: 9 },
  { id: '10', name: 'Hyatt Privé',                  slug: 'hyatt-prive',             logo_url: '/media/hotel-programs/logos/hyatt-prive.jpg',                                        category: 'hotel',  is_preferred: true,  sort_order: 10 },
  { id: '11', name: 'Peninsula Pen Club',           slug: 'peninsula-pen-club',      logo_url: '/media/hotel-programs/logos/peninsula-pen-club.jpg',                                 category: 'hotel',  is_preferred: true,  sort_order: 11 },
  { id: '12', name: 'Dorchester Diamond Club',      slug: 'dorchester-diamond-club', logo_url: '/media/hotel-programs/logos/dorchester-diamond-club.jpg',                            category: 'hotel',  is_preferred: true,  sort_order: 12 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hasSupabase = () => !!process.env.NEXT_PUBLIC_SUPABASE_URL

// ─── Properties & Destinations ────────────────────────────────────────────────

export async function getPropertiesDestinations(): Promise<PropertyDestination[]> {
  if (!hasSupabase()) return MOCK_PROPERTIES

  try {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('properties_destinations')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data) return MOCK_PROPERTIES
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((r: any) => ({ ...r, image_gallery: r.image_gallery ?? [] }))
  } catch { return MOCK_PROPERTIES }
}

// ─── Exclusive Experiences ────────────────────────────────────────────────────

export async function getExclusiveExperiences(): Promise<ExclusiveExperience[]> {
  if (!hasSupabase()) return MOCK_EXPERIENCES

  try {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('exclusive_experiences')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data) return MOCK_EXPERIENCES
    return data as ExclusiveExperience[]
  } catch { return MOCK_EXPERIENCES }
}

// ─── Featured Partners ────────────────────────────────────────────────────────

export async function getFeaturedPartners(category?: string): Promise<FeaturedPartner[]> {
  if (!hasSupabase()) {
    return category ? MOCK_PARTNERS.filter(p => p.category === category) : MOCK_PARTNERS
  }

  try {
    const sb = createServiceClient()
    let query = sb
      .from('featured_partners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error || !data) return MOCK_PARTNERS
    return data as FeaturedPartner[]
  } catch { return MOCK_PARTNERS }
}

export async function getAgentPartners(agentId: string, category?: string): Promise<FeaturedPartner[]> {
  // For now, return all partners — agent toggle support will use agent_partner_toggles junction
  return getFeaturedPartners(category)
}

// ─── Supplier Products (Experiences page) ────────────────────────────────────

export interface SupplierProduct {
  id: string
  title: string
  supplier_name: string
  category: 'cruise' | 'hotel' | 'experience' | 'tour'
  subcategory: string | null
  location: string | null
  description: string | null
  highlights: string[]
  image_url: string | null
  logo_url: string | null
  duration: string | null
  starting_from: string | null
  booking_link: string | null
  is_featured: boolean
  sort_order: number
}

const MOCK_SUPPLIER_PRODUCTS: SupplierProduct[] = [
  // ── CRUISES ──────────────────────────────────────────────────────────────
  { id: '1',  title: 'Grand Mediterranean Voyage',       supplier_name: 'Regent Seven Seas',      category: 'cruise',     subcategory: 'Ocean Cruise',         location: 'Mediterranean',           description: 'Sail the storied coasts of Italy, Greece, Croatia and Monaco aboard the all-inclusive Seven Seas Splendor.',        highlights: ['All-inclusive fares — flights, excursions, gratuities', 'Michelin-calibre dining aboard', 'Exclusive Virtuoso amenities worth up to $1,500'], image_url: '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',         logo_url: '/media/cruises/regent-seven-seas/regent-black-500.jpg',              duration: '10 nights', starting_from: 'from $8,200 pp',  booking_link: null, is_featured: true,  sort_order: 10 },
  { id: '2',  title: 'Alaska Expedition Voyage',         supplier_name: 'Silversea Cruises',      category: 'cruise',     subcategory: 'Expedition Cruise',    location: 'Alaska & Pacific Northwest', description: 'Discover the raw grandeur of Alaska aboard Silver Endeavour — Silversea\'s purpose-built polar expedition vessel.', highlights: ['Zodiac and kayak excursions included', 'Expert naturalist expedition team', 'Butler service in every suite'],       image_url: '/media/cruises/silversea/silversea-southpacific-1500.jpg',         logo_url: '/assets/supplier logos/jpg/Silversea-Logo.jpg',                     duration: '12 nights', starting_from: 'from $11,000 pp', booking_link: null, is_featured: true,  sort_order: 20 },
  { id: '3',  title: 'Japan & Korea Passage',            supplier_name: 'Seabourn Cruises',       category: 'cruise',     subcategory: 'Ocean Cruise',         location: 'Asia Pacific',             description: 'An intimate exploration of Japan and South Korea on one of Seabourn\'s sleek ultra-luxury ships.',                  highlights: ['Ultra-small ship, maximum 450 guests', 'Immersive Ventures™ excursion program', 'All spirits, wines & champagne'],image_url: '/media/cruises/seabourn/seabourn-cruises-hero-2000.jpg',           logo_url: '/media/cruises/seabourn/seabourn-600.png',                           duration: '14 nights', starting_from: 'from $9,400 pp',  booking_link: null, is_featured: false, sort_order: 30 },
  { id: '4',  title: 'South Pacific Islands Journey',    supplier_name: 'Oceania Cruises',        category: 'cruise',     subcategory: 'Ocean Cruise',         location: 'South Pacific',            description: 'Island-hop across French Polynesia, Fiji, and Tonga aboard the intimate Riviera.',                                   highlights: ['The Finest Cuisine at Sea™', 'Free shore excursions in select ports', 'Virtuoso: shipboard credit + shore event'],image_url: '/media/cruises/oceania/oceania_cruises-oClass-Grand-Dining-Room-hero.jpg', logo_url: '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg',    duration: '16 nights', starting_from: 'from $6,800 pp',  booking_link: null, is_featured: false, sort_order: 40 },

  // ── HOTELS ───────────────────────────────────────────────────────────────
  { id: '5',  title: 'Four Seasons Preferred Partner',   supplier_name: 'Four Seasons',           category: 'hotel',      subcategory: 'Resort',               location: 'Global',                   description: 'Book any Four Seasons through Eden Travel and unlock exclusive Preferred Partner amenities unavailable online.',      highlights: ['Daily breakfast for two', 'Room upgrade on arrival', '$100 hotel credit per stay', 'Priority early check-in / late check-out'], image_url: '/media/hotel-programs/four-seasons/fs-taormina-pool-couple-1080x1350.jpg', logo_url: '/assets/supplier logos/jpg/Four-Seasons-Preferred-black.jpg', duration: 'Flexible', starting_from: null, booking_link: null, is_featured: true,  sort_order: 50 },
  { id: '6',  title: 'Aman Global Access',               supplier_name: 'Aman',                   category: 'hotel',      subcategory: 'Resort & Residences',  location: 'Global',                   description: 'Aman\'s ultra-private resorts across Asia, Europe and the Americas — accessed through our preferred advisor relationship.', highlights: ['Exclusive rates not available directly', 'Personalized pre-arrival concierge', 'Complimentary room category upgrade'], image_url: '/media/hotel-programs/aman/aman-hero-2000.jpg', logo_url: '/assets/supplier logos/jpg/Aman-black.jpg', duration: 'Flexible', starting_from: null, booking_link: null, is_featured: true,  sort_order: 60 },
  { id: '7',  title: 'Belmond Bellini Club',             supplier_name: 'Belmond',                category: 'hotel',      subcategory: 'Hotels & Trains',      location: 'Global',                   description: 'From Hotel Cipriani to the Orient-Express — Bellini Club perks on every Belmond booking through Eden.',              highlights: ['Upgrade on arrival', 'Daily à la carte breakfast', 'Bellini welcome amenity', 'Flexible late check-out'],          image_url: '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg', logo_url: '/media/hotel-programs/logos/belmond-bellini-club.jpg',               duration: 'Flexible', starting_from: null, booking_link: null, is_featured: false, sort_order: 70 },
  { id: '8',  title: 'Rosewood Elite Privileges',        supplier_name: 'Rosewood',               category: 'hotel',      subcategory: 'Resort',               location: 'Global',                   description: 'Rosewood Elite status on every booking — from Miramar Beach to Las Ventanas al Paraíso.',                            highlights: ['$100 F&B credit per stay', 'One category room upgrade', 'Complimentary breakfast', 'Priority room assignment'],     image_url: '/media/hotel-programs/rosewood-elite/rosewood-miramar-hero-scaled.jpg', logo_url: '/media/hotel-programs/logos/rosewood-elite.jpg',                    duration: 'Flexible', starting_from: null, booking_link: null, is_featured: false, sort_order: 80 },
  { id: '12', title: 'Mandarin Oriental Fan Club',       supplier_name: 'Mandarin Oriental',      category: 'hotel',      subcategory: 'Urban Luxury',         location: 'Global',                   description: 'The world\'s most iconic urban hotels — with Fan Club benefits reserved exclusively for Virtuoso advisors.',         highlights: ['Complimentary room upgrade', 'Daily breakfast for two', 'Welcome amenity', 'Early check-in / late check-out'],     image_url: '/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Hero-2000.jpg', logo_url: '/assets/supplier logos/jpg/Mandarin-Oriental-black.jpg', duration: 'Flexible', starting_from: null, booking_link: null, is_featured: true,  sort_order: 85 },
  { id: '13', title: 'Hyatt Privé Benefits',             supplier_name: 'Hyatt',                  category: 'hotel',      subcategory: 'Resort',               location: 'Global',                   description: 'Exclusive Hyatt Privé perks at Park Hyatt, Alila, Thompson, and Andaz properties worldwide.',                       highlights: ['Upgrade on arrival when available', 'Daily breakfast for two', '$50–100 hotel credit', 'Flexible late check-out'],  image_url: '/media/hotel-programs/hyatt-prive/hyatt-hero-2000.jpg',            logo_url: '/assets/supplier logos/jpg/Hyatt-Prive-black.jpg',                   duration: 'Flexible', starting_from: null, booking_link: null, is_featured: false, sort_order: 87 },
  { id: '14', title: 'Auberge Resorts Collection',       supplier_name: 'Auberge Resorts',        category: 'hotel',      subcategory: 'Boutique Resort',      location: 'Global',                   description: 'Intimate, one-of-a-kind resorts in the world\'s most coveted destinations — booked with exclusive advisor amenities.', highlights: ['Complimentary room upgrade', 'Welcome amenity on arrival', 'Special rates', 'Dedicated advisor support'],          image_url: '/media/hotel-programs/auberge-resorts/auberge-hero-2000.jpg',      logo_url: '/assets/supplier logos/jpg/Auberge-black.jpg',                       duration: 'Flexible', starting_from: null, booking_link: null, is_featured: false, sort_order: 88 },
  { id: '15', title: 'Shangri-La Luxury Circle',         supplier_name: 'Shangri-La',             category: 'hotel',      subcategory: 'Urban Luxury',         location: 'Asia & Global',            description: 'Shangri-La\'s Luxury Circle program grants preferred amenities at their iconic properties across Asia and beyond.',   highlights: ['Room upgrade priority', 'Daily breakfast', 'Welcome gift', 'Late check-out'],                                       image_url: '/media/hotel-programs/shangri-la/ShangriLa-hotels-Hero-2000.jpg',  logo_url: '/assets/supplier logos/jpg/Shangri-La-black.jpg',                    duration: 'Flexible', starting_from: null, booking_link: null, is_featured: false, sort_order: 89 },
  { id: '16', title: 'Ritz-Carlton Stars Program',       supplier_name: 'Ritz-Carlton',           category: 'hotel',      subcategory: 'Urban Luxury',         location: 'Global',                   description: 'Access exclusive Ritz-Carlton Stars benefits across every iconic property in the collection worldwide.',             highlights: ['Complimentary breakfast for two', 'Upgrade on arrival', '$100 hotel credit', 'Early check-in guarantee'],          image_url: '/media/hotel-programs/marriott-stars---luminous/marriott-hero-2200.jpg', logo_url: '/assets/supplier logos/jpg/Marriott-Stars-black.jpg',            duration: 'Flexible', starting_from: null, booking_link: null, is_featured: false, sort_order: 90 },
  { id: '17', title: 'The Peninsula PenClub',            supplier_name: 'Peninsula Hotels',       category: 'hotel',      subcategory: 'Urban Luxury',         location: 'Global',                   description: 'The Peninsula\'s PenClub advisor program delivers unparalleled privileges at nine legendary city hotels.',           highlights: ['Room upgrade', 'Complimentary breakfast', '$100 F&B credit', 'VIP recognition'],                                  image_url: '/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Hero-2000.jpg', logo_url: '/assets/supplier logos/jpg/Peninsula-black.jpg',             duration: 'Flexible', starting_from: null, booking_link: null, is_featured: false, sort_order: 91 },

  // ── EXPERIENCES ──────────────────────────────────────────────────────────
  { id: '9',  title: 'Private Tuscany Harvest Journey',  supplier_name: 'Eden Travel',            category: 'experience', subcategory: 'Culinary & Culture',   location: 'Tuscany, Italy',           description: 'Seven days of olive harvests, private vineyard dinners and truffle hunts across the Chianti countryside.',            highlights: ['Private farmhouse accommodation', 'Daily guided food & wine experiences', 'Fully customizable itinerary'],         image_url: '/media/hotel-programs/four-seasons/fs-paris-1500.jpg',             logo_url: null,                                                                  duration: '7 nights',  starting_from: 'from $7,200 pp',  booking_link: null, is_featured: true,  sort_order: 100 },
  { id: '10', title: 'Maldives Seaplane & Dive',         supplier_name: 'Eden Travel',            category: 'experience', subcategory: 'Adventure',            location: 'Maldives',                 description: 'A curated 10-night journey combining private overwater villa stays with expert-led dive expeditions.',               highlights: ['Overwater bungalow at a Virtuoso property', 'PADI dive guide included daily', 'Submarine excursion & sunset dhoni cruise'], image_url: '/media/hotel-programs/aman/aman-hero-2000.jpg', logo_url: null,                                                                  duration: '10 nights', starting_from: 'from $9,800 pp',  booking_link: null, is_featured: true,  sort_order: 110 },
  { id: '11', title: 'Patagonia & Antarctica Expedition',supplier_name: 'Eden Travel',            category: 'experience', subcategory: 'Expedition',           location: 'Patagonia & Antarctica',  description: 'An extraordinary 18-day land and sea expedition from Buenos Aires to the White Continent.',                         highlights: ['Private guiding through Torres del Paine', 'Expedition ship berth — 100-guest vessel', 'Zodiac landings on the Antarctic Peninsula'], image_url: '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg', logo_url: null, duration: '18 days', starting_from: 'from $18,500 pp', booking_link: null, is_featured: false, sort_order: 120 },
]


export async function getSupplierProducts(category?: SupplierProduct['category']): Promise<SupplierProduct[]> {
  if (!hasSupabase()) {
    return category ? MOCK_SUPPLIER_PRODUCTS.filter(p => p.category === category) : MOCK_SUPPLIER_PRODUCTS
  }

  try {
    const sb = createServiceClient()
    let query = sb
      .from('supplier_products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error || !data) return MOCK_SUPPLIER_PRODUCTS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((r: any) => ({ ...r, highlights: r.highlights ?? [] }))
  } catch { return MOCK_SUPPLIER_PRODUCTS }
}
