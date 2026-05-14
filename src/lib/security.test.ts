import { describe, expect, it } from 'vitest'
import { timingSafeEqual } from './security'

describe('security', () => {
  describe('timingSafeEqual', () => {
    it('returns true for identical strings', () => {
      expect(timingSafeEqual('hello', 'hello')).toBe(true)
      expect(timingSafeEqual('', '')).toBe(true)
      expect(timingSafeEqual('a-very-long-secret-key-123', 'a-very-long-secret-key-123')).toBe(true)
    })

    it('returns false for different strings of same length', () => {
      expect(timingSafeEqual('abc', 'abd')).toBe(false)
      expect(timingSafeEqual('hello', 'world')).toBe(false)
    })

    it('returns false for strings of different lengths', () => {
      expect(timingSafeEqual('abc', 'abcd')).toBe(false)
      expect(timingSafeEqual('secret', 'sec')).toBe(false)
      expect(timingSafeEqual('', 'something')).toBe(false)
    })

    it('returns false when strings are similar but different case', () => {
      expect(timingSafeEqual('Secret', 'secret')).toBe(false)
    })
  })
})
