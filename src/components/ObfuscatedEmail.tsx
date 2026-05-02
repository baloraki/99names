'use client'

import { useEffect, useState, startTransition } from 'react'

// ─── EMAIL OBFUSCATION ────────────────────────────────────────────────────────
// Layer 1 – No SSR: useEffect only runs in the browser → static crawlers see nothing
// Layer 2 – Base64: plain address never appears in source / JS bundle
// Layer 3 – CSS rtl: reversed chars in DOM, `direction: rtl` flips visually
//
// To update: node -e "console.log(Buffer.from('you@example.com').toString('base64'))"
const ENCODED_EMAIL = 'bGVhcm5odXNuYUBnbXgtdG9wbWFpbC5kZQ=='

export function ObfuscatedEmail() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    startTransition(() => {
      setEmail(window.atob(ENCODED_EMAIL))
    })
  }, [])

  if (!email) {
    return <span aria-hidden="true" className="opacity-0 select-none text-xs">···</span>
  }

  // Reversed text in DOM – no valid e-mail pattern for regex scrapers
  const reversed = email.split('').reverse().join('')

  return (
    <a
      href={`mailto:${email}`}
      className="text-gold underline underline-offset-2 hover:text-gold/80"
      style={{ unicodeBidi: 'bidi-override', direction: 'rtl' }}
    >
      {reversed}
    </a>
  )
}

