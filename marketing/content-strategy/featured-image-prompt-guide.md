# Featured Image Prompt Guide — EAH Blog

**Purpose:** A repeatable way to generate a featured-image prompt for every EAH blog article, written for ChatGPT / DALL-E / GPT-image (natural-language prompts, not Midjourney flags).

**How to trigger it:** When new articles are drafted, say *"generate featured image prompts for the new articles."* Claude reads each article's thesis and produces one prompt per article using the formula below. Output lands in `featured-image-prompts.md`.

---

## The brand visual rules (non-negotiable)

These come from `docs/brand-positioning.md` and `brand/EAH_Brand_Style_Guide.html`. Every prompt must honor them:

- **Editorial, not stock.** Large, slow, confident imagery in the register of *Departures* or *Town & Country*. Never travel-poster clichés (overwater bungalows, sunset beaches, suitcase-on-map).
- **Restraint and negative space.** Generous empty space, calm composition. The image should feel like a private club, not an online catalog. Negative space also leaves room for a headline overlay.
- **Palette:** warm cream and limestone neutrals, deep charcoal, muted navy, brushed-gold / warm-metallic accents. Avoid the saturated travel-poster blues every competitor uses.
- **No text, ever.** Every prompt ends by forbidding text, letters, words, fonts, logos, and watermarks.
- **No identifiable faces.** People may appear from behind or as distant figures for scale, never as a recognizable portrait (avoids the stock-photo look and likeness issues).
- **Concept over literalism.** The image is a visual metaphor for the article's core argument, not a literal illustration of "a website."
- **Aspect ratio in words.** Specify "widescreen 16:9 horizontal composition" (ChatGPT image tools do not take `--ar`).

---

## The formula

Build each prompt from these six parts, in this order, as flowing prose (not a bulleted list when delivered):

1. **Medium + style** — e.g. "Editorial luxury photography," "Architectural editorial photography," "Fine-art still-life photography," "Quiet landscape photography."
2. **Subject + metaphor** — the single conceptual object or scene that embodies the article's thesis.
3. **Composition** — framing, where the negative space sits, scale cues.
4. **Light + mood** — usually soft and directional or calm natural light; the feeling is confident and unhurried.
5. **Palette** — the EAH neutrals plus a restrained metallic or navy accent.
6. **Constraints** — "photorealistic, magazine quality, widescreen 16:9 horizontal composition, generous negative space, no people's faces, and absolutely no text, letters, words, logos, or watermarks."

### Reusable template (fill the brackets)

> [Medium/style], [conceptual subject and metaphor that embodies the article's argument]. [Composition and where the negative space falls]. [Light and mood — calm, confident, unhurried]. A restrained palette of warm cream and limestone neutrals, deep charcoal, and a single brushed-gold accent; avoid saturated blues. Photorealistic, editorial magazine quality, widescreen 16:9 horizontal composition, generous negative space, no identifiable faces, and absolutely no text, letters, words, logos, or watermarks.

---

## Worked example (the reference standard)

**Article:** *The Supplier Catalog Is the Moat*
**Concept:** the platform's value is the vast maintained catalog beneath the surface; the metaphor is unseen depth, structure, and foundational luxury.

> Architectural editorial photography of a serene, sunken limestone reflecting pool in the courtyard of a minimalist high-end desert resort. The water is perfectly still, mirroring the clean lines of a single monolithic stucco pillar; the pool's depth is hinted at but unseen. Composition built around massive negative space and sharp shadows from harsh, directional desert sunlight. A restrained palette of warm cream and limestone neutrals, deep charcoal shadow, and a single brushed-gold accent; avoid saturated blues. Photorealistic, editorial magazine quality, widescreen 16:9 horizontal composition, generous negative space, no identifiable faces, and absolutely no text, letters, words, logos, or watermarks.

That is the bar: a concept, a single strong image, brand palette, room for a headline, no text.

---

## Quick checklist before delivering a prompt

- [ ] Does the image express the article's *argument*, not just its topic?
- [ ] Is there real negative space for a headline overlay?
- [ ] Palette: warm neutrals + charcoal + one metallic/navy accent, no poster-blue?
- [ ] Editorial register, no stock-travel clichés?
- [ ] Aspect ratio stated in words, text/faces/logos forbidden?
