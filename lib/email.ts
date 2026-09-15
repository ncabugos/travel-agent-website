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
    throw new Error('RESEND_API_KEY is not set, cannot send transactional email')
  }
  return new Resend(key)
}

const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'Elite Advisor Hub <onboarding@resend.dev>'
import { getAdminNotificationEmail } from '@/lib/platform-settings'

/* ── Email design system ────────────────────────────────────────────────────
 * Every email the platform sends (system notifications, the founding sequence,
 * the warm launch sequence) renders through renderBrandedEmail() below. The
 * look matches the Supabase Auth templates in docs/supabase-email-templates:
 * cream ground, white square card with a hairline border, logo over a gold
 * rule, charcoal headings, flat purple button, muted footer.
 */

// Asset host for the logo. Defaults to production so the image resolves in real
// inboxes regardless of NODE_ENV; override with EMAIL_ASSET_ORIGIN if needed.
const EMAIL_ASSET_ORIGIN = process.env.EMAIL_ASSET_ORIGIN ?? 'https://eliteadvisorhub.com'
const EAH_LOGO_URL = `${EMAIL_ASSET_ORIGIN}/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-black.png`
const EAH_LOGO_DARK_URL = `${EMAIL_ASSET_ORIGIN}/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-white.png`

const FONT_STACK = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const COLOR_PAGE = '#FAFAF5'
const COLOR_CARD = '#FFFFFF'
const COLOR_BORDER = '#E8E4DC'
const COLOR_GOLD = '#B49A5A'
const COLOR_CHARCOAL = '#1A1715'
const COLOR_BODY = '#5F5850'
const COLOR_MUTED = '#8A8279'
const ACCENT = '#7C3AED' // brand purple, used for the action button only

// The founding sequence is personal ("from Nick"); replies should reach him.
const FOUNDER_FROM_ADDRESS = process.env.EMAIL_FROM_FOUNDER ?? FROM_ADDRESS
const FOUNDER_REPLY_TO = process.env.EMAIL_REPLY_TO ?? 'nick@eliteadvisorhub.com'

/** Escape user-supplied text before interpolating it into email HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** The email heading: 26px, regular weight, charcoal. */
function emailHeading(text: string): string {
  return `<h1 class="text-primary" style="margin:0 0 16px;font-family:${FONT_STACK};font-size:26px;line-height:1.2;font-weight:400;letter-spacing:-0.02em;color:${COLOR_CHARCOAL};">${text}</h1>`
}

/** A paragraph of letter copy. */
function emailParagraph(html: string): string {
  return `<p class="text-secondary" style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${COLOR_BODY};">${html}</p>`
}

/** A muted paragraph (13px) for secondary notes. */
function emailMutedParagraph(html: string): string {
  return `<p class="text-muted" style="margin:0 0 16px;font-size:13px;line-height:1.6;color:${COLOR_MUTED};">${html}</p>`
}

/** A small uppercase label above a block. */
function emailLabel(text: string): string {
  return `<p class="text-muted" style="margin:0 0 6px;font-size:11px;line-height:1.4;letter-spacing:0.14em;text-transform:uppercase;color:${COLOR_MUTED};">${text}</p>`
}

/** An inline text link: charcoal with an underline, never purple. */
function emailLink(label: string, href: string): string {
  return `<a class="text-link" href="${href}" style="color:${COLOR_CHARCOAL};text-decoration:underline;">${label}</a>`
}

/** A bulleted list. */
function emailBullets(items: string[]): string {
  return `<ul class="text-secondary" style="margin:0 0 16px;padding-left:20px;color:${COLOR_BODY};font-size:15px;line-height:1.65;">${items
    .map((i) => `<li style="margin:0 0 8px;">${i}</li>`)
    .join('')}</ul>`
}

/** A numbered list. */
function emailOrderedList(items: string[]): string {
  return `<ol class="text-secondary" style="margin:0 0 16px;padding-left:20px;color:${COLOR_BODY};font-size:15px;line-height:1.65;">${items
    .map((i) => `<li style="margin:0 0 8px;">${i}</li>`)
    .join('')}</ol>`
}

/** A 1px divider. */
function emailDivider(): string {
  return `<hr class="divider" style="border:none;border-top:1px solid ${COLOR_BORDER};margin:24px 0;"/>`
}

