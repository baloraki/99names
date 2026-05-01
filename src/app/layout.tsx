import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { AppShell } from '@/components/AppShell'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import './globals.css'

export const metadata: Metadata = {
  title: '99 Names',
  description: 'Eine lokale Lernhilfe fuer die 99 Namen Allahs.',
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#080808',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-screen bg-background text-primary">
        <ServiceWorkerRegister />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
