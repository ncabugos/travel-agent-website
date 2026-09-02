import { createServiceClient } from '@/lib/supabase/service'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JourneyIntro {
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
}

export interface JourneyDestination {
  name: string
  blurb?: string | null
  image_url?: string | null
}

export interface JourneyExperience {
  title: string
  description: string
  /** Optional T2BenefitsGrid icon key; keyword matching on the title otherwise. */
  icon?: string
}

/**
 * One published itinerary. `price_from_usd` is per person unless `price_note`
 * says otherwise — operators quote per person, double occupancy by convention.
 * Null price means the operator does not publish one; the UI shows "on request"
 * rather than inventing a figure.
 */
export interface JourneyItinerary {
  name: string
  days?: number | null
  regions?: string | null
  blurb?: string | null
  price_from_usd?: number | null
  image_url?: string | null
  /** Published departure window, e.g. "March 1 to 20, 2028". Null when unannounced. */
  dates?: string | null
  /** Ordered destination names as the operator lists them on the routing. */
  stops?: string[] | null
  /** Operator brochure (PDF) served from /public, when one is on file. */
  brochure_url?: string | null
}

export interface JourneyBenefit {
  title: string
  description: string
  icon?: string
}

export type JourneyType = 'jet' | 'safari' | 'tour'

export interface PrivateJourney {
  id: string
  slug: string
  name: string
  journey_type: JourneyType
  logo_url: string | null
  logo_url_white: string | null
  logo_url_black: string | null
  hero_image_url: string | null
  slider_images: string[]
  tagline: string | null
  description: string | null
  intro: JourneyIntro | null
  destinations: JourneyDestination[]
  experiences: JourneyExperience[]
  sample_journeys: JourneyItinerary[]
  benefits: JourneyBenefit[]
  price_from_usd: number | null
  price_note: string | null
  sort_order: number
  is_active: boolean
}

// ─── Formatting ───────────────────────────────────────────────────────────────

/**
 * Renders a "from" price for display. Deliberately returns null rather than a
 * placeholder when the operator publishes no figure — Four Seasons Private Jet
 * and A&K quote on request, and inventing a number would turn marketing copy
 * into a price promise.
 */
export function formatFromPrice(usd: number | null | undefined): string | null {
  if (!usd || usd <= 0) return null
  return `From $${usd.toLocaleString('en-US')}`
}

// ─── Data access ──────────────────────────────────────────────────────────────

const hasSupabaseEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

/* eslint-disable @typescript-eslint/no-explicit-any */
function hydrate(row: any): PrivateJourney {
  return {
    ...row,
    slider_images: row.slider_images ?? [],
    destinations: row.destinations ?? [],
    experiences: row.experiences ?? [],
    sample_journeys: row.sample_journeys ?? [],
    benefits: row.benefits ?? [],
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * All active journeys, optionally narrowed to one type. Returns [] rather than
 * mock data when Supabase is absent: unlike hotel programmes there is no
 * offline fixture set, and an empty list renders an honest empty state instead
 * of fictional operators.
 */
export async function getPrivateJourneys(type?: JourneyType): Promise<PrivateJourney[]> {
  if (!hasSupabaseEnv()) return []

  try {
    const supabase = createServiceClient()
    let query = supabase
      .from('private_journeys')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (type) query = query.eq('journey_type', type)

    const { data, error } = await query
    if (error || !data) return []
    return data.map(hydrate)
  } catch {
    return []
  }
}

/** A single journey by slug. Null when missing or inactive — callers notFound(). */
export async function getPrivateJourney(slug: string): Promise<PrivateJourney | null> {
  if (!hasSupabaseEnv()) return null

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('private_journeys')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) return null
    return hydrate(data)
  } catch {
    return null
  }
}

/** Slugs for generateStaticParams, optionally narrowed to one type. */
export async function getPrivateJourneySlugs(type?: JourneyType): Promise<string[]> {
  const rows = await getPrivateJourneys(type)
  return rows.map((r) => r.slug)
}
