/**
 * Tenant URL helper.
 *
 * On the platform host (eliteadvisorhub.com, *.vercel.app, localhost) every
 * internal link needs the `/frontend/[agentId]` prefix. On a vanity domain
 * middleware rewrites the request transparently, so internal links should
 * emit clean paths starting at `/`.
 *
 * We can't read the request host inside SSG'd pages (would throw
 * DYNAMIC_SERVER_USAGE), so we derive the base from `agent.custom_domain`
 * instead. The assumption: when an agent has a custom_domain configured,
 * that's the canonical URL — and middleware redirects platform paths to
 * the vanity domain anyway, so we always emit clean links for those tenants.
 */

import type { AgentProfile } from '@/lib/suppliers'

/**
 * Returns the base path for tenant links.
 *  - Agent with custom_domain: '' (clean URLs — middleware on the vanity
 *    host serves these directly; on the platform host it 301s to vanity).
 *  - Agent without custom_domain: `/frontend/{agentId}` (works on platform).
 */
export function tenantBase(agent: Pick<AgentProfile, 'id' | 'custom_domain'>): string {
  return agent.custom_domain ? '' : `/frontend/${agent.id}`
}
