'use client'
/**
 * PostEditor.tsx
 * Shopify-style blog post editor:
 *   Left: title + rich text + excerpt + SEO
 *   Right: visibility, cover image, gallery, categories, tags, broadcast targeting
 */
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TiptapImage from '@tiptap/extension-image'
import type { BlogPost, GalleryImage, BlogCategory } from '@/types/index'
import { Lightbulb } from 'lucide-react'

// ── Available shortcode tokens ─────────────────────────────────────────────
const TOKENS = [
  { label: 'Agency Name',   value: '{{agency_name}}' },
  { label: 'Agent Name',    value: '{{agent_name}}' },
  { label: 'Agent Phone',   value: '{{agent_phone}}' },
  { label: 'Agent Email',   value: '{{agent_email}}' },
  { label: 'Agent City',    value: '{{agent_city}}' },
]

interface AgentOption { id: string; agency_name: string; name: string }

interface Props {
  post?: BlogPost
  agents: AgentOption[]
  categories?: BlogCategory[]
  isNew?: boolean
  /**
   * 'admin' (default): full editor, hits /api/admin/posts, allows broadcast
   * and agent-as selection, back-link to /admin/blog.
   * 'agent': agent-portal mode, hits /api/agent-portal/blog, hides
   * broadcast and "publish as" controls, back-link to /agent-portal/blog.
   */
  mode?: 'admin' | 'agent'
}

