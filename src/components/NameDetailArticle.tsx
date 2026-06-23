import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { NameDetailStarToggle } from '@/components/NameDetailStarToggle'
import { names } from '@/data/names'
import { getLocalizedNamePath, getLocalizedNamesPath, getLocalizedStaticPath } from '@/lib/seo'
import { breadcrumbJsonLd, nameFaqJsonLd, nameLearningResourceJsonLd } from '@/lib/structuredData'
import type { Language } from '@/types/language'
import type { NameEntry } from '@/types/name'

const labels = {
  en: {
    home: 'Home',
    names: 'Names',
    meaningSuffix: 'Meaning',
    arabic: 'Arabic name',
    transliteration: 'Transliteration',
    pronunciation: 'Pronunciation',
    english: 'English meaning',
    german: 'German meaning',
    turkish: 'Turkish meaning',
    explanation: 'Explanation',
    dua: 'Dua usage',
    reflection: 'Reflection',
    source: 'Source note',
    review: 'Not scholar-reviewed',
    reviewBody: 'This information draws on open sources and has not been reviewed by a qualified scholar.',
    reviewContact: 'Found an error, or are you a scholar able to help review?',
    reviewContactLink: 'Get in touch',
    previous: 'Previous name',
    next: 'Next name',
    related: 'Related names',
    faq: 'Frequently asked questions',
    qMeaning: (name: string) => `What does ${name} mean?`,
    qDua: (name: string) => `How can I call upon Allah with ${name} in dua?`,
    qSource: (name: string) => `Is ${name} individually claimed as sahih-confirmed here?`,
    aSource: 'No. This app keeps the dataset source note visible and treats the common learning list with source awareness.',
  },
  de: {
    home: 'Start',
    names: 'Namen',
    meaningSuffix: 'Bedeutung',
    arabic: 'Arabischer Name',
    transliteration: 'Transliteration',
    pronunciation: 'Aussprache',
    english: 'Englische Bedeutung',
    german: 'Deutsche Bedeutung',
    turkish: 'Türkische Bedeutung',
    explanation: 'Erklärung',
    dua: 'Dua-Hinweis',
    reflection: 'Reflexion',
    source: 'Quellenhinweis',
    review: 'Wissenschaftlich ungeprüft',
    reviewBody: 'Diese Angaben stützen sich auf offene Quellen und wurden nicht von einem qualifizierten Gelehrten geprüft.',
    reviewContact: 'Fehler gefunden oder sind Sie ein Gelehrter, der bei der Prüfung helfen kann?',
    reviewContactLink: 'Kontaktieren Sie uns',
    previous: 'Vorheriger Name',
    next: 'Nächster Name',
    related: 'Verwandte Namen',
    faq: 'Häufige Fragen',
    qMeaning: (name: string) => `Was bedeutet ${name}?`,
    qDua: (name: string) => `Wie kann ich Allah mit ${name} im Dua anrufen?`,
    qSource: (name: string) => `Wird ${name} hier einzeln als sahih-bestätigt behauptet?`,
    aSource: 'Nein. Die App hält den Quellenhinweis sichtbar und behandelt die verbreitete Lernliste quellenbewusst.',
  },
  tr: {
    home: 'Ana Sayfa',
    names: 'İsimler',
    meaningSuffix: 'Anlamı',
    arabic: 'Arapça isim',
    transliteration: 'Transliterasyon',
    pronunciation: 'Telaffuz',
    english: 'İngilizce anlam',
    german: 'Almanca anlam',
    turkish: 'Türkçe anlam',
    explanation: 'Açıklama',
    dua: 'Dua kullanımı',
    reflection: 'Tefekkür',
    source: 'Kaynak notu',
    review: 'Alim incelemesinden geçmemiştir',
    reviewBody: 'Bu bilgiler açık kaynaklara dayanmaktadır ve yetkin bir alim tarafından incelenmemiştir.',
    reviewContact: 'Bir hata buldunuz veya incelemeye yardımcı olabilecek bir alim misiniz?',
    reviewContactLink: 'Bize ulaşın',
    previous: 'Önceki isim',
    next: 'Sonraki isim',
    related: 'İlgili isimler',
    faq: 'Sık sorulan sorular',
    qMeaning: (name: string) => `${name} ne anlama gelir?`,
    qDua: (name: string) => `${name} ile Allah'a nasıl dua edebilirim?`,
    qSource: (name: string) => `${name} burada tekil olarak sahih kabul edildiği iddiasıyla mı sunuluyor?`,
    aSource: 'Hayır. Uygulama kaynak notunu görünür tutar ve yaygın öğrenme listesini kaynak bilinciyle ele alır.',
  },
} as const

function getAdjacentNames(name: NameEntry) {
  const previous = names[(name.id + names.length - 2) % names.length]
  const next = names[name.id % names.length]
  return { previous, next }
}

