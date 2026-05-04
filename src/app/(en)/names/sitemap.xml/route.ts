import { names } from '@/data/names'
import { nameAlternates, sitemapEntry } from '@/lib/seo'
import { sitemapToXml, xmlResponse } from '@/lib/sitemapXml'

export const dynamic = 'force-static'

export function GET() {
  const lastModified = new Date('2024-01-01')

  const entries = names.map((name) =>
    sitemapEntry(`/names/${name.slug}`, {
      priority: 0.75,
      changeFrequency: 'monthly',
      alternates: nameAlternates(name.slug),
      lastModified,
    }),
  )

  return xmlResponse(sitemapToXml(entries))
}
