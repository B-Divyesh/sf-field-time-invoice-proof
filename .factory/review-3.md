# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-28  
**Candidate:** `483f20e9ddf51c691b2275b9b207c1e287927648`  
**Live URL:** `https://field-time-invoice-proof.sociobot.in`  
**Viewports:** fresh Chromium contexts at 390 × 844 and 1440 × 900  
**Verdict:** **FAIL** — one blocking history finding remains half-fixed. The two sample-evidence routes do not use the same home-linked header and navigation as the rest of the product.

## Cold first read

Before scrolling, I could answer all three required questions at both widths:

- **What does it do?** It records freelance time and turns it into a client receipt.
- **For whom?** Independent workers who need to explain billable time without activity tracking.
- **What should I click first?** **“Try it with sample data.”** The adjacent text says **“Opens a sample weekly receipt.”**

The exact first-screen text was **“Turn freelance time into a client receipt,”** **“For independent workers who need to explain billable time without activity tracking,”** and **“Try it with sample data.”** On the phone, the action and all three facts were visible before scrolling. The page measured `390/390` CSS pixels, made no cross-origin request, and logged no console error.

The first screen passes. The product as a whole does not.

## Findings

### Blocking

#### F-1-9 — The shared header is still inconsistent on both sample-evidence routes

**History:** Review 1 required one consistent header on every route: a wordmark linked to home, with Demo and Privacy navigation. Polish round 2 marked this fixed for “Offline and all static pages.”

**Live and code evidence:** On `/sample-evidence/checkout-review.html` and `/sample-evidence/research-summary.html`, the header wordmark is **“Work Receipt demo”** and links to `/demo`. Its only navigation item is **“Return to demo.”** Every other checked route uses **“Work Receipt”** linked to `/`, followed by **Demo** and **Privacy**. The divergent markup is present in both files under `public/sample-evidence/`.

**Why this fails:** A visitor who opens an evidence link directly does not get the product’s normal home or Privacy navigation. The wordmark changes destination without warning. This is a half-fix of an earlier finding, so the history rule makes it blocking again.

**Concrete fix:** Reuse the standard header on both evidence pages: **Work Receipt** → `/`, **Demo** → `/demo`, and **Privacy** → `/privacy/`. Keep **“Return to demo”** as a separate contextual link in the page body. Extend the route-shell test to assert the exact wordmark destination and header navigation on every shipped HTML route.

No other blocking, major, or minor finding was found.

## Copy audit

Counts treat hyphenated terms, URLs, paths, and file names as one word. The landing inventory covers the cold empty state, headings, controls, labels, status text, and footer. The README inventory excludes shell commands because they are code, not sentences. No item exceeds 22 words, uses a banned marketing word, changes established terminology, or needs a rewrite.

### Landing page

