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

/* ── Founding-email branding constants ──────────────────────────────────────
 * Shared by the Founding Advisor onboarding sequence below. The accent + logo
 * match the marketing site (purple brand) and the magic-link email template in
 * docs/supabase-email-templates/magic-link.html.
 */

// Asset host for the logo. Defaults to production so the image resolves in real
// inboxes regardless of NODE_ENV; override with EMAIL_ASSET_ORIGIN if needed.
const EMAIL_ASSET_ORIGIN = process.env.EMAIL_ASSET_ORIGIN ?? 'https://eliteadvisorhub.com'
const EAH_LOGO_URL = `${EMAIL_ASSET_ORIGIN}/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-black.png`
const ACCENT = '#7c3aed' // brand purple (violet-600) — legible with white button text

// The founding sequence is personal ("from Nick"); replies should reach him.
const FOUNDER_FROM_ADDRESS = process.env.EMAIL_FROM_FOUNDER ?? FROM_ADDRESS
const FOUNDER_REPLY_TO = process.env.EMAIL_REPLY_TO ?? 'nick@eliteadvisorhub.com'

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

/* ═══════════════════════════════════════════════════════════════════════════
 * Founding Advisor onboarding sequence
 *
 * Eight personal, invitation-only emails ("from Nick") that carry an advisor
 * from first invitation to a live site — see EAH_Onboarding_Email_Templates.md.
 * They are NOT wired to any trigger yet: call them manually from an admin
 * action or a one-off script when you're ready to send.
 *
 * All share renderBrandedEmail(): centered EAH logo, a thin purple rule, the
 * letter body, then the signature block. Each function takes the typed merge
 * fields its template uses.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** A paragraph of letter copy. */
function emailParagraph(html: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#374151;">${html}</p>`
}

/** A bulleted list. */
function emailBullets(items: string[]): string {
  return `<ul style="margin:0 0 16px;padding-left:20px;color:#374151;font-size:15px;line-height:1.65;">${items
    .map((i) => `<li style="margin:0 0 8px;">${i}</li>`)
    .join('')}</ul>`
}

/** A numbered list. */
function emailOrderedList(items: string[]): string {
  return `<ol style="margin:0 0 16px;padding-left:20px;color:#374151;font-size:15px;line-height:1.65;">${items
    .map((i) => `<li style="margin:0 0 8px;">${i}</li>`)
    .join('')}</ol>`
}

/** A purple call-to-action button. */
function emailButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px;">
    <tr><td align="center" bgcolor="${ACCENT}" style="border-radius:10px;">
      <a href="${href}" style="display:inline-block;padding:13px 30px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">${label}</a>
    </td></tr>
  </table>`
}

/**
 * Shared branded shell: centered EAH logo, a thin purple rule, the letter body,
 * then the signature block + footer. `bodyHtml` is the per-email letter content.
 */
function renderBrandedEmail(opts: { preheader: string; bodyHtml: string; heroImageUrl?: string }): string {
  const { preheader, bodyHtml, heroImageUrl } = opts

  const signature = `<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 20px;"/>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td valign="top" style="padding-right:14px;">
                <img src="${EMAIL_ASSET_ORIGIN}/assets/email/nick-headshot.jpg" width="56" height="56" alt="Nick Cabugos" style="display:block;width:56px;height:56px;border-radius:50%;border:0;"/>
              </td>
              <td valign="top">
                <p style="margin:0;font-size:14px;line-height:1.5;color:#111111;font-weight:700;">Nick Cabugos</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">Founder, Elite Advisor Hub</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;"><a href="${EMAIL_ASSET_ORIGIN}" style="color:${ACCENT};text-decoration:none;">eliteadvisorhub.com</a></p>
                <p style="margin:6px 0 0;font-size:12px;line-height:1.5;color:#9ca3af;font-style:italic;">Virtuoso-grade websites for the top travel advisors.</p>
              </td>
            </tr></table>
            <p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#9ca3af;">Eden For Your World was the first advisor on board. Take a look: <a href="https://edenforyourworld.com" style="color:${ACCENT};text-decoration:none;">edenforyourworld.com</a></p>`

  // Logo + thin rule, shown above the body card only when there is no hero image.
  const logoHeader = `<tr><td align="center" style="padding-bottom:6px;">
          <img src="${EAH_LOGO_URL}" width="170" alt="Elite Advisor Hub" style="display:inline-block;width:170px;max-width:60%;height:auto;border:0;"/>
        </td></tr>
        <tr><td align="center" style="padding-bottom:26px;">
          <div style="width:44px;height:2px;background-color:${ACCENT};margin:14px auto 0;line-height:2px;font-size:0;">&nbsp;</div>
        </td></tr>`

  // Hero variant: image and body live in ONE rounded box with no gap. The image
  // sits flush at the top; overflow:hidden clips it to the rounded corners.
  const card = heroImageUrl
    ? `<tr><td style="background-color:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
          <img src="${heroImageUrl}" width="560" alt="Elite Advisor Hub — Websites for Elite Travel Advisors" style="display:block;width:100%;max-width:560px;height:auto;border:0;"/>
          <div style="padding:32px 40px;">
            ${bodyHtml}
            ${signature}
          </div>
        </td></tr>`
    : `${logoHeader}
        <tr><td style="background-color:#ffffff;border:1px solid #e5e7eb;border-radius:14px;padding:40px 40px 32px;">
            ${bodyHtml}
            ${signature}
        </td></tr>`

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">
        ${card}
        <tr><td align="center" style="padding:24px 16px 0;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">Elite Advisor Hub &nbsp;·&nbsp; <a href="${EMAIL_ASSET_ORIGIN}" style="color:#9ca3af;text-decoration:underline;">eliteadvisorhub.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/** Internal: send one founding email from Nick, with reply-to set to Nick. */
