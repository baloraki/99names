'use client'

import type { ChangeEvent } from 'react'
import { useAppState } from '@/hooks/useAppState'
import { calculateNextDue, isValidInterval } from '@/lib/learningSchedule'
import { getDict, LANGUAGES } from '@/lib/i18n'
import type { Language } from '@/types/language'
import type { LearningScheduleSettings } from '@/types/learningSchedule'
import { PushReminderSettings } from './PushReminderSettings'

export function SettingsClient() {
  const { language, progress, schedule, actions } = useAppState()
  const dict = getDict(language)

  function updateSchedule(next: LearningScheduleSettings) {
    actions.setSchedule({
      ...next,
      nextDueAt: next.enabled ? (calculateNextDue(next)?.toISOString()) : undefined,
    })
  }

  function onIntervalChange(event: ChangeEvent<HTMLSelectElement>) {
    const interval = event.target.value
    if (!isValidInterval(interval)) return
    updateSchedule({ ...schedule, interval })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.22em] text-gold">{dict.settings.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold">{dict.settings.title}</h1>
      </section>
      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <label className="text-sm text-muted" htmlFor="language">{dict.settings.language}</label>
        <select id="language" className="mt-2 field" value={language} onChange={(event) => actions.setLanguage(event.target.value as Language)}>
          {LANGUAGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </section>
      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{dict.settings.schedule}</h2>
            <p className="mt-1 text-sm text-muted">{dict.settings.scheduleBody}</p>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={schedule.enabled}
              onChange={(event) => updateSchedule({ ...schedule, enabled: event.target.checked })}
            />
            {dict.settings.active}
          </label>
        </div>
        <label className="mt-5 block text-sm text-muted" htmlFor="interval">{dict.settings.interval}</label>
        <select id="interval" className="mt-2 field" value={schedule.interval} onChange={onIntervalChange}>
          <option value="2h" disabled>{dict.settings.every2h}</option>
          <option value="6h" disabled>{dict.settings.every6h}</option>
          <option value="daily">{dict.settings.daily}</option>
        </select>
        <dl className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
          <div><dt>{dict.settings.lastCompleted}</dt><dd className="text-primary">{schedule.lastCompletedAt ?? dict.common.none}</dd></div>
          <div><dt>{dict.settings.nextDue}</dt><dd className="text-primary">{schedule.nextDueAt ?? dict.common.notPlanned}</dd></div>
        </dl>
      </section>
      <PushReminderSettings />
      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <h2 className="text-xl font-semibold">{dict.settings.localData}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {dict.settings.localDataBody(progress.learnedIds.length, progress.favoriteIds.length, progress.lastViewedSlug ?? dict.common.none)}
        </p>
        <button className="btn-danger mt-5" onClick={() => window.confirm(dict.settings.resetConfirm) && actions.resetProgress()}>
          {dict.settings.resetProgress}
        </button>
      </section>
      <p className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted">
        {dict.settings.notificationNote}
      </p>
    </div>
  )
}
