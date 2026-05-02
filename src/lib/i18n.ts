import type { Language } from '@/types/language'

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'tr', label: 'Türkçe' },
]

export type Dict = {
  nav: {
    home: string
    names: string
    learn: string
    settings: string
    aid: string
    main: string
    mobile: string
  }
  share: {
    button: string
    title: string
    text: string
    copied: string
    failed: string
  }
  common: {
    back: string
    overview: string
    details: string
    learned: string
    favorite: string
    removeFavorite: string
    open: string
    meaning: string
    explanation: string
    dua: string
    reflection: string
    sourceNote: string
    nextName: string
    pronunciation: string
    none: string
    notPlanned: string
  }
  home: {
    eyebrow: string
    title: string
    subtitle: string
    nameOfDay: string
    viewAll: string
    startLearning: string
    openDetails: string
    schedule: string
    due: string
    notDue: string
    scheduleNote: string
  }
  progress: {
    title: string
    learned: string
  }
  names: {
    eyebrow: string
    title: string
    search: string
    searchPlaceholder: string
    filterAll: string
    filterLearned: string
    filterFavorites: string
    filterOpen: string
    noResults: string
  }
  learn: {
    eyebrow: string
    title: string
    remaining: (count: number) => string
    markLearned: string
    next: string
    details: string
    allLearnedTitle: string
    allLearnedBody: string
    overview: string
    showMeaning: string
    recallPrompt: string
    overallLearned: (learned: number, total: number) => string
    sessionLearned: (count: number) => string
    keyboard: string
  }
  detail: {
    backToOverview: string
    markOpen: string
    markLearned: string
    addFavorite: string
    removeFavorite: string
    back: string
    next: string
  }
  settings: {
    eyebrow: string
    title: string
    language: string
    schedule: string
    scheduleBody: string
    active: string
    interval: string
    every2h: string
    every6h: string
    daily: string
    lastCompleted: string
    nextDue: string
    localData: string
    localDataBody: (learned: number, favorites: number, lastViewed: string) => string
    resetProgress: string
    resetConfirm: string
    notificationNote: string
  }
  contact: {
    eyebrow: string
    title: string
    intro: string
    name: string
    email: string
    message: string
    send: string
    sending: string
    success: string
    error: string
    noKey: string
  }
  validation: {
    nameRequired: string
    nameTooLong: string
    emailRequired: string
    emailInvalid: string
    emailTooLong: string
    messageRequired: string
    messageTooLong: string
    honeypot: string
  }
  privacy: {
    title: string
    p1: string
    p2: string
    p3: string
  }
  imprint: {
    title: string
    p1: string
    p2: string
  }
  offline: {
    title: string
    p1: string
    p2: string
  }
}

