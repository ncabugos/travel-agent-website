import { promises as fs } from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'
import Link from 'next/link'

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

  return (
    <main style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px 96px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginBottom: '32px',
            fontSize: '12px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#6b7280',
            textDecoration: 'none',
          }}
        >
          ← EliteAdvisorHub
        </Link>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            color: '#111',
            margin: '0 0 32px',
            lineHeight: 1.2,
          }}
        >
          {pageTitle}
        </h1>

        <article
          className="legal-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      <style>{`
        .legal-prose {
          font-size: 15px;
          line-height: 1.75;
          color: #1f2937;
        }
        .legal-prose h1 { display: none; }
        .legal-prose h2 {
          font-size: 22px;
          font-weight: 600;
          color: #111;
          margin: 40px 0 14px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }
        .legal-prose h2:first-child { border-top: none; padding-top: 0; }
        .legal-prose h3 {
          font-size: 17px;
          font-weight: 600;
          color: #111;
          margin: 28px 0 10px;
        }
        .legal-prose p { margin: 0 0 14px; }
        .legal-prose ul, .legal-prose ol { margin: 0 0 14px; padding-left: 24px; }
        .legal-prose li { margin-bottom: 4px; }
        .legal-prose strong { color: #111; font-weight: 600; }
        .legal-prose a { color: #b45309; text-decoration: underline; }
        .legal-prose hr { border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0; }
        .legal-prose code {
          background: #f3f4f6;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 13px;
          font-family: ui-monospace, monospace;
        }
        .legal-prose blockquote {
          border-left: 3px solid #d97706;
          padding-left: 16px;
          margin: 16px 0;
          color: #4b5563;
          font-style: italic;
        }
        .legal-prose table {
          border-collapse: collapse;
          margin: 16px 0;
          width: 100%;
        }
        .legal-prose th, .legal-prose td {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          text-align: left;
          font-size: 14px;
        }
        .legal-prose th { background: #f9fafb; font-weight: 600; }
      `}</style>
    </main>
  )
}
