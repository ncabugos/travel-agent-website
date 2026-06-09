import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { updateHotelProgram, type HotelProgramUpdate } from '@/lib/hotel-programs'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'

/**
 * PUT /api/admin/hotel-programs/[programId]
 * Body: { logo_url?, logo_url_white?, logo_url_black?, tagline?, description? }
 *
 * Updates a single hotel program's logos + client-facing copy. hotel_programs
 * is the single source of truth, so a change here reflects across every tenant
 * site (demo + live). Service-role write, super-admin only.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ programId: string }> }
) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { programId } = await params
  const body = await request.json().catch(() => ({}))

  const fields: HotelProgramUpdate = {}
  for (const k of ['logo_url', 'logo_url_white', 'logo_url_black', 'tagline', 'description'] as const) {
    if (typeof body[k] === 'string') fields[k] = body[k]
  }
  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: 'No editable fields provided' }, { status: 400 })
  }

  try {
    await updateHotelProgram(programId, fields)
    // Program logos/copy render across many tenant routes — refresh broadly.
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Save failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
