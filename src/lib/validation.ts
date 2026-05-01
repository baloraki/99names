export type ValidationResult = {
  valid: boolean
  errors: Record<string, string>
}

export function validateContactForm(data: {
  name: string
  email: string
  message: string
  honeypot?: string
}): ValidationResult {
  const errors: Record<string, string> = {}
  if (data.honeypot?.trim()) {
    errors.honeypot = 'Unable to send this message'
  }
  if (!data.name.trim()) {
    errors.name = 'Name is required'
  } else if (data.name.length > 100) {
    errors.name = 'Name must be 100 characters or less'
  }
  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email address'
  } else if (data.email.length > 200) {
    errors.email = 'Email must be 200 characters or less'
  }
  if (!data.message.trim()) {
    errors.message = 'Message is required'
  } else if (data.message.length > 2000) {
    errors.message = 'Message must be 2000 characters or less'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
