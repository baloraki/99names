export type NameEntry = {
  id: number;
  slug: string;
  arabic: string;
  transliteration: string;
  pronunciation: string;
  meanings: { de: string; tr: string; en: string };
  explanations: { de: string; tr: string; en: string };
  duaUsage: { de: string; tr: string; en: string };
  reflection?: { de: string; tr: string; en: string };
  sourceNote?: { de: string; tr: string; en: string };
  contentReviewRequired: boolean;
}
