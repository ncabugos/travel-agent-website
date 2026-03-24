/**
 * lib/youtube.ts
 * Server-side utility for fetching videos from the YouTube Data API v3.
 * The API key is kept server-side only (never exposed to the browser).
 */

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string   // maxresdefault or hqdefault
  publishedAt: string // ISO date string
  channelTitle: string
}

/**
 * Resolves a channel handle (@username) to a numeric channel ID.
 * YouTube API requires the channel ID for the search endpoint.
 */
async function resolveChannelId(handle: string, apiKey: string): Promise<string | null> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    return data.items?.[0]?.id ?? null
  } catch {
    return null
  }
}

/**
 * Fetches the latest videos from a YouTube channel.
 *
 * @param channelHandle - YouTube handle without @, e.g. "edenforyourworld"
 * @param maxResults    - Number of videos to fetch (max 50)
 */
export async function getChannelVideos(
  channelHandle: string = 'edenforyourworld',
  maxResults: number = 9,
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    console.warn('[youtube] YOUTUBE_API_KEY is not set — returning empty list')
    return []
  }

  try {
    // Step 1: resolve @handle → channel ID
    const channelId = await resolveChannelId(channelHandle, apiKey)
    if (!channelId) {
      console.warn(`[youtube] Could not resolve channel handle: ${channelHandle}`)
      return []
    }

    // Step 2: search for latest uploads
    const searchUrl = [
      'https://www.googleapis.com/youtube/v3/search',
      `?part=snippet`,
      `&channelId=${channelId}`,
      `&maxResults=${maxResults}`,
      `&order=date`,
      `&type=video`,
      `&key=${apiKey}`,
    ].join('')

    const res = await fetch(searchUrl, { next: { revalidate: 3600 } }) // cache 1 hour
    if (!res.ok) {
      console.error('[youtube] Search API error:', res.status, await res.text())
      return []
    }

    const data = await res.json()
    const items = data.items ?? []

    return items.map((item: any): YouTubeVideo => {
      const snip = item.snippet
      // Prefer maxresdefault, fall back to hqdefault
      const thumb =
        snip.thumbnails?.maxres?.url ??
        snip.thumbnails?.high?.url ??
        snip.thumbnails?.medium?.url ??
        `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`

      return {
        id: item.id.videoId,
        title: snip.title,
        description: snip.description,
        thumbnail: thumb,
        publishedAt: snip.publishedAt,
        channelTitle: snip.channelTitle,
      }
    })
  } catch (err) {
    console.error('[youtube] Unexpected error:', err)
    return []
  }
}
