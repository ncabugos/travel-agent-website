'use client'
/**
 * PostEditor.tsx
 * Shopify-style blog post editor:
 *   Left: title + rich text + excerpt + SEO
 *   Right: visibility, cover image, gallery, categories, tags, broadcast targeting
 */
import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TiptapImage from '@tiptap/extension-image'
import type { BlogPost, GalleryImage, BlogCategory } from '@/types/index'
import type { SupplierTagOption } from '@/lib/supplier-tags'
import { DEMO_AGENTS } from '@/lib/demo-agents'
import { Lightbulb, Code2 } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'

// ── SEO field limits ───────────────────────────────────────────────────────
// Match the recommended ranges Shopify uses; Google truncates near these too.
const SEO_TITLE_MAX = 70
const SEO_DESCRIPTION_MAX = 160

// ── Available shortcode tokens ─────────────────────────────────────────────
// Keep in sync with renderShortcodes() in lib/blog.ts.
const TOKENS = [
  { label: 'Advisor First Name', value: '{{advisor_first_name}}' },
  { label: 'Agency Name',        value: '{{agency_name}}' },
  { label: 'Agent Name',         value: '{{agent_name}}' },
  { label: 'Agent Phone',        value: '{{agent_phone}}' },
  { label: 'Agent Email',        value: '{{agent_email}}' },
  { label: 'Plan-a-trip URL',    value: '{{plan_a_trip_url}}' },
  { label: 'Contact URL',        value: '{{contact_url}}' },
]

interface AgentOption { id: string; agency_name: string; full_name: string }

interface Props {
  post?: BlogPost
  agents: AgentOption[]
  categories?: BlogCategory[]
  suppliers?: SupplierTagOption[]
  isNew?: boolean
  /** Pre-select this agent on new posts (from ?agent_id= query param). */
  defaultAgentId?: string
  /**
   * 'admin' (default): full editor, hits /api/admin/posts, allows broadcast
   * and agent-as selection, back-link to /admin/blog.
   * 'agent': agent-portal mode, hits /api/agent-portal/blog, hides
   * broadcast and "publish as" controls, back-link to /agent-portal/blog.
   */
  mode?: 'admin' | 'agent'
}

