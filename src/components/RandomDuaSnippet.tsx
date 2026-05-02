import { connection } from 'next/server'
import Link from 'next/link'
import { names } from '@/data/names'
import type { Language } from '@/types/language'

const copy = {
  de: {
    eyebrow: 'Dua-Ausschnitt',
    title: 'Ein Name, ein Dua-Hinweis',
    details: 'Zum Namen',
    reload: 'Anderen Dua-Hinweis laden',
    hrefBase: '/de/namen',
  },
  en: {
    eyebrow: 'Dua excerpt',
    title: 'One name, one dua note',
    details: 'Open name',
    reload: 'Load another dua note',
    hrefBase: '/names',
  },
  tr: {
    eyebrow: 'Dua kesiti',
    title: 'Bir isim, bir dua notu',
    details: 'İsme git',
    reload: 'Baska bir dua notu yukle',
    hrefBase: '/tr/esmaul-husna',
  },
} satisfies Record<Language, {
  eyebrow: string
  title: string
  details: string
  reload: string
  hrefBase: string
}>

function getRandomName() {
  return names[Math.floor(Math.random() * names.length)] ?? names[0]
}

export function RandomDuaSnippetFallback({ locale }: { locale: Language }) {
  const text = copy[locale]
  const name = names[0]

  return (
    <section className="max-w-6xl rounded-lg border border-gold/20 bg-surface p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">{text.eyebrow}</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">{text.title}</h2>
          <p className="mt-1 text-sm text-gold">{name.transliteration[locale]} · {name.meanings[locale]}</p>
        </div>
        <p className="text-right font-arabic text-3xl leading-tight text-primary" lang="ar" dir="rtl">{name.arabic}</p>
      </div>
      <p className="mt-4 text-sm leading-7 text-muted">{name.duaUsage[locale]}</p>
    </section>
  )
}

export async function RandomDuaSnippet({ locale }: { locale: Language }) {
  await connection()

  const text = copy[locale]
  const name = getRandomName()
  const refreshNonce = `${name.slug}-${locale}`

  return (
    <section className="max-w-6xl rounded-lg border border-gold/20 bg-surface p-5 md:p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">{text.eyebrow}</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">{text.title}</h2>
          <p className="mt-1 text-sm text-gold">{name.transliteration[locale]} · {name.meanings[locale]}</p>
        </div>
        <p className="text-right font-arabic text-3xl leading-tight text-primary" lang="ar" dir="rtl">{name.arabic}</p>
      </div>
      <p className="mt-4 text-sm leading-7 text-muted">{name.duaUsage[locale]}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Link className="inline-flex rounded text-sm font-semibold text-gold hover:text-gold-soft focus-ring" href={`${text.hrefBase}/${name.slug}`}>
          {text.details}
        </Link>
        <Link
          aria-label={text.reload}
          className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors hover:border-gold hover:text-gold-soft focus-ring"
          href={`?dua=${refreshNonce}`}
          scroll={false}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 ease-out group-hover:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
