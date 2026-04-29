/**
 * Tenant URL helper for server components.
 *
 * On the platform host (eliteadvisorhub.com, *.vercel.app, localhost) every
 * internal link needs the `/frontend/[agentId]` prefix so Next can match the
 * route. On a vanity domain (e.g. edenforyourworld.com) middleware rewrites
 * the request to the prefixed path transparently, so internal links should
 * emit clean paths starting at `/`.
 *
 * Pages compute `base` once at the top of the component, then pass it to
 * children that render Links. Client components receive `base` as a prop.
 */

import { headers } from 'next/headers'

const PLATFORM_HOSTS = new Set([
  'localhost',
  'eliteadvisorhub.com',
  'www.eliteadvisorhub.com',
])

function isPlatformHost(host: string): boolean {
  return (
    PLATFORM_HOSTS.has(host) ||
    host.endsWith('.vercel.app') ||
    host.includes('localhost')
  )
}

/**
 * Returns the base path for tenant links given the request host.
 *  - Platform host: `/frontend/{agentId}`
 *  - Vanity domain: '' (empty string)
 *
 * Use as `${base}/about`, `${base}/resources/${slug}`, etc.
 */
export async function tenantBase(agentId: string): Promise<string> {
  const h = await headers()
  const host = h.get('host')?.toLowerCase().replace(/:\d+$/, '') ?? ''
  return isPlatformHost(host) ? `/frontend/${agentId}` : ''
}
