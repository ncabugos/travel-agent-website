import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { updateCruiseLine, type CruiseLineUpdate } from '@/lib/cruise-lines'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'

/**
 * PUT /api/admin/cruise-lines/[id]
 * Body: { logo_url?, logo_url_white?, logo_url_black?, tagline?, description?, hero_image_url? }
 *
 * Updates a single cruise line's logos + client-facing copy. cruise_lines is
 * the single source of truth, so a change here reflects across every tenant
 * site. Service-role write, super-admin only.
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

  const fields: CruiseLineUpdate = {}
  for (const k of ['logo_url', 'logo_url_white', 'logo_url_black', 'tagline', 'description', 'hero_image_url'] as const) {
    if (typeof body[k] === 'string') fields[k] = body[k]
  }
  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: 'No editable fields provided' }, { status: 400 })
  }

  try {
    await updateCruiseLine(id, fields)
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Save failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
