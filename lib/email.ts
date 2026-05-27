import { Resend } from 'resend'

/**
 * Lazily construct the Resend client so a missing RESEND_API_KEY doesn't
 * throw at module-load time. Without this, every preview deployment that
 * doesn't have the env var configured fails the "Collecting page data"
 * build step the moment Next.js imports an API route that imports this
 * module (e.g. /api/agent-portal/onboarding).
 */
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('RESEND_API_KEY is not set — cannot send transactional email')
  }
  return new Resend(key)
}

const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'EliteAdvisorHub <onboarding@resend.dev>'
const ADMIN_EMAIL = 'cabugosb3@gmail.com'

interface OnboardingAgent {
  full_name: string
  agency_name: string
  email: string
  template: string
  tier?: string
  phone?: string | null
}

/**
 * Notify the admin that a new agent has completed onboarding
 * and their site needs to be designed/provisioned.
 */
export async function sendAdminOnboardingNotification(agent: OnboardingAgent) {
  const { data, error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: ADMIN_EMAIL,
    subject: `New Agent Onboarding: ${agent.agency_name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
        <h2 style="color: #111; margin: 0 0 8px;">New Agent Ready for Site Setup</h2>
        <p style="color: #6b7280; margin: 0 0 24px; font-size: 14px;">An agent just completed onboarding and is waiting for their site.</p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 120px;">Name</td>
            <td style="padding: 8px 0; color: #111; font-weight: 500;">${agent.full_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Agency</td>
            <td style="padding: 8px 0; color: #111; font-weight: 500;">${agent.agency_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Email</td>
            <td style="padding: 8px 0; color: #111;">${agent.email}</td>
          </tr>
          ${agent.phone ? `<tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0; color: #111;">${agent.phone}</td></tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Template</td>
            <td style="padding: 8px 0; color: #111;">${agent.template}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Tier</td>
            <td style="padding: 8px 0; color: #111;">${agent.tier ?? 'starter'}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #fef3c7; border-radius: 8px; font-size: 13px; color: #92400e;">
          <strong>Action needed:</strong> Design and provision their site within 24-48 hours${agent.tier === 'custom' ? ' (custom tier — schedule a call first)' : ''}.
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('[email] Failed to send admin notification:', error)
    throw error
  }
  return data
}

/**
 * Notify the admin that a new advisor has joined the public Founding Advisor
 * beta waitlist at /beta. Lighter-weight than the onboarding notification —
 * no template/tier/provisioning expected; this is a lead waiting for an
 * outbound invitation. The row is also visible in /admin/consultations with
 * the "Beta waitlist" chip.
 */
export interface BetaWaitlistNotificationInput {
  firstName: string
  lastName: string
  email: string
  businessName: string
  websiteUrl: string | null
}

export async function sendBetaWaitlistNotification(input: BetaWaitlistNotificationInput) {
  const fullName = `${input.firstName} ${input.lastName}`.trim()
  const websiteRow = input.websiteUrl
    ? `<tr><td style="padding: 8px 0; color: #6b7280;">Current site</td><td style="padding: 8px 0; color: #111;"><a href="${input.websiteUrl}" style="color: #7c3aed; text-decoration: none;">${input.websiteUrl}</a></td></tr>`
    : ''

  const { data, error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: ADMIN_EMAIL,
    replyTo: input.email,
    subject: `Beta waitlist: ${input.businessName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
        <h2 style="color: #111; margin: 0 0 8px;">New Founding Advisor waitlist signup</h2>
        <p style="color: #6b7280; margin: 0 0 24px; font-size: 14px;">
          An advisor just added themselves to the /beta waitlist. Decide if they're a fit for the next founding cohort and send the personal invitation from
          <code style="background:#f3f4f6;padding:1px 6px;border-radius:4px;font-size:12px;">EAH_Onboarding_Email_Templates.md → Email 1</code>.
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 130px;">Name</td>
            <td style="padding: 8px 0; color: #111; font-weight: 500;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Email</td>
            <td style="padding: 8px 0; color: #111;"><a href="mailto:${input.email}" style="color: #7c3aed; text-decoration: none;">${input.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Business</td>
            <td style="padding: 8px 0; color: #111; font-weight: 500;">${input.businessName}</td>
          </tr>
          ${websiteRow}
        </table>

        <div style="margin-top: 28px; padding: 14px 16px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; font-size: 13px; color: #6b21a8;">
          Reply to this email to reach <strong>${input.firstName}</strong> directly — the reply-to is set to their address.
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0 16px;" />
        <p style="color: #9ca3af; font-size: 11px;">
          View all waitlist + consultation requests at <a href="https://eliteadvisorhub.com/admin/consultations" style="color: #9ca3af;">eliteadvisorhub.com/admin/consultations</a>.
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('[email] Failed to send beta-waitlist notification:', error)
    throw error
  }
  return data
}

/**
 * Send the new agent a welcome email confirming their onboarding
 * and setting expectations for site delivery.
 */
export async function sendAgentWelcomeEmail(agent: OnboardingAgent) {
  const isCustom = agent.tier === 'custom'

  const timelineMessage = isCustom
    ? `Because you've chosen our <strong>Custom</strong> tier, we'll reach out within the next business day to schedule a conversation about your site design and unique requirements.`
    : `Your site will be live within <strong>24-48 hours</strong>. We're designing it now based on the information you provided.`

  const { data, error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: agent.email,
    subject: `Welcome to EliteAdvisorHub, ${agent.full_name}!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #111; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 20px; font-weight: 700;">E</span>
          </div>
        </div>

        <h1 style="color: #111; margin: 0 0 8px; font-size: 22px; text-align: center;">Welcome to EliteAdvisorHub</h1>
        <p style="color: #6b7280; margin: 0 0 32px; font-size: 14px; text-align: center;">We're thrilled to have ${agent.agency_name} on board.</p>

        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          Hi ${agent.full_name},
        </p>

        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          Thank you for completing your onboarding! We've received all of your information and our team is on it.
        </p>

        <div style="margin: 24px 0; padding: 20px; background: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
          <p style="color: #166534; font-size: 14px; line-height: 1.6; margin: 0;">
            ${timelineMessage}
          </p>
        </div>

        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          In the meantime, you can log into your <strong>Advisor Portal</strong> anytime to manage your blog, update your profile, or submit site modification requests.
        </p>

        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          If you have any questions, just reply to this email — we're here to help.
        </p>

        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin-top: 32px;">
          Welcome aboard,<br/>
          <strong>The EliteAdvisorHub Team</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 16px;" />
        <p style="color: #9ca3af; font-size: 11px; text-align: center;">
          EliteAdvisorHub — Websites for Elite Travel Advisors
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('[email] Failed to send welcome email:', error)
    throw error
  }
  return data
}
