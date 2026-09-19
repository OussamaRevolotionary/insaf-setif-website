# Association Insaf Sétif — Website Overhaul & Automation Plan

**Owner:** Oussama (oussamabdi19@gmail.com) · **Stack:** React 18 + Vite + React Router (HashRouter) + lucide-react
**Started:** 2026-07-23 · **Tracker:** this file (checkboxes updated as work lands)

> Goal: fix bugs, make the site clean / consistent / dynamic / professional, and wire two n8n automations
> (AI chatbot + contact-form → spreadsheet + email). Keep the **established brand identity** (logo-derived
> palette) — do not swap it for a generic template palette.

---

## 0. Findings (audit of the current build)

### 🐞 Bugs
| # | Severity | Bug | Location |
|---|----------|-----|----------|
| B1 | **High** | Chat widget internals, News card meta rows & Achievements headline use **Tailwind utility classes** (`flex`, `bg-slate-50`, `rounded-2xl`, `text-xs`…) but the project has **no Tailwind** — those styles are dead, so the chat message area renders unstyled. | `src/main.jsx` (AIAgentChatWidget, NewsPage, AchievementsPage) |
| B2 | **High** | Contact form **POSTs to the chat webhook** (`/webhook/insaf-chat`) instead of its own endpoint. | `ContactPage` |
| B3 | Med | Chatbot "typing…" text is **hardcoded Arabic** (`الوكيل الذكي يفكر...`) in all languages; some fallback replies give English to French users. | `AIAgentChatWidget` |
| B4 | Med | Hero photo-orbit is positioned by **two conflicting systems** (inline `cos/sin` styles *and* CSS `nth-child` transforms). | `HomePage` + `styles.css §8` |
| B5 | Low | `© 2024` copyright is **hardcoded** (site is live in 2026). | translations |
| B6 | Low | `useScrollReveal` has **no dependency array** → re-registers observers on every render. | hooks |
| B7 | Low | Remote **Facebook CDN image URLs** in news data expire → broken images; fallback exists on News but Achievements just hides the image. | `newsPosts.js`, cards |
| B8 | Low | A11y: lang buttons + chat input lack `aria-label`; some icon buttons OK. | header, chat |
| B9 | Perf | Always-on hero **video + orbit spin + ticker** never idle (also blocks tooling screenshots); heavy on mobile. | hero |

### 🎨 Design / consistency
- Chat widget must become a **polished, brand-consistent component** (real CSS, animated typing dots, RTL-aware).
- Unify card meta rows, headline styles, spacing rhythm; keep brand palette.
- Respect `prefers-reduced-motion`; ensure 375 / 768 / 1024 / 1440 breakpoints are clean.
- Document the design system so future edits stay consistent.

### 🔌 Automations (n8n @ `https://oussama19.app.n8n.cloud`)
- **Chatbot:** Gemini-powered AI Agent behind `POST /webhook/insaf-chat`.
- **Contact form:** `POST /webhook/insaf-contact` → append to Google Sheet → email owner + auto-reply to submitter.

---

## 1. Brand & Design System (source of truth)

**Palette (from the logo — keep):**
`--blue #1F9BB4` (primary) · `--navy #2F3E9E` (institutional) · `--green #20A66A` · `--yellow #F2C900`
· `--orange #F39A22` · `--red #E63F4D` · ink `#101828` / muted `#667085`.

**Type:** Cairo (AR + display) + Inter (FR/EN body). Weights already loaded.
**Motion:** 150–300ms micro-interactions, spring easing; all continuous loops gated behind reduced-motion.
**Components:** pill buttons, 20–36px radii, layered soft shadows, glass header. Icons = lucide (no emoji as UI icons).
**A11y target:** WCAG AA — 4.5:1 text contrast, visible focus rings, 44px touch targets, labelled controls.

---

## 2. Work Plan (execute top-to-bottom)

