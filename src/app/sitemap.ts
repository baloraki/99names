import type { MetadataRoute } from 'next'
import { names } from '@/data/names'
import { nameAlternates, sitemapEntry, staticSitemapPages } from '@/lib/seo'
import type { Language } from '@/types/language'

const NAME_PRIORITY = 0.7
const NAME_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'

const localePathBuilders: Record<Language, (slug: string) => string> = {
  en: (slug) => `/names/${slug}`,
  de: (slug) => `/de/namen/${slug}`,
  tr: (slug) => `/tr/esmaul-husna/${slug}`,
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticSitemapPages.map((page) =>
    sitemapEntry(page.path, {
      priority: page.priority,
      changeFrequency: page.changeFrequency,
      alternates: 'alternates' in page ? page.alternates : undefined,
    }),
  )

  const nameEntries: MetadataRoute.Sitemap = []
  for (const name of names) {
    const alternates = nameAlternates(name.slug)
    for (const locale of ['en', 'de', 'tr'] as const) {
      nameEntries.push(
        sitemapEntry(localePathBuilders[locale](name.slug), {
          priority: NAME_PRIORITY,
          changeFrequency: NAME_CHANGE_FREQUENCY,
          alternates,
        }),
      )
    }
  }

  return [...staticEntries, ...nameEntries]
}
