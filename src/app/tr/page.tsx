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
  title: "Allah'ın 99 İsmi – Esmaül Hüsna Anlamları, Dua ve Tefekkür",
  description: "Allah'ın 99 ismini Arapça yazım, transliterasyon, anlam, dua kullanımı, tefekkür ve kaynak bilinciyle öğren.",
  path: '/tr',
  locale: 'tr',
  alternates: homeAlternates(),
})

export default function TurkishHomePage() {
  return (
    <div lang="tr" className="space-y-10">
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <section className="grid gap-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-14">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Esmaül Hüsna</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-primary md:text-6xl">
            Allah&apos;ın 99 İsmi
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Arapça yazım, transliterasyon, Türkçe anlam, dua kullanımı ve tefekkür notlarıyla Esmaül Hüsna öğren. İçerik kaynak bilinciyle sunulur ve yaygın liste hakkında abartılı iddialardan kaçınır.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" href="/tr/esmaul-husna">Esmaül Hüsna anlamları</Link>
            <Link className="btn-secondary" href="/tr/ogren">Öğrenme modunu aç</Link>
          </div>
        </div>
        <section className="rounded-lg border border-gold/25 bg-[radial-gradient(circle_at_top,rgba(214,178,94,0.18),rgba(22,22,22,0.96)_58%)] p-6">
          <h2 className="text-sm uppercase tracking-[0.18em] text-gold">{firstName.meanings.tr}</h2>
          <p className="mt-5 text-right font-arabic text-6xl leading-tight text-primary" lang="ar" dir="rtl">{firstName.arabic}</p>
          <p className="mt-6 text-2xl font-semibold">{firstName.transliteration.tr}</p>
          <p className="mt-1 text-gold">{firstName.explanations.tr}</p>
          <p className="mt-1 text-muted">{firstName.duaUsage.tr}</p>
          {firstName.reflection && <p className="mt-1 text-muted">{firstName.reflection?.tr}</p>}
          {firstName.sourceNote && <p className="mt-1 text-muted">{firstName.sourceNote?.tr}</p>}
          {firstName.source && <p className="mt-1 text-gold-muted">{firstName.source?.tr}</p>}
        </section>
      </section>

      <LearningProgressWidget locale="tr" />

      <section className="max-w-4xl space-y-4">
        <h2 className="text-3xl font-semibold">Esmaül Hüsna nedir?</h2>
        <p className="leading-8 text-muted">
          Esmaül Hüsna, Allah’ın güzel isimleri için kullanılan yaygın ifadedir. Bu Türkçe rota, veri setindeki Türkçe anlamları gösterir ve her detay sayfasında kaynak notunu, dua kullanımını, tefekkürü ve inceleme uyarısını görünür tutar.
        </p>
        <p className="rounded-lg border border-gold/20 bg-surface p-4 text-sm leading-6 text-muted">
          Not: Bu uygulama bir öğrenme yardımcısıdır. Dini içerik kamuya açık kullanımdan önce uzman kişilerce incelenmelidir.
        </p>
        <div className="mt-5 space-y-5">
          <article className="rounded-xl border border-white/10 surface-subtle p-4">
            <p className="text-right font-arabic text-3xl leading-relaxed text-primary" lang="ar" dir="rtl">اللَّهُ لاَ إِلَهَ إِلاَّ هُ</p>
            <p className="mt-3 text-sm text-muted">Allah, O&apos;ndan başka ilâh olmayandır. (2:255)</p>
          </article>
          <article className="rounded-xl border border-white/10 surface-subtle p-4">
            <p className="text-right font-arabic text-3xl leading-relaxed text-primary" lang="ar" dir="rtl">وَلِلّهِ الأَسْمَاء الْحُسْنَى فَادْعُوهُ بِهَا وَذَرُواْ الَّذِينَ يُلْحِدُونَ فِي</p>
            <p className="mt-3 text-sm text-muted">En güzel isimler Allah&apos;ındır; bu güzel isimlerle O&apos;na dua edin. O&apos;nun isimleri hakkında gerçeği çarpıtanları bırakın. Onlar yapmakta olduklarının cezasına çarptırılacaklardır. (7:180)</p>
          </article>
          <article className="rounded-xl border border-white/10 surface-subtle p-4">
            <p className="text-right font-arabic text-3xl leading-relaxed text-primary" lang="ar" dir="rtl">اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ</p>
            <p className="mt-3 text-sm text-muted">Allah, kendisinden başka hiçbir ilâh bulunmayandır. En güzel isimler O&apos;nundur. (20:8)</p>
          </article>
          <article className="rounded-xl border border-white/10 surface-subtle p-4">
            <p className="text-right font-arabic text-2xl leading-relaxed text-primary md:text-3xl" lang="ar" dir="rtl">هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ ۚ يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ ۖ وَهُوَ الْعَزِيزُ الْحَكِيمُ</p>
            <p className="mt-3 text-sm text-muted">O, yaratan, var eden, şekil veren Allah&apos;tır. En güzel isimler O&apos;nundur. Göklerde ve yerde olanlar O&apos;nu tesbih ederler. O mutlak güç sahibidir, hüküm ve hikmet sahibidir. (59:24)</p>
          </article>
        </div>
      </section>

      <Suspense fallback={<RandomDuaSnippetFallback locale="tr" />}>
        <RandomDuaSnippet locale="tr" />
      </Suspense>

      <section className="grid gap-4 md:grid-cols-4">
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/tr/esmaul-husna">
          <h2 className="text-xl font-semibold">99 isim ve anlamları</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Arapça, transliterasyon, Türkçe, İngilizce ve Almanca anlamlar.</p>
        </Link>
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/tr/ogren">
          <h2 className="text-xl font-semibold">Günlük öğren</h2>
          <p className="mt-2 text-sm leading-6 text-muted">İsimleri adım adım öğren, tekrar et ve ilerlemeyi yerel olarak işaretle.</p>
        </Link>
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/tr/dua">
          <h2 className="text-xl font-semibold">Dua kullanımı</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Allah’a güzel isimleriyle ihtiyatlı ve edepli şekilde yönel.</p>
        </Link>
        <Link className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring" href="/tr/tefekkur">
          <h2 className="text-xl font-semibold">Tefekkür</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Anlamları karakter, tevazu ve günlük davranışla ilişkilendir.</p>
        </Link>
      </section>
    </div>
  )
}
