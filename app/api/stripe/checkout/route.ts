import { NextResponse } from 'next/server'
import { stripe, TIER_PRICES, type TierName } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { tier } = await request.json() as { tier: TierName }

    if (!TIER_PRICES[tier]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const prices = TIER_PRICES[tier]

    // Build the origin from the request URL for redirect URLs
    const origin = new URL(request.url).origin

    // Create Checkout session with both the recurring subscription AND one-time setup fee.
    // Stripe supports mixing recurring + one-time line items in 'subscription' mode.
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        // Monthly recurring subscription
        {
          price: prices.monthly,
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
        },
      },
      metadata: {
        tier,
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
