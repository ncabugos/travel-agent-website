'use client'

import { useActionState, useState } from 'react'
import { submitContactForm, type ContactFormState } from '@/lib/actions/contact'

interface Props {
  heading?: string
  subheading?: string
  /** Routes the enquiry to this advisor's inbox. Without it the server action
   *  falls back to the platform admin address. */
  agentId?: string
}

const initialState: ContactFormState = {}

// Light-scheme companion to T2LeadForm. Used by personas that want the lead
// capture to read as bright/editorial rather than the dark gradient default.
//
// Wired to the same submitContactForm server action as T2ContactForm: writes
// to `inquiries` and emails the advisor. It previously called preventDefault()
// and rendered the success panel without sending anything — and its inputs
// carried no `name` attributes — so every lead submitted here was discarded.
export function T2LeadFormLight({
  heading = 'Plan Your Trip',
  subheading = "Tell us where you want to go. We'll match you with the right hotels, cruises, and itineraries — and unlock Virtuoso perks on every booking.",
  agentId,
}: Props) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [renderedAt] = useState<number>(() => Date.now())
  const submitted = state.success === true

  return (
    <section className="t2-lead-light-section">
      <div className="t2-lead-light-inner">
        <p className="t2-label t2-lead-light-eyebrow">Get Started</p>
        <h2 className="t2-heading t2-heading-lg t2-lead-light-heading">{heading}</h2>
        <p className="t2-lead-light-sub">{subheading}</p>

        {submitted ? (
          <div className="t2-lead-light-success">
            <p className="t2-lead-light-success-title">Thank You</p>
            <p className="t2-lead-light-success-body">
              We&apos;ve received your request and will be in touch shortly.
            </p>
          </div>
        ) : (
          <form action={formAction} className="t2-lead-light-form">
            {agentId && <input type="hidden" name="agent_id" value={agentId} />}
            <input type="hidden" name="_rendered_at" value={String(renderedAt)} />

            {/* Honeypot — hidden from people, tempting to bots. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
              <input type="text" name="website_url" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            <div className="t2-lead-light-row">
              <input type="text" name="first_name" placeholder="First Name *" required autoComplete="given-name"  className="t2-lead-light-input" />
              <input type="text" name="last_name"  placeholder="Last Name *"  required autoComplete="family-name" className="t2-lead-light-input" />
            </div>
            <input type="email" name="email"       placeholder="Email Address *" required autoComplete="email" className="t2-lead-light-input" />
            <input type="tel"   name="phone"       placeholder="Phone Number"             autoComplete="tel"   className="t2-lead-light-input" />
            <input type="text"  name="destination" placeholder="Destination of Interest"                        className="t2-lead-light-input" />
            <textarea           name="message"     placeholder="Tell us about your travel goals…" className="t2-lead-light-input t2-lead-light-textarea" />

            {state.error && (
              <p role="alert" className="t2-lead-light-error">{state.error}</p>
            )}

            <button type="submit" className="t2-lead-light-submit" disabled={isPending}>
              <span>{isPending ? 'Sending…' : 'Submit Request'}</span>
            </button>
          </form>
        )}
      </div>

      <style>{`
        .t2-lead-light-section {
          position: relative;
          overflow: hidden;
          padding: var(--t2-section-pad) 24px;
          background: var(--t2-bg, #FAF9F7);
        }
        /* Soft warm wash behind the form — same idea as the dark variant's
           radial glow, but in ivory. Gives the section subtle depth without
           a hard divider from sections above/below. */
        .t2-lead-light-section::before {
          content: '';
          position: absolute;
          top: -25%;
          left: 50%;
          transform: translateX(-50%);
          width: 1100px;
          height: 1100px;
          background: radial-gradient(circle, rgba(184,146,106,0.10) 0%, rgba(184,146,106,0) 65%);
          pointer-events: none;
          z-index: 0;
        }
        .t2-lead-light-inner {
          position: relative;
          z-index: 1;
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
        }
        .t2-lead-light-eyebrow { margin-bottom: 14px; }
        .t2-lead-light-heading {
          color: var(--t2-text, #14120E);
          margin-bottom: 18px;
        }
        .t2-lead-light-sub {
          font-family: var(--t2-font-sans);
          font-size: 15px;
          line-height: 1.85;
          font-weight: 300;
          color: var(--t2-text-muted, rgba(20,18,14,0.62));
          margin: 0 auto 48px;
          max-width: 560px;
        }

        .t2-lead-light-error {
          font-family: var(--t2-font-sans);
          font-size: 13px;
          line-height: 1.6;
          color: #9B2C2C;
          margin: 0;
          text-align: left;
        }
        .t2-lead-light-success {
          padding: 48px 32px;
          background: #FFFFFF;
          border: 1px solid var(--t2-rule, rgba(0,0,0,0.08));
          border-top: 2px solid var(--t2-accent, #B8926A);
          box-shadow: 0 24px 60px -32px rgba(0,0,0,0.18);
        }
        .t2-lead-light-success-title {
          font-family: var(--t2-font-serif);
          font-size: 28px;
          font-weight: 400;
          color: var(--t2-text, #14120E);
          margin: 0 0 12px 0;
        }
        .t2-lead-light-success-body {
          font-family: var(--t2-font-sans);
          font-size: 14px;
          line-height: 1.65;
          color: var(--t2-text-muted, rgba(20,18,14,0.62));
          margin: 0;
        }

        .t2-lead-light-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
        }
        .t2-lead-light-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 520px) {
          .t2-lead-light-row { grid-template-columns: 1fr; }
        }

        .t2-lead-light-input {
          width: 100%;
          padding: 18px 20px;
          font-family: var(--t2-font-sans);
          font-size: 15px;
          font-weight: 400;
          color: var(--t2-text, #14120E);
          background: #FFFFFF;
          border: 1px solid var(--t2-rule, rgba(20,18,14,0.14));
          outline: none;
          transition:
            background-color 0.25s var(--t2-ease),
            border-color 0.25s var(--t2-ease),
            box-shadow 0.25s var(--t2-ease);
        }
        .t2-lead-light-input::placeholder {
          color: var(--t2-text-muted, rgba(20,18,14,0.45));
          font-weight: 300;
          letter-spacing: 0.01em;
        }
        .t2-lead-light-input:hover {
          border-color: rgba(20,18,14,0.28);
        }
        .t2-lead-light-input:focus {
          border-color: var(--t2-accent, #B8926A);
          box-shadow:
            0 0 0 4px rgba(184,146,106,0.14),
            0 8px 24px -10px rgba(0,0,0,0.10);
        }
        .t2-lead-light-input:-webkit-autofill,
        .t2-lead-light-input:-webkit-autofill:hover,
        .t2-lead-light-input:-webkit-autofill:focus {
          -webkit-text-fill-color: var(--t2-text, #14120E);
          -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset;
          caret-color: var(--t2-text, #14120E);
        }
        .t2-lead-light-textarea {
          resize: vertical;
          min-height: 140px;
          line-height: 1.65;
        }

        .t2-lead-light-submit {
          margin-top: 12px;
          width: 100%;
          padding: 18px 24px;
          font-family: var(--t2-font-sans);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #FFFFFF;
          background: var(--t2-accent, #B8926A);
          border: 1px solid var(--t2-accent, #B8926A);
          cursor: pointer;
          transition:
            background-color 0.3s var(--t2-ease),
            border-color 0.3s var(--t2-ease),
            transform 0.3s var(--t2-ease),
            box-shadow 0.3s var(--t2-ease);
          box-shadow: 0 12px 32px -16px rgba(184,146,106,0.55);
        }
        .t2-lead-light-submit:hover {
          background: var(--t2-accent-hover, #D4B68C);
          border-color: var(--t2-accent-hover, #D4B68C);
          transform: translateY(-1px);
          box-shadow: 0 16px 40px -14px rgba(184,146,106,0.65);
        }
        .t2-lead-light-submit:active {
          transform: translateY(0);
          box-shadow: 0 8px 20px -12px rgba(184,146,106,0.5);
        }
      `}</style>
    </section>
  )
}
