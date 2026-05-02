import type { Metadata } from 'next'
import type { MetadataRoute } from 'next'
import type { Language } from '@/types/language'
import type { NameEntry } from '@/types/name'

export const SITE_NAME = '99 Names'
export const SITE_TAGLINE = 'Learn Asma ul Husna with meaning, dua, and reflection'
export const DEFAULT_OG_IMAGE = '/icon.svg'

const fallbackSiteUrl = 'https://99names.app'

function normalizeSiteUrl(value: string | undefined): string {
  if (!value) return fallbackSiteUrl

  try {
    const url = new URL(value)
    return url.origin
  } catch {
    return fallbackSiteUrl
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL)

export const locales = ['en', 'de', 'tr'] as const

export function absoluteUrl(path = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(normalizedPath, SITE_URL).toString()
}

export function getLocalizedNamePath(locale: Language, slug: string): string {
  if (locale === 'de') return `/de/namen/${slug}`
  if (locale === 'tr') return `/tr/esmaul-husna/${slug}`
  return `/names/${slug}`
}

export function getLocalizedNamesPath(locale: Language): string {
  if (locale === 'de') return '/de/namen'
  if (locale === 'tr') return '/tr/esmaul-husna'
  return '/names'
}

export function getLocalizedHomePath(locale: Language): string {
  if (locale === 'de') return '/de'
  if (locale === 'tr') return '/tr'
  return '/'
}

export function getLocalizedSettingsPath(locale: Language): string {
  if (locale === 'de') return '/de/einstellungen'
  if (locale === 'tr') return '/tr/ayarlar'
  return '/settings'
}

export type LocalizedSeoPage = 'asma' | 'learn' | 'dua' | 'reflections' | 'quiz'

const localizedSeoPaths: Record<LocalizedSeoPage, Record<Language, string>> = {
  asma: {
    en: '/asma-ul-husna',
    de: '/de/asma-ul-husna',
    tr: '/tr/esmaul-husna-nedir',
  },
  learn: {
    en: '/learn',
    de: '/de/lernen',
    tr: '/tr/ogren',
  },
  dua: {
    en: '/dua',
    de: '/de/dua',
    tr: '/tr/dua',
  },
  reflections: {
    en: '/reflections',
    de: '/de/reflexionen',
    tr: '/tr/tefekkur',
  },
  quiz: {
    en: '/quiz',
    de: '/de/quiz',
    tr: '/tr/quiz',
  },
}

export function getLocalizedSeoPath(page: LocalizedSeoPage, locale: Language): string {
  return localizedSeoPaths[page][locale]
}

export function seoPageAlternates(page: LocalizedSeoPage): Record<string, string> {
  return {
    en: localizedSeoPaths[page].en,
    de: localizedSeoPaths[page].de,
    tr: localizedSeoPaths[page].tr,
    'x-default': localizedSeoPaths[page].en,
  }
}

export function getEquivalentLocalizedPath(pathname: string, targetLocale: Language): string {
  if (pathname === '/' || pathname === '/de' || pathname === '/tr') {
    return getLocalizedHomePath(targetLocale)
  }

  if (pathname === '/names' || pathname === '/de/namen' || pathname === '/tr/esmaul-husna') {
    return getLocalizedNamesPath(targetLocale)
  }

  const nameMatch = pathname.match(/^\/names\/([^/]+)$|^\/de\/namen\/([^/]+)$|^\/tr\/esmaul-husna\/([^/]+)$/)
  const nameSlug = nameMatch?.[1] ?? nameMatch?.[2] ?? nameMatch?.[3]
  if (nameSlug) return getLocalizedNamePath(targetLocale, nameSlug)

  if (pathname === '/settings' || pathname === '/de/einstellungen' || pathname === '/tr/ayarlar') {
    return getLocalizedSettingsPath(targetLocale)
  }

  for (const [page, paths] of Object.entries(localizedSeoPaths) as Array<[LocalizedSeoPage, Record<Language, string>]>) {
    if (Object.values(paths).includes(pathname)) {
      return getLocalizedSeoPath(page, targetLocale)
    }
  }

  return pathname
}

export function homeAlternates(): Record<string, string> {
  return {
    en: '/',
    de: '/de',
    tr: '/tr',
    'x-default': '/',
  }
}

export function namesAlternates(): Record<string, string> {
  return {
    en: '/names',
    de: '/de/namen',
    tr: '/tr/esmaul-husna',
    'x-default': '/names',
  }
}

export function nameAlternates(slug: string): Record<string, string> {
  return {
    en: `/names/${slug}`,
    de: `/de/namen/${slug}`,
    tr: `/tr/esmaul-husna/${slug}`,
    'x-default': `/names/${slug}`,
  }
}

export function settingsAlternates(): Record<string, string> {
  return {
    en: '/settings',
    de: '/de/einstellungen',
    tr: '/tr/ayarlar',
    'x-default': '/settings',
  }
}

export function absoluteLanguageAlternates(alternates: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(alternates).map(([language, path]) => [language, absoluteUrl(path)]),
  )
}

