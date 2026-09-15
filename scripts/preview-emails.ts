/**
 * Render every email template in lib/email.ts to standalone HTML files you can
 * open in a browser. Nothing is sent and no API key is needed; only the pure
 * render/build functions are called.
 *
 *   npx tsx scripts/preview-emails.ts
 *
 * Output: scratch/emails/<name>.html (the scratch/ folder is git-ignored).
 * For a visual check, screenshot one with headless Chrome:
 *
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
 *     --disable-gpu --window-size=640,1200 --screenshot=scratch/emails/welcome.png \
 *     file://$PWD/scratch/emails/welcome.html
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  buildBetaInvitationEmail,
  buildWarmHowItWorksEmail,
  buildWarmProofEmail,
  buildWarmFoundingWindowEmail,
  buildWarmLastCallEmail,
  renderFoundingEmailHtml,
  renderAdminOnboardingNotificationHtml,
  renderStudioInquiryNotificationHtml,
  renderAgentWelcomeEmailHtml,
} from '../lib/email'

// Sample merge data so you can see how personalization reads.
const warm = { to: 'preview@example.com', firstName: 'Jane', brandName: 'Wanderlust Travel Co' }
const agent = {
  full_name: 'Jane Whitfield',
  agency_name: 'Wanderlust Travel Co',
  email: 'jane@wanderlusttravel.co',
  template: 't2',
  tier: 'growth',
  phone: '+1 (415) 555-0142',
}

const previews: Record<string, string> = {
  'founding-1-beta-invitation': renderFoundingEmailHtml(
    buildBetaInvitationEmail({ ...warm, consultLink: 'https://eliteadvisorhub.com/schedule-consultation' }),
  ),
  'warm-2-how-it-works': renderFoundingEmailHtml(buildWarmHowItWorksEmail(warm)),
  'warm-3-proof': renderFoundingEmailHtml(buildWarmProofEmail(warm)),
  'warm-4-founding-window': renderFoundingEmailHtml(buildWarmFoundingWindowEmail(warm)),
  'warm-5-last-call': renderFoundingEmailHtml(buildWarmLastCallEmail(warm)),
  'system-admin-onboarding': renderAdminOnboardingNotificationHtml(agent),
  'system-studio-inquiry': renderStudioInquiryNotificationHtml({
    firstName: 'Jane',
    lastName: 'Whitfield',
    email: 'jane@wanderlusttravel.co',
    phone: '+1 (415) 555-0142',
    businessName: 'Wanderlust Travel Co',
    websiteUrl: 'https://wanderlusttravel.co',
    plan: 'professional',
    message: 'We need a refreshed site before the fall season and help with a monthly journal cadence.',
  }),
  'system-welcome': renderAgentWelcomeEmailHtml(agent),
}

const outDir = resolve(process.cwd(), 'scratch/emails')
mkdirSync(outDir, { recursive: true })

for (const [name, html] of Object.entries(previews)) {
  writeFileSync(resolve(outDir, `${name}.html`), html, 'utf8')
  console.log(`${name}.html`)
}

console.log(`\nWrote ${Object.keys(previews).length} previews to scratch/emails/`)