const de: Dict = {
  nav: {
    home: 'Start',
    names: 'Namen',
    learn: 'Lernen',
    settings: 'Einstellungen',
    aid: 'Lernhilfe',
    main: 'Hauptnavigation',
    mobile: 'Mobile Navigation',
  },
  share: {
    button: 'Teilen',
    title: 'Daily Husna',
    text: 'Lerne die 99 Namen Allahs mit Daily Husna.',
    copied: 'Kopiert',
    failed: 'Fehler',
  },
  common: {
    back: 'Zurück',
    overview: 'Übersicht',
    details: 'Details',
    learned: 'Gelernt',
    favorite: 'Favorit',
    removeFavorite: 'Favorit entfernen',
    open: 'Offen',
    meaning: 'Bedeutung',
    explanation: 'Erklärung',
    dua: 'Dua',
    reflection: 'Reflexion',
    sourceNote: 'Hinweis',
    nextName: 'Nächster Name',
    pronunciation: 'Aussprache',
    none: 'Keine',
    notPlanned: 'Nicht geplant',
  },
  home: {
    eyebrow: '99 Namen',
    title: 'Die 99 Namen Allahs als ruhige Lernhilfe.',
    subtitle: 'Suche, markiere deinen Fortschritt und lerne in deinem Tempo. Die Inhalte sind bewusst vorsichtig formuliert und müssen vor einer Veröffentlichung fachkundig geprüft werden.',
    nameOfDay: 'Name des Tages',
    viewAll: 'Alle Namen ansehen',
    startLearning: 'Lernmodus starten',
    openDetails: 'Details öffnen',
    schedule: 'Lernplan',
    due: 'Eine Lerneinheit ist fällig.',
    notDue: 'Kein fälliger Hinweis.',
    scheduleNote: 'Hinweise erscheinen in der geöffneten App. Native Push-Erinnerungen können in den Einstellungen zusätzlich aktiviert werden.',
  },
  progress: {
    title: 'Fortschritt',
    learned: 'gelernt',
  },
  names: {
    eyebrow: 'Übersicht',
    title: 'Alle 99 Namen',
    search: 'Suche',
    searchPlaceholder: 'Arabisch, Transliteration oder Bedeutung',
    filterAll: 'Alle',
    filterLearned: 'Gelernt',
    filterFavorites: 'Favoriten',
    filterOpen: 'Offen',
    noResults: 'Keine Namen passen zu deiner Suche oder dem Filter.',
  },
  learn: {
    eyebrow: 'Lernmodus',
    title: 'Nächster offener Name',
    remaining: (count) => `${count} Namen noch offen`,
    markLearned: 'Als gelernt markieren',
    next: 'Überspringen',
    details: 'Details',
    allLearnedTitle: 'Alle Namen sind als gelernt markiert.',
    allLearnedBody: 'Du kannst deinen Fortschritt in den Einstellungen zurücksetzen oder einzelne Namen wieder als offen markieren.',
    overview: 'Zur Übersicht',
    showMeaning: 'Bedeutung aufdecken',
    recallPrompt: 'Versuche die Bedeutung zu erinnern …',
    overallLearned: (learned, total) => `${learned} von ${total} gelernt`,
    sessionLearned: (count) => `+${count} heute`,
    keyboard: '␣ aufdecken · L gelernt · N überspringen · F Favorit',
  },
  detail: {
    backToOverview: 'Zur Übersicht',
    markOpen: 'Als offen markieren',
    markLearned: 'Als gelernt markieren',
    addFavorite: 'Favorit',
    removeFavorite: 'Favorit entfernen',
    back: 'Zurück',
    next: 'Nächster Name',
  },
  settings: {
    eyebrow: 'Setup',
    title: 'Einstellungen',
    language: 'Sprache',
    schedule: 'Lernplan',
    scheduleBody: 'Nur lokale Hinweise innerhalb der geöffneten App.',
    active: 'Aktiv',
    interval: 'Intervall',
    every2h: 'Alle 2 Stunden',
    every6h: 'Alle 6 Stunden',
    daily: 'Täglich',
    lastCompleted: 'Letzte Einheit',
    nextDue: 'Nächster Hinweis',
    localData: 'Lokale Daten',
    localDataBody: (learned, favorites, lastViewed) => `Gelernt: ${learned}, Favoriten: ${favorites}, zuletzt angesehen: ${lastViewed}.`,
    resetProgress: 'Fortschritt zurücksetzen',
    resetConfirm: 'Fortschritt wirklich zurücksetzen?',
    notificationNote: 'Push-Erinnerungen sind optional und werden erst nach ausdrücklicher Aktivierung im Browser eingerichtet.',
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Nachricht senden',
    intro: 'Das Formular nutzt Web3Forms im Browser. Ohne konfigurierten Zugriffsschlüssel wird das Absenden blockiert.',
    name: 'Name',
    email: 'E-Mail',
    message: 'Nachricht',
    send: 'Senden',
    sending: 'Senden...',
    success: 'Deine Nachricht wurde gesendet.',
    error: 'Die Nachricht konnte gerade nicht gesendet werden. Bitte versuche es später erneut.',
    noKey: 'Das Kontaktformular ist noch nicht konfiguriert.',
  },
  validation: {
    nameRequired: 'Name ist erforderlich',
    nameTooLong: 'Name darf höchstens 100 Zeichen lang sein',
    emailRequired: 'E-Mail ist erforderlich',
    emailInvalid: 'Bitte gib eine gültige E-Mail-Adresse ein',
    emailTooLong: 'E-Mail darf höchstens 200 Zeichen lang sein',
    messageRequired: 'Nachricht ist erforderlich',
    messageTooLong: 'Nachricht darf höchstens 2000 Zeichen lang sein',
    honeypot: 'Diese Nachricht kann nicht gesendet werden',
  },
  privacy: {
    title: 'Datenschutz',
    p1: 'Diese App speichert Sprache, Fortschritt, Favoriten, zuletzt angesehene Namen und Lernplan-Einstellungen lokal im Browser über localStorage.',
    p2: 'Es werden keine Tracking-Cookies verwendet. Push-Benachrichtigungen sind optional und müssen im Browser ausdrücklich aktiviert werden.',
    p3: 'Das Kontaktformular sendet die eingegebenen Daten an Web3Forms. Der öffentliche Web3Forms-Schlüssel ist im Client sichtbar.',
  },
  imprint: {
    title: 'Impressum',
    p1: 'Platzhalter: Betreiberangaben müssen vor einer Veröffentlichung ergänzt werden.',
    p2: 'Es wurden bewusst keine Namen, Adressen, Firmen oder Kontaktdaten erfunden.',
  },
  offline: {
    title: 'Offline',
    p1: 'Du bist offline. Bereits zwischengespeicherte App-Seiten und die lokal gebündelten Namen bleiben nutzbar.',
    p2: 'Das Kontaktformular benötigt eine Netzwerkverbindung.',
  },
}