function ogLocale(locale: Language): string {
  if (locale === 'de') return 'de_DE'
  if (locale === 'tr') return 'tr_TR'
  return 'en_US'
}

type BuildMetadataInput = {
  title: string
  description: string
  path: string
  locale?: Language
  alternates?: Record<string, string>
  type?: 'website' | 'article'
  imageAlt?: string
  index?: boolean
}

export function buildMetadata({
  title,
  description,
  path,
  locale = 'en',
  alternates,
  type = 'website',
  imageAlt = 'Daily Husna icon for the 99 Names learning aid',
  index = true,
}: BuildMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
      ...(alternates ? { languages: alternates } : {}),
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      type,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: imageAlt,
        },
      ],
    },
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function rootMetadata(locale: Language): Metadata {
  const title =
    locale === 'de'
      ? 'Die 99 Namen Allahs – Bedeutung, Arabisch, Dua & Reflexion'
      : locale === 'tr'
        ? "Allah'ın 99 İsmi – Esmaül Hüsna Anlamları, Dua ve Tefekkür"
        : '99 Names of Allah – Learn Asma ul Husna with Meaning, Dua & Reflection'

  const description =
    locale === 'de'
      ? 'Lerne die 99 Namen Allahs mit Arabisch, Bedeutung, Dua-Hinweisen, Reflexion und quellenbewussten Notizen.'
      : locale === 'tr'
        ? "Allah'ın 99 ismini Arapça, anlam, dua kullanımı, tefekkür ve kaynak bilinciyle öğren."
        : 'Learn the 99 Names of Allah with Arabic, transliteration, meaning, dua usage, reflection and daily learning progress.'

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title,
    description,
    manifest: '/manifest.webmanifest',
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
    formatDetection: {
      telephone: false,
      address: false,
      email: false,
    },
    ...buildMetadata({
      title,
      description,
      path: getLocalizedHomePath(locale),
      locale,
      alternates: homeAlternates(),
    }),
  }
}

export function getNamePageMetadata(name: NameEntry, locale: Language): Metadata {
  const title =
    locale === 'de'
      ? `${name.transliteration} Bedeutung – Einer der schönen Namen Allahs`
      : locale === 'tr'
        ? `${name.transliteration} Anlamı – Esmaül Hüsna`
        : `${name.transliteration} Meaning – One of the Beautiful Names of Allah`

  const description =
    locale === 'de'
      ? `${name.transliteration} bedeutet "${name.meanings.de}". Lies Arabisch, Transliteration, Dua-Hinweise, Reflexion und quellenbewusste Notizen.`
      : locale === 'tr'
        ? `${name.transliteration}, "${name.meanings.tr}" anlamına gelir. Arapça yazımı, dua kullanımı, tefekkür ve kaynak notunu oku.`
        : `${name.transliteration} means "${name.meanings.en}". Read the Arabic, transliteration, dua usage, reflection and source-aware note.`

  return buildMetadata({
    title,
    description,
    path: getLocalizedNamePath(locale, name.slug),
    locale,
    alternates: nameAlternates(name.slug),
    type: 'article',
    imageAlt: `${name.transliteration} meaning in the 99 Names learning aid`,
  })
}

