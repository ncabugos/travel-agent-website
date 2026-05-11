import { createServiceClient } from '@/lib/supabase/service'

// ── Types ──────────────────────────────────────────────────────────────────

export interface LuxuryHotel {
  id:              string
  hotel_id:        string | null
  name:            string
  slug:            string
  city:            string | null
  state_region:    string | null
  country:         string | null
  neighborhood:    string | null
  hotel_company:   string | null
  hotel_type:      string | null
  room_count:      number | null
  room_style:      string | null
  vibe:            string | null
  experiences:     string[]
  description:     string | null
  cover_image_url: string | null
  detail_url:      string | null
  is_active:       boolean
  sort_order:      number
}

export interface HotelFilters {
  country?:  string
  vibe?:     string
  brand?:    string
  search?:   string
  page?:     number
  pageSize?: number
}

export const HOTELS_PER_PAGE = 12

// ── Fetchers ───────────────────────────────────────────────────────────────

/** Server-side paginated + filtered hotel list */
export async function getHotels(filters: HotelFilters = {}): Promise<{
  hotels: LuxuryHotel[]
  total: number
}> {
  const supabase = createServiceClient()
  const perPage = filters.pageSize ?? HOTELS_PER_PAGE
  const page    = filters.page ?? 1
  const offset  = (page - 1) * perPage

  let query = supabase
    .from('luxury_hotels')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (filters.country) query = query.eq('country', filters.country)
  if (filters.vibe)    query = query.eq('vibe', filters.vibe)
  if (filters.brand)   query = query.eq('hotel_company', filters.brand)
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,country.ilike.%${filters.search}%,hotel_company.ilike.%${filters.search}%`
    )
  }

  const { data, count, error } = await query
    .order('sort_order', { ascending: true })
    .range(offset, offset + perPage - 1)

  if (error) {
    console.error('getHotels error:', error.message)
    return { hotels: [], total: 0 }
  }
  return { hotels: data as LuxuryHotel[], total: count ?? 0 }
}

/** Unique values for filter dropdowns */
export async function getHotelFilterOptions(): Promise<{
  countries: string[]
  vibes: string[]
  brands: string[]
}> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('luxury_hotels')
    .select('country, vibe, hotel_company')
    .eq('is_active', true)

  if (!data) return { countries: [], vibes: [], brands: [] }

  const rows = data as { country: string | null; vibe: string | null; hotel_company: string | null }[]
  const uniq = (arr: (string | null)[]) =>
    [...new Set(arr.filter(Boolean))].sort() as string[]

  return {
    countries: uniq(rows.map(r => r.country)),
    vibes:     uniq(rows.map(r => r.vibe)),
    brands:    uniq(rows.map(r => r.hotel_company)),
  }
}

/** Single hotel by slug */
export async function getHotel(slug: string): Promise<LuxuryHotel | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('luxury_hotels')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as LuxuryHotel
}

// ── Program → Brand mapping ───────────────────────────────────────────────
// Maps each hotel program slug to the exact hotel_company string used in
// the luxury_hotels table. Verified end-to-end via
//   curl /api/hotels?brand=<value>
// Programs without a clean single-brand match (Dorchester, Leading Hotels
// of the World) are deliberately omitted — they continue to use the
// curated static FEATURED_HOTELS fallback handled by the caller.
//
// When this maps to Supabase, this map becomes a `hotel_company` column on
// the hotel_programs table; no API changes required.
export const PROGRAM_HOTEL_COMPANIES: Record<string, string> = {
  'aman-hotels-and-resorts':              'Aman',
  'auberge-resorts-collection':           'Auberge Collection',
  'belmond-bellini-club':                 'Belmond',
  'como-hotels':                          'COMO Hotels and Resorts',
  'four-seasons-preferred-partner':       'Four Seasons Hotels and Resorts',
  'hera-accor-hotels':                    'Accor',
  'hyatt-prive':                          'Hyatt Hotels Corporation',
  'kempinski-club-1897':                  'Kempinski Hotels',
  'mandarin-oriental-fan-club':           'Mandarin Oriental',
  'marriott-international-luminous':      'Luxury Group at Marriott International',
  'montage-hotels':                       'Montage International',
  'oetker-hotel-collection-pearl-partner':'Oetker Hotels',
  'one-and-only-hotels-and-resorts':      'One&Only Resorts',
  'peninsula-pen-club':                   'The Peninsula',
  'ritz-carlton-stars':                   'Luxury Group at Marriott International',
  'rocco-forte-hotels':                   'Rocco Forte Hotels',
  'rosewood-elite':                       'Rosewood Hotels & Resorts',
  'shangri-la-hotels-the-luxury-circle':  'Shangri-La Group',
}

/**
 * Resolves the curated "Featured" properties for a hotel program by
 * querying the live luxury_hotels table for the program's parent brand.
 *
 * Replaces the legacy static FEATURED_HOTELS map (lib/featured-hotels.ts)
 * for programs that have a clean single-brand mapping above. Callers should
 * still fall back to FEATURED_HOTELS for programs without a mapping
 * (Dorchester, Leading Hotels of the World) — the page-level component
 * handles that transition.
 *
 * Returns up to `limit` hotels ordered by sort_order, or an empty array if
 * the program has no brand mapping or the query fails.
 */
export async function getProgramFeaturedHotels(
  programSlug: string,
  limit = 6,
): Promise<LuxuryHotel[]> {
  const brand = PROGRAM_HOTEL_COMPANIES[programSlug]
  if (!brand) return []
  const { hotels } = await getHotels({ brand, pageSize: limit })
  return hotels
}
