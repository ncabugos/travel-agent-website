'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { FeaturedHotel } from '@/lib/featured-hotels'

interface Props {
  hotels: FeaturedHotel[]
  programName: string
  agentId: string
}

export function T2FeaturedProperties({ hotels, programName, agentId }: Props) {
  const [enquireHotel, setEnquireHotel] = useState<FeaturedHotel | null>(null)

  if (!hotels || hotels.length === 0) return null

  return (
    <>
      {/* ── Featured Properties Section ── */}
      <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg-alt)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>
              Virtuoso Approved
            </p>
            <h2 className="t2-heading t2-heading-lg">
              Featured Properties
            </h2>
          </div>

          {/* 2×3 grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
            className="t2-fp-grid"
          >
            {hotels.map((hotel, i) => (
              <PropertyCard
                key={i}
                hotel={hotel}
                onEnquire={() => setEnquireHotel(hotel)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Enquire Modal ── */}
      {enquireHotel && (
        <EnquireModal
          hotel={enquireHotel}
          agentId={agentId}
          onClose={() => setEnquireHotel(null)}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .t2-fp-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .t2-fp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

// ── Single property card ────────────────────────────────────────────────────

function PropertyCard({ hotel, onEnquire }: { hotel: FeaturedHotel; onEnquire: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--t2-bg)',
        borderRadius: 'var(--t2-radius-lg)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 16px 48px rgba(0,0,0,0.12)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        <Image
          src={hotel.image_url}
          alt={hotel.name}
          fill
          unoptimized
          sizes="(max-width: 900px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
            transition: 'transform 0.6s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)',
          }}
        />
        {/* Location chip bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {hotel.city}, {hotel.country}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 22px 22px' }}>
        <h4
          style={{
            fontFamily: 'var(--t2-font-serif)',
            fontSize: 17,
            fontWeight: 500,
            marginBottom: 6,
            lineHeight: 1.3,
            color: 'var(--t2-text)',
          }}
        >
          {hotel.name}
        </h4>
        {hotel.description && (
          <p
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 13,
              lineHeight: 1.65,
              color: 'var(--t2-text-muted)',
              marginBottom: 18,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}
          >
            {hotel.description}
          </p>
        )}

        {/* Footer: Enquire button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onEnquire}
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '7px 16px',
              background: 'var(--t2-text)',
              color: 'var(--t2-bg)',
              border: 'none',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = 'var(--t2-accent)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = 'var(--t2-text)'
            }}
          >
            Enquire
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Enquire Modal ───────────────────────────────────────────────────────────

type FormState = 'idle' | 'submitting' | 'success' | 'error'

function EnquireModal({
  hotel,
  agentId,
  onClose,
}: {
  hotel: FeaturedHotel
  agentId: string
  onClose: () => void
}) {
  const [state, setState] = useState<FormState>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('submitting')
    // Simple 1.5s mock — swap for real form submission / Supabase insert
    await new Promise(r => setTimeout(r, 1500))
    setState('success')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 999,
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.25s ease',
        }}
      />

      {/* Modal panel */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          width: '92vw',
          maxWidth: 520,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--t2-bg)',
          padding: '48px 40px 40px',
          borderRadius: 4,
          boxShadow: '0 32px 80px rgba(0,0,0,0.20)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 20,
            right: 24,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: 'var(--t2-text-muted)',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {state === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p className="t2-label" style={{ color: 'var(--t2-accent)', marginBottom: 12 }}>
              Request Received
            </p>
            <h3 className="t2-heading t2-heading-sm" style={{ marginBottom: 12 }}>
              Thank you!
            </h3>
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, color: 'var(--t2-text-muted)' }}>
              We'll be in touch about <strong>{hotel.name}</strong> within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <p className="t2-label" style={{ marginBottom: 8, color: 'var(--t2-accent)' }}>
              Enquire
            </p>
            <h3 className="t2-heading t2-heading-sm" style={{ marginBottom: 4 }}>
              {hotel.name}
            </h3>
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, color: 'var(--t2-text-muted)', marginBottom: 28 }}>
              {hotel.city}, {hotel.country}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input
                  type="text"
                  placeholder="First Name *"
                  required
                  className="t2-input"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  required
                  className="t2-input"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address *"
                required
                className="t2-input"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="t2-input"
              />
              <textarea
                rows={4}
                placeholder={`Tell us about your travel dates and preferences for ${hotel.name}...`}
                className="t2-input t2-textarea"
              />
              <button
                type="submit"
                disabled={state === 'submitting'}
                className="t2-btn t2-btn-primary"
                style={{ width: '100%', textAlign: 'center', opacity: state === 'submitting' ? 0.65 : 1 }}
              >
                {state === 'submitting' ? 'Sending…' : 'Send Enquiry'}
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  )
}
