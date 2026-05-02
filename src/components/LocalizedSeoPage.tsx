import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { LearningProgressWidget } from '@/components/LearningProgressWidget'
import { LearnClient } from '@/components/LearnClient'
import { names } from '@/data/names'
import {
  buildMetadata,
  getLocalizedHomePath,
  getLocalizedNamePath,
  getLocalizedNamesPath,
  getLocalizedSeoPath,
  seoPageAlternates,
  type LocalizedSeoPage,
} from '@/lib/seo'
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/structuredData'
import type { Language } from '@/types/language'

type PageCopy = {
  eyebrow: string
  h1: string
  title: string
  description: string
  intro: string[]
  primaryCta: string
  secondaryCta?: string
  sourceTitle?: string
  sourceBody?: string
  practiceTitle?: string
  practiceItems?: string[]
}

const copy: Record<LocalizedSeoPage, Record<Language, PageCopy>> = {
  asma: {
    en: {
      eyebrow: 'Al Asma ul Husna',
      h1: 'Asma ul Husna',
      title: 'Asma ul Husna – Al Asma ul Husna Names and Meanings',
      description: 'Study Asma ul Husna, also written Al Asma ul Husna, with Arabic names, transliteration, meanings, dua usage, reflections and source-aware notes.',
      intro: [
        'Asma ul Husna means the beautiful names. This page is a dedicated entry point for learners who search for Asma ul Husna, Al Asma ul Husna, or Allah names with meaning and want a respectful, structured way to continue.',
        'The full list is rendered as crawlable links below. Each detail page includes the Arabic name, transliteration, English meaning, German meaning, Turkish meaning, explanation, dua usage, reflection, source note, and review notice where required.',
      ],
      primaryCta: 'Open the main 99 names list',
    },
    de: {
      eyebrow: 'Asma ul Husna Deutsch',
      h1: 'Asma ul Husna Deutsch',
      title: 'Asma ul Husna Deutsch – Allahs schöne Namen mit Bedeutung',
      description: 'Lerne Asma ul Husna Deutsch mit arabischer Schreibweise, Transliteration, Bedeutung, Dua-Hinweisen, Reflexion und quellenbewussten Notizen.',
      intro: [
        'Asma ul Husna wird im Deutschen häufig als Allahs schöne Namen oder die 99 Namen Allahs gesucht. Diese Seite ist ein deutschsprachiger Einstieg in die Namen mit Bedeutung, arabischer Schreibweise und behutsamen Lernhinweisen.',
        'Die Detailseiten zeigen jeweils Arabisch, Transliteration, deutsche Bedeutung, englische und türkische Bedeutung, Erklärung, Dua-Hinweis, Reflexion, Quellenhinweis und Review-Status. Die verbreitete Liste wird als Lernreihenfolge behandelt, nicht als unbelegte Einzelbehauptung.',
      ],
      primaryCta: 'Zur deutschen Namensliste',
    },
    tr: {
      eyebrow: 'Esmaül Hüsna',
      h1: 'Esmaül Hüsna Anlamları',
      title: "Esmaül Hüsna – Allah'ın 99 İsmi ve Anlamları",
      description: "Allah'ın 99 ismini Esmaül Hüsna başlığıyla Arapça, transliterasyon, anlam, dua kullanımı, tefekkür ve kaynak notlarıyla öğren.",
      intro: [
        "Esmaül Hüsna, Allah'ın güzel isimleri için kullanılan yaygın ifadedir. Bu sayfa Türkçe anlamları, Arapça yazımı ve kaynak bilincini birlikte okumak isteyenler için hazırlanmıştır.",
        'Her detay sayfasında Arapça isim, transliterasyon, Türkçe anlam, İngilizce ve Almanca anlam, açıklama, dua kullanımı, tefekkür, kaynak notu ve inceleme uyarısı görünür kalır.',
      ],
      primaryCta: 'Esmaül Hüsna listesine git',
    },
  },
  learn: {
    en: {
      eyebrow: 'Learn 99 names of Allah',
      h1: 'Learn 99 Names of Allah with steady memorization',
      title: 'Learn 99 Names of Allah – Memorize Asma ul Husna Daily',
      description: 'Learn 99 Names of Allah through crawlable meanings, daily memorization, progress tracking and reflection without fixed-number promises.',
      intro: [
        'A lasting approach to memorizing Asma ul Husna is simple: read the Arabic name, say the transliteration carefully, understand the meaning, and pause for reflection. This page keeps the learning content visible for search engines and learners, while the interactive panel below helps you mark progress locally in the browser.',
        'The goal is not to rush through a list or attach guaranteed outcomes to a number of repetitions. Learn one name at a time, revisit difficult names, and connect each meaning with humility, dua, and responsible conduct. Progress data stays local to your device.',
      ],
      primaryCta: 'Open the full list',
      secondaryCta: 'Read reflections',
    },
    de: {
      eyebrow: '99 Namen Allahs lernen',
      h1: 'Die 99 Namen Allahs Schritt für Schritt lernen',
      title: '99 Namen Allahs lernen – Asma ul Husna auswendig lernen',
      description: 'Lerne die 99 Namen Allahs mit Arabisch, Bedeutung, täglicher Wiederholung, lokalem Fortschritt und Reflexion ohne feste Zahlenversprechen.',
      intro: [
        'Ein tragfähiger Weg, die 99 Namen Allahs zu lernen, beginnt ruhig: arabischen Namen lesen, Transliteration sorgfältig sprechen, Bedeutung verstehen und kurz reflektieren. Der wichtige Lerntext ist serverseitig sichtbar, während der interaktive Bereich darunter nur deinen lokalen Fortschritt unterstützt.',
        'Diese Seite vermeidet Versprechen über feste Wiederholungszahlen oder garantierte Wirkungen. Lerne einen Namen nach dem anderen, wiederhole schwierige Namen und verbinde die Bedeutung mit Demut, Dua und verantwortlichem Handeln.',
      ],
      primaryCta: 'Zur vollständigen Liste',
      secondaryCta: 'Reflexionen lesen',
    },
    tr: {
      eyebrow: "Allah'ın 99 ismini öğren",
      h1: "Allah'ın 99 İsmini düzenli şekilde öğren",
      title: "Allah'ın 99 İsmini Öğren – Esmaül Hüsna Ezber ve Tekrar",
      description: "Allah'ın 99 ismini Arapça, anlam, günlük tekrar, yerel ilerleme takibi ve tefekkürle öğren; sabit sayı vaadi yoktur.",
      intro: [
        'Esmaül Hüsna öğrenmek için sağlam yol sadedir: Arapça ismi oku, transliterasyonu dikkatle söyle, anlamı kavra ve kısa bir tefekkür yap. Bu sayfadaki ana öğrenme metni sunucuda görünür; etkileşimli bölüm yalnızca yerel ilerlemeyi işaretler.',
        'Amaç listeyi aceleyle bitirmek veya tekrar sayılarına garanti sonuç bağlamak değildir. Her seferinde bir isim öğren, zorlandığın isimlere dön ve anlamı dua, tevazu ve sorumlu davranışla ilişkilendir.',
      ],
      primaryCta: 'Tam listeyi aç',
      secondaryCta: 'Tefekkürleri oku',
    },
  },
  dua: {
    en: {
      eyebrow: 'Dua with names of Allah',
      h1: 'Dua with Names of Allah',
      title: 'Dua with Names of Allah – Call Upon Allah by His Beautiful Names',
      description: 'Learn how to approach dua with names of Allah in a careful, source-aware way, with links to Ar-Rahman, Ar-Rahim, Al-Ghaffar, Ar-Razzaq and Al-Wadud.',
      intro: [
        'The Qur&apos;an encourages calling upon Allah by His beautiful names. A careful approach to dua is to choose a name whose meaning fits what you are asking for, call upon Allah humbly, and ask in your own words without treating a phrase or number as a guaranteed formula.',
        'This app does not create fabricated duas. The dua usage notes are generic learning prompts, such as asking Allah for mercy while reflecting on Ar-Rahman and Ar-Rahim, forgiveness while reflecting on Al-Ghaffar, provision while reflecting on Ar-Razzaq, and love or restored bonds while reflecting on Al-Wadud.',
      ],
      primaryCta: 'Read dua usage',
      sourceTitle: 'Source-aware wording',
      sourceBody: 'The safest pattern here is not to invent special invocations or promise specific results. Use the meanings as a guide for personal supplication, keep adab in mind, and consult qualified teachers for religious rulings or devotional practices.',
    },
    de: {
      eyebrow: 'Dua mit den Namen Allahs',
      h1: 'Dua mit den Namen Allahs',
      title: 'Dua mit den Namen Allahs – Allah mit Seinen schönen Namen anrufen',
      description: 'Lerne vorsichtig und quellenbewusst, wie du Dua mit den Namen Allahs verbindest, mit Links zu Ar-Rahman, Ar-Rahim, Al-Ghaffar, Ar-Razzaq und Al-Wadud.',
      intro: [
        'Der Qur&apos;an ermutigt dazu, Allah mit Seinen schönen Namen anzurufen. Eine vorsichtige Herangehensweise ist, einen Namen passend zur Bitte zu wählen, Allah demütig anzurufen und in eigenen Worten zu bitten, ohne eine Formulierung oder Zahl als garantierte Formel darzustellen.',
        'Diese App erfindet keine speziellen Duas. Die Dua-Hinweise sind allgemeine Lernimpulse: etwa um Barmherzigkeit bitten bei Ar-Rahman und Ar-Rahim, um Vergebung bei Al-Ghaffar, um Versorgung bei Ar-Razzaq und um Liebe oder heilere Beziehungen bei Al-Wadud.',
      ],
      primaryCta: 'Dua-Hinweis lesen',
      sourceTitle: 'Quellenbewusste Formulierung',
      sourceBody: 'Am sichersten ist es, keine besonderen Anrufungen zu erfinden und keine konkreten Ergebnisse zu versprechen. Nutze die Bedeutungen als Orientierung für persönliche Bittgebete und frage qualifizierte Lehrpersonen bei religiösen Detailfragen.',
    },
    tr: {
      eyebrow: "Allah'ın isimleriyle dua",
      h1: "Allah'ın İsimleriyle Dua",
      title: "Allah'ın İsimleriyle Dua – Esmaül Hüsna ile Niyaz",
      description: "Allah'ın isimleriyle dua etmeyi kaynak bilinciyle öğren; Ar-Rahman, Ar-Rahim, Al-Ghaffar, Ar-Razzaq ve Al-Wadud bağlantılarıyla.",
      intro: [
        'Kur&apos;an, Allah&apos;a güzel isimleriyle dua etmeyi teşvik eder. İhtiyatlı yaklaşım, istediğin şeye uygun anlam taşıyan bir isim seçmek, Allah&apos;a tevazu ile yönelmek ve herhangi bir söz ya da sayıyı garanti formül gibi sunmamaktır.',
        'Bu uygulama uydurma dua metinleri oluşturmaz. Dua kullanımı bölümleri genel öğrenme notlarıdır: Ar-Rahman ve Ar-Rahim ile rahmet, Al-Ghaffar ile bağışlanma, Ar-Razzaq ile rızık, Al-Wadud ile sevgi ve bağların güzelleşmesi için dua etmeyi hatırlatır.',
      ],
      primaryCta: 'Dua kullanımını oku',
      sourceTitle: 'Kaynak bilinciyle ifade',
      sourceBody: 'En güvenli yol özel zikirler uydurmamak ve belirli sonuçlar vaat etmemektir. Anlamları kişisel dua için rehber kabul et; dini hükümler ve uygulamalar için ehil kişilere danış.',
    },
  },
  reflections: {
    en: {
      eyebrow: 'Beautiful names of Allah',
      h1: 'Reflections on the Beautiful Names of Allah',
      title: 'Reflect on the Beautiful Names of Allah – Asma ul Husna Reflections',
      description: 'Reflect on the beautiful names of Allah with careful notes that connect meaning, dua usage and daily character without speculative claims.',
      intro: [
        'Reflection helps memorization become more than recall. After learning the Arabic and meaning of a name, pause and ask what the meaning should correct in your assumptions, your dua, and your conduct with people.',
        'The reflections in this app are intentionally cautious. They do not compare Allah&apos;s attributes to human limitations, and they do not make speculative claims about hidden effects. Each reflection is a learning prompt connected to the dataset entry.',
      ],
      primaryCta: 'Open reflection',
    },
    de: {
      eyebrow: 'Allahs schöne Namen reflektieren',
      h1: 'Reflexionen über Allahs schöne Namen',
      title: 'Allahs schöne Namen reflektieren – Asma ul Husna Reflexionen',
      description: 'Reflektiere Allahs schöne Namen mit vorsichtigen Notizen zu Bedeutung, Dua und Alltag, ohne spekulative Behauptungen.',
      intro: [
        'Reflexion hilft, dass Lernen mehr wird als bloßes Wiederholen. Wenn du arabische Schreibweise und Bedeutung eines Namens gelesen hast, frage dich, was diese Bedeutung in deiner Annahme, deinem Dua und deinem Verhalten korrigieren sollte.',
        'Die Reflexionen in dieser App sind bewusst vorsichtig. Sie vergleichen Allahs Eigenschaften nicht mit menschlichen Grenzen und behaupten keine verborgenen Wirkungen. Jede Reflexion bleibt ein Lernimpuls zum Datensatz.',
      ],
      primaryCta: 'Reflexion öffnen',
    },
    tr: {
      eyebrow: 'Esmaül Hüsna tefekkürü',
      h1: 'Allah’ın Güzel İsimleri Üzerine Tefekkür',
      title: 'Esmaül Hüsna Tefekkürleri – Allah’ın Güzel İsimleri',
      description: 'Allah’ın güzel isimlerini anlam, dua kullanımı ve günlük davranışla ilişkilendiren ihtiyatlı tefekkür notlarıyla oku.',
      intro: [
        'Tefekkür, ezberin sadece hatırlama olarak kalmamasına yardım eder. Bir ismin Arapçasını ve anlamını öğrendikten sonra bu anlamın düşünceni, duanı ve insanlarla davranışını nasıl düzeltmesi gerektiğini düşün.',
        'Bu uygulamadaki tefekkürler ihtiyatlıdır. Allah’ın sıfatlarını insan sınırlarıyla karşılaştırmaz ve gizli etkiler hakkında spekülatif iddialar kurmaz. Her tefekkür veri setindeki kayıtla bağlantılı bir öğrenme notudur.',
      ],
      primaryCta: 'Tefekkürü aç',
    },
  },
  quiz: {
    en: {
      eyebrow: 'Practice',
      h1: '99 Names of Allah Quiz',
      title: '99 Names of Allah Quiz – Practice Asma ul Husna Meanings',
      description: 'Practice the 99 Names of Allah with a simple, SEO-friendly quiz placeholder that links back to crawlable names and learning pages.',
      intro: [
        'A full interactive quiz can be added later. For now, use this page as a crawlable practice hub: review the names, cover the meaning, and test whether you can recall the Arabic, transliteration, and short meaning without rushing.',
      ],
      primaryCta: 'Review names',
      secondaryCta: 'Open learning mode',
      practiceTitle: 'Suggested practice flow',
      practiceItems: [
        'Open a name detail page and read the Arabic, transliteration, and meaning.',
        'Close the page and write the meaning from memory.',
        'Return to the source note and reflection before marking the name as learned.',
      ],
    },
    de: {
      eyebrow: 'Üben',
      h1: '99 Namen Allahs Quiz',
      title: '99 Namen Allahs Quiz – Asma ul Husna Bedeutungen üben',
      description: 'Übe die 99 Namen Allahs mit einer SEO-freundlichen Quiz-Seite, die auf crawlbare Namen, Bedeutungen und Lernseiten verweist.',
      intro: [
        'Ein vollständiges interaktives Quiz kann später ergänzt werden. Diese Seite dient zunächst als crawlbarer Übungsbereich: Lies einen Namen, verdecke die Bedeutung und prüfe, ob du Arabisch, Transliteration und Kurz Bedeutung ruhig wiedergeben kannst.',
      ],
      primaryCta: 'Namen wiederholen',
      secondaryCta: 'Lernmodus öffnen',
      practiceTitle: 'Vorgeschlagener Übungsablauf',
      practiceItems: [
        'Öffne eine Detailseite und lies Arabisch, Transliteration und Bedeutung.',
        'Schließe die Seite und schreibe die Bedeutung aus dem Gedächtnis.',
        'Lies Quellenhinweis und Reflexion erneut, bevor du den Namen als gelernt markierst.',
      ],
    },
    tr: {
      eyebrow: 'Alıştırma',
      h1: "Allah'ın 99 İsmi Quiz",
      title: "Allah'ın 99 İsmi Quiz – Esmaül Hüsna Anlamlarını Çalış",
      description: "Allah'ın 99 ismini crawl edilebilir isim, anlam ve öğrenme sayfalarına bağlanan SEO uyumlu quiz sayfasıyla çalış.",
      intro: [
        'Tam etkileşimli quiz daha sonra eklenebilir. Şimdilik bu sayfa taranabilir bir alıştırma merkezi olarak kullanılabilir: İsmi oku, anlamı kapat ve Arapça yazımı, transliterasyonu ve kısa anlamı acele etmeden hatırlayıp hatırlamadığını kontrol et.',
      ],
      primaryCta: 'İsimleri tekrar et',
      secondaryCta: 'Öğrenme modunu aç',
      practiceTitle: 'Önerilen çalışma akışı',
      practiceItems: [
        'Bir detay sayfası aç ve Arapça, transliterasyon ve anlamı oku.',
        'Sayfayı kapat ve anlamı hafızandan yaz.',
        'İsmi öğrenildi olarak işaretlemeden önce kaynak notu ve tefekküre geri dön.',
      ],
    },
  },
}

