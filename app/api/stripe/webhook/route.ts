import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import type Stripe from 'stripe'

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  // If webhook secret is set, verify the signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      // In dev/test mode without webhook secret, parse the event directly
      event = JSON.parse(body) as Stripe.Event
    }
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
        // Update existing agent with Stripe IDs and tier
        await supabase
          .from('agents')
          .update({
            tier,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            subscription_status: 'active',
          })
          .eq('id', existing.id)

        console.log(`Updated agent ${existing.id} with Stripe subscription`)
      } else {
        // Create new agent record
        const { data: newAgent, error } = await supabase
          .from('agents')
          .insert({
            email,
            full_name: customerName ?? email.split('@')[0],
            agency_name: customerName ? `${customerName}'s Agency` : 'My Agency',
            tier,
            template: tier === 'starter' ? 'frontend' : 't2',
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            subscription_status: 'active',
            role: 'agent',
          })
          .select('id')
          .single()

        if (error) {
          console.error('Failed to create agent:', error)
        } else {
          console.log(`Created new agent ${newAgent.id} for ${email}`)

          // Notify admin
          await supabase
            .from('admin_notifications')
            .insert({
              type: 'new_signup',
              title: `New ${tier} signup: ${email}`,
              body: `${customerName || email} just signed up for the ${tier} tier via Stripe.`,
              metadata: {
                agent_id: newAgent.id,
                email,
                tier,
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

    default:
      // Unhandled event type — log and ignore
      console.log(`Unhandled Stripe event: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
