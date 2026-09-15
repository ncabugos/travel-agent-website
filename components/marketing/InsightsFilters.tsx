import Link from 'next/link'
import type { MarketingCategory } from '@/types/index'
import { CHARCOAL, DIVIDER, GOLD, WARM_GRAY_DARK } from './tokens'

/**
 * Pillar filter row for the Insights index and category pages: text links on
 * a hairline, the active one in charcoal with a gold underline.
 */
export function InsightsFilters({ categories, activeSlug }: { categories: MarketingCategory[]; activeSlug?: string }) {
  if (categories.length === 0) return null
  const items = [{ id: 'all', slug: '', label: 'All' }, ...categories.map(c => ({ id: c.id, slug: c.slug, label: c.label }))]
  return (
    <nav aria-label="Insights categories" style={{ marginTop: '40px', borderTop: `1px solid ${DIVIDER}`, borderBottom: `1px solid ${DIVIDER}` }}>
      <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0 28px' }}>
        {items.map(item => {
          const active = (activeSlug ?? '') === item.slug
          return (
            <li key={item.id}>
              <Link
                href={item.slug ? `/insights/category/${item.slug}` : '/insights'}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'inline-block', padding: '14px 0', fontSize: '14px', fontWeight: 500,
                  color: active ? CHARCOAL : WARM_GRAY_DARK, textDecoration: 'none',
                  borderBottom: active ? `1px solid ${GOLD}` : '1px solid transparent', marginBottom: '-1px',
                }}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
