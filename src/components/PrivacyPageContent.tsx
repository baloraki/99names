'use client'

import Link from 'next/link'
import { useAppState } from '@/hooks/useAppState'
import type { Language } from '@/types/language'

// The app uses Vercel Analytics + Speed Insights (see RootDocument.tsx).
// Both are disclosed in this policy. Update OPERATOR below before publishing.
const OPERATOR_NAME = '[Vorname Nachname]'
const OPERATOR_ADDRESS = '[Straße und Hausnummer, PLZ Ort, Deutschland]'
const OPERATOR_EMAIL = '[ihre@email.de]'

type PolicyContent = {
  title: string
  lastUpdated: string
  sections: { heading: string; paragraphs: string[] }[]
}

const content: Record<Language, PolicyContent> = {
  de: {
    title: 'Datenschutzerklärung',
    lastUpdated: 'Stand: Mai 2025',
    sections: [
      {
        heading: '1. Verantwortlicher',
        paragraphs: [
          `Verantwortlich für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) ist: ${OPERATOR_NAME}, ${OPERATOR_ADDRESS}.`,
          `E-Mail: ${OPERATOR_EMAIL}`,
        ],
      },
      {
        heading: '2. Grundsätze der Datenverarbeitung',
        paragraphs: [
          'Diese Website ist ein privates, nicht-kommerzielles Bildungsangebot. Wir verarbeiten personenbezogene Daten nur, soweit es für den Betrieb der Website technisch erforderlich oder durch gesetzliche Grundlagen legitimiert ist. Es findet kein Profiling, kein Verkauf von Daten und kein zielgerichtetes Werbungs-Tracking statt.',
        ],
      },
      {
        heading: '3. Lokaler Browserspeicher (localStorage)',
        paragraphs: [
          'Diese App speichert folgende Daten ausschließlich lokal im Browserspeicher (localStorage) Ihres Geräts: Spracheinstellung, Lernfortschritt (welche Namen als gelernt markiert wurden), Favoritenliste, zuletzt angesehene Namen sowie Lernplan-Einstellungen.',
          'Diese Daten verlassen Ihr Gerät nicht. Es gibt keine Übertragung an unsere Server oder Dritte. Sie können diese Daten jederzeit selbst löschen – über die Einstellungsseite der App oder direkt in Ihren Browsereinstellungen.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung einer funktionsfähigen Anwendung ohne Server-Backend).',
        ],
      },
      {
        heading: '4. Vercel Analytics & Speed Insights',
        paragraphs: [
          'Diese Website verwendet Vercel Analytics und Vercel Speed Insights, Dienste der Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.',
          'Vercel Analytics erfasst anonymisierte Nutzungsdaten (z. B. aufgerufene Seiten, ungefähre geografische Region, Gerätetyp, Herkunft des Besuchs). Vercel Speed Insights misst Seitenlade-Performance. Nach aktuellem Stand von Vercel werden keine personenbezogenen Identifikatoren gespeichert und keine Cookies gesetzt.',
          'Da Vercel Inc. in den USA ansässig ist, können Daten in die USA übermittelt werden. Vercel ist unter dem EU-U.S. Data Privacy Framework zertifiziert, sodass ein angemessenes Datenschutzniveau gewährleistet ist.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Optimierung der Website und Erkennung technischer Fehler). Sie können der Verarbeitung widersprechen, indem Sie Ihren Browser so konfigurieren, dass JavaScript von vercel.com/insights blockiert wird.',
          'Weitere Informationen: https://vercel.com/legal/privacy-policy',
        ],
      },
      {
        heading: '5. Kontaktformular (Web3Forms)',
        paragraphs: [
          'Wenn Sie das Kontaktformular nutzen, werden Name, E-Mail-Adresse und Ihre Nachricht über den Dienst Web3Forms (Web3Forms, https://web3forms.com) an unsere E-Mail-Adresse übermittelt.',
          'Web3Forms übermittelt die Daten direkt per E-Mail weiter und speichert diese nach eigenen Angaben nicht auf seinen Servern. Der öffentliche API-Schlüssel ist im Quellcode der Website sichtbar; er berechtigt lediglich zum Senden von Formularen an unsere E-Mail-Adresse.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung durch Absenden des Formulars). Die übermittelten Daten werden ausschließlich zur Beantwortung Ihrer Anfrage verwendet und danach gelöscht, spätestens nach 90 Tagen.',
          'Weitere Informationen zu Web3Forms: https://web3forms.com/privacy',
        ],
      },
      {
        heading: '6. Cookies',
        paragraphs: [
          'Diese Website setzt keine Cookies. Es wird kein Session-, Tracking- oder sonstiger Cookie gesetzt. Der localStorage (s. Punkt 3) ist kein Cookie im Sinne von § 25 TTDSG.',
        ],
      },
      {
        heading: '7. Server-Logs',
        paragraphs: [
          'Der Hosting-Anbieter (Vercel Inc.) kann technische Zugriffsdaten protokollieren (IP-Adresse, Zeitstempel, abgerufene URL, HTTP-Statuscode). Diese Daten werden automatisch nach kurzer Zeit gelöscht und nicht für Marketing- oder Profilingzwecke genutzt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Sicherstellung des technischen Betriebs).',
        ],
      },
      {
        heading: '8. Ihre Rechte',
        paragraphs: [
          'Sie haben nach der DSGVO folgende Rechte gegenüber dem Verantwortlichen:',
          '• Recht auf Auskunft (Art. 15 DSGVO)\n• Recht auf Berichtigung (Art. 16 DSGVO)\n• Recht auf Löschung (Art. 17 DSGVO)\n• Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)\n• Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)\n• Recht auf Datenübertragbarkeit (Art. 20 DSGVO)',
          `Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an: ${OPERATOR_EMAIL}`,
          'Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs haben Sie das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen die DSGVO verstößt.',
        ],
      },
      {
        heading: '9. Änderungen dieser Datenschutzerklärung',
        paragraphs: [
          'Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie stets den aktuellen rechtlichen Anforderungen anzupassen. Bitte prüfen Sie bei regelmäßigen Besuchen die aktuelle Fassung.',
        ],
      },
    ],
  },

  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: May 2025',
    sections: [
      {
        heading: '1. Data controller',
        paragraphs: [
          `The controller for data processing within the meaning of the General Data Protection Regulation (GDPR) is: ${OPERATOR_NAME}, ${OPERATOR_ADDRESS}.`,
          `Email: ${OPERATOR_EMAIL}`,
        ],
      },
      {
        heading: '2. Principles',
        paragraphs: [
          'This website is a private, non-commercial educational resource. We only process personal data where technically necessary for the operation of the site or where justified by a legal basis. No profiling, data selling, or targeted advertising tracking takes place.',
        ],
      },
      {
        heading: '3. Local browser storage (localStorage)',
        paragraphs: [
          'This app stores the following data exclusively in the local browser storage (localStorage) of your device: language setting, learning progress (which names have been marked as learned), favourites list, most recently viewed names, and learning schedule settings.',
          'This data never leaves your device. There is no transfer to our servers or to any third party. You can delete this data at any time – via the app\'s Settings page or directly in your browser settings.',
          'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in providing a functioning application without a server back-end).',
        ],
      },
      {
        heading: '4. Vercel Analytics & Speed Insights',
        paragraphs: [
          'This website uses Vercel Analytics and Vercel Speed Insights, services provided by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.',
          'Vercel Analytics collects anonymised usage data (e.g. pages visited, approximate geographic region, device type, referral source). Vercel Speed Insights measures page-load performance. According to Vercel\'s current documentation, no personally identifiable identifiers are stored and no cookies are set.',
          'Because Vercel Inc. is located in the United States, data may be transferred there. Vercel is certified under the EU–U.S. Data Privacy Framework, ensuring an adequate level of data protection.',
          'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in optimising the website and detecting technical errors). You can object to this processing by configuring your browser to block JavaScript from vercel.com/insights.',
          'Privacy policy: https://vercel.com/legal/privacy-policy',
        ],
      },
      {
        heading: '5. Contact form (Web3Forms)',
        paragraphs: [
          'When you use the contact form, your name, email address, and message are transmitted to our email address via the Web3Forms service (https://web3forms.com).',
          'Web3Forms forwards the data directly by email and, according to its documentation, does not store in on its servers. The public API key is visible in the website source code; it only authorises sending form submissions to our email address.',
          'Legal basis: Art. 6(1)(a) GDPR (your consent by submitting the form). The transmitted data is used solely to respond to your enquiry and is deleted thereafter, at the latest after 90 days.',
          'Web3Forms privacy policy: https://web3forms.com/privacy',
        ],
      },
      {
        heading: '6. Cookies',
        paragraphs: [
          'This website does not set any cookies. No session, tracking, or any other cookies are used. The localStorage (see section 3) is not a cookie.',
        ],
      },
      {
        heading: '7. Server logs',
        paragraphs: [
          'The hosting provider (Vercel Inc.) may log technical access data (IP address, timestamp, requested URL, HTTP status code). This data is automatically deleted after a short period and is not used for marketing or profiling purposes. Legal basis: Art. 6(1)(f) GDPR (legitimate interest in ensuring stable technical operation).',
        ],
      },
      {
        heading: '8. Your rights',
        paragraphs: [
          'Under the GDPR you have the following rights against the data controller:',
          '• Right of access (Art. 15 GDPR)\n• Right to rectification (Art. 16 GDPR)\n• Right to erasure (Art. 17 GDPR)\n• Right to restriction of processing (Art. 18 GDPR)\n• Right to object to processing (Art. 21 GDPR)\n• Right to data portability (Art. 20 GDPR)',
          `To exercise your rights, please contact us by email at: ${OPERATOR_EMAIL}`,
          'Without prejudice to any other administrative or judicial remedy, you have the right to lodge a complaint with a data protection supervisory authority if you believe that the processing of your data violates the GDPR.',
        ],
      },
      {
        heading: '9. Changes to this privacy policy',
        paragraphs: [
          'We reserve the right to update this privacy policy to reflect changes in legal requirements. Please check this page periodically for the current version.',
        ],
      },
    ],
  },

  tr: {
    title: 'Gizlilik Politikası',
    lastUpdated: 'Son güncelleme: Mayıs 2025',
    sections: [
      {
        heading: '1. Veri sorumlusu',
        paragraphs: [
          `Genel Veri Koruma Yönetmeliği (GDPR/DSGVO) kapsamında veri sorumlusu: ${OPERATOR_NAME}, ${OPERATOR_ADDRESS}.`,
          `E-posta: ${OPERATOR_EMAIL}`,
        ],
      },
      {
        heading: '2. Temel ilkeler',
        paragraphs: [
          'Bu web sitesi özel, ticari olmayan bir eğitim kaynağıdır. Kişisel veriler yalnızca sitenin işletimi için teknik olarak gerekli olduğu durumlarda veya yasal bir dayanağa sahip olduğunda işlenir. Profil oluşturma, veri satışı veya hedefli reklam takibi yapılmaz.',
        ],
      },
      {
        heading: '3. Yerel tarayıcı depolama alanı (localStorage)',
        paragraphs: [
          "Bu uygulama aşağıdaki verileri yalnızca cihazınızın yerel tarayıcı belleğinde (localStorage) saklar: dil tercihi, öğrenme ilerleme durumu (hangi isimlerin öğrenildi olarak işaretlendiği), favori listesi, en son görüntülenen isimler ve öğrenme planı ayarları.",
          'Bu veriler cihazınızı terk etmez; sunucularımıza veya üçüncü taraflara iletilmez. Uygulamanın Ayarlar sayfasından veya doğrudan tarayıcı ayarlarınızdan bu verileri istediğiniz zaman silebilirsiniz.',
          'Hukuki dayanak: GDPR Madde 6(1)(f) – sunucu altyapısı olmaksızın işlevsel bir uygulama sağlamaya yönelik meşru menfaat.',
        ],
      },
      {
        heading: '4. Vercel Analytics ve Speed Insights',
        paragraphs: [
          'Bu web sitesi, Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, ABD) tarafından sunulan Vercel Analytics ve Vercel Speed Insights hizmetlerini kullanmaktadır.',
          "Vercel Analytics anonimleştirilmiş kullanım verilerini (örn. ziyaret edilen sayfalar, yaklaşık coğrafi bölge, cihaz türü, yönlendirme kaynağı) toplar. Vercel Speed Insights sayfa yüklenme performansını ölçer. Vercel'in güncel belgelerine göre kişisel tanımlayıcılar saklanmamakta ve çerez yerleştirilmemektedir.",
          "Vercel Inc. Amerika Birleşik Devletleri'nde bulunduğundan veriler ABD'ye aktarılabilir. Vercel, AB-ABD Veri Gizliliği Çerçevesi kapsamında sertifikalıdır ve yeterli düzeyde veri koruma güvencesi sağlanmaktadır.",
          'Hukuki dayanak: GDPR Madde 6(1)(f) – web sitesini optimize etmeye ve teknik hataları tespit etmeye yönelik meşru menfaat. Tarayıcınızı vercel.com/insights adresinden gelen JavaScript\'i engelleyecek şekilde yapılandırarak bu işlemeye itiraz edebilirsiniz.',
          'Vercel gizlilik politikası: https://vercel.com/legal/privacy-policy',
        ],
      },
      {
        heading: '5. İletişim formu (Web3Forms)',
        paragraphs: [
          "İletişim formunu kullandığınızda adınız, e-posta adresiniz ve mesajınız Web3Forms hizmeti (https://web3forms.com) aracılığıyla e-posta adresimize iletilir.",
          "Web3Forms verileri doğrudan e-posta yoluyla iletmekte ve belgelere göre kendi sunucularında saklamamaktadır. Web sitesi kaynak kodunda görünen genel API anahtarı yalnızca form gönderimlerinin e-posta adresimize iletilmesine olanak tanır.",
          'Hukuki dayanak: GDPR Madde 6(1)(a) – formu göndererek verdiğiniz onay. İletilen veriler yalnızca sorunuzu yanıtlamak amacıyla kullanılır ve en geç 90 gün içinde silinir.',
          'Web3Forms gizlilik politikası: https://web3forms.com/privacy',
        ],
      },
      {
        heading: '6. Çerezler',
        paragraphs: [
          'Bu web sitesi herhangi bir çerez kullanmaz. Oturum, izleme veya başka türde çerezler yerleştirilmez. localStorage (bkz. bölüm 3) bir çerez değildir.',
        ],
      },
      {
        heading: '7. Sunucu günlükleri',
        paragraphs: [
          "Barındırma sağlayıcısı (Vercel Inc.) teknik erişim verilerini (IP adresi, zaman damgası, istenen URL, HTTP durum kodu) kayıt altına alabilir. Bu veriler kısa sürede otomatik olarak silinir ve pazarlama veya profil oluşturma amacıyla kullanılmaz. Hukuki dayanak: GDPR Madde 6(1)(f) – teknik işletimin sürekliliğini sağlamaya yönelik meşru menfaat.",
        ],
      },
      {
        heading: '8. Haklarınız',
        paragraphs: [
          'GDPR kapsamında veri sorumlusuna karşı aşağıdaki haklara sahipsiniz:',
          '• Erişim hakkı (Madde 15)\n• Düzeltme hakkı (Madde 16)\n• Silme hakkı (Madde 17)\n• İşlemeyi kısıtlama hakkı (Madde 18)\n• İşlemeye itiraz hakkı (Madde 21)\n• Veri taşınabilirliği hakkı (Madde 20)',
          `Haklarınızı kullanmak için lütfen e-posta ile iletişime geçin: ${OPERATOR_EMAIL}`,
          'Başka bir idari veya yargısal başvuru yoluna halel gelmeksizin, verilerinizin GDPR\'a aykırı olarak işlendiğine inanıyorsanız bir veri koruma denetim makamına şikayette bulunma hakkına sahipsiniz.',
        ],
      },
      {
        heading: '9. Bu politikadaki değişiklikler',
        paragraphs: [
          'Yasal gereklilikleri karşılamak amacıyla bu gizlilik politikasını güncelleme hakkımızı saklı tutarız. Güncel sürüm için bu sayfayı düzenli aralıklarla kontrol etmenizi öneririz.',
        ],
      },
    ],
  },
}

export function PrivacyPageContent() {
  const { language } = useAppState()
  const c = content[language]

  return (
    <article lang={language} className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-4xl font-semibold text-primary">{c.title}</h1>
        <p className="text-sm text-muted">{c.lastUpdated}</p>
      </header>

      {c.sections.map((section) => (
        <section key={section.heading} className="rounded-lg border border-white/10 bg-surface p-5 space-y-3">
          <h2 className="text-lg font-semibold text-primary">{section.heading}</h2>
          <div className="space-y-3 leading-7 text-muted">
            {section.paragraphs.map((para, i) => (
              <p key={i} className="whitespace-pre-line">{para}</p>
            ))}
          </div>
        </section>
      ))}

      <p className="text-sm text-muted">
        {language === 'de' ? 'Zum Impressum: ' : language === 'tr' ? 'Künye için: ' : 'Legal notice: '}
        <Link href="/imprint" className="text-gold underline underline-offset-2 hover:text-gold/80">
          {language === 'de' ? 'Impressum' : language === 'tr' ? 'Künye' : 'Imprint'}
        </Link>
      </p>
    </article>
  )
}

