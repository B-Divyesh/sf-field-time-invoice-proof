# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-28  
**Candidate:** `702ae502641fac834497ee210566c15fabba48c0`  
**Live URL:** `https://field-time-invoice-proof.sociobot.in`  
**Viewports:** fresh Chromium contexts at 390 × 844 and 1440 × 1000  
**Verdict:** **FAIL** — five blocking findings remain. Earlier findings F-1-2, F-1-8, F-1-9, F-1-10, and F-1-16 were only partly fixed. There are also five new major or minor findings.

## Cold first read

Before scrolling, at both widths, I could answer all three required questions:

- **What does it do?** It records freelance work sessions and turns them into a self-reported weekly client receipt.
- **For whom?** Independent workers who bill for time that activity tracking does not explain well.
- **What should I click first?** **“Try it with sample data.”** The adjacent text says **“Opens a sample weekly receipt.”**

The exact first-screen text that supplied those answers was **“Turn freelance time into a client receipt,”** **“For independent workers who need to explain billable time without activity tracking,”** and **“Try it with sample data.”** At 390 px, the action and all three plain facts were visible before scrolling. The page measured `scrollWidth=390` and `clientWidth=390`. No cold-load console or page error occurred, and no cross-origin request was made.

The first screen therefore passes. The product as a whole does not.

## Findings

### Blocking

#### F-1-2 — The claims registry is still incomplete, and two green tests do not prove their registered claims

**History:** Review 1 required every visitor-reliance claim to be listed and tested. The repository now has 10 entries and each registered command passes, but the repair is incomplete.

**Unlisted claim locations and exact quotes:**

- Landing timer: **“No activity capture.”**
- Landing timer: **“Work sessions and evidence links stay in this browser.”** The current privacy test enters no evidence link and therefore does not prove the evidence part.
- Landing limits: **“It does not watch activity, capture screens, or verify that work happened.”**
- README: **“Record timed or manual work sessions.”** No registered claim covers both recording paths.
- README: **“Add outcomes, breaks, optional evidence links, and an AI-assisted label.”**
- README: **“Receipt name, client, and closing-note settings.”**
- README: **“Each visitor-facing claim is listed in `.factory/claims.json`.”** This completeness statement is false while the other claims in this list remain unregistered.
- README and `/privacy/`: **“Evidence links are stored as text and open only when selected.”** / **“It does not fetch evidence links.”**
- `/privacy/`: **“Clearing site data removes them.”**
- `/privacy/`: **“PDF, JSON, and CSV files are created on your device.”**

**Insufficient registered tests:**

- `@claim:local-privacy` records request URLs and rejects only a different origin. It would still pass a same-origin analytics request or a same-origin POST containing work-session data. It does not inspect methods, bodies, or an evidence URL that must remain unfetched.
- `@claim:pdf-receipt` checks promised text in the on-screen preview, then checks only that the download starts with `%PDF-` and exceeds 5,000 bytes. It would pass a non-empty PDF that omitted every promised detail. The current live PDF does contain the sample outcomes, durations, excluded breaks, and evidence links, but the registered test does not prove that.

**Why this fails:** A visitor is asked to rely on the absence of surveillance, local evidence handling, two recording paths, receipt settings, and downloaded PDF contents. These are not all represented by an observable claim test. A green registry therefore overstates the verified surface.

**Concrete fix:** Add claim entries and one tagged observable test for manual/timed recording, session details and the AI-use marker, receipt settings, non-fetching evidence links, and clearing site data. Strengthen `local-privacy` to assert an allowlist of request URLs and methods, empty request bodies, and no evidence request before selection. Parse the downloaded PDF, or inspect its uncompressed text, and assert the outcome, billable duration, excluded break, and evidence label in the file itself. Remove any sentence that cannot be tested.

#### F-1-8 — Route metadata remains incomplete

**History:** Review 1 required canonical, Open Graph/Twitter, favicon, Apple icon, discovery files, and a designed 404. The main route is complete, but the route-wide repair is not.

**Live evidence:**

- `/privacy/` and `/terms/` have Open Graph images but no `twitter:image`.
- The designed 404 has no canonical, `og:image`, Twitter title/description/image, or Apple touch icon.
- `/offline.html` has no meta description, canonical, Open Graph data, Twitter data, favicon, or Apple touch icon.
- Both linked `/sample-evidence/*.html` pages lack canonical, Open Graph/Twitter data, and Apple touch icons.

