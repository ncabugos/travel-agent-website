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

/** The four public template surfaces a tenant site can be served on. */
export type TemplateKey = 'frontend' | 't2' | 't3' | 't4'

/**
 * Public path to a tenant site on the platform host, by template:
 *   templatePath('t2', 't2-demo')     => '/t2/t2-demo'
 *   templatePath('t4', 'casa-solis')  => '/t4/casa-solis'
 *
 * Single source of truth for template-prefixed tenant URLs. Per CLAUDE.md §7.5,
 * don't hand-build '/t2/[agentId]' strings inline — route them through here.
 */
export function templatePath(template: TemplateKey, agentId: string): string {
  return `/${template}/${agentId}`
}
