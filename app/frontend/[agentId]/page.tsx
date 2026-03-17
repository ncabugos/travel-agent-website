import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAgentProfile, getAgentSuppliers } from '@/lib/suppliers'

import { SupplierGrid } from '@/components/suppliers/SupplierGrid'
import { HeroSlider } from '@/components/home/HeroSlider'
import { TeamIntroBand } from '@/components/home/TeamIntroBand'
import { BrandStory } from '@/components/home/BrandStory'
import { WhyTravelWithUs } from '@/components/home/WhyTravelWithUs'
import { CuratedExperiences } from '@/components/home/CuratedExperiences'
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel'
import { SocialFeed } from '@/components/home/SocialFeed'
import { ContactSection } from '@/components/home/ContactSection'
import { getBlogPosts } from '@/lib/blog'
import { ProgramLogoGrid } from '@/components/hotel-programs/ProgramLogoGrid'
import { getHotelPrograms } from '@/lib/hotel-programs'
import { EDEN } from '@/lib/media-library'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return {}
  return {
    title: `${agent.agency_name} — Luxury Travel`,
    description: `Curated luxury travel by ${agent.full_name} at ${agent.agency_name}.`,
  }
}

// ── Hero Slides ─────────────────────────────────────────────────────────────
const getHeroSlides = (base: string) => [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=85',
    alt: 'Mountain reflected in alpine lake',
    headline: 'Where the World\nBecomes Extraordinary',
    subheadline: 'Bespoke journeys crafted for the discerning traveller.',
    ctaLabel: 'Start Planning',
    ctaHref: `${base}/contact`,
  },
  {
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=2000&q=85',
    alt: 'Hot air balloons over landscape',
    headline: 'Every Detail.\nPerfectly Curated.',
    subheadline: 'From overwater villas to private safari concessions.',
    ctaLabel: 'Explore Programs',
    ctaHref: `${base}/resources`,
  },
  {
    src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=2000&q=85',
    alt: 'Tropical overwater bungalows at sunset',
    headline: 'Life is Short.\nTravel Beautifully.',
    subheadline: 'As a Virtuoso member, we unlock exclusive benefits at the world\'s finest hotels.',
    ctaLabel: 'Start Planning',
    ctaHref: `${base}/contact`,
  },
  // Eden-specific slides
  {
    src: '/media/hotel-programs/four-seasons/fs-maui-ocean_suite-3840x2160.jpg',
    alt: 'Four Seasons Maui Ocean Suite',
    headline: 'A Virtuoso\nTravel Agency',
    subheadline: 'Preferred access, exclusive amenities, and a team that\'s been where you want to go.',
    ctaLabel: 'Meet The Team',
    ctaHref: `${base}/about`,
  },
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2000&q=85',
    alt: 'Scenic mountain pass at dusk',
    headline: 'We\'ve been to\nover 90 countries',
    subheadline: 'Condé Nast Traveler Top Travel Specialists — for good reason.',
    ctaLabel: 'Learn About Us',
    ctaHref: `${base}/about`,
  },
]

