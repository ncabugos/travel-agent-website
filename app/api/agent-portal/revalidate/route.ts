import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidateTenantSites } from '@/lib/revalidate-tenant-sites'

/**
 * POST /api/agent-portal/revalidate
 *
 * Clears the cached advisor sites after a save that runs in the browser
 * (the profile page writes `agents` with the browser client, so no server
 * code runs that could clear the cache). Signed-in users only.
 */
export async function POST() {
  const auth = await createServerClient()
  const { data: { session } } = await auth.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTenantSites()
  return NextResponse.json({ ok: true })
}
