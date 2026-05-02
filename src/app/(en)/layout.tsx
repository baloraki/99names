import type { Viewport } from 'next'
import type { ReactNode } from 'react'
import { RootDocument } from '@/components/RootDocument'
import { rootMetadata } from '@/lib/seo'
import '../globals.css'

export const metadata = rootMetadata('en')

export const viewport: Viewport = {
  themeColor: '#080808',
  colorScheme: 'dark',
}

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="en" shellLanguage="en">{children}</RootDocument>
}