export function PostEditor({ post, agents, categories = [], isNew = false, mode = 'admin' }: Props) {
  const router = useRouter()
  const isAgent = mode === 'agent'
  const listPath = isAgent ? '/agent-portal/blog' : '/admin/blog'

  /* ── Form state ── */
  const [title, setTitle]             = useState(post?.title ?? '')
  const [excerpt, setExcerpt]         = useState(post?.excerpt ?? '')
  const [coverUrl, setCoverUrl]       = useState(post?.cover_image_url ?? '')
  const [gallery, setGallery]         = useState<GalleryImage[]>(post?.gallery_images ?? [])
  const [freeTextCategories, setFreeTextCategories] = useState(post?.categories?.join(', ') ?? '')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(post?.category_ids ?? [])
  const [tags, setTags]               = useState(post?.tags?.join(', ') ?? '')
  const [status, setStatus]           = useState<'published'|'draft'>(post?.status ?? 'draft')
  const [isBroadcast, setIsBroadcast] = useState(post?.is_broadcast ?? false)
  const [targetMode, setTargetMode]   = useState<'agent'|'all'|'select'>(
    post?.is_broadcast ? (post.target_agent_ids.length ? 'select' : 'all') : 'agent'
  )
  const [selectedAgent, setSelectedAgent]   = useState(post?.agent_id ?? (agents[0]?.id ?? ''))
  const [selectedAgents, setSelectedAgents] = useState<string[]>(post?.target_agent_ids ?? [])
  const [saving, setSaving]   = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [galleryInput, setGalleryInput] = useState('')
  const [showTokens, setShowTokens] = useState(false)

  /* ── Tiptap editor ── */
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      TiptapImage,
    ],
    content: post?.body_html ?? '',
    editorProps: {
      attributes: {
        style: 'outline:none; min-height:320px; padding:12px; font-size:15px; line-height:1.8; color:#1a1a1a;',
      },
    },
  })

  /* ── Insert token at cursor ── */
  const insertToken = useCallback((token: string) => {
    editor?.chain().focus().insertContent(token).run()
    setShowTokens(false)
  }, [editor])

  /* ── Gallery helpers ── */
  const addGalleryImage = () => {
    const url = galleryInput.trim()
    if (!url) return
    setGallery(g => [...g, { url, caption: '' }])
    setGalleryInput('')
  }
  const removeGalleryImage = (i: number) => setGallery(g => g.filter((_, idx) => idx !== i))
  const updateCaption = (i: number, caption: string) =>
    setGallery(g => g.map((img, idx) => idx === i ? { ...img, caption } : img))

  /* ── Save ── */
  async function save(saveStatus?: 'published' | 'draft') {
    const finalStatus = saveStatus ?? status
    setSaving(true); setSaveMsg('')

    const body_html = editor?.getHTML() ?? ''
    const payload: Partial<BlogPost> = {
      title,
      excerpt: excerpt || null,
      body_html,
      cover_image_url: coverUrl || null,
      categories: freeTextCategories.split(',').map(s => s.trim()).filter(Boolean),
      category_ids: selectedCategoryIds,
      tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      status: finalStatus,
      is_broadcast: isBroadcast,
      target_agent_ids: isBroadcast && targetMode === 'select' ? selectedAgents : [],
      gallery_images: gallery,
      agent_id: isBroadcast
        ? (agents[0]?.id ?? '')  // use first agent as owner for broadcast posts
        : selectedAgent,
    }

    const apiBase = isAgent ? '/api/agent-portal/blog' : '/api/admin/posts'
    const url  = isNew ? apiBase : `${apiBase}/${post!.id}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

    setSaving(false)
    if (res.ok) {
      const saved = await res.json()
      setSaveMsg('Saved ✓')
      if (isNew) router.push(`${listPath}/${saved.id}`)
    } else {
      const err = await res.json()
      setSaveMsg(`Error: ${err.error ?? 'Save failed'}`)
    }
  }

  /* ── UI ── */
  return (
    <div style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href={listPath} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '13px' }}>← Journal Posts</a>
          <span style={{ color: '#d1d5db' }}>/</span>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
            {isNew ? 'Add journal post' : 'Edit post'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saveMsg && <span style={{ fontSize: '13px', color: saveMsg.startsWith('Error') ? '#dc2626' : '#059669' }}>{saveMsg}</span>}
          <button onClick={() => save('draft')} disabled={saving} style={btnStyle('secondary')}>
            Save draft
          </button>
          <button onClick={() => save('published')} disabled={saving} style={btnStyle('primary')}>
            {saving ? 'Saving…' : status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Title */}
          <Card>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title"
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '22px', fontWeight: 600, color: '#1a1a1a', padding: 0, background: 'transparent', boxSizing: 'border-box' }}
            />
          </Card>

          {/* Rich text editor */}
          <Card label="Content">
            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', padding: '8px 12px', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
              <ToolBtn label="B" title="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} />
              <ToolBtn label="I" title="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} />
              <ToolBtn label="H2" title="Heading 2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} />
              <ToolBtn label="H3" title="Heading 3" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} />
              <ToolBtn label="❝" title="Blockquote" onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} />
              <ToolBtn label="• List" title="Bullet list" onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} />
              <Sep />
              {/* Token insert */}
              <div style={{ position: 'relative' }}>
                <ToolBtn label="{ } Insert token" title="Insert shortcode" onClick={() => setShowTokens(v => !v)} />
                {showTokens && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px', zIndex: 50, minWidth: '180px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                    {TOKENS.map(t => (
                      <button key={t.value} onClick={() => insertToken(t.value)}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', color: '#374151', borderRadius: '4px' }}
                        onMouseEnter={e => { (e.currentTarget).style.background = '#f3f4f6' }}
                        onMouseLeave={e => { (e.currentTarget).style.background = 'none' }}
                      >
                        <span style={{ color: '#b45309', fontFamily: 'monospace', marginRight: '8px' }}>{t.value}</span>
                        <span style={{ color: '#6b7280' }}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Editor area */}
            <div style={{ border: '1px solid transparent' }}>
              <EditorContent editor={editor} />
            </div>
            <style>{`
              .tiptap { outline: none; }
              .tiptap p { margin: 0 0 12px; }
              .tiptap h2 { font-size: 22px; margin: 24px 0 12px; }
              .tiptap h3 { font-size: 18px; margin: 20px 0 10px; }
              .tiptap blockquote { border-left: 3px solid #d97706; padding-left: 16px; margin: 16px 0; color: #6b7280; font-style: italic; }
              .tiptap ul { padding-left: 20px; }
              .tiptap a { color: #d97706; text-decoration: underline; }
            `}</style>
          </Card>

          {/* Excerpt */}
          <Card label="Excerpt">
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Add a summary of the post to appear on the journal index…"
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#374151', resize: 'vertical', background: 'transparent', boxSizing: 'border-box', lineHeight: '1.6' }}
            />
          </Card>

        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Visibility */}
          <Card label="Visibility">
            <Radio label="Published" checked={status === 'published'} onChange={() => setStatus('published')} />
            <Radio label="Hidden (Draft)" checked={status === 'draft'} onChange={() => setStatus('draft')} />
          </Card>

          {/* Cover Image */}
          <Card label="Cover Image">
            {coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="cover" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />
            )}
            <input
              value={coverUrl}
              onChange={e => setCoverUrl(e.target.value)}
              placeholder="Paste image URL…"
              style={fieldStyle}
            />
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '6px 0 0' }}>
              Paste a URL or upload via Supabase Storage
            </p>
          </Card>

          {/* Image Gallery */}
          <Card label="Image Gallery">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                value={galleryInput}
                onChange={e => setGalleryInput(e.target.value)}
                placeholder="Image URL…"
                style={{ ...fieldStyle, flex: 1 }}
                onKeyDown={e => e.key === 'Enter' && addGalleryImage()}
              />
              <button onClick={addGalleryImage} style={btnStyle('secondary')}>Add</button>
            </div>
            {gallery.map((img, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '10px', background: '#f9fafb', borderRadius: '6px', padding: '8px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} onError={e => { e.currentTarget.style.display='none' }} />
                <div style={{ flex: 1 }}>
                  <input
                    value={img.caption ?? ''}
                    onChange={e => updateCaption(i, e.target.value)}
                    placeholder="Caption (optional)"
                    style={{ ...fieldStyle, fontSize: '12px', marginBottom: '4px' }}
                  />
                  <button onClick={() => removeGalleryImage(i)} style={{ fontSize: '11px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Remove</button>
                </div>
              </div>
            ))}
            {gallery.length === 0 && <p style={{ fontSize: '12px', color: '#9ca3af' }}>No gallery images yet.</p>}
          </Card>

          {/* Organization */}
          <Card label="Organization">
            {categories.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <FieldLabel>Categories (Opt-in)</FieldLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  {categories.filter(c => c.is_active || selectedCategoryIds.includes(c.id)).map(cat => (
                    <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#374151' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedCategoryIds.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCategoryIds([...selectedCategoryIds, cat.id])
                          else setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== cat.id))
                        }}
                      />
                      {cat.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <FieldLabel>Legacy Categories (comma-separated)</FieldLabel>
            <input value={freeTextCategories} onChange={e => setFreeTextCategories(e.target.value)} placeholder="e.g. hotels, destinations" style={{ ...fieldStyle, marginBottom: '12px' }} />
            <FieldLabel>Tags (comma-separated)</FieldLabel>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. paris, luxury, aman" style={fieldStyle} />
          </Card>

          {/* Publish To — admin only. Agents are always publishing to themselves. */}
          {!isAgent && (
            <Card label="Publish To">
              <Radio
                label="Specific agent"
                checked={targetMode === 'agent'}
                onChange={() => { setTargetMode('agent'); setIsBroadcast(false) }}
              />
              {targetMode === 'agent' && (
                <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)} style={{ ...fieldStyle, marginTop: '8px', marginBottom: '4px' }}>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.agency_name} — {a.name}</option>
                  ))}
                </select>
              )}
              <Radio
                label="All agents (broadcast)"
                checked={targetMode === 'all'}
                onChange={() => { setTargetMode('all'); setIsBroadcast(true) }}
              />
              <Radio
                label="Select agents"
                checked={targetMode === 'select'}
                onChange={() => { setTargetMode('select'); setIsBroadcast(true) }}
              />
              {targetMode === 'select' && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {agents.map(a => (
                    <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(a.id)}
                        onChange={e => setSelectedAgents(prev =>
                          e.target.checked ? [...prev, a.id] : prev.filter(id => id !== a.id)
                        )}
                      />
                      {a.agency_name}
                    </label>
                  ))}
                </div>
              )}
              {(targetMode === 'all' || targetMode === 'select') && (
                <div style={{ marginTop: '10px', padding: '8px 10px', background: '#fef3c7', borderRadius: '6px', fontSize: '12px', color: '#92400e', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Lightbulb size={14} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: '1px' }} /> Use <code style={{ fontFamily: 'monospace' }}>{'{{agency_name}}'}</code> in the body to personalize for each agent.
                </div>
              )}
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function Card({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      {label && (
        <div style={{ padding: '12px 16px 0', fontSize: '13px', fontWeight: 600, color: '#374151' }}>{label}</div>
      )}
      <div style={{ padding: label ? '10px 16px 16px' : '16px' }}>{children}</div>
    </div>
  )
}

function Radio({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', marginBottom: '8px', color: '#374151' }}>
      <input type="radio" checked={checked} onChange={onChange} style={{ accentColor: '#1a1a1a' }} />
      {label}
    </label>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>{children}</div>
}

function ToolBtn({ label, title, onClick, active }: { label: string; title: string; onClick: () => void; active?: boolean }) {
  return (
    <button title={title} onClick={onClick} style={{ padding: '4px 8px', border: 'none', background: active ? '#f3f4f6' : 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: active ? 700 : 400, color: active ? '#1a1a1a' : '#374151' }}>
      {label}
    </button>
  )
}

function Sep() {
  return <div style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 4px' }} />
}

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '6px',
  fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#374151',
}

function btnStyle(variant: 'primary' | 'secondary'): React.CSSProperties {
  return variant === 'primary'
    ? { padding: '8px 18px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }
    : { padding: '8px 18px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }
}
