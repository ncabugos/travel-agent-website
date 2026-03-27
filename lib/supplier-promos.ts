import Image from 'next/image'
import Link from 'next/link'
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
