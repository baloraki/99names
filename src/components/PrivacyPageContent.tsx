'use client'

import Link from 'next/link'
import type { Language } from '@/types/language'
import { ObfuscatedEmail } from '@/components/ObfuscatedEmail'
import { getLocalizedStaticPath } from '@/lib/seo'
import { usePathname } from 'next/navigation'

// Validates environment variables at runtime for client components
function assertEnv(name: string): string {
  const value = process.env[name]
  return value || "-"
}

// E-Mail is intentionally NOT stored here → see <ObfuscatedEmail />

// A paragraph is either plain text OR a sentence that contains the e-mail
// address split into a prefix and a suffix around the <ObfuscatedEmail />.
type Paragraph = string | { before: string; isEmail: true; after: string }

type PolicyContent = {
  title: string
  lastUpdated: string
  sections: (operatorName: string, operatorAddress: string, supabaseRegion: string) => { heading: string; paragraphs: Paragraph[] }[]
}

function getOperatorAddress(): string {
  const street = process.env.NEXT_PUBLIC_OPERATOR_STREET?.trim() ?? ''
  const city = process.env.NEXT_PUBLIC_OPERATOR_CITY?.trim() ?? ''
  const country = process.env.NEXT_PUBLIC_OPERATOR_COUNTRY?.trim() ?? ''

  const parts = [street, city, country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : '-'
}

const content: Record<Language, PolicyContent> = {
  de: {
    title: 'Datenschutzerklärung',
    lastUpdated: 'Stand: Mai 2026',
    sections: (operatorName, operatorAddress, supabaseRegion) => [
      {
        heading: '1. Verantwortlicher',
        paragraphs: [
          `Verantwortlich für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) und des schweizerischen DSG (revDSG) ist: ${operatorName}, ${operatorAddress}.`,
          { before: 'E-Mail: ', isEmail: true, after: '' },
        ],
      },
      {
        heading: '2. Grundsätze der Datenverarbeitung',
        paragraphs: [
          'Diese Website ist ein privates, nicht-kommerzielles Bildungsangebot. Wir verarbeiten personenbezogene Daten nur, soweit es für den Betrieb der Website technisch erforderlich ist, Sie eine Funktion ausdrücklich nutzen oder eine gesetzliche Grundlage die Verarbeitung erlaubt. Es findet kein Profiling, kein Verkauf von Daten und kein zielgerichtetes Werbungs-Tracking statt.',
        ],
      },
      {
        heading: '3. Lokaler Browserspeicher (localStorage)',
        paragraphs: [
          'Diese App speichert folgende Daten lokal im Browserspeicher (localStorage) Ihres Geräts: Lernfortschritt (welche Namen als gelernt markiert wurden), Favoritenliste, zuletzt angesehene Namen, den lokalen Status optionaler Push-Erinnerungen sowie die Spracheinstellung unter dem Schlüssel app:v1:language (siehe Abschnitt 8).',
          'Diese lokalen Daten verlassen Ihr Gerät nicht. Sie können diese Daten jederzeit selbst löschen – über die Einstellungsseite der App oder direkt in Ihren Browsereinstellungen.',
          'Die Nutzung des lokalen Browserspeichers erfolgt ausschliesslich zur Bereitstellung der von Ihnen gewünschten App-Funktionen. Es findet keine Nutzung zu Werbe-, Tracking- oder Profilingzwecken statt.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung einer funktionsfähigen Anwendung).',
        ],
      },
      {
        heading: '4. Push-Benachrichtigungen',
        paragraphs: [
          'Wenn Sie Push-Erinnerungen ausdrücklich aktivieren, speichern wir den Browser-Push-Endpunkt, technische Push-Schlüssel, das gewählte Erinnerungsintervall, die Zeitzone, den User-Agent, Versandzeitpunkte, Fehlerstatus und technische Zustellprotokolle in Supabase.',
          'Diese Daten werden ausschliesslich verwendet, um die von Ihnen gewünschten Lern-Erinnerungen zuzustellen, fehlerhafte Abonnements zu erkennen und ungültige Push-Abonnements zu deaktivieren. Da diese Website religiöse Lerninhalte betrifft, können aktivierte Push-Erinnerungen Rückschlüsse auf ein religiöses Interesse zulassen. Durch das bewusste Aktivieren der Push-Erinnerungen willigen Sie ausdrücklich in die Verarbeitung dieser Daten ein, einschliesslich solcher, die Rückschlüsse auf Ihre religiöse Überzeugung zulassen können. Push-Erinnerungen sind vollständig freiwillig, werden nur nach ausdrücklicher Aktivierung eingerichtet, nicht zur Profilbildung genutzt und nicht mit einem Benutzerkonto verknüpft.',
          'Je nach Browser und Betriebssystem wird die technische Zustellung der Push-Benachrichtigung über Push-Dienste des jeweiligen Browser- oder Betriebssystem-Anbieters abgewickelt, z. B. durch Apple, Google, Mozilla oder Microsoft.',
          'Sie können Push-Benachrichtigungen jederzeit in der App oder in den Browser- bzw. Geräteeinstellungen deaktivieren. Beim Deaktivieren wird das Push-Abonnement serverseitig deaktiviert, soweit dies technisch möglich ist.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO für die Einwilligung in die Aktivierung der Push-Erinnerungen. Da Religionszugehörigkeit oder religiöses Interesse eine besondere Kategorie personenbezogener Daten nach Art. 9 DSGVO darstellt, gilt ergänzend Art. 9 Abs. 2 lit. a DSGVO (ausdrückliche Einwilligung). Die Einwilligung erteilen Sie durch das aktive Aktivieren der Push-Funktion. Für den sicheren technischen Betrieb, die Fehlerbehandlung und die Deaktivierung ungültiger Abonnements gilt Art. 6 Abs. 1 lit. f DSGVO.',
        ],
      },
      {
        heading: '5. Supabase',
        paragraphs: [
          'Zur Speicherung optionaler Push-Abonnements verwenden wir Supabase, einen Dienst der Supabase Inc. Supabase stellt die technische Datenbank-Infrastruktur bereit.',
          'Gespeichert werden nur die für Push-Erinnerungen erforderlichen technischen Daten, insbesondere Push-Endpunkt, Push-Schlüssel, Erinnerungsintervall, Zeitzone, technische Zustellinformationen und Fehlerstatus.',
          `Mit Supabase wird, soweit gesetzlich erforderlich, ein Auftragsverarbeitungsvertrag abgeschlossen. Die Supabase-Projektregion ist: ${supabaseRegion}. Soweit Daten in Drittländer übermittelt werden, erfolgt dies nach den jeweils anwendbaren Datenschutzgarantien.`,
          'Die gespeicherten Push-Daten werden gelöscht oder deaktiviert, wenn Sie Push-Benachrichtigungen deaktivieren, das Abonnement ungültig wird oder die Speicherung für den genannten Zweck nicht mehr erforderlich ist.',
        ],
      },
      {
        heading: '6. Vercel Analytics & Speed Insights',
        paragraphs: [
          'Diese Website verwendet Vercel Analytics und Vercel Speed Insights, Dienste der Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.',
          'Vercel Analytics erfasst nach Anbieterangaben cookielose, datensparsame Nutzungsdaten, z. B. aufgerufene Seiten, ungefähre geografische Region, Gerätetyp und Herkunft des Besuchs. Vercel Speed Insights misst Seitenlade-Performance und technische Leistungswerte.',
          'Die dabei erhobenen Daten werden nach Anbieterangaben anonymisiert bzw. aggregiert verarbeitet. Es werden keine Cookies gesetzt und keine personenbezogenen Identifikatoren für werbliches Tracking verwendet. Einzelne Personen sind anhand der erfassten Daten nicht identifizierbar.',
          'Da Vercel Inc. in den USA ansässig ist, können Daten in die USA übermittelt werden. Vercel ist unter dem EU-U.S. Data Privacy Framework zertifiziert, sodass ein angemessenes Datenschutzniveau gewährleistet ist.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Optimierung der Website und Erkennung technischer Fehler). Ein Einwilligungs-Banner ist aufgrund der anonymisierten, cookiefreien Verarbeitung nicht erforderlich. Sie können der Verarbeitung widersprechen, indem Sie Ihren Browser so konfigurieren, dass JavaScript von vercel.com/insights blockiert wird.',
          'Weitere Informationen: https://vercel.com/legal/privacy-policy',
        ],
      },
      {
        heading: '7. Kontaktformular (Web3Forms)',
        paragraphs: [
          'Wenn Sie das Kontaktformular nutzen, werden Name, E-Mail-Adresse und Ihre Nachricht über den Dienst Web3Forms (https://web3forms.com) an unsere E-Mail-Adresse übermittelt.',
          'Web3Forms speichert Formular-Einsendungen nach eigenen Angaben 30 Tage (Free-Plan) bzw. 1 Jahr (Pro-Plan), bevor sie automatisch gelöscht werden. Die Server von Web3Forms befinden sich nach eigenen Angaben in der Region US-East (USA). Da für die USA kein Angemessenheitsbeschluss der EU-Kommission besteht und Web3Forms nicht unter dem EU-U.S. Data Privacy Framework zertifiziert ist, stellt dies eine Drittlandübermittlung ohne gleichwertiges Schutzniveau dar. Hinweis auf mögliche Risiken: US-Behörden können unter bestimmten Voraussetzungen (z. B. nach FISA 702) auf bei US-Anbietern gespeicherte Daten zugreifen.',
          'Web3Forms kann zur Spam-Abwehr Sub-Prozessoren wie CleanTalk und/oder Akismet einsetzen, sofern diese im verwendeten Plan aktiviert sind. In diesem Fall können IP-Adresse und E-Mail-Adresse an diese Dienste übermittelt werden. Mit Web3Forms wurde bislang kein Auftragsverarbeitungsvertrag (AVV) abgeschlossen.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit Art. 49 Abs. 1 lit. a DSGVO (ausdrückliche Einwilligung in die Übermittlung in ein Drittland ohne Angemessenheitsbeschluss). Durch das Absenden des Formulars erklären Sie sich ausdrücklich mit der Übermittlung Ihrer Daten in die USA und den damit verbundenen Risiken einverstanden.',
          'Die im Kontaktformular eingegebenen Daten werden ausschliesslich zur Beantwortung Ihrer Anfrage verwendet. In unserem eigenen E-Mail-Postfach werden Anfragen max. 90 Tage nach Abschluss der Bearbeitung gelöscht. Als E-Mail-Anbieter nutzen wir GMX / 1&1 Mail & Media GmbH.',
          'Weitere Informationen zu Web3Forms: https://web3forms.com/privacy',
        ],
      },
      {
        heading: '8. Lokaler Speicher und vergleichbare Technologien',
        paragraphs: [
          'Diese Website speichert Ihre gewählte Sprache (Deutsch, Englisch oder Türkisch) im localStorage unter dem Schlüssel app:v1:language, damit die Website in Ihrer bevorzugten Sprache angezeigt wird.',
          'Es werden keine Session-, Tracking- oder Marketing-Cookies verwendet.',
          'Der localStorage-Eintrag app:v1:language enthält nur den Sprachcode und wird nicht zur Nutzeridentifikation oder Profilbildung verwendet.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung einer benutzerfreundlichen und sprachkonsistenten Anwendung). Da die Speicherung ausschliesslich der Funktionalität der Website dient und die Privatsphäre der Nutzer nicht beeinträchtigt, ist keine aktive Einwilligung erforderlich.',
          'Für weitere grundlegende App-Funktionen wird ebenfalls localStorage verwendet, z. B. für Lernfortschritt, Favoriten und lokale Erinnerungseinstellungen. Details siehe Abschnitt 3.',
        ],
      },
      {
        heading: '9. Server-Logs',
        paragraphs: [
          'Der Hosting-Anbieter (Vercel Inc.) kann technische Zugriffsdaten protokollieren, z. B. IP-Adresse, Zeitstempel, abgerufene URL und HTTP-Statuscode. Diese Protokolldaten werden in der Regel für max. 30 Tage gespeichert. Sie werden zur Bereitstellung, Sicherheit und Fehleranalyse der Website verarbeitet und nicht für Marketing- oder Profilingzwecke genutzt.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Sicherstellung des technischen Betriebs, der Sicherheit und der Fehleranalyse).',
        ],
      },
      {
        heading: '10. Ihre Rechte',
        paragraphs: [
          'Sie haben nach der DSGVO folgende Rechte gegenüber dem Verantwortlichen:',
          '• Recht auf Auskunft (Art. 15 DSGVO)\n• Recht auf Berichtigung (Art. 16 DSGVO)\n• Recht auf Löschung (Art. 17 DSGVO)\n• Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)\n• Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)\n• Recht auf Datenübertragbarkeit (Art. 20 DSGVO)',
          { before: 'Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an: ', isEmail: true, after: '' },
          'Soweit eine Verarbeitung auf Einwilligung beruht, können Sie Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs haben Sie das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen die DSGVO verstösst. Zuständige Aufsichtsbehörden sind je nach Wohnsitz insbesondere:\n• Schweiz: Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB), edoeb.admin.ch\n• Deutschland: Zuständige Landesdatenschutzbehörde (Übersicht: bfdi.bund.de)\n• Österreich: Datenschutzbehörde (DSB), dsb.gv.at',
        ],
      },
      {
        heading: '11. Änderungen dieser Datenschutzerklärung',
        paragraphs: [
          'Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie stets den aktuellen rechtlichen Anforderungen und den tatsächlich eingesetzten Funktionen anzupassen. Bitte prüfen Sie bei regelmässigen Besuchen die aktuelle Fassung.',
        ],
      },
    ],
  },

  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: May 2026',
    sections: (operatorName, operatorAddress, supabaseRegion) => [
      {
        heading: '1. Data controller',
        paragraphs: [
          `The controller for data processing within the meaning of the General Data Protection Regulation (GDPR) and the Swiss FADP (revFADP) is: ${operatorName}, ${operatorAddress}.`,
          { before: 'Email: ', isEmail: true, after: '' },
        ],
      },
      {
        heading: '2. Principles',
        paragraphs: [
          'This website is a private, non-commercial educational resource. We only process personal data where technically necessary for the operation of the site, where you explicitly use a feature, or where a legal basis permits the processing. No profiling, data selling, or targeted advertising tracking takes place.',
        ],
      },
      {
        heading: '3. Local browser storage (localStorage)',
        paragraphs: [
          'This app stores the following data in the local browser storage (localStorage) of your device: learning progress (which names have been marked as learned), favourites list, most recently viewed names, local state for optional push reminders, and the language preference under the key app:v1:language (see section 8).',
          "This local data does not leave your device. You can delete it at any time via the app's Settings page or directly in your browser settings.",
          'Local browser storage is used only to provide the app functions requested by you. It is not used for advertising, tracking, or profiling purposes.',
          'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in providing a functioning application).',
        ],
      },
      {
        heading: '4. Push notifications',
        paragraphs: [
          'If you explicitly enable push reminders, we store the browser push endpoint, technical push keys, selected reminder interval, timezone, user agent, delivery timestamps, failure state, and technical delivery logs in Supabase.',
          'This data is used exclusively to deliver the learning reminders requested by you, detect failed subscriptions, and disable invalid push subscriptions. Because this website covers religious learning content, activated reminders can allow inferences about religious interest. By consciously activating push reminders, you explicitly consent to the processing of data that may allow inferences about your religious beliefs. Push reminders are fully voluntary, are only set up after explicit activation, are not used for profiling, and are not linked to a user account.',
          'Depending on your browser and operating system, the technical delivery of push notifications may be handled through push services provided by the respective browser or operating system provider, such as Apple, Google, Mozilla, or Microsoft.',
          'You can disable push notifications at any time in the app or in your browser or device settings. When disabled, the push subscription is deactivated on the server side where technically possible.',
          'Legal basis: Art. 6(1)(a) GDPR for consent to enabling push reminders. Because religious affiliation or interest constitutes a special category of personal data under Art. 9 GDPR, Art. 9(2)(a) GDPR (explicit consent) applies in addition. You grant consent by actively enabling the push feature. Art. 6(1)(f) GDPR applies to secure technical operation, error handling, and deactivation of invalid subscriptions.',
        ],
      },
      {
        heading: '5. Supabase',
        paragraphs: [
          'We use Supabase, a service provided by Supabase Inc., to store optional push subscriptions. Supabase provides the technical database infrastructure.',
          'Only the technical data required for push reminders is stored, in particular the push endpoint, push keys, reminder interval, timezone, technical delivery information, and failure state.',
          `Where legally required, a data processing agreement is concluded with Supabase. The configured Supabase project region is: ${supabaseRegion}. Where data is transferred to third countries, this is done under the applicable data protection safeguards.`,
          'Stored push data is deleted or deactivated when you disable push notifications, when the subscription becomes invalid, or when storage is no longer necessary for the stated purpose.',
        ],
      },
      {
        heading: '6. Vercel Analytics & Speed Insights',
        paragraphs: [
          'This website uses Vercel Analytics and Vercel Speed Insights, services provided by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.',
          'According to Vercel, Vercel Analytics collects cookie-free, data-minimised usage data, such as pages visited, approximate geographic region, device type, and referral source. Vercel Speed Insights measures page-load performance and technical performance metrics.',
          'According to Vercel, the data collected is processed in anonymised or aggregated form. No cookies are set and no personal identifiers are used for advertising tracking. Individual users cannot be identified from the data collected.',
          'Because Vercel Inc. is located in the United States, data may be transferred there. Vercel is certified under the EU–U.S. Data Privacy Framework, ensuring an adequate level of data protection.',
          'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in optimising the website and detecting technical errors). No consent banner is required due to the anonymised, cookie-free processing. You can object to this processing by configuring your browser to block JavaScript from vercel.com/insights.',
          'Privacy policy: https://vercel.com/legal/privacy-policy',
        ],
      },
      {
        heading: '7. Contact form (Web3Forms)',
        paragraphs: [
          'When you use the contact form, your name, email address, and message are transmitted to our email address via the Web3Forms service (https://web3forms.com).',
          'According to Web3Forms, form submissions are stored for 30 days (Free plan) or 1 year (Pro plan), after which they are automatically deleted. Web3Forms states that its servers are located in the US-East region (USA). Because the European Commission has not issued an adequacy decision for the United States and Web3Forms is not certified under the EU–U.S. Data Privacy Framework, this constitutes a third-country transfer without an equivalent level of data protection. Risk notice: US authorities may, under certain conditions (e.g. under FISA 702), access data stored with US-based providers.',
          'Web3Forms may use sub-processors such as CleanTalk and/or Akismet for spam prevention, where these are enabled in the plan used. In that case, IP address and email address may be transmitted to these services. No data processing agreement (DPA) has been concluded with Web3Forms.',
          'Legal basis: Art. 6(1)(a) GDPR in conjunction with Art. 49(1)(a) GDPR (explicit consent to transfer to a third country without an adequacy decision). By submitting the form, you explicitly consent to the transfer of your data to the USA and the associated risks.',
          'The data entered in the contact form is used exclusively to respond to your enquiry. In our own email inbox, enquiries are deleted within 90 days of completing the response. We use GMX / 1&1 Mail & Media GmbH as email provider.',
          'Web3Forms privacy policy: https://web3forms.com/privacy',
        ],
      },
      {
        heading: '8. Local storage and similar technologies',
        paragraphs: [
          'This website stores your chosen language (English, German, or Turkish) in localStorage under the key app:v1:language, so the site is shown in your preferred language.',
          'No session, tracking, or marketing cookies are used.',
          'The app:v1:language localStorage entry contains only the language code and is not used to identify or profile users.',
          'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in providing a user-friendly and language-consistent application). Because this storage serves a purely functional purpose and does not affect user privacy, no active consent is required.',
          'For other basic app functions, local browser storage (localStorage) is also used, for example for learning progress, favourites, and local reminder settings. See section 3 for details.',
        ],
      },
      {
        heading: '9. Server logs',
        paragraphs: [
          'The hosting provider (Vercel Inc.) may log technical access data, such as IP address, timestamp, requested URL, and HTTP status code. These logs are typically retained for a maximum of 30 days. If server-side functions, cron jobs, or API routes run on Vercel, technical access data and function logs may also be processed for operation, security, and error analysis. This data is not used for marketing or profiling purposes.',
          'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in ensuring technical operation, security, and error analysis).',
        ],
      },
      {
        heading: '10. Your rights',
        paragraphs: [
          'Under the GDPR you have the following rights against the data controller:',
          '• Right of access (Art. 15 GDPR)\n• Right to rectification (Art. 16 GDPR)\n• Right to erasure (Art. 17 GDPR)\n• Right to restriction of processing (Art. 18 GDPR)\n• Right to object to processing (Art. 21 GDPR)\n• Right to data portability (Art. 20 GDPR)',
          { before: 'To exercise your rights, please contact us by email at: ', isEmail: true, after: '' },
          'Where processing is based on consent, you may withdraw your consent at any time with effect for the future. Without prejudice to any other administrative or judicial remedy, you have the right to lodge a complaint with a data protection supervisory authority if you believe that the processing of your data violates the GDPR. The competent supervisory authority depends on your country of residence; these include in particular:\n• Switzerland: Federal Data Protection and Information Commissioner (FDPIC), edoeb.admin.ch\n• Germany: Competent state data protection authority (overview: bfdi.bund.de)\n• Austria: Data Protection Authority (DSB), dsb.gv.at',
        ],
      },
      {
        heading: '11. Changes to this privacy policy',
        paragraphs: [
          'We reserve the right to update this privacy policy to reflect legal requirements and the functions actually used on this website. Please check this page periodically for the current version.',
        ],
      },
    ],
  },

  tr: {
    title: 'Gizlilik Politikası',
    lastUpdated: 'Son güncelleme: Mayıs 2026',
    sections: (operatorName, operatorAddress, supabaseRegion) => [
      {
        heading: '1. Veri sorumlusu',
        paragraphs: [
          `Genel Veri Koruma Yönetmeliği (GDPR/DSGVO) ve İsviçre FADP (revFADP) kapsamında veri sorumlusu: ${operatorName}, ${operatorAddress}.`,
          { before: 'E-posta: ', isEmail: true, after: '' },
        ],
      },
      {
        heading: '2. Temel ilkeler',
        paragraphs: [
          'Bu web sitesi özel, ticari olmayan bir eğitim kaynağıdır. Kişisel veriler yalnızca sitenin işletimi için teknik olarak gerekli olduğunda, bir özelliği açıkça kullandığınızda veya yasal bir dayanak bulunduğunda işlenir. Profil oluşturma, veri satışı veya hedefli reklam takibi yapılmaz.',
        ],
      },
      {
        heading: '3. Yerel tarayıcı depolama alanı (localStorage)',
        paragraphs: [
          'Bu uygulama aşağıdaki verileri cihazınızın yerel tarayıcı belleğinde (localStorage) saklar: öğrenme ilerleme durumu (hangi isimlerin öğrenildi olarak işaretlendiği), favori listesi, en son görüntülenen isimler, isteğe bağlı push hatırlatmaları için yerel durum ve app:v1:language anahtarı altında dil tercihi (bkz. bölüm 8).',
          'Bu yerel veriler cihazınızı terk etmez. Uygulamanın Ayarlar sayfasından veya doğrudan tarayıcı ayarlarınızdan bu verileri istediğiniz zaman silebilirsiniz.',
          'Yerel tarayıcı depolama alanı yalnızca talep ettiğiniz uygulama işlevlerini sunmak için kullanılır. Reklam, izleme veya profil oluşturma amacıyla kullanılmaz.',
          'Hukuki dayanak: GDPR Madde 6(1)(f) – işlevsel bir uygulama sunmaya yönelik meşru menfaat.',
        ],
      },
      {
        heading: '4. Push bildirimleri',
        paragraphs: [
          'Push hatırlatmalarını açıkça etkinleştirirseniz, tarayıcı push uç noktasını, teknik push anahtarlarını, seçilen hatırlatma aralığını, saat dilimini, kullanıcı aracısı bilgisini, gönderim zamanlarını, hata durumunu ve teknik teslimat günlüklerini Supabase içinde saklarız.',
          // TODO: native speaker review – legal language around religious data and explicit consent
          'Bu veriler yalnızca talep ettiğiniz öğrenme hatırlatmalarını göndermek, başarısız abonelikleri tespit etmek ve geçersiz push aboneliklerini devre dışı bırakmak için kullanılır. Bu web sitesi dini öğrenme içerikleri sunduğundan, etkinleştirilen push hatırlatmaları dini bir ilgi olduğuna dair çıkarımlar yapılmasına olanak tanıyabilir. Push hatırlatmalarını bilinçli olarak etkinleştirerek, dini inançlarınıza ilişkin çıkarımlar içerebilecek verilerin işlenmesine açıkça onay vermiş olursunuz. Push hatırlatmaları tamamen gönüllülük esasına dayanır, yalnızca açık etkinleştirme sonrasında kurulur, profil oluşturma amacıyla kullanılmaz ve bir kullanıcı hesabıyla ilişkilendirilmez.',
          'Tarayıcınıza ve işletim sisteminize bağlı olarak push bildirimlerinin teknik teslimi Apple, Google, Mozilla veya Microsoft gibi ilgili tarayıcı ya da işletim sistemi sağlayıcılarının push hizmetleri üzerinden gerçekleştirilebilir.',
          'Push bildirimlerini istediğiniz zaman uygulama içinde veya tarayıcı ya da cihaz ayarlarınızdan devre dışı bırakabilirsiniz. Devre dışı bırakıldığında, teknik olarak mümkün olduğu ölçüde push aboneliği sunucu tarafında devre dışı bırakılır.',
          // TODO: native speaker review – Art. 9 GDPR reference
          'Hukuki dayanak: Push hatırlatmalarının etkinleştirilmesine ilişkin onay için GDPR Madde 6(1)(a). Din bilgisi veya dini ilgi GDPR Madde 9 kapsamında özel kategori kişisel veri oluşturduğundan, ek olarak GDPR Madde 9(2)(a) (açık onay) da uygulanır. Push özelliğini etkinleştirerek bu onayı vermiş olursunuz. Güvenli teknik işletim, hata yönetimi ve geçersiz aboneliklerin devre dışı bırakılması için GDPR Madde 6(1)(f) uygulanır.',
        ],
      },
      {
        heading: '5. Supabase',
        paragraphs: [
          'İsteğe bağlı push aboneliklerini saklamak için Supabase Inc. tarafından sunulan Supabase hizmetini kullanıyoruz. Supabase teknik veritabanı altyapısını sağlar.',
          'Yalnızca push hatırlatmaları için gerekli teknik veriler saklanır; özellikle push uç noktası, push anahtarları, hatırlatma aralığı, saat dilimi, teknik teslimat bilgileri ve hata durumu.',
          // TODO: native speaker review – region variable and third-country transfer wording
          `Yasal olarak gerekli olduğu durumlarda Supabase ile bir veri işleme sözleşmesi yapılır. Yapılandırılan Supabase proje bölgesi: ${supabaseRegion}. Verilerin üçüncü ülkelere aktarılması halinde, bu aktarım geçerli veri koruma güvencelerine uygun şekilde yapılır.`,
          'Saklanan push verileri, push bildirimlerini devre dışı bıraktığınızda, abonelik geçersiz hale geldiğinde veya belirtilen amaç için saklama artık gerekli olmadığında silinir ya da devre dışı bırakılır.',
        ],
      },
      {
        heading: '6. Vercel Analytics ve Speed Insights',
        paragraphs: [
          "Bu web sitesi, Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, ABD) tarafından sunulan Vercel Analytics ve Vercel Speed Insights hizmetlerini kullanmaktadır.",
          "Vercel'in açıklamalarına göre Vercel Analytics çerezsiz ve veri minimizasyonuna uygun kullanım verilerini toplar; örneğin ziyaret edilen sayfalar, yaklaşık coğrafi bölge, cihaz türü ve yönlendirme kaynağı. Vercel Speed Insights sayfa yüklenme performansını ve teknik performans değerlerini ölçer.",
          "Vercel'e göre toplanan veriler anonimleştirilmiş veya toplu hâlde işlenir. Çerez yerleştirilmez ve reklam takibi için kişisel tanımlayıcılar kullanılmaz. Toplanan verilerden bireysel kullanıcılar tanımlanamaz.",
          "Vercel Inc. Amerika Birleşik Devletleri'nde bulunduğundan veriler ABD'ye aktarılabilir. Vercel, AB-ABD Veri Gizliliği Çerçevesi kapsamında sertifikalıdır ve yeterli düzeyde veri koruma güvencesi sağlanmaktadır.",
          "Hukuki dayanak: GDPR Madde 6(1)(f) – web sitesini optimize etmeye ve teknik hataları tespit etmeye yönelik meşru menfaat. Anonimleştirilmiş ve çerezsiz işleme nedeniyle onay banner'ı gerekmemektedir. Tarayıcınızı vercel.com/insights adresinden gelen JavaScript'i engelleyecek şekilde yapılandırarak bu işlemeye itiraz edebilirsiniz.",
          'Vercel gizlilik politikası: https://vercel.com/legal/privacy-policy',
        ],
      },
      {
        heading: '7. İletişim formu (Web3Forms)',
        paragraphs: [
          'İletişim formunu kullandığınızda adınız, e-posta adresiniz ve mesajınız Web3Forms hizmeti (https://web3forms.com) aracılığıyla e-posta adresimize iletilir.',
          // TODO: native speaker review – third-country transfer, DPF status, FISA 702 risk notice
          "Web3Forms, form gönderimlerini kendi açıklamalarına göre 30 gün (Ücretsiz plan) veya 1 yıl (Pro plan) süreyle saklar; bu süreden sonra otomatik olarak silinirler. Web3Forms, sunucularının ABD'nin US-East bölgesinde bulunduğunu belirtmektedir. Avrupa Komisyonu ABD için bir yeterlilik kararı almamış olup Web3Forms, AB-ABD Veri Gizliliği Çerçevesi kapsamında sertifikalı değildir; bu nedenle söz konusu aktarım, eşdeğer bir koruma düzeyi bulunmayan üçüncü ülkeye yapılan bir aktarım niteliği taşımaktadır. Risk uyarısı: ABD makamları belirli koşullar altında (örn. FISA 702 kapsamında) ABD'li sağlayıcılarda depolanan verilere erişebilir.",
          // TODO: native speaker review – sub-processors and DPA status
          'Web3Forms, kullanılan planda etkinleştirilmişse spam önleme amacıyla CleanTalk ve/veya Akismet gibi alt işlemciler kullanabilir. Bu durumda IP adresi ve e-posta adresi bu hizmetlere iletilebilir. Web3Forms ile şu ana kadar bir Veri İşleme Sözleşmesi (DPA) imzalanmamıştır.',
          // TODO: native speaker review – Art. 49(1)(a) GDPR consent for third-country transfer
          "Hukuki dayanak: GDPR Madde 6(1)(a) ile birlikte GDPR Madde 49(1)(a) (yeterlilik kararı olmaksızın üçüncü ülkeye aktarım için açık onay). Formu göndererek, verilerinizin ABD'ye aktarılmasına ve bununla ilgili risklere açıkça onay vermiş olursunuz.",
          // TODO: native speaker review – email retention period
          'İletişim formuna girilen veriler yalnızca talebinizi yanıtlamak için kullanılır. Kendi e-posta kutumuzda, talepler işlemin tamamlanmasından itibaren en fazla 90 gün içinde silinir. E-posta sağlayıcısı olarak GMX / 1&1 Mail & Media GmbH kullanıyoruz.',
          'Web3Forms gizlilik politikası: https://web3forms.com/privacy',
        ],
      },
      {
        heading: '8. Yerel depolama ve benzer teknolojiler',
        paragraphs: [
          'Bu web sitesi seçtiğiniz dili (Türkçe, Almanca veya İngilizce) app:v1:language anahtarıyla localStorage içinde saklar; böylece site tercih ettiğiniz dilde görüntülenir.',
          'Oturum, izleme veya pazarlama çerezi kullanılmamaktadır.',
          'app:v1:language localStorage girdisi yalnızca dil kodunu içerir; kullanıcıları tanımlamak veya profil oluşturmak için kullanılmaz.',
          "Hukuki dayanak: GDPR Madde 6(1)(f) – kullanıcı dostu ve dil tutarlı bir uygulama sunmaya yönelik meşru menfaat. Bu saklama yalnızca işlevsel bir amaç taşıdığından ve kullanıcı gizliliğini etkilemediğinden, aktif bir onay (opt-in) gerekmemektedir.",
          "Temel diğer uygulama işlevleri için de yerel tarayıcı depolama alanı (localStorage) kullanılır; örneğin öğrenme ilerlemesi, favoriler ve yerel hatırlatma ayarları. Ayrıntılar için bölüm 3'e bakınız.",
        ],
      },
      {
        heading: '9. Sunucu günlükleri',
        paragraphs: [
          // TODO: native speaker review – log retention period
          'Barındırma sağlayıcısı (Vercel Inc.) IP adresi, zaman damgası, istenen URL ve HTTP durum kodu gibi teknik erişim verilerini kayıt altına alabilir. Bu günlükler genellikle en fazla 30 gün süreyle saklanır. Bu veriler web sitesini sunmak, güvenliğini sağlamak ve hataları analiz etmek için işlenir; pazarlama veya profil oluşturma amacıyla kullanılmaz.',
          'Hukuki dayanak: GDPR Madde 6(1)(f) – teknik işletimin, güvenliğin ve hata analizinin sağlanmasına yönelik meşru menfaat.',
        ],
      },
      {
        heading: '10. Haklarınız',
        paragraphs: [
          'GDPR kapsamında veri sorumlusuna karşı aşağıdaki haklara sahipsiniz:',
          '• Erişim hakkı (Madde 15)\n• Düzeltme hakkı (Madde 16)\n• Silme hakkı (Madde 17)\n• İşlemeyi kısıtlama hakkı (Madde 18)\n• İşlemeye itiraz hakkı (Madde 21)\n• Veri taşınabilirliği hakkı (Madde 20)',
          { before: 'Haklarınızı kullanmak için lütfen e-posta ile iletişime geçin: ', isEmail: true, after: '' },
          // TODO: native speaker review – supervisory authority names and translations
          "Başka bir idari veya yargısal başvuru yoluna halel gelmeksizin, verilerinizin GDPR'a aykırı olarak işlendiğine inanıyorsanız bir veri koruma denetim makamına şikayette bulunma hakkına sahipsiniz. Yetkili denetim makamı ikamet ettiğiniz ülkeye göre değişir; bunlar arasında özellikle şunlar yer almaktadır:\n• Türkiye: Kişisel Verileri Koruma Kurumu (KVKK), kvkk.gov.tr\n• İsviçre: Federal Veri Koruma ve Bilgi Komiseri (EDÖB), edoeb.admin.ch\n• Almanya: Yetkili eyalet veri koruma makamı (genel bakış: bfdi.bund.de)\n• Avusturya: Veri Koruma Makamı (DSB), dsb.gv.at",
        ],
      },
      {
        heading: '11. Bu politikadaki değişiklikler',
        paragraphs: [
          'Yasal gereklilikleri ve bu web sitesinde fiilen kullanılan işlevleri yansıtmak amacıyla bu gizlilik politikasını güncelleme hakkımızı saklı tutarız. Güncel sürüm için bu sayfayı düzenli aralıklarla kontrol etmenizi öneririz.',
        ],
      },
    ],
  },
}

