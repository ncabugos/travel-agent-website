/**
 * One-off: send one step of the personal warm founding sequence, 1:1, via Resend.
 *
 *   npx tsx scripts/send-warm-sequence.ts <step>            # dry run (prints recipients, sends nothing)
 *   npx tsx scripts/send-warm-sequence.ts <step> --send     # actually send
 *
 *   step = 1..5   (1 invitation, 2 how-it-works, 3 proof, 4 founding-window, 5 last-call)
 *
 * Run each step on its own day so the cadence stays human: 0, +3, +6, +10, +14.
 * Each contact is emailed individually (never a shared To/CC) with a short random
 * delay between sends. Anyone listed in scripts/warm-suppress.txt is skipped, so
 * add an address there the moment they reply, book, or ask to stop.
 *
 * Contacts: scripts/warm-contacts.csv with headers  email,firstName,brandName
 * Reads RESEND_API_KEY (+ optional EMAIL_* overrides) from .env.local.
 * Sends from your existing verified domain — no subdomain required at this size.
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

interface Contact {
  email: string
  firstName: string
  brandName: string
}

function readContacts(): Contact[] {
  const csvName = process.env.CSV || 'warm-contacts-rd1.csv'
  const raw = readFileSync(new URL(`./${csvName}`, import.meta.url), 'utf8').trim()
  const lines = raw.split('\n')
  const header = lines.shift() ?? ''
  if (!/email/i.test(header)) {
    throw new Error('warm-contacts.csv must start with a header row: email,firstName,brandName')
  }
  return lines
    .map((line) => line.split(',').map((s) => s.trim()))
    .filter((cols) => cols[0])
    .map(([email, firstName = '', brandName = '']) => ({ email, firstName, brandName }))
}

function readSuppressed(): Set<string> {
  try {
    const raw = readFileSync(new URL('./warm-suppress.txt', import.meta.url), 'utf8')
    return new Set(
      raw
        .split('\n')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s && !s.startsWith('#')),
    )
  } catch {
    return new Set()
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  loadEnvLocal()

  const step = Number(process.argv[2])
  const doSend = process.argv.includes('--send')

  if (!Number.isInteger(step) || step < 1 || step > 5) {
    throw new Error('Pass a step 1..5, e.g. `npx tsx scripts/send-warm-sequence.ts 1`')
  }
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set (checked .env.local and ambient env)')
  }

  // Imported after env is loaded — lib/email reads env at module-load time.
  const email = await import('../lib/email')

  // step -> how to send one email to one contact
  const senders: Record<number, (c: Contact) => Promise<unknown>> = {
    1: (c) =>
      email.sendBetaInvitationEmail({
        to: c.email,
        firstName: c.firstName,
        brandName: c.brandName,
        consultLink: 'https://eliteadvisorhub.com/schedule-consultation',
      }),
    2: (c) => email.sendWarmHowItWorksEmail({ to: c.email, firstName: c.firstName, brandName: c.brandName }),
    3: (c) => email.sendWarmProofEmail({ to: c.email, firstName: c.firstName, brandName: c.brandName }),
    4: (c) => email.sendWarmFoundingWindowEmail({ to: c.email, firstName: c.firstName, brandName: c.brandName }),
    5: (c) => email.sendWarmLastCallEmail({ to: c.email, firstName: c.firstName, brandName: c.brandName }),
  }

  const labels: Record<number, string> = {
    1: 'Email 1 — Invitation',
    2: 'Email 2 — How it works',
    3: 'Email 3 — Proof',
    4: 'Email 4 — Founding window',
    5: 'Email 5 — Last call',
  }

  const suppressed = readSuppressed()
  const all = readContacts()
  const recipients = all.filter((c) => !suppressed.has(c.email.toLowerCase()))
  const skipped = all.length - recipients.length

  console.log(`\n${labels[step]}`)
  console.log(`Contacts: ${all.length} · suppressed: ${skipped} · to send: ${recipients.length}`)
  console.log(doSend ? 'Mode: SEND (live)\n' : 'Mode: DRY RUN (nothing will be sent)\n')

  let sent = 0
  for (const c of recipients) {
    if (!doSend) {
      console.log(`  would send to ${c.email} (${c.firstName} · ${c.brandName})`)
      continue
    }
    try {
      await senders[step](c)
      sent++
      console.log(`  sent to ${c.email}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(`  FAILED ${c.email}: ${msg}`)
    }
    // Random 6-14s gap so 20 sends look human, not like a blast.
    await sleep(6000 + Math.floor(Math.random() * 8000))
  }

  console.log(doSend ? `\nDone. Sent ${sent}/${recipients.length}.` : `\nDry run complete. Re-run with --send to send.`)
}

main().catch((e) => {
  console.error('Run failed:', e?.message ?? e)
  process.exit(1)
})