async function sendFoundingEmail(opts: {
  to: string
  subject: string
  preheader: string
  bodyHtml: string
  heroImageUrl?: string
}) {
  const { to, subject, preheader, bodyHtml, heroImageUrl } = opts
  const { data, error } = await getResend().emails.send({
    from: FOUNDER_FROM_ADDRESS,
    to,
    replyTo: FOUNDER_REPLY_TO,
    subject,
    html: renderBrandedEmail({ preheader, bodyHtml, heroImageUrl }),
  })
  if (error) {
    console.error(`[email] Failed to send founding email "${subject}":`, error)
    throw error
  }
  return data
}

/* ── Email 1 — Beta Invitation ──────────────────────────────────────────── */
export interface BetaInvitationEmailInput {
  to: string
  firstName: string
  brandName: string
  /** {{Consult Link}} — scheduling link for the founding conversation. */
  consultLink: string
}
export function buildBetaInvitationEmail(input: BetaInvitationEmailInput): BuiltEmail {
  const { firstName, brandName, consultLink } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName}! Hope you're doing well, it's been too long.`),
    emailParagraph(`Wanted to personally invite you to something I've been building, I think you'd want to see it. Wanted to get it in front of you before it goes wider.`),
    emailParagraph(`I built Elite Advisor Hub to solve a problem I kept running into as a travel advisor myself: the best advisors are running their brands on websites that don't come close to matching the quality of the trips they sell. EAH gives independent advisors a Virtuoso-grade website, beautiful, fast, SEO-ready, with a built-in journal and curated supplier content, live in days, not months.`),
    emailParagraph(`I'm opening it to a small founding group of advisors this month, and I'd love <strong>${brandName}</strong> to be one of them. As a <strong>Founding Advisor</strong>, you'd get:`),
    emailBullets([
      `Your setup fee waived completely`,
      `Your first month free, basically a 30-day trial to see it in action`,
      `A locked founding rate after that, roughly a third below standard, held for as long as you're with us`,
      `A site built and launched with my direct, hands-on attention`,
    ]),
    emailParagraph(`In return, I'd just ask for honest feedback and a testimonial once you've seen what it can do. That's it.`),
    emailParagraph(`Easiest next step is a quick call so I can walk you through it on a brand close to yours. Just reply to this email, or grab a time here:`),
    emailButton('Book a conversation', consultLink),
    emailParagraph(`Hope to hear from you soon!`),
  ].join('')
  return {
    subject: `An invitation for you, ${firstName}`,
    preheader: `A custom-branded, Virtuoso-grade website for ${brandName}, built by me in about a week.`,
    bodyHtml,
    heroImageUrl: `${EMAIL_ASSET_ORIGIN}/assets/email/email-1-hero.jpg`,
  }
}
export async function sendBetaInvitationEmail(input: BetaInvitationEmailInput) {
  return sendFoundingEmail({ to: input.to, ...buildBetaInvitationEmail(input) })
}

