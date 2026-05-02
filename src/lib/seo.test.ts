import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { names } from '@/data/names'
import {
  absoluteUrl,
  buildMetadata,
  buildOgImagePath,
  getEquivalentLocalizedPath,
  getLocalizedNamePath,
  getLocalizedSeoPath,
  getLocalizedSettingsPath,
  getLocalizedStaticPath,
  getNamePageMetadata,
  nameAlternates,
  seoPageAlternates,
  settingsAlternates,
  staticPageAlternates,
  staticSitemapPages,
} from './seo'
import {
  itemListJsonLd,
  nameLearningResourceJsonLd,
  serializeJsonLd,
} from './structuredData'

describe('SEO route helpers', () => {
  it('creates localized dynamic share image paths', () => {
    expect(buildOgImagePath({ title: 'Ar-Rahman Meaning', locale: 'en' })).toBe(
      '/api/og?title=Ar-Rahman+Meaning&locale=en',
    )
    expect(buildOgImagePath({ title: 'Allah Namen', locale: 'de', subtitle: 'Lerne Schritt fuer Schritt' })).toBe(
      '/api/og?title=Allah+Namen&locale=de&subtitle=Lerne+Schritt+fuer+Schritt',
    )
  })

  it('generates localized name paths from stable slugs', () => {
    expect(getLocalizedNamePath('en', 'ar-rahman')).toBe('/names/ar-rahman')
    expect(getLocalizedNamePath('de', 'ar-rahman')).toBe('/de/namen/ar-rahman')
    expect(getLocalizedNamePath('tr', 'ar-rahman')).toBe('/tr/esmaul-husna/ar-rahman')
  })

  it('generates hreflang alternates for name pages', () => {
    expect(nameAlternates('al-malik')).toEqual({
      en: '/names/al-malik',
      de: '/de/namen/al-malik',
      tr: '/tr/esmaul-husna/al-malik',
      'x-default': '/names/al-malik',
    })
  })

  it('generates localized SEO topic paths and alternates', () => {
    expect(getLocalizedSeoPath('learn', 'en')).toBe('/learn')
    expect(getLocalizedSeoPath('learn', 'de')).toBe('/de/lernen')
    expect(getLocalizedSeoPath('learn', 'tr')).toBe('/tr/ogren')
    expect(seoPageAlternates('asma')).toEqual({
      en: '/asma-ul-husna',
      de: '/de/asma-ul-husna',
      tr: '/tr/esmaul-husna-nedir',
      'x-default': '/asma-ul-husna',
    })
  })

  it('generates localized settings paths and alternates', () => {
    expect(getLocalizedSettingsPath('en')).toBe('/settings')
    expect(getLocalizedSettingsPath('de')).toBe('/de/einstellungen')
    expect(getLocalizedSettingsPath('tr')).toBe('/tr/ayarlar')
    expect(settingsAlternates()).toEqual({
      en: '/settings',
      de: '/de/einstellungen',
      tr: '/tr/ayarlar',
      'x-default': '/settings',
    })
  })

  it('generates localized static page paths and alternates', () => {
    expect(getLocalizedStaticPath('about', 'en')).toBe('/about')
    expect(getLocalizedStaticPath('about', 'de')).toBe('/de/uber-uns')
    expect(getLocalizedStaticPath('about', 'tr')).toBe('/tr/hakkimizda')
    expect(staticPageAlternates('imprint')).toEqual({
      en: '/imprint',
      de: '/de/impressum',
      tr: '/tr/kunye',
      'x-default': '/imprint',
    })
  })

  it('maps current routes to equivalent localized routes', () => {
    expect(getEquivalentLocalizedPath('/names/ar-rahman', 'de')).toBe('/de/namen/ar-rahman')
    expect(getEquivalentLocalizedPath('/de/namen/al-malik', 'tr')).toBe('/tr/esmaul-husna/al-malik')
    expect(getEquivalentLocalizedPath('/tr/esmaul-husna/ar-rahim', 'en')).toBe('/names/ar-rahim')
    expect(getEquivalentLocalizedPath('/de/lernen', 'tr')).toBe('/tr/ogren')
    expect(getEquivalentLocalizedPath('/tr/tefekkur', 'en')).toBe('/reflections')
    expect(getEquivalentLocalizedPath('/settings', 'de')).toBe('/de/einstellungen')
    expect(getEquivalentLocalizedPath('/de/einstellungen', 'tr')).toBe('/tr/ayarlar')
    expect(getEquivalentLocalizedPath('/tr/ayarlar', 'en')).toBe('/settings')
    expect(getEquivalentLocalizedPath('/about', 'de')).toBe('/de/uber-uns')
    expect(getEquivalentLocalizedPath('/de/kontakt', 'tr')).toBe('/tr/iletisim')
    expect(getEquivalentLocalizedPath('/tr/gizlilik', 'en')).toBe('/privacy')
  })
})

