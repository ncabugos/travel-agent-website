/**
 * lib/blog.ts
 * Blog data layer — queries Supabase blog_posts table.
 * Supports per-agent posts, broadcast posts, shortcode rendering, and gallery images.
 */
import type { BlogPost } from '@/types/index'
import { createServiceClient } from '@/lib/supabase/service'
import type { AgentProfile } from '@/lib/suppliers'
import { isDemoSlug } from '@/lib/demo-agents'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)

const isDemo = (id: string) => isDemoSlug(id)

// ─── Shortcode renderer ───────────────────────────────────────────────────────

/** Falls back when {{advisor_first_name}} is used but the advisor has no value set. */
export const ADVISOR_FIRST_NAME_FALLBACK = 'your advisor'

/**
 * Site-wide route tokens. Centralised here so a route rename only requires
 * updating these strings — every published article picks up the new path
 * on next render without a content migration. (Personalization roadmap, Tier 1.2.)
 */
export const ROUTE_TOKENS: Record<string, string> = {
  '{{plan_a_trip_url}}': '/plan-a-trip',
  '{{contact_url}}':     '/contact',
}

/**
 * Replaces {{token}} placeholders in HTML with real agent data.
 * Safe — only replaces known tokens, never evaluates anything.
 */
export function renderShortcodes(html: string, agent: AgentProfile): string {
  const firstName = (agent.first_name ?? '').trim()

  if (!firstName && html.includes('{{advisor_first_name}}')) {
    console.warn(
      `[renderShortcodes] post uses {{advisor_first_name}} but agent ${agent.id} has no first_name set; falling back to "${ADVISOR_FIRST_NAME_FALLBACK}"`,
    )
  }

  const tokens: Record<string, string> = {
    '{{agency_name}}':        agent.agency_name  ?? '',
    '{{agent_name}}':         agent.full_name    ?? '',
    '{{agent_phone}}':        agent.phone        ?? '',
    '{{agent_email}}':        agent.email        ?? '',
    '{{advisor_first_name}}': firstName || ADVISOR_FIRST_NAME_FALLBACK,
    ...ROUTE_TOKENS,
  }

  let out = Object.entries(tokens).reduce(
    (acc, [token, value]) => acc.replaceAll(token, value),
    html,
  )

  // Strip ALL WPBakery / Visual Composer shortcode tags (vc_row, vc_empty_space,
  // vc_video, vc_gallery, vc_single_image, etc.) but keep inner content intact.
  out = out.replace(/\[\/?\s*vc_\w+[^\]]*\]/g, '')

  // Strip WordPress [gallery] shortcodes
  out = out.replace(/\[\/?\s*gallery[^\]]*\]/g, '')

  return out
}

// ─── Data functions ───────────────────────────────────────────────────────────

const ALL_COLUMNS =
  'id, agent_id, title, slug, published_at, excerpt, body_html, cover_image_url, categories, tags, status, is_broadcast, target_agent_ids, target_demo_slugs, gallery_images, supplier_tags'

// Single-post fetches use '*' so the new seo_title / seo_description columns
// flow through automatically once migration 030 lands. Pre-migration the
// columns are simply absent from the row; PostgREST does not error.
const ALL_COLUMNS_WITH_SEO = '*'

const COLUMNS_WITH_JOIN = `${ALL_COLUMNS}, blog_post_categories(category_id)`

// Single-post variant — uses '*' so seo_title / seo_description come along
// once migration 030 is applied. Used by getBlogPost (detail page) and
// getAdminPost (editor load). Pre-migration the columns are absent and
// PostgREST returns the legacy column set without error.
const COLUMNS_WITH_JOIN_AND_SEO = `${ALL_COLUMNS_WITH_SEO}, blog_post_categories(category_id)`

/**
 * Returns all published posts visible to an agent:
 *  - Posts owned by the agent, OR
 *  - Broadcast posts (target_agent_ids is empty = all, or contains this agent's id)
 */
