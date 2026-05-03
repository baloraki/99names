'use client'

import Link from 'next/link'
import { useAppState } from '@/hooks/useAppState'
import { getLocalizedStaticPath } from '@/lib/seo'
import type { Language } from '@/types/language'

type Source = {
  category: string
  entries: { ref: string; note: string; url?: string }[]
}

type Content = {
  eyebrow: string
  title: string
  missionHeading: string
  mission: string[]
  sourceHeading: string
  sourceIntro: string
  sources: Source[]
  contactNote: string
  contactLink: string
}

const primarySources: Source[] = [
  {
    category: { de: 'Primärquellen – Qurʾān', en: 'Primary sources – Qurʾān', tr: "Birincil kaynaklar – Kur'an" }['de'],
    entries: [
      { ref: 'Qurʾān 7:180 (Al-Aʿrāf)', note: 'Grundlage, Allah mit Seinen schönen Namen anzurufen.' },
      { ref: 'Qurʾān 17:110 (Al-Isrāʾ)', note: 'Aufruf, Allah mit „Allah" oder „ar-Raḥmān" anzurufen; Ihm gehören die schönsten Namen.' },
      { ref: 'Qurʾān 20:8 (Ṭāhā)', note: '„Ihm gehören die schönsten Namen."' },
      { ref: 'Qurʾān 59:22–24 (Al-Ḥashr)', note: 'Zentrale Verse mit göttlichen Namen wie al-Malik, al-Quddūs, as-Salām, al-Muʾmin, al-ʿAzīz, al-Jabbār, al-Khāliq, al-Bāriʾ, al-Muṣawwir.' },
    ],
  },
  {
    category: 'Primärquellen – Hadith',
    entries: [
      { ref: 'Ṣaḥīḥ al-Bukhārī, Hadith 6410 / 7392', note: 'Grundlegender Hadith über die 99 Namen Allahs; Bedeutung von aḥṣāhā (kennen, bewahren, entsprechend handeln).', url: 'https://sunnah.com/bukhari:6410' },
      { ref: 'Ṣaḥīḥ Muslim, Hadith 2677a / 2677b', note: 'Parallelüberlieferung zum 99-Namen-Hadith.', url: 'https://sunnah.com/muslim:2677a' },
      { ref: 'Jāmiʿ at-Tirmidhī, Hadith 3506–3508', note: 'Allgemeiner 99-Namen-Hadith sowie eine bekannte Aufzählung. Die Aufzählung wird traditionell verwendet, gilt aber nicht als exklusive Begrenzung.', url: 'https://sunnah.com/tirmidhi:3506' },
      { ref: 'Sunan Ibn Mājah, Hadith 3860 / 3861', note: 'Weitere Überlieferung und Namensliste. Als Lerngrundlage verwendbar, nicht als theologische Aussage über Exklusivität.', url: 'https://sunnah.com/ibnmajah:3860' },
    ],
  },
  {
    category: 'Fachliche Quellen',
    entries: [
      {
        ref: "Diyanet İşleri Başkanlığı – \"Allah'ın 99 ismi hakkında bilgi verir misiniz?\"",
        note: 'Offizielle türkische Religionsbehörde: ihsā und ḥifẓ bedeuten mehr als bloßes Auswendiglernen – Allah durch Seine Namen erkennen, glauben, dienen, gehorchen.',
        url: 'https://diyanet.gov.tr',
      },
      {
        ref: "Diyanet İşleri Başkanlığı – \"Esmâ-i Hüsnâ ne demektir?\"",
        note: 'Definition von Esmâ-i Hüsnâ in Verbindung mit Qurʾān 20:8 und 7:180.',
      },
      {
        ref: 'Türkiye Diyanet Vakfı İslâm Ansiklopedisi – „Esmâ-i Hüsnâ"',
        note: 'Allein im Qurʾān kommen mehr als 100 göttliche Namen vor; Esmâ-i Hüsnâ umfasst im weiteren Sinn alle in Qurʾān und Hadith Allah zugeschriebenen Namen.',
        url: 'https://islamansiklopedisi.org.tr',
      },
      {
        ref: "Diyanet İşleri Başkanlığı – \"Allah'ın zaman ve mekândan münezzeh olması\"",
        note: 'Theologische Absicherung der Tanzīh-Linie: Allah wird nicht körperlich, räumlich oder menschenähnlich verstanden (sunnitisch-hanafitisch / māturīdisch).',
      },
    ],
  },
  {
    category: 'Sprachquellen',
    entries: [
      { ref: 'Diyanet Kur\'an Meali', note: 'Türkische Qurʾān-Übersetzung; genutzt für Formulierungen zu Sure 7:180, 17:110, 20:8, 59:22–24.' },
      { ref: 'islam.de – Deutsche Qurʾān-Übersetzung', note: 'Deutsche Formulierungen zu Aʿrāf 7:180 und Isrāʾ 17:110.', url: 'https://islam.de' },
      { ref: 'Islamic Relief Deutschland – 99 Namen Allahs', note: 'Deutschsprachige Orientierung für Schreibweise und Bedeutungen.', url: 'https://www.islamic-relief.de' },
      { ref: 'Sunnah.com', note: 'Praktische Online-Referenz für Bukhārī, Muslim, Tirmidhī und Ibn Mājah. Hauptquellen sind die klassischen Hadith-Werke selbst.', url: 'https://sunnah.com' },
    ],
  },
]