**Why this fails:** Metadata behavior depends on which real product route a visitor shares or reaches. The current implementation does not meet the per-route contract, despite the earlier handoff stating that canonical and social metadata were complete.

**Concrete fix:** Give every shipped HTML route its own plain title and description, canonical URL, Open Graph and Twitter title/description/1200×630 image, SVG favicon, and Apple touch icon. Add a browser test that iterates every HTML route, including the 404, offline page, and linked sample evidence.

#### F-1-9 — Route focus and the shared shell are only partly implemented

**History:** Review 1 required one consistent header/footer and route-change focus/announcement behavior.

**Live and code evidence:** `/offline.html` has no header, navigation, skip link, or footer. In a live home → Demo → browser Back flow, closing the auto-opened demo receipt correctly returned focus to the demo `<h1>`, but Back returned to `/` with focus on `<body>`, not the home `<h1>`. Source sets `#route-announcer` and focuses `#page-title` only inside the `isDemoMode` branch. The home, legal, 404, sample-evidence, and offline routes do not implement equivalent route focus.

**Why this fails:** Keyboard and screen-reader users do not receive a consistent new-page starting point. The offline recovery page also stops looking and navigating like the same product.

**Concrete fix:** Use the shared header, skip link, and footer on `/offline.html`. On every route load and back/forward restoration, focus the route `<h1>` with `tabindex="-1"` and announce the route title. Add a browser test for home → Demo → Back and home → Privacy → Back that asserts URL, focus, and announcement.

#### F-1-10 — The shipped offline page violates the live CSP and logs a console error

**History:** Review 1 required a CSP that matches the page and specifically prohibited inline-style violations. The handoff marked this fixed.

**Live location / exact error:** Opening `https://field-time-invoice-proof.sociobot.in/offline.html` returns 200, but its only styling is an inline `<style>` block while the response sends `style-src 'self'`. Chromium logs: **“Applying inline style violates the following Content Security Policy directive 'style-src 'self'' … The action has been blocked.”** The computed body background becomes transparent rather than the specified notebook paper color.

**Why this fails:** A recovery page for an offline PWA is shipped in a visibly broken state and violates the product’s no-console-errors gate.

**Concrete fix:** Move the offline styles into a self-hosted stylesheet covered by `style-src 'self'`, preferably the shared legal/product shell. Add `/offline.html` to the CSP console-error test.

#### F-1-16 — User-facing README copy still uses implementation jargon

**History:** Review 1 specifically flagged “PWA” and related implementation language and required technical terms to remain in developer sections. The handoff marked this fixed.

**Location / exact quote:** README, user-facing **“What it includes”** list: **“An installable app manifest and offline service worker.”**

**Why this fails:** “Manifest” and “service worker” describe implementation, not the result a worker gets. This is not in the developer run/build section.

**Concrete fix:** Replace it with **“Install the app and open saved work sessions offline after one visit.”** Keep manifest and service-worker details only under a developer heading.

### Major

#### F-2-1 — Mobile navigation and demo-exit targets are smaller than 44 px

**Live location / measurements at 390 px:** Root header **Demo** is `42×22`; **Privacy** is `51×22`; footer **Demo**, **Privacy**, and **Terms** are 20 px high. Legal-route header links are 28 px high and footer links are 21 px high. The demo banner’s **Start for real** target is 20 px high; the copy inside the receipt dialog is 19 px high. The home wordmark is 32 px high and legal wordmarks are 36 px high.

**Why this fails:** These are compact navigation targets on the phone layout, not inline prose links. They miss the supplied 44 px touch-target baseline and are easy to miss or activate incorrectly.

**Concrete fix:** Give header, footer, recovery, and demo-banner links an inline-flex hit area with at least `44px` height and width where practical. Preserve the visual text size. Add a 390 px test that checks every visible non-prose interactive target’s bounding box.

### Minor

#### F-2-2 — The landing offline fact drops the tested prerequisite

**Location / exact quote:** Landing first screen: **“Saved work sessions open offline.”** The registered claim is **“Saved work sessions open offline after the first visit.”**

