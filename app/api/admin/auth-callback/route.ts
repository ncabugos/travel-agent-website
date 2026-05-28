import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * Admin OAuth callback. Used by Google sign-in from /admin/login.
 *
 * 1. Exchanges the OAuth code for a Supabase Auth session.
 * 2. Verifies the signed-in user has the `super_admin` role in public.agents.
 * 3. If they do, redirects into /admin (or `?next=` target).
 *    If they don't, signs them back out and redirects to login with an error.
 *
 * NOTE: middleware also enforces the super_admin check on every /admin/*
 * request, so this is belt-and-braces — but doing it here gives a cleaner
 * error message than the silent middleware redirect.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=Missing_login_code`)
  }

  const supabase = await createServerClient()
  const { data: sessionData, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError || !sessionData.session) {
    console.error('admin auth-callback: exchange failed', exchangeError)
    return NextResponse.redirect(
      `${origin}/admin/login?error=Invalid_or_expired_login_link`
    )
  }

  const user = sessionData.session.user
  const email = user.email
  if (!email) {
    return NextResponse.redirect(`${origin}/admin/login?error=Session_missing_email`)
  }

  // Check super_admin role using service role (bypasses RLS)
  const admin = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: agent } = await (admin.from('agents') as any)
    .select('role')
    .eq('email', email)
    .maybeSingle()

  if (!agent || agent.role !== 'super_admin') {
    // Not an admin — sign them out and reject
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/admin/login?error=unauthorized`)
  }

  // Only allow same-origin `next` to avoid open-redirects
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/admin'
  return NextResponse.redirect(`${origin}${safeNext}`)
}
