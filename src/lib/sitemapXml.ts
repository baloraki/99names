import type { MetadataRoute } from 'next'

function formatDate(date: string | Date | undefined): string {
  if (!date) return new Date('2024-01-01').toISOString().split('T')[0]
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function sitemapToXml(entries: MetadataRoute.Sitemap): string {
  const hasAlternates = entries.some((e) => e.alternates?.languages)
  const ns = hasAlternates
    ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"'
    : ''

  const urls = entries
    .map((entry) => {
      const lines: string[] = [`  <url>`, `    <loc>${escapeXml(entry.url)}</loc>`]

      if (entry.lastModified) {
        lines.push(`    <lastmod>${formatDate(entry.lastModified)}</lastmod>`)
      }
      if (entry.changeFrequency) {
        lines.push(`    <changefreq>${entry.changeFrequency}</changefreq>`)
      }
      if (entry.priority !== undefined) {
        lines.push(`    <priority>${entry.priority}</priority>`)
      }
      if (entry.alternates?.languages) {
        for (const [lang, href] of Object.entries(entry.alternates.languages)) {
          lines.push(
            `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href as string)}"/>`,
          )
        }
      }
      lines.push(`  </url>`)
      return lines.join('\n')
    })
    .join('\n')

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${ns}>\n` +
    urls +
    `\n</urlset>`
  )
}

export function sitemapIndexToXml(sitemapUrls: string[]): string {
  const entries = sitemapUrls
    .map((loc) => `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n  </sitemap>`)
    .join('\n')

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries +
    `\n</sitemapindex>`
  )
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}

