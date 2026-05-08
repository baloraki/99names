# Standard für Kontakt / Impressum / Datenschutz (für Folgeprojekte)

Diese Datei definiert einen **einheitlichen, wiederverwendbaren Aufbau** für drei Rechtsseiten in künftigen Projekten:

1. **Kontakt** → gleiche Technologie und gleiches UX-Muster
2. **Impressum** → gleiche Pflichtangaben und gleiche Struktur
3. **Datenschutz** → gleicher Kapitelaufbau und gleiche Systematik

---

## 1) Ziel und Prinzipien

- Rechtsseiten sollen in allen Projekten gleich aussehen und sich gleich verhalten.
- Inhalte sollen zentral gepflegt werden (z. B. Betreiberdaten aus Umgebungsvariablen).
- Mehrsprachigkeit bleibt konsistent (de/en/tr oder projektabhängig).
- Technische Umsetzung orientiert sich am bestehenden Next.js-App-Router-Ansatz.

---

## 2) Technischer Standard (Kontakt-Seite)

## 2.1 Architektur

- **Client-Komponente** für die Kontaktseite verwenden (z. B. `ContactPageClient`).
- Sprache über globalen App-State oder Route-Kontext bestimmen.
- Lokalisierte Texte über das vorhandene i18n-Dictionary laden.
- Kontaktformular als eigene Komponente kapseln (z. B. `ContactForm`).

## 2.2 Struktur Kontaktseite

Die Seite besteht immer aus:

1. Eyebrow/Label (z. B. „Kontakt“)
2. H1-Titel
3. Kurzer Einleitungstext
4. Formular-Komponente

## 2.3 Formular-Standard

Pflichtfelder:

- Name
- E-Mail
- Nachricht

Empfohlen:

- Client-seitige Validierung (Pflichtfeld, E-Mail-Format, Mindestlänge)
- Spam-Schutz (Honeypot, ggf. Service wie Web3Forms)
- Klarer Erfolg-/Fehlerstatus nach Versand
- Datenschutz-Hinweis direkt am Formular (inkl. Link auf Datenschutzerklärung)

## 2.4 Technologie-Vorgaben

- Gleiches Styling-System wie im Hauptprojekt (Tailwind + bestehende Design-Tokens).
- Keine abweichende UI-Bibliothek nur für Rechtsseiten.
- Einheitliche Komponentenabstände, Typografie und Kartenstil.

---

## 3) Inhaltsstandard (Impressum)

Das Impressum folgt immer derselben Reihenfolge:

1. Seitentitel + Untertitel (rechtlicher Bezug)
2. Abschnitt „Verantwortlicher / Operator“
3. Abschnitt „Inhaltlich verantwortlich“
4. Abschnitt „Zweck der Website“
5. Abschnitt „Haftungshinweise“
6. Link zur Datenschutzerklärung

## 3.1 Pflichtdaten (zentral konfigurierbar)

Betreiberdaten sollen als zentrale Konfiguration/ENV geführt werden:

- Name
- Straße
- Stadt
- Land
- E-Mail (obfuskiert darstellen)

## 3.2 Darstellungsregeln

- E-Mail nicht als Klartext hartcodieren; obfuskierte Ausgabe-Komponente verwenden.
- Jede Sektion in eigener visuell abgegrenzter Card darstellen.
- Sprachabhängige Texte in derselben semantischen Struktur halten.

---

## 4) Inhaltsstandard (Datenschutz)

Die Datenschutzerklärung verwendet immer denselben Kapitelrahmen.

## 4.1 Fester Kapitelaufbau

1. Verantwortlicher
2. Grundsätze der Datenverarbeitung
3. Lokaler Speicher (localStorage)
4. Push-Benachrichtigungen (falls genutzt)
5. Eingesetzte Infrastruktur/DB (z. B. Supabase)
6. Analytics/Performance-Dienste (z. B. Vercel Analytics)
7. Kontaktformular-Dienst (z. B. Web3Forms)
8. Speichertechnologien/Cookies
9. Server-Logs
10. Rechte der betroffenen Personen
11. Änderungen der Datenschutzerklärung