export async function getBlogPosts(agentId?: string): Promise<BlogPost[]> {
  if (!hasSupabase()) return []
  const supabase = createServiceClient()

  if (!agentId) {
    // Admin: return all posts regardless of agent
    const { data, error } = await supabase
      .from('blog_posts')
      .select(COLUMNS_WITH_JOIN)
      .order('published_at', { ascending: false })
    if (error) { console.error('[getBlogPosts]', error.message); return [] }
    return (data ?? []).map(formatPostData) as BlogPost[]
  }

  // Demo sites: show broadcast-to-all posts, plus demo-targeted posts where
  // the demo slug is listed in target_demo_slugs. Demos have no row in
  // agent_blog_preferences, so the preference filter is bypassed.
  if (isDemo(agentId)) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(COLUMNS_WITH_JOIN)
      .eq('status', 'published')
      .eq('is_broadcast', true)
      .or(
        `and(target_agent_ids.eq.{},target_demo_slugs.eq.{}),` +
        `target_demo_slugs.cs.{${agentId}}`
      )
      .order('published_at', { ascending: false })
    if (error) { console.error('[getBlogPosts:demo]', error.message); return [] }
    return (data ?? []).map(formatPostData) as BlogPost[]
  }

  // Frontend: agent's own posts + applicable broadcast posts
  // Only broadcast posts that overlap with agent preferences are shown if they use structured categories
  const { data: prefData } = await supabase
    .from('agent_blog_preferences')
    .select('category_id')
    .eq('agent_id', agentId)
    .eq('is_enabled', true)

  const enabledCategoryIds = prefData?.map(p => p.category_id) || []

  const { data, error } = await supabase
    .from('blog_posts')
    .select(COLUMNS_WITH_JOIN)
    .eq('status', 'published')
    .or(
      `agent_id.eq.${agentId},` +
      `and(is_broadcast.eq.true,or(and(target_agent_ids.eq.{},target_demo_slugs.eq.{}),target_agent_ids.cs.{${agentId}}))`
    )
    .order('published_at', { ascending: false })

  if (error) {
    console.error('[getBlogPosts]', error.message)
    return []
  }

  const posts = (data ?? []).map(formatPostData) as BlogPost[]

  // Filter broadcast posts by whether they exist in opted-in categories,
  // EXCEPT if they are owned directly by the agent, or have NO structured categories attached.
  return posts.filter(post => {
    if (post.agent_id === agentId) return true // always show own posts
    if (!post.category_ids?.length) return true // backwards comp/uncategorized show anyway

    // For broadcast posts with categories, check intersection
    return post.category_ids.some(id => enabledCategoryIds.includes(id))
  })
}

// Helper to flatten nested category_id arrays from PostgREST join
function formatPostData(row: any): BlogPost {
  const category_ids = row.blog_post_categories?.map((c: any) => c.category_id) || []
  const { blog_post_categories, ...rest } = row
  return {
    ...rest,
    category_ids,
    supplier_tags: rest.supplier_tags ?? [],
    target_demo_slugs: rest.target_demo_slugs ?? [],
  } as BlogPost
}

export async function getBlogPost(
  slug: string,
  agentId?: string,
): Promise<BlogPost | null> {
  if (!hasSupabase()) return null
  const supabase = createServiceClient()

  let query = supabase
    .from('blog_posts')
    .select(COLUMNS_WITH_JOIN_AND_SEO)
    .eq('slug', slug)
    .eq('status', 'published')

  if (agentId && isDemo(agentId)) {
    query = query
      .eq('is_broadcast', true)
      .or(
        `and(target_agent_ids.eq.{},target_demo_slugs.eq.{}),` +
        `target_demo_slugs.cs.{${agentId}}`
      )
  } else if (agentId) {
    query = query.or(
      `agent_id.eq.${agentId},` +
      `and(is_broadcast.eq.true,or(and(target_agent_ids.eq.{},target_demo_slugs.eq.{}),target_agent_ids.cs.{${agentId}}))`
    )
  }

  const { data, error } = await query.limit(1).single()
  if (error || !data) return null
  return formatPostData(data)
}

// ─── Admin data functions ─────────────────────────────────────────────────────

export async function getAdminPosts(): Promise<BlogPost[]> {
  if (!hasSupabase()) return []
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select(COLUMNS_WITH_JOIN)
    .order('published_at', { ascending: false })
  if (error) { console.error('[getAdminPosts]', error.message); return [] }
  return (data ?? []).map(formatPostData)
}

export async function getAdminPost(id: string): Promise<BlogPost | null> {
  if (!hasSupabase()) return null
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select(COLUMNS_WITH_JOIN_AND_SEO)
    .eq('id', id)
    .single()
  if (error || !data) return null
  return formatPostData(data)
}

// ─── Supplier tag queries ─────────────────────────────────────────────────────

/**
 * Returns all published posts tagged with a given supplier.
 * @param supplierTag  Full prefixed tag, e.g. 'hotel:four-seasons-preferred-partner'
 * @param agentId      Optional — if provided, scopes to posts visible to that agent.
 */
export async function getBlogPostsBySupplier(
  supplierTag: string,
  agentId?: string,
): Promise<BlogPost[]> {
  if (!hasSupabase()) return []
  const supabase = createServiceClient()

  let query = supabase
    .from('blog_posts')
    .select(COLUMNS_WITH_JOIN)
    .eq('status', 'published')
    .contains('supplier_tags', [supplierTag])
    .order('published_at', { ascending: false })

  if (agentId && isDemo(agentId)) {
    query = query
      .eq('is_broadcast', true)
      .or(
        `and(target_agent_ids.eq.{},target_demo_slugs.eq.{}),` +
        `target_demo_slugs.cs.{${agentId}}`
      )
  } else if (agentId) {
    query = query.or(
      `agent_id.eq.${agentId},` +
      `and(is_broadcast.eq.true,or(and(target_agent_ids.eq.{},target_demo_slugs.eq.{}),target_agent_ids.cs.{${agentId}}))`
    )
  }

  const { data, error } = await query
  if (error) { console.error('[getBlogPostsBySupplier]', error.message); return [] }
  return (data ?? []).map(formatPostData)
}
