import type { Language } from '@/types/language'

export type LocalizedNameText = Record<Language, string>

export type NameEntry = {
  id: number;
  slug: string;
  arabic: string;
  transliteration: LocalizedNameText;
  pronunciation: LocalizedNameText;
  meanings: { de: string; tr: string; en: string };
  explanations: { de: string; tr: string; en: string };
  duaUsage: { de: string; tr: string; en: string };
  reflection?: { de: string; tr: string; en: string };
  sourceNote?: { de: string; tr: string; en: string };
  source?: { de: string; tr: string; en: string };
  contentReviewRequired: boolean;
}
