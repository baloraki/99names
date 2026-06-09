import type { MetadataRoute } from 'next'
import { names } from '@/data/names'
import { nameAlternates, sitemapEntry, staticSitemapPages } from '@/lib/seo'
import type { Language } from '@/types/language'

const NAME_PRIORITY = 0.7
const NAME_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'
const NAMES_PER_SITEMAP = 33

const localePathBuilders: Record<Language, (slug: string) => string> = {
  en: (slug) => `/names/${slug}`,
  de: (slug) => `/de/namen/${slug}`,
  tr: (slug) => `/tr/esmaul-husna/${slug}`,
}

// Use numeric IDs — Next.js 16 generates file names from the ID
// and some versions call .replace() on it (string IDs like 'static'
// work in principle but can hit edge cases in built-in serialization).
export function generateSitemaps() {
  const nameBatchCount = Math.ceil(names.length / NAMES_PER_SITEMAP)
  // id: 0 = static pages, id: 1..N = name batches
  return Array.from({ length: 1 + nameBatchCount }, (_, i) => ({ id: i }))
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  if (id === 0) {
    return staticSitemapPages.map((page) =>
      sitemapEntry(page.path, {
        priority: page.priority,
        changeFrequency: page.changeFrequency,
        alternates: 'alternates' in page ? page.alternates : undefined,
      }),
    )
  }

  const batchIndex = id - 1
  const start = batchIndex * NAMES_PER_SITEMAP
  const batch = names.slice(start, start + NAMES_PER_SITEMAP)

  const entries: MetadataRoute.Sitemap = []
  for (const name of batch) {
    const alternates = nameAlternates(name.slug)
    for (const locale of ['en', 'de', 'tr'] as const) {
      entries.push(
        sitemapEntry(localePathBuilders[locale](name.slug), {
          priority: NAME_PRIORITY,
          changeFrequency: NAME_CHANGE_FREQUENCY,
          alternates,
        }),
      )
    }
  }

  return entries
}
