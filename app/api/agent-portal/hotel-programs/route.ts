import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { replaceAgentHotelProgramSelections } from '@/lib/hotel-programs'

/**
 * POST /api/agent-portal/hotel-programs
 *
 * Replaces the authenticated agent's Hotel Programs selection list. The
 * agent_id is resolved from the session's email and never read from the
 * request body, so advisors cannot modify another agent's selections by
 * spoofing the payload.
 *
 * An empty programIds array clears the agent's curation, which causes the
 * public site to fall back to the full global active set.
 */
export async function POST(request: Request) {
  const auth = await createServerClient()
  const { data: { session } } = await auth.auth.getSession()
  if (!session?.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: agent } = await (admin.from('agents') as any)
    .select('id')
    .eq('email', session.user.email)
    .maybeSingle()

  if (!agent?.id) {
    return NextResponse.json(
      { error: 'No agent record linked to this email.' },
      { status: 403 }
    )
  }

  const body = await request.json().catch(() => ({}))
  if (!Array.isArray(body.programIds)) {
    return NextResponse.json(
      { error: 'programIds must be an array of program UUIDs' },
      { status: 400 }
    )
  }

  const ids = body.programIds
    .map((v: unknown) => (typeof v === 'string' ? v : ''))
    .filter(Boolean)

  try {
    await replaceAgentHotelProgramSelections(agent.id, ids, admin)
    return NextResponse.json({ ok: true, count: ids.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Save failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
