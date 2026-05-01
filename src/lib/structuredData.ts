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
      name: name.transliteration,
      item: {
        '@type': 'Thing',
        name: name.transliteration,
        alternateName: name.arabic,
        description: name.meanings[locale],
      },
    })),
  }
}

export function nameLearningResourceJsonLd(name: NameEntry, locale: Language): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name:
      locale === 'de'
        ? `${name.transliteration} Bedeutung`
        : locale === 'tr'
          ? `${name.transliteration} Anlamı`
          : `${name.transliteration} Meaning`,
    headline:
      locale === 'de'
        ? `${name.transliteration} Bedeutung`
        : locale === 'tr'
          ? `${name.transliteration} Anlamı`
          : `${name.transliteration} Meaning`,
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
      name: name.transliteration,
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
