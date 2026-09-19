# Insaf Sétif — Competitive Gap Analysis & Optimization Matrix

_Prepared 2026-09-19 · Phase G (donation platform)_

## 1. Scope and method

**What was read.** 90 crawled pages from 9 benchmark charities, stored locally in `Charitywebsites/`. That folder is gitignored because scraped pages can carry third-party tokens. Each site was read for:
- how it asks for money
- how it proves impact
- how it handles emergencies
- how it earns trust at the moment of payment

| Benchmark | Pages | What it is best at |
|---|---|---|
| charity: water | 10 | Radical transparency (100% Model), monthly community (The Spring) |
| Save the Children | 11 | Child-focused appeals, emergency matching, trust copy at checkout |
| Direct Relief | 10 | Emergency-first landing pages with verifiable numbers |
| GiveDirectly | 10 | Financial transparency (12% overhead, >87% efficiency) |
| Kiva | 10 | Named, specific stories; automatic monthly giving (Monthly Good) |
| Malaria Consortium | 10 | Published annual reports and governance; monthly option |
| The Nature Conservancy | 10 | Science-backed framing for reforestation and water |
| Rainforest Alliance | 10 | Explaining what a trust seal actually means |
| Make-A-Wish | 10 | Community events as a fundraising channel |

**The gap in one sentence.** Before Phase G, Insaf had a warm, trilingual story site but **no working way to give**: every "Donate" button routed to a 404 page because of a HashRouter bug. It had no amount picker, no local payment rails, and no impact framing at the point of decision.

## 2. Executive summary

1. **Make giving possible in Algerian terms.** The benchmarks all assume cards or PayPal. Insaf's donors use **Edahabia, CIB, BaridiMob and CCP**. Phase G adds a four-rail donation box plus a Chargily Pay V2 checkout bridge. The secret key stays server-side in n8n.
2. **Tie every amount to an outcome.** charity:water, Save the Children and GiveDirectly never show a bare number. Insaf's tiers now read "5,000 DA = a complete school kit", "8,000 DA = a child's yearly healthcare" and "3,500 DA = winter warmth". The checkout summary recomputes that impact line live.
3. **Lead with the season.** Direct Relief and Save the Children put the live emergency first. Insaf now shows a seasonal appeal chosen from the calendar (and Hijri calendar):

   | When | Appeal |
   |---|---|
   | Ramadan | Couffin |
   | November–February | Warm Winter |
   | July to 20 August | Wildfire fund |
   | 21 August to mid-October | Back to school |
   | Rest of the year | Orphans |

4. **Earn trust before asking for it.** Features added:
   - a "processed securely" line, like Save the Children
   - payment-method badges
   - a disclosed test mode
   - a privacy note on children's stories
   - an "illustrative figures" flag on the campaign progress bars

   What is still missing is proof: financial reports, like GiveDirectly and Malaria Consortium publish.
5. **Stay honest where the benchmarks are strong because they are big.** Some benchmark patterns are **not copied yet**: matched gifts, audited ratios and named beneficiaries. Insaf does not have the matching donor, the audit or the consent framework they depend on (see §4).

## 3. Optimization matrix

Legend: ✅ shipped in Phase G · 🟡 partially / needs association data · ⛔ not yet (roadmap)

