import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { JsonLd } from '@/components/JsonLd'
import { LearningProgressWidget } from '@/components/LearningProgressWidget'
import { RandomDuaSnippet, RandomDuaSnippetFallback } from '@/components/RandomDuaSnippet'
import { firstName } from '@/data/names'
import { buildMetadata, homeAlternates } from '@/lib/seo'
import { organizationJsonLd, websiteJsonLd } from '@/lib/structuredData'

export const metadata: Metadata = buildMetadata({
  title: 'Die 99 Namen Allahs – Bedeutung, Arabisch, Dua & Reflexion',
  description: 'Lerne die 99 Namen Allahs mit Bedeutung, arabischer Schreibweise, Dua-Hinweisen, Reflexion und quellenbewussten Notizen.',
  path: '/de',
  locale: 'de',
  alternates: homeAlternates(),
})

export default function GermanHomePage() {
  return (
    <div lang="de" className="space-y-10">
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <section className="grid gap-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-14">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Asma ul Husna Deutsch</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-primary md:text-6xl">
            Die 99 Namen Allahs
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Eine ruhige Lernhilfe für Allahs schöne Namen mit Arabisch, Transliteration, Bedeutung, Dua-Hinweisen und Reflexion. Die Inhalte bleiben quellenbewusst und erheben keine unbelegte Einzelbehauptung zur verbreiteten Liste.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" href="/de/namen">99 Namen Allahs Bedeutung</Link>
            <Link className="btn-secondary" href="/de/lernen">Lernmodus öffnen</Link>
          </div>
        </div>
        <section className="rounded-lg border border-gold/25 bg-[radial-gradient(circle_at_top,rgba(214,178,94,0.18),rgba(22,22,22,0.96)_58%)] p-6">
          <h2 className="text-sm uppercase tracking-[0.18em] text-gold">{firstName.meanings.de}</h2>
          <p className="mt-5 text-right font-arabic text-6xl leading-tight text-primary" lang="ar" dir="rtl">{firstName.arabic}</p>
          <p className="mt-6 text-2xl font-semibold">{firstName.transliteration.de}</p>
          <p className="mt-1 text-gold">{firstName.explanations.de}</p>
          <p className="mt-1 text-muted">{firstName.duaUsage.de}</p>
          {firstName.reflection && <p className="mt-1 text-muted">{firstName.reflection?.de}</p>}
          {firstName.sourceNote && <p className="mt-1 text-muted">{firstName.sourceNote?.de}</p>}
          {firstName.source && <p className="mt-1 text-gold-muted">{firstName.source?.de}</p>}
        </section>
      </section>

      <LearningProgressWidget locale="de" />


      <section className="max-w-4xl space-y-4">
        <h2 className="text-3xl font-semibold">Was sind die 99 Namen Allahs?</h2>
        <p className="leading-8 text-muted">
          Muslime lernen die schönen Namen Allahs, um Allah mit Ehrfurcht zu gedenken, die Bedeutungen zu verstehen und Dua bewusster zu formulieren. Diese deutschsprachige Route zeigt die verfügbaren deutschen Bedeutungen aus dem Datensatz und verweist auf Detailseiten mit Quellenhinweis und Review-Markierung.
        </p>
        <p className="rounded-lg border border-gold/20 bg-surface p-4 text-sm leading-6 text-muted">
          Hinweis: Die App nutzt eine verbreitete Lernreihenfolge. Religiöse Inhalte sollten vor öffentlicher Verwendung fachkundig geprüft werden.
        </p>
        <div className="mt-5 space-y-5">
          <article className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-right font-arabic text-3xl leading-relaxed text-primary" lang="ar" dir="rtl">اللَّهُ لاَ إِلَهَ إِلاَّ هُ</p>
            <p className="mt-3 text-sm text-muted">Allah - es gibt keinen Gott außer Ihm. (2:255)</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-right font-arabic text-3xl leading-relaxed text-primary" lang="ar" dir="rtl">وَلِلّهِ الأَسْمَاء الْحُسْنَى فَادْعُوهُ بِهَا وَذَرُواْ الَّذِينَ يُلْحِدُونَ فِي</p>
            <p className="mt-3 text-sm text-muted">Und Allahs sind die schönsten Namen; so ruft Ihn mit ihnen an. Und lasst diejenigen, die mit Seinen Namen abwegig umgehen. Ihnen wird vergolten, was sie zu tun pflegten. (7:180)</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-right font-arabic text-3xl leading-relaxed text-primary" lang="ar" dir="rtl">اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ</p>
            <p className="mt-3 text-sm text-muted">Allah - es gibt keinen Gott außer Ihm. Sein sind die schönsten Namen. (20:8)</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-right font-arabic text-2xl leading-relaxed text-primary md:text-3xl" lang="ar" dir="rtl">هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ ۚ يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ ۖ وَهُوَ الْعَزِيزُ الْحَكِيمُ</p>
            <p className="mt-3 text-sm text-muted">Er ist Allah, der Schöpfer, der Erschaffer, der Gestalter. Sein sind die schönsten Namen. Ihn preist, was in den Himmeln und auf der Erde ist. Und Er ist der Allmächtige und Allweise. (59:24)</p>
          </article>
        </div>
      </section>

      <Suspense fallback={<RandomDuaSnippetFallback locale="de" />}>
        <RandomDuaSnippet locale="de" />
      </Suspense>

      <section className="grid gap-4 md:grid-cols-4">
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/de/namen">
          <h2 className="text-xl font-semibold">99 Namen mit Bedeutung</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Arabisch, Transliteration, Deutsch, Englisch und Türkisch.</p>
        </Link>
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/de/lernen">
          <h2 className="text-xl font-semibold">Täglich lernen</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Schrittweise auswendig lernen, wiederholen und Fortschritt lokal markieren.</p>
        </Link>
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/de/dua">
          <h2 className="text-xl font-semibold">Dua-Hinweise</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Allah mit Seinen schönen Namen vorsichtig und ehrfürchtig anrufen.</p>
        </Link>
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/de/reflexionen">
          <h2 className="text-xl font-semibold">Reflexion</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Bedeutungen mit Charakter, Demut und Alltag verbinden.</p>
        </Link>
      </section>
    </div>
  )
}
