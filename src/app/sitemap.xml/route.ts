import { generateSitemap } from '@/lib/sitemap'

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>'
const URLSET_OPEN =
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
const URLSET_CLOSE = '</urlset>'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function renderUrl(entry: ReturnType<typeof generateSitemap>[number]): string {
  let xml = `  <url>\n    <loc>${esc(entry.url)}</loc>\n`

  const languages = entry.alternates?.languages
  if (languages) {
    for (const [lang, href] of Object.entries(languages)) {
      xml += `    <xhtml:link rel="alternate" hreflang="${esc(lang)}" href="${esc(String(href))}"/>\n`
    }
  }

  xml += `    <lastmod>${esc(entry.lastModified as string)}</lastmod>\n`
  xml += `    <changefreq>${esc(entry.changeFrequency as string)}</changefreq>\n`
  xml += `    <priority>${entry.priority}</priority>\n`
  xml += `  </url>\n`

  return xml
}

export async function GET() {
  const entries = generateSitemap()

  let xml = `${XML_DECLARATION}\n${URLSET_OPEN}\n`
  for (const entry of entries) {
    xml += renderUrl(entry)
  }
  xml += `${URLSET_CLOSE}\n`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
