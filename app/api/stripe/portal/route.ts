import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the agent's Stripe customer ID
    const { data: agent } = await (supabase
      .from('agents') as any)
      .select('stripe_customer_id')
      .eq('email', session.user.email ?? '')
      .single()

    if (!agent?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
    }

    const origin = new URL(request.url).origin

    // Create a Stripe Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: agent.stripe_customer_id,
      return_url: `${origin}/agent-portal/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err: any) {
    console.error('Portal session error:', err)
    return NextResponse.json({ error: err.message ?? 'Failed to create portal session' }, { status: 500 })
  }
}
