/**
 * lib/blog.ts
 * Blog data layer — queries Supabase blog_posts table.
 * Supports per-agent posts, broadcast posts, shortcode rendering, and gallery images.
 */
import type { BlogPost } from '@/types/index'
import { createServiceClient } from '@/lib/supabase/service'
import type { AgentProfile } from '@/lib/suppliers'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)

// ─── Shortcode renderer ───────────────────────────────────────────────────────

/**
 * Replaces {{token}} placeholders in HTML with real agent data.
 * Safe — only replaces known tokens, never evaluates anything.
 */
export function renderShortcodes(html: string, agent: AgentProfile): string {
  const tokens: Record<string, string> = {
    '{{agency_name}}':  agent.agency_name  ?? '',
    '{{agent_name}}':   agent.full_name    ?? '',
    '{{agent_phone}}':  agent.phone        ?? '',
    '{{agent_email}}':  agent.email        ?? '',
  }
  return Object.entries(tokens).reduce(
    (out, [token, value]) => out.replaceAll(token, value),
    html,
  )
}

// ─── Data functions ───────────────────────────────────────────────────────────

const ALL_COLUMNS =
  'id, agent_id, title, slug, published_at, excerpt, body_html, cover_image_url, categories, tags, status, is_broadcast, target_agent_ids, gallery_images'

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
      .select(ALL_COLUMNS)
      .order('published_at', { ascending: false })
    if (error) { console.error('[getBlogPosts]', error.message); return [] }
    return (data ?? []) as BlogPost[]
  }

  // Frontend: agent's own posts + applicable broadcast posts
  const { data, error } = await supabase
    .from('blog_posts')
    .select(ALL_COLUMNS)
    .eq('status', 'published')
    .or(
      `agent_id.eq.${agentId},` +
      `and(is_broadcast.eq.true,or(target_agent_ids.eq.{},target_agent_ids.cs.{${agentId}}))`
    )
    .order('published_at', { ascending: false })

  if (error) {
    console.error('[getBlogPosts]', error.message)
    return []
  }

  return (data ?? []) as BlogPost[]
}

export async function getBlogPost(
  slug: string,
  agentId?: string,
): Promise<BlogPost | null> {
  if (!hasSupabase()) return null
  const supabase = createServiceClient()

  let query = supabase
    .from('blog_posts')
    .select(ALL_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'published')

  if (agentId) {
    query = query.or(
      `agent_id.eq.${agentId},` +
      `and(is_broadcast.eq.true,or(target_agent_ids.eq.{},target_agent_ids.cs.{${agentId}}))`
    )
  }

  const { data, error } = await query.limit(1).single()
  if (error || !data) return null
  return data as BlogPost
}

// ─── Admin data functions ─────────────────────────────────────────────────────

export async function getAdminPosts(): Promise<BlogPost[]> {
  if (!hasSupabase()) return []
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select(ALL_COLUMNS)
    .order('published_at', { ascending: false })
  if (error) { console.error('[getAdminPosts]', error.message); return [] }
  return (data ?? []) as BlogPost[]
}

export async function getAdminPost(id: string): Promise<BlogPost | null> {
  if (!hasSupabase()) return null
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select(ALL_COLUMNS)
    .eq('id', id)
    .single()
  if (error || !data) return null
  return data as BlogPost
}
