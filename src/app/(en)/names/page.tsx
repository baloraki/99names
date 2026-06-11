import type { Metadata } from 'next'
import { Suspense } from 'react'
import { NameIndexContent } from '@/components/NameIndexContent'
import { NamesGridSkeleton } from '@/components/NamesGridSkeleton'
import { buildMetadata, namesAlternates } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: '99 Names of Allah with Meaning – Arabic, English, German & Turkish',
  description: 'Browse all 99 Names of Allah with Arabic text, transliteration, English meaning, German meaning, Turkish meaning, dua usage, reflection and source notes.',
  path: '/names',
  locale: 'en',
  alternates: namesAlternates(),
})

export default function NamesPage() {
  return (
    <Suspense fallback={<NamesGridSkeleton />}>
      <NameIndexContent locale="en" />
    </Suspense>
  )
}
