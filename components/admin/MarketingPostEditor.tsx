'use client'
/**
 * MarketingPostEditor.tsx
 * Editor for the company "Insights" blog (eliteadvisorhub.com/insights).
 *
 * Deliberately separate from PostEditor.tsx (the advisor editor) — no agent
 * selection, no broadcast targeting, no supplier tags, no personalization
 * tokens. Adds the AEO fields the strategy needs: author byline, FAQ block
 * (FAQPage schema), featured flag, and SEO overrides.
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TiptapImage from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import {
  Code2, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link2, ImageIcon, Video, ListOrdered, Plus, Trash2,
} from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { MarketingPost, MarketingCategory, InsightsFaq } from '@/types/index'

const SEO_TITLE_MAX = 70
const SEO_DESCRIPTION_MAX = 160

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 80)
}
function wordCount(html: string): number {
  const t = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return t ? t.split(' ').length : 0
}

interface Props {
  post?: MarketingPost
  categories: MarketingCategory[]
  isNew?: boolean
}

export function MarketingPostEditor({ post, categories, isNew = false }: Props) {
  const router = useRouter()

  const [title, setTitle]                     = useState(post?.title ?? '')
  const [slug, setSlug]                       = useState(post?.slug ?? '')
  const [slugEdited, setSlugEdited]           = useState(!isNew)
  const [excerpt, setExcerpt]                 = useState(post?.excerpt ?? '')
  const [seoTitle, setSeoTitle]               = useState(post?.seo_title ?? '')
  const [seoDescription, setSeoDescription]   = useState(post?.seo_description ?? '')
  const [coverUrl, setCoverUrl]               = useState(post?.cover_image_url ?? '')
  const [ogUrl, setOgUrl]                     = useState(post?.og_image_url ?? '')
  const [categoryId, setCategoryId]           = useState(post?.category_id ?? '')
  const [authorName, setAuthorName]           = useState(post?.author_name ?? 'Nick Cabugos')
  const [authorCredentials, setAuthorCredentials] = useState(post?.author_credentials ?? 'Founder of Elite Advisor Hub')
  const [faq, setFaq]                         = useState<InsightsFaq[]>(post?.faq ?? [])
  const [readMinutes, setReadMinutes]         = useState<string>(post?.read_minutes ? String(post.read_minutes) : '')
  const [featured, setFeatured]               = useState(post?.featured ?? false)
  const [status, setStatus]                   = useState<'published' | 'draft'>(post?.status ?? 'draft')
  const [publishedAt, setPublishedAt]         = useState(
    (post?.published_at ?? new Date().toISOString()).slice(0, 10),
  )

  const [saving, setSaving]     = useState(false)
  const [saveMsg, setSaveMsg]   = useState('')
  const [sourceMode, setSourceMode] = useState(false)
  const [sourceHtml, setSourceHtml] = useState('')
  const sourceRef = useRef<HTMLTextAreaElement | null>(null)
  const [bodyHtml, setBodyHtml] = useState(post?.body_html ?? '')

  // Auto-fill slug from title until the user edits the slug field.
  useEffect(() => {
    if (!slugEdited) setSlug(slugify(title))
  }, [title, slugEdited])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ['paragraph', 'heading'], alignments: ['left', 'center', 'right', 'justify'] }),
      Youtube.configure({ controls: true, nocookie: true, modestBranding: true, width: 640, height: 360 }),
    ],
    content: post?.body_html ?? '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => setBodyHtml(editor.getHTML()),
    editorProps: {
      attributes: { style: 'outline:none; min-height:360px; padding:12px; font-size:15px; line-height:1.8; color:#1a1a1a;' },
    },
  })

  const setBlockFormat = useCallback((value: string) => {
    if (!editor) return
    const chain = editor.chain().focus()
    if (value === 'paragraph') chain.setParagraph().run()
    else if (value === 'blockquote') chain.toggleBlockquote().run()
    else if (value.startsWith('h')) chain.setHeading({ level: Number(value.slice(1)) as 2 | 3 | 4 }).run()
  }, [editor])

  const currentBlockFormat = (() => {
    if (!editor) return 'paragraph'
    if (editor.isActive('blockquote')) return 'blockquote'
    for (const level of [2, 3, 4] as const) if (editor.isActive('heading', { level })) return `h${level}`
    return 'paragraph'
  })()

  const insertLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL:', prev ?? 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    const { from, to } = editor.state.selection
    if (from === to) editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run()
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const insertImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Image URL:', 'https://')
    if (!url) return
    const alt = window.prompt('Alt text:', '') ?? ''
    editor.chain().focus().setImage({ src: url, alt }).run()
  }, [editor])

  const insertVideo = useCallback(() => {
    if (!editor) return
    const url = window.prompt('YouTube URL:', 'https://www.youtube.com/watch?v=')
    if (!url) return
    editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 })
  }, [editor])

  const toggleSourceMode = useCallback(() => {
    if (!editor) return
    if (sourceMode) { editor.commands.setContent(sourceHtml || '<p></p>', { emitUpdate: true }); setSourceMode(false) }
    else { setSourceHtml(editor.getHTML()); setSourceMode(true) }
  }, [editor, sourceMode, sourceHtml])

  // FAQ helpers
  const addFaq    = () => setFaq(f => [...f, { q: '', a: '' }])
  const removeFaq = (i: number) => setFaq(f => f.filter((_, idx) => idx !== i))
  const updateFaq = (i: number, key: 'q' | 'a', v: string) =>
    setFaq(f => f.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)))

  async function save(saveStatus?: 'published' | 'draft') {
    const finalStatus = saveStatus ?? status
    setSaving(true); setSaveMsg('')
    const body_html = sourceMode ? sourceHtml : (editor?.getHTML() ?? bodyHtml)
    const payload: Partial<MarketingPost> = {
      title,
      slug: slug.trim() || undefined,
      excerpt: excerpt || null,
      body_html,
      cover_image_url: coverUrl || null,
      og_image_url: ogUrl || null,
      category_id: categoryId || null,
      author_name: authorName,
      author_credentials: authorCredentials,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      faq: faq.filter(f => f.q.trim() || f.a.trim()),
      read_minutes: readMinutes ? Number(readMinutes) : null,
      featured,
      status: finalStatus,
      published_at: new Date(publishedAt).toISOString(),
    }
    const url = isNew ? '/api/admin/marketing-posts' : `/api/admin/marketing-posts/${post!.id}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    if (res.ok) {
      const saved = await res.json()
      setStatus(finalStatus)
      setSaveMsg('Saved ✓')
      initialKeyRef.current = currentKey
      setInitialKey(currentKey)
      if (isNew) router.push(`/admin/insights/${saved.id}`)
    } else {
      const err = await res.json().catch(() => ({}))
      setSaveMsg(`Error: ${err.error ?? 'Save failed'}`)
    }
  }

  // Dirty tracking
  const currentKey = useMemo(() => JSON.stringify({
    title, slug, excerpt, seoTitle, seoDescription, coverUrl, ogUrl, categoryId,
    authorName, authorCredentials, faq, readMinutes, featured, status, publishedAt,
    bodyHtml: sourceMode ? sourceHtml : bodyHtml,
  }), [title, slug, excerpt, seoTitle, seoDescription, coverUrl, ogUrl, categoryId,
       authorName, authorCredentials, faq, readMinutes, featured, status, publishedAt,
       bodyHtml, sourceHtml, sourceMode])
  const initialKeyRef = useRef(currentKey)
  const [initialKey, setInitialKey] = useState(currentKey)
  const isDirty = currentKey !== initialKey

  useEffect(() => {
    if (!saveMsg.startsWith('Saved')) return
    const t = setTimeout(() => setSaveMsg(''), 2500)
    return () => clearTimeout(t)
  }, [saveMsg])

  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const estMinutes = Math.max(1, Math.round(wordCount(sourceMode ? sourceHtml : bodyHtml) / 225))

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/admin/insights" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '13px' }}>← Insights</a>
          <span style={{ color: '#d1d5db' }}>/</span>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>{isNew ? 'New Insights post' : 'Edit post'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saveMsg && <span style={{ fontSize: '13px', color: saveMsg.startsWith('Error') ? '#dc2626' : '#059669' }}>{saveMsg}</span>}
          <button onClick={() => save('draft')} disabled={saving} style={btnStyle('secondary', saving)}>Save draft</button>
          <button onClick={() => save('published')} disabled={saving} style={btnStyle('primary', saving)}>
            {saving ? 'Saving…' : status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title"
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '22px', fontWeight: 600, color: '#1a1a1a', padding: 0, background: 'transparent', boxSizing: 'border-box' }} />
          </Card>

          {/* Body */}
          <Card label="Content">
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', padding: '8px 12px', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
              <select value={currentBlockFormat} onChange={e => setBlockFormat(e.target.value)} disabled={sourceMode}
                style={{ padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '12px', background: '#fff', color: '#374151', cursor: sourceMode ? 'not-allowed' : 'pointer', minWidth: '120px' }}>
                <option value="paragraph">Paragraph</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="blockquote">Blockquote</option>
              </select>
              <Sep />
              <ToolBtn label="B" title="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} disabled={sourceMode} />
              <ToolBtn label="I" title="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} disabled={sourceMode} />
              <Sep />
              <ToolBtn icon={<AlignLeft size={14} />} title="Align left" onClick={() => editor?.chain().focus().setTextAlign('left').run()} active={editor?.isActive({ textAlign: 'left' })} disabled={sourceMode} />
              <ToolBtn icon={<AlignCenter size={14} />} title="Align center" onClick={() => editor?.chain().focus().setTextAlign('center').run()} active={editor?.isActive({ textAlign: 'center' })} disabled={sourceMode} />
              <ToolBtn icon={<AlignRight size={14} />} title="Align right" onClick={() => editor?.chain().focus().setTextAlign('right').run()} active={editor?.isActive({ textAlign: 'right' })} disabled={sourceMode} />
              <ToolBtn icon={<AlignJustify size={14} />} title="Justify" onClick={() => editor?.chain().focus().setTextAlign('justify').run()} active={editor?.isActive({ textAlign: 'justify' })} disabled={sourceMode} />
              <Sep />
              <ToolBtn icon={<Link2 size={14} />} title="Insert link" onClick={insertLink} active={editor?.isActive('link')} disabled={sourceMode} />
              <ToolBtn icon={<ImageIcon size={14} />} title="Insert image" onClick={insertImage} disabled={sourceMode} />
              <ToolBtn icon={<Video size={14} />} title="Insert YouTube" onClick={insertVideo} disabled={sourceMode} />
              <Sep />
              <ToolBtn label="• List" title="Bullet list" onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} disabled={sourceMode} />
              <ToolBtn icon={<ListOrdered size={14} />} title="Numbered list" onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} disabled={sourceMode} />
              <div style={{ marginLeft: 'auto' }}>
                <button onClick={toggleSourceMode} title={sourceMode ? 'Back to rich text' : 'Edit HTML'}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 10px', border: '1px solid ' + (sourceMode ? '#1a1a1a' : '#e5e7eb'), background: sourceMode ? '#1a1a1a' : 'transparent', color: sourceMode ? '#fff' : '#374151', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>
                  <Code2 size={13} /> {sourceMode ? 'Editing HTML' : 'Source'}
                </button>
              </div>
            </div>
            {sourceMode ? (
              <textarea ref={sourceRef} value={sourceHtml} onChange={e => setSourceHtml(e.target.value)} spellCheck={false}
                style={{ display: 'block', width: '100%', minHeight: '360px', resize: 'vertical', border: 'none', outline: 'none', padding: '12px', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '13px', lineHeight: 1.55, color: '#111827', background: '#fafafa', boxSizing: 'border-box', whiteSpace: 'pre-wrap' }} />
            ) : (
              <div style={{ border: '1px solid transparent' }}><EditorContent editor={editor} /></div>
            )}
            <style>{`
              .tiptap{outline:none}
              .tiptap p{margin:0 0 12px}
              .tiptap h2{font-size:22px;margin:24px 0 12px;font-weight:600}
              .tiptap h3{font-size:18px;margin:20px 0 10px;font-weight:600}
              .tiptap h4{font-size:16px;margin:18px 0 10px;font-weight:600}
              .tiptap blockquote{border-left:3px solid #B49A5A;padding-left:16px;margin:16px 0;color:#6b7280;font-style:italic}
              .tiptap ul,.tiptap ol{padding-left:20px;margin:0 0 12px}
              .tiptap a{color:#B49A5A;text-decoration:underline}
              .tiptap img{max-width:100%;height:auto;border-radius:6px;margin:12px 0}
              .tiptap [data-youtube-video] iframe{max-width:100%;aspect-ratio:16/9;border-radius:6px}
            `}</style>
          </Card>

          {/* Excerpt */}
          <Card label="Excerpt / answer-first summary">
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3}
              placeholder="A direct 40–60 word answer to the post's core question. Shows on the Insights index and as the meta description fallback."
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#374151', resize: 'vertical', background: 'transparent', boxSizing: 'border-box', lineHeight: '1.6' }} />
          </Card>

          {/* FAQ block */}
          <Card label="FAQ (FAQPage schema + on-page block)">
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px' }}>
              3–5 question/answer pairs. Rendered at the foot of the article and emitted as FAQPage structured data for AI answer engines.
            </p>
            {faq.map((row, i) => (
              <div key={i} style={{ border: '1px solid #f3f4f6', borderRadius: '8px', padding: '12px', marginBottom: '10px', background: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <FieldLabel>Question {i + 1}</FieldLabel>
                  <button onClick={() => removeFaq(i)} title="Remove" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626', display: 'inline-flex' }}><Trash2 size={14} /></button>
                </div>
                <input value={row.q} onChange={e => updateFaq(i, 'q', e.target.value)} placeholder="How much does a travel advisor website cost?" style={{ ...fieldStyle, marginBottom: '8px' }} />
                <textarea value={row.a} onChange={e => updateFaq(i, 'a', e.target.value)} rows={2} placeholder="Answer…" style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.5 }} />
              </div>
            ))}
            <button onClick={addFaq} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', border: '1px dashed #d1d5db', borderRadius: '6px', background: '#fff', color: '#374151', cursor: 'pointer', fontSize: '13px' }}>
              <Plus size={14} /> Add Q&A
            </button>
          </Card>

          {/* SEO */}
          <Card label="Search engine listing">
            <div style={{ marginBottom: '16px' }}>
              <FieldLabel>Page title</FieldLabel>
              <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder={title || 'Suggested: post title'} style={fieldStyle} />
              <CharCounter value={seoTitle} max={SEO_TITLE_MAX} fallbackValue={title} />
            </div>
            <div>
              <FieldLabel>Meta description</FieldLabel>
              <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)} rows={3} placeholder={excerpt || 'Suggested: post excerpt'} style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.5 }} />
              <CharCounter value={seoDescription} max={SEO_DESCRIPTION_MAX} fallbackValue={excerpt} />
            </div>
            <div style={{ marginTop: '18px', padding: '14px 16px', background: '#fafafa', borderRadius: '6px', border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>Search engine preview</div>
              <div style={{ color: '#1a0dab', fontSize: '16px', lineHeight: 1.3, fontFamily: 'arial, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{seoTitle.trim() || title || 'Post title'}</div>
              <div style={{ color: '#006621', fontSize: '12px', fontFamily: 'arial, sans-serif', margin: '2px 0 4px' }}>eliteadvisorhub.com › insights › {slug || 'post-slug'}</div>
              <div style={{ color: '#545454', fontSize: '13px', lineHeight: 1.5, fontFamily: 'arial, sans-serif' }}>{seoDescription.trim() || excerpt || 'Add a meta description to control what appears here.'}</div>
            </div>
          </Card>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card label="Visibility">
            <Radio label="Published" checked={status === 'published'} onChange={() => setStatus('published')} />
            <Radio label="Hidden (Draft)" checked={status === 'draft'} onChange={() => setStatus('draft')} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#374151', marginTop: '8px' }}>
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
              Featured (hero on the Insights index + homepage)
            </label>
            <div style={{ marginTop: '14px' }}>
              <FieldLabel>Publish date</FieldLabel>
              <input type="date" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} style={fieldStyle} />
            </div>
          </Card>

          <Card label="Pillar (category)">
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={fieldStyle}>
              <option value="">— Select a pillar —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '8px 0 0' }}>Each Insights post maps to exactly one content pillar.</p>
          </Card>

          <Card label="Slug">
            <input value={slug} onChange={e => { setSlug(e.target.value); setSlugEdited(true) }} placeholder="post-url-slug" style={{ ...fieldStyle, fontFamily: 'monospace', fontSize: '12px' }} />
          </Card>

          <Card label="Cover image"><ImageUpload value={coverUrl} onChange={setCoverUrl} /></Card>
          <Card label="Social share image (OG)">
            <ImageUpload value={ogUrl} onChange={setOgUrl} />
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '8px 0 0' }}>Optional. Falls back to the cover image. 1200×630 recommended.</p>
          </Card>

          <Card label="Author byline">
            <FieldLabel>Name</FieldLabel>
            <input value={authorName} onChange={e => setAuthorName(e.target.value)} style={{ ...fieldStyle, marginBottom: '12px' }} />
            <FieldLabel>Credentials line</FieldLabel>
            <input value={authorCredentials} onChange={e => setAuthorCredentials(e.target.value)} style={fieldStyle} />
          </Card>

          <Card label="Reading time">
            <input type="number" value={readMinutes} onChange={e => setReadMinutes(e.target.value)} placeholder={`${estMinutes} (estimated)`} style={fieldStyle} />
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '8px 0 0' }}>Minutes. Leave blank to use the {estMinutes}-min estimate.</p>
          </Card>
        </div>
      </div>

      {isDirty && <div style={{ height: 80 }} aria-hidden />}
      {isDirty && (
        <div role="region" aria-label="Unsaved changes" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(6px)', borderTop: '1px solid #e5e7eb', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16, zIndex: 50, boxShadow: '0 -4px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <span aria-hidden style={{ width: 8, height: 8, borderRadius: 999, background: '#f59e0b', boxShadow: '0 0 0 3px rgba(245,158,11,0.18)' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>You have unsaved changes</span>
            {saveMsg.startsWith('Error') && <span style={{ fontSize: 13, fontWeight: 500, color: '#dc2626', marginLeft: 8 }}>{saveMsg}</span>}
          </div>
          <button type="button" onClick={() => save()} disabled={saving} style={btnStyle('primary', saving)}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────────────────────── */
function Card({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      {label && <div style={{ padding: '12px 16px 0', fontSize: '13px', fontWeight: 600, color: '#374151' }}>{label}</div>}
      <div style={{ padding: label ? '10px 16px 16px' : '16px' }}>{children}</div>
    </div>
  )
}
function Radio({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', marginBottom: '8px', color: '#374151' }}>
      <input type="radio" checked={checked} onChange={onChange} style={{ accentColor: '#1a1a1a' }} />{label}
    </label>
  )
}
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>{children}</div>
}
function CharCounter({ value, max, fallbackValue }: { value: string; max: number; fallbackValue?: string | null }) {
  const usingFallback = value.trim().length === 0
  const len = (usingFallback ? (fallbackValue ?? '') : value).length
  const over = len > max, near = !over && len >= max - 10
  const color = over ? '#dc2626' : near ? '#b45309' : '#9ca3af'
  return <div style={{ marginTop: '4px', fontSize: '11px', color }}>{len} of {max} characters{usingFallback && (fallbackValue ?? '').length > 0 ? ' (fallback)' : ''}{over ? ` · over by ${len - max}` : ''}</div>
}
function ToolBtn({ label, icon, title, onClick, active, disabled }: { label?: string; icon?: React.ReactNode; title: string; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button title={title} onClick={onClick} disabled={disabled}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: icon && !label ? '5px 7px' : '4px 8px', border: 'none', background: active && !disabled ? '#f3f4f6' : 'none', borderRadius: '4px', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: active ? 700 : 400, color: disabled ? '#cbd5e1' : (active ? '#1a1a1a' : '#374151'), opacity: disabled ? 0.6 : 1 }}>
      {icon}{label}
    </button>
  )
}
function Sep() { return <div style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 4px' }} /> }

const fieldStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#374151' }
function btnStyle(variant: 'primary' | 'secondary', disabled?: boolean): React.CSSProperties {
  if (variant === 'primary') return { padding: '8px 18px', background: disabled ? '#e5e7eb' : '#1a1a1a', color: disabled ? '#9ca3af' : '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer' }
  return { padding: '8px 18px', background: '#fff', color: disabled ? '#9ca3af' : '#374151', border: '1px solid ' + (disabled ? '#e5e7eb' : '#d1d5db'), borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer' }
}