export function PostEditor({ post, agents, categories = [], suppliers = [], isNew = false, defaultAgentId, mode = 'admin' }: Props) {
  const router = useRouter()
  const isAgent = mode === 'agent'
  const listPath = isAgent ? '/agent-portal/blog' : '/admin/blog'

  /* ── Form state ── */
  const [title, setTitle]             = useState(post?.title ?? '')
  const [excerpt, setExcerpt]         = useState(post?.excerpt ?? '')
  const [seoTitle, setSeoTitle]       = useState(post?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? '')
  const [coverUrl, setCoverUrl]       = useState(post?.cover_image_url ?? '')
  const [gallery, setGallery]         = useState<GalleryImage[]>(post?.gallery_images ?? [])
  const [freeTextCategories, setFreeTextCategories] = useState(post?.categories?.join(', ') ?? '')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(post?.category_ids ?? [])
  const [tags, setTags]               = useState(post?.tags?.join(', ') ?? '')
  const [status, setStatus]           = useState<'published'|'draft'>(post?.status ?? 'draft')
  const [isBroadcast, setIsBroadcast] = useState(post?.is_broadcast ?? false)
  const [targetMode, setTargetMode]   = useState<'agent'|'all'|'select'>(() => {
    if (!post?.is_broadcast) return 'agent'
    const hasTargets = (post.target_agent_ids?.length ?? 0) + (post.target_demo_slugs?.length ?? 0) > 0
    return hasTargets ? 'select' : 'all'
  })
  const [selectedAgent, setSelectedAgent]   = useState(post?.agent_id ?? defaultAgentId ?? (agents[0]?.id ?? ''))
  const [selectedAgents, setSelectedAgents] = useState<string[]>(post?.target_agent_ids ?? [])
  const [selectedDemos, setSelectedDemos]   = useState<string[]>(post?.target_demo_slugs ?? [])
  const [saving, setSaving]   = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])

  /* ── HTML source-mode toggle (Shopify-style) ── */
  const [sourceMode, setSourceMode] = useState(false)
  const [sourceHtml, setSourceHtml] = useState('')
  const sourceRef = useRef<HTMLTextAreaElement | null>(null)
  const [galleryInput, setGalleryInput] = useState('')
  const [showTokens, setShowTokens] = useState(false)
  const [supplierTags, setSupplierTags] = useState<string[]>(post?.supplier_tags ?? [])
  const [supplierSearch, setSupplierSearch] = useState('')

  /* ── Tiptap editor ── */
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      TiptapImage,
    ],
    content: post?.body_html ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        style: 'outline:none; min-height:320px; padding:12px; font-size:15px; line-height:1.8; color:#1a1a1a;',
      },
    },
  })

  /* ── Insert token at cursor ── */
  const insertToken = useCallback((token: string) => {
    if (sourceMode) {
      const ta = sourceRef.current
      if (!ta) return
      const start = ta.selectionStart ?? sourceHtml.length
      const end = ta.selectionEnd ?? sourceHtml.length
      const next = sourceHtml.slice(0, start) + token + sourceHtml.slice(end)
      setSourceHtml(next)
      // Restore caret position after React re-renders.
      requestAnimationFrame(() => {
        const node = sourceRef.current
        if (!node) return
        const pos = start + token.length
        node.focus()
        node.setSelectionRange(pos, pos)
      })
    } else {
      editor?.chain().focus().insertContent(token).run()
    }
    setShowTokens(false)
  }, [editor, sourceMode, sourceHtml])

  /* ── Toggle between rich-text and HTML source mode ── */
  const toggleSourceMode = useCallback(() => {
    if (!editor) return
    if (sourceMode) {
      // Source → rich-text: parse the textarea HTML back into Tiptap.
      // Tiptap will sanitize anything outside its schema; that's expected.
      editor.commands.setContent(sourceHtml || '<p></p>', { emitUpdate: true })
      setSourceMode(false)
    } else {
      // Rich-text → source: snapshot current HTML for editing.
      setSourceHtml(editor.getHTML())
      setSourceMode(true)
    }
  }, [editor, sourceMode, sourceHtml])

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

    const body_html = sourceMode ? sourceHtml : (editor?.getHTML() ?? '')
    const payload: Partial<BlogPost> = {
      title,
      excerpt: excerpt || null,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      body_html,
      cover_image_url: coverUrl || null,
      categories: freeTextCategories.split(',').map(s => s.trim()).filter(Boolean),
      category_ids: selectedCategoryIds,
      tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      status: finalStatus,
      is_broadcast: isBroadcast,
      target_agent_ids: isBroadcast && targetMode === 'select' ? selectedAgents : [],
      target_demo_slugs: isBroadcast && targetMode === 'select' ? selectedDemos : [],
      gallery_images: gallery,
      supplier_tags: supplierTags,
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
      setWarnings(Array.isArray(saved.warnings) ? saved.warnings : [])
      if (isNew) router.push(`${listPath}/${saved.id}`)
    } else {
      const err = await res.json()
      setSaveMsg(`Error: ${err.error ?? 'Save failed'}`)
      setWarnings([])
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

      {/* Personalization warnings — non-blocking */}
      {warnings.length > 0 && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 16px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#92400e',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
        }}>
          <Lightbulb size={16} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <strong style={{ fontWeight: 600 }}>Personalization notes</strong>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              {warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}

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
              <ToolBtn label="B" title="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} disabled={sourceMode} />
              <ToolBtn label="I" title="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} disabled={sourceMode} />
              <ToolBtn label="H2" title="Heading 2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} disabled={sourceMode} />
              <ToolBtn label="H3" title="Heading 3" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} disabled={sourceMode} />
              <ToolBtn label="❝" title="Blockquote" onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} disabled={sourceMode} />
              <ToolBtn label="• List" title="Bullet list" onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} disabled={sourceMode} />
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
              {/* HTML source toggle — pinned right */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={toggleSourceMode}
                  title={sourceMode ? 'Switch back to rich text' : 'Edit HTML source'}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '5px 10px',
                    border: '1px solid ' + (sourceMode ? '#1a1a1a' : '#e5e7eb'),
                    background: sourceMode ? '#1a1a1a' : 'transparent',
                    color: sourceMode ? '#fff' : '#374151',
                    borderRadius: '6px', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 500,
                  }}
                >
                  <Code2 size={13} strokeWidth={1.75} />
                  {sourceMode ? 'Editing HTML' : 'Source'}
                </button>
              </div>
            </div>
            {/* Editor area — rich-text or HTML source */}
            {sourceMode ? (
              <textarea
                ref={sourceRef}
                value={sourceHtml}
                onChange={e => setSourceHtml(e.target.value)}
                spellCheck={false}
                style={{
                  display: 'block',
                  width: '100%',
                  minHeight: '320px',
                  resize: 'vertical',
                  border: 'none',
                  outline: 'none',
                  padding: '12px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: '13px',
                  lineHeight: 1.55,
                  color: '#111827',
                  background: '#fafafa',
                  boxSizing: 'border-box',
                  whiteSpace: 'pre-wrap',
                }}
              />
            ) : (
              <div style={{ border: '1px solid transparent' }}>
                <EditorContent editor={editor} />
              </div>
            )}
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

          {/* Search engine listing — Shopify-style SEO overrides */}
          <Card label="Search engine listing">
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 14px' }}>
              Add a page title and meta description to see how this post might appear in a search engine listing. Leave blank to use the post title and excerpt.
            </p>

            {/* Page title */}
            <div style={{ marginBottom: '16px' }}>
              <FieldLabel>Page title</FieldLabel>
              <input
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                placeholder={title || 'Suggested: post title'}
                maxLength={SEO_TITLE_MAX + 20}  // soft cap; counter still shows over-limit warning
                style={fieldStyle}
              />
              <CharCounter value={seoTitle} max={SEO_TITLE_MAX} fallbackValue={title} />
            </div>

            {/* Meta description */}
            <div>
              <FieldLabel>Meta description</FieldLabel>
              <textarea
                value={seoDescription}
                onChange={e => setSeoDescription(e.target.value)}
                rows={3}
                placeholder={excerpt || 'Suggested: post excerpt'}
                maxLength={SEO_DESCRIPTION_MAX + 40}
                style={{ ...fieldStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
              />
              <CharCounter value={seoDescription} max={SEO_DESCRIPTION_MAX} fallbackValue={excerpt} />
            </div>

            {/* Search engine preview (compact) */}
            <div style={{ marginTop: '18px', padding: '14px 16px', background: '#fafafa', borderRadius: '6px', border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', letterSpacing: '0.04em' }}>Search engine preview</div>
              <div style={{ color: '#1a0dab', fontSize: '16px', lineHeight: 1.3, fontFamily: 'arial, sans-serif', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {(seoTitle.trim() || title || 'Post title')}
              </div>
              <div style={{ color: '#006621', fontSize: '12px', fontFamily: 'arial, sans-serif', marginBottom: '4px' }}>
                eliteadvisorhub.com › blog › {post?.slug ?? 'post-slug'}
              </div>
              <div style={{ color: '#545454', fontSize: '13px', lineHeight: 1.5, fontFamily: 'arial, sans-serif' }}>
                {(seoDescription.trim() || excerpt || 'Add a meta description to control what appears here.')}
              </div>
            </div>
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
            <ImageUpload value={coverUrl} onChange={setCoverUrl} />
          </Card>

          {/* Image Gallery */}
          <Card label="Image Gallery">
            <ImageUpload
              value=""
              onChange={(url) => { if (url) setGallery(g => [...g, { url, caption: '' }]) }}
              showPreview={false}
              label="Add gallery image"
            />
            {gallery.length > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {gallery.map((img, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: '#f9fafb', borderRadius: '6px', padding: '8px' }}>
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
              </div>
            )}
            {gallery.length === 0 && <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>No gallery images yet.</p>}
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

          {/* Supplier Tags */}
          {suppliers.length > 0 && (
            <Card label="Supplier Tags">
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 8px' }}>Tag this post with cruise lines or hotel programs so it appears on their landing pages.</p>
              <input
                value={supplierSearch}
                onChange={e => setSupplierSearch(e.target.value)}
                placeholder="Search suppliers…"
                style={{ ...fieldStyle, marginBottom: '8px', fontSize: '12px' }}
              />
              {(['Cruise Lines', 'Hotel Programs'] as const).map(group => {
                const items = suppliers.filter(s => s.group === group && (supplierSearch === '' || s.name.toLowerCase().includes(supplierSearch.toLowerCase())))
                if (items.length === 0) return null
                return (
                  <div key={group} style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{group}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '120px', overflowY: 'auto', padding: '4px 8px', border: '1px solid #f3f4f6', borderRadius: '6px' }}>
                      {items.map(s => (
                        <label key={s.tag} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', color: '#374151' }}>
                          <input
                            type="checkbox"
                            checked={supplierTags.includes(s.tag)}
                            onChange={e => {
                              if (e.target.checked) setSupplierTags(prev => [...prev, s.tag])
                              else setSupplierTags(prev => prev.filter(t => t !== s.tag))
                            }}
                          />
                          {s.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
              {supplierTags.length > 0 && (
                <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {supplierTags.map(tag => {
                    const found = suppliers.find(s => s.tag === tag)
                    return (
                      <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: '#f3f4f6', padding: '3px 8px', borderRadius: '12px', color: '#374151' }}>
                        {found?.name ?? tag}
                        <button
                          onClick={() => setSupplierTags(prev => prev.filter(t => t !== tag))}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', color: '#9ca3af', padding: 0, lineHeight: 1 }}
                        >×</button>
                      </span>
                    )
                  })}
                </div>
              )}
            </Card>
          )}

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
                    <option key={a.id} value={a.id}>{a.agency_name} — {a.full_name}</option>
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
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {DEMO_AGENTS.length > 0 && (
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Demo sites</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {DEMO_AGENTS.map(d => (
                          <label key={d.slug} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={selectedDemos.includes(d.slug)}
                              onChange={e => setSelectedDemos(prev =>
                                e.target.checked ? [...prev, d.slug] : prev.filter(slug => slug !== d.slug)
                              )}
                            />
                            {d.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {agents.length > 0 && (
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Agents</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                    </div>
                  )}
                </div>
              )}
              {(targetMode === 'all' || targetMode === 'select') && (
                <div style={{ marginTop: '10px', padding: '8px 10px', background: '#fef3c7', borderRadius: '6px', fontSize: '12px', color: '#92400e', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Lightbulb size={14} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: '1px' }} /> Use <code style={{ fontFamily: 'monospace' }}>{'{{advisor_first_name}}'}</code> or <code style={{ fontFamily: 'monospace' }}>{'{{agency_name}}'}</code> in the body to personalize for each agent. Advisors without a first name set will see “your advisor” instead.
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

/**
 * Character counter for SEO fields. Mirrors Shopify's behaviour:
 * - Counts the *effective* value (the override, or the fallback when override is empty)
 * - Neutral grey while in range; amber near limit; red over limit
 */
function CharCounter({ value, max, fallbackValue }: { value: string; max: number; fallbackValue?: string | null }) {
  const usingFallback = value.trim().length === 0
  const effective = usingFallback ? (fallbackValue ?? '') : value
  const len = effective.length
  const over = len > max
  const near = !over && len >= max - 10
  const color = over ? '#dc2626' : near ? '#b45309' : '#9ca3af'
  return (
    <div style={{ marginTop: '4px', fontSize: '11px', color, display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
      <span>
        {usingFallback && (fallbackValue ?? '').length > 0
          ? `Using fallback — ${len} of ${max} characters`
          : `${len} of ${max} characters used`}
      </span>
      {over && <span style={{ fontWeight: 600 }}>Over limit by {len - max}</span>}
    </div>
  )
}

function ToolBtn({ label, title, onClick, active, disabled }: { label: string; title: string; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '4px 8px',
        border: 'none',
        background: active && !disabled ? '#f3f4f6' : 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '13px',
        fontWeight: active ? 700 : 400,
        color: disabled ? '#cbd5e1' : (active ? '#1a1a1a' : '#374151'),
        opacity: disabled ? 0.6 : 1,
      }}
    >
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
