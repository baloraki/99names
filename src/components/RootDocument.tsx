import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AppShell } from '@/components/AppShell'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
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
    <html lang={lang} className="h-full antialiased" suppressHydrationWarning>
      <head>
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
      </head>
      <body className="min-h-screen bg-background text-primary">
        <ServiceWorkerRegister />
        <AppShell routeLanguage={shellLanguage}>{children}</AppShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
