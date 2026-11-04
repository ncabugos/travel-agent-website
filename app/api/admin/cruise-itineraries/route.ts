import { NextResponse } from 'next/server'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'
import { slugify } from '@/lib/cruise-itineraries'
import { revalidateCruiseSites } from '@/lib/revalidate-tenant-sites'

/**
 * POST /api/admin/cruise-itineraries
 * Body: { cruise_line_id, name, nights, route, blurb?, image_url?, collection_id?, source_url?, sort_order? }
 *
 * Adds an itinerary to the shared catalog. It appears on every advisor site
 * with cruise pages, except sites that opt out. Super-admin only.
 */
export async function POST(request: Request) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const nights = typeof body.nights === 'string' ? body.nights.trim() : ''
  const route = typeof body.route === 'string' ? body.route.trim() : ''
  if (typeof body.cruise_line_id !== 'string' || !name || !nights || !route) {
    return NextResponse.json({ error: 'Cruise line, name, nights and route are required.' }, { status: 400 })
  }

  const { error } = await createServiceClient().from('cruise_itineraries').insert({
    cruise_line_id: body.cruise_line_id,
    slug: slugify(name),
    name,
    nights,
    route,
    blurb: typeof body.blurb === 'string' ? body.blurb.trim() || null : null,
    image_url: typeof body.image_url === 'string' ? body.image_url.trim() || null : null,
    collection_id: typeof body.collection_id === 'string' && body.collection_id ? body.collection_id : null,
    source_url: typeof body.source_url === 'string' ? body.source_url.trim() || null : null,
    sort_order: Number.isFinite(body.sort_order) ? body.sort_order : 0,
  })
  if (error) {
    const message = error.code === '23505' ? 'This cruise line already has an itinerary with that name.' : error.message
    return NextResponse.json({ error: message }, { status: 400 })
  }

  revalidateCruiseSites()
  return NextResponse.json({ ok: true })
}
