import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * Magic-link callback.
 *
 * 1. Exchanges the OTP code for a Supabase Auth session (sets cookies).
 * 2. Links the newly-authenticated auth.users.id to the agents row matched
 *    by email. This is the point at which a customer who completed Stripe
 *    checkout (which creates agents.email + stripe_* but no auth_user_id)
 *    first becomes tied to their Supabase Auth user. Subsequent logins
 *    skip the link step because auth_user_id is already set.
 * 3. Redirects into the portal; onboarding page handles new-agent flow.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/agent-portal'

  if (!code) {
    return NextResponse.redirect(
      `${origin}/agent-portal/login?error=Missing_login_code`
    )
  }

  // 1. Exchange the code for a session
  const supabase = await createServerClient()
  const { data: sessionData, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError || !sessionData.session) {
    console.error('auth-callback: exchange failed', exchangeError)
    return NextResponse.redirect(
      `${origin}/agent-portal/login?error=Invalid_or_expired_login_link`
    )
  }

  const user = sessionData.session.user
  const email = user.email

  if (!email) {
    console.error('auth-callback: session user has no email', { userId: user.id })
    return NextResponse.redirect(
      `${origin}/agent-portal/login?error=Session_missing_email`
    )
  }

  // 2. Link auth_user_id on the agents row (service role, bypasses RLS)
  //    Only update when the link is missing, so an admin rotating sessions
  //    cannot accidentally overwrite someone else's link via email collision.
  try {
    const admin = createServiceClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: agent, error: lookupError } = await (admin
      .from('agents') as any)
      .select('id, auth_user_id')
      .eq('email', email)
      .maybeSingle()

    if (lookupError) {
      console.error('auth-callback: agent lookup failed', lookupError)
      // Non-fatal — still let them into the portal; /agent-portal will show
      // the "no agent linked to this email" state.
    } else if (!agent) {
      console.warn(
        `auth-callback: no agent row for ${email} — user signed in but has no linked record`
      )
    } else if (!agent.auth_user_id) {
      // First login — link it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (admin
        .from('agents') as any)
        .update({ auth_user_id: user.id })
        .eq('id', agent.id)
        .is('auth_user_id', null) // guard against a race

      if (updateError) {
        console.error('auth-callback: failed to link auth_user_id', updateError)
      } else {
        console.log(
          `auth-callback: linked agent ${agent.id} to auth user ${user.id}`
        )
      }
    } else if (agent.auth_user_id !== user.id) {
      // Existing link points to a different auth user — this should never
      // happen in practice (Supabase de-duplicates auth.users by email),
      // but log it so we notice if it ever does.
      console.error(
        `auth-callback: email ${email} already linked to a different auth user (agent.auth_user_id=${agent.auth_user_id}, session=${user.id})`
      )
    }
  } catch (err) {
    console.error('auth-callback: unexpected linking error', err)
    // Non-fatal — still redirect to portal.
  }

  // 3. Redirect into the portal (or to the `?next=` target if provided)
  //    Only allow same-origin `next` values to avoid open-redirects.
  const safeNext = next.startsWith('/') && !next.startsWith('//')
    ? next
    : '/agent-portal'
  return NextResponse.redirect(`${origin}${safeNext}`)
}