### Phase A — Structural bug fixes (code) ✅
- [x] **A1.** Rewrote `AIAgentChatWidget` with semantic classes; added full chat CSS (gradient header, scroll body, bubbles, animated typing dots, quick-prompts, input) — RTL aware. Verified via computed styles.
- [x] **A2.** Replaced dead Tailwind classes in News & Achievements cards with real classes/CSS.
- [x] **A3.** Split webhooks: contact form → `/webhook/insaf-contact`; added honeypot + awaited fetch with real success/error handling.
- [x] **A4.** i18n: language-aware typing label + complete AR/FR/EN fallback + local answers.
- [x] **A5.** Dynamic copyright year; lighter `useScrollReveal` (observes `:not(.visible)` only).
- [x] **A6.** Rebuilt hero orbit as one revolving ring with upright counter-rotation; graceful image fallbacks.

### Phase B — Design polish & consistency ✅
- [x] **B1.** Chat widget visual pass (brand gradient header, live status dot, message tails, timestamps, disabled-send state).
- [x] **B2.** Consistency sweep: news meta row, headline styles, spacing utility, global `:focus-visible` rings, **real Facebook brand SVG** (lucide dropped brand icons — was crashing the app), replaced emoji award pill with lucide icon.
- [x] **B3.** Performance/motion: hero video `preload="metadata"` + `aria-hidden`; reduced-motion already gates all loops.
- [x] **B4.** Verified render on Home / News / Contact routes (DOM + computed styles); hero stats now show real social proof (19K+ followers).