const enSources: Source[] = [
  {
    category: 'Primary sources – Qurʾān',
    entries: [
      { ref: 'Qurʾān 7:180 (Al-Aʿrāf)', note: 'Basis for calling upon Allah by His most beautiful names.' },
      { ref: 'Qurʾān 17:110 (Al-Isrāʾ)', note: 'Calling upon Allah as "Allah" or "ar-Raḥmān"; to Him belong the most beautiful names.' },
      { ref: 'Qurʾān 20:8 (Ṭāhā)', note: '"To Him belong the most beautiful names."' },
      { ref: 'Qurʾān 59:22–24 (Al-Ḥashr)', note: 'Central verses containing divine names such as al-Malik, al-Quddūs, as-Salām, al-Muʾmin, al-ʿAzīz, al-Jabbār, al-Khāliq, al-Bāriʾ, al-Muṣawwir.' },
    ],
  },
  {
    category: 'Primary sources – Hadith',
    entries: [
      { ref: 'Ṣaḥīḥ al-Bukhārī, Hadith 6410 / 7392', note: 'Foundational hadith on the 99 Names; meaning of aḥṣāhā (to know, preserve, and act accordingly).', url: 'https://sunnah.com/bukhari:6410' },
      { ref: 'Ṣaḥīḥ Muslim, Hadith 2677a / 2677b', note: 'Parallel transmission of the 99-Names hadith.', url: 'https://sunnah.com/muslim:2677a' },
      { ref: 'Jāmiʿ at-Tirmidhī, Hadith 3506–3508', note: 'General 99-Names hadith plus a widely used enumeration. The list is used as a learning reference, not as an exhaustive boundary.', url: 'https://sunnah.com/tirmidhi:3506' },
      { ref: 'Sunan Ibn Mājah, Hadith 3860 / 3861', note: 'Additional transmission. Usable as a teaching list; not presented as definitively exhaustive.', url: 'https://sunnah.com/ibnmajah:3860' },
    ],
  },
  {
    category: 'Scholarly sources',
    entries: [
      { ref: "Diyanet İşleri Başkanlığı – \"Allah'ın 99 ismi\"", note: 'Official Turkish religious authority: iḥṣāʾ means more than memorisation – recognising Allah through His names, believing, serving, and obeying.', url: 'https://diyanet.gov.tr' },
      { ref: "Diyanet İşleri Başkanlığı – \"Esmâ-i Hüsnâ ne demektir?\"", note: 'Definition of Esmâ-i Hüsnâ in connection with Qurʾān 20:8 and 7:180.' },
      { ref: 'Türkiye Diyanet Vakfı İslâm Ansiklopedisi – "Esmâ-i Hüsnâ"', note: 'More than 100 divine names occur in the Qurʾān alone; Esmâ-i Hüsnâ encompasses all names attributed to Allah in Qurʾān and Hadith.', url: 'https://islamansiklopedisi.org.tr' },
      { ref: "Diyanet – \"Allah'ın zaman ve mekândan münezzeh olması\"", note: 'Theological grounding in the Tanzīh doctrine: Allah is not understood as corporeal, spatial, or anthropomorphic (Sunni-Ḥanafī / Māturīdī line).' },
    ],
  },
  {
    category: 'Language sources',
    entries: [
      { ref: 'Diyanet Kur\'an Meali', note: 'Turkish Qurʾān translation; used for phrasing of 7:180, 17:110, 20:8, 59:22–24.' },
      { ref: 'islam.de – German Qurʾān translation', note: 'German phrasing for Aʿrāf 7:180 and Isrāʾ 17:110.', url: 'https://islam.de' },
      { ref: 'Islamic Relief Deutschland – 99 Namen Allahs', note: 'German-language reference for spelling conventions and meanings.', url: 'https://www.islamic-relief.de' },
      { ref: 'Sunnah.com', note: 'Practical online reference for Bukhārī, Muslim, Tirmidhī and Ibn Mājah. The primary sources are the classical hadith works themselves.', url: 'https://sunnah.com' },
    ],
  },
]

