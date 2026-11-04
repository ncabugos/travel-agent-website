import { NextResponse } from 'next/server'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidateCruiseSites } from '@/lib/revalidate-tenant-sites'

/**
 * PUT /api/admin/cruise-lines/[id]/included
 * Body: { included: { title, items: string[] }[] }
 *
 * Sets what a line's fare includes, shown on its itinerary pages. Super-admin only.
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
  if (!Array.isArray(body.included)) {
    return NextResponse.json({ error: 'A list of groups is required.' }, { status: 400 })
  }

  const included = body.included
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((group: any) => ({
      title: String(group?.title ?? '').trim(),
      items: Array.isArray(group?.items) ? group.items.map(String).map((s: string) => s.trim()).filter(Boolean) : [],
    }))
    .filter((group: { title: string; items: string[] }) => group.title && group.items.length > 0)

  const { error } = await createServiceClient().from('cruise_lines').update({ included }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  revalidateCruiseSites()
  return NextResponse.json({ ok: true })
}
