import { revalidatePath } from 'next/cache'
import type { TemplateKey } from '@/lib/tenant-paths'

const TEMPLATES: TemplateKey[] = ['frontend', 't2', 't3', 't4']

/**
 * Clears the page cache for every advisor site. Call after any write that
 * changes what a public site renders (agent profile, tier, modules, blog,
 * categories, selections, promos).
 *
 * Clears all advisors, not one: Next can only target a dynamic layout by its
 * route pattern, and broadcast posts and catalog edits reach many advisors
 * anyway. Custom domains are covered because they rewrite to these paths.
 */
export function revalidateTenantSites(templates: TemplateKey[] = TEMPLATES) {
  for (const template of templates) {
    revalidatePath(`/${template}/[agentId]`, 'layout')
  }
}

/** Cruise catalog writes skip `frontend`, which has no cruise pages. */
export function revalidateCruiseSites() {
  revalidateTenantSites(['t2', 't3', 't4'])
}
