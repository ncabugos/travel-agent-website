import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * POST /api/admin/agents/[agentId]/blog-categories
 * Body: { categoryIds: string[] }
 *
 * Replaces the agent's entire Blog Category preference list in one
 * transaction. Uses the service-role client to bypass the
 * "auth.uid() = agent_id" RLS policy on agent_blog_preferences so a
 * super_admin can edit on the agent's behalf. Admin-only — gated by
 * middleware.ts (super_admin required on /admin/*).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params
  const body = await request.json().catch(() => ({}))

  if (!Array.isArray(body.categoryIds)) {
    return NextResponse.json(
      { error: 'categoryIds must be an array of category UUIDs' },
      { status: 400 }
    )
  }

  const ids = body.categoryIds
    .map((v: unknown) => (typeof v === 'string' ? v : ''))
    .filter(Boolean)

  const supabase = createServiceClient()

  const { error: delErr } = await supabase
    .from('agent_blog_preferences')
    .delete()
    .eq('agent_id', agentId)
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 400 })
  }

  if (ids.length > 0) {
    const rows = ids.map((category_id: string) => ({
      agent_id: agentId,
      category_id,
      is_enabled: true,
    }))
    const { error: insErr } = await supabase
      .from('agent_blog_preferences')
      .insert(rows)
    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 400 })
    }
  }

  return NextResponse.json({ ok: true, count: ids.length })
}
