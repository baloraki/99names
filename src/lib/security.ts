import crypto from 'node:crypto'

/**
 * Performs a timing-safe comparison of two strings.
 * Hashes both strings using SHA-256 to ensure they are the same length before comparison,
 * which prevents leaking information about the length of the strings via timing.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const aHash = crypto.createHash('sha256').update(a).digest()
  const bHash = crypto.createHash('sha256').update(b).digest()

  return crypto.timingSafeEqual(aHash, bHash)
}
