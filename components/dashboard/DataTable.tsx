'use client'
import { ReactNode, useState } from 'react'
import { Badge } from './Badge'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: string
  searchPlaceholder?: string
  onRowClick?: (row: T) => void
  emptyMessage?: string
  pageSize?: number
}

export function DataTable<T extends Record<string, unknown>>({
  columns, data, keyField, searchPlaceholder = 'Search...', onRowClick,
  emptyMessage = 'No data found.', pageSize = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)

  // Filter
  const filtered = data.filter(row =>
    columns.some(col => {
      const val = row[col.key]
      return val != null && String(val).toLowerCase().includes(search.toLowerCase())
    })
  )

  // Sort
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = String(a[sortKey] ?? '')
        const bVal = String(b[sortKey] ?? '')
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      })
    : filtered

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize)
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0) }}
          style={{
            padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px',
            fontSize: '13px', width: '280px', outline: 'none', backgroundColor: '#fff',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = '#111')}
          onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse', fontSize: '13px',
          backgroundColor: '#fff',
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  style={{
                    padding: '12px 16px', textAlign: 'left', fontWeight: 500,
                    color: '#6b7280', fontSize: '12px', textTransform: 'uppercase',
                    letterSpacing: '0.05em', whiteSpace: 'nowrap',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none', backgroundColor: '#fafafa',
                  }}
                >
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span style={{ marginLeft: '4px' }}>{sortAsc ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{
                  padding: '40px 16px', textAlign: 'center', color: '#9ca3af',
                }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={String(row[keyField])}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    borderBottom: '1px solid #f3f4f6',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fafafa' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  {columns.map(col => (
                    <td key={col.key} style={{
                      padding: '12px 16px', color: '#111', whiteSpace: 'nowrap',
                    }}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: '12px', fontSize: '12px', color: '#6b7280',
        }}>
          <span>{sorted.length} result{sorted.length !== 1 ? 's' : ''}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              style={{
                padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px',
                background: '#fff', fontSize: '12px', cursor: page === 0 ? 'not-allowed' : 'pointer',
                opacity: page === 0 ? 0.5 : 1,
              }}
            >
              ← Prev
            </button>
            <span style={{ padding: '6px 12px', color: '#374151', fontWeight: 500 }}>
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              style={{
                padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px',
                background: '#fff', fontSize: '12px',
                cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: page >= totalPages - 1 ? 0.5 : 1,
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