| Words | Exact rendered copy | Result |
| ---: | --- | --- |
| 4 | Skip to work sessions | Clear skip action. |
| 2 | Work Receipt | Product name. |
| 1 | Demo | Clear navigation label. |
| 1 | Privacy | Clear navigation label. |
| 3 | Saved on device | Covered by local storage claims. |
| 5 | Work sessions for independent workers | Names the audience. |
| 7 | Turn freelance time into a client receipt | Job-led h1. |
| 12 | For independent workers who need to explain billable time without activity tracking. | Names the user and situation. |
| 5 | Try it with sample data | Result-naming first action. |
| 5 | Opens a sample weekly receipt. | States the next result. |
| 5 | Records stay in this browser. | Covered by `local-privacy` and `session-persistence`. |
| 9 | After your first visit, saved work sessions open offline. | Includes the tested prerequisite; `offline-reload`. |
| 5 | Recording and exports are free. | Covered by `free-core`. |
| 8 | A weekly receipt is self-reported, not independent proof. | Covered by `self-reported`. |
| 3 | Work session timer | Literal section label. |
| 4 | Start a work session | Literal task heading. |
| 1 | Project | Clear field label. |
| 2 | Working toward | Clear field label. |
| 2 | Evidence link | Established term. |
| 1 | optional | Clear field qualifier. |
| 1 | AI-assisted | Clear disclosure control. |
| 3 | Start work session | Result-naming action. |
| 5 | You choose what to record. | States manual control. |
| 9 | Work sessions and evidence links stay in this browser. | Covered by `local-privacy` and `evidence-control`. |
| 2 | Work sessions | Literal section label. |
| 3 | Recent work sessions | Literal heading. |
| 4 | Add a work session | Result-naming action. |
| 3 | Filter work sessions | Clear control label. |
| 2 | All projects | Clear option. |
| 5 | Add your first work session | Useful empty-state heading. |
| 9 | Start the timer or add a completed work session. | Useful empty-state instruction. |
| 4 | Add a work session | Result-naming empty-state action. |
| 5 | Create a weekly client receipt | Literal section heading. |
| 12 | Create a weekly PDF that lists outcomes, time, breaks, and selected evidence. | Covered by `pdf-receipt`. |
| 3 | Prepare weekly receipt | Result-naming action. |
| 7 | Back up or import your work sessions | Literal section heading. |
| 7 | Download a JSON backup or CSV file. | Covered by `json-roundtrip` and `csv-export`. |
| 7 | Import a JSON backup on another device. | Covered by `json-roundtrip`. |
| 3 | Export backup (.json) | Result-naming action. |
| 4 | Export work sessions (.csv) | Result-naming action. |
| 2 | Import backup | Result-naming action. |
| 3 | How it works | Recognizable section heading. |
| 4 | Record a work session. | Clear step. |
| 9 | Add the outcome, time, break, and optional evidence link. | Clear step detail. |
| 3 | Review the week. | Clear step. |
| 8 | Check each self-reported work session before sharing it. | Useful instruction. |
| 3 | Download the receipt. | Clear step. |
| 11 | Save a PDF for your client and a backup for yourself. | Clear result. |
| 6 | What Work Receipt does not do | Literal limitation heading. |
| 10 | It does not request screen, camera, microphone, or location access. | Covered by `no-device-capture`. |
| 12 | A weekly receipt records what you enter; it is not independent proof. | Covered by `self-reported`. |
| 9 | Work Receipt · self-reported work sessions stored in this browser. | Clear footer summary. |
| 1 | Demo | Clear footer link. |
| 1 | Privacy | Clear footer link. |
| 1 | Terms | Clear footer link. |
| 4 | Built by Param Factory | Clear provenance. |
| 6 | Original generated still-life artwork · Build 1.2.0 | Clear asset/build provenance. |

### README

| Words | Exact copy | Result |
| ---: | --- | --- |
| 2 | Work Receipt | Product name. |
| 10 | Turn freelance work sessions into a private weekly client receipt. | Clear job statement. |
| 10 | For independent hourly workers who need to explain billable time. | Clear audience. |
| 14 | Use it when review, waiting, and judgment do not show in an activity tracker. | Clear situation. |
| 6 | Record timed or manual work sessions. | Covered by `session-recording`. |
| 10 | Add outcomes, breaks, optional evidence links, and an AI-assisted label. | Covered by `session-details` and `evidence-control`. |
| 10 | Create a weekly PDF that stays clear about being self-reported. | Covered by `pdf-receipt` and `self-reported`. |
| 9 | Your records stay in this browser on this device. | Covered by privacy and persistence claims. |
| 10 | The app sends no work-session data, analytics, or tracking requests. | Covered by `local-privacy`. |
| 9 | Saved work sessions open offline after the first visit. | Covered by `offline-reload`. |
| 3 | Try the sample | Literal heading. |
| 6 | Open http://localhost:4173/demo after starting the app. | Clear local instruction. |
| 6 | The live demo is at field-time-invoice-proof.sociobot.in/demo. | Clear live instruction. |
| 12 | The demo starts with three work sessions and an open weekly receipt. | Covered by `demo-isolation`. |
| 8 | Its database is separate from your real records. | Covered by `demo-isolation`. |
| 14 | Use Reset demo to restore the sample or Start for real to discard it. | Clear demo instruction. |
| 3 | What it includes | Literal heading. |
| 8 | A timer and manual entry for work sessions. | Covered by `session-recording`. |
| 7 | A self-reported weekly receipt and PDF download. | Covered by PDF and disclosure claims. |
| 4 | JSON backup and import. | Covered by `json-roundtrip`. |
| 8 | CSV export with one row per work session. | Covered by `csv-export`. |
| 6 | Receipt name, client, and closing-note settings. | Covered by `receipt-settings`. |
| 12 | Install the app and open saved work sessions offline after one visit. | Covered by install and offline claims. |
| 11 | Recording, receipt details, PDFs, backup, import, and CSV export are free. | Covered by `free-core`. |
| 9 | There is no paid tier or embedded payment provider. | Covered by `free-core` and source/request inspection. |
| 2 | Run locally | Clear developer heading. |
| 5 | Requires Node.js 20 or newer. | Clear developer prerequisite. |
| 2 | Open http://localhost:4173. | Clear instruction. |
| 3 | Test and build | Clear developer heading. |
| 6 | Claim checks are listed in .factory/claims.json. | Accurate developer pointer. |
| 6 | Each has one tagged browser test. | Confirmed: each tag occurs once. |
| 7 | The production build is written to dist/. | Confirmed by the clean build. |
| 3 | Privacy and limits | Literal heading. |
| 11 | Work Receipt does not request screen, camera, microphone, or location access. | Covered by `no-device-capture`. |
| 6 | It does not provide independent proof. | Covered by `self-reported`. |
| 11 | Evidence links are stored as text and open only when selected. | Covered by `evidence-control`. |
| 11 | Export a JSON backup before clearing browser data or moving devices. | Useful instruction. |
| 8 | See the built app’s /privacy/ and /terms/ pages. | Clear instruction. |
| 1 | Deploy | Clear developer heading. |
| 14 | Run npm run build, then deploy the contents of dist/ as a static site. | Clear developer instruction. |
| 14 | staticwebapp.config.json supplies routes, security headers, MIME types, immutable asset caching, and the 404 response. | Appropriate developer detail; verified in source and live. |
| 5 | The project is MIT licensed. | Confirmed by `LICENSE`. |
| 8 | Image provenance is documented in .factory/design.md and assets/src/hero-notebook.json. | Confirmed in the repository. |

