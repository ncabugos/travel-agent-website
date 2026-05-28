/**
 * One-off: send a live test of a Founding Advisor email via Resend.
 *
 *   npx tsx scripts/send-test-email.ts [recipient]
 *
 * Loads RESEND_API_KEY (and optional EMAIL_* overrides) from .env.local, then
 * sends the Beta Invitation (Email 1) with sample merge fields. Defaults to
 * cabugosb3@gmail.com. Edit the call below to test a different template.
 */
import { readFileSync } from 'node:fs'

function loadEnvLocal(): void {
  try {
    const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/)
      if (!m) continue
      const key = m[1]
      let val = m[2]
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      if (process.env[key] === undefined) process.env[key] = val
    }
  } catch {
    // No .env.local — fall back to ambient environment.
  }
}

async function main() {
  loadEnvLocal()

  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set (checked .env.local and ambient env)')
  }

  const to = process.argv[2] ?? 'cabugosb3@gmail.com'

  // Imported after env is loaded — lib/email reads env at module-load time.
  const { sendBetaInvitationEmail } = await import('../lib/email')

  const res = await sendBetaInvitationEmail({
    to,
    firstName: 'Nick',
    brandName: 'Wine & Wellness Travel',
    consultLink: 'https://eliteadvisorhub.com/schedule-consultation',
  })

  console.log(`Beta invitation sent to ${to}.`)
  console.log('Resend response:', JSON.stringify(res))
}

main().catch((e) => {
  console.error('Send failed:', e?.message ?? e)
  process.exit(1)
})
