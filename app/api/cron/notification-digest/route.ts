import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * Daily safety net for operator notifications (scheduled in vercel.json).
 *
 * Emails one digest of every consultation, edit request, and admin event from
 * the last 26 hours, so a dropped individual notification can never lose a
 * lead. The window overlaps by 2h because Vercel fires daily crons anywhere in
 * the scheduled hour. Sends nothing when the window is empty.
 *
 * Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const since = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()

  // Stalled onboarding is not limited to the 26h window: it repeats daily
  // until the advisor finishes, capped at 60 days so old test rows drop off.
  const stalledSince = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()

  const [consultationsRes, editRequestsRes, adminEventsRes, stalledRes] = await Promise.all([
    supabase
      .from('consultation_requests')
      .select('first_name, last_name, email, source, tier, timeline, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: true }),
    supabase
      .from('edit_requests')
      .select('subject, created_at, agents(agency_name)')
      .gte('created_at', since)
      .order('created_at', { ascending: true }),
    supabase
      .from('admin_notifications')
      .select('title, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: true }),
    supabase
      .from('agents')
      .select('full_name, email, subscription_status, created_at')
      .eq('role', 'agent')
      .is('onboarding_completed_at', null)
      .gte('created_at', stalledSince)
      .order('created_at', { ascending: true }),
  ])

  for (const [name, res] of [
    ['consultation_requests', consultationsRes],
    ['edit_requests', editRequestsRes],
    ['admin_notifications', adminEventsRes],
    ['agents (stalled onboarding)', stalledRes],
  ] as const) {
    if (res.error) console.error(`[digest] ${name} query failed`, res.error)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const consultations = ((consultationsRes.data as any[] | null) ?? []).map((c) => ({
    name: `${c.first_name} ${c.last_name}`.trim(),
    email: c.email,
    source: c.source,
    tier: c.tier,
    timeline: c.timeline,
    createdAt: c.created_at,
  }))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editRequests = ((editRequestsRes.data as any[] | null) ?? []).map((r) => ({
    agencyName: r.agents?.agency_name ?? 'Unknown advisor',
    subject: r.subject,
    createdAt: r.created_at,
  }))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminEvents = ((adminEventsRes.data as any[] | null) ?? []).map((e) => ({
    title: e.title,
    createdAt: e.created_at,
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stalledOnboarding = ((stalledRes.data as any[] | null) ?? []).map((a) => ({
    name: a.full_name ?? a.email,
    email: a.email ?? '',
    status: a.subscription_status ?? 'unknown',
    createdAt: a.created_at,
  }))

  const counts = {
    consultations: consultations.length,
    editRequests: editRequests.length,
    adminEvents: adminEvents.length,
    stalledOnboarding: stalledOnboarding.length,
  }

  if (counts.consultations + counts.editRequests + counts.adminEvents + counts.stalledOnboarding === 0) {
    console.info('[digest] nothing in the last 26h, no email sent')
    return NextResponse.json({ sent: false, counts })
  }

  try {
    const { sendDailyDigest } = await import('@/lib/email')
    const sent = await sendDailyDigest({ consultations, editRequests, adminEvents, stalledOnboarding })
    console.info('[digest] admin notification sent', sent?.id)
    return NextResponse.json({ sent: true, counts })
  } catch (emailErr) {
    console.error('[digest] admin notification email failed', emailErr)
    return NextResponse.json({ sent: false, counts, error: 'send failed' }, { status: 500 })
  }
}
