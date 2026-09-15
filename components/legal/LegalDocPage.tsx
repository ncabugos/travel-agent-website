import { promises as fs } from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { BODY_FONT, CHARCOAL, CREAM, DISPLAY_FONT, DIVIDER, GOLD, LABEL_STYLE, WARM_GRAY, WARM_GRAY_DARK } from '@/components/marketing/tokens'

interface LegalDocPageProps {
  /** Filename within public/legal/, e.g. "privacy-policy.md" */
  file: string
  /** Page heading shown above the rendered document. */
  pageTitle: string
}

/**
 * Server-renders a markdown legal document from public/legal/<file>.
 * Used by /privacy and /terms.
 */
export async function LegalDocPage({ file, pageTitle }: LegalDocPageProps) {
  const fullPath = path.join(process.cwd(), 'public', 'legal', file)
  const md = await fs.readFile(fullPath, 'utf8')
  const html = marked.parse(md, { async: false }) as string
  const updated = md.match(/\*\*Last Updated:\*\*\s*([^\n]+)/i)?.[1]?.trim()

  return (
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff', minHeight: '100vh' }}>
      <MarketingNav minimal />
      <main>
        <section style={{ padding: '176px 0 48px' }}>
          <div className="eah-container">
            <p style={{ ...LABEL_STYLE, marginBottom: '24px' }}>Legal</p>
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(40px, 5.6vw, 80px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 20px', maxWidth: '14ch' }}>
              {pageTitle}
            </h1>
            {updated && <p style={{ fontSize: '14px', color: WARM_GRAY, margin: 0 }}>Last updated {updated}</p>}
          </div>
        </section>
        <section style={{ padding: '0 0 120px' }}>
          <div className="eah-container">
            <article className="legal-prose" style={{ maxWidth: '760px' }} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </section>
      </main>
      <MarketingFooter />

      <style>{`
        .legal-prose { font-size: 16px; line-height: 1.7; color: ${WARM_GRAY_DARK}; }
        .legal-prose h1 { display: none; }
        .legal-prose > p:first-of-type { display: none; }
        .legal-prose h2 { font-family: ${DISPLAY_FONT}; font-size: 28px; font-weight: 400; letter-spacing: -0.025em; line-height: 1.2; color: ${CHARCOAL}; margin: 48px 0 16px; padding-top: 24px; border-top: 1px solid ${DIVIDER}; }
        .legal-prose h3 { font-size: 18px; font-weight: 500; color: ${CHARCOAL}; margin: 28px 0 10px; }
        .legal-prose p { margin: 0 0 16px; }
        .legal-prose ul, .legal-prose ol { margin: 0 0 16px; padding-left: 24px; }
        .legal-prose li { margin-bottom: 6px; }
        .legal-prose strong { color: ${CHARCOAL}; font-weight: 500; }
        .legal-prose a { color: ${CHARCOAL}; text-decoration: underline; text-underline-offset: 4px; text-decoration-color: rgba(26,23,21,0.35); }
        .legal-prose a:hover { text-decoration-color: currentColor; }
        .legal-prose hr { border: 0; border-top: 1px solid ${DIVIDER}; margin: 32px 0; }
        .legal-prose code { background: ${CREAM}; border: 1px solid ${DIVIDER}; padding: 1px 6px; font-size: 13px; font-family: ui-monospace, Menlo, monospace; }
        .legal-prose blockquote { border-left: 1px solid ${GOLD}; padding-left: 20px; margin: 20px 0; color: ${CHARCOAL}; }
        .legal-prose table { border-collapse: collapse; margin: 20px 0; width: 100%; }
        .legal-prose th, .legal-prose td { border: 1px solid ${DIVIDER}; padding: 10px 12px; text-align: left; font-size: 14px; vertical-align: top; }
        .legal-prose th { background: ${CREAM}; color: ${CHARCOAL}; font-weight: 500; }
      `}</style>
    </div>
  )
}
