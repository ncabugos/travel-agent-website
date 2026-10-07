#!/usr/bin/env node
/**
 * fix_insights_2026_10.js
 * October 2026 Insights cleanup, from the GA4 leads report review:
 *   1. Old tier names and prices (Growth/Custom, $89 to $349, $499 setup) -> the
 *      September 2026 tiers: Starter $1,499 + $59/mo, Boutique Agency $2,500 +
 *      $79/mo, Agency $4,999 setup with the monthly quoted on the number of sites.
 *   2. The retired "Founding Advisor program" offer and dead /beta links (404)
 *      -> /schedule-consultation.
 *   3. how-tiers-stack-modules rewritten for the three public tiers.
 *   4. ai-search-travel-advisors retargeted so it stops competing with
 *      ai-search-for-travel-advisors, plus a cross-link.
 *   5. FAQ added to hotel-programs-on-every-site (the only post without one).
 *
 * Every find string must match exactly once or the post is skipped. Dry run by
 * default; pass --apply to write. Post pages refresh within the hour (ISR
 * revalidate = 3600); saving a post in /admin/insights refreshes only that post.
 *
 * Run: node scripts/fix_insights_2026_10.js [--apply]
 */
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function loadEnvLocal() {
  const p = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(p)) return
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnvLocal()
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const APPLY = process.argv.includes('--apply')

const CONSULT = '<a href="/schedule-consultation">book a consultation</a>'