const homeLabels: Record<Language, string> = {
  en: 'Home',
  de: 'Start',
  tr: 'Ana Sayfa',
}

const relevantSlugs = ['ar-rahman', 'ar-rahim', 'al-ghaffar', 'ar-razzaq', 'al-wadud']

export function getLocalizedSeoMetadata(page: LocalizedSeoPage, locale: Language): Metadata {
  const text = copy[page][locale]
  return buildMetadata({
    title: text.title,
    description: text.description,
    path: getLocalizedSeoPath(page, locale),
    locale,
    alternates: seoPageAlternates(page),
  })
}

export function LocalizedSeoPageContent({ page, locale }: { page: LocalizedSeoPage; locale: Language }) {
  if (page === 'asma') return <AsmaPage locale={locale} />
  if (page === 'learn') return <LearnPage locale={locale} />
  if (page === 'dua') return <DuaPage locale={locale} />
  if (page === 'reflections') return <ReflectionsPage locale={locale} />
  return <QuizPage locale={locale} />
}

function PageIntro({
  page,
  locale,
  headingLevel = 'h1',
  subdued = false,
}: {
  page: LocalizedSeoPage
  locale: Language
  headingLevel?: 'h1' | 'h2'
  subdued?: boolean
}) {
  const text = copy[page][locale]
  const Heading = headingLevel
  const headingClass = subdued
    ? 'text-2xl font-semibold leading-tight md:text-3xl'
    : 'text-4xl font-semibold leading-tight md:text-5xl'
  const introClass = subdued
    ? 'space-y-3 text-sm leading-7 text-muted'
    : 'space-y-4 text-base leading-8 text-muted'
  const breadcrumbs = [
    { href: getLocalizedHomePath(locale), label: homeLabels[locale] },
    { href: getLocalizedSeoPath(page, locale), label: text.h1 },
  ]

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs.map((item) => ({ name: item.label, path: item.href })))} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">{text.eyebrow}</p>
        <Heading className={headingClass}>{text.h1}</Heading>
        <div className={introClass}>
          {text.intro.map((paragraph) => (
            <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
      </section>
    </>
  )
}

function LearnPage({ locale }: { locale: Language }) {
  const text = copy.learn[locale]
  return (
    <div lang={locale} className="mx-auto max-w-4xl space-y-8">
      <LearnClient locale={locale} />
      <LearningProgressWidget locale={locale} compact />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link className="btn-primary" href={getLocalizedNamesPath(locale)}>{text.primaryCta}</Link>
        <Link className="btn-secondary" href={getLocalizedSeoPath('reflections', locale)}>{text.secondaryCta}</Link>
      </div>
      <PageIntro page="learn" locale={locale} headingLevel="h2" subdued />
    </div>
  )
}

function DuaPage({ locale }: { locale: Language }) {
  const text = copy.dua[locale]
  const relevantNames = relevantSlugs
    .map((slug) => names.find((name) => name.slug === slug))
    .filter((name): name is (typeof names)[number] => Boolean(name))

  return (
    <div lang={locale} className="mx-auto max-w-4xl space-y-8">
      <PageIntro page="dua" locale={locale} />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {relevantNames.map((name) => (
          <Link key={name.id} href={getLocalizedNamePath(locale, name.slug)} className="rounded-lg border border-white/10 bg-surface p-4 hover:border-gold/50 focus-ring">
            <span className="block text-right font-arabic text-4xl" lang="ar" dir="rtl">{name.arabic}</span>
            <span className="mt-3 block text-xl font-semibold">{name.transliteration}</span>
            <span className="mt-1 block text-sm text-muted">{name.meanings[locale]}</span>
            <span className="mt-3 block text-sm font-semibold text-gold">{text.primaryCta}</span>
          </Link>
        ))}
      </section>
      {text.sourceTitle && text.sourceBody && (
        <section className="rounded-lg border border-gold/20 bg-surface p-5">
          <h2 className="text-2xl font-semibold">{text.sourceTitle}</h2>
          <p className="mt-3 leading-8 text-muted">{text.sourceBody}</p>
        </section>
      )}
    </div>
  )
}

function ReflectionsPage({ locale }: { locale: Language }) {
  const sample = [names[0], names[2], names[10], names[96]]
  return (
    <div lang={locale} className="mx-auto max-w-4xl space-y-8">
      <PageIntro page="reflections" locale={locale} />
      <section className="grid gap-4 sm:grid-cols-2">
        {sample.map((name) => (
          <Link key={name.id} href={getLocalizedNamePath(locale, name.slug)} className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring">
            <span className="block text-right font-arabic text-4xl" lang="ar" dir="rtl">{name.arabic}</span>
            <span className="mt-4 block text-xl font-semibold">{name.transliteration}</span>
            <span className="mt-1 block text-sm text-gold">{name.meanings[locale]}</span>
            <span className="mt-3 block leading-7 text-muted">{name.reflection?.[locale]}</span>
          </Link>
        ))}
      </section>
    </div>
  )
}

function QuizPage({ locale }: { locale: Language }) {
  const text = copy.quiz[locale]
  return (
    <div lang={locale} className="mx-auto max-w-3xl space-y-6">
      <PageIntro page="quiz" locale={locale} />
      {text.practiceTitle && text.practiceItems && (
        <section className="rounded-lg border border-white/10 bg-surface p-5">
          <h2 className="text-2xl font-semibold">{text.practiceTitle}</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-muted">
            {text.practiceItems.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </section>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link className="btn-primary" href={getLocalizedNamesPath(locale)}>{text.primaryCta}</Link>
        <Link className="btn-secondary" href={getLocalizedSeoPath('learn', locale)}>{text.secondaryCta}</Link>
      </div>
    </div>
  )
}

function AsmaPage({ locale }: { locale: Language }) {
  const text = copy.asma[locale]
  return (
    <div lang={locale} className="space-y-8">
      <JsonLd data={itemListJsonLd(names, locale)} />
      <PageIntro page="asma" locale={locale} />
      <Link className="btn-primary" href={getLocalizedNamesPath(locale)}>{text.primaryCta}</Link>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {names.map((name) => (
          <li key={name.id}>
            <Link href={getLocalizedNamePath(locale, name.slug)} className="block rounded-lg border border-white/10 bg-surface p-4 hover:border-gold/50 focus-ring">
              <span className="text-sm text-gold-muted">#{name.id.toString().padStart(2, '0')}</span>
              <span className="mt-3 block text-right font-arabic text-3xl" lang="ar" dir="rtl">{name.arabic}</span>
              <span className="mt-3 block font-semibold">{name.transliteration}</span>
              <span className="mt-1 block text-sm text-muted">{name.meanings[locale]}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
