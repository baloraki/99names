import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: '99 Names of Allah Quiz – Practice Asma ul Husna Meanings',
  description: 'Practice the 99 Names of Allah with a simple, SEO-friendly quiz placeholder that links back to crawlable names and learning pages.',
  path: '/quiz',
  locale: 'en',
})

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">Practice</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">99 Names of Allah Quiz</h1>
        <p className="text-base leading-8 text-muted">
          A full interactive quiz can be added later. For now, use this page as a crawlable practice hub: review the names, cover the meaning, and test whether you can recall the Arabic, transliteration, and short meaning without rushing.
        </p>
      </section>
      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <h2 className="text-2xl font-semibold">Suggested practice flow</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-muted">
          <li>Open a name detail page and read the Arabic, transliteration, and meaning.</li>
          <li>Close the page and write the meaning from memory.</li>
          <li>Return to the source note and reflection before marking the name as learned.</li>
        </ol>
      </section>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link className="btn-primary" href="/names">Review names</Link>
        <Link className="btn-secondary" href="/learn">Open learning mode</Link>
      </div>
    </div>
  )
}
