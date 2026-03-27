'use client'

import { useState } from 'react'

interface T2LeadFormProps {
  heading?: string
  subheading?: string
}

export function T2LeadForm({
  heading = 'Plan Your Trip',
  subheading = 'We know travel inside and out, and we\'re ready to make your dream vacation a reality. Schedule an appointment and we can chat about your future travels.',
}: T2LeadFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire up form submission
    setSubmitted(true)
  }

  return (
    <section className="t2-section-dark" style={{ padding: 'var(--t2-section-pad) 24px' }}>
      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p className="t2-label" style={{ marginBottom: 12 }}>Get Started</p>
        <h2
          className="t2-heading t2-heading-lg"
          style={{ color: '#FFFFFF', marginBottom: 16 }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 15,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 40,
          }}
        >
          {subheading}
        </p>

        {submitted ? (
          <div
            style={{
              padding: 40,
              borderRadius: 'var(--t2-radius-lg)',
              background: 'rgba(180,154,90,0.1)',
              border: '1px solid rgba(180,154,90,0.3)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--t2-font-serif)',
                fontSize: 24,
                color: '#FFFFFF',
                marginBottom: 8,
              }}
            >
              Thank You
            </p>
            <p
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 14,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              We&apos;ve received your request and will be in touch shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="First Name *"
                required
                className="t2-input"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', paddingLeft: 14 }}
              />
              <input
                type="text"
                placeholder="Last Name *"
                required
                className="t2-input"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', paddingLeft: 14 }}
              />
            </div>
            <input
              type="email"
              placeholder="Email Address *"
              required
              className="t2-input"
              style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', marginBottom: 16, paddingLeft: 14 }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="t2-input"
              style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', marginBottom: 16, paddingLeft: 14 }}
            />
            <textarea
              placeholder="Tell us about your travel goals..."
              className="t2-input t2-textarea"
              style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', marginBottom: 24, paddingLeft: 14 }}
            />
            <button
              type="submit"
              className="t2-btn t2-btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Submit Request
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
