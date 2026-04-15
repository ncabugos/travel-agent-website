import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * Server-side helper to verify that the current request comes from a
 * signed-in super_admin. Returns the agent record on success, null
 * otherwise. Use inside API routes — the middleware already gates
 * /admin/* page routes, but /api/admin/* is NOT covered by the
 * middleware matcher, so each admin API route must call this itself.
 */
export async function getCurrentSuperAdmin(): Promise<
  | { id: string; email: string; role: string }
  | null
> {
  const auth = await createServerClient()
  const { data: { session } } = await auth.auth.getSession()
  if (!session?.user.email) return null

  const admin = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (admin.from('agents') as any)
    .select('id, email, role')
    .eq('email', session.user.email)
    .maybeSingle()

  if (!data || data.role !== 'super_admin') return null
  return data as { id: string; email: string; role: string }
}