/* ── Email 2 — Welcome & Register ───────────────────────────────────────── */
export interface WelcomeRegisterEmailInput {
  to: string
  firstName: string
  brandName: string
  /** {{Tier}} — e.g. 'Starter', 'Growth', 'Custom'. */
  tier: string
  /** {{Portal Link}} — magic-link portal account creation. */
  portalLink: string
  /** {{Intake Link}} — brand intake form. */
  intakeLink: string
}
export async function sendWelcomeRegisterEmail(input: WelcomeRegisterEmailInput) {
  const { to, firstName, brandName, tier, portalLink, intakeLink } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`I'm thrilled to have you in the founding group. Here's exactly what to expect, and the two things I need from you to get started.`),
    emailParagraph(`<strong>Your Founding Advisor offer, confirmed:</strong>`),
    emailBullets([
      `${tier} tier — setup fee waived`,
      `First month free, a 30-day trial`,
      `Founding rate after that, locked for as long as you stay with us`,
      `A card on file so billing is seamless when month two arrives, nothing is charged for the first 30 days`,
    ]),
    emailParagraph(`I've put together a one-page Founding Advisor summary so everything's in writing.`),
    emailParagraph(`<strong>Step one — create your portal account.</strong> This is where you'll manage your site, blog, and billing. It takes a minute and uses a secure magic link, so there's no password to remember:`),
    emailButton('Create your portal account', portalLink),
    emailParagraph(`<strong>Step two — tell me about ${brandName}.</strong> This short intake form is how I learn your brand, your story, and how you work. It takes about 15 minutes, you can save and return, and you'll be able to upload your logo and a few photos along the way:`),
    emailButton('Start the intake form', intakeLink),
    emailParagraph(`Once both are done, I take it from there. Reply to this email anytime — you've got my direct line throughout.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `Welcome to Elite Advisor Hub, ${firstName} — here's step one`,
    preheader: `Your Founding Advisor spot is confirmed. Two quick things to get ${brandName} moving.`,
    bodyHtml,
  })
}

/* ── Email 3 — Intake Received (Starter/Growth) ─────────────────────────── */
export interface IntakeReceivedEmailInput {
  to: string
  firstName: string
  brandName: string
  /** {{Tier}} — template the draft will be built on. */
  tier: string
}
export async function sendIntakeReceivedEmail(input: IntakeReceivedEmailInput) {
  const { to, firstName, brandName, tier } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`Your intake is in — thank you. I have what I need to start building <strong>${brandName}</strong>.`),
    emailParagraph(`<strong>What happens now:</strong>`),
    emailOrderedList([
      `I'll build your site draft on the ${tier} template over the next several business days.`,
      `You'll get a private preview link to review everything.`,
      `We'll do one round of edits together so it's exactly right.`,
      `Then we go live.`,
    ]),
    emailParagraph(`You don't need to do anything until the preview lands. If you'd like a quick 20-minute kickoff call to walk through anything before I start, just reply and we'll find a time — it's optional, not required.`),
    emailParagraph(`I'll be in touch soon.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `Got everything, ${firstName} — ${brandName} is in the works`,
    preheader: `Here's what happens next, and when you'll see your site.`,
    bodyHtml,
  })
}

/* ── Email 3b — Intake Reminder ─────────────────────────────────────────── */
export interface IntakeReminderEmailInput {
  to: string
  firstName: string
  brandName: string
  /** {{Intake Link}} — brand intake form. */
  intakeLink: string
}
export async function sendIntakeReminderEmail(input: IntakeReminderEmailInput) {
  const { to, firstName, brandName, intakeLink } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`Just a friendly nudge — I noticed your intake form for <strong>${brandName}</strong> is still open. No pressure at all; I know how full an advisor's week gets.`),
    emailParagraph(`Whenever you have 15 minutes, here's the link again — it saves as you go, so you can do it in pieces:`),
    emailButton('Finish the intake form', intakeLink),
    emailParagraph(`And if anything in it is unclear, or you'd rather just talk it through, reply here and we'll do it together on a quick call.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `Quick nudge, ${firstName} — your EAH intake form`,
    preheader: `No rush — just making sure it didn't slip through.`,
    bodyHtml,
  })
}

