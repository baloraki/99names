import Link from 'next/link'
import { getDict } from '@/lib/i18n'
import type { Language } from '@/types/language'
import type { NameEntry } from '@/types/name'

type Props = {
  name: NameEntry
  language: Language
  learned?: boolean
  favorite?: boolean
}

export function NameCard({ name, language, learned = false, favorite = false }: Props) {
  const dict = getDict(language)

  return (
    <Link
      href={`/names/${name.slug}`}
      className="group block rounded-lg border border-white/10 bg-surface p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition hover:border-gold/50 hover:bg-surface-soft focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-background"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-gold-muted">#{name.id.toString().padStart(2, '0')}</p>
        <div className="flex gap-2 text-xs">
          {learned && <span className="rounded-full border border-success/30 px-2 py-1 text-success">{dict.common.learned}</span>}
          {favorite && <span className="rounded-full border border-gold/30 px-2 py-1 text-gold">{dict.common.favorite}</span>}
        </div>
      </div>
      <p className="mt-4 text-right font-arabic text-4xl leading-tight text-primary">{name.arabic}</p>
      <h2 className="mt-4 text-xl font-semibold text-primary">{name.transliteration[language]}</h2>
      <p className="mt-1 text-sm text-muted">{name.meanings[language]}</p>
    </Link>
  )
}