/* ── Body find/replace, per post ─────────────────────────────────────────── */
const BODY = {
  'best-website-builders-for-travel-agents': [
    ['<p>$89 to $349/mo plus setup</p>', '<p>$59 to $79/mo plus setup from $1,499</p>'],
    ['the <a href="/beta">Founding Advisor program</a> (setup waived, first month free, a held founding rate) is the current door in.</p>',
     `you can ${CONSULT} to talk through which tier fits.</p>`],
  ],
  'curated-editorial-stream': [
    ['It is available on Growth and above, and it is the most common reason advisors upgrade.',
     'It is included from the Boutique Agency tier up, and it is the most common reason advisors upgrade.'],
    ['<strong>Published on a cadence by tier.</strong> Growth receives a regular weekly cadence; Custom receives more, plus the ability to request topics; Agency receives content per advisor with a co-authored option.',
     '<strong>Published on a cadence by tier.</strong> Boutique Agency receives one written post a week; Agency receives two co-authored posts a week per advisor.'],
    ['It is hard-gated to Growth and above. Starter advisors write their own posts through the editor; the curated stream does not flow to Starter.',
     'It starts at Boutique Agency. Starter advisors write their own posts through the editor; the curated stream does not flow to Starter.'],
    ['Because the stream is gated to Growth and above, accessing it is the clearest single reason to move from Starter to Growth, and we built the tiers so that upgrade is additive rather than a rebuild. The template showcase shows advisor journals with the stream running, and the Founding Advisor program (setup waived, first month free, a held founding rate) applies to Growth and the tiers above it.',
     `Because the stream starts at Boutique Agency, it is the clearest single reason to move up from Starter, and we built the tiers so that upgrade is additive rather than a rebuild. The template showcase shows advisor journals with the stream running, or you can ${CONSULT} to see it on a live site.`],
  ],
  'how-luxury-travel-advisors-get-clients': [
    ['and on Growth tiers and above a curated editorial stream', 'and from the Boutique Agency tier up a curated editorial stream'],
    ['and the <a href="/beta">Founding Advisor program</a> (setup waived, first month free, a held founding rate) is the current way in.',
     `and you can ${CONSULT} when you are ready.`],
  ],
  'seo-for-travel-advisors': [
    ['on Elite Advisor Hub, Growth tiers and above receive a curated editorial stream', 'on Elite Advisor Hub, the Boutique Agency and Agency tiers receive a curated editorial stream'],
    ['and the <a href="/beta">Founding Advisor program</a> (setup waived, first month free) is open.',
     `and you can ${CONSULT} to see it applied to your practice.`],
  ],
  'squarespace-for-travel-agents': [
    ['<p>Clean editor on all tiers; operator-curated weekly stream on Growth and above</p>', '<p>Clean editor on all tiers; operator-curated weekly stream from Boutique Agency up</p>'],
    ['<p>$89 to $349/mo by tier, setup from $499</p>', '<p>$59 to $79/mo by tier, setup from $1,499</p>'],
    ['and the Founding Advisor program (setup waived, first month free, a founding rate that holds) exists for exactly this migration moment.',
     `and a ${CONSULT.replace('book a consultation', 'consultation')} is the right next step for exactly this migration moment.`],
  ],
  'supplier-catalog-is-the-moat': [
    ['<p>Private villa inventory (Custom tier and above)</p>', '<p>Private villa inventory (add-on at Boutique Agency, included at Agency)</p>'],
    ['The villa collection extends this into private-residence inventory at the Custom tier and above,',
     'The villa collection extends this into private-residence inventory, as an add-on at Boutique Agency and included at Agency,'],
    ['and the Founding Advisor program (setup waived, first month free, a held founding rate) is the current way onto the platform.',
     `and you can ${CONSULT} to see it with your own suppliers.`],
  ],
  'travel-advisor-website-guide': [
    ['<p>$1,068 to $4,188/yr plus setup from $499</p>', '<p>$708 to $948/yr plus setup from $1,499</p>'],
    ['Tiers run $89 to $349 a month for independents (Agency plans from $899), differing by features rather than design quality;',
     'Tiers run $59 to $79 a month for independents, with setup from $1,499 (Agency plans for multi-advisor firms are quoted on the number of sites), differing by features rather than design quality;'],
    ['and the Founding Advisor program (setup waived, first month free, founding rate held for as long as you stay) is open for advisors ready to move now.',
     `and you can ${CONSULT} if you are ready to move now.`],
  ],
  'travel-agent-website-cost': [
    ['<td>$1,068 to $4,188/yr + setup from $499</td>', '<td>$708 to $948/yr + setup from $1,499</td>'],
    ['Elite Advisor Hub runs $89 to $349 a month for independent advisors depending on tier, plus a one-time setup fee from $499. Agency plans for multi-advisor firms start at $899 a month. Every tier includes a custom-branded site, the maintained luxury supplier catalog, a lead inbox, and a self-service portal; upper tiers add a weekly curated editorial stream, villa inventory, and bespoke design work.',
     'Elite Advisor Hub runs $59 a month on Starter and $79 a month on Boutique Agency, plus a one-time setup fee of $1,499 or $2,500. The Agency plan for multi-advisor firms is $4,999 to set up, with the monthly quoted on the number of advisor sites. Every tier includes a custom-branded site, the maintained luxury supplier catalog, a lead inbox, and a self-service portal; Boutique Agency adds a weekly curated editorial stream and directories, and Agency adds multi-advisor management, villas, and bespoke design.'],
    ['<p>At this writing, the Founding Advisor program waives the setup fee and includes the first month free, with a founding rate that holds for as long as you stay.</p>',
     `<p>To see which tier fits your practice, ${CONSULT}.</p>`],
  ],
  'what-a-travel-advisor-website-needs': [
    ['the Founding Advisor program (setup waived, first month free) is open for advisors ready to close the gap now.',
     `advisors ready to close the gap now can ${CONSULT}.`],
  ],
  'first-impression-you-never-get-to-make': [
    ['the Founding Advisor program is open: setup waived, first month free, a founding rate that holds for as long as you stay.',
     `${CONSULT} and we will show you what yours could look like.`],
  ],
  'do-travel-agents-need-a-website': [
    ['and the Founding Advisor program (setup waived, first month free) is open.', `and you can ${CONSULT} to see it for your practice.`],
  ],
  'how-clients-vet-a-travel-advisor': [
    ['with the <a href="/beta">Founding Advisor program</a> (setup waived, first month free) currently open.',
     `and you can ${CONSULT} to see one built for your practice.`],
  ],
  'ai-search-travel-advisors': [
    ['; the <a target="_blank" rel="noopener noreferrer" href="/beta">Founding Advisor program</a> (setup waived, first month free) is open.',
     `, or you can ${CONSULT}.`],
  ],
  'travel-agency-website-design-luxury-clients': [
    ['and the Founding Advisor program (setup waived, first month free, a founding rate that holds) is built for advisors who want a site at this level without managing it themselves.',
     `and advisors who want a site at this level without managing it themselves can ${CONSULT}.`],
  ],
  'host-agency-vs-going-independent': [
    ['The Founding Advisor program (setup waived, first month free, a founding rate that holds) exists for advisors making exactly this kind of transition.',
     `If you are making exactly this kind of transition, ${CONSULT}.`],
  ],
}

