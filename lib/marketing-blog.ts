/**
 * lib/marketing-blog.ts
 * Data layer for the company "Insights" blog at eliteadvisorhub.com/insights.
 *
 * COMPLETELY SEPARATE from lib/blog.ts (the advisor blog). These reads never
 * touch blog_posts and the advisor reads never touch marketing_posts, so EAH
 * marketing content can never leak onto an advisor tenant site.
 */
import type { MarketingPost, MarketingCategory } from '@/types/index'
import { createServiceClient } from '@/lib/supabase/service'

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)

// PostgREST embed: pull the related category in one round-trip.
const SELECT = '*, category:marketing_categories(*)'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shape(row: any): MarketingPost {
  return {
    ...row,
    faq: Array.isArray(row.faq) ? row.faq : [],
    category: row.category ?? null,
  } as MarketingPost
}

// ─── Public reads (published only) ──────────────────────────────────────────

export async function getPublishedPosts(limit?: number): Promise<MarketingPost[]> {
  if (!hasSupabase()) return []
  const supabase = createServiceClient()
  let query = supabase
    .from('marketing_posts')
    .select(SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) { console.error('[getPublishedPosts]', error.message); return [] }
  return (data ?? []).map(shape)
}

export async function getFeaturedPost(): Promise<MarketingPost | null> {
  if (!hasSupabase()) return null
  const supabase = createServiceClient()
  // Prefer an explicitly-featured post; fall back to the most recent.
  const { data } = await supabase
    .from('marketing_posts')
    .select(SELECT)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data ? shape(data) : null
}

export async function getPostBySlug(slug: string): Promise<MarketingPost | null> {
  if (!hasSupabase()) return null
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('marketing_posts')
    .select(SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error || !data) return null
  return shape(data)
}

export async function getPostsByCategory(categorySlug: string): Promise<MarketingPost[]> {
  if (!hasSupabase()) return []
  const supabase = createServiceClient()
  const cat = await getCategoryBySlug(categorySlug)
  if (!cat) return []
  const { data, error } = await supabase
    .from('marketing_posts')
    .select(SELECT)
    .eq('status', 'published')
    .eq('category_id', cat.id)
    .order('published_at', { ascending: false })
  if (error) { console.error('[getPostsByCategory]', error.message); return [] }
  return (data ?? []).map(shape)
}

// ─── Categories ─────────────────────────────────────────────────────────────

export async function getCategories(activeOnly = true): Promise<MarketingCategory[]> {
  if (!hasSupabase()) return []
  const supabase = createServiceClient()
  let query = supabase.from('marketing_categories').select('*').order('sort_order')
  if (activeOnly) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error || !data) return []
  return data as MarketingCategory[]
}

export async function getCategoryBySlug(slug: string): Promise<MarketingCategory | null> {
  if (!hasSupabase()) return null
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('marketing_categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  return (data as MarketingCategory) ?? null
}

// ─── Admin reads (all statuses) ─────────────────────────────────────────────

export async function getAdminPosts(): Promise<MarketingPost[]> {
  if (!hasSupabase()) return []
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('marketing_posts')
    .select(SELECT)
    .order('published_at', { ascending: false })
  if (error) { console.error('[getAdminPosts:marketing]', error.message); return [] }
  return (data ?? []).map(shape)
}

export async function getAdminPost(id: string): Promise<MarketingPost | null> {
  if (!hasSupabase()) return null
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('marketing_posts')
    .select(SELECT)
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return null
  return shape(data)
}

// ─── Render helpers ─────────────────────────────────────────────────────────

/** Auto-paragraph plain text bodies (mirrors WP wpautop). No-op if already HTML. */
export function autop(html: string): string {
  if (!html) return ''
  if (/<p[\s>]/i.test(html)) return html
  return html
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => `<p>${block.replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}

/** Estimate reading time from body HTML at ~225 wpm. Used when read_minutes is unset. */
export function estimateReadMinutes(bodyHtml: string): number {
  const text = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text ? text.split(' ').length : 0
  return Math.max(1, Math.round(words / 225))
}
