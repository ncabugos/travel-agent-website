import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Check all agents
  const { data: agents, error } = await serviceClient
    .from('agents')
    .select('id, email, auth_user_id, role, full_name')

  // Check all columns on agents table
  const { data: columns } = await serviceClient.rpc('get_columns', {}).maybeSingle()

  return NextResponse.json({
    agents,
    error: error?.message,
    agentCount: agents?.length,
  })
}
