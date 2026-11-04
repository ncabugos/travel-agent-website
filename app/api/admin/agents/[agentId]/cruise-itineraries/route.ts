import { NextResponse } from 'next/server'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'
import { setAgentEnabledItineraries } from '@/lib/cruise-itineraries'
import { revalidateCruiseSites } from '@/lib/revalidate-tenant-sites'

/**
 * POST /api/admin/agents/[agentId]/cruise-itineraries
 * Body: { itineraryIds: string[] }, the itineraries this site keeps showing.
 *
 * Active itineraries left out of the list become opt-outs. Super-admin only.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { agentId } = await params
  const body = await request.json().catch(() => ({}))
  if (!Array.isArray(body.itineraryIds)) {
    return NextResponse.json({ error: 'itineraryIds must be an array of itinerary UUIDs' }, { status: 400 })
  }

  try {
    await setAgentEnabledItineraries(agentId, body.itineraryIds.filter((v: unknown) => typeof v === 'string'))
    revalidateCruiseSites()
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Save failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
