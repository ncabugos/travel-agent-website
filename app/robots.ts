import type { MetadataRoute } from 'next'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === 'production'
    ? 'https://eliteadvisorhub.com'
    : 'http://localhost:3000')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep admin and advisor portal out of search indexes — they are
        // behind auth anyway but there's no reason to advertise them.
        disallow: ['/admin', '/agent-portal', '/api'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