export const staticSitemapPages = [
  { path: '/', priority: 1, changeFrequency: 'weekly', alternates: homeAlternates() },
  { path: '/names', priority: 0.95, changeFrequency: 'weekly', alternates: namesAlternates() },
  { path: '/asma-ul-husna', priority: 0.9, changeFrequency: 'weekly', alternates: seoPageAlternates('asma') },
  { path: '/learn', priority: 0.85, changeFrequency: 'monthly', alternates: seoPageAlternates('learn') },
  { path: '/dua', priority: 0.85, changeFrequency: 'monthly', alternates: seoPageAlternates('dua') },
  { path: '/reflections', priority: 0.8, changeFrequency: 'monthly', alternates: seoPageAlternates('reflections') },
  { path: '/quiz', priority: 0.7, changeFrequency: 'monthly', alternates: seoPageAlternates('quiz') },
  { path: '/de', priority: 0.9, changeFrequency: 'weekly', alternates: homeAlternates() },
  { path: '/de/namen', priority: 0.9, changeFrequency: 'weekly', alternates: namesAlternates() },
  { path: '/de/asma-ul-husna', priority: 0.85, changeFrequency: 'weekly', alternates: seoPageAlternates('asma') },
  { path: '/de/lernen', priority: 0.8, changeFrequency: 'monthly', alternates: seoPageAlternates('learn') },
  { path: '/de/dua', priority: 0.8, changeFrequency: 'monthly', alternates: seoPageAlternates('dua') },
  { path: '/de/reflexionen', priority: 0.75, changeFrequency: 'monthly', alternates: seoPageAlternates('reflections') },
  { path: '/de/quiz', priority: 0.65, changeFrequency: 'monthly', alternates: seoPageAlternates('quiz') },
  { path: '/tr', priority: 0.9, changeFrequency: 'weekly', alternates: homeAlternates() },
  { path: '/tr/esmaul-husna', priority: 0.9, changeFrequency: 'weekly', alternates: namesAlternates() },
  { path: '/tr/esmaul-husna-nedir', priority: 0.85, changeFrequency: 'weekly', alternates: seoPageAlternates('asma') },
  { path: '/tr/ogren', priority: 0.8, changeFrequency: 'monthly', alternates: seoPageAlternates('learn') },
  { path: '/tr/dua', priority: 0.8, changeFrequency: 'monthly', alternates: seoPageAlternates('dua') },
  { path: '/tr/tefekkur', priority: 0.75, changeFrequency: 'monthly', alternates: seoPageAlternates('reflections') },
  { path: '/tr/quiz', priority: 0.65, changeFrequency: 'monthly', alternates: seoPageAlternates('quiz') },
  { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/settings', priority: 0.35, changeFrequency: 'yearly', alternates: settingsAlternates() },
  { path: '/de/einstellungen', priority: 0.35, changeFrequency: 'yearly', alternates: settingsAlternates() },
  { path: '/tr/ayarlar', priority: 0.35, changeFrequency: 'yearly', alternates: settingsAlternates() },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/imprint', priority: 0.25, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/offline', priority: 0.2, changeFrequency: 'yearly' },
] as const satisfies ReadonlyArray<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  alternates?: Record<string, string>
}>

export function sitemapEntry(
  path: string,
  options: {
    priority: number
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    alternates?: Record<string, string>
    lastModified?: string | Date
  },
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: options.lastModified || new Date('2024-01-01'),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    ...(options.alternates
      ? {
          alternates: {
            languages: absoluteLanguageAlternates(options.alternates),
          },
        }
      : {}),
  }
}
