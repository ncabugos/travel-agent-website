import { stripe, TIER_PRICES, type TierName } from '@/lib/stripe'
import type Stripe from 'stripe'

/**
 * Stripe data loaders for the admin agent-detail view.
 *
 * Every function wraps the underlying Stripe call in try/catch and
 * returns a result object so the page can render gracefully even
 * when Stripe is unreachable, the customer id is stale, or the
 * environment lacks credentials.
 */

export interface StripeResult<T> {
  ok: boolean
  data: T | null
  error: string | null
}

export interface SubscriptionSummary {
  id: string
  status: Stripe.Subscription.Status
  tier: TierName | 'unknown'
  monthlyAmount: number | null
  currency: string
  currentPeriodStart: number | null
  currentPeriodEnd: number | null
  cancelAtPeriodEnd: boolean
  startedAt: number | null
  customerId: string
}

export interface InvoiceSummary {
  id: string
  number: string | null
  amountDue: number
  amountPaid: number
  currency: string
  status: Stripe.Invoice.Status
  created: number
  hostedInvoiceUrl: string | null
  invoicePdf: string | null
}

/**
 * Reverse-lookup tier name from a price id.
 * Returns 'unknown' when the price isn't one we recognize (e.g. the
 * agent is on a legacy or custom price).
 */
export function tierFromPriceId(priceId: string | null | undefined): TierName | 'unknown' {
  if (!priceId) return 'unknown'
  for (const [tier, prices] of Object.entries(TIER_PRICES)) {
    if (prices.monthly === priceId) return tier as TierName
  }
  return 'unknown'
}

export async function loadSubscription(
  subscriptionId: string | null | undefined
): Promise<StripeResult<SubscriptionSummary>> {
  if (!subscriptionId) {
    return { ok: false, data: null, error: 'No Stripe subscription on file' }
  }

  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price'],
    })

    const item = sub.items.data[0]
    const price = item?.price as Stripe.Price | undefined
    const monthlyAmount = price?.unit_amount ?? null
    const currency = price?.currency ?? 'usd'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subAny = sub as any

    return {
      ok: true,
      error: null,
      data: {
        id: sub.id,
        status: sub.status,
        tier: tierFromPriceId(price?.id),
        monthlyAmount,
        currency,
        currentPeriodStart: subAny.current_period_start ?? null,
        currentPeriodEnd: subAny.current_period_end ?? null,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        startedAt: sub.start_date ?? null,
        customerId: sub.customer as string,
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Stripe error'
    return { ok: false, data: null, error: message }
  }
}

export async function loadInvoices(
  customerId: string | null | undefined,
  limit = 5
): Promise<StripeResult<InvoiceSummary[]>> {
  if (!customerId) {
    return { ok: false, data: null, error: 'No Stripe customer on file' }
  }

  try {
    const list = await stripe.invoices.list({ customer: customerId, limit })
    const data: InvoiceSummary[] = list.data.map((inv) => ({
      id: inv.id ?? '',
      number: inv.number ?? null,
      amountDue: inv.amount_due,
      amountPaid: inv.amount_paid,
      currency: inv.currency,
      status: (inv.status ?? 'open') as Stripe.Invoice.Status,
      created: inv.created,
      hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
      invoicePdf: inv.invoice_pdf ?? null,
    }))
    return { ok: true, data, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Stripe error'
    return { ok: false, data: null, error: message }
  }
}

/** Format an integer cents amount as a localized currency string. */
export function formatMoney(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

/** Format a unix timestamp (seconds) as a short date string. */
export function formatDate(unix: number | null): string {
  if (!unix) return '—'
  return new Date(unix * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