**Why this fails:** A new visitor may read the shorter sentence as unconditional, although the service worker must first install online.

**Concrete fix:** Use **“After your first visit, saved work sessions open offline.”**

#### F-2-3 — “Restore” and “import” name the same action

**Locations / exact quotes:** Landing heading **“Back up or restore your work sessions”**; nearby sentence and button use **“Import a JSON backup”** and **“Import backup.”** README alternates **“JSON backup and restore”** with **“backup, import.”**

**Why this fails:** A visitor must decide whether restore and import are different operations.

**Concrete fix:** Use **import** everywhere: **“Back up or import your work sessions”** and **“JSON backup and import.”**

#### F-2-4 — “Break” and “interruption” name one deduction field

**Locations / exact quotes:** The landing PDF sentence says **“interruptions”**; “How it works” says **“break”**; the form label says **“Break / interruption”**; rendered sessions say **“Break:”**; the README says **“breaks.”** There is one numeric field and one deducted duration.

**Why this fails:** The copy implies two concepts while the product stores one value.

**Concrete fix:** Use **break** throughout: **“Create a weekly PDF that lists outcomes, time, breaks, and selected evidence.”** Label the field **“Break time”** and describe PDF output as **“break excluded.”** Update the claim wording and test together.

#### F-2-5 — Recovery-page h1s use the notebook metaphor instead of naming the state

**Locations / exact quotes:** 404 `<h1>`: **“This page is not in the notebook.”** Offline `<h1>`: **“The notebook is still here.”**

**Why this fails:** Neither heading names “page not found” or “offline” when read out of context. The small decorative labels should not have to repair the h1.

**Concrete fix:** Use **“Page not found”** and **“You are offline.”** Keep notebook styling in the visual treatment rather than the heading.

## Copy audit

Counts treat a hyphenated term, URL, or file path as one word. The landing inventory covers the cold empty state, headings, actions, status copy, and footer; field labels are not sentences. No item exceeds 22 words. No banned marketing word appears. Flags below map to findings above.

### Landing page

| Words | Exact copy | Result |
| ---: | --- | --- |
| 4 | Skip to work sessions | Clear skip action. |
| 2 | Work Receipt | Product name. |
| 1 | Demo | Clear navigation label. |
| 1 | Privacy | Clear navigation label. |
| 3 | Saved on device | Registered storage/privacy claim. |
| 5 | Work sessions for independent workers | Clear audience label. |
| 7 | Turn freelance time into a client receipt | Clear job-led h1. |
| 12 | For independent workers who need to explain billable time without activity tracking. | Clear audience and situation. |
| 5 | Try it with sample data | Result-oriented first action. |
| 5 | Opens a sample weekly receipt. | Clear next result. |
| 5 | Records stay in this browser. | Covered by local storage/privacy claims. |
| 5 | Saved work sessions open offline. | Missing first-visit prerequisite; F-2-2. |
| 5 | Recording and exports are free. | Covered by `free-core`. |
| 8 | A weekly receipt is self-reported, not independent proof. | Covered by `self-reported`. |
| 3 | Work session timer | Clear section label. |
| 4 | Start a work session | Clear heading. |
| 3 | Start work session | Result-naming action. |
| 3 | No activity capture. | Unlisted claim; F-1-2. |
| 9 | Work sessions and evidence links stay in this browser. | Evidence part is unproved; F-1-2. |
| 2 | Work sessions | Clear section label. |
| 3 | Recent work sessions | Clear heading. |
| 4 | Add a work session | Result-naming action. |
| 3 | Filter work sessions | Clear control label. |
| 2 | All projects | Clear option. |
| 5 | Add your first work session | Useful empty-state heading. |
| 9 | Start the timer or add a completed work session. | Useful empty-state instruction. |
| 4 | Add a work session | Result-naming action. |
| 5 | Create a weekly client receipt | Clear section heading. |
| 12 | Create a weekly PDF that lists outcomes, time, interruptions, and selected evidence. | “Interruptions” conflicts with “break”; F-2-4. |
| 3 | Prepare weekly receipt | Result-naming action. |
| 7 | Back up or restore your work sessions | “Restore” conflicts with “import”; F-2-3. |
| 7 | Download a JSON backup or CSV file. | Clear export result. |
| 7 | Import a JSON backup on another device. | Clear import result. |
| 3 | Export backup (.json) | Result-naming action. |
| 4 | Export work sessions (.csv) | Result-naming action. |
| 2 | Import backup | Result-naming action. |
| 3 | How it works | Recognizable section heading. |
| 4 | Record a work session. | Clear step. |
| 9 | Add the outcome, time, break, and optional evidence link. | “Break” conflicts with “interruptions”; F-2-4. |
| 3 | Review the week. | Clear step. |
| 8 | Check each self-reported work session before sharing it. | Clear instruction. |
| 3 | Download the receipt. | Clear step. |
| 11 | Save a PDF for your client and a backup for yourself. | Clear result. |
| 6 | What Work Receipt does not do | Clear limitation heading. |
| 12 | It does not watch activity, capture screens, or verify that work happened. | Unlisted claim; F-1-2. |
| 7 | A weekly receipt records what you enter. | Clear limitation. |
| 10 | Work Receipt · self-reported work sessions stored in this browser. | Clear footer summary. |
| 4 | Built by Param Factory | Clear provenance. |
| 7 | Original generated still-life artwork · Build 1.1.0 | Clear asset/build provenance. |