> Wenn ein Projekt einzelne Funktionen nicht nutzt (z. B. Push), bleibt die Nummerierung konsistent und der Abschnitt wird angepasst oder entfernt – dokumentiert und bewusst.

## 4.2 Inhaltliche Mindestanforderungen pro Abschnitt

Für jeden Abschnitt immer beantworten:

- **Welche Daten** werden verarbeitet?
- **Warum** werden sie verarbeitet?
- **Rechtsgrundlage** (DSGVO/landesspezifisch)
- **Speicherdauer**
- **Empfänger/Drittlandtransfer**
- **Widerruf-/Widerspruchsmöglichkeiten** (falls relevant)

## 4.3 Versionierung

- „Stand: Monat Jahr“/„Last updated“ immer sichtbar oben ausgeben.
- Änderungen an Datenschutztexten müssen im Changelog/Commit-Text erwähnt werden.

---

## 5) Mehrsprachigkeit (alle drei Seiten)

- Jede Rechtsseite hat je Sprache denselben semantischen Aufbau.
- Übersetzungen dürfen stilistisch variieren, aber rechtliche Aussage muss äquivalent bleiben.
- Interne Links (Kontakt ↔ Impressum ↔ Datenschutz) müssen lokalisiert sein.

---

## 6) Wiederverwendungs-Blueprint für neue Projekte

## 6.1 Zu übernehmende Bausteine

- `ContactPageClient`-Muster
- `ContactForm`-Muster
- `ImprintPageContent`-Muster mit zentralem `OPERATOR`
- `PrivacyPageContent`-Muster mit klarer Abschnittsliste
- `ObfuscatedEmail`-Komponente
- Lokalisierte Pfad-Helferfunktion für interne Legal-Links

## 6.2 ENV-Checkliste pro Projekt

Mindestens setzen:

- `NEXT_PUBLIC_OPERATOR_NAME`
- `NEXT_PUBLIC_OPERATOR_STREET`
- `NEXT_PUBLIC_OPERATOR_CITY`
- `NEXT_PUBLIC_OPERATOR_COUNTRY`

Optional je nach Projekt:

- Region/Anbieter-Konfigurationen (z. B. Supabase-Region)
- Kontaktformular-Service-Keys

## 6.3 QA-Checkliste vor Go-Live

- Kontaktformular kann erfolgreich senden.
- Validierung und Fehlermeldungen funktionieren.
- Impressum enthält echte Betreiberdaten (keine Platzhalter).
- Datenschutz nennt alle tatsächlich aktivierten Dienste.
- Alle Legal-Links sind in allen Sprachen korrekt.
- Mobile und Desktop Darstellung konsistent.

---

## 7) Empfohlene Ordner-/Dateistruktur

```text
src/components/
  ContactPageClient.tsx
  ContactForm.tsx
  ImprintPageContent.tsx
  PrivacyPageContent.tsx
  ObfuscatedEmail.tsx

src/app/
  (en)/contact/page.tsx
  (en)/imprint/page.tsx
  (en)/privacy/page.tsx
  de/kontakt/page.tsx
  de/impressum/page.tsx
  de/datenschutz/page.tsx
  tr/iletisim/page.tsx
  tr/kunye/page.tsx
  tr/gizlilik/page.tsx
```

---

## 8) Kurzfassung für künftige Projekte

- **Kontakt:** gleiche Client-Architektur + gleiches Formular-Pattern.
- **Impressum:** gleiche Pflichtinfos + gleiche Abschnittsreihenfolge.
- **Datenschutz:** gleicher Kapitelaufbau + gleiche rechtliche Logik.
- **Alles mehrsprachig und zentral konfigurierbar.**
