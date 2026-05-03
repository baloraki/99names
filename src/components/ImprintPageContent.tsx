'use client'

import Link from 'next/link'
import type { Language } from '@/types/language'
import { ObfuscatedEmail } from '@/components/ObfuscatedEmail'
import { getLocalizedStaticPath } from '@/lib/seo'
import { usePathname } from 'next/navigation'

// ─── OPERATOR DATA ────────────────────────────────────────────────────────────
// TODO: Replace ALL values below with real data before going live.
//       Without this the site is not legally compliant in Germany (§ 5 TMG).
const OPERATOR = {
  name: process.env.NEXT_PUBLIC_OPERATOR_NAME ?? 'UNCONFIGURED_OPERATOR_NAME',
  street: process.env.NEXT_PUBLIC_OPERATOR_STREET ?? 'UNCONFIGURED_OPERATOR_STREET',
  city: process.env.NEXT_PUBLIC_OPERATOR_CITY ?? 'UNCONFIGURED_OPERATOR_CITY',
  country: process.env.NEXT_PUBLIC_OPERATOR_COUNTRY ?? 'Schweiz',
}

// ─── EMAIL OBFUSCATION ────────────────────────────────────────────────────────
// Handled by <ObfuscatedEmail /> (see ObfuscatedEmail.tsx)


type Item = string | { label: string; value: string } | { label: string; isEmail: true }

type Content = {
  title: string
  subtitle: string
  sections: { heading: string; items: Item[] }[]
  disclaimer: { heading: string; body: string[] }
  privacyLink: string
}


const content: Record<Language, Content> = {
  de: {
    title: 'Impressum',
    subtitle: 'Angaben gemäß § 5 TMG und § 18 Abs. 2 MStV',
    sections: [
      {
        heading: 'Verantwortlicher',
        items: [
          { label: 'Name', value: OPERATOR.name },
          { label: 'Adresse', value: `${OPERATOR.street}, ${OPERATOR.city}` },
          { label: 'Land', value: OPERATOR.country },
          { label: 'E-Mail', isEmail: true },
        ],
      },
      {
        heading: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
        items: [
          `${OPERATOR.name}, ${OPERATOR.street}, ${OPERATOR.city}`,
        ],
      },
      {
        heading: 'Zweck der Website',
        items: [
          'Bei dieser Website handelt es sich um ein privates, nicht-kommerzielles Bildungsangebot. Ziel ist das Bereitstellen einer Lernhilfe für die 99 Namen Allahs (Asmāʾ Allāh al-Ḥusnā). Es werden keine Produkte oder Dienstleistungen verkauft. Die Inhalte werden ohne Gewähr und ohne Erhebung von Nutzerdaten für Marketingzwecke angeboten.',
        ],
      },
    ],
    disclaimer: {
      heading: 'Haftungshinweise',
      body: [
        'Haftung für Inhalte: Die Inhalte dieser Seite wurden mit größtmöglicher Sorgfalt erstellt. Als Privatperson übernehme ich keine Gewähr für die Aktualität, Richtigkeit und Vollständigkeit der bereitgestellten Informationen. Die religiösen Inhalte basieren auf anerkannten Quellen (Qurʾān, Ḥadīth, Fachwerken) und sind bewusst vorsichtig formuliert; sie stellen keine verbindliche religiöse Auskunft dar.',
        'Haftung für externe Links: Diese Website enthält Verweise auf externe Webangebote Dritter, auf deren Inhalt wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.',
      ],
    },
    privacyLink: 'Zur Datenschutzerklärung',
  },
  en: {
    title: 'Legal Notice',
    subtitle: 'Information pursuant to § 5 TMG and § 18 (2) MStV (German law)',
    sections: [
      {
        heading: 'Operator',
        items: [
          { label: 'Name', value: OPERATOR.name },
          { label: 'Address', value: `${OPERATOR.street}, ${OPERATOR.city}` },
          { label: 'Country', value: OPERATOR.country },
          { label: 'Email', isEmail: true },
        ],
      },
      {
        heading: 'Responsible for content pursuant to § 18 (2) MStV',
        items: [
          `${OPERATOR.name}, ${OPERATOR.street}, ${OPERATOR.city}`,
        ],
      },
      {
        heading: 'Purpose of the website',
        items: [
          'This is a private, non-commercial educational resource. Its purpose is to provide a learning aid for the 99 Names of Allah (Asmāʾ Allāh al-Ḥusnā). No products or services are sold. The content is offered without warranty and without collection of user data for marketing purposes.',
        ],
      },
    ],
    disclaimer: {
      heading: 'Liability notices',
      body: [
        'Liability for content: The content of this site has been prepared with the utmost care. As a private individual, I assume no liability for the accuracy, completeness, or timeliness of the information. The religious content is based on recognised sources (Qurʾān, Ḥadīth, scholarly works) and is intentionally worded with caution; it does not constitute binding religious advice.',
        'Liability for external links: This website contains links to third-party websites over which we have no control. The respective provider or operator is always responsible for the content of linked pages.',
      ],
    },
    privacyLink: 'View privacy policy',
  },
  tr: {
    title: 'Künye',
    subtitle: 'Alman Telemedya Kanunu § 5 TMG ve § 18 Abs. 2 MStV uyarınca bilgiler',
    sections: [
      {
        heading: 'Sorumlu Kişi',
        items: [
          { label: 'Ad Soyad', value: OPERATOR.name },
          { label: 'Adres', value: `${OPERATOR.street}, ${OPERATOR.city}` },
          { label: 'Ülke', value: OPERATOR.country },
          { label: 'E-posta', isEmail: true },
        ],
      },
      {
        heading: '§ 18 Abs. 2 MStV uyarınca içerikten sorumlu kişi',
        items: [
          `${OPERATOR.name}, ${OPERATOR.street}, ${OPERATOR.city}`,
        ],
      },
      {
        heading: 'Web sitesinin amacı',
        items: [
          "Bu web sitesi özel, ticari olmayan bir eğitim kaynağıdır. Amacı Allah'ın 99 İsmi (Esmâ-i Hüsnâ) için bir öğrenme yardımcısı sunmaktır. Herhangi bir ürün veya hizmet satılmamaktadır. İçerikler garanti olmaksızın ve pazarlama amacıyla kullanıcı verisi toplanmaksızın sunulmaktadır.",
        ],
      },
    ],
    disclaimer: {
      heading: 'Sorumluluk sınırlamaları',
      body: [
        "İçerikten sorumluluk: Bu sitenin içeriği büyük özen gösterilerek hazırlanmıştır. Özel bir kişi olarak bilgilerin doğruluğu, eksiksizliği veya güncelliği konusunda sorumluluk üstlenmiyorum. Dini içerikler tanınmış kaynaklara (Kur'an, Hadis, akademik eserler) dayanmakta ve ihtiyatlı şekilde ifade edilmektedir; bağlayıcı dini danışmanlık niteliği taşımaz.",
        'Dış bağlantılar için sorumluluk: Bu web sitesi, içeriği üzerinde kontrolümüzün bulunmadığı üçüncü taraf web sitelerine bağlantılar içermektedir. Bağlantılı sayfaların içeriğinden her zaman ilgili sağlayıcı veya işletici sorumludur.',
      ],
    },
    privacyLink: 'Gizlilik politikasını oku',
  },
}