const tr: Dict = {
  nav: {
    home: 'Ana Sayfa',
    names: 'İsimler',
    learn: 'Öğren',
    settings: 'Ayarlar',
    aid: 'Öğrenme yardımı',
    main: 'Ana gezinme',
    mobile: 'Mobil gezinme',
  },
  share: {
    button: 'Paylaş',
    title: 'Daily Husna',
    text: "Daily Husna ile Allah'ın 99 İsmini öğren.",
    copied: 'Kopyalandı',
    failed: 'Hata',
  },
  common: {
    back: 'Geri',
    overview: 'Genel bakış',
    details: 'Detaylar',
    learned: 'Öğrenildi',
    favorite: 'Favori',
    removeFavorite: 'Favoriden kaldır',
    open: 'Açık',
    meaning: 'Anlam',
    explanation: 'Açıklama',
    dua: 'Dua',
    reflection: 'Tefekkür',
    sourceNote: 'Not',
    nextName: 'Sonraki isim',
    pronunciation: 'Telaffuz',
    none: 'Yok',
    notPlanned: 'Planlanmadı',
  },
  home: {
    eyebrow: '99 İsim',
    title: "Allah'ın 99 İsmi için sakin bir öğrenme yardımı.",
    subtitle: 'Ara, ilerlemeni işaretle ve kendi hızında öğren. İçerikler bilinçli olarak ihtiyatlı yazılmıştır ve yayımlanmadan önce uzman kişilerce incelenmelidir.',
    nameOfDay: 'Günün İsmi',
    viewAll: 'Tüm isimleri gör',
    startLearning: 'Öğrenme modunu başlat',
    openDetails: 'Detayları aç',
    schedule: 'Öğrenme planı',
    due: 'Bir öğrenme oturumu zamanı geldi.',
    notDue: 'Şu anda hatırlatma yok.',
    scheduleNote: 'Hatırlatmalar uygulama açıkken görünür. Yerel push hatırlatmaları Ayarlar bölümünde ayrıca etkinleştirilebilir.',
  },
  progress: {
    title: 'İlerleme',
    learned: 'öğrenildi',
  },
  names: {
    eyebrow: 'Genel bakış',
    title: '99 İsmin Tamamı',
    search: 'Ara',
    searchPlaceholder: 'Arapça, transliterasyon veya anlam',
    filterAll: 'Tümü',
    filterLearned: 'Öğrenilen',
    filterFavorites: 'Favoriler',
    filterOpen: 'Açık',
    noResults: 'Aramana veya filtreye uygun isim bulunamadı.',
  },
  learn: {
    eyebrow: 'Öğrenme modu',
    title: 'Sonraki açık isim',
    remaining: (count) => `${count} isim henüz açık`,
    markLearned: 'Öğrenildi olarak işaretle',
    next: 'Atla',
    details: 'Detaylar',
    allLearnedTitle: 'Tüm isimler öğrenildi olarak işaretlendi.',
    allLearnedBody: 'Ayarlar bölümünde ilerlemeni sıfırlayabilir veya tek tek isimleri tekrar açık olarak işaretleyebilirsin.',
    overview: 'Genel bakışa git',
    showMeaning: 'Anlamı göster',
    recallPrompt: 'Anlamını hatırlamaya çalış …',
    overallLearned: (learned, total) => `${total} isimden ${learned} öğrenildi`,
    sessionLearned: (count) => `+${count} bugün`,
    keyboard: '␣ göster · L öğrenildi · N atla · F favori',
  },
  detail: {
    backToOverview: 'Genel bakışa dön',
    markOpen: 'Açık olarak işaretle',
    markLearned: 'Öğrenildi olarak işaretle',
    addFavorite: 'Favori',
    removeFavorite: 'Favoriden kaldır',
    back: 'Geri',
    next: 'Sonraki isim',
  },
  settings: {
    eyebrow: 'Ayarlar',
    title: 'Ayarlar',
    language: 'Dil',
    schedule: 'Öğrenme planı',
    scheduleBody: 'Yalnızca açık uygulama içinde yerel hatırlatmalar.',
    active: 'Aktif',
    interval: 'Aralık',
    every2h: 'Her 2 saatte bir',
    every6h: 'Her 6 saatte bir',
    daily: 'Günlük',
    lastCompleted: 'Son oturum',
    nextDue: 'Sonraki hatırlatma',
    localData: 'Yerel veriler',
    localDataBody: (learned, favorites, lastViewed) => `Öğrenilen: ${learned}, favoriler: ${favorites}, son görüntülenen: ${lastViewed}.`,
    resetProgress: 'İlerlemeyi sıfırla',
    resetConfirm: 'İlerleme gerçekten sıfırlansın mı?',
    notificationNote: 'Push hatırlatmaları isteğe bağlıdır ve yalnızca tarayıcıda açıkça etkinleştirildikten sonra kurulur.',
  },
  contact: {
    eyebrow: 'İletişim',
    title: 'Mesaj gönder',
    intro: 'Form Web3Forms hizmetini tarayıcıda kullanır. Yapılandırılmış erişim anahtarı yoksa gönderim engellenir.',
    name: 'Ad',
    email: 'E-posta',
    message: 'Mesaj',
    send: 'Gönder',
    sending: 'Gönderiliyor...',
    success: 'Mesajın gönderildi.',
    error: 'Mesaj şu anda gönderilemedi. Lütfen daha sonra tekrar dene.',
    noKey: 'İletişim formu henüz yapılandırılmadı.',
  },
  validation: {
    nameRequired: 'Ad zorunludur',
    nameTooLong: 'Ad en fazla 100 karakter olabilir',
    emailRequired: 'E-posta zorunludur',
    emailInvalid: 'Lütfen geçerli bir e-posta adresi gir',
    emailTooLong: 'E-posta en fazla 200 karakter olabilir',
    messageRequired: 'Mesaj zorunludur',
    messageTooLong: 'Mesaj en fazla 2000 karakter olabilir',
    honeypot: 'Bu mesaj gönderilemez',
  },
  privacy: {
    title: 'Gizlilik',
    p1: 'Bu uygulama dili, ilerlemeyi, favorileri, son görüntülenen isimleri ve öğrenme planı ayarlarını tarayıcıda localStorage ile yerel olarak saklar.',
    p2: 'Takip çerezleri kullanılmaz. Push bildirimleri isteğe bağlıdır ve tarayıcıda açıkça etkinleştirilmelidir.',
    p3: 'İletişim formu girilen verileri Web3Forms hizmetine gönderir. Genel Web3Forms anahtarı istemci tarafında görünür.',
  },
  imprint: {
    title: 'Künye',
    p1: 'Yer tutucu: Yayımlamadan önce işletici bilgileri eklenmelidir.',
    p2: 'Bilinçli olarak isim, adres, şirket veya iletişim bilgisi uydurulmadı.',
  },
  offline: {
    title: 'Çevrim dışı',
    p1: 'Çevrim dışısın. Önceden önbelleğe alınmış uygulama sayfaları ve yerel olarak paketlenen isimler kullanılabilir kalır.',
    p2: 'İletişim formu için ağ bağlantısı gerekir.',
  },
}