All actions use result-naming verbs. **Close** and **Cancel** are conventional reversible dialog actions. The landing and README use **work session**, **weekly receipt**, **break**, **evidence link**, **import**, **JSON backup**, and **demo** consistently.

## Demo and sandbox verification

**Result: PASS.** The first-screen action opened `/?demo=1` in one click. The first demo screen already showed an open, filled weekly receipt for Mira Chen and Northwind Studio with three realistic sessions totaling 7h 30m. The required **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real** controls were present.

In one fresh live context, I created a real record, entered the demo, mutated the sample, reset it, and started for real. The real record never appeared in demo. Reset removed the mutation and returned the sample to three sessions. Start for real deleted `demo:work-receipt`, retained `work-receipt`, and restored the untouched real record.

The live flow made only same-origin GET requests with empty bodies. It logged no console error. After service-worker control, an offline reload retained the three demo sessions, banner, and **“Offline · saving on this device”** state.

## Claims verification

I cloned candidate `483f20e` with `git clone --no-local` into `/tmp/work-receipt-review3-clean-l0p4Su`, ran `npm ci`, built once, kept that clean preview running, and executed every exact registered command individually. Each claim tag occurs exactly once.

| Claim id | Result |
| --- | --- |
| `demo-isolation` | PASS — 1 passed |
| `local-privacy` | PASS — 1 passed |
| `no-device-capture` | PASS — 1 passed |
| `session-recording` | PASS — 1 passed |
| `session-details` | PASS — 1 passed |
| `session-management` | PASS — 1 passed |
| `session-persistence` | PASS — 1 passed |
| `evidence-control` | PASS — 1 passed |
| `receipt-settings` | PASS — 1 passed |
| `site-data-removal` | PASS — 1 passed |
| `offline-reload` | PASS — 1 passed |
| `json-roundtrip` | PASS — 1 passed |
| `csv-export` | PASS — 1 passed |
| `pdf-receipt` | PASS — 1 passed |
| `local-file-creation` | PASS — 1 passed |
| `installable-pwa` | PASS — 1 passed |
| `free-core` | PASS — 1 passed |
| `self-reported` | PASS — 1 passed |

No listed test failed. The live landing and README product claims map to the registry; no unlisted product capability, privacy, offline, price, or output claim was found.

## Earlier finding verification

Every earlier review, polish ledger, verification report, and handoff was read. Each earlier finding was checked against live behavior and current source.

