/**
 * lib/analytics.ts
 * Provider-agnostic analytics shim. Safe to call from anywhere — it no-ops
 * until an analytics provider is actually loaded (see components/AnalyticsScripts.tsx,
 * gated on NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_POSTHOG_KEY).
 *
 * The goal: instrument the funnel NOW (UTM links + data-event attributes), so the
 * day a key is added the events already flow — no re-instrumentation pass needed.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    posthog?: { capture?: (event: string, props?: Record<string, any>) => void; [k: string]: any }
    dataLayer?: any[]
  }
}

const debug = () =>
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'

/** Track a custom event. Forwards to every loaded provider; no-ops otherwise. */
export function track(event: string, props: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return
  try {
    window.gtag?.('event', event, props)
    window.posthog?.capture?.(event, props)
    if (debug()) console.debug('[analytics] track', event, props)
  } catch {
    /* analytics must never break the page */
  }
}

/** Track a virtual pageview (SPA navigations GA4 won't auto-send). */
export function pageview(url: string): void {
  if (typeof window === 'undefined') return
  try {
    const id = process.env.NEXT_PUBLIC_GA_ID
    if (id && window.gtag) window.gtag('event', 'page_view', { page_path: url })
    window.posthog?.capture?.('$pageview', { $current_url: url })
  } catch {
    /* no-op */
  }
}

export interface Utm {
  source: string
  medium: string
  campaign: string
  content?: string
  term?: string
}

/**
 * Append UTM params to an internal or external href. Used on every blog CTA so
 * organic-attributed signups/consults are traceable (strategy §3, §5.3).
 */
export function withUtm(href: string, utm: Utm): string {
  const [path, existingHash] = href.split('#')
  const [base, existingQuery] = path.split('?')
  const params = new URLSearchParams(existingQuery ?? '')
  params.set('utm_source', utm.source)
  params.set('utm_medium', utm.medium)
  params.set('utm_campaign', utm.campaign)
  if (utm.content) params.set('utm_content', utm.content)
  if (utm.term) params.set('utm_term', utm.term)
  const qs = params.toString()
  return `${base}${qs ? `?${qs}` : ''}${existingHash ? `#${existingHash}` : ''}`
}
