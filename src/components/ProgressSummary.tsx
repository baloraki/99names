import { getProgressPercentage } from '@/lib/progress'
import { getDict } from '@/lib/i18n'
import type { Language } from '@/types/language'
import type { ProgressState } from '@/types/progress'

type Props = {
  progress: ProgressState
  compact?: boolean
  language?: Language
}

export function ProgressSummary({ progress, compact = false, language = 'de' }: Props) {
  const dict = getDict(language)
  const total = 99
  const learned = progress.learnedIds.length
  const percent = getProgressPercentage(progress)

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4" aria-label={dict.progress.title}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{dict.progress.title}</p>
          <p className="text-2xl font-semibold text-primary">{learned} / {total}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold text-gold">{percent}%</p>
          {!compact && <p className="text-sm text-muted">{dict.progress.learned}</p>}
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-gold transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  )
}