### README

| Words | Exact copy | Result |
| ---: | --- | --- |
| 2 | Work Receipt | Product name. |
| 10 | Turn freelance work sessions into a private weekly client receipt. | Clear job statement. |
| 10 | For independent hourly workers who need to explain billable time. | Clear audience. |
| 14 | Use it when review, waiting, and judgment do not show in an activity tracker. | Clear situation. |
| 6 | Record timed or manual work sessions. | Unlisted capability claim; F-1-2. |
| 10 | Add outcomes, breaks, optional evidence links, and an AI-assisted label. | Unlisted grouped capability claim; F-1-2. |
| 10 | Create a weekly PDF that stays clear about being self-reported. | Covered by PDF/self-reported claims. |
| 9 | Your records stay in this browser on this device. | Covered by storage/privacy claims. |
| 10 | The app sends no work-session data, analytics, or tracking requests. | Registered, but its test is too permissive; F-1-2. |
| 9 | Saved work sessions open offline after the first visit. | Covered by `offline-reload`. |
| 3 | Try the sample | Clear heading. |
| 6 | Open http://localhost:4173/demo after starting the app. | Clear local instruction. |
| 6 | The live demo is at field-time-invoice-proof.sociobot.in/demo. | Clear live instruction. |
| 12 | The demo starts with three work sessions and an open weekly receipt. | Covered by demo test. |
| 8 | Its database is separate from your real records. | Covered by demo isolation. |
| 14 | Use Reset demo to restore the sample or Start for real to discard it. | Clear demo instruction. |
| 3 | What it includes | Clear heading. |
| 8 | A timer and manual entry for work sessions. | Timed/manual paths need a listed claim; F-1-2. |
| 7 | A self-reported weekly receipt and PDF download. | Covered by registered claims. |
| 4 | JSON backup and restore. | “Restore” conflicts with “import”; F-2-3. |
| 8 | CSV export with one row per work session. | Covered by `csv-export`. |
| 6 | Receipt name, client, and closing-note settings. | Unlisted capability claim; F-1-2. |
| 8 | An installable app manifest and offline service worker. | User-facing jargon; F-1-16. |
| 11 | Recording, receipt details, PDFs, backup, import, and CSV export are free. | Covered by `free-core`. |
| 9 | There is no paid tier or embedded payment provider. | Covered by `free-core`. |
| 2 | Run locally | Clear developer heading. |
| 5 | Requires Node.js 20 or newer. | Clear prerequisite. |
| 2 | Open http://localhost:4173. | Clear instruction. |
| 3 | Test and build | Clear developer heading. |
| 7 | Each visitor-facing claim is listed in .factory/claims.json. | False while F-1-2 remains. |
| 6 | Each has one tagged browser test. | True only for the 10 listed entries. |
| 7 | The production build is written to dist/. | Clear developer fact. |
| 3 | Privacy and limits | Clear heading. |
| 12 | Work Receipt does not watch activity, capture screens, or verify completed work. | Unlisted claim; F-1-2. |
| 11 | Evidence links are stored as text and open only when selected. | Unlisted claim; F-1-2. |
| 11 | Export a JSON backup before clearing browser data or moving devices. | Useful instruction. |
| 8 | See the built app’s /privacy/ and /terms/ pages. | Clear instruction. |
| 1 | Deploy | Clear developer heading. |
| 14 | Run npm run build, then deploy the contents of dist/ as a static site. | Clear developer instruction. |
| 14 | staticwebapp.config.json supplies routes, security headers, MIME types, immutable asset caching, and the 404 response. | Appropriate in the deploy section. |
| 5 | The project is MIT licensed. | Clear licensing fact. |
| 8 | Image provenance is documented in .factory/design.md and assets/src/hero-notebook.json. | Clear provenance pointer. |

