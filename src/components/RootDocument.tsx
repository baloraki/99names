import type { ReactNode } from 'react'
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
    <html lang={lang} className="h-full antialiased">
      <body className="min-h-screen bg-background text-primary">
        <ServiceWorkerRegister />
        <AppShell routeLanguage={shellLanguage}>{children}</AppShell>
      </body>
    </html>
  )
}
