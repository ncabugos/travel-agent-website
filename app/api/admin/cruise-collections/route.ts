import { NextResponse } from 'next/server'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'
import { slugify } from '@/lib/cruise-itineraries'
import { revalidateCruiseSites } from '@/lib/revalidate-tenant-sites'

/**
 * POST /api/admin/cruise-collections
 * Body: { name, intro?, hero_image_url?, sort_order? }
 *
 * Adds a themed collection of itineraries, with its own page on every advisor
 * site with cruise pages once it has itineraries. Super-admin only.
 */
export async function POST(request: Request) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  }

  const { error } = await createServiceClient().from('cruise_collections').insert({
    slug: slugify(name),
    name,
    intro: typeof body.intro === 'string' ? body.intro.trim() || null : null,
    hero_image_url: typeof body.hero_image_url === 'string' ? body.hero_image_url.trim() || null : null,
    sort_order: Number.isFinite(body.sort_order) ? body.sort_order : 0,
  })
  if (error) {
    const message = error.code === '23505' ? 'A collection with that name already exists.' : error.message
    return NextResponse.json({ error: message }, { status: 400 })
  }

  revalidateCruiseSites()
  return NextResponse.json({ ok: true })
}
