import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { names } from '@/data/names'
import { buildMetadata } from '@/lib/seo'
import { itemListJsonLd } from '@/lib/structuredData'

export const metadata: Metadata = buildMetadata({
  title: 'Asma ul Husna – Al Asma ul Husna Names and Meanings',
  description: 'Study Asma ul Husna, also written Al Asma ul Husna, with Arabic names, transliteration, meanings, dua usage, reflections and source-aware notes.',
  path: '/asma-ul-husna',
  locale: 'en',
  alternates: {
    en: '/asma-ul-husna',
    de: '/de/namen',
    tr: '/tr/esmaul-husna',
    'x-default': '/asma-ul-husna',
  },
})

export default function AsmaUlHusnaPage() {
  return (
    <div className="space-y-8">
      <JsonLd data={itemListJsonLd(names, 'en')} />
      <section className="max-w-4xl space-y-4">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">Al Asma ul Husna</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Asma ul Husna</h1>
        <div className="space-y-4 text-base leading-8 text-muted">
          <p>
            Asma ul Husna means the beautiful names. This page is a dedicated entry point for learners who search for Asma ul Husna, Al Asma ul Husna, or Allah names with meaning and want a respectful, structured way to continue.
          </p>
          <p>
            The full list is rendered as crawlable links below. Each detail page includes the Arabic name, transliteration, English meaning, German meaning, Turkish meaning, explanation, dua usage, reflection, source note, and review notice where required.
          </p>
        </div>
        <Link className="btn-primary" href="/names">Open the main 99 names list</Link>
      </section>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {names.map((name) => (
          <li key={name.id}>
            <Link href={`/names/${name.slug}`} className="block rounded-lg border border-white/10 bg-surface p-4 hover:border-gold/50 focus-ring">
              <span className="text-sm text-gold-muted">#{name.id.toString().padStart(2, '0')}</span>
              <span className="mt-3 block text-right font-arabic text-3xl" lang="ar" dir="rtl">{name.arabic}</span>
              <span className="mt-3 block font-semibold">{name.transliteration}</span>
              <span className="mt-1 block text-sm text-muted">{name.meanings.en}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
