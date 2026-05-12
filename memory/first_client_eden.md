---
name: First paying client — Eden For Your World
description: John Oberacker / edenforyourworld.com — first paying advisor on EAH, designated brand ambassador for the eliteadvisorhub.com marketing launch
type: project
---

**Real DB row:** `2e18df43-171a-4565-b840-aade259cab69` — John Oberacker, agency_name "Eden For Your World", role `agent`, tier `growth`, template `frontend`, custom_domain `edenforyourworld.com`. Email `info@edenforyourworld.com`. Created 2026-04-16.

**Strategic role:** Eden is positioned as **brand ambassador** for the eliteadvisorhub.com public launch. Case study material — testimonial, before/after, "advisor success story" content — should be sourced from this account first.

**Why:** First paying client validates the product on a non-operator account. Eden's site already runs on a custom domain via the middleware rewrite (which is what the curl session in `.claude/settings.local.json` was confirming). Real leads, real content, real revenue. This is the proof point for Phase 2 (soft public launch).

**How to apply:** When discussing case studies, testimonials, or ambassador content for the EAH marketing site, default to Eden as the example. When discussing the legacy `demo-agent` slug labeled "Eden — Custom (Frontend)" in `lib/demo-agents.ts`, note that this is a stale mock fixture predating the real Eden account — it should be renamed (proposed: `starter-demo` or `solo-demo`) to remove the conflict.

**The legacy WordPress import** (`edenforyourworld.WordPress.2026-03-24.xml` + migration `005_wp_import.sql`) belongs to Eden's prior site and was migrated into Supabase `blog_posts`. Migration `025_reassign_blogs_to_eden.sql` finalized that ownership.
