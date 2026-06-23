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
    favorites: string
    settings: string
    quiz: string
    quizBadge: (count: number) => string
    aid: string
    main: string
    mobile: string
    skipToContent: string
  }
  favorites: {
    eyebrow: string
    title: string
    subtitle: string
    empty: string
    browseLink: string
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
    continueReview: (count: number) => string
    openDetails: string
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
    quizCta: string
    quizCtaLink: string
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
    flipSide: string
    showArabic: string
    recallArabicPrompt: string
    modeCard: string
    modeList: string
    repeat: string
    skip: string
    skipHint: string
    learnedHint: string
    repeatHint: string
    streakDays: (count: number) => string
    streakLabel: string
    shuffleOn: string
    shuffleOff: string
    listOpen: string
    listLearned: string
    listFavorite: string
    listRepeat: string
    next3Title: string
    audioLabel: string
    audioUnavailable: string
    restart: string
    tapToReveal: string
    completedTitle: string
    completedBody: string
    quizCta: string
    quizCtaLink: string
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
    theme: string
    themeOptions: Record<'dark-classic' | 'blue-night' | 'soft-light', string>
    localData: string
    localDataBody: (learned: number, favorites: number, lastViewed: string) => string
    resetProgress: string
    resetConfirm: string
    pushReminderTitle: string
    iosPushUnavailable: string
    iosPwaNote: string
    notificationNote: string
    pushNudgeTitle: string
    pushNudgeBody: string
    pushNudgeEnable: string
    pushNudgeLater: string
    pushPermissionGuideTitle: string
    pushPermissionGuideBody: string
    pushPermissionGuideOk: string
    pwaInstallTitle: string
    pwaInstallBody: string
    batteryOptimTitle: string
    batteryOptimBody: string
    batteryOptimYes: string
    batteryOptimNo: string
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
    favorites: 'Favoriten',
    settings: 'Einstellungen',
    quiz: 'Quiz',
    quizBadge: (count) => `${count} ${count === 1 ? 'Karte fällig' : 'Karten fällig'}`,
    aid: 'Lernhilfe',
    main: 'Hauptnavigation',
    mobile: 'Mobile Navigation',
    skipToContent: 'Zum Inhalt springen',
  },
  favorites: {
    eyebrow: 'Deine Auswahl',
    title: 'Favoriten',
    subtitle: 'Eine ruhige Sammlung der Namen, die du persönlich vertiefen möchtest.',
    empty: 'Du hast noch keine Favoriten gespeichert. Klicke auf den Stern neben einem Namen, um ihn hier hinzuzufügen.',
    browseLink: 'Zur Übersicht',
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
    continueReview: (count) => `Tägliche Wiederholung fortsetzen (${count} fällig)`,
    openDetails: 'Details öffnen',
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
    quizCta: 'Teste dein Wissen mit dem Spaced-Repetition-Quiz.',
    quizCtaLink: 'Quiz starten',
  },
  learn: {
    eyebrow: 'Lernmodus',
    title: 'Nächster offener Name',
    remaining: (count) => `${count} Namen noch offen`,
    markLearned: 'Gelernt ✓',
    next: 'Überspringen',
    details: 'Details',
    allLearnedTitle: 'Alle Namen sind als gelernt markiert.',
    allLearnedBody: 'Du kannst deinen Fortschritt in den Einstellungen zurücksetzen oder einzelne Namen wieder als offen markieren.',
    overview: 'Zur Übersicht',
    showMeaning: 'Bedeutung aufdecken',
    recallPrompt: 'Versuche die Bedeutung zu erinnern …',
    overallLearned: (learned, total) => `${learned} / ${total}`,
    sessionLearned: (count) => `+${count} heute`,
    keyboard: '␣ aufdecken · L gelernt · N überspringen · R wiederholen · F Favorit · A Audio',
    flipSide: 'Seiten tauschen',
    showArabic: 'Arabisch aufdecken',
    recallArabicPrompt: 'Versuche das arabische Wort zu erinnern …',
    modeCard: 'Karteikarte',
    modeList: 'Durchgehen',
    repeat: 'Wiederholen',
    skip: 'Überspringen',
    skipHint: 'Überspringen',
    learnedHint: 'Gelernt',
    repeatHint: 'Wiederholen',
    streakDays: (count) => `${count} ${count === 1 ? 'Tag' : 'Tage'}`,
    streakLabel: 'Tages-Streak',
    shuffleOn: 'Zufallsmodus aktiv',
    shuffleOff: 'Zufallsmodus aus',
    listOpen: 'Offen',
    listLearned: 'Gelernt',
    listFavorite: 'Favorit',
    listRepeat: 'Wiederholen',
    next3Title: 'Nächste',
    audioLabel: 'Aussprache anhören',
    audioUnavailable: 'Audio nicht verfügbar',
    restart: 'Von vorne beginnen',
    tapToReveal: 'Tippen zum Aufdecken',
    completedTitle: 'Alle 99 Namen gelernt',
    completedBody: 'Mashallah! Du kannst von vorne beginnen oder einzelne Namen erneut wiederholen.',
    quizCta: 'Fertig gelesen? Teste dein Wissen im aktiven Abrufquiz.',
    quizCtaLink: 'Zum Quiz',
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
    theme: 'Theme',
    themeOptions: {
      'dark-classic': 'Dunkel',
      'blue-night': 'Blaue Nacht',
      'soft-light': 'Hell',
    },
    localData: 'Lokale Daten',
    localDataBody: (learned, favorites, lastViewed) => `Gelernt: ${learned}, Favoriten: ${favorites}, zuletzt angesehen: ${lastViewed}.`,
    resetProgress: 'Fortschritt zurücksetzen',
    resetConfirm: 'Fortschritt wirklich zurücksetzen?',
    pushReminderTitle: 'Push-Erinnerungen',
    iosPushUnavailable: 'Push-Erinnerungen sind auf iOS nicht verfügbar.',
    iosPwaNote: 'iPhone-Hinweis: Daily Husna bleibt im Browser vollständig nutzbar. Push-Erinnerungen werden auf iOS hier nicht angeboten. Bitte nutze die App ohne Push-Benachrichtigungen.',
    notificationNote: 'Push-Erinnerungen sind optional und werden erst nach ausdrücklicher Aktivierung im Browser eingerichtet.',
    pushNudgeTitle: 'Bleib dran mit kurzen Erinnerungen',
    pushNudgeBody: 'Aktiviere Push-Benachrichtigungen, damit du beim Lernen leichter am Ball bleibst.',
    pushNudgeEnable: 'Aktivieren',
    pushNudgeLater: 'Nicht jetzt',
    pushPermissionGuideTitle: 'Benachrichtigungen erlauben',
    pushPermissionGuideBody: "Klicke oben auf \u201eErlauben\u201c, damit wir dich mit Lern-Erinnerungen erreichen k\u00f6nnen.",
    pushPermissionGuideOk: 'OK',
    pwaInstallTitle: 'App installieren – für Erinnerungen nötig',
    pwaInstallBody: 'Damit wir dich mit kurzen Lern-Erinnerungen erreichen können, muss Daily Husna als App installiert sein.',
    batteryOptimTitle: 'Letzter Schritt für zuverlässige Benachrichtigungen',
    batteryOptimBody: 'Öffne die App-Info, gehe zu „App-Aktivität bei Nichtbenutzung pausieren" und schalte diese Option aus – nur so können wir dich jederzeit benachrichtigen.',
    batteryOptimYes: 'Ja, erledigt',
    batteryOptimNo: 'Nein',
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
    p1: 'Diese App speichert Sprache, Fortschritt, Favoriten und zuletzt angesehene Namen im Browser über localStorage.',
    p2: 'Es werden keine Tracking-Cookies verwendet.',
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
    favorites: 'Favoriler',
    settings: 'Ayarlar',
    quiz: 'Quiz',
    quizBadge: (count) => `${count} kart bekliyor`,
    aid: 'Öğrenme yardımı',
    main: 'Ana gezinme',
    mobile: 'Mobil gezinme',
    skipToContent: 'İçeriğe atla',
  },
  favorites: {
    eyebrow: 'Senin seçimin',
    title: 'Favoriler',
    subtitle: 'Üzerinde durmak istediğin isimler için sakin bir koleksiyon.',
    empty: 'Henüz favori eklemedin. Bir ismin yanındaki yıldıza dokunarak buraya ekleyebilirsin.',
    browseLink: 'Tüm isimlere git',
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
    continueReview: (count) => `Günlük tekrara devam et (${count} bekliyor)`,
    openDetails: 'Detayları aç',
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
    quizCta: 'Aralıklı tekrar quiziyle bilgini test et.',
    quizCtaLink: 'Quize başla',
  },
  learn: {
    eyebrow: 'Öğrenme modu',
    title: 'Sonraki açık isim',
    remaining: (count) => `${count} isim henüz açık`,
    markLearned: 'Öğrenildi ✓',
    next: 'Atla',
    details: 'Detaylar',
    allLearnedTitle: 'Tüm isimler öğrenildi olarak işaretlendi.',
    allLearnedBody: 'Ayarlar bölümünde ilerlemeni sıfırlayabilir veya tek tek isimleri tekrar açık olarak işaretleyebilirsin.',
    overview: 'Genel bakışa git',
    showMeaning: 'Anlamı göster',
    recallPrompt: 'Anlamını hatırlamaya çalış …',
    overallLearned: (learned, total) => `${learned} / ${total}`,
    sessionLearned: (count) => `+${count} bugün`,
    keyboard: '␣ göster · L öğrenildi · N atla · R tekrar · F favori · A ses',
    flipSide: 'Tarafları değiştir',
    showArabic: 'Arapçayı göster',
    recallArabicPrompt: 'Arapça kelimeyi hatırlamaya çalış …',
    modeCard: 'Kart',
    modeList: 'Liste',
    repeat: 'Tekrarla',
    skip: 'Atla',
    skipHint: 'Atla',
    learnedHint: 'Öğrenildi',
    repeatHint: 'Tekrarla',
    streakDays: (count) => `${count} gün`,
    streakLabel: 'Günlük seri',
    shuffleOn: 'Rastgele mod açık',
    shuffleOff: 'Rastgele mod kapalı',
    listOpen: 'Açık',
    listLearned: 'Öğrenildi',
    listFavorite: 'Favori',
    listRepeat: 'Tekrar',
    next3Title: 'Sıradaki',
    audioLabel: 'Telaffuzu dinle',
    audioUnavailable: 'Ses kullanılamıyor',
    restart: 'Baştan başla',
    tapToReveal: 'Açmak için dokun',
    completedTitle: 'Tüm 99 isim öğrenildi',
    completedBody: 'Maşallah! Baştan başlayabilir veya seçtiğin isimleri yeniden tekrarlayabilirsin.',
    quizCta: 'Okumayı bitirdin mi? Aktif hatırlama quizinde bilgini test et.',
    quizCtaLink: 'Quize git',
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
    theme: 'Tema',
    themeOptions: {
      'dark-classic': 'Koyu',
      'blue-night': 'Gece mavisi',
      'soft-light': 'Açık',
    },
    localData: 'Yerel veriler',
    localDataBody: (learned, favorites, lastViewed) => `Öğrenilen: ${learned}, favoriler: ${favorites}, son görüntülenen: ${lastViewed}.`,
    resetProgress: 'İlerlemeyi sıfırla',
    resetConfirm: 'İlerleme gerçekten sıfırlansın mı?',
    pushReminderTitle: 'Push hatırlatmaları',
    iosPushUnavailable: 'Push hatırlatmaları iOS\'ta kullanılamaz.',
    iosPwaNote: 'iPhone notu: Daily Husna tarayıcıda tamamen kullanılabilir. iOS\'ta push hatırlatmaları burada sunulmuyor. Lütfen uygulamayı push bildirimleri olmadan kullan.',
    notificationNote: 'Push hatırlatmaları isteğe bağlıdır ve yalnızca tarayıcıda açıkça etkinleştirildikten sonra kurulur.',
    pushNudgeTitle: 'Kısa hatırlatmalarla devam et',
    pushNudgeBody: 'Öğrenme düzenini korumak için push bildirimlerini etkinleştirebilirsin.',
    pushNudgeEnable: 'Etkinleştir',
    pushNudgeLater: 'Şimdi değil',
    pushPermissionGuideTitle: 'Bildirimlere izin ver',
    pushPermissionGuideBody: '\u00d6\u011frenme hat\u0131rlatmalar\u0131 alabilmek i\u00e7in yukar\u0131daki iletişim kutusunda \u201eİzin ver\u201c se\u00e7ene\u011fine t\u0131kla.',
    pushPermissionGuideOk: 'Tamam',
    pwaInstallTitle: 'Uygulama kurulumu – bildirimler için gerekli',
    pwaInstallBody: 'Kısa öğrenme hatırlatmaları gönderebilmemiz için Daily Husna\'nın uygulama olarak kurulması gerekiyor.',
    batteryOptimTitle: 'Güvenilir bildirimler için son adım',
    batteryOptimBody: 'Uygulama Bilgisi\'ni aç, "Kullanılmadığında uygulama etkinliğini duraklat" seçeneğini bul ve kapat – seni her zaman bildirebilmemiz için bu gerekli.',
    batteryOptimYes: 'Evet, yaptım',
    batteryOptimNo: 'Hayır',
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
    p1: 'Bu uygulama dili, ilerlemeyi, favorileri ve son görüntülenen isimleri tarayıcıda localStorage ile saklar.',
    p2: 'Takip çerezleri kullanılmaz.',
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
    favorites: 'Favorites',
    settings: 'Settings',
    quiz: 'Quiz',
    quizBadge: (count) => `${count} ${count === 1 ? 'card' : 'cards'} due`,
    aid: 'Learning aid',
    main: 'Main navigation',
    mobile: 'Mobile navigation',
    skipToContent: 'Skip to content',
  },
  favorites: {
    eyebrow: 'Your selection',
    title: 'Favorites',
    subtitle: 'A calm collection of the names you want to revisit.',
    empty: "You haven't saved any favorites yet. Tap the star next to a name to add it here.",
    browseLink: 'Browse all names',
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
    continueReview: (count) => `Continue Daily Review (${count} due)`,
    openDetails: 'Open details',
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
    quizCta: 'Test your knowledge with the Spaced Repetition Quiz.',
    quizCtaLink: 'Start Quiz',
  },
  learn: {
    eyebrow: 'Learning mode',
    title: 'Next open name',
    remaining: (count) => `${count} names still open`,
    markLearned: 'Learned ✓',
    next: 'Skip',
    details: 'Details',
    allLearnedTitle: 'All names are marked as learned.',
    allLearnedBody: 'You can reset your progress in settings or mark individual names as open again.',
    overview: 'Go to overview',
    showMeaning: 'Reveal meaning',
    recallPrompt: 'Try to recall the meaning …',
    overallLearned: (learned, total) => `${learned} / ${total}`,
    sessionLearned: (count) => `+${count} today`,
    keyboard: '␣ reveal · L learned · N skip · R repeat · F favorite · A audio',
    flipSide: 'Flip sides',
    showArabic: 'Reveal Arabic',
    recallArabicPrompt: 'Try to recall the Arabic word …',
    modeCard: 'Flashcard',
    modeList: 'Browse',
    repeat: 'Repeat',
    skip: 'Skip',
    skipHint: 'Skip',
    learnedHint: 'Learned',
    repeatHint: 'Repeat',
    streakDays: (count) => `${count} ${count === 1 ? 'day' : 'days'}`,
    streakLabel: 'Daily streak',
    shuffleOn: 'Shuffle on',
    shuffleOff: 'Shuffle off',
    listOpen: 'Open',
    listLearned: 'Learned',
    listFavorite: 'Favorite',
    listRepeat: 'Repeat',
    next3Title: 'Next',
    audioLabel: 'Play pronunciation',
    audioUnavailable: 'Audio unavailable',
    restart: 'Start over',
    tapToReveal: 'Tap to reveal',
    completedTitle: 'All 99 names learned',
    completedBody: 'Alhamdulillah. You can start over or revisit individual names.',
    quizCta: 'Done reading? Test your knowledge in the active recall quiz.',
    quizCtaLink: 'Go to Quiz',
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
    theme: 'Theme',
    themeOptions: {
      'dark-classic': 'Dark',
      'blue-night': 'Blue night',
      'soft-light': 'Light',
    },
    localData: 'Local data',
    localDataBody: (learned, favorites, lastViewed) => `Learned: ${learned}, favorites: ${favorites}, last viewed: ${lastViewed}.`,
    resetProgress: 'Reset progress',
    resetConfirm: 'Really reset progress?',
    pushReminderTitle: 'Push reminders',
    iosPushUnavailable: 'Push reminders are not available on iOS.',
    iosPwaNote: 'iPhone note: Daily Husna works fully in the browser. Push reminders are not offered on iOS here. Please use the app without push notifications.',
    notificationNote: 'Push reminders are optional and are created only after explicit browser activation.',
    pushNudgeTitle: 'Stay on track with quick reminders',
    pushNudgeBody: 'Enable push notifications to keep your learning rhythm going.',
    pushNudgeEnable: 'Enable',
    pushNudgeLater: 'Not now',
    pushPermissionGuideTitle: 'Allow notifications',
    pushPermissionGuideBody: 'Click "Allow" in the dialog above to receive learning reminders.',
    pushPermissionGuideOk: 'OK',
    pwaInstallTitle: 'Install the app – needed for reminders',
    pwaInstallBody: 'To send you short learning reminders, Daily Husna needs to be installed as an app.',
    batteryOptimTitle: 'One last step for reliable notifications',
    batteryOptimBody: 'Open App Info, find "Pause app activity if unused" and turn it off – only then can we notify you at any time.',
    batteryOptimYes: 'Done',
    batteryOptimNo: 'No',
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
    p1: 'This app stores language, progress, favorites, and last viewed names in the browser using localStorage.',
    p2: 'No tracking cookies are used.',
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
