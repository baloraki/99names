import type { MetadataRoute } from 'next'
import { absoluteUrl, SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        // Contact
        '/contact',
        '/de/kontakt',
        '/tr/iletisim',
        // Privacy
        '/privacy',
        '/de/datenschutz',
        '/tr/gizlilik',
        // Imprint
        '/imprint',
        '/de/impressum',
        '/tr/kunye',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
