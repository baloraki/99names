import type { Language } from '@/types/language'

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'de', label: 'Deutsch' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
]

type Dict = {
  nav: {
    home: string
    names: string
    learn: string
    settings: string
  }
  home: {
    title: string
    subtitle: string
    nameOfDay: string
    progress: string
    learnedOf: string
    viewAll: string
    startLearning: string
  }
  names: {
    title: string
    searchPlaceholder: string
    filterAll: string
    filterLearned: string
    filterFavorites: string
    filterUnlearned: string
    noResults: string
  }
  learn: {
    title: string
    subtitle: string
    markLearned: string
    markUnlearned: string
    next: string
    previous: string
    complete: string
    allLearned: string
  }
  settings: {
    title: string
    language: string
    schedule: string
    scheduleEnabled: string
    interval: string
    resetProgress: string
    resetConfirm: string
  }
  contact: {
    title: string
    name: string
    email: string
    message: string
    send: string
    sending: string
    success: string
    error: string
    noKey: string
  }
  common: {
    loading: string
    error: string
    back: string
    meaning: string
    explanation: string
    dua: string
    reflection: string
    learned: string
    favorite: string
    share: string
  }
}

const de: Dict = {
  nav: {
    home: 'Start',
    names: 'Namen',
    learn: 'Lernen',
    settings: 'Einstellungen',
  },
  home: {
    title: 'Die 99 Namen Allahs',
    subtitle: 'Lerne und reflektiere über die Eigenschaften Allahs',
    nameOfDay: 'Name des Tages',
    progress: 'Dein Fortschritt',
    learnedOf: 'von 99 gelernt',
    viewAll: 'Alle Namen',
    startLearning: 'Lernen starten',
  },
  names: {
    title: 'Alle 99 Namen',
    searchPlaceholder: 'Suche nach Namen...',
    filterAll: 'Alle',
    filterLearned: 'Gelernt',
    filterFavorites: 'Favoriten',
    filterUnlearned: 'Nicht gelernt',
    noResults: 'Keine Ergebnisse gefunden',
  },
  learn: {
    title: 'Lernen',
    subtitle: 'Lerne die Namen Allahs',
    markLearned: 'Als gelernt markieren',
    markUnlearned: 'Als nicht gelernt markieren',
    next: 'Weiter',
    previous: 'Zurück',
    complete: 'Abgeschlossen',
    allLearned: 'Alle Namen gelernt!',
  },
  settings: {
    title: 'Einstellungen',
    language: 'Sprache',
    schedule: 'Lernplan',
    scheduleEnabled: 'Lernplan aktivieren',
    interval: 'Intervall',
    resetProgress: 'Fortschritt zurücksetzen',
    resetConfirm: 'Bist du sicher? Diese Aktion kann nicht rückgängig gemacht werden.',
  },
  contact: {
    title: 'Kontakt',
    name: 'Name',
    email: 'E-Mail',
    message: 'Nachricht',
    send: 'Senden',
    sending: 'Wird gesendet...',
    success: 'Deine Nachricht wurde erfolgreich gesendet.',
    error: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
    noKey: 'Kontaktformular ist derzeit nicht verfügbar.',
  },
  common: {
    loading: 'Wird geladen...',
    error: 'Fehler',
    back: 'Zurück',
    meaning: 'Bedeutung',
    explanation: 'Erklärung',
    dua: 'Dua-Verwendung',
    reflection: 'Reflexion',
    learned: 'Gelernt',
    favorite: 'Favorit',
    share: 'Teilen',
  },
}

