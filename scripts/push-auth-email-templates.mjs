#!/usr/bin/env node
/**
 * Push the Supabase Auth email templates in docs/supabase-email-templates/
 * to the live project (Auth > Email Templates) through the Management API.
 *
 *   SUPABASE_ACCESS_TOKEN=$(security find-generic-password -s "Supabase CLI" -w) \
 *     node scripts/push-auth-email-templates.mjs [--dry-run]
 *
 * The token is the one `supabase login` stores. Templates use {{ .TokenHash }}
 * and {{ .RedirectTo }}; the receiving route is /api/agent-portal/auth-callback.
 */
import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PROJECT_REF = 'zcllngvctqthvqaupxyt'
const DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../docs/supabase-email-templates')

// file → { subject key, content key, subject line }
const TEMPLATES = {
  'confirmation.html': { subject: 'mailer_subjects_confirmation', content: 'mailer_templates_confirmation_content', text: 'Confirm your email' },
  'magic-link.html':   { subject: 'mailer_subjects_magic_link',   content: 'mailer_templates_magic_link_content',   text: 'Your sign-in link' },
  'recovery.html':     { subject: 'mailer_subjects_recovery',     content: 'mailer_templates_recovery_content',     text: 'Reset your password' },
}

const token = process.env.SUPABASE_ACCESS_TOKEN
if (!token) {
  console.error('SUPABASE_ACCESS_TOKEN is not set. See the header of this script.')
  process.exit(1)
}
const dryRun = process.argv.includes('--dry-run')

const body = {}
for (const [file, keys] of Object.entries(TEMPLATES)) {
  const html = await readFile(resolve(DIR, file), 'utf8')
  body[keys.subject] = keys.text
  body[keys.content] = html
  console.log(`${file}: "${keys.text}" (${html.length} chars)`)
}

if (dryRun) {
  console.log('dry run, nothing pushed')
  process.exit(0)
}

const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})
if (!res.ok) {
  console.error(`push failed: ${res.status} ${await res.text()}`)
  process.exit(1)
}
const cfg = await res.json()
for (const keys of Object.values(TEMPLATES)) {
  console.log(`${keys.subject} = "${cfg[keys.subject]}" · ${cfg[keys.content]?.length ?? 0} chars live`)
}
