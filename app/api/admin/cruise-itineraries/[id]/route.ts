import { NextResponse } from 'next/server'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidateCruiseSites } from '@/lib/revalidate-tenant-sites'

/**
 * PUT /api/admin/cruise-itineraries/[id]
 * Body: { name?, nights?, route?, blurb?, image_url?, collection_id?, source_url?, sort_order?, is_active?,
 *         overview?, highlights?, region?, countries?, days_direction?, days?, departures_note? }
 *
 * Edits one itinerary across every advisor site. The slug stays put so a rename
 * keeps the record's identity. Super-admin only.
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

  for (const k of ['name', 'nights', 'route'] as const) {
    if (body[k] === undefined) continue
    const value = typeof body[k] === 'string' ? body[k].trim() : ''
    if (!value) return NextResponse.json({ error: 'Name, nights and route are required.' }, { status: 400 })
    fields[k] = value
  }
  for (const k of ['blurb', 'image_url', 'source_url', 'collection_id', 'overview', 'region', 'countries', 'days_direction', 'departures_note'] as const) {
    if (typeof body[k] === 'string') fields[k] = body[k].trim() || null
  }
  if (Array.isArray(body.highlights)) {
    fields.highlights = body.highlights.map(String).map((s: string) => s.trim()).filter(Boolean).slice(0, 3)
  }
  if (Array.isArray(body.days)) {
    fields.days = body.days
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((day: any) => ({
        place: String(day?.place ?? '').trim(),
        title: String(day?.title ?? '').trim(),
        summary: String(day?.summary ?? '').trim(),
        excursions: Array.isArray(day?.excursions) ? day.excursions.map(String).map((s: string) => s.trim()).filter(Boolean) : [],
      }))
      .filter((day: { place: string }) => day.place)
  }
  if (Number.isFinite(body.sort_order)) fields.sort_order = body.sort_order
  if (typeof body.is_active === 'boolean') fields.is_active = body.is_active

  const { error } = await createServiceClient().from('cruise_itineraries').update(fields).eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  revalidateCruiseSites()
  return NextResponse.json({ ok: true })
}
