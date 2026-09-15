# Supabase Auth email templates

Source for the emails Supabase Auth sends on behalf of Elite Advisor Hub. The live copy
lives in the Supabase dashboard (Auth > Email Templates); this folder is the version of
record. After editing a file here, push it:

```bash
SUPABASE_ACCESS_TOKEN=$(security find-generic-password -s "Supabase CLI" -w) node scripts/push-auth-email-templates.mjs
```

| File | Sent when | Subject |
|---|---|---|
| `confirmation.html` | New email signs in or registers for the first time | Confirm your email |
| `magic-link.html` | Existing advisor requests a sign-in link | Your sign-in link |
| `recovery.html` | Admin requests a password reset | Reset your password |
| `invite.html` | Operator invites an advisor from Admin > Agents > Add Agent | Your invitation to Elite Advisor Hub |

Links use `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email` (`type=invite` for the
invitation), which
`/api/agent-portal/auth-callback` verifies server-side. That is why the link works when the
email is opened in a different browser or on a phone: nothing from the requesting browser is
needed. `recovery.html` keeps `{{ .ConfirmationURL }}` because `/admin/reset-password` handles
its own session.

Sending: custom SMTP through Resend as `Elite Advisor Hub <no-reply@mail.eliteadvisorhub.com>`,
using a sending-only Resend key scoped to `mail.eliteadvisorhub.com` (no open or click tracking on
that domain, so one-time links go out as direct URLs). Rate limit 30 per hour.
The emails follow the monochrome system (cream ground, white square card, gold rule, flat purple
button), the same shell as `renderBrandedEmail()` in `lib/email.ts`. All four files share one
skeleton; only the title, preheader, heading, body copy, button label, and footer sentence differ.
