import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { setAgentEnabledItineraries } from '@/lib/cruise-itineraries'
import { revalidateCruiseSites } from '@/lib/revalidate-tenant-sites'

/**
 * POST /api/agent-portal/cruise-itineraries
 * Body: { itineraryIds: string[] }, the itineraries this site keeps showing.
 *
 * Active itineraries left out of the list become opt-outs. The agent_id comes
 * from the session's email, never the request body, so advisors cannot change
 * another site's choices.
 */
export async function POST(request: Request) {
  const auth = await createServerClient()
  const { data: { session } } = await auth.auth.getSession()
  if (!session?.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: agent } = await (createServiceClient().from('agents') as any)
    .select('id')
    .eq('email', session.user.email)
    .maybeSingle()

  if (!agent?.id) {
    return NextResponse.json({ error: 'No agent record linked to this email.' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  if (!Array.isArray(body.itineraryIds)) {
    return NextResponse.json({ error: 'itineraryIds must be an array of itinerary UUIDs' }, { status: 400 })
  }

  try {
    await setAgentEnabledItineraries(agent.id, body.itineraryIds.filter((v: unknown) => typeof v === 'string'))
    revalidateCruiseSites()
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Save failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