All landing actions name an action or result. Standard navigation nouns, **Close**, and **Cancel** are conventional. The required demo controls **Reset demo** and **Start for real** are clear in context.

## Demo and sandbox verification

**Result: PASS.** From a fresh 390 px context, I created a real record, used the one-click landing action, and reached `/demo`. The first screen after navigation already showed an open receipt and three current-week sessions:

- Northwind website — mapped checkout errors and agreed on a revised purchase flow.
- Northwind website — rewrote checkout guidance and prepared two review options, marked AI-assisted.
- Harbor research — delivered an interview summary and next-round plan.

The persistent banner and dialog copy both said **“Demo — sample data, nothing is saved”** and exposed **Reset demo** and **Start for real**. The real outcome did not appear in demo. Adding a fourth demo session and selecting Reset returned the count from 4 to 3 and removed the mutation. Start for real deleted `demo:work-receipt`, returned to `/`, and showed the untouched real record in `work-receipt`.

The live demo flow made only same-origin GET requests. After service-worker control, a live offline reload preserved the three sample sessions, demo banner, and **“Offline · saving on this device”** state. This confirms the actual sandbox behavior; F-1-2 concerns the completeness and strength of the permanent registered tests.

## Claims test results

I cloned commit `702ae50` with `git clone --no-local`, ran `npm ci`, and executed every command from `.factory/claims.json` separately. Each tag occurs exactly once.

| Claim id | Exact command suffix | Result |
| --- | --- | --- |
| `demo-isolation` | `--grep @claim:demo-isolation` | PASS — 1 passed |
| `local-privacy` | `--grep @claim:local-privacy` | PASS — 1 passed; proof gap in F-1-2 |
| `session-persistence` | `--grep @claim:session-persistence` | PASS — 1 passed |
| `offline-reload` | `--grep @claim:offline-reload` | PASS — 1 passed |
| `json-roundtrip` | `--grep @claim:json-roundtrip` | PASS — 1 passed |
| `csv-export` | `--grep @claim:csv-export` | PASS — 1 passed |
| `pdf-receipt` | `--grep @claim:pdf-receipt` | PASS — 1 passed; proof gap in F-1-2 |
| `installable-pwa` | `--grep @claim:installable-pwa` | PASS — 1 passed |
| `free-core` | `--grep @claim:free-core` | PASS — 1 passed |
| `self-reported` | `--grep @claim:self-reported` | PASS — 1 passed |

No listed command failed. The review still fails because visitor-facing claims remain unlisted and two registered assertions are weaker than their claim text.

## Earlier finding verification

Every earlier review/polish/handoff/verification item was checked against both live behavior and current source.

