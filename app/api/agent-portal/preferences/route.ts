import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * POST /api/agent-portal/preferences
 *
 * Replaces the authenticated agent's blog category subscriptions with the
 * provided categoryIds array. The agent_id is derived from the session,
 * NEVER from the request body, so advisors cannot modify each other's
 * preferences by spoofing the payload.
 */
export async function POST(request: Request) {
  const auth = await createServerClient()
  const { data: { session } } = await auth.auth.getSession()
  if (!session?.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createServiceClient()

  // Resolve the current agent from the session email.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: agent } = await (admin.from('agents') as any)
    .select('id')
    .eq('email', session.user.email)
    .maybeSingle()

  if (!agent) {
    return NextResponse.json(
      { error: 'No agent record linked to this email.' },
      { status: 403 }
    )
  }

  const { categoryIds } = (await request.json()) as { categoryIds?: string[] }
  const ids = Array.isArray(categoryIds) ? categoryIds.filter((v) => typeof v === 'string') : []

  // Replace the set of preferences for this agent.
  const { error: delError } = await admin
    .from('agent_blog_preferences')
    .delete()
    .eq('agent_id', agent.id)

  if (delError) {
    return NextResponse.json({ error: delError.message }, { status: 500 })
  }

  if (ids.length > 0) {
    const payload = ids.map((id) => ({
      agent_id: agent.id,
      category_id: id,
      is_enabled: true,
    }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin.from('agent_blog_preferences') as any).insert(payload)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true, count: ids.length })
}
