import type { Language } from '@/types/language'
import type { MetadataRoute } from 'next'
import { names } from '@/data/names'
import {
  absoluteLanguageAlternates,
  absoluteUrl,
  nameAlternates,
  staticSitemapPages,
} from './seo'

const NAME_PRIORITY = 0.7
const NAME_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'

const localePathBuilders: Record<Language, (slug: string) => string> = {
  en: (slug) => `/names/${slug}`,
  de: (slug) => `/de/namen/${slug}`,
  tr: (slug) => `/tr/esmaul-husna/${slug}`,
}

export function generateSitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticSitemapPages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    ...('alternates' in page && page.alternates
      ? {
          alternates: {
            languages: absoluteLanguageAlternates(page.alternates),
          },
        }
      : {}),
  }))

  const nameEntries: MetadataRoute.Sitemap = []
  for (const name of names) {
    const alternates = nameAlternates(name.slug)
    const absAlternates = absoluteLanguageAlternates(alternates)
    for (const locale of ['en', 'de', 'tr'] as const) {
      nameEntries.push({
        url: absoluteUrl(localePathBuilders[locale](name.slug)),
        lastModified: new Date().toISOString(),
        changeFrequency: NAME_CHANGE_FREQUENCY,
        priority: NAME_PRIORITY,
        alternates: { languages: absAlternates },
      })
    }
  }

  return [...staticEntries, ...nameEntries]
}
