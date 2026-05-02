import type { Viewport } from 'next'
import type { ReactNode } from 'react'
import { RootDocument } from '@/components/RootDocument'
import { rootMetadata } from '@/lib/seo'
import '../globals.css'

export const metadata = rootMetadata('de')

export const viewport: Viewport = {
  themeColor: '#060915',
  colorScheme: 'dark',
}

export default function GermanRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="de" shellLanguage="de">{children}</RootDocument>
}
