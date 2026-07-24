# Association Insaf Sétif — React Website

A complete standalone React/Vite website for Association Insaf Sétif, built from the provided logo and Facebook post dataset.

## What is included

- Responsive hero section
- Header and footer
- About/history section
- Original mission, vision, values, and association goals
- Programs and impact pillars
- Achievements / institutional presence section
- Partners section
- Searchable and filterable News section generated from the Facebook scraper JSON
- Contact/collaboration section with form UI
- Arabic, French, and English language switching
- Production build in `dist/`

## Project structure

```txt
D:/Projects/INSAFe
├─ public/LOGO.jpg
├─ src/
│  ├─ data/newsPosts.js
│  ├─ main.jsx
│  └─ styles.css
├─ index.html
├─ package.json
├─ package-lock.json
└─ dist/
```

## Run locally

```bash
npm install
npm run dev -- --port 5173
```

Open:

```txt
http://127.0.0.1:5173
```

## Build for deployment

```bash
npm run build
```

Deploy the generated `dist/` folder to any static host.

## Notes

- Official phone and email are left as placeholders because they were not provided.
- The News section currently imports 49 processed posts from `dataset_facebook-posts-scraper_2026-07-20_08-51-29-551.json`.
- No unverifiable statistics were invented.
