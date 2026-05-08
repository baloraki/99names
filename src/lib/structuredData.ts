import type { Language } from '@/types/language'
import type { NameEntry } from '@/types/name'
import { absoluteUrl, getLocalizedNamePath, getLocalizedNamesPath, SITE_NAME } from './seo'

type JsonLdPrimitive = string | number | boolean | null
export type JsonLdValue = JsonLdPrimitive | JsonLdValue[] | { [key: string]: JsonLdValue | undefined }

export function cleanJsonLd<T extends JsonLdValue>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanJsonLd(item))
      .filter((item) => item !== null && item !== undefined) as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null)
        .map(([key, entryValue]) => [key, cleanJsonLd(entryValue as JsonLdValue)]),
    ) as T
  }

  return value
}

export function serializeJsonLd(value: JsonLdValue): string {
  return JSON.stringify(cleanJsonLd(value)).replace(/</g, '\\u003c')
}

export function websiteJsonLd(): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ['99 Names of Allah', 'Asma ul Husna', 'Al Asma ul Husna'],
    url: absoluteUrl('/'),
    inLanguage: ['en', 'de', 'tr'],
  }
}

export function organizationJsonLd(): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `${SITE_NAME} Learning Aid`,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/logo.svg'),
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function itemListJsonLd(names: NameEntry[], locale: Language): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name:
      locale === 'de'
        ? 'Die 99 Namen Allahs mit Bedeutung'
        : locale === 'tr'
          ? "Allah'ın 99 İsmi ve Anlamları"
          : '99 Names of Allah with meaning',
    numberOfItems: names.length,
    inLanguage: locale,
    itemListElement: names.map((name) => ({
      '@type': 'ListItem',
      position: name.id,
      url: absoluteUrl(getLocalizedNamePath(locale, name.slug)),
      name: name.transliteration[locale],
      item: {
        '@type': 'Thing',
        name: name.transliteration[locale],
        alternateName: name.arabic,
        description: name.meanings[locale],
      },
    })),
  }
}

export type FaqItem = { question: string; answer: string }

const homeFaqByLocale: Record<Language, FaqItem[]> = {
  en: [
    {
      question: 'What are the 99 Names of Allah?',
      answer:
        'The 99 Names of Allah, known as Asma ul Husna, are the beautiful names by which Muslims remember Allah and reflect on His attributes. The report that Allah has ninety-nine names is authentically known; the exact common list of individual names is treated here with source awareness.',
    },
    {
      question: 'Are all 99 names individually authenticated as sahih?',
      answer:
        'Not necessarily. This learning aid keeps every dataset source note visible and avoids claiming independent sahih confirmation for every individual entry of the common list. Entries marked for review should be checked by qualified people before public religious reliance.',
    },
    {
      question: 'How can I learn the 99 Names of Allah daily?',
      answer:
        'Use the learning mode to study the Arabic spelling, transliteration, meaning, dua usage and reflection for one or a few names per day. Local progress, favorites and optional reminders help keep a steady rhythm without exaggerated promises.',
    },
  ],
  de: [
    {
      question: 'Was sind die 99 Namen Allahs?',
      answer:
        'Die 99 Namen Allahs (Asma ul Husna) sind die schönen Namen, mit denen Muslime Allahs gedenken und über seine Eigenschaften nachdenken. Dass Allah 99 Namen hat, ist authentisch überliefert; die konkrete verbreitete Liste wird hier quellenbewusst behandelt.',
    },
    {
      question: 'Sind alle 99 Namen einzeln als sahih bestätigt?',
      answer:
        'Nicht zwingend. Diese Lernhilfe hält jeden Quellenhinweis aus dem Datensatz sichtbar und behauptet für die verbreitete Liste keine eigenständige sahih-Bestätigung jeder Einzelposition. Mit Review markierte Einträge sollten vor öffentlicher religiöser Verwendung fachkundig geprüft werden.',
    },
    {
      question: 'Wie kann ich die 99 Namen Allahs täglich lernen?',
      answer:
        'Im Lernmodus lernst du täglich einen oder wenige Namen mit Arabisch, Transliteration, Bedeutung, Dua-Hinweis und Reflexion. Lokaler Fortschritt, Favoriten und optionale Erinnerungen halten den Rhythmus ohne übertriebene Versprechen.',
    },
  ],
  tr: [
    {
      question: 'Esmaül Hüsna nedir?',
      answer:
        "Esmaül Hüsna, Allah'ın güzel isimleridir; Müslümanlar bu isimlerle Allah'ı anar ve sıfatları üzerine tefekkür eder. Allah'ın 99 ismi olduğuna dair haber sahih bilinir; yaygın olarak öğretilen liste burada kaynak bilinciyle ele alınır.",
    },
    {
      question: 'Listedeki 99 ismin tamamı tek tek sahih kabul edilir mi?',
      answer:
        'Zorunlu değil. Bu öğrenme yardımcısı veri setindeki kaynak notlarını görünür tutar ve yaygın listenin her kalemi için bağımsız sahih onayı iddia etmez. İnceleme için işaretli kayıtlar, kamuya açık dini kullanımdan önce ehil kişilerce gözden geçirilmelidir.',
    },
    {
      question: "Allah'ın 99 ismini günlük olarak nasıl öğrenebilirim?",
      answer:
        'Öğrenme modunda her gün bir veya birkaç ismi Arapçası, transliterasyonu, anlamı, dua kullanımı ve tefekkürüyle çalış. Yerel ilerleme, favoriler ve isteğe bağlı hatırlatmalar abartılı vaatlere girmeden düzenli bir ritim oluşturur.',
    },
  ],
}

