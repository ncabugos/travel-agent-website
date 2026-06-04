// app/insights/rss.xml/route.ts — RSS 2.0 feed for the Insights blog (strategy §5.3).
import { getPublishedPosts } from '@/lib/marketing-blog'
import { SITE_URL } from '@/lib/insights-schema'

export const revalidate = 3600

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function GET() {
  const posts = await getPublishedPosts(50)
  const now = new Date().toUTCString()

  const items = posts.map(p => {
    const url = `${SITE_URL}/insights/${p.slug}`
    const desc = p.excerpt ?? ''
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      ${p.category?.label ? `<category>${esc(p.category.label)}</category>` : ''}
      <description>${esc(desc)}</description>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Elite Advisor Hub — Insights</title>
    <link>${SITE_URL}/insights</link>
    <atom:link href="${SITE_URL}/insights/rss.xml" rel="self" type="application/rss+xml" />
    <description>On luxury-travel advising, advisor websites, and building a practice that earns the top 1%.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
