import { NextResponse } from 'next/server'
import { replaceAgentHotelProgramSelections } from '@/lib/hotel-programs'

/**
 * POST /api/admin/agents/[agentId]/hotel-programs
 * Body: { programIds: string[] }
 *
 * Replaces the agent's entire Hotel Programs selection list. Uses
 * service-role client via replaceAgentHotelProgramSelections(). Admin-only
 * — gated by middleware.ts (super_admin required on /admin/*).
 *
 * An empty programIds array clears the agent's selections, which causes the
 * public site to fall back to the global active set.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params
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
    await replaceAgentHotelProgramSelections(agentId, ids)
    return NextResponse.json({ ok: true, count: ids.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Save failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
