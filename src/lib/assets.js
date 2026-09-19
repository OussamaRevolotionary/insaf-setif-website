// GitHub Pages serves the built site under /insaf-setif-website/ rather than the
// domain root. Vite exposes the configured base as BASE_URL; local `/public` assets
// referenced by a literal leading slash need this prefix, remote URLs must not.
export const BASE_URL = import.meta.env.BASE_URL;

export function withBase(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return BASE_URL + path.replace(/^\//, '');
}
