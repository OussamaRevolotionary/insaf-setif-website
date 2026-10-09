import legacyAr from '@/data/legacy-ui.ar.json';
import legacyFr from '@/data/legacy-ui.fr.json';
import legacyEn from '@/data/legacy-ui.en.json';
import { strings } from './strings';

export const LOCALES = ['ar', 'fr', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'ar';

export const LANG_META: Record<Lang, { label: string; short: string; dir: 'rtl' | 'ltr'; og: string; intl: string }> = {
  ar: { label: 'العربية', short: 'ع', dir: 'rtl', og: 'ar_DZ', intl: 'ar-DZ' },
  fr: { label: 'Français', short: 'FR', dir: 'ltr', og: 'fr_DZ', intl: 'fr-FR' },
  en: { label: 'English', short: 'EN', dir: 'ltr', og: 'en_GB', intl: 'en-GB' },
};

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** getStaticPaths helper for every `[lang]` page. */
export function langPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

/**
 * Site routes (Latin slugs in every language so links stay shareable).
 * `key` is used for nav labels, SEO copy and the language switcher.
 */
export const ROUTES = {
  home: '',
  about: 'about/',
  rights: 'children-rights/',
  goals: 'goals/',
  programs: 'programs/',
  achievements: 'achievements/',
  news: 'news/',
  contact: 'contact/',
  donate: 'donate/',
  trust: 'trust/',
} as const;
export type RouteKey = keyof typeof ROUTES;

const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** Path inside the site for a route in a language, e.g. /insaf-setif-website/fr/donate/ */
export function href(lang: Lang, route: RouteKey | string = 'home', query = '') {
  const slug = route in ROUTES ? ROUTES[route as RouteKey] : route;
  return `${BASE}${lang}/${slug}${query}`;
}

/** Asset under /public, respecting the GitHub Pages base path. */
export function asset(path: string) {
  return `${BASE}${path.replace(/^\//, '')}`;
}

const LEGACY = { ar: legacyAr, fr: legacyFr, en: legacyEn } as const;
export type LegacyUI = typeof legacyAr;

/** UI copy: the approved legacy dictionary plus the strings added for the rebuild. */
export function useT(lang: Lang) {
  return { ...(LEGACY[lang] as LegacyUI), ...strings[lang] };
}

/** Pick a value from an { ar, fr, en } object. */
export function pick<T>(lang: Lang, obj: Partial<Record<Lang, T>>): T {
  return (obj[lang] ?? obj.ar ?? obj.fr ?? obj.en) as T;
}

/** "5 000 DA" / "5 000 دج" — Algerian grouping with Western digits in every language. */
export function formatDA(amount: number, lang: Lang) {
  const n = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(amount)).replace(/ | /g, ' ');
  return lang === 'ar' ? `${n} دج` : `${n} DA`;
}

export function formatDate(iso: string, lang: Lang, style: 'medium' | 'long' = 'medium') {
  try {
    return new Intl.DateTimeFormat(LANG_META[lang].intl, { dateStyle: style }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}
