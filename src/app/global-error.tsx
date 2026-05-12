'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import './globals.css'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          background: '#060915',
          color: '#f7f3e8',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <p
          style={{
            fontSize: '5rem',
            fontWeight: 700,
            color: 'rgba(248,113,113,0.25)',
            lineHeight: 1,
            margin: 0,
            userSelect: 'none',
          }}
        >
          500
        </p>
        <h1
          style={{
            marginTop: '1rem',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#f7f3e8',
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            marginTop: '0.75rem',
            maxWidth: '24rem',
            color: '#b8b2a4',
            fontSize: '0.95rem',
          }}
        >
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        {error.digest && (
          <p
            style={{
              marginTop: '0.5rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: 'rgba(184,178,164,0.5)',
            }}
          >
            #{error.digest}
          </p>
        )}
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#d6b25e',
              color: '#060915',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              background: 'rgba(255,255,255,0.09)',
              color: '#f7f3e8',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '0.5rem',
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  )
}