export function homeFaqJsonLd(locale: Language): JsonLdValue {
  return faqPageJsonLd(homeFaqByLocale[locale], locale)
}

export function faqPageJsonLd(items: FaqItem[], locale: Language): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function nameFaqJsonLd(name: NameEntry, locale: Language): JsonLdValue {
  const transliteration = name.transliteration[locale]
  const meaning = name.meanings[locale]
  const explanation = name.explanations[locale]
  const dua = name.duaUsage[locale]
  const sourceAnswerByLocale: Record<Language, string> = {
    en: 'No. The app keeps the dataset source note visible and treats the common learning list with source awareness rather than asserting individual sahih confirmation for each entry.',
    de: 'Nein. Die App hält den Quellenhinweis sichtbar und behandelt die verbreitete Lernliste quellenbewusst, ohne für jeden Eintrag eine eigenständige sahih-Bestätigung zu behaupten.',
    tr: 'Hayır. Uygulama kaynak notunu görünür tutar ve yaygın öğrenme listesini, her kayıt için ayrı sahih onayı iddia etmeden kaynak bilinciyle ele alır.',
  }
  const questionsByLocale: Record<Language, [string, string, string]> = {
    en: [
      `What does ${transliteration} mean?`,
      `How can I call upon Allah with ${transliteration} in dua?`,
      `Is ${transliteration} individually claimed as sahih-confirmed here?`,
    ],
    de: [
      `Was bedeutet ${transliteration}?`,
      `Wie kann ich Allah mit ${transliteration} im Dua anrufen?`,
      `Wird ${transliteration} hier einzeln als sahih-bestätigt behauptet?`,
    ],
    tr: [
      `${transliteration} ne anlama gelir?`,
      `${transliteration} ile Allah'a nasıl dua edebilirim?`,
      `${transliteration} burada tekil olarak sahih kabul edildiği iddiasıyla mı sunuluyor?`,
    ],
  }
  const [qMeaning, qDua, qSource] = questionsByLocale[locale]
  const meaningAnswerByLocale: Record<Language, string> = {
    en: `${transliteration} means "${meaning}". ${explanation}`,
    de: `${transliteration} bedeutet "${meaning}". ${explanation}`,
    tr: `${transliteration} "${meaning}" anlamına gelir. ${explanation}`,
  }

  return faqPageJsonLd(
    [
      { question: qMeaning, answer: meaningAnswerByLocale[locale] },
      { question: qDua, answer: dua },
      { question: qSource, answer: sourceAnswerByLocale[locale] },
    ],
    locale,
  )
}

export function nameLearningResourceJsonLd(name: NameEntry, locale: Language): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name:
      locale === 'de'
          ? `${name.transliteration[locale]} Bedeutung`
        : locale === 'tr'
          ? `${name.transliteration[locale]} Anlamı`
          : `${name.transliteration[locale]} Meaning`,
    headline:
      locale === 'de'
          ? `${name.transliteration[locale]} Bedeutung`
        : locale === 'tr'
          ? `${name.transliteration[locale]} Anlamı`
          : `${name.transliteration[locale]} Meaning`,
    description: name.explanations[locale],
    inLanguage: locale,
    url: absoluteUrl(getLocalizedNamePath(locale, name.slug)),
    position: name.id,
    isPartOf: {
      '@type': 'ItemList',
      name:
        locale === 'de'
          ? 'Die 99 Namen Allahs'
          : locale === 'tr'
            ? "Allah'ın 99 İsmi"
            : '99 Names of Allah',
      url: absoluteUrl(getLocalizedNamesPath(locale)),
    },
    about: {
      '@type': 'Thing',
      name: name.transliteration[locale],
      alternateName: name.arabic,
      description: name.meanings[locale],
    },
    provider: {
      '@type': 'Organization',
      name: `${SITE_NAME} Learning Aid`,
      url: absoluteUrl('/'),
    },
    mainEntityOfPage: absoluteUrl(getLocalizedNamePath(locale, name.slug)),
  }
}
