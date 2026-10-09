import type { ImageMetadata } from 'astro';

// Every official photo lives in src/assets/photos so Astro can optimise it
// (AVIF/WebP, responsive widths) at build time.
const PHOTOS = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/*.jpg', { eager: true });

const byName = new Map<string, ImageMetadata>(
  Object.entries(PHOTOS).map(([path, mod]) => [path.split('/').pop() as string, mod.default]),
);

/** Resolve a legacy "/photos/123.jpg" path to optimisable image metadata. Remote
 *  Facebook CDN links expire, so they are never hotlinked — they return null. */
export function photo(path?: string | null): ImageMetadata | null {
  if (!path || /^https?:/i.test(path)) return null;
  return byName.get(path.split('/').pop() as string) ?? null;
}

export function photoByName(name: string): ImageMetadata {
  const img = byName.get(name);
  if (!img) throw new Error(`Photo not found in src/assets/photos: ${name}`);
  return img;
}

/** Posters, greetings and announcements (text-heavy graphics, not field photos).
 *  Kept for the news archive but skipped where a page wants a real photo. Reviewed by eye. */
const GRAPHICS = new Set([
  '1034715132285559', '1031978269225912', '1026462569777482', '1018755420548197', '1017644373992635',
  '1013779311045808', '1012552074501865', '1007990554958017', '1007890828301323', '1007160881707651',
]);

export function isGraphic(img: ImageMetadata | null) {
  if (!img) return false;
  const name = img.src.split('/').pop()?.split(/[.?]/)[0] ?? '';
  return GRAPHICS.has(name);
}

/** Hero photo: children's-rights workshop, 24 June 2026. */
export const HERO_PHOTO = '1014529634304109.jpg';
