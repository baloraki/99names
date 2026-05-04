"use client"

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { LearningProgressWidget } from '@/components/LearningProgressWidget'
import { names } from '@/data/names'
import { useDebounce } from '@/hooks/useDebounce'
import { getLocalizedNamePath, getLocalizedNamesPath } from '@/lib/seo'
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/structuredData'
import type { Language } from '@/types/language'
import type { NameEntry } from '@/types/name'

function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[-'`'\s]/g, '')
    .toLowerCase()
}

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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') ?? ''
  const [searchTerm, setSearchTerm] = useState(urlSearch)
  // Tracks the last URL search value seen so we can detect external URL changes
  // (back/forward navigation) vs. changes we caused via router.replace.
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch)

  // Derived-state pattern (React-recommended alternative to setState-in-effect):
  // When the URL search param changes, decide whether to sync it into the input.
  // - If it matches what the input already contains (trimmed), the change was caused
  //   by our own router.replace call → skip to avoid a cascade.
  // - Otherwise it's an external navigation (back/forward) → update the input.
  if (prevUrlSearch !== urlSearch) {
    setPrevUrlSearch(urlSearch)
    if (urlSearch !== searchTerm.trim()) {
      setSearchTerm(urlSearch)
    }
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const text = copy[locale]
  const listPath = getLocalizedNamesPath(locale)
  const breadcrumbItems = [
    { href: locale === 'en' ? '/' : `/${locale}`, label: text.breadcrumbs[0] },
    { href: listPath, label: text.breadcrumbs[1] },
  ]

  // Push the debounced search term to the URL, but only when it actually differs.
  useEffect(() => {
    const trimmed = debouncedSearchTerm.trim()
    if (trimmed === urlSearch) return
    const params = new URLSearchParams(searchParams.toString())
    if (trimmed) {
      params.set('search', trimmed)
    } else {
      params.delete('search')
    }
    const nextQuery = params.toString()
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
    router.replace(nextUrl, { scroll: false })
  }, [debouncedSearchTerm, pathname, router, searchParams, urlSearch])

  const normalizedNames = useMemo(
    () => names.map((name) => ({
      ...name,
      _normalized: {
        arabic: normalizeForSearch(name.arabic),
        transliteration: {
          en: normalizeForSearch(name.transliteration.en),
          de: normalizeForSearch(name.transliteration.de),
          tr: normalizeForSearch(name.transliteration.tr),
        },
        meanings: {
          en: normalizeForSearch(name.meanings.en),
          de: normalizeForSearch(name.meanings.de),
          tr: normalizeForSearch(name.meanings.tr),
        },
      },
    })),
    [],
  )

  const filteredNames: NameEntry[] = useMemo(() => {
    const query = normalizeForSearch(debouncedSearchTerm)
    if (!query) return names

    return normalizedNames
      .filter((name) =>
        name._normalized.arabic.includes(query)
        || name._normalized.transliteration[locale].includes(query)
        || name._normalized.meanings[locale].includes(query))
      .map(({ _normalized: _, ...name }) => name)
  }, [debouncedSearchTerm, locale, normalizedNames])

  return (
    <div lang={locale} className="space-y-8">
      <JsonLd data={itemListJsonLd(filteredNames, locale)} />
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
      <section className="space-y-4">
        <div className="sticky top-[4.25rem] z-20 rounded-lg border border-white/10 bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:top-[4.5rem]">
          <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-surface px-3 py-2">
            <span aria-hidden="true" className="text-gold-muted">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={locale === 'de' ? 'Namen suchen …' : locale === 'tr' ? 'İsim ara…' : 'Search names…'}
              className="w-full bg-transparent text-base text-primary outline-none placeholder:text-muted"
              aria-label={locale === 'de' ? 'Namen durchsuchen' : locale === 'tr' ? 'İsimlerde ara' : 'Search names'}
            />
            {searchTerm.trim().length > 0 ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="rounded-md p-1 text-muted transition hover:bg-white/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label={locale === 'de' ? 'Suche löschen' : locale === 'tr' ? 'Aramayı temizle' : 'Clear search'}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        {filteredNames.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-surface p-6 text-sm text-muted">
            {locale === 'de' ? 'Keine Namen gefunden für' : locale === 'tr' ? 'İsim bulunamadı:' : 'No names found for'} &quot;{debouncedSearchTerm}&quot;.
          </div>
        ) : null}
      </section>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNames.map((name) => (
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
              <span className="mt-4 block text-xl font-semibold text-primary">{name.transliteration[locale]}</span>
              <span className="mt-1 block text-sm leading-6 text-muted">{name.meanings[locale]}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