### Phase C — n8n automations ✅ (built, inactive)
- [x] **C1.** Chatbot workflow: Webhook `insaf-chat` → Normalize (Set) → AI Agent (**Gemini 2.5 Flash** + window memory keyed on `sessionId`) → Respond `{ output }`. Validated. Created & **inactive**.
      → [workflow `1h2f9kCIZGlocYx3`](https://oussama19.app.n8n.cloud/workflow/1h2f9kCIZGlocYx3) · Gemini credential auto-linked.
- [x] **C2.** Contact workflow: Webhook `insaf-contact` → Normalize → fan-out: Google Sheets append + Gmail owner notify (oussamabdi19@gmail.com, reply-to = submitter) + Gmail auto-reply (trilingual) + Respond `{ ok }`. Validated. Created & **inactive**.
      → [workflow `seKxiRh5kELmH1vM`](https://oussama19.app.n8n.cloud/workflow/seKxiRh5kELmH1vM) · Sheets + Gmail credentials auto-linked.
- [x] **C3.** Site posts to `/webhook/insaf-chat` (+ persistent `sessionId`) and `/webhook/insaf-contact` — paths match the deployed workflows.

### ✅ Go-live DONE (activated + live-tested 2026-07-23)
- [x] **G1.** Created spreadsheet **[Insaf – Contact Submissions](https://docs.google.com/spreadsheets/d/1Pa2Fee1VWjLAMhZQ8rxQK4ceVICA1QeXrF5fFNBp4u0/edit)** (tab `Submissions`, headers written).
- [x] **G2.** Both workflows **ACTIVE**:
      - Chatbot → [`1h2f9kCIZGlocYx3`](https://oussama19.app.n8n.cloud/workflow/1h2f9kCIZGlocYx3) (personal project) — Gemini **New Gemini** cred + `models/gemini-3.1-flash-lite`.
      - Contact → [`ydWEs4zCB6ximsmn`](https://oussama19.app.n8n.cloud/workflow/ydWEs4zCB6ximsmn) (team project "Futuristic Life") — **Google Sheets account** + **Oussama Gmail** creds.
- [x] **G3.** Live-tested: chatbot answered EN + AR (real Gemini). Contact form appended a sheet row **once**, emailed owner + auto-replied — all `success`.

**Credential notes (important):** personal-project **Google Sheets account 2**, Gemini **Google Gemini(PaLM) Api account**, and **Gmail account** all have **expired OAuth** — avoided. Working creds used instead. The contact workflow lives in the **team** project because the only working Google Sheets credential is there (same n8n instance, so the `/webhook/insaf-contact` URL is unchanged).
**QA leftovers:** a few test rows in the sheet + a couple of test emails in oussamabdi19@gmail.com — safe to delete.
**Fixed during go-live:** contact fan-out caused **4× duplicate** sheet rows/emails per submit → rebuilt as a linear chain (one write each).

### Phase D — Verify & ship ✅
- [x] **D1.** Dev-server verification: no console errors; chat opens & answers; Home/News/Contact render; hero stats/orbit/Facebook glyph confirmed via DOM + computed styles.
- [x] **D2.** `npm run build` succeeds (1783 modules, ~5.9s); `dist/` refreshed.
- [x] **D3.** `MEMORY.md` updated with INSAFe entry; go-live checklist above (G1–G3).

---

## 3. n8n Credentials to use (personal project `15hGMh2I6HXJvXk7`)
- **Gemini (googlePalmApi):** `New Gemini` (`6NjyyVzozcrCCZ2J`)
- **Google Sheets (OAuth2):** `Google Sheets oussama19` (`4skWlyOrFj84KJxt`)
- **Gmail (OAuth2):** `Gmail account 4` (`rry461DbJwQA7gJA`)

## 4. Decisions (defaults chosen; change anytime)
- Contact emails: **owner notify (you)** + **auto-reply to submitter**. Association inbox not emailed during testing.
- Sheet: **new** *Insaf – Contact Submissions*.
- Go-live: **build + validate, leave workflows inactive** for review.

---

### Phase E — 3D pages rebrand (ecosystem + timeline) ✅
- [x] **E1.** Rebranded `ecosystem_of_empowerment.html` to the site theme: brand palette in the Three.js scene, brand-tinted dark gradient background, glass UI with brand chip, Cairo/Inter, inline-style dynamic colors (no fragile runtime Tailwind classes). Verified render, no console errors.
- [x] **E2.** Rebranded `timeline_of_progress.html` the same way **and fixed a real crash**: `updateUI()` queried `.rounded-full.mb-4` but the divider was `my-3` → `null.className` threw at init, halting the scene. Replaced with `#active-divider` + `.tl-dot` + inline styles. Verified: info panel now shows, milestone accents apply, dots color correctly.
- [x] **E3.** Synced both files to `public/` (served) and rebuilt `dist/`.

### Phase F — Repo + live GitHub Pages URL ✅
- [x] **F1.** Pushed the full project to **https://github.com/OussamaRevolotionary/insaf-setif-website** (`node_modules`/`dist`/raw FB photo dump gitignored; 148MB tracked, no secrets).
- [x] **F2.** Added `vite.config.js` (base `/` in dev, `/insaf-setif-website/` in build) + a `withBase()` helper in `main.jsx` so every hardcoded root-relative asset (logo, hero video, both 3D iframes, local news photos) resolves under the Pages subpath; remote Facebook CDN URLs pass through untouched.
- [x] **F3.** Added `.github/workflows/deploy-pages.yml` — builds with Vite and deploys `dist/` via the official Pages Actions flow on every push to `main`.
- [x] **F4.** Owner enabled **Settings → Pages → Source: GitHub Actions** (one-time, required before the first deploy could succeed).
- [x] **F5.** **Live and fully verified**: real HTML/JS/CSS served correctly, LOGO.jpg + photos + both 3D pages load under the subpath, a bogus path correctly 404s (genuine static routing), HashRouter navigation works, chat widget renders, and a live contact-form submission from the production domain succeeded (sheet + emails).

**Live URL:** https://oussamarevolotionary.github.io/insaf-setif-website/

---

### Phase G — Enterprise donation platform ✅ (test mode)
Strategy and benchmark evidence: [`docs/COMPETITIVE_ANALYSIS.md`](docs/COMPETITIVE_ANALYSIS.md).

**G0. Ground rules followed**
- No new code in `src/styles.css`. It only **shrank**: about 790 lines of dead §28–§34 CSS from the previous rebuild were removed. §35 flag stripe and §36 gallery are kept.
- Every new style lives in a `*.module.css` file.
- The 3D pages (`public/ecosystem_of_empowerment.html`, `public/timeline_of_progress.html`) are untouched (`git diff -- public` is empty).
- The Chargily **secret key never reaches the browser or the repo.** It lives only in the n8n HTTP node. The importable export `n8n-chargily-workflow.json` is gitignored.

**G1. Dependency**
- `react-fast-marquee@^1.6.5`.
- The package ships CommonJS. Vite 8's dev pre-bundler hands back the exports object instead of the component, which crashed the page with "Element type is invalid". `src/lib/marquee.js` unwraps `default`, so dev and prod behave the same. **Always import Marquee from there.**

**G2. File map**
```
src/
├─ main.jsx                      routes (+ /donate), SiteShell, HomePage wiring, i18n (ar/fr/en "Donation platform (Phase G)" blocks)
├─ lib/
│  ├─ lang.js                    LangContext, useLang(), pickLang()        (moved out of main.jsx — avoids circular imports)
│  ├─ assets.js                  BASE_URL, withBase()                      (moved out of main.jsx)
│  ├─ format.js                  dateFmt(), localeFor(), formatDA()        ("5 000 DA" / "5 000 دج")
│  ├─ hooks.js                   useInViewOnce() (disconnects on first hit), usePrefersReducedMotion(), safeStorage*
│  └─ marquee.js                 CJS-interop shim for react-fast-marquee
├─ config/
│  ├─ donation.js                webhook URL, test-mode flag, limits, presets, designations, LOCAL_RAILS (empty on purpose), INTERNATIONAL_BANK
│  └─ campaigns.js               campaign goals, FIGURES_ARE_ILLUSTRATIVE, getSeasonalAppeal() (Gregorian + Hijri)
└─ components/                   each with a matching *.module.css
   ├─ UrgencyBanner              seasonal appeal, dismissible per appeal+year
   ├─ HeaderDonateButton         persistent Donate pill; also owns the ≤480px compact-header rules
   ├─ ActivityTicker             Marquee of real news posts (RTL-correct, pause on hover, reduced-motion aware)
   ├─ ChildrenHelpHub            3 giving tiers + real photo + accessible composite-story carousel
   ├─ NaturePillar               wildfire solidarity fund + SVG regrowth scene + 3 green programs
   ├─ CampaignSection            progress bars (scaleX, compositor-only), one observer, disconnect after first view
   └─ LocalDonationBox           tabs: Edahabia/CIB (Chargily) · BaridiMob · CCP · International
```

**G3. Component hierarchy**
```
App (HashRouter + LangContext)
└─ SiteShell
   ├─ UrgencyBanner ─────────────► Link /donate?campaign=…&amount=…
   ├─ header … HeaderDonateButton ► NavLink /donate
   └─ Routes
      ├─ /        HomePage
      │           ├─ ActivityTicker(posts)
      │           ├─ impact counters (partners = partners.length)
      │           ├─ ChildrenHelpHub(photo) ► tier Links /donate?campaign=school|health|winter&amount=…
      │           ├─ NaturePillar ─────────► /donate?campaign=wildfire&amount=3500
      │           ├─ CampaignSection
      │           └─ LocalDonationBox(embedded)
      └─ /donate  DonatePage ► LocalDonationBox(initialAmount, initialDesignation, returnStatus)
```

**G4. Payment flow (Chargily Pay V2, test)**
```
LocalDonationBox ──POST {amount, method, campaign, lang, name?, email?, website(honeypot)}──►
  n8n  INSAF — Chargily Checkout Bridge  (id BKjVi4aLws3dLXyS, ACTIVE)
       Webhook /webhook/chargily-checkout
       → Code: sanitize · allowlist campaign/method/lang · 100 ≤ amount ≤ 500 000 (integer) · email check · honeypot
               · reference INSAF-<time36>-<crypto hex> · success/failure URLs fixed server-side (no open redirect)
       → IF valid ─► HTTP POST https://pay.chargily.net/test/api/v2/checkouts (Bearer secret, 15 s timeout)
                    ├─ ok    ─► 200 { checkout_url (https), reference }   Cache-Control: no-store
                    └─ error ─► 502 { error: payment_provider_error }
             else ─► 400 { error }
◄── browser checks checkout_url is https on a chargily.* host, then window.location.assign()
Chargily ──► …/?donation=success|failure#/donate ──► DonatePage shows the panel, then strips the query
```

**G5. Verification log (2026-09-19)**
- [x] Bridge API: 7 cases (valid edahabia/ar, valid cib/fr, amount 50, amount 12.5, bad email, honeypot, hostile campaign/lang) → 200/200/400/400/400/400/200 (normalized). Chargily stored the metadata correctly.
- [x] Browser, end to end: health tier → `/donate?campaign=health&amount=8000` → 8 000 DA and "health" preselected → Pay → **landed on `pay.chargily.dz/test/checkouts/…/pay` for 8,000.00 DA, in Arabic**.
- [x] Return panels: success and failure both render, and the `?donation=` query is removed from the URL.
- [x] Tabs: RTL arrow-key navigation. Pending rails show "coming soon"; International shows 5 copy buttons.
- [x] FR/EN LTR copy and layout; AR RTL.
- [x] No horizontal overflow at 320, 360 and 375 px (ar/fr/en), 768 and 1280.
  - The existing header already overflowed phones by ~38 px; the new Donate pill made it worse.
  - Fixed with ≤480px compact-header rules in `HeaderDonateButton.module.css`.
  - The reveal-animation offsets are contained with `overflow-x: clip`.
- [x] `npm run build` green. The 3D pages were untouched.

**G6. Go-live checklist (owner / association)**
1. **Association data.** Fill `LOCAL_RAILS` in `src/config/donation.js`:
   - BaridiMob RIP (20 digits) and the QR image at `public/baridipay-qr.png`
   - CCP account + clé

   Also replace `INTERNATIONAL_BANK`, which is currently a **personal** account, with the association's account.
2. **Chargily dashboard.** Rename the app from "My new app" to **Insaf Sétif**. Donors see this name on the checkout page.
3. **Live keys**, in n8n workflow `BKjVi4aLws3dLXyS`:
   - Create an **HTTP Bearer Auth credential** holding the live secret, and select it on *Create Chargily Checkout*. Remove the inline header.
   - Change the URL to `https://pay.chargily.net/api/v2/checkouts`.
   - Publish.
4. **Site.** Set `CHARGILY_TEST_MODE = false` in `src/config/donation.js`, then push; the Pages workflow deploys it.
5. **Real numbers.** Enter the real campaign totals in `src/config/campaigns.js`, then set `FIGURES_ARE_ILLUSTRATIVE = false`. Also confirm the "2300 beneficiaries" counter.
6. **Payment confirmation (recommended before launch).** Point a Chargily webhook to a new n8n workflow that:
   - verifies the `signature` header (HMAC-SHA256 with the secret)
   - appends the paid donation to a Sheet
   - emails the donor a receipt

### Phase H — Algerian flag header, Children's Rights hub, Trust page ✅
The benchmark crawl (90 pages) is used as internal design inspiration, not as a client deliverable. Same rules as Phase G: CSS Modules only; `styles.css` and the 3D pages are untouched.

- [x] **H1. Header flag** (`components/HeaderFlag.*`).
  - A waving SVG flag of Algeria on a small pole next to the logo. It uses the standard construction (crescent r=150/120, star pointing to the fly).
  - The ripple comes from 12 staggered strips; it is still under reduced motion and hidden at ≤480px.
  - A full-width green | white | red band sits on the header's bottom edge, with a slow light sweep. The flag is never mirrored in RTL.
- [x] **H2. Children's Rights hub.** A home section (`ChildRightsTeaser`) and a new page, `/children-rights`, which is also in the nav.
  - The page covers:
    - the four principles of the Convention on the Rights of the Child (arts 2, 3, 6, 12)
    - a keyboard-accessible explorer of 8 rights (child-friendly wording plus "what Insaf does", taken only from Insaf's own posts)
    - the helplines: ONPPE 1111 (24/7), NADA 3033, Protection civile 14, Police 1548
    - Algeria's legal timeline (CRC signed 26 Jan 1990 and ratified 16 Apr 1993; African Charter decree 03-242 of 8 Jul 2003; Law 15-12 of 15 Jul 2015, whose Article 11 creates ONPPE)
    - key dates (1 June, 16 June, 20 November)
    - Insaf's Children's Rights Ambassadors Club
    - the safeguarding promises
    - the sources
  - **UNICEF and OHCHR are cited as text sources only**: no logo, colours or implied partnership, because the client has no UNICEF agreement.
  - Content lives in `src/content/childRights.js`. Every fact was checked on 2026-09-19.
- [x] **H3. Trust & transparency page** (`/trust`, linked from the footer and the donate box). It covers:
  - four donor promises
  - where each fund goes, including processing fees, in-kind rules and an honest note on figures (driven by `FIGURES_ARE_ILLUSTRATIVE`)
  - governance facts and a documents list, both pending in `config/trust.js`
  - safeguarding
  - official channels and a fraud warning
  - a donor FAQ
  - a "when something goes wrong" commitment
- [x] **H4. Fixes.**
  - The ONPPE partner name was wrong: it said "المرصد…" and is now «الهيئة الوطنية لحماية وترقية الطفولة». Réseau NADA was added as a partner.
  - Footer: added the 1111 · 3033 helpline and a Trust link.
  - The desktop header overflowed at 1181–1440px in FR/EN. The nav is now compacted in that range, and Facebook moves to the footer there.
- [x] **H5. Verification.**
  - No horizontal overflow at 320 / 375 / 768 / 1200 / 1366 / 1460px in ar, fr and en.
  - Explorer keyboard navigation works in RTL.
  - The `?right=` deep link works.
  - No app errors in the console.
  - `npm run build` is green.
- **Pending (association):** registration number, board list, statutes, annual reports and safeguarding policy for `config/trust.js`.

## 5. Change log
- 2026-07-23 — Audit complete; plan authored; tracking started.
- 2026-07-23 — Phases A–D complete: chat widget + cards rewritten (real CSS), webhooks split, i18n/copyright/orbit/a11y fixes, Facebook brand SVG (lucide crash fix), focus rings, real social-proof stats. Both n8n workflows built. Prod build green.
- 2026-07-23 (session 2) — Created live Google Sheet, activated + live-tested both workflows (chatbot EN/AR ✓, contact sheet+emails ✓); fixed contact fan-out 4× duplication → linear. Rebranded both 3D pages to site theme + fixed timeline crash. dist rebuilt.
- 2026-09-19 — **Phase G**:
  - Competitive audit of 9 benchmark charities (`docs/COMPETITIVE_ANALYSIS.md`).
  - Donation platform: `LocalDonationBox` with 4 rails and the Chargily V2 bridge (n8n `BKjVi4aLws3dLXyS`, live-tested end to end in test mode), `/donate` route, header Donate button.
  - Pillar components: children hub, green life, campaigns, seasonal banner, Marquee ticker. All CSS Modules; `styles.css` shrank.
  - Fixed the live bug where every Donate CTA opened the 404 page (HashRouter `#anchor` links).
  - Removed unverifiable claims; illustrative figures are now labelled.
- 2026-09-19 — **Phase H**: Algerian flag header (waving pennant + tricolor edge), Children's Rights hub and `/children-rights` page, Trust & Transparency page (`/trust`), ONPPE name fix, and a laptop-width header fix.
