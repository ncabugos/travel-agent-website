/**
 * SEO helpers for tenant frontend pages.
 *
 * - canonical(): vanity domain when set, /frontend/[id] path otherwise.
 * - buildMetadata(): produces a Next.js Metadata object with title,
 *   description, openGraph, twitter, robots, canonical, and hreflang.
 *
 * Per-agent SEO facts (awards, affiliations, taglines) live in
 * AGENT_SEO_DATA below — keyed by agent_id. Eden For Your World has the
 * full luxury package; other agents fall back to generic-but-personalized
 * defaults derived from their DB profile.
 */

import type { Metadata } from 'next'
import type { AgentProfile } from '@/lib/suppliers'

const PLATFORM_HOST = 'https://www.eliteadvisorhub.com'

/* ── Per-agent SEO facts ────────────────────────────────────────────────── */

export interface AgentSeoFacts {
  /** Agency-level tagline shown in OG descriptions when no page-specific tagline. */
  brandTagline: string
  /** Marketing description (~160 chars), entity-rich for AI overviews. */
  brandDescriptionLong: string
  /** Awards array used in JSON-LD `award` field. */
  awards: string[]
  /** sameAs[] entries for the Organization schema (social + Virtuoso profile etc). */
  sameAs?: string[]
  /** Default OG image (1200x630). Path is appended to origin. */
  defaultOgImage: string
  /** Default OG image alt text. */
  defaultOgImageAlt: string
  /** Memberships (Virtuoso, host agency etc) for JSON-LD `memberOf`. */
  memberOf?: { name: string; url?: string }[]
  /** Lead advisor for Person schema (entity-rich AI citation). */
  leadAdvisor?: {
    name: string
    jobTitle: string
    awards: string[]
    knowsAbout: string[]
  }
  /** CST / regulatory identifier. */
  identifier?: string
  /**
   * Path to a favicon image (under /public). Applied via Next.js Metadata
   * `icons.icon`, overriding the platform's default app/favicon.ico for
   * this tenant's pages only.
   */
  favicon?: string
}

const EDEN_FACTS: AgentSeoFacts = {
  brandTagline:
    "Curating the world's most extraordinary journeys with precision, passion, and white-glove care.",
  brandDescriptionLong:
    'Bespoke luxury journeys curated by Virtuoso advisors. Condé Nast Top Travel Specialist John Oberacker & team craft white-glove trips to 90+ countries.',
  awards: [
    'Condé Nast Traveler Top Travel Specialist 2024',
    'Condé Nast Traveler Top Travel Specialist 2025',
    'Virtuoso Most Innovative Travel Advisor 2018 (US & Canada)',
  ],
  defaultOgImage: '/assets/eden/overwater-bungalow-hero.jpg',
  defaultOgImageAlt: 'Overwater bungalow at sunset — Eden For Your World',
  sameAs: [
    'https://www.instagram.com/edenforyourworld',
    'https://www.facebook.com/edenforyourworld',
    'https://www.youtube.com/user/edenforyourworld',
  ],
  memberOf: [
    { name: 'Virtuoso' },
    { name: 'Montecito Village Travel' },
  ],
  leadAdvisor: {
    name: 'John Oberacker',
    jobTitle: 'Travel Expert',
    awards: [
      'Condé Nast Traveler Top Travel Specialist 2024',
      'Condé Nast Traveler Top Travel Specialist 2025',
      'Virtuoso Most Innovative Travel Advisor 2018 (US & Canada)',
    ],
    knowsAbout: [
      'Luxury Travel',
      'Virtuoso',
      'Four Seasons Preferred Partner',
      'Belmond Bellini Club',
      'Bespoke Travel',
    ],
  },
  identifier: 'CST # 2097184-40',
  favicon: '/assets/eden/logos/eden-wing-gold-125-reduced.png',
}

const AGENT_SEO_DATA: Record<string, AgentSeoFacts> = {
  '2e18df43-171a-4565-b840-aade259cab69': EDEN_FACTS,
}

/** Look up SEO facts for a tenant; returns sensible defaults if none. */
export function getSeoFacts(agent: AgentProfile): AgentSeoFacts {
  const explicit = AGENT_SEO_DATA[agent.id]
  if (explicit) return explicit
  return {
    brandTagline:
      agent.tagline ??
      `Curated luxury travel by ${agent.full_name ?? agent.agency_name}.`,
    brandDescriptionLong:
      agent.bio ??
      `Bespoke luxury travel by ${agent.full_name ?? agent.agency_name}. Personalized advisor-led trip planning.`,
    awards: [],
    defaultOgImage: agent.avatar_url ?? '/assets/eden/overwater-bungalow-hero.jpg',
    defaultOgImageAlt: agent.agency_name ?? 'Luxury travel',
  }
}

