/**
 * Render all 5 warm-sequence emails to standalone HTML files you can open in a
 * browser. Nothing is sent and no API key is needed. Use this to see and tweak
 * the design; the actual look lives in renderBrandedEmail() in lib/email.ts and
 * the wording lives in the build* functions there.
 *
 *   npx tsx scripts/preview-warm-sequence.ts
 *
 * Output: marketing/launch-campaign/previews/email-1..5.html
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import {
  buildBetaInvitationEmail,
  buildWarmHowItWorksEmail,
  buildWarmProofEmail,
  buildWarmFoundingWindowEmail,
  buildWarmLastCallEmail,
  renderFoundingEmailHtml,
} from '../lib/email'

// Sample merge data so you can see how personalization reads.
const sample = { firstName: 'Jane', brandName: 'Wanderlust Travel Co' }

const emails = [
  buildBetaInvitationEmail({
    to: 'preview@example.com',
    ...sample,
    consultLink: 'https://eliteadvisorhub.com/schedule-consultation',
  }),
  buildWarmHowItWorksEmail({ to: 'preview@example.com', ...sample }),
  buildWarmProofEmail({ to: 'preview@example.com', ...sample }),
  buildWarmFoundingWindowEmail({ to: 'preview@example.com', ...sample }),
  buildWarmLastCallEmail({ to: 'preview@example.com', ...sample }),
]

const outDir = new URL('../marketing/launch-campaign/previews/', import.meta.url)
mkdirSync(outDir, { recursive: true })

emails.forEach((built, i) => {
  const html = renderFoundingEmailHtml(built)
  const file = new URL(`email-${i + 1}.html`, outDir)
  writeFileSync(file, html, 'utf8')
  console.log(`email-${i + 1}.html  ·  ${built.subject}`)
})

console.log(`\nWrote ${emails.length} previews to marketing/launch-campaign/previews/`)
