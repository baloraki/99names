import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { JsonLd } from '@/components/JsonLd'
import { LanguageRedirect } from '@/components/LanguageRedirect'
import { LearningProgressWidget } from '@/components/LearningProgressWidget'
import { RandomDuaSnippet, RandomDuaSnippetFallback } from '@/components/RandomDuaSnippet'
import { firstName, names } from '@/data/names'
import { buildMetadata, homeAlternates } from '@/lib/seo'
import { organizationJsonLd, websiteJsonLd } from '@/lib/structuredData'

const title = '99 Names of Allah – Learn Asma ul Husna with Meaning, Dua & Reflection'
const description = 'Learn the 99 Names of Allah with Arabic, transliteration, meaning, dua usage, reflection and daily learning progress.'

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: '/',
  locale: 'en',
  alternates: homeAlternates(),
})

export default function HomePage() {
  const featured = names.slice(0, 5)

  return (
    <div className="space-y-10">
      <LanguageRedirect />
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <section className="grid gap-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-14">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Asma ul Husna learning aid</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-primary md:text-6xl">
            99 Names of Allah
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Learn the 99 Names of Allah with Arabic, transliteration, meaning, dua usage, reflection, and source-aware notes. The app is built for steady learning without exaggerated claims or keyword-stuffed content.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" href="/names">Browse all names</Link>
            <Link className="btn-secondary" href="/learn">Start learning</Link>
          </div>
        </div>
        <section className="rounded-lg border border-gold/25 bg-[radial-gradient(circle_at_top,rgba(214,178,94,0.18),rgba(22,22,22,0.96)_58%)] p-6">
          <h2 className="text-sm uppercase tracking-[0.18em] text-gold">{firstName.meanings.en}</h2>
          <p className="mt-5 text-right font-arabic text-6xl leading-tight text-primary" lang="ar" dir="rtl">{firstName.arabic}</p>
          <p className="mt-6 text-2xl font-semibold">{firstName.transliteration}</p>
          <p className="mt-1 text-gold">{firstName.explanations.en}</p>
          <p className="mt-1 text-muted">{firstName.duaUsage.en}</p>
          {firstName.reflection && <p className="mt-1 text-muted">{firstName.reflection?.en}</p>}
          {firstName.sourceNote && <p className="mt-1 text-muted">{firstName.sourceNote?.en}</p>}
          {firstName.source && <p className="mt-1 text-gold-muted">{firstName.source?.en}</p>}
        </section>
      </section>

      <LearningProgressWidget locale="en" />

      <section className="grid gap-4 md:grid-cols-4">
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/names">
          <h2 className="text-xl font-semibold">99 names with meaning</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Arabic, transliteration, English, German, and Turkish meanings.</p>
        </Link>
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/learn">
          <h2 className="text-xl font-semibold">Learn daily</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Use a simple learning flow for memorization and review.</p>
        </Link>
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/dua">
          <h2 className="text-xl font-semibold">Dua usage</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Call upon Allah by His beautiful names with careful wording.</p>
        </Link>
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/reflections">
          <h2 className="text-xl font-semibold">Reflection</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Connect meanings with character, humility, and worship.</p>
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">What are the 99 Names of Allah?</h2>
        <div className="max-w-4xl space-y-4 text-base leading-8 text-muted">
          <p>
            The 99 Names of Allah are commonly studied as Asma ul Husna, the beautiful names by which Muslims remember Allah and reflect on His perfect attributes. Learners often search for the 99 names of Allah with meaning so they can recognize the Arabic names, pronounce them carefully, and understand a short meaning in their own language.
          </p>
          <p>
            The general concept of calling upon Allah by His beautiful names is rooted in Islamic teaching, and the report that Allah has ninety-nine names is authentically known. This app treats the exact common list with caution: it does not claim every individual entry is independently sahih-confirmed unless the dataset source note supports that claim.
          </p>
        </div>
        <p className="max-w-4xl rounded-lg border border-gold/20 bg-surface p-4 text-sm leading-6 text-muted">
          Source-aware note: every name detail page keeps its source note visible. Entries marked with content review required should be checked by qualified reviewers before public religious reliance.
        </p>
        <div className="mt-5 space-y-5">
          <article className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-right font-arabic text-3xl leading-relaxed text-primary" lang="ar" dir="rtl">اللَّهُ لاَ إِلَهَ إِلاَّ هُ</p>
            <p className="mt-3 text-sm text-muted">Allah! There is no god but He. (2:255)</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-right font-arabic text-3xl leading-relaxed text-primary" lang="ar" dir="rtl">وَلِلّهِ الأَسْمَاء الْحُسْنَى فَادْعُوهُ بِهَا وَذَرُواْ الَّذِينَ يُلْحِدُونَ فِي</p>
            <p className="mt-3 text-sm text-muted">And to Allah belong the best names, so invoke Him by them. And leave [the company of] those who practice deviation concerning His names. They will be recompensed for what they have been doing. (7:180)</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-right font-arabic text-3xl leading-relaxed text-primary" lang="ar" dir="rtl">اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ</p>
            <p className="mt-3 text-sm text-muted">Allah! There is no Allah save Him. His are the most beautiful names. (20:8)</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-right font-arabic text-2xl leading-relaxed text-primary md:text-3xl" lang="ar" dir="rtl">هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ ۚ يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ ۖ وَهُوَ الْعَزِيزُ الْحَكِيمُ</p>
            <p className="mt-3 text-sm text-muted">He is Allah, the Creator, the Shaper out of naught, the Fashioner. His are the most beautiful names. All that is in the heavens and the earth glorifieth Him, and He is the Mighty, the Wise. (59:24)</p>
          </article>
        </div>
      </section>

      <Suspense fallback={<RandomDuaSnippetFallback locale="en" />}>
        <RandomDuaSnippet locale="en" />
      </Suspense>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Featured names</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {featured.map((name) => (
            <Link key={name.id} href={`/names/${name.slug}`} className="rounded-lg border border-white/10 bg-surface p-4 hover:border-gold/50 focus-ring">
              <span className="block text-right font-arabic text-3xl" lang="ar" dir="rtl">{name.arabic}</span>
              <span className="mt-3 block font-semibold">{name.transliteration}</span>
              <span className="mt-1 block text-sm text-muted">{name.meanings.en}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