const trSources: Source[] = [
  {
    category: "Birincil kaynaklar – Kuran",
    entries: [
      { ref: "Kuran 7:180 (el-Araf)", note: "Allah'a güzel isimleriyle dua etmenin temel dayanagi." },
      { ref: "Kuran 17:110 (el-Isra)", note: "Allah'a 'Allah' veya 'er-Rahman' olarak dua cagrisi; güzel isimler O'na aittir." },
      { ref: "Kuran 20:8 (Taha)", note: "Güzel isimler O'na aittir." },
      { ref: "Kuran 59:22–24 (el-Hasr)", note: "el-Melik, el-Kuddus, es-Selam, el-Mümin, el-Aziz, el-Cebbar, el-Halik, el-Bari, el-Musavvir gibi ilahi isimlerin geçtigi merkezi ayetler." },
    ],
  },
  {
    category: "Birincil kaynaklar – Hadis",
    entries: [
      { ref: "Sahihu'l-Buhari, Hadis 6410 / 7392", note: "99 isim hadisinin temel rivayeti; ihsanin anlami: bilmek, korumak ve buna göre davranmak.", url: "https://sunnah.com/bukhari:6410" },
      { ref: "Sahihu Muslim, Hadis 2677a / 2677b", note: "99 isim hadisinin paralel rivayeti.", url: "https://sunnah.com/muslim:2677a" },
      { ref: "Camiu't-Tirmizi, Hadis 3506–3508", note: "Genel 99 isim hadisi ve yaygin kullanilan liste. Liste ögrenme referansi olarak degerlendirilir; isimler için kesin bir sinir iddias tasimaz.", url: "https://sunnah.com/tirmidhi:3506" },
      { ref: "Sünen Ibn Mace, Hadis 3860 / 3861", note: "Ek rivayet ve isim listesi. Ögretim listesi olarak kullanilabilir; kesin sinir iddasiyla sunulmamaktadir.", url: "https://sunnah.com/ibnmajah:3860" },
    ],
  },
  {
    category: "Akademik kaynaklar",
    entries: [
      { ref: "Diyanet Isleri Baskanligi – Allah'in 99 ismi", note: "Ihsanin anlami salt ezberin ötesindedir: isimleriyle Allah'i tanimak, iman etmek, ibadet ve itaat etmek.", url: "https://diyanet.gov.tr" },
      { ref: "Diyanet Isleri Baskanligi – Esma-i Hüsna ne demektir?", note: "Kuran 20:8 ve 7:180 baglaminda Esma-i Hüsna tanimi." },
      { ref: "Türkiye Diyanet Vakfi Islam Ansiklopedisi – Esma-i Hüsna", note: "Kuran'da tek basina 100'den fazla ilahi isim geçmektedir; genis anlamda Esma-i Hüsna, Kuran ve Hadis'te Allah'a nispet edilen tüm isimleri kapsar.", url: "https://islamansiklopedisi.org.tr" },
      { ref: "Diyanet – Allah'in zaman ve mekandan münezzeh olmasi", note: "Tenzih akidesinin teolojik temeli: Allah cisimsel, mekansal veya insani andirir biçimde algilanamaz (Sünni-Hanefi / Maturidi çizgisi)." },
    ],
  },
  {
    category: "Dil kaynaklari",
    entries: [
      { ref: "Diyanet Kuran Meali", note: "7:180, 17:110, 20:8, 59:22–24 ayetlerinin Türkçe ifadeleri için kullanilmistir." },
      { ref: "islam.de – Almanca Kuran Çevirisi", note: "Araf 7:180 ve Isra 17:110'un Almanca ifadeleri.", url: "https://islam.de" },
      { ref: "Islamic Relief Deutschland – 99 Namen Allahs", note: "Yazim kurallari ve Almanca anlamlar için Almanca dil referansi.", url: "https://www.islamic-relief.de" },
      { ref: "Sunnah.com", note: "Buhari, Müslim, Tirmizi ve Ibn Mace için pratik çevrimiçi referans. Asil kaynaklar klasik hadis külliyatlarinin kendisidir.", url: "https://sunnah.com" },
    ],
  },
]

