import type { Metadata } from 'next'
import Link from 'next/link'
import { LearnClient } from '@/components/LearnClient'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Learn 99 Names of Allah – Memorize Asma ul Husna Daily',
  description: 'Learn 99 Names of Allah through crawlable meanings, daily memorization, progress tracking and reflection without fixed-number promises.',
  path: '/learn',
  locale: 'en',
})

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">Learn 99 names of Allah</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Learn 99 Names of Allah with steady memorization</h1>
        <div className="space-y-4 text-base leading-8 text-muted">
          <p>
            A lasting approach to memorizing Asma ul Husna is simple: read the Arabic name, say the transliteration carefully, understand the meaning, and pause for reflection. This page keeps the learning content visible for search engines and learners, while the interactive panel below helps you mark progress locally in the browser.
          </p>
          <p>
            The goal is not to rush through a list or attach guaranteed outcomes to a number of repetitions. Learn one name at a time, revisit difficult names, and connect each meaning with humility, dua, and responsible conduct. Progress data stays local to your device.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link className="btn-primary" href="/names">Open the full list</Link>
          <Link className="btn-secondary" href="/reflections">Read reflections</Link>
        </div>
      </section>

      <LearnClient embedded />
    </div>
  )
}
