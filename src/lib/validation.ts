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
    errors.honeypot = 'honeypot'
  }
  if (!data.name.trim()) {
    errors.name = 'nameRequired'
  } else if (data.name.length > 100) {
    errors.name = 'nameTooLong'
  }
  if (!data.email.trim()) {
    errors.email = 'emailRequired'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'emailInvalid'
  } else if (data.email.length > 200) {
    errors.email = 'emailTooLong'
  }
  if (!data.message.trim()) {
    errors.message = 'messageRequired'
  } else if (data.message.length > 2000) {
    errors.message = 'messageTooLong'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
