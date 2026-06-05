import sanitizeHtml from 'sanitize-html'

/**
 * lib/sanitize-html.ts
 *
 * Sanitizes advisor/operator-authored rich text (Tiptap output + legacy
 * WordPress import) before it is rendered with `dangerouslySetInnerHTML` on
 * public pages. Allowlist-based: permits the formatting tags our templates
 * style plus YouTube/Vimeo embeds, and strips <script>, event-handler
 * attributes (onerror, onclick, …), and javascript:/unsafe-scheme URLs.
 *
 * Apply this to the FINAL HTML string immediately before render — the authoring
 * editor (Tiptap) is a UI convenience, not a security boundary, since post
 * bodies are also writable via the agent-portal/admin APIs.
 */
export function sanitizeRichText(html: string): string {
  if (!html) return ''
  return sanitizeHtml(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'blockquote', 'pre', 'code',
      'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark', 'small', 'span', 'div',
      'ul', 'ol', 'li',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
      'iframe',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
      col: ['span'],
      colgroup: ['span'],
      '*': ['class', 'id', 'style'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowedIframeHostnames: [
      'www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com',
    ],
    allowProtocolRelative: false,
    // Links that open in a new tab must not leak window.opener.
    // NOTE: merge=true (3rd arg) — must MERGE rel into existing attributes, not
    // replace them, or the href is dropped and every link renders dead.
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    },
  })
}
