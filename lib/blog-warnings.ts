/**
 * lib/blog-warnings.ts
 * Non-blocking publish-time validation for personalization tokens.
 *
 * The render layer always falls back gracefully when a token can't be filled
 * (e.g. {{advisor_first_name}} → "your advisor"), so these warnings never
 * block a save. They are surfaced in the editor so the operator can nudge
 * the advisor to fill in missing profile data.
 */

import { createServiceClient } from '@/lib/supabase/service'

export interface BlogWarningInput {
  bodyHtml: string
  /** Owner agent for non-broadcast posts. Null/undefined when broadcasting. */
  agentId: string | null | undefined
  isBroadcast: boolean
}

export async function checkBlogPostWarnings(
  input: BlogWarningInput,
): Promise<string[]> {
  const { bodyHtml, agentId, isBroadcast } = input
  const warnings: string[] = []
  if (!bodyHtml) return warnings

  const usesFirstName = bodyHtml.includes('{{advisor_first_name}}')
  if (!usesFirstName) return warnings

  if (isBroadcast) {
    warnings.push(
      'This post uses {{advisor_first_name}}. Advisors who haven’t set a first name in their profile will see "your advisor" instead.',
    )
    return warnings
  }

  if (!agentId) return warnings

  try {
    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('agents') as any)
      .select('first_name, full_name')
      .eq('id', agentId)
      .maybeSingle()

    const firstName = (data?.first_name ?? '').trim()
    if (!firstName) {
      const who = data?.full_name ? `${data.full_name} ` : ''
      warnings.push(
        `This post uses {{advisor_first_name}} but ${who}has no first name set. The CTA will fall back to "your advisor" until the profile is updated.`,
      )
    }
  } catch {
    // Schema not migrated yet, or DB unreachable — fail open. The render
    // layer's fallback still keeps the article readable.
  }

  return warnings
}