export default async function AgentHomePage({ params }: PageProps) {
  const { agentId } = await params

  const [agent, suppliers, blogPosts, hotelPrograms] = await Promise.all([
    getAgentProfile(agentId),
    getAgentSuppliers(agentId),
    getBlogPosts(agentId),
    getHotelPrograms(),
  ])

  if (!agent) notFound()

  const serif = 'var(--font-serif)'
  const sans = 'var(--font-sans)'
  const base = `/frontend/${agentId}`

  return (
    <main style={{ background: '#FFFFFF' }}>

      {/* ─────────────────────────────────────────────────────────────────────
          1. HERO SLIDER — full-viewport cinematic slider
             CNT badge: bottom-left (luxury editorial standard)
          ───────────────────────────────────────────────────────────────────── */}
      <HeroSlider slides={getHeroSlides(base)} showBadge={true} />

      {/* ─────────────────────────────────────────────────────────────────────
          2. TEAM INTRO BAND — warm gold section with portrait + tagline
          ───────────────────────────────────────────────────────────────────── */}
      <TeamIntroBand
        agentId={agentId}
        photoUrl={agent.avatar_url ?? EDEN.teamCircle}
        agencyName={agent.agency_name}
        tagline={agent.tagline}
        learnMoreHref={`${base}/about`}
      />

      {/* ─────────────────────────────────────────────────────────────────────
          3. BRAND STORY — 2-col: stacked images left, editorial copy right  
          ───────────────────────────────────────────────────────────────────── */}
      <BrandStory
        image1Src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=85"
        image1Alt="Scenic travel landscape"
        image2Src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=85"
        image2Alt="Luxury villa interior"
      />

      {/* ─────────────────────────────────────────────────────────────────────
          4. WHY TRAVEL WITH US — 3-pillar cream section
          ───────────────────────────────────────────────────────────────────── */}
      <WhyTravelWithUs agentId={agentId} learnMoreHref={`${base}/about`} />

      {/* ─────────────────────────────────────────────────────────────────────
          5. CURATED EXPERIENCES — 3-col blog journal grid
          ───────────────────────────────────────────────────────────────────── */}
      <CuratedExperiences posts={blogPosts} agentId={agentId} />

      {/* ─────────────────────────────────────────────────────────────────────
          6. EXCLUSIVE HOTEL PROGRAMS — logo grid on white
          ───────────────────────────────────────────────────────────────────── */}
      <section id="hotel-programs" style={{ background: '#FFFFFF', padding: '120px 24px', scrollMarginTop: '108px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '24px',
              }}
            >
              <div style={{ width: '48px', height: '1px', background: 'rgba(181,148,90,0.4)' }} />
              <p
                style={{
                  fontFamily: sans,
                  fontSize: '9px',
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: '#B5945A',
                  margin: 0,
                }}
              >
                Exclusive Partners
              </p>
              <div style={{ width: '48px', height: '1px', background: 'rgba(181,148,90,0.4)' }} />
            </div>
            <h2
              style={{
                fontFamily: serif,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 300,
                color: 'var(--charcoal)',
                lineHeight: 1.2,
              }}
            >
              Exclusive Hotel Programs
            </h2>
            <p
              style={{
                fontFamily: sans,
                fontSize: '14px',
                color: 'var(--warm-gray)',
                lineHeight: 1.8,
                maxWidth: '520px',
                margin: '20px auto 0',
              }}
            >
              As a Virtuoso member agency, we offer preferred perks and exclusive benefits
              through the world's most prestigious hotel loyalty programs.
            </p>
          </div>
          <ProgramLogoGrid programs={hotelPrograms} agentId={agentId} />
          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <Link
              href={`${base}/resources`}
              style={{
                display: 'inline-block',
                fontFamily: sans,
                fontSize: '10px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                background: '#B5945A',
                border: '1px solid #B5945A',
                padding: '16px 44px',
                textDecoration: 'none',
              }}
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          7. CLIENT TESTIMONIALS — auto-advancing carousel
          ───────────────────────────────────────────────────────────────────── */}
      <TestimonialsCarousel />

      {/* ─────────────────────────────────────────────────────────────────────
          8. SOCIAL FEED — 3×2 IG grid + dark panel
          ───────────────────────────────────────────────────────────────────── */}
      <SocialFeed
        instagramHandle={
          agent.instagram_url
            ? agent.instagram_url.replace(/.*instagram\.com\//, '').replace(/\/$/, '')
            : 'edenforyourworld'
        }
        agentId={agentId}
      />

      {/* ─────────────────────────────────────────────────────────────────────
          9. CONTACT / PLAN YOUR TRIP — 2-col, image + contact info
          ───────────────────────────────────────────────────────────────────── */}
      <ContactSection agent={agent} agentId={agentId} />

    </main>
  )
}
