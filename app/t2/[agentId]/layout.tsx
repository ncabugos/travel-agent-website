import { Playfair_Display, Inter, Bodoni_Moda } from 'next/font/google'
import type { ReactNode } from 'react'
import { getAgentProfile } from '@/lib/suppliers'
import { getAgentGaMeasurementId } from '@/lib/agent-ga'
import TenantAnalyticsConfig from '@/components/analytics/TenantAnalyticsConfig'
import { T2Nav } from '@/components/t2/T2Nav'
import { LidoNav } from '@/components/t2/LidoNav'
import { LidoMobileNav } from '@/components/t2/LidoMobileNav'
import { T2Footer } from '@/components/t2/T2Footer'
import { WWT2Nav } from '@/components/t2/wwt2/WWT2Nav'
import { WWT2Footer } from '@/components/t2/wwt2/WWT2Footer'
import { DemoSignupBanner } from '@/components/ui/DemoSignupBanner'
import { isDemoSlug, isPublishedDemoSlug } from '@/lib/demo-agents'
import '@/app/t2/globals-t2.css'
import '@/app/t2/wwt2.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

// Bodoni Moda — locked-in serif for the coast-compass-demo persona.
// Other t2 demos keep Cormorant Garamond.
const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
})

interface LayoutProps {
  children: ReactNode
  params: Promise<{ agentId: string }>
}

// Showcase demos are fixtures, not real businesses. Emit a noindex directive
// for them at the layout level so it cascades to every page in this template
// (home + journal/hotels/destinations/advisors). Real tenant sites get no
// robots override here and stay indexable.
export async function generateMetadata({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params
  return isDemoSlug(agentId) && !isPublishedDemoSlug(agentId)
    ? { robots: { index: false, follow: false } }
    : {}
}

export default async function T2Layout({ children, params }: LayoutProps) {
  const { agentId } = await params
  const [agent, gaMeasurementId] = await Promise.all([
    getAgentProfile(agentId),
    getAgentGaMeasurementId(agentId),
  ])
  const isLido = agentId === 'lido-collective'
  // Wine & Wellness flagship (v2) — its own scoped design system + bespoke nav.
  const isWwt2 = agentId === 'wwt-demo' || agent?.bespoke_layout === 'wwt'
  const pageClass = isWwt2 ? 'wwt2-page' : isLido ? 't2-page lido-page' : 't2-page'

  return (
    <div className={`${playfair.variable} ${inter.variable} ${bodoniModa.variable} ${pageClass}`}>
      {gaMeasurementId && <TenantAnalyticsConfig measurementId={gaMeasurementId} />}
      {isDemoSlug(agentId) && <DemoSignupBanner />}
      {/* Inject YTC theme override if this is the YTC demo */}
      {agentId === 'ytc-demo' && (
        <style>{`
          :root {
            --t2-bg:           #F8F6F3;
            --t2-bg-alt:       #EDE9E4;
            --t2-text:         #1A1A24;
            --t2-text-muted:   #6B6770;
            --t2-accent:       #B8292A;
            --t2-accent-hover: #D4403F;
            --t2-divider:      #D8D4CE;
            --t2-dark-bg:      #12121A;
            --t2-dark-text:    #F5F2EE;
            --t2-overlay:      rgba(18,18,26,0.48);
          }
        `}</style>
      )}
      {/* Coast & Compass — locked to Bodoni Moda. Scoped to .t2-page (not :root)
          so var() resolves against the next/font class on the same element. */}
      {agentId === 'coast-compass-demo' && (
        <style>{`
          .t2-page {
            --t2-font-serif: var(--font-bodoni, 'Cormorant Garamond'), 'Cormorant Garamond', Georgia, serif;
          }
          .t2-page .t2-heading {
            font-weight: 400;
            letter-spacing: -0.018em;
          }
          .t2-page .t2-heading-lg { font-weight: 400; }
          .t2-page .t2-ed-num { font-style: italic; }
        `}</style>
      )}
      {/* WWT flagship — bespoke nav on every page (home + subpages). */}
      {isWwt2 ? (
        <WWT2Nav base={`/t2/${agentId}`} agencyName={agent?.agency_name ?? 'Wine & Wellness Travel'} />
      ) : isLido ? (
        <>
          <LidoNav agentId={agentId} />
          <LidoMobileNav agentId={agentId} />
        </>
      ) : (
        <T2Nav
          agentId={agentId}
          agencyName={agent?.agency_name ?? 'Luxury Travel Co'}
          tagline={agent?.tagline ?? undefined}
          logoUrl={agent?.logo_url ?? undefined}
          logoUrlDark={agent?.logo_url_dark ?? undefined}
          navLinks={agent?.nav_links}
          tier={agent?.tier ?? null}
          modules={agent?.active_modules ?? null}
        />
      )}
      <main>{children}</main>
      {isWwt2 ? (
        <WWT2Footer
          base={`/t2/${agentId}`}
          agencyName={agent?.agency_name ?? 'Wine & Wellness Travel'}
          instagram={agent?.instagram_url}
          facebook={agent?.facebook_url}
          heroImage="/media/hotel-programs/four-seasons/fs-lanai_wellness-1500.jpg"
        />
      ) : (
      <T2Footer
        agentId={agentId}
        agencyName={agent?.agency_name ?? 'Luxury Travel Co.'}
        phone={agent?.phone ?? '+1 (800) 555-0100'}
        email={agent?.email ?? 'hello@luxurytravelco.com'}
        address={agent?.address}
        cstNumber={agent?.cst_number}
        logoUrl={isLido ? '/demos/the-lido-collective/2x/lido-white@2x.png' : (agent?.logo_url ?? undefined)}
        tier={agent?.tier ?? null}
        modules={agent?.active_modules ?? null}
        showVirtuosoLogo={isLido}
        affiliationLine={isLido ? 'A proud member of Virtuoso — the world’s leading luxury travel network.' : undefined}
      />
      )}
    </div>
  )
}