const en: Dict = {
  nav: {
    home: 'Home',
    names: 'Names',
    learn: 'Learn',
    settings: 'Settings',
    aid: 'Learning aid',
    main: 'Main navigation',
    mobile: 'Mobile navigation',
  },
  share: {
    button: 'Share',
    title: 'Daily Husna',
    text: 'Learn the 99 Names of Allah with Daily Husna.',
    copied: 'Copied',
    failed: 'Error',
  },
  common: {
    back: 'Back',
    overview: 'Overview',
    details: 'Details',
    learned: 'Learned',
    favorite: 'Favorite',
    removeFavorite: 'Remove favorite',
    open: 'Open',
    meaning: 'Meaning',
    explanation: 'Explanation',
    dua: 'Dua',
    reflection: 'Reflection',
    sourceNote: 'Note',
    nextName: 'Next name',
    pronunciation: 'Pronunciation',
    none: 'None',
    notPlanned: 'Not planned',
  },
  home: {
    eyebrow: '99 Names',
    title: 'A calm learning aid for the 99 Names of Allah.',
    subtitle: 'Search, track your progress, and learn at your own pace. The content is intentionally cautious and must be reviewed by qualified people before publication.',
    nameOfDay: 'Name of the Day',
    viewAll: 'View all names',
    startLearning: 'Start learning mode',
    openDetails: 'Open details',
    schedule: 'Learning schedule',
    due: 'A learning session is due.',
    notDue: 'No due reminder.',
    scheduleNote: 'Hints appear while the app is open. Native push reminders can also be enabled in Settings.',
  },
  progress: {
    title: 'Progress',
    learned: 'learned',
  },
  names: {
    eyebrow: 'Overview',
    title: 'All 99 Names',
    search: 'Search',
    searchPlaceholder: 'Arabic, transliteration, or meaning',
    filterAll: 'All',
    filterLearned: 'Learned',
    filterFavorites: 'Favorites',
    filterOpen: 'Open',
    noResults: 'No names match your search or filter.',
  },
  learn: {
    eyebrow: 'Learning mode',
    title: 'Next open name',
    remaining: (count) => `${count} names still open`,
    markLearned: 'Mark as learned',
    next: 'Skip',
    details: 'Details',
    allLearnedTitle: 'All names are marked as learned.',
    allLearnedBody: 'You can reset your progress in settings or mark individual names as open again.',
    overview: 'Go to overview',
    showMeaning: 'Reveal meaning',
    recallPrompt: 'Try to recall the meaning …',
    overallLearned: (learned, total) => `${learned} of ${total} learned`,
    sessionLearned: (count) => `+${count} today`,
    keyboard: '␣ reveal · L learned · N skip · F favorite',
  },
  detail: {
    backToOverview: 'Back to overview',
    markOpen: 'Mark as open',
    markLearned: 'Mark as learned',
    addFavorite: 'Favorite',
    removeFavorite: 'Remove favorite',
    back: 'Back',
    next: 'Next name',
  },
  settings: {
    eyebrow: 'Settings',
    title: 'Settings',
    language: 'Language',
    schedule: 'Learning schedule',
    scheduleBody: 'Local reminders only inside the open app.',
    active: 'Active',
    interval: 'Interval',
    every2h: 'Every 2 hours',
    every6h: 'Every 6 hours',
    daily: 'Daily',
    lastCompleted: 'Last session',
    nextDue: 'Next reminder',
    localData: 'Local data',
    localDataBody: (learned, favorites, lastViewed) => `Learned: ${learned}, favorites: ${favorites}, last viewed: ${lastViewed}.`,
    resetProgress: 'Reset progress',
    resetConfirm: 'Really reset progress?',
    notificationNote: 'Push reminders are optional and are created only after explicit browser activation.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Send a message',
    intro: 'The form uses Web3Forms in the browser. Submission is blocked unless an access key is configured.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send',
    sending: 'Sending...',
    success: 'Your message has been sent.',
    error: 'The message could not be sent right now. Please try again later.',
    noKey: 'The contact form is not configured yet.',
  },
  validation: {
    nameRequired: 'Name is required',
    nameTooLong: 'Name must be 100 characters or less',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    emailTooLong: 'Email must be 200 characters or less',
    messageRequired: 'Message is required',
    messageTooLong: 'Message must be 2000 characters or less',
    honeypot: 'This message cannot be sent',
  },
  privacy: {
    title: 'Privacy',
    p1: 'This app stores language, progress, favorites, last viewed names, and learning schedule settings locally in the browser using localStorage.',
    p2: 'No tracking cookies are used. Push notifications are optional and must be explicitly enabled in the browser.',
    p3: 'The contact form sends entered data to Web3Forms. The public Web3Forms key is visible in the client.',
  },
  imprint: {
    title: 'Imprint',
    p1: 'Placeholder: operator data must be added before publication.',
    p2: 'No names, addresses, companies, or contact details have been invented.',
  },
  offline: {
    title: 'Offline',
    p1: 'You are offline. Previously cached app pages and the locally bundled names remain usable.',
    p2: 'The contact form requires a network connection.',
  },
}

const dicts: Record<Language, Dict> = { de, tr, en }

export function getDict(lang: Language): Dict {
  return dicts[lang]
}
