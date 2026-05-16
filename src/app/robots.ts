import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/offline',
        '/contact',
        '/de/kontakt',
        '/tr/iletisim',
        '/privacy',
        '/de/datenschutz',
        '/tr/gizlilik',
        '/settings',
        '/de/einstellungen',
        '/tr/ayarlar',
        '/imprint',
        '/de/impressum',
        '/tr/kunye',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