/* ── Email 4 — Your Site Preview ────────────────────────────────────────── */
export interface SitePreviewEmailInput {
  to: string
  firstName: string
  brandName: string
  /** {{Preview Link}} — private preview of the draft site. */
  previewLink: string
}
export async function sendSitePreviewEmail(input: SitePreviewEmailInput) {
  const { to, firstName, brandName, previewLink } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`This is the part I love. Your site is built — here's a private preview of <strong>${brandName}</strong>:`),
    emailButton('View your preview', previewLink),
    emailParagraph(`Take your time with it. Click through every page, open it on your phone, and notice what feels right and what you'd like adjusted.`),
    emailParagraph(`When you're ready, send me one consolidated round of edits — copy tweaks, photo swaps, anything. The simplest way is the feedback form linked at the top of the preview, but a reply to this email works just as well. I'll make the changes and send the final version for your sign-off.`),
    emailParagraph(`We're close. I think you're going to be proud to share this.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `${firstName}, your site is ready to see`,
    preheader: `A private preview of ${brandName} — take a look and tell me what to refine.`,
    bodyHtml,
  })
}

/* ── Email 5 — You're Live ──────────────────────────────────────────────── */
export interface YoureLiveEmailInput {
  to: string
  firstName: string
  brandName: string
  /** {{Tier}} — drives the journal cadence line. */
  tier: string
  /** {{Site URL}} — the live site. */
  siteUrl: string
  /** {{Portal Link}} — advisor portal. */
  portalLink: string
}
export async function sendYoureLiveEmail(input: YoureLiveEmailInput) {
  const { to, firstName, brandName, tier, siteUrl, portalLink } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`It's official — <strong>${brandName}</strong> is live:`),
    emailButton('Visit your site', siteUrl),
    emailParagraph(`Congratulations. This is the website your work has deserved.`),
    emailParagraph(`<strong>A few things to set you up well:</strong>`),
    emailBullets([
      `<strong>Your domain</strong> — if there's anything to finish on the domain or your professional email, I've sent separate instructions; reply if you'd like me to handle it with you.`,
      `<strong>Share it</strong> — I've put together a short launch kit with caption ideas and graphics so announcing your new site is effortless. It's in your portal under Resources.`,
      `<strong>Your journal</strong> — fresh, curated content publishes to your site automatically on your ${tier} cadence. Nothing for you to do; it just keeps your site alive.`,
      `<strong>Your portal</strong> — update your profile, manage content, and see leads anytime.`,
    ]),
    emailButton('Open your portal', portalLink),
    emailParagraph(`I'll check in again in a couple of weeks to see how it's feeling. In the meantime, if anything comes up, you know where to find me.`),
    emailParagraph(`Thank you for being a Founding Advisor. It means a great deal.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `You're live, ${firstName} — welcome to Elite Advisor Hub`,
    preheader: `${brandName} is officially online. Here's how to make the most of it.`,
    bodyHtml,
  })
}

/* ── Email 6 — Week-2 Check-in ──────────────────────────────────────────── */
export interface Week2CheckinEmailInput {
  to: string
  firstName: string
  brandName: string
}
export async function sendWeek2CheckinEmail(input: Week2CheckinEmailInput) {
  const { to, firstName, brandName } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`<strong>${brandName}</strong> has been live for a couple of weeks now — I'd love to know how it's feeling. Anything you'd change, anything clients have said, anything that would make it work harder for you?`),
    emailParagraph(`If you have 20 minutes, I'd value a short call to hear your honest take on the whole experience — it directly shapes how I build for the advisors who come after you. Reply with a time that works.`),
    emailParagraph(`And two small favors, only if you're glad you did this:`),
    emailOrderedList([
      `<strong>A few words I can share</strong> — a sentence or two about your experience, which I'd love to feature.`,
      `<strong>An introduction or two</strong> — if there's an advisor you respect who deserves a site like yours, a warm intro would mean a lot. (And there's a referral thank-you in it for you.)`,
    ]),
    emailParagraph(`Either way — thank you for trusting me with your brand. It's been a genuine pleasure.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `How's the new site treating you, ${firstName}?`,
    preheader: `A quick check-in — and two small favors, if you're up for them.`,
    bodyHtml,
  })
}

