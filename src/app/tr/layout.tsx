import type { Viewport } from 'next'
import type { ReactNode } from 'react'
import { RootDocument } from '@/components/RootDocument'
import { rootMetadata } from '@/lib/seo'
import '../globals.css'

export const metadata = rootMetadata('tr')

export const viewport: Viewport = {
  themeColor: '#060915',
  colorScheme: 'dark',
}

export default function TurkishRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="tr" shellLanguage="tr">{children}</RootDocument>
}
