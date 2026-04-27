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
    <section className="t2-section-dark t2-lead-form-section" style={{ padding: 'var(--t2-section-pad) 24px' }}>
      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
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
            color: 'rgba(255,255,255,0.78)',
            marginBottom: 40,
          }}
        >
          {subheading}
        </p>

        {submitted ? (
          <div
            style={{
              padding: 40,
              borderRadius: 12,
              background: 'rgba(180,154,90,0.12)',
              border: '1px solid rgba(180,154,90,0.35)',
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
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              We&apos;ve received your request and will be in touch shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="t2-lead-form">
            <div className="t2-lead-form-row">
              <input
                type="text"
                placeholder="First Name *"
                required
                className="t2-lead-input"
              />
              <input
                type="text"
                placeholder="Last Name *"
                required
                className="t2-lead-input"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address *"
              required
              className="t2-lead-input"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="t2-lead-input"
            />
            <textarea
              placeholder="Tell us about your travel goals..."
              className="t2-lead-input t2-lead-textarea"
            />
            <button type="submit" className="t2-lead-submit">
              <span>Submit Request</span>
            </button>
          </form>
        )}
      </div>

      <style>{`
        .t2-lead-form-section {
          position: relative;
          overflow: hidden;
        }
        .t2-lead-form-section::before {
          content: '';
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 900px;
          background: radial-gradient(circle, rgba(180,154,90,0.14) 0%, rgba(180,154,90,0) 60%);
          pointer-events: none;
          z-index: 0;
        }
        .t2-lead-form-section > div { position: relative; z-index: 1; }

        .t2-lead-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
        }
        .t2-lead-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 520px) {
          .t2-lead-form-row { grid-template-columns: 1fr; }
        }

        .t2-lead-input {
          width: 100%;
          padding: 16px 18px;
          font-family: var(--t2-font-sans);
          font-size: 15px;
          font-weight: 300;
          color: #FFFFFF;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 10px;
          outline: none;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition:
            background-color 0.25s var(--t2-ease),
            border-color 0.25s var(--t2-ease),
            box-shadow 0.25s var(--t2-ease),
            transform 0.25s var(--t2-ease);
        }
        .t2-lead-input::placeholder {
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.02em;
          font-weight: 300;
        }
        .t2-lead-input:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.28);
        }
        .t2-lead-input:focus {
          background: rgba(255,255,255,0.09);
          border-color: rgba(180,154,90,0.75);
          box-shadow:
            0 0 0 4px rgba(180,154,90,0.15),
            0 6px 24px -8px rgba(0,0,0,0.5);
        }
        .t2-lead-input:focus::placeholder {
          color: rgba(255,255,255,0.72);
        }
        .t2-lead-input:not(:placeholder-shown) {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.32);
        }
        .t2-lead-input:-webkit-autofill,
        .t2-lead-input:-webkit-autofill:hover,
        .t2-lead-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #FFFFFF;
          -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.08) inset;
          caret-color: #FFFFFF;
        }

        .t2-lead-textarea {
          resize: vertical;
          min-height: 128px;
          line-height: 1.6;
        }

        .t2-lead-submit {
          margin-top: 10px;
          width: 100%;
          padding: 16px 24px;
          font-family: var(--t2-font-sans);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #0E0E0E;
          background: linear-gradient(135deg, #F5F0E8 0%, #E6D9B8 100%);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition:
            transform 0.25s var(--t2-ease),
            box-shadow 0.25s var(--t2-ease),
            background-position 0.5s var(--t2-ease);
          background-size: 200% 100%;
          background-position: 0% 0%;
          box-shadow: 0 10px 30px -12px rgba(180,154,90,0.45);
        }
        .t2-lead-submit:hover {
          transform: translateY(-1px);
          background-position: 100% 0%;
          box-shadow: 0 14px 36px -10px rgba(180,154,90,0.6);
        }
        .t2-lead-submit:active {
          transform: translateY(0);
          box-shadow: 0 6px 18px -8px rgba(180,154,90,0.5);
        }
        .t2-lead-submit > span {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </section>
  )
}
