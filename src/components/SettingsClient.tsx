'use client'

import type { ChangeEvent } from 'react'
import { useAppState } from '@/hooks/useAppState'
import { calculateNextDue, isValidInterval } from '@/lib/learningSchedule'
import { LANGUAGES } from '@/lib/i18n'
import type { Language } from '@/types/language'
import type { LearningScheduleSettings } from '@/types/learningSchedule'

export function SettingsClient() {
  const { language, progress, schedule, actions } = useAppState()

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
        <p className="text-sm uppercase tracking-[0.22em] text-gold">Setup</p>
        <h1 className="mt-3 text-4xl font-semibold">Einstellungen</h1>
      </section>
      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <label className="text-sm text-muted" htmlFor="language">Sprache</label>
        <select id="language" className="mt-2 field" value={language} onChange={(event) => actions.setLanguage(event.target.value as Language)}>
          {LANGUAGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </section>
      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Lernplan</h2>
            <p className="mt-1 text-sm text-muted">Nur lokale Hinweise innerhalb der geoeffneten App.</p>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={schedule.enabled}
              onChange={(event) => updateSchedule({ ...schedule, enabled: event.target.checked })}
            />
            Aktiv
          </label>
        </div>
        <label className="mt-5 block text-sm text-muted" htmlFor="interval">Intervall</label>
        <select id="interval" className="mt-2 field" value={schedule.interval} onChange={onIntervalChange}>
          <option value="2h">Alle 2 Stunden</option>
          <option value="6h">Alle 6 Stunden</option>
          <option value="daily">Taeglich</option>
        </select>
        <dl className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
          <div><dt>Letzte Einheit</dt><dd className="text-primary">{schedule.lastCompletedAt ?? 'Noch keine'}</dd></div>
          <div><dt>Naechster Hinweis</dt><dd className="text-primary">{schedule.nextDueAt ?? 'Nicht geplant'}</dd></div>
        </dl>
      </section>
      <section className="rounded-lg border border-white/10 bg-surface p-5">
        <h2 className="text-xl font-semibold">Lokale Daten</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Gelernt: {progress.learnedIds.length}, Favoriten: {progress.favoriteIds.length}, zuletzt angesehen: {progress.lastViewedSlug ?? 'keiner'}.
        </p>
        <button className="btn-danger mt-5" onClick={() => window.confirm('Fortschritt wirklich zuruecksetzen?') && actions.resetProgress()}>
          Fortschritt zuruecksetzen
        </button>
      </section>
      <p className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted">
        Diese App verwendet keine Push-Benachrichtigungen und keine Browser-Benachrichtigungen. Der Lernplan wird nur berechnet und angezeigt, solange die App geoeffnet ist.
      </p>
    </div>
  )
}
