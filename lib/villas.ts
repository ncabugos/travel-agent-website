import { createServiceClient } from '@/lib/supabase/service'

// ── Types ──────────────────────────────────────────────────────────────────

export interface Villa {
  id:              string
  name:            string
  slug:            string
  country:         string
  neighborhood:    string | null
  city_region:     string | null
  villa_type:      string
  bedrooms:        number | null
  bathrooms:       number | null
  max_guests:      number | null
  price_per_night: number | null
  cover_image_url: string | null
  source_url:      string | null
  source:          string
  is_active:       boolean
  sort_order:      number
}

// ── Fetchers ───────────────────────────────────────────────────────────────

/** All active villas ordered by sort_order */
export async function getAllVillas(): Promise<Villa[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('villas')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('getAllVillas error:', error.message)
    return []
  }
  return data as Villa[]
}

/** Unique countries with villa counts */
export async function getVillaCountries(): Promise<string[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('villas')
    .select('country')
    .eq('is_active', true)
    .order('country', { ascending: true })

  if (error) return []
  const countries = [...new Set((data as { country: string }[]).map(r => r.country))]
  return countries
}

/** Single villa by slug */
export async function getVilla(slug: string): Promise<Villa | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('villas')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as Villa
}