export function ImprintPageContent() {
  const pathname = usePathname()
  const language: Language = pathname.startsWith('/de') ? 'de' : pathname.startsWith('/tr') ? 'tr' : 'en'
  const c = content[language]

  return (
    <article lang={language} className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold text-primary">{c.title}</h1>
        <p className="text-sm text-muted">{c.subtitle}</p>
      </header>

      {c.sections.map((section) => (
        <section key={section.heading} className="rounded-lg border border-white/10 bg-surface p-5 space-y-3">
          <h2 className="text-xl font-semibold text-primary">{section.heading}</h2>
          <div className="space-y-1 text-muted leading-7">
            {section.items.map((item, i) =>
              typeof item === 'string' ? (
                <p key={i}>{item}</p>
              ) : 'isEmail' in item ? (
                <p key={i}>
                  <span className="font-medium text-primary">{item.label}:</span>{' '}
                  <ObfuscatedEmail />
                </p>
              ) : (
                <p key={i}>
                  <span className="font-medium text-primary">{item.label}:</span>{' '}
                  {item.value}
                </p>
              ),
            )}
          </div>
        </section>
      ))}

      <section className="rounded-lg border border-white/10 bg-surface p-5 space-y-3">
        <h2 className="text-xl font-semibold text-primary">{c.disclaimer.heading}</h2>
        <div className="space-y-3 text-muted leading-7">
          {c.disclaimer.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <p className="text-sm text-muted">
        <Link href={getLocalizedStaticPath('privacy', language)} className="text-gold underline underline-offset-2 hover:text-gold/80">
          {c.privacyLink}
        </Link>
      </p>
    </article>
  )
}

