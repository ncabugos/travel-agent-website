import Image from 'next/image'
import { getSupplierProducts } from '@/lib/collections'
import { T2ExperiencesGrid } from '@/components/t2/T2ExperiencesGrid'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function ExperiencesPage({ params }: PageProps) {
  const { agentId } = await params
  const products = await getSupplierProducts()

  // Wine & Wellness Travel: this page represents exclusive Hotel Programs
  // (invite-only agency programs like Four Seasons Preferred Partner, Aman,
  // Rosewood Elite, etc.) — NOT the hotels themselves and NOT a mixed
  // cruise/hotel/experience list. Filter to hotel category and hide the
  // category tabs.
  const isWWT = agentId === 'wwt-demo'
  const visibleProducts = isWWT
    ? products.filter((p) => p.category === 'hotel')
    : products

  const hero = isWWT
    ? {
        image: '/media/hotel-programs/four-seasons/fs-MAU_1261_original.jpg',
        eyebrow: 'Hotel Programs',
        heading: 'Exclusive programs. Invite-only privilege.',
        body:
          'Every hotel in the Virtuoso database belongs to a brand program — but only a small number of those programs open their invite-only perks to advisors. These are the programs we are accepted into. When you book through us, you receive their Preferred, Elite, and Club benefits on top of every stay.',
      }
    : {
        image: '/media/hotel-programs/four-seasons/fs-MAU_1261_original.jpg',
        eyebrow: 'Supplier Partners',
        heading: 'Curated Experiences',
        body:
          'Explore our hand-selected portfolio of luxury cruise voyages, hotel programs, and bespoke travel experiences — all bookable through your advisor.',
      }

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: 850, overflow: 'hidden' }}>
        <Image
          src={hero.image}
          alt={hero.heading}
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))' }} />
        <div style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          padding: '0 24px',
        }}>
          <p className="t2-label" style={{ marginBottom: 14, color: 'var(--t2-accent)' }}>{hero.eyebrow}</p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#ffffff', maxWidth: 860 }}>
            {hero.heading}
          </h1>
          <p style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 16, fontWeight: 300,
            lineHeight: 1.8, color: 'rgba(255,255,255,0.8)',
            maxWidth: 620, marginTop: 20,
          }}>
            {hero.body}
          </p>
        </div>
      </section>

      {/* ── Grid section ── */}
      <section style={{ background: 'var(--t2-bg)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto' }}>
          <T2ExperiencesGrid
            products={visibleProducts}
            agentId={agentId}
            showCategoryTabs={!isWWT}
            restLabel={isWWT ? 'More Hotel Programs' : 'All Partners'}
          />
        </div>
      </section>

      {/* ── Traveller CTA band ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '120px 24px', textAlign: 'center',
      }}>
        {/* Background image */}
        <Image
          src="/media/hero images/four-seasons-yacht-hero.jpg"
          alt="Plan your journey"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,8,6,0.55) 0%, rgba(10,8,6,0.75) 100%)',
        }} />

        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <p className="t2-label" style={{ marginBottom: 16, color: 'var(--t2-accent)' }}>Ready to Travel</p>
          <h2 className="t2-heading t2-heading-lg" style={{ color: '#ffffff', marginBottom: 20 }}>
            Plan Your Perfect Journey
          </h2>
          <p style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 15, lineHeight: 1.9,
            color: 'rgba(255,255,255,0.65)', marginBottom: 36,
          }}>
            Every experience on this page is available exclusively through your advisor. Get in touch and we&rsquo;ll handle every detail — from booking to beyond.
          </p>
          <a
            href={`/t2/${agentId}/contact`}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: 500,
              padding: '16px 40px',
              background: 'var(--t2-accent)', color: '#1c1917',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
          >
            Start Planning
          </a>
        </div>
      </section>
    </>
  )
}
