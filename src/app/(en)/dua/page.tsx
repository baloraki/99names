import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { names } from '@/data/names'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd } from '@/lib/structuredData'

export const metadata: Metadata = buildMetadata({
  title: 'Dua with Names of Allah – Call Upon Allah by His Beautiful Names',
  description: 'Learn how to approach dua with names of Allah in a careful, source-aware way, with links to Ar-Rahman, Ar-Rahim, Al-Ghaffar, Ar-Razzaq and Al-Wadud.',
  path: '/dua',
  locale: 'en',
})

const relevantSlugs = ['ar-rahman', 'ar-rahim', 'al-ghaffar', 'ar-razzaq', 'al-wadud']

export default function DuaPage() {
  const relevantNames = relevantSlugs
    .map((slug) => names.find((name) => name.slug === slug))
    .filter((name): name is (typeof names)[number] => Boolean(name))
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/dua', label: 'Dua' },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs.map((item) => ({ name: item.label, path: item.href })))} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">Dua with names of Allah</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Dua with Names of Allah</h1>
        <div className="space-y-4 text-base leading-8 text-muted">
          <p>
            The Qur&apos;an encourages calling upon Allah by His beautiful names. A careful approach to dua is to choose a name whose meaning fits what you are asking for, call upon Allah humbly, and ask in your own words without treating a phrase or number as a guaranteed formula.
          </p>
          <p>
            This app does not create fabricated duas. The dua usage notes are generic learning prompts, such as asking Allah for mercy while reflecting on Ar-Rahman and Ar-Rahim, forgiveness while reflecting on Al-Ghaffar, provision while reflecting on Ar-Razzaq, and love or restored bonds while reflecting on Al-Wadud.
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {relevantNames.map((name) => (
          <Link key={name.id} href={`/names/${name.slug}`} className="rounded-lg border border-white/10 bg-surface p-4 hover:border-gold/50 focus-ring">
            <span className="block text-right font-arabic text-4xl" lang="ar" dir="rtl">{name.arabic}</span>
            <span className="mt-3 block text-xl font-semibold">{name.transliteration}</span>
            <span className="mt-1 block text-sm text-muted">{name.meanings.en}</span>
            <span className="mt-3 block text-sm font-semibold text-gold">Read dua usage</span>
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-gold/20 bg-surface p-5">
        <h2 className="text-2xl font-semibold">Source-aware wording</h2>
        <p className="mt-3 leading-8 text-muted">
          The safest pattern here is not to invent special invocations or promise specific results. Use the meanings as a guide for personal supplication, keep adab in mind, and consult qualified teachers for religious rulings or devotional practices.
        </p>
      </section>
    </div>
  )
}
