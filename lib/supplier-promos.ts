import { createServiceClient } from '@/lib/supabase/service'

/**
 * supplier_promos DB row shape.
 * Table: supplier_promos
 * Managed by supplier admin (future feature).
 */
export interface SupplierPromo {
  id: string
  supplier_type: 'hotel_program' | 'cruise_line'
  supplier_slug: string          // matches hotel_program.slug or cruise_line.slug
  headline: string
  subheading?: string | null
  cta_label?: string | null
  cta_url?: string | null
  image_url?: string | null      // left image (landscape landscape)
  is_active: boolean
  starts_at?: string | null
  ends_at?: string | null
}

/**
 * Fetch the active promo for a given supplier
 * (latest by created_at, filtered to active + date-valid).
 */
export async function getSupplierPromo(
  supplierType: 'hotel_program' | 'cruise_line',
  supplierSlug: string
): Promise<SupplierPromo | null> {
  try {
    const supabase = createServiceClient()
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('supplier_promos')
      .select('*')
      .eq('supplier_type', supplierType)
      .eq('supplier_slug', supplierSlug)
      .eq('is_active', true)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      // Table may not exist yet — gracefully degrade
      console.warn('[PromoBanner] DB error:', error.message)
      return null
    }
    return data
  } catch {
    return null
  }
}

// ── Admin CRUD ──────────────────────────────────────────────────────────────

/** Field length constraints — keep in sync with the admin form. */
export const PROMO_LIMITS = {
  headline: 60,
  subheading: 220,
  cta_label: 24,
  cta_url: 200,
  image_url: 400,
} as const

export interface SupplierPromoInput {
  supplier_type: 'hotel_program' | 'cruise_line'
  supplier_slug: string
  headline: string
  subheading?: string | null
  cta_label?: string | null
  cta_url?: string | null
  image_url?: string | null
  is_active?: boolean
  starts_at?: string | null
  ends_at?: string | null
}

export async function listSupplierPromos(): Promise<SupplierPromo[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('supplier_promos')
    .select('*')
    .order('supplier_type', { ascending: true })
    .order('updated_at', { ascending: false })
  if (error) {
    console.warn('[supplier-promos] list error:', error.message)
    return []
  }
  return data ?? []
}

export async function getSupplierPromoById(id: string): Promise<SupplierPromo | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('supplier_promos')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) {
    console.warn('[supplier-promos] getById error:', error.message)
    return null
  }
  return data
}

export async function createSupplierPromo(input: SupplierPromoInput): Promise<SupplierPromo> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('supplier_promos')
    .insert(input)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateSupplierPromo(id: string, input: Partial<SupplierPromoInput>): Promise<SupplierPromo> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('supplier_promos')
    .update(input)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteSupplierPromo(id: string): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase.from('supplier_promos').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/** All targets (hotel programs + cruise lines) for the admin select. */
export interface SupplierTarget {
  type: 'hotel_program' | 'cruise_line'
  slug: string
  name: string
}

export async function getSupplierTargets(): Promise<SupplierTarget[]> {
  const { getHotelPrograms } = await import('./hotel-programs')
  const { getCruiseLines } = await import('./cruise-lines')
  const [programs, lines] = await Promise.all([getHotelPrograms(), getCruiseLines()])
  return [
    ...programs.map(p => ({ type: 'hotel_program' as const, slug: p.slug, name: p.name })),
    ...lines.map(l => ({ type: 'cruise_line' as const, slug: l.slug, name: l.name })),
  ]
}