| # | Pattern | Evidence in the crawl | Insaf before | Insaf after Phase G | Status / next step |
|---|---|---|---|---|---|
| 1 | **Persistent Donate CTA** in the header | Save the Children "Donate Now" at the top of the homepage; charity:water "GIVE TODAY" at the top | None; hero CTA pointed at a 404 | Red pill in the header on every page (icon-only on phones), routes to `/donate` | ✅ |
| 2 | **Amount picker with impact equivalents** | Save the Children homepage: presets $15–$500 with "$35 per month can buy cooking essentials … for one displaced family"; charity:water "Give once" presets plus other ways to give (check, stock, crypto) | None | Presets 1,000 / 3,500 / 5,000 / 8,000 / 15,000 DA, a custom amount, and a live "covers: 1 × school kit" line | ✅ |
| 3 | **Giving tiers tied to a child's need** | Save the Children child-sponsorship framing | Static text | `ChildrenHelpHub`: school kit 5,000 · healthcare 8,000 · winter 3,500 DA, each a deep link into checkout with the amount preselected | ✅ |
| 4 | **Local payment rails** | (No benchmark; Algeria-specific) | Personal IBAN only | Edahabia/CIB via Chargily; BaridiMob (QR + RIP); CCP (account + key); international wire, all with copy-to-clipboard | 🟡 RIP / CCP / QR show "coming soon" until the association supplies its real numbers |
| 5 | **Secure checkout, secret server-side** | Save the Children: "Your donation is processed securely" | n/a | React → n8n webhook → Chargily V2 → redirect. Input allowlisting, honeypot, fixed return URLs (no open redirect), `checkout_url` host validation in the browser | ✅ (test mode) |
| 6 | **Emergency-first landing** | Direct Relief `emergency/colombia-earthquake-2026` shows the event, what it does and what it will report | None | `UrgencyBanner` (seasonal, dismissible per appeal and year) and a wildfire section honouring Protection Civile volunteers | ✅ |
| 7 | **Report only verified numbers** | Direct Relief: "will report additional grants, shipments, recipients and results as they are confirmed" | Invented figures (150+ families, 15 partners) | Removed unverifiable claims; partner count computed from data (7); campaign bars flagged "illustrative" | 🟡 Needs real campaign totals, then set `FIGURES_ARE_ILLUSTRATIVE = false` |
| 8 | **Goal-gradient progress** | Campaign thermometers across benchmarks | None | `CampaignSection`: compositor-only bars, a single IntersectionObserver that disconnects after first view, "almost there" at ≥80% | ✅ (figures 🟡) |
| 9 | **Monthly / recurring giving** | charity:water *The Spring*; Kiva *Monthly Good*; Save the Children's Donate Now defaults to monthly; Malaria Consortium monthly option | None | Not possible yet: Chargily V2 has no subscriptions | ⛔ Roadmap: a "monthly pledge" list in n8n plus a reminder email with a one-click checkout link |
| 10 | **Financial transparency page** | charity:water *100% Model*; GiveDirectly: "12% of our budget goes to overhead", ">87%" reaches recipients; Malaria Consortium annual reports | None | None | ⛔ Highest-value next step: a "Where your dinar goes" page and the yearly report |
| 11 | **Specific, human stories** | Kiva borrower profiles; Save the Children refugee stories | Stories presented as real without consent evidence | Carousel reframed as anonymous **composite** stories with a privacy disclosure; real event photo (International Children's Day 2026) | ✅ Child-safe by design |
| 12 | **Live activity signal** | Direct Relief news; Save the Children press releases | CSS keyframe ticker | `react-fast-marquee` ticker of real news posts: RTL-correct, pause on hover, off under reduced motion, accessible link to /news | ✅ |
| 13 | **Payment feedback loop** | Standard thank-you and failure pages | n/a | Success and failure panels on return; URL cleaned so a refresh doesn't repeat the message; bfcache-safe button state | ✅ (a server-side receipt is on the roadmap) |
| 14 | **Explain the trust seal** | Rainforest Alliance: "What does Rainforest Alliance Certified mean?" | n/a | Test-mode badge and a trust footer that explain the payment method in plain words | ✅ For live mode, add the association's registration number (agrément) |
| 15 | **Environmental credibility** | Nature Conservancy reforestation / natural-climate-solutions stories | None | `NaturePillar`: reforestation, rural water, eco-education, wildfire fund; SVG regrowth scene instead of mislabeled stock photos | 🟡 Insaf has no documented green projects yet. Confirm with the association, or partner with one that has them, before promoting heavily |
| 16 | **Community events** | Make-A-Wish galas and golf days | Facebook posts only | Not built | ⛔ Roadmap: Ramadan iftar and back-to-school events with a registration form (reuse the contact → Sheet workflow) |
| 17 | **Cultural grounding** | (Differentiator, not a benchmark) | Generic | Algerian flag hairlines, zellige 8-point-star pattern, Cairo typeface, strict RTL with direction-aware icons and keyboard nav, Hijri-aware appeals | ✅ |

## 4. Patterns deliberately not copied (yet)

| Pattern | Why not now |
|---|---|
| "Gift matched 2×" (Save the Children emergency appeal) | Only honest with a real matching donor. Add it when Insaf has one. |
| Headline efficiency ratios (12% overhead, 100% Model) | Need audited accounts. Publishing an unverified ratio would damage trust more than having none. |
| Named child beneficiaries with photos | Kiva's borrowers are consenting adults. Insaf's beneficiaries are children, many of them orphans. Composites plus event photos protect them. |
| Tax-deduction language | Algerian deductibility rules differ from the US ones the benchmarks cite. Say nothing until confirmed with the association's accountant. |
| Countdown timers / fake scarcity | A dark pattern. The seasonal appeal uses the real calendar instead. |

## 5. The four pillars → components

| Pillar | Component(s) | Key content |
|---|---|---|
| Children's rights & orphans | `ChildrenHelpHub`, `UrgencyBanner` (school/orphans) | 3 giving tiers, accessible story carousel, privacy disclosure |
| Environment / Green life | `NaturePillar`, `UrgencyBanner` (wildfire) | Wildfire solidarity fund honouring the frontline; reforestation, water, education |
| Poverty & social emergency | `CampaignSection`, `UrgencyBanner` (winter/ramadan), `LocalDonationBox` designations | Warm Winter, Ramadan couffin, food packages |
| Algerian grounding | All new modules + `HeaderDonateButton` | Flag accents, zellige pattern, ar/fr/en with strict RTL, DA formatting (`5 000 DA` / `5 000 دج`) |

## 6. Integrity rules adopted in code

- **No invented account numbers.** `LOCAL_RAILS` in `src/config/donation.js` is intentionally empty, and the UI shows "coming soon" until real values arrive.
- **Illustrative figures are labelled.** One flag, `FIGURES_ARE_ILLUSTRATIVE` in `src/config/campaigns.js`, controls the disclosure.
- **Test mode is disclosed to donors.** `CHARGILY_TEST_MODE` drives the badge.
- **The payment secret never reaches the browser or the public repo.** It lives in the n8n node; the exported workflow JSON is gitignored.

## 7. Roadmap (after Phase G)

| Priority | Item | Owner |
|---|---|---|
| P0 | Supply the real BaridiMob RIP + QR and the CCP account + key; replace the personal IBAN with the association's account | Association |
| P0 | Rename the Chargily app to "Insaf Sétif"; switch to live keys (see IMPLEMENTATION_PLAN Phase G go-live) | Owner |
| P1 | Chargily **webhook → n8n**: verify the signature, log each paid donation to a Sheet, send a thank-you receipt email | Dev |
| P1 | Real campaign totals, fed from that Sheet, then turn off the illustrative flag | Dev + association |
| P1 | "Where your dinar goes" transparency page + yearly report PDF | Association + dev |
| P2 | Monthly pledge + reminder flow (closest honest substitute for subscriptions) | Dev |
| P2 | Events + registration (Ramadan iftar, back-to-school day) | Association + dev |
| P3 | Code-split the 580 KB bundle (news data + 3D iframes) | Dev |