| Earlier item | Result | Current evidence |
| --- | --- | --- |
| F-1-1 demo | FIXED | One-click populated demo, persistent banner, reset, start-real, namespace isolation all passed live. |
| F-1-2 claim registry | **REOPENED / BLOCKING** | Ten tests exist and pass, but claims remain unlisted and two tests do not prove their full text. |
| F-1-3 dead checkout | FIXED | No checkout/license UI or runtime request exists; free controls work. |
| F-1-4 missing brief | FIXED | `.factory/brief.json` exists and matches the shipped job/scope. |
| F-1-5 first-screen headline | FIXED | Job, audience, first action, and next result are visible at both widths. |
| F-1-6 mobile overflow | FIXED | Home and demo measure 390/390. |
| F-1-7 immutable caching | FIXED | Live hashed JS/CSS send `public, max-age=31536000, immutable`. |
| F-1-8 metadata/routes | **REOPENED / BLOCKING** | Main metadata and 404 status work, but route metadata is incomplete as listed above. |
| F-1-9 shared shell/focus | **REOPENED / BLOCKING** | Offline page has no shell; browser Back returns focus to body. |
| F-1-10 security policy | **REOPENED / BLOCKING** | Main headers pass; `/offline.html` produces a live CSP console error. |
| F-1-11 nested landmark | FIXED | Axe reports zero violations on home, demo, legal, 404, and offline routes. |
| F-1-12 landing metaphor headings | FIXED | Landing headings are literal; new recovery-page heading issue is F-2-5. |
| F-1-13 saved-object terminology | FIXED | “Work session” and “weekly receipt” are used for their distinct objects. Action/deduction drift remains in F-2-3/F-2-4. |
| F-1-14 vague buttons | FIXED | Current product actions name their action/result. |
| F-1-15 long README sentence | FIXED | No README sentence exceeds 22 words. |
| F-1-16 user-facing jargon | **REOPENED / BLOCKING** | “Manifest” and “service worker” remain in the user-facing feature list. |
| F-1-17 mood adjectives | FIXED | “Calm” and “humane” are absent. |
| Verification defect 1: overflow | FIXED | 390 px live width passes. |
| Verification defect 2: cache headers | FIXED | Hashed assets are immutable. |
| Verification hardening: landmark | FIXED | Full-impact axe scans are empty. |

## Structure, accessibility, links, and visual identity

- Root, Demo, Privacy, and Terms titles follow the required patterns; each has one h1, `lang="en"`, a main landmark, and no missing image alt.
- `/not-a-real-page` returns HTTP 404 with a designed recovery page and home link.
- Root, Demo, Privacy, Terms, sample evidence, and all their actual links returned 200. No dead product link was found.
- The home → Demo route announces **“Demo — Work Receipt”**. Back-button focus failure is F-1-9.
- Live root verification reported no console errors, one h1, one main, valid lang, no missing alt, and no unlabeled buttons.
- Full-impact Playwright axe scans returned zero violations on home, Demo, Privacy, Terms, 404, and offline pages. The manual touch-target failure is F-2-1.
- Main entry assets are 126.12 KB JS raw / 41.78 KB gzip and 18.95 KB CSS raw / 5.03 KB gzip. PDF code remains lazy-loaded.
- Live JS and CSS SHA-256 values match the clean build: `29b2dd…bc0050` and `d8e811…23fa32`.
- The visual identity is distinct: warm ruled paper, ink/teal/stamp colors, editorial notebook art, receipt typography, and workbench layout do not resemble a generic centered SaaS hero with feature cards.

## Full quality gates

From the same clean clone:

- `npm test`: PASS — 7/7.
- `npm run build`: PASS — `dist/` produced.
- `npm run test:e2e`: PASS — 32 passed, 2 intentional duplicate-project skips.
- Every registered claim command: PASS — 10/10 run separately.
- Live root verifier: PASS.
- Live offline-page console: **FAIL** — CSP error in F-1-10.

## Missed leverage

No additional AI, import/export, or sync feature is justified. The brief explicitly excludes runtime generation because generated work claims would reduce trust. The existing AI-assisted marker is explained as a disclosure, makes no model call, embeds no provider key, and is not decorative. JSON backup/import and CSV export already cover portability. Cloud sync is explicitly excluded to preserve the local-only boundary.

## What would make this perfect

There is work left. A perfect next candidate would:

1. List and observably test every remaining capability/privacy claim, and strengthen the privacy and PDF file assertions.
2. Complete metadata for every shipped HTML route.
3. Give the offline page the shared shell, self-hosted styles, and zero CSP errors.
4. Restore h1 focus and route announcement on back/forward navigation.
5. Replace the README implementation jargon.
6. Make every mobile navigation/demo-exit target at least 44 px.
7. Add the first-visit qualifier to the landing offline fact.
8. Standardize import/restore and break/interruption terminology.
9. Rename the 404 and offline h1s to state the actual condition.

Until all nine are complete and reverified from scratch, the correct verdict is **FAIL**.
