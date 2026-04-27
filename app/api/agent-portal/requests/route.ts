import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const supabaseAuth = await createServerClient()
  const { data: { session } } = await supabaseAuth.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseService = createServiceClient()
  const { data: agentRaw } = await supabaseService
    .from('agents')
    .select('id')
    .eq('email', session.user.email ?? '')
    .single()
  const agent = agentRaw as { id: string } | null
  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  const { data: requests, error } = await supabaseService
    .from('edit_requests')
    .select('id, subject, status, admin_notes, created_at, updated_at')
    .eq('agent_id', agent.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(requests)
}

export async function POST(request: Request) {
  const { subject, description } = await request.json()

  // Get authenticated user
  const supabaseAuth = await createServerClient()
  const { data: { session } } = await supabaseAuth.auth.getSession()

  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Find corresponding agent
  const supabaseService = createServiceClient()
  const { data: agentRaw } = await supabaseService
    .from('agents')
    .select('*')
    .eq('email', session.user.email ?? '')
    .single()
  const agent = agentRaw as { id: string } | null

  if (!agent) return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 })

  // Insert request
  const { error } = await supabaseService.from('edit_requests').insert({
    agent_id: agent.id,
    subject,
    description
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true })
}
