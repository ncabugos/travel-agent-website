import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { stripe, moduleKeyForPrice } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidateTenantSites } from '@/lib/revalidate-tenant-sites'
import type { BillingEventNotificationInput } from '@/lib/email'
import type Stripe from 'stripe'

/**
 * Email the payer their portal sign-in link straight after checkout, using
 * Supabase's own mailer (the branded magic-link template). Non-fatal: if it
 * fails they can request a link from /agent-portal/login.
 */
async function sendPortalSignInLink(email: string, origin: string) {
  const anon = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  )
  const { error } = await anon.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/api/agent-portal/auth-callback`,
      shouldCreateUser: false,
    },
  })
  if (error) console.error(`Failed to send sign-in link to ${email}:`, error.message)
}

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

type ServiceClient = ReturnType<typeof createServiceClient>

type AgentLite = {
  id: string
  email: string | null
  full_name: string | null
  agency_name: string | null
  tier: string | null
  stripe_customer_id: string | null
}
const AGENT_LITE_COLUMNS = 'id, email, full_name, agency_name, tier, stripe_customer_id'

/**
 * Case-insensitive exact match on agents.email. Supabase Auth stores emails
 * lowercased; Stripe keeps whatever the payer typed.
 */
async function findAgentByEmail(supabase: ServiceClient, email: string): Promise<AgentLite | null> {
  const pattern = email.trim().replace(/[\\%_]/g, '\\$&')
  const { data, error } = await supabase
    .from('agents')
    .select(AGENT_LITE_COLUMNS)
    .ilike('email', pattern)
    .maybeSingle()
  if (error) console.error('[stripe-webhook] agent lookup by email failed', error)
  return (data as AgentLite | null) ?? null
}

/**
 * Find the agent for a Stripe customer. If no row carries the customer ID yet
 * (the checkout event was missed or could not be linked), fall back to the
 * customer's email and link the row, so the account heals on the next event.
 */
async function findAgentForCustomer(
  supabase: ServiceClient,
  customerId: string,
): Promise<{ agent: AgentLite | null; linkedNow: boolean; customerEmail: string | null }> {
  const { data } = await supabase
    .from('agents')
    .select(AGENT_LITE_COLUMNS)
    .eq('stripe_customer_id', customerId)
    .maybeSingle()
  if (data) return { agent: data as AgentLite, linkedNow: false, customerEmail: (data as AgentLite).email }

  let customerEmail: string | null = null
  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (!customer.deleted) customerEmail = customer.email ?? null
  } catch (err) {
    console.error(`[stripe-webhook] could not retrieve customer ${customerId}`, err)
  }
  if (!customerEmail) return { agent: null, linkedNow: false, customerEmail }

  const agent = await findAgentByEmail(supabase, customerEmail)
  if (!agent || (agent.stripe_customer_id && agent.stripe_customer_id !== customerId)) {
    return { agent: null, linkedNow: false, customerEmail }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('agents') as any)
    .update({ stripe_customer_id: customerId })
    .eq('id', agent.id)
  if (error) {
    console.error(`[stripe-webhook] failed to link customer ${customerId} to agent ${agent.id}`, error)
    return { agent: null, linkedNow: false, customerEmail }
  }
  console.info(`[stripe-webhook] linked customer ${customerId} to agent ${agent.id} by email`)
  return { agent: { ...agent, stripe_customer_id: customerId }, linkedNow: true, customerEmail }
}

/**
 * Tell the operator about a billing event: an admin_notifications row (what
 * /admin and the daily digest read) plus an email. Never throws: a non-2xx
 * response makes Stripe retry and double-process the event.
 */
async function notifyOperator(
  supabase: ServiceClient,
  row: { type: string; title: string; body: string; metadata: Record<string, unknown> },
  email: BillingEventNotificationInput,
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('admin_notifications') as any).insert(row)
    if (error) console.error(`[stripe-webhook] admin_notifications insert failed (${row.type})`, error)
  } catch (err) {
    console.error(`[stripe-webhook] admin_notifications insert threw (${row.type})`, err)
  }
  try {
    const { sendBillingEventNotification } = await import('@/lib/email')
    const sent = await sendBillingEventNotification(email)
    console.info(`[stripe-webhook] ${email.eventType} admin notification sent`, sent?.id)
  } catch (err) {
    console.error(`[stripe-webhook] ${email.eventType} admin notification email failed`, err)
  }
}

/** Shared fields for operator emails about a known agent. */
function agentEmailFields(agent: AgentLite, customerId: string) {
  return {
    agentName: agent.full_name ?? agent.email ?? customerId,
    agencyName: agent.agency_name,
    email: agent.email ?? '',
    tier: agent.tier,
    stripeCustomerId: customerId,
    agentId: agent.id,
  }
}

/** Operator alert for a Stripe customer we could not match to any account. */
async function notifyUnlinked(
  supabase: ServiceClient,
  customerId: string,
  customerEmail: string | null,
  context: string,
) {
  await notifyOperator(
    supabase,
    {
      type: 'billing_unlinked',
      title: `Payment not linked: ${customerEmail ?? customerId}`,
      body: context,
      metadata: { stripe_customer_id: customerId, email: customerEmail },
    },
    {
      eventType: 'unlinked',
      agentName: customerEmail ?? customerId,
      agencyName: null,
      email: customerEmail ?? '',
      tier: null,
      stripeCustomerId: customerId,
      note: `${context} Link this customer to an advisor account by hand, or check the Stripe customer's email.`,
    },
  )
}

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  const origin = new URL(request.url).origin

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
    // ── Checkout completed — link or create the agent ───────────────
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
      const planLabel = plan === 'founding' ? `founding ${tier} (${betaCohort})` : tier
      const billingFields = {
        tier,
        plan,
        beta_cohort: betaCohort,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        subscription_status: subscriptionStatus,
      }

      if (!email) {
        console.error('Checkout completed but no email found')
        await notifyUnlinked(supabase, stripeCustomerId, null, 'A checkout completed without an email address.')
        break
      }

      // An account can already exist: the advisor registered, signed in, or
      // was set up by hand before paying. Link that row rather than creating one.
      let agentId: string
      let existing = await findAgentByEmail(supabase, email)

      if (!existing) {
        // First-time payer: no auth user exists yet. Create one with the email
        // already confirmed (so Supabase sends no confirmation mail); the
        // on_auth_user_created trigger inserts the agents row with the same id
        // and email. Then the Stripe identifiers go onto that row.
        const fullName = customerName ?? email.split('@')[0]
        const { data: created, error: createError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name: fullName },
        })

        if (createError || !created.user) {
          // Usually "already registered": an auth user exists whose agents row
          // we could not match. Retry the lookup once before giving up loudly.
          existing = await findAgentByEmail(supabase, email)
          if (!existing) {
            console.error('Failed to create auth user for new checkout:', createError?.message)
            await notifyUnlinked(
              supabase,
              stripeCustomerId,
              email,
              `A ${planLabel} checkout completed, but no advisor account could be found or created (${createError?.message ?? 'unknown error'}).`,
            )
            break
          }
          agentId = existing.id
        } else {
          agentId = created.user.id
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await (supabase.from('agents') as any)
            .update({ ...billingFields, template: tier === 'starter' ? 'frontend' : 't2' })
            .eq('id', agentId)
          if (error) {
            console.error('Failed to attach Stripe subscription to new agent:', error)
            await notifyUnlinked(
              supabase,
              stripeCustomerId,
              email,
              `A ${planLabel} checkout created account ${agentId}, but saving the Stripe details failed (${error.message}).`,
            )
            break
          }
          console.log(`Created new agent ${agentId} for ${email} (plan=${plan})`)
        }
      } else {
        agentId = existing.id
      }

      if (existing) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from('agents') as any)
          .update(billingFields)
          .eq('id', agentId)
        if (error) {
          console.error(`Failed to attach Stripe subscription to agent ${agentId}:`, error)
          await notifyUnlinked(
            supabase,
            stripeCustomerId,
            email,
            `A ${planLabel} checkout matched account ${agentId}, but saving the Stripe details failed (${error.message}).`,
          )
          break
        }
        console.log(`Updated agent ${agentId} with Stripe subscription (plan=${plan})`)
      }

      await notifyOperator(
        supabase,
        {
          type: 'new_signup',
          title: `New ${planLabel} signup: ${email}`,
          body: `${customerName || email} just signed up for the ${planLabel} plan via Stripe.`,
          metadata: {
            agent_id: agentId,
            email,
            tier,
            plan,
            beta_cohort: betaCohort,
            stripe_customer_id: stripeCustomerId,
            existing_account: Boolean(existing),
          },
        },
        {
          eventType: 'signup',
          agentName: customerName || existing?.full_name || email,
          agencyName: existing?.agency_name ?? null,
          email,
          tier: planLabel,
          amount: session.amount_total != null ? session.amount_total / 100 : undefined,
          stripeCustomerId,
          agentId,
        },
      )

      // Straight from checkout to the onboarding wizard: the sign-in link
      // lands in their inbox while Stripe redirects them to the login page.
      await sendPortalSignInLink(existing?.email ?? email, origin)
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

      const { agent, linkedNow, customerEmail } = await findAgentForCustomer(supabase, customerId)
      if (!agent) {
        await notifyUnlinked(
          supabase,
          customerId,
          customerEmail,
          `Subscription ${subscription.id} changed to "${status}", but no advisor account is linked to this customer.`,
        )
        break
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('agents') as any)
        .update({ subscription_status: mappedStatus, stripe_subscription_id: subscription.id })
        .eq('id', agent.id)

      // Keep module entitlements in lockstep with the subscription's items
      // (covers portal add/remove, admin edits in the Stripe dashboard, and
      // items dropped by dunning-driven subscription changes).
      await reconcileModulesFromSubscription(supabase, agent.id, subscription)

      if (linkedNow) {
        await notifyOperator(
          supabase,
          {
            type: 'billing_linked',
            title: `Billing linked: ${agent.email}`,
            body: `Stripe customer ${customerId} was linked to this account by email. Its checkout event was missed earlier.`,
            metadata: { agent_id: agent.id, stripe_customer_id: customerId },
          },
          {
            eventType: 'signup',
            ...agentEmailFields(agent, customerId),
            note: 'This paying customer was not linked to their account at checkout. It is linked now. Check that their onboarding is complete.',
          },
        )
      }

      console.log(`Subscription ${subscription.id} status updated to ${mappedStatus}`)
      break
    }

    // ── Subscription cancelled ──────────────────────────────────────
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const { agent, customerEmail } = await findAgentForCustomer(supabase, customerId)
      if (!agent) {
        await notifyUnlinked(
          supabase,
          customerId,
          customerEmail,
          `Subscription ${subscription.id} was canceled, but no advisor account is linked to this customer.`,
        )
        break
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('agents') as any)
        .update({ subscription_status: 'canceled', active_modules: [] })
        .eq('id', agent.id)

      // The subscription is gone — all module entitlements go with it.
      const now = new Date().toISOString()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('agent_modules') as any)
        .update({ status: 'canceled', canceled_at: now, updated_at: now })
        .eq('agent_id', agent.id)
        .eq('status', 'active')

      await notifyOperator(
        supabase,
        {
          type: 'subscription_canceled',
          title: `Subscription canceled: ${agent.agency_name}`,
          body: `${agent.email} has canceled their subscription.`,
          metadata: { agent_id: agent.id },
        },
        { eventType: 'cancellation', ...agentEmailFields(agent, customerId) },
      )

      console.log(`Subscription canceled for customer ${customerId}`)
      break
    }

    // ── Invoice payment failed (card declined, expired, etc.) ────────
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      const amount = invoice.amount_due / 100

      const { agent, customerEmail } = await findAgentForCustomer(supabase, customerId)
      if (!agent) {
        await notifyUnlinked(
          supabase,
          customerId,
          customerEmail ?? invoice.customer_email,
          `A $${amount.toFixed(2)} payment failed, and no advisor account is linked to this customer.`,
        )
        break
      }

      await notifyOperator(
        supabase,
        {
          type: 'payment_failed',
          title: `Payment failed: ${agent.agency_name}`,
          body: `A $${amount.toFixed(2)} payment from ${agent.email} failed (attempt ${invoice.attempt_count}).`,
          metadata: { agent_id: agent.id, stripe_customer_id: customerId, invoice_id: invoice.id },
        },
        {
          eventType: 'payment_failed',
          ...agentEmailFields(agent, customerId),
          amount,
          note: `Attempt ${invoice.attempt_count}. Stripe will retry on its schedule. Reach out if the card needs updating.`,
        },
      )
      break
    }

    // ── Trial ending soon (~3 days out) ─────────────────────────────
    case 'customer.subscription.trial_will_end': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const plan = subscription.metadata?.plan ?? 'standard'
      const cohort = subscription.metadata?.cohort ?? null
      const trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : 'unknown'

      // TODO: send the advisor a courtesy "your plan begins in 3 days" email
      // once the Resend template is wired (Build Kit Part A).
      console.log(
        `Trial will end for subscription ${subscription.id} (customer ${customerId}) — plan=${plan}, cohort=${cohort}, trial_end=${trialEnd}`,
      )

      const { agent, customerEmail } = await findAgentForCustomer(supabase, customerId)
      if (!agent) {
        await notifyUnlinked(
          supabase,
          customerId,
          customerEmail,
          `A trial ends on ${trialEnd.slice(0, 10)}, but no advisor account is linked to this customer.`,
        )
        break
      }
      await notifyOperator(
        supabase,
        {
          type: 'trial_ending',
          title: `Trial ending: ${agent.agency_name}`,
          body: `${agent.email}'s trial ends on ${trialEnd.slice(0, 10)}. Billing starts then.`,
          metadata: { agent_id: agent.id, stripe_customer_id: customerId, trial_end: trialEnd },
        },
        {
          eventType: 'trial_ending',
          ...agentEmailFields(agent, customerId),
          note: `Billing starts ${trialEnd.slice(0, 10)}. Make sure their site is live before then.`,
        },
      )
      break
    }

    default:
      // Unhandled event type — log and ignore
      console.log(`Unhandled Stripe event: ${event.type}`)
  }

  if (['checkout.session.completed', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(event.type)) {
    revalidateTenantSites()
  }

  return NextResponse.json({ received: true })
}
