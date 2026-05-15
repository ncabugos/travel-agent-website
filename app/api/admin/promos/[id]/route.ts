import { NextResponse } from 'next/server'
import {
  deleteSupplierPromo,
  getSupplierPromoById,
  PROMO_LIMITS,
  updateSupplierPromo,
  type SupplierPromoInput,
} from '@/lib/supplier-promos'

interface Ctx {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params
  const promo = await getSupplierPromoById(id)
  if (!promo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(promo)
}

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params
  const body = (await request.json()) as Partial<SupplierPromoInput>

  // Same validation rules as POST, but allow partial updates.
  if (body.headline !== undefined) {
    if (!body.headline) return NextResponse.json({ error: 'headline cannot be empty' }, { status: 400 })
    if (body.headline.length > PROMO_LIMITS.headline) {
      return NextResponse.json({ error: `headline must be ${PROMO_LIMITS.headline} characters or fewer` }, { status: 400 })
    }
  }
  if (body.subheading && body.subheading.length > PROMO_LIMITS.subheading) {
    return NextResponse.json({ error: `subheading must be ${PROMO_LIMITS.subheading} characters or fewer` }, { status: 400 })
  }
  if (body.cta_label && body.cta_label.length > PROMO_LIMITS.cta_label) {
    return NextResponse.json({ error: `cta_label must be ${PROMO_LIMITS.cta_label} characters or fewer` }, { status: 400 })
  }
  if (body.cta_url && body.cta_url.length > PROMO_LIMITS.cta_url) {
    return NextResponse.json({ error: `cta_url must be ${PROMO_LIMITS.cta_url} characters or fewer` }, { status: 400 })
  }

  try {
    const promo = await updateSupplierPromo(id, body)
    return NextResponse.json(promo)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update promo'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params
  try {
    await deleteSupplierPromo(id)
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete promo'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
