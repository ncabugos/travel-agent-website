/**
 * Contact-detail obfuscation for public pages.
 *
 * An email address or phone number rendered as a plain `mailto:` / `tel:` link
 * sits in the server-rendered HTML, where address-harvesting crawlers scrape it
 * straight out of the markup. We put a reversed-then-base64 string in the
 * markup instead and reassemble it in the browser (see
 * components/ui/ObfuscatedContact), so the raw value never appears in page
 * source.
 *
 * This stops crawlers that only parse HTML — the overwhelming majority of
 * harvesters. It does NOT stop a headless browser that executes JavaScript.
 * It is obscurity, not a security control: never use it for anything that
 * genuinely has to stay secret.
 *
 * Reversing before base64 matters. Base64 on its own is a well-known pattern
 * that harvesters routinely decode on sight, and a decoded reversed string
 * still doesn't match an email or phone regex.
 *
 * Encoding must happen on the SERVER. `SiteFooter` and `TopBar` are client
 * components, so anything handed to them as a prop is serialized into the RSC
 * flight payload embedded in the HTML — passing a raw address to a client
 * component puts it right back in page source, masked link or not.
 *
 * btoa/atob are global in browsers and in Node 18+. Contact details are ASCII,
 * which is all btoa accepts.
 */

/** Encode a contact detail for embedding in markup. Server-side only. */
export function encodeContact(value: string): string {
  return btoa([...value].reverse().join(''))
}

/** Reassemble a value produced by encodeContact. Returns '' on malformed input. */
export function decodeContact(encoded: string): string {
  try {
    return [...atob(encoded)].reverse().join('')
  } catch {
    return ''
  }
}
