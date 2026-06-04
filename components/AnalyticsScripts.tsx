'use client'
/**
 * AnalyticsScripts
 * Conditionally loads GA4 and/or PostHog based on env, and wires two zero-config
 * conveniences so instrumentation is centralized:
 *   1. SPA pageviews on every route change.
 *   2. Click tracking for any element with a `data-event` attribute — server
 *      components just add the attribute, no client handler needed.
 *
 * Dormant by default: with no NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_POSTHOG_KEY set,
 * nothing loads and track() no-ops. Add a key later and events flow immediately.
 */
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { pageview, track } from '@/lib/analytics'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

export function AnalyticsScripts() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // SPA pageviews.
  useEffect(() => {
    if (!GA_ID && !PH_KEY) return
    const qs = searchParams?.toString()
    pageview(pathname + (qs ? `?${qs}` : ''))
  }, [pathname, searchParams])

  // Delegated click tracking for [data-event] elements.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest('[data-event]')
      if (!el) return
      const event = el.getAttribute('data-event')
      if (!event) return
      const props: Record<string, string> = {}
      for (const attr of Array.from(el.attributes)) {
        if (attr.name.startsWith('data-prop-')) {
          props[attr.name.replace('data-prop-', '')] = attr.value
        }
      }
      track(event, props)
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`}
          </Script>
        </>
      )}
      {PH_KEY && (
        <Script id="posthog-init" strategy="afterInteractive">
          {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${PH_KEY}',{api_host:'${PH_HOST}',capture_pageview:false});`}
        </Script>
      )}
    </>
  )
}
