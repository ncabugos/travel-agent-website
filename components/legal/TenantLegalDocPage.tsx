import { promises as fs } from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'
import { notFound } from 'next/navigation'

interface TenantLegalDocPageProps {
  agentId: string
  /** Filename within public/legal/tenants/<agentId>/, e.g. "terms-of-service.md" */
  file: string
  pageTitle: string
}

/**
 * Renders a tenant-scoped markdown legal document. Tenant chrome (TopBar,
 * SiteNav, SiteFooter) is provided by the parent /frontend/[agentId] layout.
 */
export async function TenantLegalDocPage({ agentId, file, pageTitle }: TenantLegalDocPageProps) {
  const fullPath = path.join(process.cwd(), 'public', 'legal', 'tenants', agentId, file)
  let md: string
  try {
    md = await fs.readFile(fullPath, 'utf8')
  } catch {
    notFound()
  }
  const html = marked.parse(md, { async: false }) as string

  const serif = 'var(--font-serif)'

  return (
    <main style={{ background: '#FAFAF8' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1
          style={{
            fontFamily: serif,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 300,
            color: '#1a1a1a',
            margin: '0 0 12px',
            lineHeight: 1.2,
          }}
        >
          {pageTitle}
        </h1>
        <div style={{ width: '48px', height: '1px', background: '#b5945a', marginBottom: '32px' }} />

        <article
          className="legal-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      <style>{`
        .legal-prose {
          font-size: 15px;
          line-height: 1.8;
          color: #3a3a3a;
        }
        .legal-prose h1 { display: none; }
        .legal-prose h2 {
          font-family: var(--font-serif);
          font-size: 22px;
          font-weight: 400;
          color: #1a1a1a;
          margin: 44px 0 14px;
          padding-top: 28px;
          border-top: 1px solid #e7e3da;
          letter-spacing: 0.01em;
        }
        .legal-prose h2:first-child { border-top: none; padding-top: 0; margin-top: 0; }
        .legal-prose h3 {
          font-family: var(--font-serif);
          font-size: 17px;
          font-weight: 500;
          color: #1a1a1a;
          margin: 28px 0 10px;
        }
        .legal-prose p { margin: 0 0 14px; }
        .legal-prose ul, .legal-prose ol { margin: 0 0 16px; padding-left: 22px; }
        .legal-prose li { margin-bottom: 6px; }
        .legal-prose strong { color: #1a1a1a; font-weight: 600; }
        .legal-prose a { color: #b5945a; text-decoration: underline; }
        .legal-prose a:hover { color: #8a6d3f; }
      `}</style>
    </main>
  )
}
