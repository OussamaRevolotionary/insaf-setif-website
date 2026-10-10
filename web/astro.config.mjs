// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Hosted on GitHub Pages under /insaf-setif-website/ until a custom domain is set.
// When the domain is ready: set `site` to it and `base` to '/'.
const SITE = 'https://oussamarevolotionary.github.io';
const BASE = '/insaf-setif-website';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    locales: ['ar', 'fr', 'en'],
    defaultLocale: 'ar',
    // src/pages/index.astro does the root redirect itself (language choice + legacy #/ links).
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'ar', locales: { ar: 'ar-DZ', fr: 'fr-DZ', en: 'en' } },
    }),
  ],
  image: {
    // Photos are optimised at build time into AVIF/WebP at a few widths.
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
