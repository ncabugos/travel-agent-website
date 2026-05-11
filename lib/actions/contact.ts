'use server'

import { Resend } from 'resend'
import { getAgentProfile } from '@/lib/suppliers'

export type ContactFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Partial<Record<string, string>>
}

const ADMIN_FALLBACK = 'cabugosb3@gmail.com'
const MIN_FILL_TIME_MS = 2000 // forms submitted in <2s are almost certainly bots

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const get = (key: string) => (formData.get(key) as string | null)?.trim() ?? ''

  const agentId    = get('agent_id')
  const firstName  = get('first_name')
  const lastName   = get('last_name')
  const email      = get('email')
  const phone      = get('phone')
  const destination= get('destination')
  const vacType    = get('vacation_type')
  const numTrav    = get('num_travelers')
  const advisorPref= get('advisor_pref')
  const message    = get('message')
  // Hotel context — set by the visible chip in the form when the user
  // arrives via /contact?hotel=<name> from a hotel detail page.
  // Tags the subject line and adds a prominent row in the advisor email.
  const hotelName  = get('hotel_name')

  // ── Spam protection ──────────────────────────────────────────────────
  // 1. Honeypot — hidden field that real users never fill.
  const honeypot = get('website_url')
  if (honeypot) {
    // Pretend it succeeded so the bot doesn't probe further. No DB write,
    // no email — drop it silently.
    console.warn('[contact] honeypot tripped, dropping submission')
    return { success: true }
  }

  // 2. Form-fill time — reject sub-2-second submissions.
  const renderedAt = Number(get('_rendered_at') || '0')
  if (renderedAt > 0 && Date.now() - renderedAt < MIN_FILL_TIME_MS) {
    console.warn('[contact] sub-2s submission, dropping')
    return { success: true }
  }

  // ── Field validation ────────────────────────────────────────────────
  const fieldErrors: Partial<Record<string, string>> = {}
  if (!firstName) fieldErrors.first_name = 'First name is required.'
  if (!lastName)  fieldErrors.last_name  = 'Last name is required.'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'A valid email is required.'

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please correct the errors below.', fieldErrors }
  }

  const fullName = `${firstName} ${lastName}`
  const fullMessage = [
    hotelName  ? `Hotel of interest: ${hotelName}` : null,
    vacType    ? `Vacation type: ${vacType}`       : null,
    numTrav    ? `Travelers: ${numTrav}`            : null,
    advisorPref? `Advisor preference: ${advisorPref}` : null,
    message    ? message                            : null,
  ].filter(Boolean).join('\n') || null

  // ── DB write (audit trail) ───────────────────────────────────────────
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()

      const payload = {
        agent_id:    agentId || null,
        name:        fullName,
        email,
        phone:       phone || null,
        destination: destination || null,
        message:     fullMessage,
        status:      'new',
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase.from('inquiries') as any).insert(payload)

      if (dbError) {
        console.error('[contact] inquiry DB error:', dbError)
        // Continue — we'd rather email the advisor than fail the whole submission.
      }
    } catch (e) {
      console.error('[contact] supabase unavailable:', e)
      // Continue — email is the primary delivery channel.
    }
  }

  // ── Email the advisor via Resend ────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      // Look up the advisor's email so we route to the right inbox.
      // Falls back to the platform admin if the agent has no email set.
      let recipient = ADMIN_FALLBACK
      let agencyName = ''
      if (agentId) {
        const agent = await getAgentProfile(agentId)
        if (agent?.email) recipient = agent.email
        if (agent?.agency_name) agencyName = agent.agency_name
      }

      const resend = new Resend(process.env.RESEND_API_KEY)
      const FROM = process.env.EMAIL_FROM ?? 'EliteAdvisorHub <onboarding@resend.dev>'

      // Subject line is the most-visible signal in an inbox view; tag with
      // [Hotel] when the enquiry came from a hotel detail page so the
      // advisor knows the context without opening the email.
      const subjectTag = hotelName
        ? `[Hotel — ${hotelName}]`
        : '[New enquiry]'
      const subject = `${subjectTag} ${fullName}${
        !hotelName && destination ? ' — ' + destination : ''
      }`

      const { data: sendData, error: sendError } = await resend.emails.send({
        from: FROM,
        to: recipient,
        replyTo: email,
        subject,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px 0; color: #1f2937;">
            <h2 style="margin: 0 0 4px; font-size: 18px; color: #111;">${
              hotelName ? 'Hotel enquiry' : 'New enquiry'
            }${agencyName ? ' for ' + escape(agencyName) : ''}</h2>
            <p style="margin: 0 0 24px; font-size: 13px; color: #6b7280;">Reply directly to this email to reach ${escape(fullName)}.</p>

            ${hotelName ? `
              <div style="background: #faf7f2; border-left: 3px solid #b5945a; padding: 14px 18px; margin-bottom: 20px;">
                <div style="font-size: 10px; color: #b5945a; text-transform: uppercase; letter-spacing: 0.18em; margin-bottom: 4px;">Hotel of interest</div>
                <div style="font-size: 17px; font-weight: 500; color: #111;">${escape(hotelName)}</div>
              </div>
            ` : ''}

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
              <tr><td style="padding: 6px 0; color: #6b7280; width: 130px;">Name</td><td style="padding: 6px 0; font-weight: 500;">${escape(fullName)}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escape(email)}" style="color: #b45309;">${escape(email)}</a></td></tr>
              ${phone ? `<tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0;">${escape(phone)}</td></tr>` : ''}
              ${destination ? `<tr><td style="padding: 6px 0; color: #6b7280;">Destination</td><td style="padding: 6px 0;">${escape(destination)}</td></tr>` : ''}
              ${vacType ? `<tr><td style="padding: 6px 0; color: #6b7280;">Vacation type</td><td style="padding: 6px 0;">${escape(vacType)}</td></tr>` : ''}
              ${numTrav ? `<tr><td style="padding: 6px 0; color: #6b7280;">Travelers</td><td style="padding: 6px 0;">${escape(numTrav)}</td></tr>` : ''}
              ${advisorPref && advisorPref !== 'No preference' ? `<tr><td style="padding: 6px 0; color: #6b7280;">Advisor pref</td><td style="padding: 6px 0;">${escape(advisorPref)}</td></tr>` : ''}
            </table>

            ${message ? `
              <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Message</div>
                <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escape(message)}</div>
              </div>
            ` : ''}
          </div>
        `,
      })

      if (sendError) {
        console.error('[contact] resend rejected send', {
          from: FROM,
          to: recipient,
          statusCode: sendError.statusCode ?? null,
          name: sendError.name,
          message: sendError.message,
        })
        return {
          success: false,
          error: 'We received your message but could not send the notification. Please email us directly if urgent.',
        }
      }

      console.info('[contact] resend accepted', { id: sendData?.id, to: recipient })
    } catch (e) {
      const err = e as { message?: string; name?: string; statusCode?: number }
      console.error('[contact] email send threw', {
        name: err.name ?? 'Error',
        statusCode: err.statusCode ?? null,
        message: err.message ?? String(e),
      })
      return {
        success: false,
        error: 'We received your message but could not send the notification. Please email us directly if urgent.',
      }
    }
  } else {
    console.warn('[contact] RESEND_API_KEY not set — skipping email send')
  }

  return { success: true }
}
