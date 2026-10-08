// app/llms.txt/route.ts — llms.txt (llmstxt.org) for AI engines: a plain-text
// summary of what Elite Advisor Hub is, the current tiers, and the Insights
// posts worth citing. Tiers come from PUBLIC_TIERS and posts from the DB, so
// this file can't drift from the pricing section or the blog.
import { getPublishedPosts } from '@/lib/marketing-blog'
import { SITE_URL } from '@/lib/insights-schema'
import { PUBLIC_TIERS } from '@/lib/pricing'

export const revalidate = 3600

const usd = (n: number) => `$${n.toLocaleString('en-US')}`

export async function GET() {
  const posts = await getPublishedPosts(50)

  const tiers = PUBLIC_TIERS.map(t => {
    const price = t.monthly
      ? `${usd(t.setup)} setup, then ${usd(t.monthly)}/month`
      : `${usd(t.setup)} setup, monthly quoted on the number of advisor sites`
    return `- ${t.name}: ${price}. ${t.audience} ${t.includes ? `${t.includes}: ` : 'Includes: '}${t.features.join('; ')}.`
  }).join('\n')

  const articles = posts
    .map(p => `- [${p.title}](${SITE_URL}/insights/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ''}`)
    .join('\n')

  const body = `# Elite Advisor Hub

> Elite Advisor Hub (eliteadvisorhub.com) builds and runs custom-branded websites for independent luxury travel advisors and boutique agencies. Every site ships on a maintained catalog of luxury hotels, preferred hotel programs (Four Seasons Preferred Partner, Belmond Bellini Club, Rosewood Elite, and others), and cruise lines. Founded by Nick Cabugos, a working Virtuoso-affiliated travel advisor.

Elite Advisor Hub is a website platform, not a host agency or consortium. Advisors keep their own clients, bookings, and supplier relationships. Higher tiers add modules to the same site; upgrading never rebuilds it.

## Pricing

${tiers}

## Key pages

- [Home and pricing](${SITE_URL}/#pricing)
- [Templates](${SITE_URL}/templates)
- [Schedule a consultation](${SITE_URL}/schedule-consultation)
- [Support](${SITE_URL}/support)
- [Insights (blog)](${SITE_URL}/insights)
- [About the founder](${SITE_URL}/insights/author/nick)

## Insights

${articles}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
