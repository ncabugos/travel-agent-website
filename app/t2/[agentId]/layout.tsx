import { Playfair_Display, Inter, Bodoni_Moda } from 'next/font/google'
import type { ReactNode } from 'react'
import { getAgentProfile } from '@/lib/suppliers'
import { T2Nav } from '@/components/t2/T2Nav'
import { LidoNav } from '@/components/t2/LidoNav'
import { LidoMobileNav } from '@/components/t2/LidoMobileNav'
import { T2Footer } from '@/components/t2/T2Footer'
import { DemoSignupBanner } from '@/components/ui/DemoSignupBanner'
import { isDemoSlug } from '@/lib/demo-agents'
import '@/app/t2/globals-t2.css'

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

export default async function T2Layout({ children, params }: LayoutProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  const isLido = agentId === 'lido-collective'
  const pageClass = isLido ? 't2-page lido-page' : 't2-page'

  return (
    <div className={`${playfair.variable} ${inter.variable} ${bodoniModa.variable} ${pageClass}`}>
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
      {/* Inject Wine & Wellness Travel theme — Aethos-inspired cream + wine palette */}
      {agentId === 'wwt-demo' && (
        <style>{`
          :root {
            --t2-bg:           #F4F1E9;
            --t2-bg-alt:       #E9E3D3;
            --t2-text:         #1F1D18;
            --t2-text-muted:   #6E6757;
            --t2-accent:       #7A3C2F;
            --t2-accent-hover: #9B5447;
            --t2-divider:      #D4CCB9;
            --t2-dark-bg:      #16140E;
            --t2-dark-text:    #F1EAD5;
            --t2-overlay:      rgba(22,20,14,0.55);
            --t2-section-pad:  clamp(120px, 14vw, 180px);
          }
          .t2-page {
            letter-spacing: 0.002em;
          }
          .t2-heading {
            font-weight: 300;
            letter-spacing: -0.018em;
          }
          .t2-label {
            font-size: 11px;
            letter-spacing: 0.32em;
            color: var(--t2-text-muted) !important;
            font-weight: 500;
          }
          /* Aethos-style link underline for anchor links */
          .wwt-link {
            color: var(--t2-text);
            text-decoration: none;
            border-bottom: 1px solid var(--t2-text);
            padding-bottom: 2px;
            font-family: var(--t2-font-sans);
            font-size: 12px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            font-weight: 500;
            transition: opacity 240ms var(--t2-ease);
          }
          .wwt-link:hover { opacity: 0.55; }
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
      {isLido ? (
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
        />
      )}
      <main>{children}</main>
      <T2Footer
        agentId={agentId}
        agencyName={agent?.agency_name ?? 'Luxury Travel Co.'}
        phone={agent?.phone ?? '+1 (800) 555-0100'}
        email={agent?.email ?? 'hello@luxurytravelco.com'}
        address={agent?.address}
        cstNumber={agent?.cst_number}
        logoUrl={isLido ? '/demos/the-lido-collective/2x/lido-white@2x.png' : (agent?.logo_url ?? undefined)}
        tier={agent?.tier ?? null}
        showVirtuosoLogo={isLido}
        affiliationLine={isLido ? 'A proud member of Virtuoso — the world’s leading luxury travel network.' : undefined}
      />
    </div>
  )
}

