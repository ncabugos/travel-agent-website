'use client'
/**
 * ImageUpload — drag-and-drop / click-to-browse image uploader.
 * Hits /api/admin/upload, returns a public URL via onUpload callback.
 * Falls back to paste-a-URL mode for flexibility.
 */
import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

interface Props {
  /** Current image URL (if any) */
  value: string
  /** Called when a new image URL is set (upload or paste) */
  onChange: (url: string) => void
  /** Optional label */
  label?: string
  /** Show the preview image? Default true */
  showPreview?: boolean
  /** Preview height in px */
  previewHeight?: number
  /** API endpoint for uploads (defaults to /api/admin/upload) */
  uploadEndpoint?: string
}

export function ImageUpload({
  value,
  onChange,
  label,
  showPreview = true,
  previewHeight = 140,
  uploadEndpoint = '/api/admin/upload',
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(uploadEndpoint, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      onChange(data.url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }, [onChange, uploadEndpoint])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return
    upload(files[0])
  }, [upload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) upload(file)
        return
      }
    }
  }, [upload])

  return (
    <div>
      {label && (
        <div style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '6px' }}>{label}</div>
      )}

      {/* Preview */}
      {showPreview && value && (
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            style={{
              width: '100%',
              height: `${previewHeight}px`,
              objectFit: 'cover',
              borderRadius: '6px',
              display: 'block',
            }}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <button
            onClick={() => onChange('')}
            title="Remove image"
            style={{
              position: 'absolute', top: 6, right: 6,
              width: 24, height: 24,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#d97706' : '#e5e7eb'}`,
          borderRadius: '8px',
          padding: '20px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? '#fffbeb' : '#fafafa',
          transition: 'all 0.2s ease',
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#6b7280', fontSize: '13px' }}>
            <Loader2 size={16} className="spin" /> Uploading…
          </div>
        ) : (
          <>
            <Upload size={20} style={{ color: '#9ca3af', margin: '0 auto 8px' }} />
            <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 4px', fontWeight: 500 }}>
              Drop an image, click to browse, or paste
            </p>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
              JPG, PNG, WebP or GIF · Max 10 MB
            </p>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />

      {/* Fallback URL input */}
      <div style={{ marginTop: '8px' }}>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="…or paste an image URL"
          style={{
            width: '100%', padding: '7px 10px',
            border: '1px solid #e5e7eb', borderRadius: '6px',
            fontSize: '12px', outline: 'none', boxSizing: 'border-box',
            color: '#374151',
          }}
        />
      </div>

      {error && (
        <p style={{ fontSize: '11px', color: '#dc2626', margin: '6px 0 0' }}>{error}</p>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  )
}
