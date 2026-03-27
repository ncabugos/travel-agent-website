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
