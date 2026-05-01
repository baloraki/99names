'use client'

import { useAppState } from '@/hooks/useAppState'
import { getDict } from '@/lib/i18n'

type PageKind = 'privacy' | 'imprint' | 'offline'

export function TranslatedLegalPage({ kind }: { kind: PageKind }) {
  const { language } = useAppState()
  const dict = getDict(language)
  const content = dict[kind]

  return (
    <article className="mx-auto max-w-3xl space-y-4 rounded-lg border border-white/10 bg-surface p-6 leading-7 text-muted">
      <h1 className="text-4xl font-semibold text-primary">{content.title}</h1>
      <p>{content.p1}</p>
      <p>{content.p2}</p>
      {'p3' in content && <p>{content.p3}</p>}
    </article>
  )
}
