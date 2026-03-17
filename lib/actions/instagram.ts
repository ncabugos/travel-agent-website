'use server'

import { MOCK_IG_POSTS, type IgPost } from '@/lib/mock-data'

const IG_API_BASE = 'https://graph.instagram.com'

/**
 * Fetches the latest 9 Instagram posts for an agent via the Basic Display API.
 *
 * Token lookup strategy:
 *   1. Check env var IG_TOKEN_<AGENTID_UPPERCASE> (per-agent override)
 *   2. Fall back to mock data when no token is available (dev / demo)
 *
 * The token must be a valid long-lived Instagram Basic Display API access token.
 * Tokens expire after 60 days and must be refreshed via the token refresh endpoint.
 */
export async function fetchIgFeed(agentId: string): Promise<IgPost[]> {
  // Resolve token from env — e.g. IG_TOKEN_DEMO_AGENT or IG_TOKEN_SOPHIELAURENT
  const envKey = `IG_TOKEN_${agentId.replace(/-/g, '_').toUpperCase()}`
  const token = process.env[envKey] ?? process.env.IG_TOKEN_DEFAULT

  if (!token) {
    // No token configured — return seed data so the UI renders in development
    return MOCK_IG_POSTS
  }

  try {
    const url = new URL(`${IG_API_BASE}/me/media`)
    url.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp')
    url.searchParams.set('limit', '9')
    url.searchParams.set('access_token', token)

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!res.ok) {
      console.error(`[fetchIgFeed] Instagram API error ${res.status} for agent ${agentId}`)
      return MOCK_IG_POSTS
    }

    const data: { data: IgPost[] } = await res.json()
    return data.data?.slice(0, 9) ?? MOCK_IG_POSTS
  } catch (err) {
    console.error('[fetchIgFeed] Fetch failed:', err)
    return MOCK_IG_POSTS
  }
}

/**
 * Refreshes a long-lived Instagram access token (call before 60-day expiry).
 * Returns the new token string, or null on failure.
 */
export async function refreshIgToken(token: string): Promise<string | null> {
  try {
    const url = new URL(`${IG_API_BASE}/refresh_access_token`)
    url.searchParams.set('grant_type', 'ig_refresh_token')
    url.searchParams.set('access_token', token)

    const res = await fetch(url.toString())
    if (!res.ok) return null

    const data: { access_token: string } = await res.json()
    return data.access_token ?? null
  } catch {
    return null
  }
}