/* ── Email C — Consultation Booking (Custom & Agency) ───────────────────── */
export interface ConsultationBookingEmailInput {
  to: string
  firstName: string
  brandName: string
  /** {{Tier}} — 'Custom' or 'Agency'. */
  tier: string
  /** {{Consult Link}} — scoping consultation booking link. */
  consultLink: string
}
export async function sendConsultationBookingEmail(input: ConsultationBookingEmailInput) {
  const { to, firstName, brandName, tier, consultLink } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`Because <strong>${brandName}</strong> is joining on the ${tier} tier, we start with a conversation rather than a form. Custom builds have room for features, modules, and structure that are worth getting right from the start — and that's best done by talking it through.`),
    emailParagraph(`Grab a 45-minute consultation here:`),
    emailButton('Book your consultation', consultLink),
    emailParagraph(`Before we meet, it helps to have rough answers to: the custom features or modules you're picturing, anything you'd want migrated from an existing site, and any timeline you're working toward. Nothing formal — just bring your thinking.`),
    emailParagraph(`After the call, I'll send a short intake form to capture the brand details, and we'll be off and building.`),
    emailParagraph(`Looking forward to it.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `Let's design your build, ${firstName} — book your consultation`,
    preheader: `Custom and Agency sites start with a conversation. Here's the link to book it.`,
    bodyHtml,
  })
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Warm launch sequence (known advisors)
 *
 * Emails 2-5 of the personal recruitment sequence for a warm list of advisors
 * you already know. Email 1 is the existing sendBetaInvitationEmail. These reuse
 * the same branded "from Nick" shell and reply-to, and drive to the homepage and
 * the consultation booking page. Sent 1:1 by scripts/send-warm-sequence.ts.
 * Not wired to any trigger. See marketing/launch-campaign/ for the plan + copy.
 * ═══════════════════════════════════════════════════════════════════════════ */

const HOMEPAGE_LINK = 'https://eliteadvisorhub.com'
const CONSULT_LINK = 'https://eliteadvisorhub.com/schedule-consultation'
const WAITLIST_LINK = 'https://eliteadvisorhub.com/beta'

export interface WarmSequenceEmailInput {
  to: string
  firstName: string
  brandName: string
}

/** A fully composed email, before it is wrapped in the branded shell and sent. */
export interface BuiltEmail {
  subject: string
  preheader: string
  bodyHtml: string
  /** Optional full-width hero banner shown in place of the logo header. */
  heroImageUrl?: string
}

/**
 * Render a built email to the full branded HTML, WITHOUT sending. Use this to
 * preview the design (see scripts/preview-warm-sequence.ts).
 */
export function renderFoundingEmailHtml(built: BuiltEmail): string {
  return renderBrandedEmail({
    preheader: built.preheader,
    bodyHtml: built.bodyHtml,
    heroImageUrl: built.heroImageUrl,
  })
}

/* ── Email 2 — How it works ─────────────────────────────────────────────── */
export function buildWarmHowItWorksEmail(input: WarmSequenceEmailInput): BuiltEmail {
  const { firstName, brandName } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`Following up on my note about Elite Advisor Hub. The question I get most is simple: what do I actually get, and how fast?`),
    emailParagraph(`Here's the short version. You get a custom-branded site built to your identity, not a stock template. It comes with your supplier catalog, a lead inbox, a self-service portal, and a journal that keeps fresh, curated content publishing to your site automatically. Most advisors are live within days, with my hands-on attention through the whole build.`),
    emailParagraph(`No drawn-out agency project. No wrestling with a website builder at midnight. You stay focused on clients while I handle the site.`),
    emailParagraph(`The best next step is a quick conversation:`),
    emailButton('Book a consultation', CONSULT_LINK),
    emailParagraph(`Or if you'd rather look around first, the homepage walks through it: <a href="${HOMEPAGE_LINK}" style="color:${ACCENT};">eliteadvisorhub.com</a>`),
    emailParagraph(`Warmly,`),
  ].join('')
  return {
    subject: `How ${brandName} could be live in days`,
    preheader: `What you get, how fast it happens, and why advisors are switching.`,
    bodyHtml,
  }
}
export async function sendWarmHowItWorksEmail(input: WarmSequenceEmailInput) {
  return sendFoundingEmail({ to: input.to, ...buildWarmHowItWorksEmail(input) })
}