function getRelatedNames(name: NameEntry) {
  return [1, 2, 3]
    .map((offset) => names[(name.id + offset - 1) % names.length])
    .filter((related) => related.id !== name.id)
}

export function NameDetailArticle({ name, locale }: { name: NameEntry; locale: Language }) {
  const text = labels[locale]
  const { previous, next } = getAdjacentNames(name)
  const related = getRelatedNames(name)
  const localizedTransliteration = name.transliteration[locale]
  const title = `${localizedTransliteration} ${text.meaningSuffix}`
  const breadcrumbItems = [
    { href: locale === 'en' ? '/' : `/${locale}`, label: text.home },
    { href: getLocalizedNamesPath(locale), label: text.names },
    { href: getLocalizedNamePath(locale, name.slug), label: title },
  ]

  return (
    <article lang={locale} className="mx-auto max-w-4xl space-y-8">
      <JsonLd data={nameLearningResourceJsonLd(name, locale)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems.map((item) => ({ name: item.label, path: item.href })))} />
      <JsonLd data={nameFaqJsonLd(name, locale)} />
      <Breadcrumbs items={breadcrumbItems} />
      <header className="rounded-lg border border-gold/20 bg-surface p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gold-muted">#{name.id.toString().padStart(2, '0')}</p>
          <NameDetailStarToggle nameId={name.id} locale={locale} />
        </div>
        <p className="mt-6 text-right font-arabic text-7xl leading-tight text-primary" lang="ar" dir="rtl">
          {name.arabic}
        </p>
        <h1 className="mt-8 text-4xl font-semibold leading-tight md:text-5xl">{title}</h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">{text.transliteration}</dt>
            <dd className="mt-1 text-lg text-primary">{localizedTransliteration}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{text.pronunciation}</dt>
            <dd className="mt-1 text-lg text-primary">{name.pronunciation[locale]}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{text.english}</dt>
            <dd className="mt-1 text-lg text-gold">{name.meanings.en}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{text.german}</dt>
            <dd className="mt-1 text-lg text-gold">{name.meanings.de}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{text.turkish}</dt>
            <dd className="mt-1 text-lg text-gold">{name.meanings.tr}</dd>
          </div>
        </dl>
      </header>

      <InfoBlock title={text.qMeaning(localizedTransliteration)} body={name.explanations[locale]} />
      <InfoBlock title={text.qDua(localizedTransliteration)} body={name.duaUsage[locale]} />
      {name.reflection && <InfoBlock title={text.reflection} body={name.reflection[locale]} />}
      {name.sourceNote && <InfoBlock title={text.source} body={name.sourceNote[locale]} subtle={name.source ? name.source[locale] : undefined} />}
      {!name.scholarlyReviewed && (
          <section className="rounded-lg border border-danger/40 bg-danger/10 p-4">
            <h2 className="text-lg font-semibold text-primary">{text.review}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{text.reviewBody}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {text.reviewContact}{' '}
              <Link href={getLocalizedStaticPath('contact', locale)} className="text-gold underline hover:text-gold-muted">
                {text.reviewContactLink}
              </Link>
              .
            </p>
          </section>
      )}

      <nav className="grid gap-3 sm:grid-cols-2" aria-label={`${title} navigation`}>
        <Link className="btn-secondary" href={getLocalizedNamePath(locale, previous.slug)}>
          {text.previous}: {previous.transliteration[locale]}
        </Link>
        <Link className="btn-primary" href={getLocalizedNamePath(locale, next.slug)}>
          {text.next}: {next.transliteration[locale]}
        </Link>
      </nav>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{text.related}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {related.map((relatedName) => (
            <Link
              key={relatedName.id}
              href={getLocalizedNamePath(locale, relatedName.slug)}
              className="rounded-lg border border-white/10 bg-surface p-4 hover:border-gold/50 focus-ring"
            >
              <span className="block text-right font-arabic text-3xl" lang="ar" dir="rtl">{relatedName.arabic}</span>
              <span className="mt-3 block font-semibold">{relatedName.transliteration[locale]}</span>
              <span className="mt-1 block text-sm text-muted">{relatedName.meanings[locale]}</span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}

function InfoBlock({ title, body, subtle }: { title: string; body: string; subtle?: string }) {
  return (
    <section className={subtle ? 'rounded-lg border border-white/10 bg-surface-soft p-5' : 'rounded-lg border border-white/10 bg-surface p-5'}>
      <h2 className="text-sm uppercase tracking-[0.18em] text-gold">{title}</h2>
      <p className="mt-3 leading-7 text-muted">{body}</p>
      {subtle && <p className="mt-3 text-sm leading-6 text-muted">{subtle}</p>}
    </section>
  )
}
