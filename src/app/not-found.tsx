import Link from 'next/link'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '404 – Page not found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: true },
  openGraph: {
    title: '404 – Page not found',
    description: 'The page you are looking for does not exist.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '404 – Page not found',
    description: 'The page you are looking for does not exist.',
  },
}

export default function RootNotFound() {
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
            color: 'rgba(214,178,94,0.3)',
            lineHeight: 1,
            margin: 0,
            userSelect: 'none',
          }}
        >
          404
        </p>
        <h1
          style={{
            marginTop: '1rem',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#f7f3e8',
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            marginTop: '0.75rem',
            maxWidth: '24rem',
            color: '#b8b2a4',
            fontSize: '0.95rem',
          }}
        >
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            marginTop: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#d6b25e',
            color: '#060915',
            borderRadius: '0.5rem',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Back to home
        </Link>
      </body>
    </html>
  )
}

