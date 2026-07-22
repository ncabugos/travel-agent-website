import { NextResponse } from 'next/server'
import { stripe, moduleKeyForPrice } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import type Stripe from 'stripe'

/**
 * Reconcile agent_modules (+ the agents.active_modules cache) from the
 * subscription's current items. Stripe is the source of truth for module
 * billing: any item whose price maps to a module key becomes/stays active,
 * and any active module row without a matching item is canceled. Prices that
 * don't map to a module (the base plan, legacy tiers) are ignored.
 */
async function reconcileModulesFromSubscription(
  supabase: ReturnType<typeof createServiceClient>,
  agentId: string,
  subscription: Stripe.Subscription,
) {
  const now = new Date().toISOString()
  const itemsByModule = new Map<string, Stripe.SubscriptionItem>()
  for (const item of subscription.items.data) {
    const key = moduleKeyForPrice(item.price.id)
    if (key) itemsByModule.set(key, item)
  }

  const { data: rowsRaw } = await supabase
    .from('agent_modules')
    .select('id, module_key, status')
    .eq('agent_id', agentId)
  const rows = (rowsRaw as { id: string; module_key: string; status: string }[] | null) ?? []
  const rowByKey = new Map(rows.map((r) => [r.module_key, r]))

  for (const [key, item] of itemsByModule) {
    const existing = rowByKey.get(key)
    if (existing?.status === 'active') continue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('agent_modules') as any).upsert(
      {
        agent_id: agentId,
        module_key: key,
        status: 'active',
        stripe_subscription_item_id: item.id,
        stripe_price_id: item.price.id,
        activated_at: now,
        canceled_at: null,
        updated_at: now,
      },
      { onConflict: 'agent_id,module_key' },
    )
  }

  for (const row of rows) {
    if (row.status === 'active' && !itemsByModule.has(row.module_key)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('agent_modules') as any)
        .update({ status: 'canceled', canceled_at: now, updated_at: now })
        .eq('id', row.id)
    }
  }

  const activeKeys = [...itemsByModule.keys()]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('agents') as any)
    .update({ active_modules: activeKeys })
    .eq('id', agentId)
}

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  // Never trust an unsigned body. Without the signing secret + signature header
  // we cannot prove the event came from Stripe, so we refuse to process it —
  // otherwise anyone could POST a forged "payment succeeded" / tier-upgrade.
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set — refusing to process webhook')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  switch (event.type) {
    // ── Checkout completed — create or update agent ─────────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const email = session.customer_details?.email ?? session.customer_email
      const customerName = session.customer_details?.name
      const tier = (session.metadata?.tier ?? 'starter') as string
      const stripeCustomerId = session.customer as string
      const stripeSubscriptionId = session.subscription as string

      // Founding-cohort metadata is mirrored onto the session by the founding
      // checkout (app/api/stripe/checkout/route.ts). Standard checkouts have no
      // plan/cohort, so they fall back to the 'standard' default.
      const plan = session.metadata?.plan === 'founding' ? 'founding' : 'standard'
      const betaCohort = session.metadata?.cohort ?? null
      // Founding subscriptions and trialed standard checkouts (the public base
      // plan mirrors trial: '30d' onto the session) start in a 30-day trial;
      // everything else is active immediately. customer.subscription.updated
      // keeps status in sync afterward (e.g. when the trial converts on day 30).
      const subscriptionStatus =
        plan === 'founding' || session.metadata?.trial === '30d' ? 'trialing' : 'active'

      if (!email) {
        console.error('Checkout completed but no email found')
        break
      }

      // Check if agent already exists
      const { data: existing } = await supabase
        .from('agents')
        .select('id')
        .eq('email', email)
        .single()

      if (existing) {
        // Update existing agent with Stripe IDs, tier, and plan/cohort
        await supabase
          .from('agents')
          .update({
            tier,
            plan,
            beta_cohort: betaCohort,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            subscription_status: subscriptionStatus,
          })
          .eq('id', existing.id)

        console.log(`Updated agent ${existing.id} with Stripe subscription (plan=${plan})`)
      } else {
        // Create new agent record
        const { data: newAgent, error } = await supabase
          .from('agents')
          .insert({
            email,
            full_name: customerName ?? email.split('@')[0],
            agency_name: customerName ? `${customerName}'s Agency` : 'My Agency',
            tier,
            plan,
            beta_cohort: betaCohort,
            template: tier === 'starter' ? 'frontend' : 't2',
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            subscription_status: subscriptionStatus,
            role: 'agent',
          })
          .select('id')
          .single()

        if (error) {
          console.error('Failed to create agent:', error)
        } else {
          console.log(`Created new agent ${newAgent.id} for ${email} (plan=${plan})`)

          // Notify admin
          const planLabel = plan === 'founding'
            ? `founding ${tier} (${betaCohort})`
            : tier
          await supabase
            .from('admin_notifications')
            .insert({
              type: 'new_signup',
              title: `New ${planLabel} signup: ${email}`,
              body: `${customerName || email} just signed up for the ${planLabel} plan via Stripe.`,
              metadata: {
                agent_id: newAgent.id,
                email,
                tier,
                plan,
                beta_cohort: betaCohort,
                stripe_customer_id: stripeCustomerId,
              },
            })
        }
      }
      break
    }

    // ── Subscription updated (upgrade/downgrade, payment method change) ──
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const status = subscription.status

      // Map Stripe status to our status
      const mappedStatus = status === 'active' ? 'active'
        : status === 'past_due' ? 'past_due'
        : status === 'canceled' ? 'canceled'
        : status === 'trialing' ? 'trialing'
        : 'inactive'

      await supabase
        .from('agents')
        .update({ subscription_status: mappedStatus })
        .eq('stripe_customer_id', customerId)

      // Keep module entitlements in lockstep with the subscription's items
      // (covers portal add/remove, admin edits in the Stripe dashboard, and
      // items dropped by dunning-driven subscription changes).
      const { data: agentRow } = await supabase
        .from('agents')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle()
      if (agentRow) {
        await reconcileModulesFromSubscription(
          supabase,
          (agentRow as { id: string }).id,
          subscription,
        )
      }

      console.log(`Subscription ${subscription.id} status updated to ${mappedStatus}`)
      break
    }

    // ── Subscription cancelled ──────────────────────────────────────
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabase
        .from('agents')
        .update({ subscription_status: 'canceled' })
        .eq('stripe_customer_id', customerId)

      // Notify admin
      const { data: agent } = await supabase
        .from('agents')
        .select('id, email, agency_name')
        .eq('stripe_customer_id', customerId)
        .single()

      // The subscription is gone — all module entitlements go with it.
      if (agent) {
        const now = new Date().toISOString()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('agent_modules') as any)
          .update({ status: 'canceled', canceled_at: now, updated_at: now })
          .eq('agent_id', (agent as any).id)
          .eq('status', 'active')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('agents') as any)
          .update({ active_modules: [] })
          .eq('id', (agent as any).id)
      }

      if (agent) {
        await supabase
          .from('admin_notifications')
          .insert({
            type: 'subscription_canceled',
            title: `Subscription canceled: ${(agent as any).agency_name}`,
            body: `${(agent as any).email} has canceled their subscription.`,
            metadata: { agent_id: (agent as any).id },
          })
      }

      console.log(`Subscription canceled for customer ${customerId}`)
      break
    }

    // ── Trial ending soon (~3 days out) — founding 30-day trial ─────
    case 'customer.subscription.trial_will_end': {
      const subscription = event.data.object as Stripe.Subscription
      const plan = subscription.metadata?.plan ?? 'standard'
      const cohort = subscription.metadata?.cohort ?? null
      const trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : 'unknown'

      // Stripe fires this ~3 days before the 30-day founding trial converts to
      // the locked founding rate.
      // TODO: send the courtesy "your founding rate begins in 3 days" email via
      // lib/email.ts once the Resend template is wired (Build Kit Part A).
      console.log(
        `Trial will end for subscription ${subscription.id} (customer ${subscription.customer}) — plan=${plan}, cohort=${cohort}, trial_end=${trialEnd}`,
      )
      break
    }

    default:
      // Unhandled event type — log and ignore
      console.log(`Unhandled Stripe event: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
