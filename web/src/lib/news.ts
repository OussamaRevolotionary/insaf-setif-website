import type { ImageMetadata } from 'astro';
import news from '@/data/news.json';
import { photo } from './photos';
import type { Lang } from '@/i18n';

export type NewsCategory = 'Child Protection' | 'Youth Projects' | 'Association News' | 'Partnerships' | 'Solidarity' | 'Reintegration';

export const CATEGORY_LABELS: Record<NewsCategory, Record<Lang, string>> = {
  'Child Protection': { ar: 'حماية الطفولة', fr: 'Protection de l’enfance', en: 'Child protection' },
  'Youth Projects': { ar: 'مشاريع الشباب', fr: 'Projets jeunesse', en: 'Youth projects' },
  'Association News': { ar: 'أخبار الجمعية', fr: 'Vie de l’association', en: 'Association news' },
  Partnerships: { ar: 'شراكات', fr: 'Partenariats', en: 'Partnerships' },
  Solidarity: { ar: 'تضامن', fr: 'Solidarité', en: 'Solidarity' },
  Reintegration: { ar: 'إدماج', fr: 'Insertion', en: 'Reintegration' },
};

export interface NewsItem {
  id: string;
  date: string;
  text: string;
  headline: string;
  /** Language of the post text itself (posts are mostly Arabic, whatever the page language). */
  textLang: 'ar' | 'fr';
  category: NewsCategory;
  url: string;
  image: ImageMetadata | null;
  /** Every local photo of the post, in order (remote Facebook CDN links are dropped). */
  images: ImageMetadata[];
}

/** Hashtags are often part of the sentence: keep their words, drop the # and underscores. */
export function readable(text: string) {
  return text.replace(/#([\p{L}\p{N}_]+)/gu, (_, w: string) => w.replace(/_/g, ' '));
}

/** Post body as paragraphs. */
export function paragraphs(text: string) {
  return readable(text)
    .split(/\n+/)
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean);
}

/** First meaningful line of a Facebook post. Hashtags are often part of the sentence,
 *  so they keep their words and lose only the # and underscores. */
function headlineOf(text: string) {
  const line = text
    .split('\n')
    .map((l) => readable(l).replace(/[\p{Extended_Pictographic}‍️]/gu, '').replace(/\s+/g, ' ').trim())
    .find((l) => l.length > 12) ?? '';
  return line.length > 110 ? `${line.slice(0, 108).trim()}…` : line;
}

function localImages(p: { image?: string; images?: string[] }) {
  const out: ImageMetadata[] = [];
  for (const path of [p.image, ...(p.images ?? [])]) {
    const img = photo(path);
    if (img && !out.includes(img)) out.push(img);
  }
  return out;
}

export const NEWS: NewsItem[] = news.newsPosts
  .map((p) => {
    const images = localImages(p);
    return {
    id: String(p.id),
    date: p.date,
    text: p.text ?? '',
    headline: headlineOf(p.text ?? ''),
    textLang: /[؀-ۿ]/.test(p.text ?? '') ? ('ar' as const) : ('fr' as const),
    category: p.category as NewsCategory,
    url: p.url,
    image: images[0] ?? null,
    images,
    };
  })
  .filter((p) => p.headline)
  .sort((a, b) => b.date.localeCompare(a.date));

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as NewsCategory[];
