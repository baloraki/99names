import type { ReactNode } from 'react'

export default function PrivacyPage() {
  return (
    <LegalPage title="Datenschutz">
      <p>Diese App speichert Sprache, Fortschritt, Favoriten, zuletzt angesehene Namen und Lernplan-Einstellungen lokal im Browser ueber localStorage.</p>
      <p>Es werden keine Tracking-Cookies, keine Analytics, keine Push-Benachrichtigungen und keine Browser-Benachrichtigungen verwendet.</p>
      <p>Das Kontaktformular sendet die eingegebenen Daten an Web3Forms. Der oeffentliche Web3Forms-Schluessel ist im Client sichtbar.</p>
    </LegalPage>
  )
}

function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl space-y-4 rounded-lg border border-white/10 bg-surface p-6 leading-7 text-muted">
      <h1 className="text-4xl font-semibold text-primary">{title}</h1>
      {children}
    </article>
  )
}
