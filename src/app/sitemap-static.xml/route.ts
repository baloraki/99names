import { sitemapEntry, staticSitemapPages } from '@/lib/seo'
import { sitemapToXml, xmlResponse } from '@/lib/sitemapXml'

export function GET() {
  const lastModified = new Date('2024-01-01')

  const entries = staticSitemapPages.map((page) =>
    sitemapEntry(page.path, {
      priority: page.priority,
      changeFrequency: page.changeFrequency,
      alternates: 'alternates' in page ? page.alternates : undefined,
      lastModified,
    }),
  )

  return xmlResponse(sitemapToXml(entries))
}

