import { getAllCategories } from '@/lib/blog-categories'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>Blog Categories</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
            Manage categories for broadcast posts that agents can opt into.
          </p>
        </div>
        <Link href="/admin/categories/new" style={{ display: 'inline-block', padding: '9px 20px', background: '#1a1a1a', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          + New Category
        </Link>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
              <th style={th}>Label</th>
              <th style={th}>Description</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af', fontSize: '14px' }}>
                  No categories yet. <Link href="/admin/categories/new" style={{ color: '#d97706' }}>Create one →</Link>
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <CategoryRow key={cat.id} category={cat} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CategoryRow({ category }: { category: any }) {
  return (
    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
      <td style={td}>
        <Link href={`/admin/categories/${category.id}`} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 500, fontSize: '14px' }}>
          {category.label}
        </Link>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', fontFamily: 'monospace' }}>{category.slug}</div>
      </td>
      <td style={td}>
        {category.description ? <span style={{ fontSize: '13px', color: '#6b7280' }}>{category.description}</span> : <em style={{ fontSize: '12px', color: '#d1d5db' }}>None</em>}
      </td>
      <td style={td}>
        {category.is_active 
          ? <span style={chip('#d1fae5', '#065f46')}>Active</span>
          : <span style={chip('#f3f4f6', '#374151')}>Inactive</span>
        }
      </td>
      <td style={td}>
        <Link href={`/admin/categories/${category.id}`} style={{ fontSize: '13px', color: '#d97706', textDecoration: 'none', marginRight: '12px' }}>Edit</Link>
      </td>
    </tr>
  )
}

const th: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' }
const chip = (bg: string, color: string): React.CSSProperties => ({ display: 'inline-flex', padding: '3px 8px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, background: bg, color })
