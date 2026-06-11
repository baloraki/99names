import type { ReactNode } from 'react'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AppShell } from '@/components/AppShell'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { fontArabic, fontSans } from '@/app/fonts'
import type { Language } from '@/types/language'

export function RootDocument({
  children,
  lang,
  shellLanguage,
}: {
  children: ReactNode
  lang: Language
  shellLanguage?: Language
}) {
  return (
    <html
      lang={lang}
      className={`h-full antialiased ${fontSans.variable} ${fontArabic.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-primary">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('app:v1:theme');
                if (theme) {
                  document.documentElement.setAttribute('data-theme', JSON.parse(theme));
                } else {
                  document.documentElement.setAttribute('data-theme', 'soft-light');
                }
              } catch (e) {}
            `,
          }}
        />
        <ServiceWorkerRegister />
        <AppShell routeLanguage={shellLanguage}>{children}</AppShell>
        <Analytics />
        <SpeedInsights />
        <Script src="https://scripts.simpleanalyticscdn.com/latest.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
