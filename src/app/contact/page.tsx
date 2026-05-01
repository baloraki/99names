import { ContactForm } from '@/components/ContactForm'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.22em] text-gold">Kontakt</p>
        <h1 className="mt-3 text-4xl font-semibold">Nachricht senden</h1>
        <p className="mt-3 leading-7 text-muted">
          Das Formular nutzt Web3Forms im Browser. Ohne konfigurierten Zugriffsschluessel wird das Absenden blockiert.
        </p>
      </section>
      <ContactForm />
    </div>
  )
}