describe('name metadata', () => {
  it('builds a canonical title and alternates for English detail pages', () => {
    const metadata = getNamePageMetadata(names[0], 'en')

    expect(metadata.title).toBe(`${names[0].transliteration.en} Meaning – One of the Beautiful Names of Allah`)
    expect(metadata.description).toContain(`${names[0].transliteration.en} means`)
    expect(metadata.alternates?.canonical).toBe('/names/ar-rahman')
    expect(metadata.alternates?.languages).toMatchObject({
      de: '/de/namen/ar-rahman',
      tr: '/tr/esmaul-husna/ar-rahman',
    })
    const ogImages = metadata.openGraph?.images
    const ogImage = Array.isArray(ogImages) ? ogImages[0] : ogImages
    expect(ogImage).toMatchObject({ width: 1200, height: 630 })
    if (typeof ogImage === 'string') throw new Error('expected object image metadata')
    const ogImageUrl = ogImage instanceof URL ? ogImage.toString() : ogImage?.url?.toString() ?? ''
    expect(ogImageUrl).toContain('/api/og?')
    expect(ogImageUrl).toContain('title=Ar-Rahman+Meaning')
    expect(ogImageUrl).toContain('locale=en')
  })

  it('adds locale and alternate locale fields for Open Graph', () => {
    const metadata = buildMetadata({
      title: 'Quiz',
      description: 'Test your daily progress',
      path: '/tr/quiz',
      locale: 'tr',
    })

    expect(metadata.openGraph?.locale).toBe('tr_TR')
    expect(metadata.openGraph?.alternateLocale).toEqual(['en_US', 'de_DE'])
    const twitterImages = metadata.twitter?.images
    const twitterImage = Array.isArray(twitterImages) ? twitterImages[0] : twitterImages
    const twitterImageUrl =
      twitterImage instanceof URL
        ? twitterImage.toString()
        : typeof twitterImage === 'string'
          ? twitterImage
          : twitterImage?.url?.toString() ?? ''
    expect(twitterImageUrl).toContain('/api/og?title=Quiz&locale=tr&subtitle=Test+your+daily+progress')
  })
})

describe('sitemap', () => {
  it('contains all static pages and all localized name detail routes', () => {
    const entries = sitemap()
    const urls = new Set(entries.map((entry) => entry.url))

    expect(entries).toHaveLength(staticSitemapPages.length + names.length * 3)
    for (const page of staticSitemapPages) {
      expect(urls.has(absoluteUrl(page.path))).toBe(true)
    }
    for (const name of names) {
      expect(urls.has(absoluteUrl(`/names/${name.slug}`))).toBe(true)
      expect(urls.has(absoluteUrl(`/de/namen/${name.slug}`))).toBe(true)
      expect(urls.has(absoluteUrl(`/tr/esmaul-husna/${name.slug}`))).toBe(true)
    }
  })
})

describe('structured data', () => {
  it('serializes ItemList JSON-LD with all 99 names', () => {
    const serialized = serializeJsonLd(itemListJsonLd(names, 'en'))
    const parsed = JSON.parse(serialized)

    expect(parsed['@type']).toBe('ItemList')
    expect(parsed.numberOfItems).toBe(99)
    expect(parsed.itemListElement).toHaveLength(99)
    expect(serialized).not.toContain('undefined')
    expect(serialized).not.toContain(':null')
  })

  it('serializes LearningResource JSON-LD without undefined or null garbage', () => {
    const serialized = serializeJsonLd(nameLearningResourceJsonLd(names[0], 'en'))
    const parsed = JSON.parse(serialized)

    expect(parsed['@type']).toBe('LearningResource')
    expect(parsed.name).toBe(`${names[0].transliteration.en} Meaning`)
    expect(parsed.mainEntityOfPage).toBe(absoluteUrl('/names/ar-rahman'))
    expect(serialized).not.toContain('undefined')
    expect(serialized).not.toContain(':null')
  })
})