/* ── Email 3 — Proof ────────────────────────────────────────────────────── */
export function buildWarmProofEmail(input: WarmSequenceEmailInput): BuiltEmail {
  const { firstName, brandName } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`Rather than describe it again, I'd rather show you.`),
    emailParagraph(`Eden For Your World is one of our advisors. Take a look at the site we built and judge the quality for yourself: <a href="https://edenforyourworld.com" style="color:${ACCENT};">edenforyourworld.com</a>`),
    emailParagraph(`That is the standard. Clean, fast, genuinely premium, and built to bring in the right clients. The same care goes into every Founding Advisor build, including the founding offer: setup waived, your first month free as a 30-day trial, and a locked rate after that.`),
    emailParagraph(`If you can picture ${brandName} looking like this, let's talk:`),
    emailButton('Book a consultation', CONSULT_LINK),
    emailParagraph(`Warmly,`),
  ].join('')
  return {
    subject: `Here's one built for a real advisor`,
    preheader: `A live Elite Advisor Hub site, so you can judge it for yourself.`,
    bodyHtml,
  }
}
export async function sendWarmProofEmail(input: WarmSequenceEmailInput) {
  return sendFoundingEmail({ to: input.to, ...buildWarmProofEmail(input) })
}

/* ── Email 4 — The founding window ──────────────────────────────────────── */
export function buildWarmFoundingWindowEmail(input: WarmSequenceEmailInput): BuiltEmail {
  const { firstName, brandName } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`A quick and honest note. I'm keeping the founding group small on purpose, because each site gets my direct attention and I won't compromise that. The spots are filling.`),
    emailParagraph(`Here's exactly what a Founding Advisor gets:`),
    emailBullets([
      `Setup fee waived, in full`,
      `Your first month free, a 30-day trial`,
      `A locked founding rate after that, roughly a third below standard, held for as long as you stay`,
      `A site built and launched with my hands-on attention`,
    ]),
    emailParagraph(`I'd like ${brandName} to have one of the remaining spots. The only next step is a short conversation so I can understand your brand and make sure it's a fit:`),
    emailButton('Book your consultation', CONSULT_LINK),
    emailParagraph(`If the timing isn't right, just reply and tell me. I read every response.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return {
    subject: `The founding group is filling up`,
    preheader: `What the founding offer includes, and why it won't stay open.`,
    bodyHtml,
  }
}
export async function sendWarmFoundingWindowEmail(input: WarmSequenceEmailInput) {
  return sendFoundingEmail({ to: input.to, ...buildWarmFoundingWindowEmail(input) })
}

/* ── Email 5 — Last call ────────────────────────────────────────────────── */
export function buildWarmLastCallEmail(input: WarmSequenceEmailInput): BuiltEmail {
  const { firstName, brandName } = input
  const bodyHtml = [
    emailParagraph(`Hi ${firstName},`),
    emailParagraph(`This is the last note I'll send about the founding group. I'm closing it to keep the cohort small and give each site the attention it deserves.`),
    emailParagraph(`If a Virtuoso-grade site for ${brandName}, with the setup waived and your first month free, is something you want, now is the moment:`),
    emailButton('Book your consultation', CONSULT_LINK),
    emailParagraph(`And if the timing simply isn't right, no problem at all. Add yourself to the waitlist and I'll reach out when the next group opens:`),
    emailButton('Join the waitlist', WAITLIST_LINK),
    emailParagraph(`Thank you for reading this far. Whatever you decide, I wish you and ${brandName} a wonderful season ahead.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return {
    subject: `Closing the founding group, ${firstName}`,
    preheader: `Last call on the founding offer, plus an easy way to stay in touch.`,
    bodyHtml,
  }
}
export async function sendWarmLastCallEmail(input: WarmSequenceEmailInput) {
  return sendFoundingEmail({ to: input.to, ...buildWarmLastCallEmail(input) })
}
