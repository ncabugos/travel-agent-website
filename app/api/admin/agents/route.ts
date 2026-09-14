import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'

export async function GET(request: Request) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { searchParams } = new URL(request.url)
  const fields = searchParams.get('fields') === 'minimal'
    ? 'id, agency_name, full_name'
    : '*'

  const { data, error } = await supabase
    .from('agents')
    .select(fields)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

const TIERS = ['starter', 'growth', 'custom'] as const
const TEMPLATES = ['frontend', 't2', 't3', 't4'] as const

/**
 * Invite an advisor. Creates the Supabase Auth user and sends the branded
 * invite email (docs/supabase-email-templates/invite.html, type=invite). The
 * on_auth_user_created trigger inserts the agents row with the same id, the
 * email, and the name/agency from user_metadata; tier and template are set
 * on that row afterwards. The invite link lands on
 * /api/agent-portal/auth-callback, which links auth_user_id and sends the
 * advisor into the onboarding wizard.
 */
export async function POST(request: Request) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const email = String(body?.email ?? '').trim().toLowerCase()
  const fullName = String(body?.full_name ?? '').trim()
  const agencyName = String(body?.agency_name ?? '').trim()
  const tier = TIERS.includes(body?.tier) ? body.tier : 'starter'
  const template = TEMPLATES.includes(body?.template) ? body.template : 'frontend'

  if (!email || !email.includes('@') || !fullName || !agencyName) {
    return NextResponse.json(
      { error: 'Full name, agency name, and a valid email are required.' },
      { status: 400 },
    )
  }

  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('agents')
    .select('id')
    .eq('email', email)
    .maybeSingle()
  if (existing) {
    return NextResponse.json(
      {
        error: 'An agent with this email already exists. They can request a sign-in link from the portal login page.',
        agentId: existing.id,
      },
      { status: 409 },
    )
  }

  const { origin } = new URL(request.url)
  const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName, agency_name: agencyName },
    redirectTo: `${origin}/api/agent-portal/auth-callback`,
  })
  if (inviteError || !invited.user) {
    console.error('admin/agents: invite failed', inviteError)
    return NextResponse.json(
      { error: inviteError?.message ?? 'Could not send the invitation.' },
      { status: inviteError?.status === 422 ? 409 : 500 },
    )
  }

  const { data: agent, error: updateError } = await supabase
    .from('agents')
    .update({ tier, template })
    .eq('id', invited.user.id)
    .select()
    .single()
  if (updateError) {
    console.error('admin/agents: invited but could not set tier/template', updateError)
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json(agent, { status: 201 })
}