const tr: Dict = {
  nav: {
    home: 'Ana Sayfa',
    names: 'İsimler',
    learn: 'Öğren',
    settings: 'Ayarlar',
  },
  home: {
    title: "Allah'ın 99 İsmi",
    subtitle: "Allah'ın sıfatlarını öğren ve düşün",
    nameOfDay: 'Günün İsmi',
    progress: 'İlerleme',
    learnedOf: "99'dan öğrenildi",
    viewAll: 'Tüm İsimler',
    startLearning: 'Öğrenmeye Başla',
  },
  names: {
    title: 'Tüm 99 İsim',
    searchPlaceholder: 'İsim ara...',
    filterAll: 'Tümü',
    filterLearned: 'Öğrenilen',
    filterFavorites: 'Favoriler',
    filterUnlearned: 'Öğrenilmeyen',
    noResults: 'Sonuç bulunamadı',
  },
  learn: {
    title: 'Öğren',
    subtitle: "Allah'ın isimlerini öğren",
    markLearned: 'Öğrenildi olarak işaretle',
    markUnlearned: 'Öğrenilmedi olarak işaretle',
    next: 'İleri',
    previous: 'Geri',
    complete: 'Tamamlandı',
    allLearned: 'Tüm isimler öğrenildi!',
  },
  settings: {
    title: 'Ayarlar',
    language: 'Dil',
    schedule: 'Öğrenme Planı',
    scheduleEnabled: 'Öğrenme planını etkinleştir',
    interval: 'Aralık',
    resetProgress: 'İlerlemeyi sıfırla',
    resetConfirm: 'Emin misin? Bu işlem geri alınamaz.',
  },
  contact: {
    title: 'İletişim',
    name: 'Ad',
    email: 'E-posta',
    message: 'Mesaj',
    send: 'Gönder',
    sending: 'Gönderiliyor...',
    success: 'Mesajın başarıyla gönderildi.',
    error: 'Bir hata oluştu. Lütfen tekrar dene.',
    noKey: 'İletişim formu şu an kullanılamıyor.',
  },
  common: {
    loading: 'Yükleniyor...',
    error: 'Hata',
    back: 'Geri',
    meaning: 'Anlam',
    explanation: 'Açıklama',
    dua: 'Dua Kullanımı',
    reflection: 'Düşünce',
    learned: 'Öğrenildi',
    favorite: 'Favori',
    share: 'Paylaş',
  },
}

const en: Dict = {
  nav: {
    home: 'Home',
    names: 'Names',
    learn: 'Learn',
    settings: 'Settings',
  },
  home: {
    title: '99 Names of Allah',
    subtitle: 'Learn and reflect on the attributes of Allah',
    nameOfDay: 'Name of the Day',
    progress: 'Your Progress',
    learnedOf: 'of 99 learned',
    viewAll: 'All Names',
    startLearning: 'Start Learning',
  },
  names: {
    title: 'All 99 Names',
    searchPlaceholder: 'Search names...',
    filterAll: 'All',
    filterLearned: 'Learned',
    filterFavorites: 'Favorites',
    filterUnlearned: 'Unlearned',
    noResults: 'No results found',
  },
  learn: {
    title: 'Learn',
    subtitle: 'Learn the names of Allah',
    markLearned: 'Mark as learned',
    markUnlearned: 'Mark as unlearned',
    next: 'Next',
    previous: 'Previous',
    complete: 'Complete',
    allLearned: 'All names learned!',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    schedule: 'Learning Schedule',
    scheduleEnabled: 'Enable learning schedule',
    interval: 'Interval',
    resetProgress: 'Reset progress',
    resetConfirm: 'Are you sure? This cannot be undone.',
  },
  contact: {
    title: 'Contact',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send',
    sending: 'Sending...',
    success: 'Your message has been sent successfully.',
    error: 'An error occurred. Please try again.',
    noKey: 'Contact form is not available at this time.',
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    back: 'Back',
    meaning: 'Meaning',
    explanation: 'Explanation',
    dua: 'Dua Usage',
    reflection: 'Reflection',
    learned: 'Learned',
    favorite: 'Favorite',
    share: 'Share',
  },
}

const dicts: Record<Language, Dict> = { de, tr, en }

export function getDict(lang: Language): Dict {
  return dicts[lang]
}
