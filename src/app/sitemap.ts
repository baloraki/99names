import type { MetadataRoute } from 'next'
import { names } from '@/data/names'
import { nameAlternates, sitemapEntry, staticSitemapPages } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticSitemapPages.map((page) =>
    sitemapEntry(page.path, {
      priority: page.priority,
      changeFrequency: page.changeFrequency,
      alternates: 'alternates' in page ? page.alternates : undefined,
    }),
  )

  const nameEntries = names.flatMap((name) => [
    sitemapEntry(`/names/${name.slug}`, {
      priority: 0.75,
      changeFrequency: 'monthly',
      alternates: nameAlternates(name.slug),
    }),
    sitemapEntry(`/de/namen/${name.slug}`, {
      priority: 0.7,
      changeFrequency: 'monthly',
      alternates: nameAlternates(name.slug),
    }),
    sitemapEntry(`/tr/esmaul-husna/${name.slug}`, {
      priority: 0.7,
      changeFrequency: 'monthly',
      alternates: nameAlternates(name.slug),
    }),
  ])

  return [...staticEntries, ...nameEntries]
}
