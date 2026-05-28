import { NextResponse } from 'next/server'
import {
  createSupplierPromo,
  listSupplierPromos,
  PROMO_LIMITS,
  type SupplierPromoInput,
} from '@/lib/supplier-promos'

export async function GET() {
  const promos = await listSupplierPromos()
  return NextResponse.json({ promos })
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<SupplierPromoInput>

  const validation = validatePromoInput(body)
  if (validation) return NextResponse.json({ error: validation }, { status: 400 })

  try {
    const promo = await createSupplierPromo(body as SupplierPromoInput)
    return NextResponse.json(promo, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create promo'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

function validatePromoInput(body: Partial<SupplierPromoInput>): string | null {
  if (body.supplier_type !== 'hotel_program' && body.supplier_type !== 'cruise_line') {
    return 'supplier_type must be hotel_program or cruise_line'
  }
  if (!body.supplier_slug || typeof body.supplier_slug !== 'string') {
    return 'supplier_slug is required'
  }
  if (!body.headline || typeof body.headline !== 'string') {
    return 'headline is required'
  }
  if (body.headline.length > PROMO_LIMITS.headline) {
    return `headline must be ${PROMO_LIMITS.headline} characters or fewer`
  }
  if (body.subheading && body.subheading.length > PROMO_LIMITS.subheading) {
    return `subheading must be ${PROMO_LIMITS.subheading} characters or fewer`
  }
  if (body.cta_label && body.cta_label.length > PROMO_LIMITS.cta_label) {
    return `cta_label must be ${PROMO_LIMITS.cta_label} characters or fewer`
  }
  if (body.cta_url && body.cta_url.length > PROMO_LIMITS.cta_url) {
    return `cta_url must be ${PROMO_LIMITS.cta_url} characters or fewer`
  }
  return null
}
