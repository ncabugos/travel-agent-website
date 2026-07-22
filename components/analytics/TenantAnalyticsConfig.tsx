'use client'

import Script from 'next/script'

/**
 * Per-advisor Google Analytics (GA4).
 *
 * Registers the advisor's OWN GA4 property alongside the platform-wide property
 * mounted in the root layout (components/AnalyticsScripts.tsx). On an advisor's
 * public tenant site, hits flow to BOTH the operator's aggregate property and
 * the advisor's isolated property.
 *
 * Pageviews: we set `send_page_view: false` and deliberately do NOT fire our
 * own page_view. The platform's shared `pageview()` (lib/analytics.ts) already
 * fires a manual `page_view` event on initial load and every SPA route change,
 * and gtag fans that event out to EVERY configured property — including this
 * one. Mirroring the platform's config this way means the advisor property gets
 * exactly one pageview per view (no double-count from a config auto-pageview
 * racing the manual event) and SPA navigations are covered for free.
 *
 * The measurement ID is sourced per-agent from `agents.ga_measurement_id`
 * (see lib/agent-ga.ts).
 */

// Guard the value before it lands in an inline script. The ID is operator-set,
// but validating here keeps untrusted-looking data out of the DOM regardless.
const VALID_GA_ID = /^G-[A-Z0-9]{4,}$/

export default function TenantAnalyticsConfig({ measurementId }: { measurementId: string }) {
  if (!VALID_GA_ID.test(measurementId)) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id={`ga-tenant-${measurementId}`} strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('js', new Date());
gtag('config', '${measurementId}', { send_page_view: false });`}
      </Script>
    </>
  )
}
