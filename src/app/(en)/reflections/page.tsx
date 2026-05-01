import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { names } from '@/data/names'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd } from '@/lib/structuredData'

export const metadata: Metadata = buildMetadata({
  title: 'Reflect on the Beautiful Names of Allah – Asma ul Husna Reflections',
  description: 'Reflect on the beautiful names of Allah with careful notes that connect meaning, dua usage and daily character without speculative claims.',
  path: '/reflections',
  locale: 'en',
})

export default function ReflectionsPage() {
  const sample = [names[0], names[2], names[10], names[96]]
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/reflections', label: 'Reflections' },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs.map((item) => ({ name: item.label, path: item.href })))} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">Beautiful names of Allah</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Reflections on the Beautiful Names of Allah</h1>
        <div className="space-y-4 text-base leading-8 text-muted">
          <p>
            Reflection helps memorization become more than recall. After learning the Arabic and meaning of a name, pause and ask what the meaning should correct in your assumptions, your dua, and your conduct with people.
          </p>
          <p>
            The reflections in this app are intentionally cautious. They do not compare Allah&apos;s attributes to human limitations, and they do not make speculative claims about hidden effects. Each reflection is a learning prompt connected to the dataset entry.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {sample.map((name) => (
          <Link key={name.id} href={`/names/${name.slug}`} className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring">
            <span className="block text-right font-arabic text-4xl" lang="ar" dir="rtl">{name.arabic}</span>
            <span className="mt-4 block text-xl font-semibold">{name.transliteration}</span>
            <span className="mt-1 block text-sm text-gold">{name.meanings.en}</span>
            <span className="mt-3 block leading-7 text-muted">{name.reflection?.en}</span>
          </Link>
        ))}
      </section>
    </div>
  )
}
