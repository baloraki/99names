import { SITE_URL } from '@/lib/seo'
import { sitemapIndexToXml, xmlResponse } from '@/lib/sitemapXml'

const SUB_SITEMAPS = [
  '/sitemap-static.xml',
  '/names/sitemap.xml',
  '/de/namen/sitemap.xml',
  '/tr/esmaul-husna/sitemap.xml',
]

export function GET() {
  const xml = sitemapIndexToXml(SUB_SITEMAPS.map((path) => `${SITE_URL}${path}`))
  return xmlResponse(xml)
}

