'use server'

/**
 * Server action for the customer support form on the marketing site.
 *
 * Sends two emails via Resend:
 *   1. Notification to the admin inbox with the full submission.
 *   2. Confirmation to the customer that their request was received.
 *
 * Submissions are not persisted to the database — Resend's dashboard
 * is the source of truth for delivery + content. Add a DB table later
 * if support volume justifies a triage queue.
 */

import { Resend } from 'resend'

export type SupportFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Partial<Record<string, string>>
}

const ALLOWED_CATEGORIES = ['technical', 'billing', 'account', 'feature', 'other'] as const
type CategoryValue = (typeof ALLOWED_CATEGORIES)[number]

const CATEGORY_LABELS: Record<CategoryValue, string> = {
  technical: 'Technical issue',
  billing:   'Billing or subscription',
  account:   'Account or login',
  feature:   'Feature request',
  other:     'Other',
}

function coerceCategory(v: string | null): CategoryValue {
  if (!v) return 'other'
  return (ALLOWED_CATEGORIES as readonly string[]).includes(v) ? (v as CategoryValue) : 'other'
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function submitSupportRequest(
  _prev: SupportFormState,
  formData: FormData,
): Promise<SupportFormState> {
  const get = (k: string) => (formData.get(k) as string | null)?.trim() ?? ''

  const name       = get('name')
  const email      = get('email')
  const agency     = get('agency')
  const category   = coerceCategory(get('category'))
  const subject    = get('subject')
  const message    = get('message')

  // Validate
  const fieldErrors: Partial<Record<string, string>> = {}
  if (!name) fieldErrors.name = 'Your name is required.'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'A valid email is required.'
  }
  if (!subject) fieldErrors.subject = 'A subject is required.'
  if (!message) fieldErrors.message = 'Please describe what you need help with.'
  if (message && message.length > 5000) {
    fieldErrors.message = 'Please keep your message under 5,000 characters.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please correct the errors below.', fieldErrors }
  }

  if (!process.env.RESEND_API_KEY) {
    // Dev mode without Resend — log and treat as success so the UX is testable.
    console.log('[support] (dev mode, no RESEND_API_KEY) submission:', {
      name, email, agency, category, subject, message,
    })
    return { success: true }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const FROM = process.env.EMAIL_FROM ?? 'EliteAdvisorHub <onboarding@resend.dev>'
    const ADMIN = 'cabugosb3@gmail.com'

    // ── 1. Admin notification ────────────────────────────────────────────
    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      replyTo: email,
      subject: `[Support · ${CATEGORY_LABELS[category]}] ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px 0; color: #1f2937;">
          <h2 style="margin: 0 0 4px; font-size: 18px; color: #111;">New support request</h2>
          <p style="margin: 0 0 24px; font-size: 13px; color: #6b7280;">Reply directly to this email to respond to ${escape(name)}.</p>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 110px;">Name</td><td style="padding: 6px 0; font-weight: 500;">${escape(name)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escape(email)}" style="color: #b45309;">${escape(email)}</a></td></tr>
            ${agency ? `<tr><td style="padding: 6px 0; color: #6b7280;">Agency</td><td style="padding: 6px 0;">${escape(agency)}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #6b7280;">Category</td><td style="padding: 6px 0;">${CATEGORY_LABELS[category]}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Subject</td><td style="padding: 6px 0; font-weight: 500;">${escape(subject)}</td></tr>
          </table>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Message</div>
            <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escape(message)}</div>
          </div>
        </div>
      `,
    })

    // ── 2. Customer confirmation ────────────────────────────────────────
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `We got your message — ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0; color: #1f2937;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #111; display: inline-flex; align-items: center; justify-content: center;">
              <span style="color: #fff; font-size: 18px; font-weight: 700;">E</span>
            </div>
          </div>

          <h1 style="margin: 0 0 8px; font-size: 20px; color: #111; text-align: center;">We got your message</h1>
          <p style="margin: 0 0 24px; font-size: 14px; color: #6b7280; text-align: center;">Our team will get back to you within one business day.</p>

          <p style="font-size: 14px; line-height: 1.6;">Hi ${escape(name)},</p>
          <p style="font-size: 14px; line-height: 1.6;">Thanks for reaching out. Here's what you sent us so you have a record:</p>

          <div style="margin: 16px 0; padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">${CATEGORY_LABELS[category]}</div>
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">${escape(subject)}</div>
            <div style="font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${escape(message)}</div>
          </div>

          <p style="font-size: 14px; line-height: 1.6;">If you need to add anything, just reply to this email.</p>

          <p style="font-size: 14px; line-height: 1.6; margin-top: 28px;">— The EliteAdvisorHub team</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0 12px;" />
          <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">
            Elite Advisor Hub, LLC · 1016 Cliff Drive, Santa Barbara, CA 93109
          </p>
        </div>
      `,
    })

    return { success: true }
  } catch (e) {
    console.error('[support] send failed', e)
    return {
      success: false,
      error: 'We could not send your message. Please email us directly at support@eliteadvisorhub.com.',
    }
  }
}
