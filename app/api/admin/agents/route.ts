import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(request: Request) {
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
