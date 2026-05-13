/**
 * Centralized utility for legal and operator information.
 * These values are derived from environment variables.
 */

export function getOperatorData() {
  return {
    name: process.env.NEXT_PUBLIC_OPERATOR_NAME?.trim() || 'UNCONFIGURED_OPERATOR_NAME',
    street: process.env.NEXT_PUBLIC_OPERATOR_STREET?.trim() || 'UNCONFIGURED_OPERATOR_STREET',
    city: process.env.NEXT_PUBLIC_OPERATOR_CITY?.trim() || 'UNCONFIGURED_OPERATOR_CITY',
    country: process.env.NEXT_PUBLIC_OPERATOR_COUNTRY?.trim() || 'Schweiz',
  }
}

/**
 * Returns a formatted address string for the operator.
 * Fallback to '-' if no address data is provided.
 */
export function getOperatorAddress(): string {
  const street = process.env.NEXT_PUBLIC_OPERATOR_STREET?.trim() ?? ''
  const city = process.env.NEXT_PUBLIC_OPERATOR_CITY?.trim() ?? ''
  const country = process.env.NEXT_PUBLIC_OPERATOR_COUNTRY?.trim() ?? ''

  const parts = [street, city, country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : '-'
}

/**
 * Validates and returns an environment variable or a fallback.
 */
export function getLegalEnvVar(name: string, fallback = '-'): string {
  return process.env[name]?.trim() || fallback
}
