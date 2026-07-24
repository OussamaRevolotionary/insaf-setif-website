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

## 5. Change log
- 2026-07-23 — Audit complete; plan authored; tracking started.
- 2026-07-23 — Phases A–D complete: chat widget + cards rewritten (real CSS), webhooks split, i18n/copyright/orbit/a11y fixes, Facebook brand SVG (lucide crash fix), focus rings, real social-proof stats. Both n8n workflows built. Prod build green.
- 2026-07-23 (session 2) — Created live Google Sheet, activated + live-tested both workflows (chatbot EN/AR ✓, contact sheet+emails ✓); fixed contact fan-out 4× duplication → linear. Rebranded both 3D pages to site theme + fixed timeline crash. dist rebuilt.
