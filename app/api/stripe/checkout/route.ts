import { NextResponse } from 'next/server'
import { stripe, TIER_PRICES, type TierName } from '@/lib/stripe'

type BillingCycle = 'monthly' | 'annual'

export async function POST(request: Request) {
  try {
    const { tier, billingCycle = 'monthly' } = await request.json() as {
      tier: TierName
      billingCycle?: BillingCycle
    }

    if (!TIER_PRICES[tier]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }
    if (billingCycle !== 'monthly' && billingCycle !== 'annual') {
      return NextResponse.json({ error: 'Invalid billingCycle' }, { status: 400 })
    }

    const prices = TIER_PRICES[tier]
    // Pick the recurring price for the requested cycle. Empty string means
    // the tier doesn't support that cycle (e.g. Agency on either, or any
    // future tier we add monthly-first).
    const recurringPriceId = billingCycle === 'annual' ? prices.annual : prices.monthly
    if (!recurringPriceId) {
      return NextResponse.json(
        { error: `${tier} tier is not available on ${billingCycle} billing.` },
        { status: 400 },
      )
    }

    // Build the origin from the request URL for redirect URLs
    const origin = new URL(request.url).origin

    // Create Checkout session with both the recurring subscription AND one-time setup fee.
    // Stripe supports mixing recurring + one-time line items in 'subscription' mode.
    // The setup fee is the same regardless of billing cycle.
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        // Recurring subscription — monthly or annual depending on cycle
        {
          price: recurringPriceId,
          quantity: 1,
        },
        // One-time setup fee — charged on the first invoice only
        {
          price: prices.setup,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          tier,
          billingCycle,
        },
      },
      metadata: {
        tier,
        billingCycle,
      },
      // After successful checkout, redirect to the onboarding wizard
      success_url: `${origin}/agent-portal/onboarding?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${origin}/#pricing`,
      // Allow promo codes
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message ?? 'Checkout failed' }, { status: 500 })
  }
}