const pageContent: Record<Language, Content> = {
  de: {
    eyebrow: 'Über diese Website',
    title: 'Über uns',
    missionHeading: 'Warum diese Website existiert',
    mission: [
      "Ich habe diese Website ursprünglich für mich selbst erstellt. Mein Ziel war es, die 99 Namen Allahs, die Esmâ-i Hüsnâ, ruhig, bewusst und regelmässig zu lernen. Am Anfang war es keine App und kein grosses Projekt, sondern einfach ein persönliches Werkzeug für meinen eigenen Lernprozess.",
      "Während ich mich beim Erstellen der Website intensiver mit den Namen beschäftigt und über ihre Bedeutungen nachgedacht habe, wurde mir etwas noch deutlicher: Die Namen Allahs sind nicht nur Wörter zum Auswendiglernen. Jeder Name ist ein Zugang dazu, Allah bewusster zu erkennen — in Seiner Barmherzigkeit, Seinem Wissen, Seiner Macht, Seiner Weisheit und in Seinem Umgang mit Seinen Dienern.",
      "Dieser Prozess hat mir persönlich sehr geholfen. Deshalb habe ich entschieden, dieses kleine Nebenprojekt fertigzustellen und mit anderen zu teilen. Vielleicht hilft es jemandem, der ähnlich beginnen möchte wie ich: langsam, ohne Druck, ohne Eile und mit dem Wunsch, wirklich zu verstehen.",
      "Bei der Erstellung der Inhalte habe ich bewusst versucht, vorsichtig und sorgfältig zu formulieren. Wo Unsicherheit besteht, soll dies klar erkennbar sein. Diese Website erhebt keinen Anspruch darauf, eine abschliessende theologische Autorität zu sein. Korrekturen, Quellenhinweise und konstruktives Feedback sind herzlich willkommen.",
    ],
    sourceHeading: 'Quellenverzeichnis',
    sourceIntro: 'Folgende Quellen wurden bei der Erstellung der Inhalte herangezogen. Die grundlegenden Primärquellen sind Qurʾān und Ḥadīth; Sekundärquellen dienen der theologischen Einordnung und sprachlichen Aufbereitung.',
    sources: primarySources,
    contactNote: 'Fehler gefunden oder Quellen ergänzen?',
    contactLink: 'Zum Kontaktformular',
  },
  en: {
    eyebrow: 'About this website',
    title: 'About',
    missionHeading: 'Why this website exists',
    mission: [
      "I originally created this website for myself. My goal was to learn the 99 Names of Allah, the Asma ul-Husna, in a calm, conscious, and consistent way. At first, it was not meant to be an app or a large project; it was simply a personal tool to support my own learning journey.",
      "But as I spent more time with the Names and reflected on each meaning while building this site, I realized something more deeply: the Names of Allah are not just words to memorize. Each Name is a door to knowing Allah more consciously — His mercy, His knowledge, His power, His wisdom, and the way He deals with His servants.",
      "This process genuinely benefited me. That is why I decided to complete this small side project and share it with others. Perhaps it may help someone who wants to begin as I did: slowly, without pressure, without rushing, and with the intention to understand.",
      "While preparing the content, I tried to use careful and cautious wording. Where there is uncertainty, I have tried to make that clear. This site does not claim to be a final theological authority. Corrections, source suggestions, and constructive feedback are sincerely appreciated.",
    ],
    sourceHeading: 'Sources',
    sourceIntro: 'The following sources were consulted during the creation of this content. The foundational primary sources are the Qurʾān and Ḥadīth; secondary sources serve for theological contextualisation and linguistic preparation.',
    sources: enSources,
    contactNote: 'Found an error or want to suggest a source?',
    contactLink: 'Contact form',
  },
  tr: {
    eyebrow: 'Bu web sitesi hakkında',
    title: 'Hakkımızda',
    missionHeading: 'Bu web sitesi neden var?',
    mission: [
      "Bu web sitesini başlangıçta kendim için oluşturdum. Amacım Allah’ın 99 ismini, yani Esmâ-i Hüsnâ’yı sakin, bilinçli ve düzenli bir şekilde öğrenmekti. Başta bu bir uygulama ya da büyük bir proje değildi; sadece kendi öğrenme sürecimi destekleyen kişisel bir araçtı.",
      "Fakat isimlerle ilgilendikçe ve bu siteyi hazırlarken her bir anlam üzerinde düşündükçe şunu daha derinden fark ettim: Allah’ın isimleri sadece ezberlenecek kelimeler değildir. Her biri Allah’ı tanımaya, O’nun rahmetini, ilmini, kudretini, hikmetini ve kullarına olan muamelesini daha bilinçli anlamaya açılan bir kapıdır.",
      "Bu süreç bana gerçekten iyi geldi. Bu yüzden bu küçük yan projeyi tamamlayıp başkalarıyla da paylaşmaya karar verdim. Belki benim gibi başlamak isteyen birine vesile olur: yavaş yavaş, baskı olmadan, acele etmeden ve anlamaya çalışarak.",
      "İçerikleri hazırlarken özellikle ihtiyatlı bir dil kullanmaya çalıştım. Kesinlik bulunmayan yerlerde bunu açıkça belirtmeye gayret ettim. Bu site kendisini nihai bir teolojik otorite olarak görmez. Düzeltmeler, kaynak önerileri ve yapıcı geri bildirimler benim için değerlidir.",
    ],
    sourceHeading: 'Kaynakça',
    sourceIntro: "Bu içerikler hazırlanırken aşağıdaki kaynaklar kullanılmıştır. Temel birincil kaynaklar Kur'an ve Hadis'tir; ikincil kaynaklar teolojik bağlamlandırma ve dil hazırlığı için başvurulmuştur.",
    sources: trSources,
    contactNote: 'Hata buldunuz veya kaynak önermek ister misiniz?',
    contactLink: 'İletişim formu',
  },
}

