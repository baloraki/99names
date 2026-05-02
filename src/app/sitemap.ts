import type { MetadataRoute } from 'next'
import { names } from '@/data/names'
import { nameAlternates, sitemapEntry, staticSitemapPages } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  // Verwende ein festes Datum für bessere Cache-Stabilität
  const lastModified = new Date('2024-01-01').toISOString()

  const staticEntries = staticSitemapPages.map((page) =>
    sitemapEntry(page.path, {
      priority: page.priority,
      changeFrequency: page.changeFrequency,
      alternates: 'alternates' in page ? page.alternates : undefined,
      lastModified,
    }),
  )

  const nameEntries = names.flatMap((name) => [
    sitemapEntry(`/names/${name.slug}`, {
      priority: 0.75,
      changeFrequency: 'monthly',
      alternates: nameAlternates(name.slug),
      lastModified,
    }),
    sitemapEntry(`/de/namen/${name.slug}`, {
      priority: 0.7,
      changeFrequency: 'monthly',
      alternates: nameAlternates(name.slug),
      lastModified,
    }),
    sitemapEntry(`/tr/esmaul-husna/${name.slug}`, {
      priority: 0.7,
      changeFrequency: 'monthly',
      alternates: nameAlternates(name.slug),
      lastModified,
    }),
  ])

  return [...staticEntries, ...nameEntries]
}
