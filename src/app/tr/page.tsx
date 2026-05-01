import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { names } from '@/data/names'
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
            <Link className="btn-secondary" href="/learn">Öğrenme modunu aç</Link>
          </div>
        </div>
        <section className="rounded-lg border border-gold/25 bg-surface p-6">
          <h2 className="text-sm uppercase tracking-[0.18em] text-gold">İlk isim</h2>
          <p className="mt-5 text-right font-arabic text-6xl leading-tight text-primary" lang="ar" dir="rtl">{names[0].arabic}</p>
          <p className="mt-6 text-2xl font-semibold">{names[0].transliteration}</p>
          <p className="mt-1 text-muted">{names[0].meanings.tr}</p>
          <Link className="mt-6 inline-flex rounded text-sm font-semibold text-gold hover:text-gold-soft focus-ring" href={`/tr/esmaul-husna/${names[0].slug}`}>
            Anlamı oku
          </Link>
        </section>
      </section>

      <section className="max-w-4xl space-y-4">
        <h2 className="text-3xl font-semibold">Esmaül Hüsna nedir?</h2>
        <p className="leading-8 text-muted">
          Esmaül Hüsna, Allah’ın güzel isimleri için kullanılan yaygın ifadedir. Bu Türkçe rota, veri setindeki Türkçe anlamları gösterir ve her detay sayfasında kaynak notunu, dua kullanımını, tefekkürü ve inceleme uyarısını görünür tutar.
        </p>
        <p className="rounded-lg border border-gold/20 bg-surface p-4 text-sm leading-6 text-muted">
          Not: Bu uygulama bir öğrenme yardımcısıdır. Dini içerik kamuya açık kullanımdan önce uzman kişilerce incelenmelidir.
        </p>
      </section>
    </div>
  )
}