| Earlier item | Result | Current evidence |
| --- | --- | --- |
| F-1-1 demo | FIXED | Live populated demo, persistent banner, reset, exit, namespace isolation, and real-record preservation pass. |
| F-1-2 claims registry | FIXED | 18 entries, one tag each, all commands pass; request and PDF assertions cover their full claims. |
| F-1-3 dead checkout | FIXED | No checkout, license, paid control, billing request, or payment-provider runtime code remains. |
| F-1-4 missing brief | FIXED | `.factory/brief.json` exists and matches the shipped audience, job, scope, and exclusions. |
| F-1-5 first-screen headline | FIXED | Job, audience, first action, next result, and three facts appear before scrolling at both widths. |
| F-1-6 mobile overflow | FIXED | Root and demo are `390/390`; the mobile paper layer is constrained in source. |
| F-1-7 immutable caching | FIXED | Live hashed JS/CSS return `public, max-age=31536000, immutable`; host config matches. |
| F-1-8 metadata/routes | FIXED | All eight shipped pages have route titles, descriptions, canonicals, OG/Twitter images, and icons; unknown route returns designed HTTP 404. |
| F-1-9 shared shell/focus | **REOPENED / BLOCKING** | Focus and announcement pass, but both sample-evidence headers diverge from the standard shell; see the finding above. |
| F-1-10 security policy | FIXED | Every checked route has zero CSP/console errors; live response headers include CSP/frame denial, permissions, nosniff, and referrer policy. |
| F-1-11 nested landmark | FIXED | Timer is a non-landmark `div`; live route-wide axe reports zero violations at all impacts. |
| F-1-12 metaphor headings | FIXED | Landing and recovery headings name their task or state directly. |
| F-1-13 record terminology | FIXED | User copy consistently distinguishes work sessions from weekly receipts. |
| F-1-14 vague buttons | FIXED | Current actions name the action or result; the paid control remains removed. |
| F-1-15 long README sentence | FIXED | No README sentence exceeds 22 words. |
| F-1-16 user-facing jargon | FIXED | Install/offline benefits are plain; implementation terms remain in developer sections. |
| F-1-17 mood adjectives | FIXED | “Calm” and “humane” are absent; receipt contents are stated exactly. |
| F-2-1 mobile touch targets | FIXED | No visible interactive target below 44 × 44 px was found on live root or demo at 390 px. |
| F-2-2 offline prerequisite | FIXED | First-screen copy says “After your first visit.” |
| F-2-3 import/restore drift | FIXED | Product ingestion uses “import”; “restore” refers only to reseeding demo data. |
| F-2-4 break/interruption drift | FIXED | User-facing product copy uses “break”; internal property names do not surface. |
| F-2-5 recovery headings | FIXED | Live h1s are “Page not found” and “You are offline.” |
| Verification defect 1: overflow | FIXED | Live phone layout is `390/390`. |
| Verification defect 2: cache headers | FIXED | Live hashed assets are immutable. |
| Verification hardening: landmark | FIXED | Route-wide live axe scan is empty. |
| Verification hardening: browser policy/MIME | FIXED | CSP, frame denial, Permissions-Policy, and manifest MIME are correct live. |

## Structure, accessibility, links, and identity

- Root, Demo, Privacy, Terms, 404, Offline, and both sample-evidence pages have `lang="en"`, one h1, one main, complete route metadata, and no missing image alternative.
- `/not-a-real-page-review-3` returns HTTP 404 with the designed not-found page. All 15 unique internal links crawled below 400.
- Home → Demo → Back and Home → Privacy → Back restore the correct URL, focus the h1, and announce the route title.
- Full-impact live axe scans report zero violations across all eight shipped pages. The checked 390 px routes have no horizontal overflow or sub-44 px visible controls.
- No checked route logs a console error. The entry bundle is 127.05 KB raw / 42.00 KB gzip; PDF dependencies remain lazy-loaded.
- Clean-build and live hashes match for the entry JS (`457b2f…6564`) and CSS (`16cf8c…0e49`).
- The warm ruled paper, editorial notebook still life, ink/teal/stamp palette, receipt typography, and workbench layout are product-specific rather than a generic SaaS template.
- The only structural failure is the inconsistent evidence-page header recorded as F-1-9.

## Full quality gates

From the clean clone:

- `npm ci`: PASS — 87 packages, 0 vulnerabilities.
- `npm test`: PASS — 7/7.
- `npm run build`: PASS — `dist/` produced.
- Every registered claim command: PASS — 18/18 individually.
- `npm run test:e2e`: PASS — 53 passed, 5 intentional duplicate-project skips.

## Missed leverage

No additional AI, import/export, or sync feature is justified. The brief explicitly excludes runtime AI generation because generated work claims would weaken trust. The existing AI-assisted field is a tested disclosure label, not decorative generation, and the repository contains no runtime provider key or model endpoint. JSON backup/import and CSV export already provide portability. Cloud sync is explicitly excluded to preserve the local-only boundary.

## What would make this perfect

There is one concrete change left: make both sample-evidence headers use the exact standard Work Receipt home, Demo, and Privacy links, while retaining a body-level return-to-demo action. Add a route-wide header assertion so this cannot regress.

Until that one reopened finding is fixed and verified on the live site, the correct verdict is **FAIL**.
