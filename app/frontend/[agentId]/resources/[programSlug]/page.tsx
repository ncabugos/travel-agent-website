import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAgentProfile } from '@/lib/suppliers'
import { getHotelProgram, getAllHotelProgramSlugs } from '@/lib/hotel-programs'
import { BenefitsList } from '@/components/hotel-programs/BenefitsList'
import { GallerySlider } from '@/components/hotel-programs/GallerySlider'
import { HOTEL_GALLERY } from '@/lib/media-library'

interface PageProps {
  params: Promise<{ agentId: string; programSlug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllHotelProgramSlugs()
  return slugs.map(slug => ({ programSlug: slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { programSlug } = await params
  const program = await getHotelProgram(programSlug)
  if (!program) return {}
  return {
    title: `${program.name} — Exclusive Hotel Benefits`,
    description: program.tagline ?? program.description ?? undefined,
  }
}

// Category display labels and accent colours
const CATEGORY_META: Record<string, { label: string }> = {
  invitation_only:   { label: 'Invitation-Only Programme' },
  brand_programme:   { label: 'Brand Programme' },
  luxury_collection: { label: 'Luxury Collection' },
  global_network:    { label: 'Global Network' },
}

// Fallback gallery using hero shots from the media library
const FALLBACK_GALLERY = [
  { src: '/media/hotel-programs/aman/overwater_c42d1ec6ef-scaled.jpg', alt: 'Overwater villa' },
  { src: '/media/hotel-programs/peninsula/peninsula-hero.jpg',          alt: 'Grand hotel' },
  { src: '/media/hotel-programs/kempinski/kempinski-hero-scaled.jpg',   alt: 'Luxury suite' },
]

/** Convert HOTEL_GALLERY string[] to the {src, alt?} shape expected by GallerySlider */
function toSlides(slug: string) {
  const imgs = HOTEL_GALLERY[slug]
  if (!imgs || imgs.length === 0) return null
  return imgs.map((src: string) => ({ src }))
}

const serif = 'var(--font-serif)'
const sans  = 'var(--font-sans)'

// White transparent brand logos for hero overlay — keyed by program slug
// Paths use %20 for spaces and %26 for & since these are URL-served static files
const BASE_LOGO = '/assets/supplier%20logos/white%20transparent'
const HERO_LOGO: Record<string, string> = {
  // Programs with dedicated white-transparent webp/png assets
  'belmond-bellini-club':                   `${BASE_LOGO}/belmond-bellini_club.webp`,
  'four-seasons-preferred-partner':         `${BASE_LOGO}/FS_preferred-600.webp`,
  'aman-hotels-and-resorts':               `${BASE_LOGO}/Aman-white-600.png`,
  'auberge-resorts-collection':            `${BASE_LOGO}/auberge-logo-white-600.webp`,
  'montage-hotels':                        `${BASE_LOGO}/montage-white-600.webp`,
  'one-and-only-hotels-and-resorts':       `${BASE_LOGO}/one%26only-white-600.webp`,
  'mandarin-oriental-fan-club':            `${BASE_LOGO}/mandarin-oriental-fan-club-Mandarin-white-600.webp`,
  'marriott-international-luminous':       `${BASE_LOGO}/marriott-stars_luminous.webp`,
  'rosewood-elite':                        `${BASE_LOGO}/rosewood-elite-white.webp`,
  'dorchester-diamond-club':               `${BASE_LOGO}/dorchester-logo-white.webp`,
  'oetker-hotel-collection-pearl-partner': `${BASE_LOGO}/oetker-pearl-white-600.webp`,
  'kempinski-club-1897':                   `${BASE_LOGO}/Kempinski-Club1897-white-600.webp`,
  'peninsula-pen-club':                    `${BASE_LOGO}/Peninsula_PenClub-white-600.webp`,
  'rocco-forte-hotels':                    `${BASE_LOGO}/Rocco_Forte-White-600.webp`,
  'shangri-la-hotels-the-luxury-circle':   `${BASE_LOGO}/ShangriLa-white-600.webp`,
  // Generated white-on-transparent PNGs from colour jpgs
  'ritz-carlton-stars':                    `${BASE_LOGO}/ritz-carlton-stars-white.png`,
  'hera-accor-hotels':                     `${BASE_LOGO}/accor-hera-white.png`,
  'como-hotels':                           `${BASE_LOGO}/como-hotels-white.png`,
  'hyatt-prive':                           `${BASE_LOGO}/HyattPrive_white-transparent.webp`,
  'leading-hotels-of-the-world':           `${BASE_LOGO}/LeadingHotels-white-600.webp`,
}

export default async function HotelProgramDetailPage({ params }: PageProps) {
  const { agentId, programSlug } = await params

  const [agent, program] = await Promise.all([
    getAgentProfile(agentId),
    getHotelProgram(programSlug),
  ])

  if (!agent || !program) notFound()

  const base        = `/frontend/${agentId}`
  const categoryMeta = program.category ? CATEGORY_META[program.category] : null

  // Pick gallery from the media library registry, fallback to local set
  const galleryImages = toSlides(programSlug) ?? FALLBACK_GALLERY
  const heroImg       = galleryImages[0]?.src ?? '/media/hotel-programs/peninsula/peninsula-hero.jpg'
  const heroLogo      = HERO_LOGO[programSlug] ?? null

  return (
    <main style={{ background: 'var(--cream)' }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '70vh', minHeight: '480px', overflow: 'hidden' }}>
        <Image
          src={heroImg}
          alt={program.name}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,18,16,0.3) 0%, rgba(20,18,16,0.65) 100%)' }} />

        {/* Headline */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          textAlign: 'center',
          padding: '0 24px 72px',
        }}>
          {/* Brand logo — white transparent, above category label */}
          {heroLogo && (
            <div style={{ marginBottom: '28px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroLogo}
                alt={program.name}
                style={{
                  maxWidth: '220px',
                  maxHeight: '80px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.3))',
                  opacity: 0.92,
                }}
              />
            </div>
          )}

          <h1 style={{
            fontFamily: serif,
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            fontWeight: 300,
            color: '#FFFFFF',
            lineHeight: 1.1,
            marginBottom: '20px',
            maxWidth: '900px',
          }}>
            {program.name}
          </h1>
          {program.tagline && (
            <p style={{
              fontFamily: sans,
              fontSize: '15px',
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '600px',
              lineHeight: '1.7',
              fontStyle: 'italic',
            }}>
              {program.tagline}
            </p>
          )}
        </div>
      </div>

      {/* ── Programme Description ─────────────────────────────────── */}
      {(program.description || program.property_count) && (
        <section style={{ padding: '100px 24px', textAlign: 'center', background: 'var(--cream)' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {program.property_count && (
              <p className="section-label" style={{ marginBottom: '16px' }}>
                {program.property_count.toLocaleString()}+ Participating Properties
              </p>
            )}
            {program.description && (
              <p style={{
                fontFamily: sans,
                fontSize: '16px',
                color: 'var(--warm-gray)',
                lineHeight: '1.9',
              }}>
                {program.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Divider */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)' }} />
      </div>

      {/* ── Benefits ──────────────────────────────────────────────── */}
      {program.benefits.length > 0 && (
        <section style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '56px' }}>
              <p className="section-label" style={{ marginBottom: '12px' }}>What&#39;s Included</p>
              <h2 style={{
                fontFamily: serif,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 300,
                color: 'var(--charcoal)',
                lineHeight: 1.2,
              }}>
                Exclusive Benefits for Our Clients
              </h2>
            </div>
            <BenefitsList benefits={program.benefits} />
          </div>
        </section>
      )}

      {/* Divider */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid var(--divider)' }} />
      </div>

      {/* ── Image Gallery ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 0 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px', padding: '0 24px' }}>
          <p style={{
            fontFamily: sans,
            fontSize: '9px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#B5945A',
            marginBottom: '14px',
          }}>
            Gallery
          </p>
          <h2 style={{
            fontFamily: serif,
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 300,
            color: 'var(--charcoal)',
            lineHeight: 1.2,
          }}>
            Experience {program.name}
          </h2>
        </div>
        <GallerySlider images={galleryImages} />
      </section>

      {/* ── How to Book ───────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', textAlign: 'center', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={{
            fontFamily: sans,
            fontSize: '16px',
            color: 'var(--warm-gray)',
            lineHeight: '1.85',
          }}>
            Simply contact us and enjoy special VIP perks and amenities not available when booking online.
          </p>
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Image
          src="/media/hero images/four-seasons-taormina-exterior-hero.jpg"
          alt="Book your stay"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,0.72)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '80px 24px' }}>
          <p style={{
            fontFamily: sans,
            fontSize: '9px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '16px',
          }}>
            Ready to Book?
          </p>
          <h2 style={{
            fontFamily: serif,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 300,
            color: '#FFFFFF',
            lineHeight: 1.15,
            marginBottom: '12px',
          }}>
            Book with {agent.agency_name}
          </h2>
          <p style={{
            fontFamily: sans,
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '36px',
            lineHeight: '1.7',
          }}>
            Contact us to unlock every {program.name} benefit on your next stay.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="btn-gold">
              Start Planning
            </Link>
            <Link
              href={`${base}/resources`}
              style={{
                display: 'inline-block',
                padding: '13px 28px',
                fontFamily: sans,
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
