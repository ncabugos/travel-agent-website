import Image from 'next/image'

interface BrandStoryProps {
  /** Two destination images for the stacked-left column */
  image1Src?: string
  image1Alt?: string
  image2Src?: string
  image2Alt?: string
}

const DEFAULT_IMG1 = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=85'
const DEFAULT_IMG2 = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=85'

export function BrandStory({
  image1Src = DEFAULT_IMG1,
  image1Alt = 'Destination landscape',
  image2Src = DEFAULT_IMG2,
  image2Alt = 'Luxury villa interior',
}: BrandStoryProps) {
  const serif = 'var(--font-serif)'
  const sans = 'var(--font-sans)'

  return (
    <section
      style={{
        background: '#FFFFFF',
        padding: '120px 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: '0',
        }}
        className="brand-story-grid"
      >
        {/* Left — two offset images: small framed left, large flush right */}
        <div
          style={{
            position: 'relative',
            height: '580px',
            padding: '0 32px 0 64px',
          }}
          className="brand-story-images"
        >
          {/* Image 1 — smaller, lower, framed (no border line) */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '40px',
              width: '42%',
              aspectRatio: '4/5',
              padding: '10px',
              background: '#FFFFFF',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              zIndex: 2,
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              <Image
                src={image1Src}
                alt={image1Alt}
                fill
                sizes="(max-width: 768px) 100vw, 20vw"
                className="img-zoom"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </div>

          {/* Image 2 — larger, flush top-right, no border */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '62%',
              height: '88%',
              overflow: 'hidden',
              zIndex: 1,
            }}
            className="img-zoom-parent"
          >
            <Image
              src={image2Src}
              alt={image2Alt}
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className="img-zoom"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
        </div>

        {/* Right — copy */}
        <div style={{ padding: '0 80px 0 48px' }} className="brand-story-copy">
          {/* Overline */}
          <p
            style={{
              fontFamily: sans,
              fontSize: '9px',
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              color: '#B5945A',
              marginBottom: '28px',
            }}
          >
            Our Philosophy
          </p>

          {/* Headline */}
          <h2
            style={{
              fontFamily: serif,
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 300,
              lineHeight: 1.15,
              color: 'var(--charcoal)',
              marginBottom: '28px',
              letterSpacing: '-0.01em',
            }}
          >
            Offering a bit of&nbsp;<br />
            <em>&ldquo;Eden&rdquo;</em>&nbsp;to the<br />
            discerning world traveler
          </h2>

          {/* Gold rule */}
          <div
            style={{
              width: '48px',
              height: '1px',
              background: '#B5945A',
              marginBottom: '28px',
            }}
          />

          {/* Body */}
          <p
            style={{
              fontFamily: sans,
              fontSize: '15px',
              lineHeight: '1.9',
              color: 'var(--warm-gray)',
              marginBottom: '20px',
            }}
          >
            Our goal is to improve the way you travel. We visit both new and
            time-honored destinations every year, refreshing our lists and
            ensuring that we offer the most up to date and interesting guidance
            throughout your experience booking with us.
          </p>

          <p
            style={{
              fontFamily: sans,
              fontSize: '15px',
              lineHeight: '1.9',
              color: 'var(--warm-gray)',
            }}
          >
            We&rsquo;ll help you find Eden anywhere you want to go — whether
            you&rsquo;re looking to embark on a classic cultural exploration of
            Italy or France, a luxury spa vacation on a tropical resort, or a
            boots-on-the-ground adventure through the Amazon rainforest.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .brand-story-grid {
            grid-template-columns: 1fr !important;
          }
          .brand-story-images {
            padding: 0 24px !important;
            margin-bottom: 48px;
          }
          .brand-story-copy {
            padding: 0 24px !important;
          }
        }
      `}</style>
    </section>
  )
}
