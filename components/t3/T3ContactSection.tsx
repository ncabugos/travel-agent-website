'use client'
import { useState } from 'react'

interface T3ContactSectionProps {
  eyebrow?: string
  headline: string
  body?: string
  phone?: string
  email?: string
  address?: string
}

export function T3ContactSection({
  eyebrow = '07 — Begin the Conversation',
  headline,
  body,
  phone,
  email,
  address,
}: T3ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: wire to /api/leads when ready
    setSubmitted(true)
  }

  return (
    <section id="contact" className="t3-section t3-section-alt" style={{ maxWidth: '100%' }}>
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '0 48px',
        }}
        className="t3-contact-wrap"
      >
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span className="t3-eyebrow">{eyebrow}</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            {headline}
          </h2>
          {body && (
            <p
              className="t3-body t3-body-lg"
              style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto' }}
            >
              {body}
            </p>
          )}
        </div>

        {submitted ? (
          <div
            style={{
              padding: '48px 32px',
              border: '1px solid var(--t3-divider)',
              textAlign: 'center',
              background: 'var(--t3-bg)',
            }}
          >
            <h3 className="t3-headline-lg" style={{ marginBottom: 16 }}>
              Thank you
            </h3>
            <p className="t3-body" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              Your inquiry has been received. We&apos;ll respond personally within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'var(--t3-bg)', padding: '64px 64px' }} className="t3-contact-form">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px 48px',
                marginBottom: 40,
              }}
              className="t3-form-grid"
            >
              <Field label="First Name" name="firstName" required />
              <Field label="Last Name" name="lastName" required />
              <Field label="Email Address" name="email" type="email" required />
              <Field label="Phone Number" name="phone" type="tel" />
              <Field label="Destination of Interest" name="destination" full />
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="t3-label-field">Tell us about your journey</label>
                <textarea
                  name="message"
                  className="t3-input t3-textarea"
                  placeholder="Preferred dates, number of travelers, style of travel, any must-haves..."
                  rows={4}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 32,
                borderTop: '1px solid var(--t3-divider)',
                flexWrap: 'wrap',
                gap: 20,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: 'var(--t3-text-muted)',
                  maxWidth: 420,
                  lineHeight: 1.6,
                }}
              >
                By submitting this inquiry you consent to being contacted about travel planning. We never share your information.
              </p>
              <button type="submit" className="t3-btn t3-btn-solid">
                Send Inquiry
              </button>
            </div>
          </form>
        )}

        {/* Contact details strip */}
        {(phone || email || address) && (
          <div
            style={{
              marginTop: 72,
              paddingTop: 48,
              borderTop: '1px solid var(--t3-divider)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
              textAlign: 'center',
            }}
            className="t3-contact-meta"
          >
            {phone && <ContactItem label="By Phone" value={phone} />}
            {email && <ContactItem label="By Email" value={email} />}
            {address && <ContactItem label="Office" value={address} />}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 800px) {
          .t3-contact-wrap { padding: 0 24px !important; }
          .t3-contact-form { padding: 40px 32px !important; }
          .t3-form-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .t3-contact-meta { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  full,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  full?: boolean
}) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
      <label className="t3-label-field" htmlFor={`t3-${name}`}>
        {label}
        {required && <span style={{ color: 'var(--t3-accent)', marginLeft: 4 }}>*</span>}
      </label>
      <input
        id={`t3-${name}`}
        name={name}
        type={type}
        required={required}
        className="t3-input"
        placeholder=""
      />
    </div>
  )
}

function ContactItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--t3-accent)',
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--t3-font-display)',
          fontSize: 18,
          fontWeight: 400,
          color: 'var(--t3-text)',
          lineHeight: 1.4,
        }}
      >
        {value}
      </div>
    </div>
  )
}
