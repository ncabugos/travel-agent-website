'use client'

import { useState, useEffect } from 'react'

interface Testimonial {
  quote: string
  author: string
  location?: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "These are the guys that people are talking about. They have been there, and done that, and they have made lifelong connections on their way. They can accommodate all of your party's needs and wants. They have personally handled many family and large group travels we have participated in and have been nothing short of blown away at all of the adventures they have arranged for us over the years. Thanks Eden!",
    author: 'Heather Rudy',
    location: 'Long Beach, CA',
  },
  {
    quote:
      'Eden For Your World planned a flawless trip for our family to Italy — every detail was considered, and every property was exceptional. They have an unparalleled network and the expertise to match. We will never book travel any other way.',
    author: 'David & Sarah Whitmore',
    location: 'Newport Beach, CA',
  },
  {
    quote:
      "Working with Eden is genuinely transformative. Our Maldives journey exceeded every expectation — the suite upgrade, the spa credits, the private dinner on the sandbank. None of that happens without a trusted advisor who knows exactly where to call.",
    author: 'Marcus Chen',
    location: 'San Francisco, CA',
  },
  {
    quote:
      "I've used luxury travel agencies my entire adult life, and Eden stands alone. Their Virtuoso connections are second to none. The moment we arrived at every property we were treated as VIPs — not just guests. That is the Eden difference.",
    author: 'Catherine Marlowe',
    location: 'Los Angeles, CA',
  },
]

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = (i: number) => {
    if (i === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(i)
      setFading(false)
    }, 450)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((current + 1) % TESTIMONIALS.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [current]) // eslint-disable-line react-hooks/exhaustive-deps

  const t = TESTIMONIALS[current]
  const serif = 'var(--font-serif)'
  const sans = 'var(--font-sans)'

  return (
    <section
      style={{
        background: '#F5F3F0',
        padding: '120px 24px',
      }}
    >
      <div style={{ maxWidth: '920px', margin: '0 auto', textAlign: 'center' }}>
        {/* Section label */}
        <p
          style={{
            fontFamily: sans,
            fontSize: '9px',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: '#B5945A',
            marginBottom: '48px',
          }}
        >
          Client Testimonials
        </p>

        {/* Large decorative open-quote */}
        <div
          style={{
            fontFamily: serif,
            fontSize: '80px',
            lineHeight: 0.6,
            color: 'rgba(181,148,90,0.2)',
            marginBottom: '32px',
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          &ldquo;
        </div>

        {/* Quote */}
        <blockquote
          style={{
            margin: 0,
            padding: 0,
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.45s ease',
          }}
        >
          <p
            style={{
              fontFamily: serif,
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.85,
              color: 'var(--charcoal)',
              marginBottom: '36px',
            }}
          >
            {t.quote}
          </p>

          {/* Gold rule */}
          <div
            style={{
              width: '32px',
              height: '1px',
              background: '#B5945A',
              margin: '0 auto 24px',
            }}
          />

          {/* Author */}
          <cite
            style={{
              fontStyle: 'normal',
              fontFamily: sans,
              fontSize: '10px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#B5945A',
            }}
          >
            {t.author}
            {t.location && (
              <span style={{ color: 'var(--warm-gray)', marginLeft: '12px' }}>
                — {t.location}
              </span>
            )}
          </cite>
        </blockquote>

        {/* Dot navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '56px',
          }}
        >
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width: i === current ? '28px' : '6px',
                height: '2px',
                background: i === current ? '#B5945A' : 'rgba(181,148,90,0.3)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.4s ease, background 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
