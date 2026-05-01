import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { LearningProgressWidget } from '@/components/LearningProgressWidget'
import { names } from '@/data/names'
import { getLocalizedNamePath, getLocalizedNamesPath } from '@/lib/seo'
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/structuredData'
import type { Language } from '@/types/language'

const copy = {
  en: {
    eyebrow: 'Asma ul Husna reference',
    title: '99 Names of Allah with Meaning',
    intro: [
      'The 99 Names of Allah, also known as Asma ul Husna or Al Asma ul Husna, are learned by Muslims as a way to remember Allah through His beautiful names and attributes. This page is designed as a respectful study reference rather than a list of slogans. Each entry keeps the Arabic form visible, gives a readable transliteration, and shows a concise meaning so learners can move from recognition to reflection.',
      'The app uses a common learning order for the 99 names of Allah with meaning, but it does not turn that order into a theological claim about every individual entry. The general concept of Allah having beautiful names, and the report about ninety-nine names, is known in the Islamic tradition. The exact popular list should still be handled with source awareness. For that reason, each detail page keeps the source note accessible and preserves the content review flag from the dataset.',
      'Use this overview to browse all names, open individual pages such as Ar-Rahman meaning or Al-Malik meaning, and connect names with careful dua usage and personal reflection. The content avoids fixed-number promises, guaranteed effects, and invented religious references. When a name is used in dua, the wording is intentionally generic: call upon Allah humbly by His beautiful names and ask for what is good, without presenting formulas as guaranteed rituals.',
    ],
    source: 'Source-aware note: this is a learning aid using a common study sequence. It should be reviewed by qualified people before public religious reliance.',
    breadcrumbs: ['Home', 'Names'],
    open: 'Open meaning',
  },
  de: {
    eyebrow: 'Asma ul Husna Deutsch',
    title: 'Die 99 Namen Allahs mit Bedeutung',
    intro: [
      'Die 99 Namen Allahs werden im Deutschen oft als Allahs schöne Namen oder Asma ul Husna Deutsch gesucht. Diese Seite ist als ruhige Lernübersicht aufgebaut: Jeder Name bleibt mit arabischer Schreibweise, Transliteration und kurzer Bedeutung sichtbar, damit Lernende die Namen Allahs sorgfältig lesen und wiederholen können.',
      'Die App nutzt eine verbreitete Lernreihenfolge, macht daraus aber keine Behauptung, dass jeder einzelne Eintrag dieser Liste unabhängig sahih-bestätigt sei. Der allgemeine Gedanke der schönen Namen Allahs ist im Islam bekannt; die konkrete verbreitete Liste sollte dennoch quellenbewusst behandelt werden. Deshalb bleiben Quellenhinweise und Review-Markierungen in den Detailseiten erhalten.',
      'Nutze die Übersicht für 99 Namen Allahs Bedeutung, tägliches Lernen, Dua-Hinweise und Reflexion. Die Texte vermeiden feste Zahlenversprechen, garantierte Wirkungen und erfundene Quellenangaben. Wenn eine Dua-Nutzung erwähnt wird, bleibt sie allgemein und bittend formuliert.',
    ],
    source: 'Quellenbewusster Hinweis: Diese App ist eine Lernhilfe und ersetzt keine fachkundige religiöse Prüfung.',
    breadcrumbs: ['Start', 'Namen'],
    open: 'Bedeutung öffnen',
  },
  tr: {
    eyebrow: 'Esmaül Hüsna anlamları',
    title: "Allah'ın 99 İsmi ve Anlamları",
    intro: [
      "Allah'ın 99 ismi, Türkçede Esmaül Hüsna veya Esmaül Hüsna anlamları olarak aranır. Bu sayfa saygılı bir öğrenme rehberi olarak hazırlanmıştır: Her isim Arapça yazımı, transliterasyonu ve kısa anlamıyla görünür; böylece öğrenen kişi listeyi hızlıca tarayabilir ve detay sayfalarına geçebilir.",
      'Uygulama yaygın bir öğrenme sıralaması kullanır, fakat her tekil ismin bu listedeki yeri için bağımsız sahihlik iddiasında bulunmaz. Allah’ın güzel isimleri kavramı İslam geleneğinde bilinir; yaygın liste ise kaynak bilinciyle ele alınmalıdır. Bu nedenle detay sayfalarında kaynak notları ve içerik inceleme uyarıları korunur.',
      'Bu sayfayı Esmaül Hüsna öğrenmek, anlamları karşılaştırmak, dua kullanımı ve tefekkür için başlangıç olarak kullanabilirsin. Metinler sabit sayı vaatleri, garanti etkiler ve uydurma kaynak iddiaları içermez. Dua bölümleri genel ve edepli bir çerçevede tutulur.',
    ],
    source: 'Kaynak bilinci notu: Bu uygulama bir öğrenme yardımcısıdır ve uzman dini incelemenin yerine geçmez.',
    breadcrumbs: ['Ana Sayfa', 'İsimler'],
    open: 'Anlamı aç',
  },
} as const

export function NameIndexContent({ locale }: { locale: Language }) {
  const text = copy[locale]
  const listPath = getLocalizedNamesPath(locale)
  const breadcrumbItems = [
    { href: locale === 'en' ? '/' : `/${locale}`, label: text.breadcrumbs[0] },
    { href: listPath, label: text.breadcrumbs[1] },
  ]

  return (
    <div lang={locale} className="space-y-8">
      <JsonLd data={itemListJsonLd(names, locale)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems.map((item) => ({ name: item.label, path: item.href })))} />
      <Breadcrumbs items={breadcrumbItems} />
      <section className="space-y-5">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">{text.eyebrow}</p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">{text.title}</h1>
        <div className="max-w-4xl space-y-4 text-base leading-8 text-muted">
          {text.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <p className="max-w-4xl rounded-lg border border-gold/20 bg-surface p-4 text-sm leading-6 text-muted">
          {text.source}
        </p>
      </section>
      <LearningProgressWidget locale={locale} />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {names.map((name) => (
          <li key={name.id}>
            <Link
              href={getLocalizedNamePath(locale, name.slug)}
              className="group block h-full rounded-lg border border-white/10 bg-surface p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition hover:border-gold/50 hover:bg-surface-soft focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-background"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gold-muted">#{name.id.toString().padStart(2, '0')}</span>
                <span className="text-xs font-semibold text-gold">{text.open}</span>
              </div>
              <span className="mt-4 block text-right font-arabic text-4xl leading-tight text-primary" lang="ar" dir="rtl">
                {name.arabic}
              </span>
              <span className="mt-4 block text-xl font-semibold text-primary">{name.transliteration}</span>
              <span className="mt-1 block text-sm leading-6 text-muted">{name.meanings[locale]}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
