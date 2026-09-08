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

Links use `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email`, which
`/api/agent-portal/auth-callback` verifies server-side. That is why the link works when the
email is opened in a different browser or on a phone: nothing from the requesting browser is
needed. `recovery.html` keeps `{{ .ConfirmationURL }}` because `/admin/reset-password` handles
its own session.

Sending: custom SMTP through Resend, sender `Elite Advisor Hub <nick@eliteadvisorhub.com>`.
Palette and type follow `brand/EAH_Brand_Style_Guide.html`.