/** Key/value detail rows: a two-column table with hairline rows. */
function emailDetailRows(rows: { label: string; value: string }[]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 0 24px;">${rows
    .map(
      (r) => `<tr>
      <td class="text-muted divider" valign="top" style="padding:10px 16px 10px 0;border-top:1px solid ${COLOR_BORDER};font-size:13px;line-height:1.5;color:${COLOR_MUTED};width:130px;white-space:nowrap;">${r.label}</td>
      <td class="text-primary divider" valign="top" style="padding:10px 0;border-top:1px solid ${COLOR_BORDER};font-size:15px;line-height:1.5;color:${COLOR_CHARCOAL};">${r.value}</td>
    </tr>`,
    )
    .join('')}</table>`
}

/** The flat purple call-to-action button. One per email. */
function emailButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 24px;">
    <tr><td align="left">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="4%" strokecolor="#7c3aed" fillcolor="#7c3aed">
        <w:anchorlock/>
        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:500;">${label}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${href}" style="display:inline-block;background-color:${ACCENT} !important;color:#ffffff !important;text-decoration:none;padding:15px 28px;border-radius:2px;font-size:15px;font-weight:500;font-family:${FONT_STACK};mso-padding-alt:0;">${label}</a>
      <!--<![endif]-->
    </td></tr>
  </table>`
}

/**
 * Shared branded shell: centered logo over a gold rule, the white square card
 * with the body, an optional founder signature, then the footer. `bodyHtml` is
 * the per-email content. `heroImageUrl` swaps the logo header for a full-width
 * image flush at the top of the card.
 */
