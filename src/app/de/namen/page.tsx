import type { Metadata } from 'next'
import { Suspense } from 'react'
import { NameIndexContent } from '@/components/NameIndexContent'
import { buildMetadata, namesAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: '99 Namen Allahs Bedeutung – Arabisch, Deutsch, Englisch & Türkisch',
  description: 'Durchsuche die 99 Namen Allahs mit arabischer Schreibweise, Transliteration, deutscher Bedeutung, Dua-Hinweisen, Reflexion und Quellenhinweisen.',
  path: '/de/namen',
  locale: 'de',
  alternates: namesAlternates(),
})

export default function GermanNamesPage() {
  return (
    <Suspense>
      <NameIndexContent locale="de" />
    </Suspense>
  )
}
