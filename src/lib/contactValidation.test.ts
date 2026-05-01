import { describe, expect, it } from 'vitest'
import { validateContactForm } from './validation'

describe('contact validation', () => {
  it('blocks missing required fields', () => {
    const result = validateContactForm({ name: '', email: '', message: '' })
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBeTruthy()
    expect(result.errors.email).toBeTruthy()
    expect(result.errors.message).toBeTruthy()
  })

  it('blocks invalid email', () => {
    expect(validateContactForm({ name: 'A', email: 'bad', message: 'Hello' }).errors.email).toBeTruthy()
  })

  it('blocks too long message', () => {
    expect(validateContactForm({ name: 'A', email: 'a@example.com', message: 'x'.repeat(2001) }).errors.message).toBeTruthy()
  })

  it('blocks honeypot submissions', () => {
    expect(validateContactForm({ name: 'A', email: 'a@example.com', message: 'Hello', honeypot: 'filled' }).errors.honeypot).toBeTruthy()
  })
})
