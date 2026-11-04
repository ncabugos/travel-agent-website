import { NextResponse } from 'next/server'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidateCruiseSites } from '@/lib/revalidate-tenant-sites'

/**
 * PUT /api/admin/cruise-itineraries/[id]/departures
 * Body: { departures: { departs_on, embark, disembark, ship? }[] }
 *
 * Replaces one itinerary's sailing dates. Super-admin only.
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
  if (!Array.isArray(body.departures)) {
    return NextResponse.json({ error: 'A list of sailings is required.' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = body.departures.map((row: any) => ({
    itinerary_id: id,
    departs_on: String(row?.departs_on ?? '').trim(),
    embark: String(row?.embark ?? '').trim(),
    disembark: String(row?.disembark ?? '').trim(),
    ship: String(row?.ship ?? '').trim() || null,
  }))
  const invalid = rows.find(
    (row: { departs_on: string; embark: string; disembark: string }) =>
      !/^\d{4}-\d{2}-\d{2}$/.test(row.departs_on) || !row.embark || !row.disembark,
  )
  if (invalid) {
    return NextResponse.json({ error: `Check this sailing: ${invalid.departs_on || 'missing date'}. Use YYYY-MM-DD | from | to | ship.` }, { status: 400 })
  }

  const sb = createServiceClient()
  // Read the current rows first so a failed insert can put them back.
  const { data: previous, error: readError } = await sb
    .from('cruise_itinerary_departures')
    .select('itinerary_id, departs_on, embark, disembark, ship')
    .eq('itinerary_id', id)
  if (readError) return NextResponse.json({ error: readError.message }, { status: 400 })

  const { error: deleteError } = await sb.from('cruise_itinerary_departures').delete().eq('itinerary_id', id)
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 })

  if (rows.length > 0) {
    const { error: insertError } = await sb.from('cruise_itinerary_departures').insert(rows)
    if (insertError) {
      if (previous?.length) await sb.from('cruise_itinerary_departures').insert(previous)
      const message = insertError.code === '23505' ? 'The same sailing is listed twice.' : insertError.message
      return NextResponse.json({ error: message }, { status: 400 })
    }
  }

  revalidateCruiseSites()
  return NextResponse.json({ ok: true })
}