/* ── FAQ answer find/replace ─────────────────────────────────────────────── */
const FAQ = {
  'travel-agent-website-cost': [
    ['with bespoke design included at the Custom level and above.', 'with bespoke design included on the Agency plan.'],
  ],
  'best-website-builders-for-travel-agents': [
    ['with curated editorial content on Growth tiers and above.', 'with curated editorial content from the Boutique Agency tier up.'],
  ],
  'curated-editorial-stream': [
    ['On Growth and above, yes.', 'On Boutique Agency and Agency, yes.'],
    ['Cadence scales with tier: a regular weekly cadence at Growth, more at Custom along with topic requests, and per-advisor content with a co-authored option at Agency. The tier walkthrough has the full breakdown.',
     'Cadence scales with tier: one written post a week on Boutique Agency, and two co-authored posts a week per advisor on Agency. The tier walkthrough has the full breakdown.'],
  ],
  'supplier-catalog-is-the-moat': [
    ['The villa collection is added at the Custom tier and above.', 'The villa collection is an add-on at Boutique Agency and included at Agency.'],
  ],
}

/* ── Field overrides ─────────────────────────────────────────────────────── */
const TIERS_BODY = `<p>Elite Advisor Hub has three tiers, and they stack: every tier ships a custom-branded site on the full supplier catalog, and moving up adds modules to that same site rather than rebuilding it. Starter is a complete luxury site for a solo advisor. Boutique Agency adds directories and a weekly curated editorial stream. Agency adds multi-advisor management under one brand.</p><p>The most common worry in choosing a tier is picking wrong and paying to redo everything. On a stacking architecture that worry does not apply. Here is what each tier includes, what it costs, and how to choose.</p><h2>Key Takeaways</h2><ul><li><p>Tiers stack, they do not rebuild. Upgrading adds modules to your existing site; your URL, content, and journal stay where they are.</p></li><li><p>Every tier, including Starter, ships a custom-branded site, the supplier catalog, hotel program pages, a lead inbox, and a journal you can write in.</p></li><li><p>Boutique Agency adds the hotel and cruise directories and a curated editorial post every week.</p></li><li><p>Agency is built for firms with several advisors: one brand, a profile page per advisor, per-advisor lead routing, and one bill.</p></li></ul><h2>What does every tier include?</h2><p>Every tier ships the same foundation: a custom-branded site on your own domain, hotel program pages for Aman, Four Seasons, Belmond, and more, a journal with a clean editor, a contact form with a private lead inbox, client testimonials, an Instagram feed, a curated supplier media gallery, SEO and structured data for search and AI engines, analytics, and one-on-one support.</p><p>The site itself is custom-branded on every tier. Tiers do not differ by who gets a better-looking site. They differ by features. Starter is a complete luxury site, not a reduced one.</p><h2>What does each tier cost and add?</h2><table><thead><tr><th>Tier</th><th>Setup</th><th>Monthly</th><th>What it adds</th></tr></thead><tbody><tr><td>Starter</td><td>$1,499</td><td>$59</td><td>The foundation: custom-branded site, hotel program pages, journal, lead inbox, testimonials, Instagram feed, media gallery, SEO, analytics, support</td></tr><tr><td>Boutique Agency</td><td>$2,500</td><td>$79</td><td>Hotel directory with 1,795+ properties and lead routing, cruise directory, one curated editorial post a week, YouTube and CRM integration, team page, villa catalog add-on</td></tr><tr><td>Agency</td><td>$4,999</td><td>Quoted on number of sites</td><td>Multiple advisors under one brand, affiliate sites managed in one place, advisor directory with profile pages, per-advisor lead routing, two co-authored posts a week per advisor, white-label, villas, bespoke design, unified billing</td></tr></tbody></table><p><strong>Boutique Agency</strong> is the tier most established advisors choose. The directories let clients browse properties and cruise lines on your site and send an inquiry straight to you, and the curated editorial stream solves the problem most advisors hit within a quarter of launch: keeping a journal current. The villa catalog is available as a $29 a month add-on.</p><p><strong>Agency</strong> is a different shape of product. It manages many advisors under one brand, with an advisor directory, a profile page for each advisor, inquiries routed to the advisor the client chose, and one bill across every site. Villas and bespoke design are included.</p><h2>Why does stacking matter?</h2><p>Because it removes the cost and risk that make tier decisions stressful. On most platforms, outgrowing your plan means a migration: a new template, re-entered content, broken links. On Elite Advisor Hub, an upgrade adds modules to the site you already have. Your URL, content, supplier pages, and journal all stay; the new capability appears alongside them.</p><p>The practical result is that you should start at the tier your practice needs today. An advisor on Starter who wants the editorial stream moves to Boutique Agency without losing anything. An advisor who later builds a team moves to Agency without rebuilding the site underneath.</p><h2>How should an advisor choose a tier?</h2><p>Choose by your current bottleneck:</p><ul><li><p><strong>"I need to look credible and I will write my own posts."</strong> Starter. It is a full luxury site.</p></li><li><p><strong>"I want clients to browse hotels on my site, and I want the journal to stay current without writing every week."</strong> Boutique Agency.</p></li><li><p><strong>"I run a team of advisors under one brand."</strong> Agency.</p></li></ul><p>If you are between two tiers, start with the lower one. Upgrading is additive. The template showcase shows the modules assembled on live sites, and you can ${CONSULT} to talk through which tier fits your practice.</p>`

