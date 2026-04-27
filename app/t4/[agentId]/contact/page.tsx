import { T4PageHero } from '@/components/t4/T4PageHero'
import { ContactForm } from '@/components/contact/ContactForm'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Contact | Casa Solis',
  description: 'Begin a conversation with Casa Solis.',
}

export default async function T4ContactPage({ params }: PageProps) {
  const { agentId } = await params

  return (
    <>
      <T4PageHero
        image="/media/hero images/four-seasons-CapFerrat_garden-hero.jpg"
        imageAlt="Contact Casa Solis"
        eyebrow="Begin"
        title="A conversation first."
        body="Tell us where you are dreaming of — we will reach out within one business day by phone or email to discuss what's possible."
        size="short"
      />

      <section className="t4-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: 96,
            alignItems: 'start',
          }}
          className="t4-contact-page-grid"
        >
          {/* Aside — quiet particulars */}
          <aside>
            <span className="t4-eyebrow">The Studio</span>
            <h2 className="t4-headline-lg" style={{ marginTop: 24, marginBottom: 40 }}>
              Reach us directly.
            </h2>

            <div style={{ borderTop: '1px solid var(--t4-divider)' }}>
              <AsideRow label="By Phone" value="+1 (415) 555 0134" />
              <AsideRow label="By Email" value="hello@casasolis.com" />
              <AsideRow label="Our Studio" value="Via Roma 28 · Solferino" />
              <AsideRow label="Hours" value="Mon–Fri · 9:00–18:00 CET" last />
            </div>

            <p
              className="t4-body"
              style={{ marginTop: 40, maxWidth: 380, fontSize: 14 }}
            >
              We take on a small number of new clients each year. If the form
              feels formal, a short note by email is perfectly welcome.
            </p>
          </aside>

          {/* Form */}
          <div>
            <ContactForm agentId={agentId} />
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .t4-contact-page-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          }
        `}</style>
      </section>
    </>
  )
}

function AsideRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 24,
        padding: '20px 0',
        borderBottom: last ? 'none' : '1px solid var(--t4-divider)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--t4-font-body)',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'var(--t4-accent)',
          paddingTop: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--t4-font-display)',
          fontSize: 18,
          fontWeight: 400,
          color: 'var(--t4-text)',
        }}
      >
        {value}
      </div>
    </div>
  )
}
