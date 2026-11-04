import { NextResponse } from 'next/server'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidateCruiseSites } from '@/lib/revalidate-tenant-sites'

/**
 * PUT /api/admin/cruise-collections/[id]
 * Body: { name?, intro?, hero_image_url?, sort_order?, is_active? }
 *
 * Edits one collection across every advisor site. The slug stays put so its
 * page URL survives a rename. Super-admin only.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const fields: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.name !== undefined) {
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    fields.name = name
  }
  for (const k of ['intro', 'hero_image_url'] as const) {
    if (typeof body[k] === 'string') fields[k] = body[k].trim() || null
  }
  if (Number.isFinite(body.sort_order)) fields.sort_order = body.sort_order
  if (typeof body.is_active === 'boolean') fields.is_active = body.is_active

  const { error } = await createServiceClient().from('cruise_collections').update(fields).eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  revalidateCruiseSites()
  return NextResponse.json({ ok: true })
}
