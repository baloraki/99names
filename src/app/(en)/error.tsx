'use client'
import { ErrorContent } from '@/components/ErrorContent'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorContent language="en" error={error} onRetry={reset} />
}
