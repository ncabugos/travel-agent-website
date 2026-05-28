# Claude Code prompt — finish the tier-feature sweep

Paste the block below into Claude Code in the repo root. It is self-contained;
nothing depends on prior conversation.

---

We changed the tier × feature contract in `CLAUDE.md` §3 (already committed to that file). I need you to finish the sweep across the rest of the repo so nothing still parrots the old tiering.

## The three rules (these are the policy)

1. **Curated editorials are hard-gated to Growth+.** Starter no longer gets a 1-post/month operator broadcast. Starter advisors keep the journal module (M18) for advisor-written posts only via the Tiptap editor; the operator-produced curated stream does not flow to Starter sites. Upgrade to Growth is the only path in.
2. **Tiers are described by features, not by template.** Every tier ships a **custom-branded site**. Marketing copy must lead with "custom-branded site, features per tier" — never "Starter gets the frontend template" or "Growth gets Vista or Meridian." Which internal template the build sits on (`frontend`, `t2`, `t3`, `t4`) is an implementation detail and should not appear in tier comparisons.
3. **Agency's headline differentiator is the Agent Directory.** Wherever Agency is described next to the other tiers, call out the agent directory by name — individual advisor profiles under one agency brand, agency-wide lead routing, shared content library.

The authoritative matrix is in `CLAUDE.md` §3 and on Sheet 1 of `Elite_Advisor_Hub_Feature_Matrix.xlsx`. Read those first if anything is ambiguous.

## Already updated in the prior sweep (do not re-edit)

- `CLAUDE.md` §3
- `Elite_Advisor_Hub_Feature_Matrix.xlsx` (Sheet 1 retitled to "Tier × Feature Matrix"; Sheet 2 M18 + M32 corrected; M32 renamed "Curated Editorial Stream" with Starter = "—")
- `components/marketing/MarketingPricing.tsx`
- `components/marketing/MarketingCuratedEditorial.tsx` (cadence grid: Starter = "Not included")
- `app/agent-portal/register/page.tsx` (subline no longer says "journal pipeline")
- `Beta_Invite_Personal_Email.md`
- `EAH_Onboarding_Email_Templates.md` (Email 1)
- `tasks/todo.md` (change logged at top)

## Surfaces to sweep now

**Internal docs known to still use the old tiering** — update each to reflect the new policy, but keep the doc's original voice:

- `docs/starter-demo-spec.md` — currently references "1 post/month operator broadcast" for the Starter demo. Starter demos should now show advisor-written posts only; the curated drumbeat is a Growth feature.
- `docs/brand-positioning.md` — the Starter "After" copy on line ~58 quotes the old MarketingPricing blurb ("Curated supplier programs, your custom domain, the journal pipeline…"). Replace with the new Starter blurb from `MarketingPricing.tsx`.
- `docs/aurora-concept.md` — the "journal pipeline" reference is fine as a platform concept but check the context isn't implying Starter access.
- `docs/growth-demo-spec.md` — references "Growth runs 1/week broadcast cadence." That's still accurate, but verify nothing in the same doc implies Starter has a cadence at all.

**Repo-wide audit** — search and judge case-by-case. Do not blanket-replace.

- `rg -i "1 post.?/.?month|post per month|monthly cadence|monthly broadcast"` — any Starter cadence promise is stale.
- `rg -i "journal pipeline|broadcast cadence|operator broadcast"` — these phrases predate the rename to "curated editorial stream."
- `rg -i "Vista or Meridian|frontend only|frontend template"` in marketing/copy paths (`app/`, `components/marketing/`, `*.md` at repo root, `docs/`) — flag tier-by-template framing on customer-facing surfaces and rewrite to feature framing. Tenant-template code paths (`app/t2`, `app/t3`, `app/t4`, `components/t2`, `components/t3`, `components/t4`) are implementation, leave alone.
- `rg -i "agency.*directory|multi-advisor"` — confirm every Agency comparison names the Agent Directory explicitly.

**Out of scope** — do not touch:

- `app/templates/page.tsx` and `components/marketing/MarketingBrandedWebsite.tsx` (templates showcases by purpose, not tier explainers).
- Tenant-template code under `app/t2`, `app/t3`, `app/t4`, `components/t2`, `components/t3`, `components/t4`.
- Database migrations and seeders (the schema doesn't change).

## Verification

- `npx tsc --noEmit` clean on touched files.
- `npx eslint <changed files>` clean.
- **Do not run `npm run build`** — it fails in some sandboxes; tsc + eslint is the established floor.
- Spot-read the diff before commit.

## Commit

One commit. Suggested message:

```
content: enforce Growth+ gate on curated editorials, feature-led tier framing

Sweeps internal docs and any remaining marketing copy to match the May 2026
tier × feature matrix in CLAUDE.md §3 and the Feature Matrix xlsx:

- Curated editorials hard-gated to Growth+ (Starter = advisor-written only)
- Tiers described by features, not by which template the build sits on
- Agency's headline differentiator is the Agent Directory, called out by name
```

## If you find ambiguity

If a doc you touch could plausibly be read either way (e.g., the Aurora concept paper mentions "the journal pipeline" as a platform mechanism rather than a Starter feature), leave it and surface it in the commit body as "not edited — reads as platform-level, not tier-level." Don't silently over-edit.
