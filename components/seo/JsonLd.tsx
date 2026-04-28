/**
 * JSON-LD <script> renderer + per-schema builders.
 *
 * Builders return plain objects. <JsonLd> serializes them and emits the
 * <script type="application/ld+json"> tag. Use whichever builder matches
 * the page; multiple builders can be composed via @graph.
 */

import type { AgentProfile } from '@/lib/suppliers'
import { canonicalUrl, getSeoFacts } from '@/lib/seo'

export function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? { '@context': 'https://schema.org', '@graph': data } : data
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is the standard way to emit JSON-LD in Next/React.
      // The content is structured data we control (no user input), so it's safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

/* ── Builders ───────────────────────────────────────────────────────────── */

/**
 * Combined TravelAgency + LocalBusiness schema for the home page.
 * Uses agent profile fields for address/contact and the per-agent SEO
 * facts for awards/affiliations/sameAs.
 */
export function travelAgencySchema(agent: AgentProfile) {
  const facts = getSeoFacts(agent)
  const url = canonicalUrl(agent)
  // Address fields aren't on AgentProfile yet; hardcode Eden's, leave others
  // off until we model an address column.
  const isEden = agent.id === '2e18df43-171a-4565-b840-aade259cab69'
  const address = isEden
    ? {
        '@type': 'PostalAddress',
        streetAddress: '5318 E. 2nd St. #520',
        addressLocality: 'Long Beach',
        addressRegion: 'CA',
        postalCode: '90803',
        addressCountry: 'US',
      }
    : undefined

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const node: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'LocalBusiness'],
    name: agent.agency_name,
    description: facts.brandDescriptionLong,
    url,
    telephone: agent.phone ?? undefined,
    email: agent.email ?? undefined,
    priceRange: '$$$$',
    areaServed: 'Worldwide',
  }
  if (address) node.address = address
  if (agent.agency_name) node.alternateName = isEden ? 'Eden FYW' : undefined
  if (facts.memberOf?.length) {
    node.memberOf = facts.memberOf.map((m) => ({
      '@type': 'Organization',
      name: m.name,
      ...(m.url ? { url: m.url } : {}),
    }))
  }
  if (facts.awards?.length) node.award = facts.awards
  if (facts.sameAs?.length) node.sameAs = facts.sameAs
  if (facts.identifier) node.identifier = facts.identifier
  return node
}

/** Person schema for the lead advisor (entity-rich AI citation). */
export function leadAdvisorSchema(agent: AgentProfile) {
  const facts = getSeoFacts(agent)
  if (!facts.leadAdvisor) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: facts.leadAdvisor.name,
    jobTitle: facts.leadAdvisor.jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: agent.agency_name,
      url: canonicalUrl(agent),
    },
    award: facts.leadAdvisor.awards,
    knowsAbout: facts.leadAdvisor.knowsAbout,
  }
}

/** BreadcrumbList for any interior page. items is an ordered list of { name, path }. */
export function breadcrumbSchema(
  agent: AgentProfile,
  items: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: canonicalUrl(agent, it.path),
    })),
  }
}

/** Blog index schema. */
export function blogSchema(agent: AgentProfile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${agent.agency_name} Journal`,
    url: canonicalUrl(agent, 'blog'),
    publisher: {
      '@type': 'Organization',
      name: agent.agency_name,
      url: canonicalUrl(agent),
    },
  }
}

/** Article schema for a single blog post. */
export function articleSchema(
  agent: AgentProfile,
  post: {
    title: string
    slug: string
    excerpt?: string | null
    cover_image_url?: string | null
    created_at?: string | null
    updated_at?: string | null
    author_name?: string | null
  }
) {
  const facts = getSeoFacts(agent)
  const origin = canonicalUrl(agent).replace(canonicalUrl(agent, ''), '').split('/frontend')[0]
  const image = post.cover_image_url
    ? post.cover_image_url.startsWith('http')
      ? post.cover_image_url
      : `${origin}${post.cover_image_url}`
    : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image,
    datePublished: post.created_at ?? undefined,
    dateModified: post.updated_at ?? post.created_at ?? undefined,
    author: {
      '@type': 'Person',
      name: post.author_name ?? facts.leadAdvisor?.name ?? agent.full_name ?? agent.agency_name,
    },
    publisher: {
      '@type': 'Organization',
      name: agent.agency_name,
      url: canonicalUrl(agent),
    },
    mainEntityOfPage: canonicalUrl(agent, `blog/${post.slug}`),
  }
}

/** Service schema for an individual hotel program page. */
export function programServiceSchema(
  agent: AgentProfile,
  program: { name: string; description?: string | null; slug: string }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${program.name} — Booking with ${agent.agency_name}`,
    description: program.description ?? undefined,
    provider: {
      '@type': 'TravelAgency',
      name: agent.agency_name,
      url: canonicalUrl(agent),
    },
    areaServed: 'Worldwide',
    serviceType: 'Luxury Hotel Booking',
    url: canonicalUrl(agent, `resources/${program.slug}`),
  }
}

/** ContactPage schema for /contact. */
export function contactPageSchema(agent: AgentProfile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${agent.agency_name}`,
    url: canonicalUrl(agent, 'contact'),
    mainEntity: {
      '@type': 'TravelAgency',
      name: agent.agency_name,
      telephone: agent.phone ?? undefined,
      email: agent.email ?? undefined,
      url: canonicalUrl(agent),
    },
  }
}