const FIELDS = {
  'how-tiers-stack-modules': {
    title: 'How the Tiers Stack: Starter, Boutique Agency, and Agency',
    excerpt: 'Elite Advisor Hub tiers stack modules and never rebuild your site. What Starter, Boutique Agency, and Agency include, what they cost, and how to choose.',
    seo_title: 'Elite Advisor Hub Tiers: Starter, Boutique Agency, Agency',
    seo_description: 'Elite Advisor Hub tiers stack modules and never rebuild your site. What Starter, Boutique Agency, and Agency include, what they cost, and how to choose.',
    body_html: TIERS_BODY,
    faq: [
      { q: 'Do I have to rebuild my site if I upgrade tiers on Elite Advisor Hub?', a: 'No. Tiers stack: upgrading adds modules to your existing site without moving content or changing your URL. Starting on a lower tier carries no structural penalty.' },
      { q: 'What is the difference between Starter and Boutique Agency?', a: 'Both ship a custom-branded site on the supplier catalog with a journal you can write in. Boutique Agency adds the hotel and cruise directories with lead routing, a curated editorial post every week, YouTube and CRM integration, and a team page.' },
      { q: 'How much does Elite Advisor Hub cost?', a: 'Starter is $1,499 to set up and $59 a month. Boutique Agency is $2,500 to set up and $79 a month. Agency is $4,999 to set up, with the monthly fee quoted on the number of advisor sites.' },
      { q: 'Which tier includes villas?', a: 'The villa catalog is a $29 a month add-on on Boutique Agency and is included on Agency. It is not available on Starter.' },
      { q: 'Can I start on Starter and upgrade later?', a: 'Yes. Because tiers stack rather than rebuild, you keep everything and gain new modules when you upgrade. Start at the tier your practice needs now.' },
    ],
  },
  'ai-search-travel-advisors': {
    seo_title: 'Will ChatGPT Recommend You? How AI Picks Travel Advisors',
    seo_description: 'Clients now ask ChatGPT and Perplexity to recommend and vet travel advisors. How those answers are formed, and the 30-second test to see what AI says about you.',
    append_html: '<p>For the full set of moves that get an advisor cited by name, see <a href="/insights/ai-search-for-travel-advisors">AI Search for Travel Advisors: The 2026 GEO Playbook</a>.</p>',
  },
  'hotel-programs-on-every-site': {
    faq: [
      { q: 'Which hotel programs appear on an Elite Advisor Hub site?', a: 'The catalog includes Four Seasons Preferred Partner, Belmond Bellini Club, Rosewood Elite, Dorchester Collection Diamond Club, Mandarin Oriental Fan Club, Kempinski Club 1897, Marriott STARS and Luminous, Hyatt Privé, Jumeirah Passport to Luxury, and Shangri-La Luxury Circle, among others.' },
      { q: 'Is the Hotel Programs module included on every tier?', a: 'Yes. Hotel program pages ship on every tier, from Starter up.' },
      { q: 'Who keeps the hotel program benefits up to date?', a: 'Elite Advisor Hub maintains the program catalog centrally. When a benefit changes, the update flows to every advisor site, so advisors are never quoting a credit or perk that has ended.' },
      { q: 'Why show hotel programs on a travel advisor website?', a: 'Because the rate a client sees on a booking site usually looks the same. The programs show what booking through an advisor adds, such as upgrades, breakfast, and property credits, which turns a price comparison into a conversation about access.' },
    ],
  },
}