export function PrivacyPageContent() {
  const pathname = usePathname()
  const language: Language = pathname.startsWith('/de') ? 'de' : pathname.startsWith('/tr') ? 'tr' : 'en'
  const c = content[language]

  // Validate environment variables at runtime (when the component is rendered)
  const operatorName = assertEnv('NEXT_PUBLIC_OPERATOR_NAME')
  const operatorAddress = getOperatorAddress()
  const supabaseRegion = assertEnv('NEXT_PUBLIC_SUPABASE_PROJECT_REGION')

  const sections = c.sections(operatorName, operatorAddress, supabaseRegion)

  return (
    <article lang={language} className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-4xl font-semibold text-primary">{c.title}</h1>
        <p className="text-sm text-muted">{c.lastUpdated}</p>
      </header>

      {sections.map((section) => (
        <section key={section.heading} className="rounded-lg border border-white/10 bg-surface p-5 space-y-3">
          <h2 className="text-lg font-semibold text-primary">{section.heading}</h2>
          <div className="space-y-3 leading-7 text-muted">
            {section.paragraphs.map((para, i) =>
              typeof para === 'string' ? (
                <p key={i} className="whitespace-pre-line">{para}</p>
              ) : (
                <p key={i}>
                  {para.before}
                  <ObfuscatedEmail />
                  {para.after}
                </p>
              ),
            )}
          </div>
        </section>
      ))}

      <p className="text-sm text-muted">
        {language === 'de' ? 'Zum Impressum: ' : language === 'tr' ? 'Künye için: ' : 'Legal notice: '}
        <Link href={getLocalizedStaticPath('imprint', language)} className="text-gold underline underline-offset-2 hover:text-gold/80">
          {language === 'de' ? 'Impressum' : language === 'tr' ? 'Künye' : 'Imprint'}
        </Link>
      </p>
    </article>
  )
}
