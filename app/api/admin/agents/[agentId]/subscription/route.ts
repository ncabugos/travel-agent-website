import { NextResponse } from 'next/server'
import { stripe, TIER_PRICES, type TierName } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'

/**
 * PATCH /api/admin/agents/[agentId]/subscription
 * Body: { tier: 'starter' | 'growth' | 'custom' }
 *
 * Swaps the subscription's monthly price to the new tier with prorations.
 * Also updates the local agents.tier column so the UI stays in sync; the
 * Stripe webhook will normally reconcile this on customer.subscription.updated
 * but we set it eagerly so admin changes feel instant.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { agentId } = await params
  const body = (await request.json()) as { tier?: string }
  const tier = body.tier as TierName | undefined

  if (!tier || !(tier in TIER_PRICES)) {
    return NextResponse.json(
      { error: 'Invalid or missing tier. Expected starter | growth | custom.' },
      { status: 400 }
    )
  }

  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: agent } = await (supabase.from('agents') as any)
    .select('id, stripe_subscription_id, tier')
    .eq('id', agentId)
    .maybeSingle()

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }
  if (!agent.stripe_subscription_id) {
    return NextResponse.json(
      { error: 'Agent has no Stripe subscription to modify' },
      { status: 400 }
    )
  }

  try {
    const sub = await stripe.subscriptions.retrieve(agent.stripe_subscription_id)
    const item = sub.items.data[0]
    if (!item) {
      return NextResponse.json(
        { error: 'Subscription has no items — cannot determine which price to swap' },
        { status: 500 }
      )
    }

    const newPriceId = TIER_PRICES[tier].monthly
    const updated = await stripe.subscriptions.update(
      agent.stripe_subscription_id,
      {
        items: [{ id: item.id, price: newPriceId }],
        proration_behavior: 'create_prorations',
        metadata: {
          ...(sub.metadata ?? {}),
          tier,
          changed_by: adminUser.email,
          changed_at: new Date().toISOString(),
        },
      }
    )

    // Update the local cache so the admin UI feels instant.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('agents') as any)
      .update({ tier })
      .eq('id', agentId)

    return NextResponse.json({
      ok: true,
      tier,
      subscription: {
        id: updated.id,
        status: updated.status,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        current_period_end: (updated as any).current_period_end ?? null,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Stripe error'
    console.error('change-tier failed', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/agents/[agentId]/subscription
 * Body: { mode?: 'period_end' | 'immediate' }
 *
 * Default mode is 'period_end' (soft cancel — subscription continues
 * running until the end of the current paid period, then auto-cancels).
 * 'immediate' cancels right away with no refund.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { agentId } = await params
  let mode: 'period_end' | 'immediate' = 'period_end'
  try {
    const body = (await request.json()) as { mode?: string }
    if (body.mode === 'immediate') mode = 'immediate'
  } catch {
    // Body is optional — default to period_end
  }

  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: agent } = await (supabase.from('agents') as any)
    .select('id, stripe_subscription_id')
    .eq('id', agentId)
    .maybeSingle()

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }
  if (!agent.stripe_subscription_id) {
    return NextResponse.json(
      { error: 'Agent has no Stripe subscription to cancel' },
      { status: 400 }
    )
  }

  try {
    if (mode === 'immediate') {
      await stripe.subscriptions.cancel(agent.stripe_subscription_id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('agents') as any)
        .update({ subscription_status: 'canceled' })
        .eq('id', agentId)
    } else {
      await stripe.subscriptions.update(agent.stripe_subscription_id, {
        cancel_at_period_end: true,
        metadata: {
          canceled_by: adminUser.email,
          canceled_at: new Date().toISOString(),
        },
      })
      // We don't flip subscription_status here — Stripe will do that
      // via the webhook when the period actually ends.
    }

    return NextResponse.json({ ok: true, mode })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Stripe error'
    console.error('cancel-subscription failed', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
