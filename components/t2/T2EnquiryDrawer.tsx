'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { SupplierProduct } from '@/lib/collections'

interface T2EnquiryDrawerProps {
  product: SupplierProduct | null
  onClose: () => void
}

export function T2EnquiryDrawer({ product, onClose }: T2EnquiryDrawerProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const isOpen = !!product

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // Simulate a brief async submit — wire up to real API later
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setSubmitted(true)
  }

  const handleClose = () => {
    onClose()
    // Reset after transition finishes
    setTimeout(() => setSubmitted(false), 400)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28,25,23,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1100,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Enquire about ${product?.title ?? 'this experience'}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(540px, 100vw)',
          background: '#FAFAF8',
          zIndex: 1101,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
            borderBottom: '1px solid var(--t2-divider)',
            position: 'sticky',
            top: 0,
            background: '#FAFAF8',
            zIndex: 2,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--t2-accent)',
                marginBottom: 4,
              }}
            >
              {product?.subcategory ?? product?.category}
            </p>
            <p
              style={{
                fontFamily: 'var(--t2-font-serif)',
                fontSize: 18,
                fontWeight: 400,
                color: 'var(--t2-text)',
                lineHeight: 1.2,
              }}
            >
              {product?.title ?? 'Begin Planning'}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: '1px solid var(--t2-divider)',
              cursor: 'pointer',
              padding: '8px 10px',
              lineHeight: 0,
              transition: 'border-color 0.2s ease',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '32px', flex: 1 }}>
          {/* Product context strip */}
          {product?.logo_url && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                background: '#F0EDE8',
                marginBottom: 28,
              }}
            >
              <Image
                src={product.logo_url}
                alt={product.supplier_name}
                width={120}
                height={40}
                style={{ objectFit: 'contain', maxHeight: 36, filter: 'grayscale(100%)', opacity: 0.7 }}
                unoptimized
              />
              {product.location && (
                <>
                  <div style={{ width: 1, height: 14, background: 'var(--t2-divider)' }} />
                  <span style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--t2-text-muted)' }}>
                    {product.location}
                  </span>
                </>
              )}
            </div>
          )}

          {submitted ? (
            /* Success state */
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(180,154,90,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t2-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 26, fontWeight: 400, color: 'var(--t2-text)', marginBottom: 10 }}>
                Thank You
              </p>
              <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, lineHeight: 1.8, color: 'var(--t2-text-muted)', maxWidth: 320, margin: '0 auto 32px' }}>
                We've received your enquiry about <em>{product?.title}</em>. Expect to hear from us within one business day.
              </p>
              <button
                onClick={handleClose}
                className="t2-btn t2-btn-outline"
                style={{ fontSize: 10, letterSpacing: '0.2em' }}
              >
                Close
              </button>
            </div>
          ) : (
            /* Form */
            <>
              <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, lineHeight: 1.8, color: 'var(--t2-text-muted)', marginBottom: 28 }}>
                Tell us a little about your ideal trip and we'll be in touch with a personalised proposal.
              </p>

              <form onSubmit={handleSubmit}>
                {/* Hidden context fields */}
                <input type="hidden" name="product_id"    value={product?.id ?? ''} />
                <input type="hidden" name="product_title" value={product?.title ?? ''} />
                <input type="hidden" name="category"      value={product?.category ?? ''} />

                {/* Name row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label className="t2-form-label">First Name *</label>
                    <input type="text" name="first_name" required className="t2-input" placeholder="Jane" />
                  </div>
                  <div>
                    <label className="t2-form-label">Last Name *</label>
                    <input type="text" name="last_name" required className="t2-input" placeholder="Smith" />
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label className="t2-form-label">Email Address *</label>
                  <input type="email" name="email" required className="t2-input" placeholder="jane@email.com" />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label className="t2-form-label">Phone Number</label>
                  <input type="tel" name="phone" className="t2-input" placeholder="+1 (555) 000-0000" />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label className="t2-form-label">Approximate Travel Dates</label>
                  <input type="text" name="travel_dates" className="t2-input" placeholder="e.g. September 2025, flexible" />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label className="t2-form-label">Tell us about your trip vision</label>
                  <textarea
                    name="message"
                    className="t2-input t2-textarea"
                    placeholder="Number of travellers, any special requests, must-have experiences…"
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="t2-btn t2-btn-primary"
                  style={{ width: '100%', textAlign: 'center', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s ease' }}
                >
                  {loading ? 'Sending…' : 'Send Enquiry'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        .t2-form-label {
          display: block;
          font-family: var(--t2-font-sans);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--t2-text-muted);
          margin-bottom: 6px;
        }
        .t2-form-label + .t2-input {
          width: 100%;
          box-sizing: border-box;
        }
      `}</style>
    </>
  )
}