/* ── Run ─────────────────────────────────────────────────────────────────── */
const count = (s, sub) => s.split(sub).length - 1

async function main() {
  const slugs = [...new Set([...Object.keys(BODY), ...Object.keys(FAQ), ...Object.keys(FIELDS)])]
  const { data: posts, error } = await supabase.from('marketing_posts').select('id,slug,body_html,faq').in('slug', slugs)
  if (error) { console.error('❌', error.message); process.exit(1) }

  let ok = 0, skipped = 0
  for (const slug of slugs) {
    const post = posts.find(p => p.slug === slug)
    if (!post) { console.error(`✗ ${slug}: not found`); skipped++; continue }
    const problems = []
    const update = {}

    let body = post.body_html
    for (const [find, repl] of BODY[slug] ?? []) {
      const n = count(body, find)
      if (n !== 1) problems.push(`body match ${n}x: "${find.slice(0, 70)}…"`)
      else body = body.replace(find, repl)
    }

    let faq = post.faq ?? []
    for (const [find, repl] of FAQ[slug] ?? []) {
      const hits = faq.filter(f => f.a.includes(find))
      if (hits.length !== 1) problems.push(`faq match ${hits.length}x: "${find.slice(0, 70)}…"`)
      else faq = faq.map(f => (f.a.includes(find) ? { ...f, a: f.a.replace(find, repl) } : f))
    }

    const f = FIELDS[slug] ?? {}
    if (f.append_html) {
      if (body.includes(f.append_html)) problems.push('append_html already present')
      else body += f.append_html
    }
    if (body !== post.body_html) update.body_html = body
    if (FAQ[slug]) update.faq = faq
    for (const k of ['title', 'excerpt', 'seo_title', 'seo_description', 'body_html', 'faq']) {
      if (f[k] !== undefined) update[k] = f[k]
    }

    if (problems.length) { console.error(`✗ ${slug}\n    ${problems.join('\n    ')}`); skipped++; continue }
    const text = JSON.stringify(update)
    if (/[—–]/.test(text)) { console.error(`✗ ${slug}: contains an em or en dash`); skipped++; continue }
    if (/Founding Advisor|\/beta"|\$(89|179|349|899)\b|Growth (tier|and above)|Custom (tier|level)/.test(text)) { console.error(`✗ ${slug}: stale offer or price remains`); skipped++; continue }

    if (APPLY) {
      const { error: e } = await supabase.from('marketing_posts').update(update).eq('id', post.id)
      if (e) { console.error(`✗ ${slug}: ${e.message}`); skipped++; continue }
    }
    console.log(`${APPLY ? '✓ updated' : '· would update'}  ${slug}  [${Object.keys(update).join(', ')}]`)
    ok++
  }
  console.log(`\n${ok} ${APPLY ? 'updated' : 'ready'}, ${skipped} skipped.${APPLY ? '' : ' Dry run: pass --apply to write.'}`)
  if (skipped) process.exit(1)
}
main()