export function AboutPageContent() {
  const { language } = useAppState()
  const c = pageContent[language]

  return (
    <article lang={language} className="mx-auto max-w-3xl space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">{c.eyebrow}</p>
        <h1 className="text-4xl font-semibold leading-tight text-primary">{c.title}</h1>
      </header>

      {/* Mission */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">{c.missionHeading}</h2>
        <div className="space-y-4 leading-8 text-muted">
          {c.mission.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="space-y-6" id="sources">
        <h2 className="text-2xl font-semibold text-primary">{c.sourceHeading}</h2>
        <p className="leading-7 text-muted">{c.sourceIntro}</p>

        {c.sources.map((group) => (
          <div key={group.category} className="rounded-lg border border-white/10 bg-surface p-5 space-y-3">
            <h3 className="text-base font-semibold text-gold">{group.category}</h3>
            <ul className="space-y-3">
              {group.entries.map((entry, i) => (
                <li key={i} className="leading-7 text-sm text-muted">
                  <span className="font-medium text-primary">
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold underline underline-offset-2 hover:text-gold/80"
                      >
                        {entry.ref}
                      </a>
                    ) : (
                      entry.ref
                    )}
                  </span>
                  {' – '}
                  {entry.note}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Contact nudge */}
      <p className="text-sm text-muted">
        {c.contactNote}{' '}
        <Link href={getLocalizedStaticPath('contact', language)} className="text-gold underline underline-offset-2 hover:text-gold/80">
          {c.contactLink}
        </Link>
      </p>
    </article>
  )
}


