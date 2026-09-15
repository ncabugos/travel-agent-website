import Link from 'next/link'
import Image from 'next/image'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { MarketingClosingCTA } from '@/components/marketing/MarketingClosingCTA'
import { Reveal } from '@/components/marketing/Reveal'
import { templatePath } from '@/lib/tenant-paths'
import { buildMarketingMetadata } from '@/lib/seo'
import { BODY_FONT, BODY_STYLE, CHARCOAL, DISPLAY_FONT, DIVIDER, LABEL_STYLE, WARM_GRAY } from '@/components/marketing/tokens'

export const metadata = buildMarketingMetadata({
  title: 'Website Templates for Luxury Travel Advisors — Elite Advisor Hub',
  description:
    'The three Elite Advisor Hub templates: Vista, Meridian, and Casa Solis. Open a live demo of each design built for top travel advisors.',
  path: 'templates',
  image: '/demos/vista.png',
  imageAlt: 'Elite Advisor Hub templates: Vista, Meridian, and Casa Solis',
})

interface Template {
  name: string
  availability: string
  description: string
  href: string
  thumbnail: string
}

// Demo links are composed through lib/tenant-paths.ts, never hand-built.
const TEMPLATES: Template[] = [
  {
    name: 'Vista',
    availability: 'Standard template',
    description: 'Cinematic widescreen with serif typography and antique gold accents. Dramatic, editorial, built for advisors whose photography carries the story.',
    href: templatePath('t2', 't2-demo'),
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-luxuryTravel-homepage-thumbs-1.webp',
  },
  {
    name: 'Meridian',
    availability: 'Standard template',
    description: 'Editorial sans-serif on warm ivory with bronze italics and generous whitespace. Quiet and confident, for advisors who prefer restraint.',
    href: templatePath('t3', 't3-demo'),
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-meridian-homepage-thumbs-3.webp',
  },
  {
    name: 'Casa Solis',
    availability: 'Custom build',
    description: 'Warm ivory and burnt ochre for a boutique Italian specialist. The reference for a build designed from scratch around one advisor.',
    href: templatePath('t4', 'casa-solis'),
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-casaSolis-homepage-thumbs-2.webp',
  },
]

export default function TemplatesPage() {
  return (
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff' }}>
      <MarketingNav />
      <main>
        <section style={{ padding: '176px 0 72px' }}>
          <div className="eah-container">
            <p style={{ ...LABEL_STYLE, marginBottom: '24px' }}>Templates</p>
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(40px, 5.6vw, 80px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 24px', maxWidth: '14ch' }}>
              Three designs. One standard.
            </h1>
            <p style={{ ...BODY_STYLE, fontSize: '19px', maxWidth: '52ch' }}>
              Every site is built to the standard the top consortia expect. Choose the design that fits your brand, then see it live on a demo site. A build designed from scratch is always available.
            </p>
          </div>
        </section>

        <section style={{ padding: '0 0 120px' }}>
          <div className="eah-container">
            <div style={{ borderTop: `1px solid ${DIVIDER}` }}>
              {TEMPLATES.map((t, i) => (
                <Reveal key={t.name}>
                  <article className={`tpl-row${i % 2 === 1 ? ' reverse' : ''}`} style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '48px', alignItems: 'center', padding: '56px 0', borderBottom: `1px solid ${DIVIDER}` }}>
                    <Link href={t.href} target="_blank" rel="noopener" aria-label={`${t.name} demo, opens in a new tab`} className="tpl-shot" style={{ display: 'block', position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden', background: DIVIDER }}>
                      <Image src={t.thumbnail} alt="" fill sizes="(max-width: 900px) 100vw, 58vw" style={{ objectFit: 'cover', objectPosition: 'top', transition: 'opacity 0.3s ease' }} />
                    </Link>
                    <div className="tpl-text">
                      <p style={{ ...LABEL_STYLE, marginBottom: '16px' }}>{t.availability}</p>
                      <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(30px, 3.4vw, 44px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 16px' }}>{t.name}</h2>
                      <p style={{ ...BODY_STYLE, marginBottom: '24px', maxWidth: '44ch' }}>{t.description}</p>
                      <Link href={t.href} target="_blank" rel="noopener" className="eah-link" style={{ fontSize: '15px' }}>View demo</Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <p style={{ fontSize: '14px', color: WARM_GRAY, margin: '24px 0 0' }}>
              Templates are the starting point. Every site is finished under your name, palette, and typography on your own domain.
            </p>
          </div>
        </section>

        <MarketingClosingCTA />
      </main>
      <MarketingFooter />

      <style>{`
        .tpl-row.reverse .tpl-shot { order: 2; }
        .tpl-row.reverse .tpl-text { order: 1; }
        .tpl-shot:hover img { opacity: 0.9; }
        @media (max-width: 900px) {
          .tpl-row { grid-template-columns: 1fr !important; gap: 24px !important; padding: 40px 0 !important; }
          .tpl-row.reverse .tpl-shot { order: 1; }
          .tpl-row.reverse .tpl-text { order: 2; }
        }
      `}</style>
    </div>
  )
}
