'use client'

import Link from 'next/link'
import { useAppState } from '@/hooks/useAppState'
import type { Language } from '@/types/language'
import { ObfuscatedEmail } from '@/components/ObfuscatedEmail'

// The app uses Vercel Analytics + Speed Insights (see RootDocument.tsx).
// Push reminders use Supabase for storing technical push subscriptions.
// IMPORTANT before publishing:
// Replace OPERATOR_NAME and OPERATOR_ADDRESS with the real operator details.
const OPERATOR_NAME = '[Vorname Nachname]'
const OPERATOR_ADDRESS = '[Straße und Hausnummer, PLZ Ort, Land]'

// E-Mail is intentionally NOT stored here → see <ObfuscatedEmail />

// A paragraph is either plain text OR a sentence that contains the e-mail
// address split into a prefix and a suffix around the <ObfuscatedEmail />.
type Paragraph = string | { before: string; isEmail: true; after: string }

type PolicyContent = {
  title: string
  lastUpdated: string
  sections: { heading: string; paragraphs: Paragraph[] }[]
}

const content: Record<Language, PolicyContent> = {
  de: {
    title: 'Datenschutzerklärung',
    lastUpdated: 'Stand: Mai 2026',
    sections: [
      {
        heading: '1. Verantwortlicher',
        paragraphs: [
          `Verantwortlich für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) ist: ${OPERATOR_NAME}, ${OPERATOR_ADDRESS}.`,
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
          'Diese App speichert folgende Daten lokal im Browserspeicher (localStorage) Ihres Geräts: Spracheinstellung, Lernfortschritt (welche Namen als gelernt markiert wurden), Favoritenliste, zuletzt angesehene Namen sowie den lokalen Status optionaler Push-Erinnerungen.',
          'Diese lokalen Daten verlassen Ihr Gerät nicht. Sie können diese Daten jederzeit selbst löschen – über die Einstellungsseite der App oder direkt in Ihren Browsereinstellungen.',
          'Die Nutzung des lokalen Browserspeichers erfolgt ausschließlich zur Bereitstellung der von Ihnen gewünschten App-Funktionen. Es findet keine Nutzung zu Werbe-, Tracking- oder Profilingzwecken statt.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung einer funktionsfähigen Anwendung).',
        ],
      },
      {
        heading: '4. Push-Benachrichtigungen',
        paragraphs: [
          'Wenn Sie Push-Erinnerungen ausdrücklich aktivieren, speichern wir den Browser-Push-Endpunkt, technische Push-Schlüssel, das gewählte Erinnerungsintervall, die Zeitzone, den User-Agent, Versandzeitpunkte, Fehlerstatus und technische Zustellprotokolle in Supabase.',
          'Diese Daten werden ausschließlich verwendet, um die von Ihnen gewünschten Lern-Erinnerungen zuzustellen, fehlerhafte Abonnements zu erkennen und ungültige Push-Abonnements zu deaktivieren.',
          'Je nach Browser und Betriebssystem wird die technische Zustellung der Push-Benachrichtigung über Push-Dienste des jeweiligen Browser- oder Betriebssystem-Anbieters abgewickelt, z. B. durch Apple, Google, Mozilla oder Microsoft.',
          'Sie können Push-Benachrichtigungen jederzeit in der App oder in den Browser- bzw. Geräteeinstellungen deaktivieren. Beim Deaktivieren wird das Push-Abonnement serverseitig deaktiviert, soweit dies technisch möglich ist.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO für die Aktivierung der Push-Erinnerungen sowie Art. 6 Abs. 1 lit. f DSGVO für den sicheren technischen Betrieb, die Fehlerbehandlung und die Deaktivierung ungültiger Abonnements.',
        ],
      },
      {
        heading: '5. Supabase',
        paragraphs: [
          'Zur Speicherung optionaler Push-Abonnements verwenden wir Supabase, einen Dienst der Supabase Inc. Supabase stellt die technische Datenbank-Infrastruktur bereit.',
          'Gespeichert werden nur die für Push-Erinnerungen erforderlichen technischen Daten, insbesondere Push-Endpunkt, Push-Schlüssel, Erinnerungsintervall, Zeitzone, technische Zustellinformationen und Fehlerstatus.',
          'Die Verarbeitung erfolgt, soweit erforderlich, auf Grundlage eines Auftragsverarbeitungsvertrags. Soweit Daten in Drittländer übermittelt werden, erfolgt dies nach den jeweils anwendbaren Datenschutzgarantien.',
          'Die gespeicherten Push-Daten werden gelöscht oder deaktiviert, wenn Sie Push-Benachrichtigungen deaktivieren, das Abonnement ungültig wird oder die Speicherung für den genannten Zweck nicht mehr erforderlich ist.',
        ],
      },
      {
        heading: '6. Vercel Analytics & Speed Insights',
        paragraphs: [
          'Diese Website verwendet Vercel Analytics und Vercel Speed Insights, Dienste der Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.',
          'Vercel Analytics erfasst nach Anbieterangaben cookielose, datensparsame Nutzungsdaten, z. B. aufgerufene Seiten, ungefähre geografische Region, Gerätetyp und Herkunft des Besuchs. Vercel Speed Insights misst Seitenlade-Performance und technische Leistungswerte.',
          'Nach aktuellem Stand von Vercel werden für diese Dienste keine Cookies gesetzt und keine personenbezogenen Identifikatoren für werbliches Tracking verwendet.',
          'Da Vercel Inc. in den USA ansässig ist, können Daten in die USA übermittelt werden. Vercel ist unter dem EU-U.S. Data Privacy Framework zertifiziert, sodass ein angemessenes Datenschutzniveau gewährleistet ist.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Optimierung der Website und Erkennung technischer Fehler). Sie können der Verarbeitung widersprechen, indem Sie Ihren Browser so konfigurieren, dass JavaScript von vercel.com/insights blockiert wird.',
          'Weitere Informationen: https://vercel.com/legal/privacy-policy',
        ],
      },
      {
        heading: '7. Kontaktformular (Web3Forms)',
        paragraphs: [
          'Wenn Sie das Kontaktformular nutzen, werden Name, E-Mail-Adresse und Ihre Nachricht über den Dienst Web3Forms (Web3Forms, https://web3forms.com) an unsere E-Mail-Adresse übermittelt.',
          'Web3Forms übermittelt die Daten direkt per E-Mail weiter und speichert diese nach eigenen Angaben nicht dauerhaft auf seinen Servern. Der öffentliche API-Schlüssel ist im Quellcode der Website sichtbar; er berechtigt lediglich zum Senden von Formularen an unsere E-Mail-Adresse.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung durch Absenden des Formulars). Die übermittelten Daten werden ausschließlich zur Beantwortung Ihrer Anfrage verwendet und danach gelöscht, spätestens nach 90 Tagen.',
          'Weitere Informationen zu Web3Forms: https://web3forms.com/privacy',
        ],
      },
      {
        heading: '8. Cookies und vergleichbare Technologien',
        paragraphs: [
          'Diese Website setzt keine Cookies. Es werden keine Session-, Tracking- oder Marketing-Cookies verwendet.',
          'Für grundlegende App-Funktionen verwenden wir lokalen Browserspeicher (localStorage), z. B. für Spracheinstellung, Lernfortschritt, Favoriten und lokale Erinnerungseinstellungen. Diese Speicherung ist erforderlich, um die ausdrücklich gewünschten App-Funktionen bereitzustellen.',
          'Es findet keine Nutzung des localStorage zu Werbe-, Tracking- oder Profilingzwecken statt.',
        ],
      },
      {
        heading: '9. Server-Logs',
        paragraphs: [
          'Der Hosting-Anbieter (Vercel Inc.) kann technische Zugriffsdaten protokollieren, z. B. IP-Adresse, Zeitstempel, abgerufene URL und HTTP-Statuscode. Diese Daten werden zur Bereitstellung, Sicherheit und Fehleranalyse der Website verarbeitet und nicht für Marketing- oder Profilingzwecke genutzt.',
          'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Sicherstellung des technischen Betriebs, der Sicherheit und der Fehleranalyse).',
        ],
      },
      {
        heading: '10. Ihre Rechte',
        paragraphs: [
          'Sie haben nach der DSGVO folgende Rechte gegenüber dem Verantwortlichen:',
          '• Recht auf Auskunft (Art. 15 DSGVO)\n• Recht auf Berichtigung (Art. 16 DSGVO)\n• Recht auf Löschung (Art. 17 DSGVO)\n• Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)\n• Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)\n• Recht auf Datenübertragbarkeit (Art. 20 DSGVO)',
          { before: 'Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an: ', isEmail: true, after: '' },
          'Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs haben Sie das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen die DSGVO verstößt.',
        ],
      },
      {
        heading: '11. Änderungen dieser Datenschutzerklärung',
        paragraphs: [
          'Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie stets den aktuellen rechtlichen Anforderungen und den tatsächlich eingesetzten Funktionen anzupassen. Bitte prüfen Sie bei regelmäßigen Besuchen die aktuelle Fassung.',
        ],
      },
    ],
  },

  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: May 2026',
    sections: [
      {
        heading: '1. Data controller',
        paragraphs: [
          `The controller for data processing within the meaning of the General Data Protection Regulation (GDPR) is: ${OPERATOR_NAME}, ${OPERATOR_ADDRESS}.`,
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
          'This app stores the following data in the local browser storage (localStorage) of your device: language setting, learning progress (which names have been marked as learned), favourites list, most recently viewed names, and local state for optional push reminders.',
          'This local data does not leave your device. You can delete it at any time via the app\'s Settings page or directly in your browser settings.',
          'Local browser storage is used only to provide the app functions requested by you. It is not used for advertising, tracking, or profiling purposes.',
          'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in providing a functioning application).',
        ],
      },
      {
        heading: '4. Push notifications',
        paragraphs: [
          'If you explicitly enable push reminders, we store the browser push endpoint, technical push keys, selected reminder interval, timezone, user agent, delivery timestamps, failure state, and technical delivery logs in Supabase.',
          'This data is used exclusively to deliver the learning reminders requested by you, detect failed subscriptions, and disable invalid push subscriptions.',
          'Depending on your browser and operating system, the technical delivery of push notifications may be handled through push services provided by the respective browser or operating system provider, such as Apple, Google, Mozilla, or Microsoft.',
          'You can disable push notifications at any time in the app or in your browser or device settings. When disabled, the push subscription is deactivated on the server side where technically possible.',
          'Legal basis: Art. 6(1)(a) GDPR for enabling push reminders and Art. 6(1)(f) GDPR for secure technical operation, error handling, and deactivation of invalid subscriptions.',
        ],
      },
      {
        heading: '5. Supabase',
        paragraphs: [
          'We use Supabase, a service provided by Supabase Inc., to store optional push subscriptions. Supabase provides the technical database infrastructure.',
          'Only the technical data required for push reminders is stored, in particular the push endpoint, push keys, reminder interval, timezone, technical delivery information, and failure state.',
          'Where required, processing is carried out on the basis of a data processing agreement. Where data is transferred to third countries, this is done under the applicable data protection safeguards.',
          'Stored push data is deleted or deactivated when you disable push notifications, when the subscription becomes invalid, or when storage is no longer necessary for the stated purpose.',
        ],
      },
      {
        heading: '6. Vercel Analytics & Speed Insights',
        paragraphs: [
          'This website uses Vercel Analytics and Vercel Speed Insights, services provided by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.',
          'According to Vercel, Vercel Analytics collects cookie-free, data-minimised usage data, such as pages visited, approximate geographic region, device type, and referral source. Vercel Speed Insights measures page-load performance and technical performance metrics.',
          'According to Vercel\'s current documentation, these services do not set cookies and do not use personal identifiers for advertising tracking.',
          'Because Vercel Inc. is located in the United States, data may be transferred there. Vercel is certified under the EU–U.S. Data Privacy Framework, ensuring an adequate level of data protection.',
          'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in optimising the website and detecting technical errors). You can object to this processing by configuring your browser to block JavaScript from vercel.com/insights.',
          'Privacy policy: https://vercel.com/legal/privacy-policy',
        ],
      },
      {
        heading: '7. Contact form (Web3Forms)',
        paragraphs: [
          'When you use the contact form, your name, email address, and message are transmitted to our email address via the Web3Forms service (https://web3forms.com).',
          'Web3Forms forwards the data directly by email and, according to its documentation, does not permanently store it on its servers. The public API key is visible in the website source code; it only authorises sending form submissions to our email address.',
          'Legal basis: Art. 6(1)(a) GDPR (your consent by submitting the form). The transmitted data is used solely to respond to your enquiry and is deleted thereafter, at the latest after 90 days.',
          'Web3Forms privacy policy: https://web3forms.com/privacy',
        ],
      },
      {
        heading: '8. Cookies and similar technologies',
        paragraphs: [
          'This website does not set any cookies. No session, tracking, or marketing cookies are used.',
          'For basic app functions, we use local browser storage (localStorage), for example for language settings, learning progress, favourites, and local reminder settings. This storage is necessary to provide the app functions explicitly requested by you.',
          'localStorage is not used for advertising, tracking, or profiling purposes.',
        ],
      },
      {
        heading: '9. Server logs',
        paragraphs: [
          'The hosting provider (Vercel Inc.) may log technical access data, such as IP address, timestamp, requested URL, and HTTP status code. This data is processed to provide, secure, and troubleshoot the website and is not used for marketing or profiling purposes.',
          'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in ensuring technical operation, security, and error analysis).',
        ],
      },
      {
        heading: '10. Your rights',
        paragraphs: [
          'Under the GDPR you have the following rights against the data controller:',
          '• Right of access (Art. 15 GDPR)\n• Right to rectification (Art. 16 GDPR)\n• Right to erasure (Art. 17 GDPR)\n• Right to restriction of processing (Art. 18 GDPR)\n• Right to object to processing (Art. 21 GDPR)\n• Right to data portability (Art. 20 GDPR)',
          { before: 'To exercise your rights, please contact us by email at: ', isEmail: true, after: '' },
          'Without prejudice to any other administrative or judicial remedy, you have the right to lodge a complaint with a data protection supervisory authority if you believe that the processing of your data violates the GDPR.',
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
    sections: [
      {
        heading: '1. Veri sorumlusu',
        paragraphs: [
          `Genel Veri Koruma Yönetmeliği (GDPR/DSGVO) kapsamında veri sorumlusu: ${OPERATOR_NAME}, ${OPERATOR_ADDRESS}.`,
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
          'Bu uygulama aşağıdaki verileri cihazınızın yerel tarayıcı belleğinde (localStorage) saklar: dil tercihi, öğrenme ilerleme durumu (hangi isimlerin öğrenildi olarak işaretlendiği), favori listesi, en son görüntülenen isimler ve isteğe bağlı push hatırlatmaları için yerel durum.',
          'Bu yerel veriler cihazınızı terk etmez. Uygulamanın Ayarlar sayfasından veya doğrudan tarayıcı ayarlarınızdan bu verileri istediğiniz zaman silebilirsiniz.',
          'Yerel tarayıcı depolama alanı yalnızca talep ettiğiniz uygulama işlevlerini sunmak için kullanılır. Reklam, izleme veya profil oluşturma amacıyla kullanılmaz.',
          'Hukuki dayanak: GDPR Madde 6(1)(f) – işlevsel bir uygulama sunmaya yönelik meşru menfaat.',
        ],
      },
      {
        heading: '4. Push bildirimleri',
        paragraphs: [
          'Push hatırlatmalarını açıkça etkinleştirirseniz, tarayıcı push uç noktasını, teknik push anahtarlarını, seçilen hatırlatma aralığını, saat dilimini, user-agent bilgisini, gönderim zamanlarını, hata durumunu ve teknik teslimat günlüklerini Supabase içinde saklarız.',
          'Bu veriler yalnızca talep ettiğiniz öğrenme hatırlatmalarını göndermek, başarısız abonelikleri tespit etmek ve geçersiz push aboneliklerini devre dışı bırakmak için kullanılır.',
          'Tarayıcınıza ve işletim sisteminize bağlı olarak push bildirimlerinin teknik teslimi Apple, Google, Mozilla veya Microsoft gibi ilgili tarayıcı ya da işletim sistemi sağlayıcılarının push hizmetleri üzerinden gerçekleştirilebilir.',
          'Push bildirimlerini istediğiniz zaman uygulama içinde veya tarayıcı ya da cihaz ayarlarınızdan devre dışı bırakabilirsiniz. Devre dışı bırakıldığında, teknik olarak mümkün olduğu ölçüde push aboneliği sunucu tarafında devre dışı bırakılır.',
          'Hukuki dayanak: Push hatırlatmalarının etkinleştirilmesi için GDPR Madde 6(1)(a); güvenli teknik işletim, hata yönetimi ve geçersiz aboneliklerin devre dışı bırakılması için GDPR Madde 6(1)(f).',
        ],
      },
      {
        heading: '5. Supabase',
        paragraphs: [
          'İsteğe bağlı push aboneliklerini saklamak için Supabase Inc. tarafından sunulan Supabase hizmetini kullanıyoruz. Supabase teknik veritabanı altyapısını sağlar.',
          'Yalnızca push hatırlatmaları için gerekli teknik veriler saklanır; özellikle push uç noktası, push anahtarları, hatırlatma aralığı, saat dilimi, teknik teslimat bilgileri ve hata durumu.',
          'Gerekli olduğu durumlarda işleme, bir veri işleme sözleşmesi temelinde gerçekleştirilir. Verilerin üçüncü ülkelere aktarılması halinde, bu aktarım geçerli veri koruma güvencelerine uygun şekilde yapılır.',
          'Saklanan push verileri, push bildirimlerini devre dışı bıraktığınızda, abonelik geçersiz hale geldiğinde veya belirtilen amaç için saklama artık gerekli olmadığında silinir ya da devre dışı bırakılır.',
        ],
      },
      {
        heading: '6. Vercel Analytics ve Speed Insights',
        paragraphs: [
          'Bu web sitesi, Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, ABD) tarafından sunulan Vercel Analytics ve Vercel Speed Insights hizmetlerini kullanmaktadır.',
          'Vercel\'in açıklamalarına göre Vercel Analytics çerezsiz ve veri minimizasyonuna uygun kullanım verilerini toplar; örneğin ziyaret edilen sayfalar, yaklaşık coğrafi bölge, cihaz türü ve yönlendirme kaynağı. Vercel Speed Insights sayfa yüklenme performansını ve teknik performans değerlerini ölçer.',
          'Vercel\'in güncel belgelerine göre bu hizmetler çerez yerleştirmez ve reklam takibi için kişisel tanımlayıcılar kullanmaz.',
          'Vercel Inc. Amerika Birleşik Devletleri\'nde bulunduğundan veriler ABD\'ye aktarılabilir. Vercel, AB-ABD Veri Gizliliği Çerçevesi kapsamında sertifikalıdır ve yeterli düzeyde veri koruma güvencesi sağlanmaktadır.',
          'Hukuki dayanak: GDPR Madde 6(1)(f) – web sitesini optimize etmeye ve teknik hataları tespit etmeye yönelik meşru menfaat. Tarayıcınızı vercel.com/insights adresinden gelen JavaScript\'i engelleyecek şekilde yapılandırarak bu işlemeye itiraz edebilirsiniz.',
          'Vercel gizlilik politikası: https://vercel.com/legal/privacy-policy',
        ],
      },
      {
        heading: '7. İletişim formu (Web3Forms)',
        paragraphs: [
          'İletişim formunu kullandığınızda adınız, e-posta adresiniz ve mesajınız Web3Forms hizmeti (https://web3forms.com) aracılığıyla e-posta adresimize iletilir.',
          'Web3Forms verileri doğrudan e-posta yoluyla iletmekte ve belgelere göre kendi sunucularında kalıcı olarak saklamamaktadır. Web sitesi kaynak kodunda görünen genel API anahtarı yalnızca form gönderimlerinin e-posta adresimize iletilmesine olanak tanır.',
          'Hukuki dayanak: GDPR Madde 6(1)(a) – formu göndererek verdiğiniz onay. İletilen veriler yalnızca sorunuzu yanıtlamak amacıyla kullanılır ve en geç 90 gün içinde silinir.',
          'Web3Forms gizlilik politikası: https://web3forms.com/privacy',
        ],
      },
      {
        heading: '8. Çerezler ve benzer teknolojiler',
        paragraphs: [
          'Bu web sitesi herhangi bir çerez kullanmaz. Oturum, izleme veya pazarlama çerezleri kullanılmaz.',
          'Temel uygulama işlevleri için yerel tarayıcı depolama alanı (localStorage) kullanılır; örneğin dil ayarları, öğrenme ilerlemesi, favoriler ve yerel hatırlatma ayarları. Bu depolama, açıkça talep ettiğiniz uygulama işlevlerini sunmak için gereklidir.',
          'localStorage reklam, izleme veya profil oluşturma amacıyla kullanılmaz.',
        ],
      },
      {
        heading: '9. Sunucu günlükleri',
        paragraphs: [
          'Barındırma sağlayıcısı (Vercel Inc.) IP adresi, zaman damgası, istenen URL ve HTTP durum kodu gibi teknik erişim verilerini kayıt altına alabilir. Bu veriler web sitesini sunmak, güvenliğini sağlamak ve hataları analiz etmek için işlenir; pazarlama veya profil oluşturma amacıyla kullanılmaz.',
          'Hukuki dayanak: GDPR Madde 6(1)(f) – teknik işletimin, güvenliğin ve hata analizinin sağlanmasına yönelik meşru menfaat.',
        ],
      },
      {
        heading: '10. Haklarınız',
        paragraphs: [
          'GDPR kapsamında veri sorumlusuna karşı aşağıdaki haklara sahipsiniz:',
          '• Erişim hakkı (Madde 15)\n• Düzeltme hakkı (Madde 16)\n• Silme hakkı (Madde 17)\n• İşlemeyi kısıtlama hakkı (Madde 18)\n• İşlemeye itiraz hakkı (Madde 21)\n• Veri taşınabilirliği hakkı (Madde 20)',
          { before: 'Haklarınızı kullanmak için lütfen e-posta ile iletişime geçin: ', isEmail: true, after: '' },
          'Başka bir idari veya yargısal başvuru yoluna halel gelmeksizin, verilerinizin GDPR\'a aykırı olarak işlendiğine inanıyorsanız bir veri koruma denetim makamına şikayette bulunma hakkına sahipsiniz.',
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
          <Link href="/imprint" className="text-gold underline underline-offset-2 hover:text-gold/80">
            {language === 'de' ? 'Impressum' : language === 'tr' ? 'Künye' : 'Imprint'}
          </Link>
        </p>
      </article>
  )
}