function renderBrandedEmail(opts: {
  preheader: string
  bodyHtml: string
  heroImageUrl?: string
  signature?: 'founder' | 'none'
}): string {
  const { preheader, bodyHtml, heroImageUrl, signature = 'founder' } = opts

  const signatureHtml =
    signature === 'founder'
      ? `${emailDivider()}
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td valign="top" style="padding-right:16px;">
                <img src="${EMAIL_ASSET_ORIGIN}/assets/email/nick-headshot.jpg" width="56" height="56" alt="Nick Cabugos" style="display:block;width:56px;height:56px;border-radius:0;border:0;"/>
              </td>
              <td valign="top">
                <p class="text-primary" style="margin:0;font-size:14px;line-height:1.5;color:${COLOR_CHARCOAL};font-weight:500;">Nick Cabugos</p>
                <p class="text-muted" style="margin:0;font-size:13px;line-height:1.6;color:${COLOR_MUTED};">Founder, Elite Advisor Hub</p>
                <p class="text-muted" style="margin:0;font-size:13px;line-height:1.6;color:${COLOR_MUTED};">${emailLink('eliteadvisorhub.com', EMAIL_ASSET_ORIGIN)}</p>
                <p class="text-muted" style="margin:6px 0 0;font-size:12px;line-height:1.5;color:${COLOR_MUTED};">Virtuoso-grade websites for the top travel advisors.</p>
              </td>
            </tr></table>
            <p class="text-muted" style="margin:18px 0 0;font-size:12px;line-height:1.6;color:${COLOR_MUTED};">Eden For Your World was the first advisor on board. Take a look: ${emailLink('edenforyourworld.com', 'https://edenforyourworld.com')}</p>`
      : ''

  // Logo + gold rule, shown above the card only when there is no hero image.
  const logoHeader = `<tr><td align="center" style="padding-bottom:0;">
          <img class="logo-light" src="${EAH_LOGO_URL}" width="160" alt="Elite Advisor Hub" style="display:inline-block;width:160px;max-width:60%;height:auto;border:0;"/>
          <!--[if !mso]><!-->
          <img class="logo-dark" src="${EAH_LOGO_DARK_URL}" width="160" alt="Elite Advisor Hub" style="display:none;width:160px;max-width:60%;height:auto;border:0;"/>
          <!--<![endif]-->
        </td></tr>
        <tr><td align="center" style="padding:16px 0 28px;">
          <div style="width:40px;height:1px;background-color:${COLOR_GOLD};margin:0 auto;line-height:1px;font-size:0;">&nbsp;</div>
        </td></tr>`

  const card = heroImageUrl
    ? `<tr><td class="bg-card" style="background-color:${COLOR_CARD};border:1px solid ${COLOR_BORDER};border-radius:0;">
          <a href="https://eliteadvisorhub.com" target="_blank" style="display:block;"><img src="${heroImageUrl}" width="558" alt="Elite Advisor Hub" style="display:block;width:100%;max-width:558px;height:auto;border:0;"/></a>
          <div class="card-padding" style="padding:44px;">
            ${bodyHtml}
            ${signatureHtml}
          </div>
        </td></tr>`
    : `${logoHeader}
        <tr><td class="bg-card card-padding" style="background-color:${COLOR_CARD};border:1px solid ${COLOR_BORDER};border-radius:0;padding:44px;">
            ${bodyHtml}
            ${signatureHtml}
        </td></tr>`

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="color-scheme" content="light dark"/><meta name="supported-color-schemes" content="light dark"/>
<style>
  @media (prefers-color-scheme: dark) {
    body, .bg-page { background-color: #131210 !important; }
    .bg-card { background-color: #1c1a17 !important; border-color: #2e2b26 !important; }
    .text-primary { color: #fafaf5 !important; }
    .text-secondary { color: #b8b2a7 !important; }
    .text-muted { color: #8a8279 !important; }
    .text-link { color: #fafaf5 !important; }
    .divider { border-top-color: #2e2b26 !important; }
    .logo-light { display: none !important; }
    .logo-dark { display: inline-block !important; }
  }
  @media only screen and (max-width: 480px) {
    .card-padding { padding: 32px 24px !important; }
  }
</style>
</head>
<body class="bg-page" style="margin:0;padding:0;background-color:${COLOR_PAGE};font-family:${FONT_STACK};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-page" style="background-color:${COLOR_PAGE};">
    <tr><td align="center" style="padding:48px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">
        ${card}
        <tr><td align="center" style="padding:28px 16px 0;">
          <p class="text-muted" style="margin:0;font-size:12px;line-height:1.6;color:${COLOR_MUTED};">Elite Advisor Hub &nbsp;·&nbsp; <a href="${EMAIL_ASSET_ORIGIN}" style="color:${COLOR_MUTED};text-decoration:underline;">eliteadvisorhub.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/* ── System emails ──────────────────────────────────────────────────────── */

export interface OnboardingAgent {
  full_name: string
  agency_name: string
  email: string
  template: string
  tier?: string
  phone?: string | null
}

/** Render the admin onboarding notification without sending (for previews). */
export function renderAdminOnboardingNotificationHtml(agent: OnboardingAgent): string {
  const rows = [
    { label: 'Name', value: escapeHtml(agent.full_name) },
    { label: 'Agency', value: escapeHtml(agent.agency_name) },
    { label: 'Email', value: emailLink(escapeHtml(agent.email), `mailto:${escapeHtml(agent.email)}`) },
    ...(agent.phone ? [{ label: 'Phone', value: escapeHtml(agent.phone) }] : []),
    { label: 'Template', value: escapeHtml(agent.template) },
    { label: 'Tier', value: escapeHtml(agent.tier ?? 'starter') },
  ]
  const bodyHtml = [
    emailHeading('New agent ready for site setup'),
    emailParagraph('An agent just completed onboarding and is waiting for their site.'),
    emailDetailRows(rows),
    emailParagraph(
      `Action needed: design and provision their site within 24 to 48 hours${
        agent.tier === 'custom' ? ' (custom tier: schedule a call first)' : ''
      }.`,
    ),
  ].join('')
  return renderBrandedEmail({
    preheader: `${agent.agency_name} completed onboarding and is waiting for their site.`,
    bodyHtml,
    signature: 'none',
  })
}

/**
 * Notify the admin that a new agent has completed onboarding
 * and their site needs to be designed/provisioned.
 */
export async function sendAdminOnboardingNotification(agent: OnboardingAgent) {
  const { data, error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: await getAdminNotificationEmail(),
    subject: `New agent onboarding: ${agent.agency_name}`,
    html: renderAdminOnboardingNotificationHtml(agent),
  })

  if (error) {
    console.error('[email] Failed to send admin notification:', error)
    throw error
  }
  return data
}

/**
 * Notify the admin that a new lead came in through the public Studio services
 * page at /studio. Studio leads are time-sensitive sales inquiries, so this
 * fires an email (unlike the silent Custom/Agency consultation form). The row
 * is also visible in /admin/consultations with the "Studio" chip.
 */
export interface StudioInquiryNotificationInput {
  firstName: string
  lastName: string
  email: string
  phone: string | null
  businessName: string | null
  websiteUrl: string | null
  /** Plan slug — essential | professional | full-service | agency | unsure. */
  plan: string
  message: string | null
}

const STUDIO_PLAN_LABELS: Record<string, string> = {
  essential: 'Essential',
  professional: 'Professional',
  'full-service': 'Full Service',
  agency: 'Agency (custom)',
  unsure: 'Not sure yet',
}

/** Render the Studio inquiry notification without sending (for previews). */
export function renderStudioInquiryNotificationHtml(input: StudioInquiryNotificationInput): string {
  const fullName = `${input.firstName} ${input.lastName}`.trim()
  const planLabel = STUDIO_PLAN_LABELS[input.plan] ?? input.plan
  const rows = [
    { label: 'Name', value: escapeHtml(fullName) },
    { label: 'Plan interest', value: escapeHtml(planLabel) },
    { label: 'Email', value: emailLink(escapeHtml(input.email), `mailto:${escapeHtml(input.email)}`) },
    ...(input.phone ? [{ label: 'Phone', value: escapeHtml(input.phone) }] : []),
    ...(input.businessName ? [{ label: 'Business', value: escapeHtml(input.businessName) }] : []),
    ...(input.websiteUrl
      ? [{ label: 'Current site', value: emailLink(escapeHtml(input.websiteUrl), escapeHtml(input.websiteUrl)) }]
      : []),
  ]
  const bodyHtml = [
    emailHeading('New Studio inquiry'),
    emailParagraph('A lead just submitted the form on the /studio services page. Follow up while it is warm.'),
    emailDetailRows(rows),
    input.message
      ? emailLabel('What they need') +
        `<p class="text-secondary" style="margin:0 0 24px;font-size:15px;line-height:1.65;color:${COLOR_BODY};white-space:pre-wrap;">${escapeHtml(input.message)}</p>`
      : '',
    emailParagraph(
      `Reply to this email to reach ${escapeHtml(input.firstName)} directly. The reply-to is set to their address.`,
    ),
    emailMutedParagraph(
      `View all Studio and consultation requests at ${emailLink(
        'eliteadvisorhub.com/admin/consultations',
        'https://eliteadvisorhub.com/admin/consultations',
      )}.`,
    ),
  ].join('')
  return renderBrandedEmail({
    preheader: `${fullName} asked about ${planLabel}.`,
    bodyHtml,
    signature: 'none',
  })
}

export async function sendStudioInquiryNotification(input: StudioInquiryNotificationInput) {
  const fullName = `${input.firstName} ${input.lastName}`.trim()
  const planLabel = STUDIO_PLAN_LABELS[input.plan] ?? input.plan

  const { data, error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: await getAdminNotificationEmail(),
    replyTo: input.email,
    subject: `Studio inquiry: ${input.businessName ?? fullName}, ${planLabel}`,
    html: renderStudioInquiryNotificationHtml(input),
  })

  if (error) {
    console.error('[email] Failed to send studio inquiry notification:', error)
    throw error
  }
  return data
}

/** Render the agent welcome email without sending (for previews). */
export function renderAgentWelcomeEmailHtml(agent: OnboardingAgent): string {
  const isCustom = agent.tier === 'custom'
  const timeline = isCustom
    ? 'Because you have chosen our Custom tier, we will reach out within the next business day to schedule a conversation about your site design and unique requirements.'
    : 'Your site will be live within 24 to 48 hours. We are designing it now based on the information you provided.'

  const bodyHtml = [
    emailHeading('Welcome to Elite Advisor Hub'),
    emailParagraph(`Hi ${escapeHtml(agent.full_name)},`),
    emailParagraph(
      `Thank you for completing your onboarding. We have received everything for ${escapeHtml(agent.agency_name)} and our team is on it.`,
    ),
    emailParagraph(timeline),
    emailParagraph(
      `In the meantime, you can log in to your ${emailLink(
        'advisor portal',
        `${EMAIL_ASSET_ORIGIN}/agent-portal`,
      )} anytime to manage your blog, update your profile, or submit site modification requests.`,
    ),
    emailParagraph('If you have any questions, just reply to this email. We are here to help.'),
    emailParagraph(`Welcome aboard,<br/>The Elite Advisor Hub team`),
  ].join('')
  return renderBrandedEmail({
    preheader: 'Your site is on the way. Here is what happens next.',
    bodyHtml,
    signature: 'none',
  })
}

/**
 * Send the new agent a welcome email confirming their onboarding
 * and setting expectations for site delivery.
 */
export async function sendAgentWelcomeEmail(agent: OnboardingAgent) {
  const { data, error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: agent.email,
    subject: `Welcome to Elite Advisor Hub, ${agent.full_name}`,
    html: renderAgentWelcomeEmailHtml(agent),
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
 * All share renderBrandedEmail() with the founder signature block. Each
 * function takes the typed merge fields its template uses.
 * ═══════════════════════════════════════════════════════════════════════════ */


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
    emailParagraph(`Hi ${firstName}, hope you are doing well.`),
    emailParagraph(`Wanted to personally invite you to something I've been building, I think you'd want to see it, and I'd rather get it in front of you before it goes wider.`),
    emailParagraph(`I built Elite Advisor Hub to solve a problem I kept running into as an advisor myself: the best people in this business are running their brands on websites that don't come close to matching the trips they sell. And more often than not, those sites are years behind, built once, launched, then left untouched. It's not unusual to find an advisor's site that hasn't been refreshed in five years or more, even as the work itself has only gotten better. The presence and the practice quietly drift apart.`),
    emailParagraph(`EAH closes that gap. It gives independent advisors a Virtuoso-grade website, composed, fast, SEO-ready, with a built-in journal and curated supplier content that stays current on its own. No more hotel grids and partner amenities to update by hand. Live in days, not months.`),
    emailParagraph(`You can see it for yourself at ${emailLink('eliteadvisorhub.com', 'https://eliteadvisorhub.com')}, there are live demos there that show the difference better than I can describe it.`),
    emailParagraph(`I'm opening it to a small founding group of advisors this month, and I'd love <strong>${brandName}</strong> to be one of them. As a <strong>Founding Advisor</strong>, you'd get:`),
    emailBullets([
      `A site built and launched with my direct, hands-on attention`,
      `Founding Advisor terms, held for as long as you're with us`,
      `A direct line to me before and after launch`,
    ]),
    emailParagraph(`In return, I'd just ask for honest feedback and a testimonial once you've seen what it can do. That's it.`),
    emailParagraph(`Easiest next step is a quick call so I can walk you through it on a brand close to yours. Just reply to this email, or grab a time here:`),
    emailButton('Book a conversation', consultLink),
    emailParagraph(`Hope to hear from you soon.`),
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
      `${tier} tier, confirmed`,
      `Your site is built for you from the intake form`,
      `Reply to this email any time with questions`,
    ]),
    emailParagraph(`I've put together a one-page Founding Advisor summary so everything's in writing.`),
    emailParagraph(`<strong>Step one, create your portal account.</strong> This is where you'll manage your site, blog, and billing. It takes a minute and uses a secure magic link, so there's no password to remember:`),
    emailButton('Create your portal account', portalLink),
    emailParagraph(`<strong>Step two, tell me about ${brandName}.</strong> This short intake form is how I learn your brand, your story, and how you work. It takes about 15 minutes, you can save and return, and you'll be able to upload your logo and a few photos along the way:`),
    emailButton('Start the intake form', intakeLink),
    emailParagraph(`Once both are done, I take it from there. Reply to this email anytime, you've got my direct line throughout.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `Welcome to Elite Advisor Hub, ${firstName}, here's step one`,
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
    emailParagraph(`Your intake is in, thank you. I have what I need to start building <strong>${brandName}</strong>.`),
    emailParagraph(`<strong>What happens now:</strong>`),
    emailOrderedList([
      `I'll build your site draft on the ${tier} template over the next several business days.`,
      `You'll get a private preview link to review everything.`,
      `We'll do one round of edits together so it's exactly right.`,
      `Then we go live.`,
    ]),
    emailParagraph(`You don't need to do anything until the preview lands. If you'd like a quick 20-minute kickoff call to walk through anything before I start, just reply and we'll find a time, it's optional, not required.`),
    emailParagraph(`I'll be in touch soon.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `Got everything, ${firstName}, ${brandName} is in the works`,
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
    emailParagraph(`Just a friendly nudge, I noticed your intake form for <strong>${brandName}</strong> is still open. No pressure at all; I know how full an advisor's week gets.`),
    emailParagraph(`Whenever you have 15 minutes, here's the link again, it saves as you go, so you can do it in pieces:`),
    emailButton('Finish the intake form', intakeLink),
    emailParagraph(`And if anything in it is unclear, or you'd rather just talk it through, reply here and we'll do it together on a quick call.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `Quick nudge, ${firstName}, your EAH intake form`,
    preheader: `No rush, just making sure it didn't slip through.`,
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
    emailParagraph(`This is the part I love. Your site is built, here's a private preview of <strong>${brandName}</strong>:`),
    emailButton('View your preview', previewLink),
    emailParagraph(`Take your time with it. Click through every page, open it on your phone, and notice what feels right and what you'd like adjusted.`),
    emailParagraph(`When you're ready, send me one consolidated round of edits, copy tweaks, photo swaps, anything. The simplest way is the feedback form linked at the top of the preview, but a reply to this email works just as well. I'll make the changes and send the final version for your sign-off.`),
    emailParagraph(`We're close. I think you're going to be proud to share this.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `${firstName}, your site is ready to see`,
    preheader: `A private preview of ${brandName}, take a look and tell me what to refine.`,
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
    emailParagraph(`It's official, <strong>${brandName}</strong> is live:`),
    emailButton('Visit your site', siteUrl),
    emailParagraph(`Congratulations. This is the website your work has deserved.`),
    emailParagraph(`<strong>A few things to set you up well:</strong>`),
    emailBullets([
      `<strong>Your domain</strong>, if there's anything to finish on the domain or your professional email, I've sent separate instructions; reply if you'd like me to handle it with you.`,
      `<strong>Share it</strong>, I've put together a short launch kit with caption ideas and graphics so announcing your new site is effortless. It's in your portal under Resources.`,
      `<strong>Your journal</strong>, fresh, curated content publishes to your site automatically on your ${tier} cadence. Nothing for you to do; it just keeps your site alive.`,
      `<strong>Your portal</strong>, update your profile, manage content, and see leads anytime.`,
    ]),
    emailButton('Open your portal', portalLink),
    emailParagraph(`I'll check in again in a couple of weeks to see how it's feeling. In the meantime, if anything comes up, you know where to find me.`),
    emailParagraph(`Thank you for being a Founding Advisor. It means a great deal.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `You're live, ${firstName}, welcome to Elite Advisor Hub`,
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
    emailParagraph(`<strong>${brandName}</strong> has been live for a couple of weeks now, I'd love to know how it's feeling. Anything you'd change, anything clients have said, anything that would make it work harder for you?`),
    emailParagraph(`If you have 20 minutes, I'd value a short call to hear your honest take on the whole experience, it directly shapes how I build for the advisors who come after you. Reply with a time that works.`),
    emailParagraph(`And two small favors, only if you're glad you did this:`),
    emailOrderedList([
      `<strong>A few words I can share</strong>, a sentence or two about your experience, which I'd love to feature.`,
      `<strong>An introduction or two</strong>, if there's an advisor you respect who deserves a site like yours, a warm intro would mean a lot. (And there's a referral thank-you in it for you.)`,
    ]),
    emailParagraph(`Either way, thank you for trusting me with your brand. It's been a genuine pleasure.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `How's the new site treating you, ${firstName}?`,
    preheader: `A quick check-in, and two small favors, if you're up for them.`,
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
    emailParagraph(`Because <strong>${brandName}</strong> is joining on the ${tier} tier, we start with a conversation rather than a form. Custom builds have room for features, modules, and structure that are worth getting right from the start, and that's best done by talking it through.`),
    emailParagraph(`Grab a 45-minute consultation here:`),
    emailButton('Book your consultation', consultLink),
    emailParagraph(`Before we meet, it helps to have rough answers to: the custom features or modules you're picturing, anything you'd want migrated from an existing site, and any timeline you're working toward. Nothing formal, just bring your thinking.`),
    emailParagraph(`After the call, I'll send a short intake form to capture the brand details, and we'll be off and building.`),
    emailParagraph(`Looking forward to it.`),
    emailParagraph(`Warmly,`),
  ].join('')
  return sendFoundingEmail({
    to,
    subject: `Let's design your build, ${firstName}, book your consultation`,
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
 * preview the design (see scripts/preview-emails.ts).
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
    emailParagraph(`Or if you'd rather look around first, the homepage walks through it: ${emailLink('eliteadvisorhub.com', HOMEPAGE_LINK)}`),
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
    emailParagraph(`Eden For Your World is one of our advisors. Take a look at the site we built and judge the quality for yourself: ${emailLink('edenforyourworld.com', 'https://edenforyourworld.com')}`),
    emailParagraph(`That is the standard. Clean, fast, genuinely premium, and built to bring in the right clients. The same care goes into every Founding Advisor build.`),
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
      `A site built and launched with my hands-on attention`,
      `Founding Advisor terms, held for as long as you stay`,
      `A direct line to me before and after launch`,
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
    emailParagraph(`If a Virtuoso-grade site for ${brandName} is something you want, now is the moment:`),
    emailButton('Book your consultation', CONSULT_LINK),
    emailParagraph(`And if the timing simply isn't right, no problem at all. The door stays open, and you can reach out anytime:`),
    emailButton('See the platform', HOMEPAGE_LINK),
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