/* ── URL helpers ────────────────────────────────────────────────────────── */

/**
 * Returns the canonical origin for a tenant. Prefer the agent's vanity
 * domain when set; otherwise the platform host.
 */
export function canonicalOrigin(agent: AgentProfile): string {
  if (agent.custom_domain) {
    const d = agent.custom_domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
    return `https://${d}`
  }
  return PLATFORM_HOST
}

/**
 * Tenant base path. On the platform host this is /frontend/[id]; on a
 * vanity domain there is no prefix (the domain points at the tenant root).
 */
export function tenantBasePath(agent: AgentProfile): string {
  return agent.custom_domain ? '' : `/frontend/${agent.id}`
}

/** Full canonical URL for a given path under the tenant. */
export function canonicalUrl(agent: AgentProfile, pathBelowTenant = ''): string {
  const origin = canonicalOrigin(agent)
  const base = tenantBasePath(agent)
  const trailing = pathBelowTenant ? `/${pathBelowTenant.replace(/^\/+/, '')}` : ''
  return `${origin}${base}${trailing}`
}

/* ── Metadata builder ───────────────────────────────────────────────────── */

interface BuildMetadataInput {
  agent: AgentProfile
  /** Page-specific title (without brand suffix). */
  title: string
  description: string
  /** Path below the tenant root (e.g. 'about', 'blog/some-slug'). Empty for home. */
  path?: string
  /** Override image. Otherwise the agent's defaultOgImage is used. */
  image?: string | null
  imageAlt?: string
  /** Override OG title (often longer than the SERP title). */
  ogTitle?: string
  /** Override OG description (Facebook allows up to ~200 chars). */
  ogDescription?: string
  /** Override Twitter description. */
  twitterDescription?: string
  /** 'website' (default) or 'article' for blog posts. */
  ogType?: 'website' | 'article'
  /** Whether the page should be indexed (default true). */
  index?: boolean
}

/**
 * Compose the title with brand suffix. Keeps the suffix consistent across
 * the tenant for SERP brand reinforcement.
 */
export function withBrand(title: string, agent: AgentProfile): string {
  const facts = getSeoFacts(agent)
  // Eden uses "· Virtuoso" as part of the brand suffix per the SEO spec.
  const isVirtuoso = (facts.memberOf ?? []).some((m) => m.name === 'Virtuoso')
  const suffix = isVirtuoso
    ? `${agent.agency_name} · Virtuoso`
    : (agent.agency_name ?? '')
  return suffix ? `${title} | ${suffix}` : title
}

export function buildMetadata({
  agent,
  title,
  description,
  path = '',
  image,
  imageAlt,
  ogTitle,
  ogDescription,
  twitterDescription,
  ogType = 'website',
  index = true,
}: BuildMetadataInput): Metadata {
  const facts = getSeoFacts(agent)
  const url = canonicalUrl(agent, path)
  const origin = canonicalOrigin(agent)
  const ogImagePath = image ?? facts.defaultOgImage
  const ogImage = ogImagePath?.startsWith('http')
    ? ogImagePath
    : `${origin}${ogImagePath}`
  const ogImageAltText = imageAlt ?? facts.defaultOgImageAlt
  const fullTitle = withBrand(title, agent)
  const finalOgTitle = ogTitle ?? fullTitle
  const finalOgDesc = ogDescription ?? description
  const finalTwitterDesc = twitterDescription ?? finalOgDesc

  return {
    // `absolute` bypasses the root layout's "%s · EliteAdvisorHub" template
    // so each tenant page renders only its own brand suffix.
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: {
        'en-US': url,
        'x-default': url,
      },
    },
    openGraph: {
      title: finalOgTitle,
      description: finalOgDesc,
      url,
      siteName: agent.agency_name ?? undefined,
      type: ogType,
      locale: 'en_US',
      images: [
        {
          url: ogImage,
          alt: ogImageAltText,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalOgTitle,
      description: finalTwitterDesc,
      images: [ogImage],
    },
    robots: index
      ? {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        }
      : { index: false, follow: false },
    // Per-tenant favicon. Falls through to the platform's app/favicon.ico
    // when no agent-specific favicon is configured.
    ...(facts.favicon
      ? { icons: { icon: facts.favicon, shortcut: facts.favicon, apple: facts.favicon } }
      : {}),
  }
}
