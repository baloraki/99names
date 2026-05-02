import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/seo'

export const runtime = 'edge'

const imageSize = {
  width: 1200,
  height: 630,
}

function sanitizeText(value: string | null, fallback: string, maxLength: number): string {
  if (!value) return fallback
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) return fallback
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1)}...`
}

function localizedKicker(locale: string): string {
  if (locale === 'de') return 'Lerne die schoensten Namen Allahs'
  if (locale === 'tr') return 'Esmaul Husna ile gunluk ogrenme'
  return 'Daily Asma ul Husna learning'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') ?? 'en'
  const title = sanitizeText(searchParams.get('title'), SITE_NAME, 90)
  const subtitle = sanitizeText(searchParams.get('subtitle'), SITE_TAGLINE, 120)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #080808 0%, #0f172a 50%, #134e4a 100%)',
          color: '#f8fafc',
          padding: '56px',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '74%',
          }}
        >
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.2,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: '#86efac',
            }}
          >
            {localizedKicker(locale)}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1.05,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 34,
                lineHeight: 1.25,
                color: '#cbd5e1',
              }}
            >
              {subtitle}
            </div>
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#93c5fd',
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            width: '220px',
            height: '220px',
            borderRadius: '56px',
            background: 'radial-gradient(circle at 30% 30%, #22d3ee 0%, #0ea5e9 45%, #1d4ed8 100%)',
            boxShadow: '0 20px 80px rgba(14, 165, 233, 0.45)',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 86,
            fontWeight: 800,
            color: '#ecfeff',
          }}
        >
          99
        </div>
      </div>
    ),
    imageSize,
  )
}

