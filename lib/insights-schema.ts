/**
 * lib/insights-schema.ts
 * JSON-LD builders for the Insights blog. Returns @graph node arrays for the
 * shared <JsonLd> renderer (components/seo/JsonLd.tsx), which adds @context.
 *
 * Implements the strategy's AEO requirement (§5.2): Article + Person +
 * Organization sitewide, FAQPage per post, BreadcrumbList on interior pages.
 */
import type { MarketingPost } from '@/types/index'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === 'production' ? 'https://eliteadvisorhub.com' : 'http://localhost:3000')

const ORG_ID = `${SITE_URL}/#organization`

function absolute(url?: string | null): string | undefined {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${SITE_URL}${url}`
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function organizationNode(): Record<string, any> {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Elite Advisor Hub',
    url: SITE_URL,
    logo: `${SITE_URL}/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-black.png`,
    description:
      'The premium website platform for the top 1% of luxury travel advisors.',
  }
}

function personNode(post: MarketingPost): Record<string, any> {
  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/insights/author/nick#person`,
    name: post.author_name,
    description: post.author_credentials,
    url: `${SITE_URL}/insights/author/nick`,
    worksFor: { '@id': ORG_ID },
  }
}

/** Full @graph for a single Insights article. */
export function articleGraph(post: MarketingPost): Record<string, any>[] {
  const url = `${SITE_URL}/insights/${post.slug}`
  const nodes: Record<string, any>[] = [
    organizationNode(),
    personNode(post),
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.seo_title?.trim() || post.title,
      description: post.seo_description?.trim() || post.excerpt || undefined,
      image: absolute(post.og_image_url || post.cover_image_url),
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      author: { '@id': `${SITE_URL}/insights/author/nick#person` },
      publisher: { '@id': ORG_ID },
      mainEntityOfPage: url,
      url,
      ...(post.category?.label ? { articleSection: post.category.label } : {}),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE_URL}/insights` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ]
  if (post.faq.length) {
    nodes.push({
      '@type': 'FAQPage',
      mainEntity: post.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  return nodes
}

/** @graph for the Insights index. */
export function blogGraph(): Record<string, any>[] {
  return [
    organizationNode(),
    {
      '@type': 'Blog',
      '@id': `${SITE_URL}/insights#blog`,
      name: 'Elite Advisor Hub — Insights',
      description:
        'On luxury-travel advising, advisor websites, SEO/AEO, and building a practice that earns the top 1%.',
      url: `${SITE_URL}/insights`,
      publisher: { '@id': ORG_ID },
    },
  ]
}
