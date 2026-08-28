# Adversarial first-read review 4 — PASS

**Reviewed:** 2026-08-28
**Candidate:** `b749987686ca0875ad5a72dde551b1a1fe618bd4`
**Live URL:** `https://field-time-invoice-proof.sociobot.in`
**Viewports:** fresh Chromium contexts at 390 × 844 and 1440 × 900
**Verdict:** **PASS** — no blocking, major, minor, unlisted-claim, or untested-claim finding remains.

## Cold first read

Before scrolling at both widths, the product answers all three questions.

- **What does it do?** It turns freelance time into a client receipt.
- **For whom?** Independent workers who need to explain billable time without activity tracking.
- **What should I click first?** **“Try it with sample data.”** The adjacent result says **“Opens a sample weekly receipt.”**

The exact first-screen copy is **“Turn freelance time into a client receipt,”** **“For independent workers who need to explain billable time without activity tracking,”** and **“Try it with sample data.”** The phone first screen also shows the three useful facts: records stay in the browser, saved work sessions work offline after the first visit, and recording/exporting is free. Root measured `390/390` CSS pixels at 390 px. Desktop and phone loads produced no console error and only same-origin GET requests.

## Findings

None.

## Copy audit

Counts treat hyphenated terms, paths, and URLs as one word. This inventory covers every landing-page sentence or standalone reader-facing copy unit, plus every README sentence. Controls and form labels are included where they act as a sentence or instruction. No item is over 22 words, contains banned marketing language, relies on a mood/metaphor heading, or uses an inconsistent term. All result actions name the outcome.

### Landing page

| Words | Exact rendered copy | Check |
| ---: | --- | --- |
| 4 | Skip to work sessions | Clear skip action. |
| 2 | Work Receipt | Product name. |
| 1 | Demo | Clear navigation. |
| 1 | Privacy | Clear navigation. |
| 3 | Saved on device | Clear storage status. |
| 5 | Work sessions for independent workers | Names audience. |
| 7 | Turn freelance time into a client receipt | Job-led h1. |
| 12 | For independent workers who need to explain billable time without activity tracking. | Names user and situation. |
| 5 | Try it with sample data | Result-naming first action. |
| 5 | Opens a sample weekly receipt. | States the immediate result. |
| 5 | Records stay in this browser. | `local-privacy`, `session-persistence`. |
| 9 | After your first visit, saved work sessions open offline. | `offline-reload`. |
| 5 | Recording and exports are free. | `free-core`. |
| 8 | A weekly receipt is self-reported, not independent proof. | `self-reported`. |
| 3 | Work session timer | Literal section name. |
| 4 | Start a work session | Literal task heading. |
| 5 | You choose what to record. | Manual-control statement. |
| 9 | Work sessions and evidence links stay in this browser. | `local-privacy`, `evidence-control`. |
| 3 | Recent work sessions | Literal heading. |
| 5 | Add your first work session | Useful empty-state heading. |
| 9 | Start the timer or add a completed work session. | Useful empty-state instruction. |
| 5 | Create a weekly client receipt | Literal section heading. |
| 12 | Create a weekly PDF that lists outcomes, time, breaks, and selected evidence. | `pdf-receipt`. |
| 7 | Back up or import your work sessions | Literal section heading. |
| 7 | Download a JSON backup or CSV file. | `json-roundtrip`, `csv-export`. |
| 7 | Import a JSON backup on another device. | `json-roundtrip`. |
| 3 | How it works | Recognizable section heading. |
| 4 | Record a work session. | Clear step. |
| 9 | Add the outcome, time, break, and optional evidence link. | Clear step detail. |
| 3 | Review the week. | Clear step. |
| 8 | Check each self-reported work session before sharing it. | Useful instruction. |
| 3 | Download the receipt. | Clear step. |
| 11 | Save a PDF for your client and a backup for yourself. | Clear result. |
| 6 | What Work Receipt does not do | Literal limitation heading. |
| 10 | It does not request screen, camera, microphone, or location access. | `no-device-capture`. |
| 12 | A weekly receipt records what you enter; it is not independent proof. | `self-reported`. |
| 9 | Work Receipt · self-reported work sessions stored in this browser. | Clear footer summary. |
| 4 | Built by Param Factory | Clear provenance. |
| 7 | Original generated still-life artwork · Build 1.3.0 | Provenance/build label. |

The remaining visible actions use clear result verbs: **Start work session**, **Add a work session**, **Save work session**, **Prepare weekly receipt**, **Download PDF**, **Export backup (.json)**, **Export work sessions (.csv)**, **Import backup**, **Reset demo**, and **Start for real**. Conventional reversible dialog actions (**Close**, **Cancel**) are clear in context.

### README

| Words | Exact copy | Check |
| ---: | --- | --- |
| 10 | Turn freelance work sessions into a private weekly client receipt. | Clear job statement. |
| 10 | For independent hourly workers who need to explain billable time. | Clear audience. |
| 14 | Use it when review, waiting, and judgment do not show in an activity tracker. | Clear situation. |
| 6 | Record timed or manual work sessions. | `session-recording`. |
| 10 | Add outcomes, breaks, optional evidence links, and an AI-assisted label. | `session-details`, `evidence-control`. |
| 10 | Create a weekly PDF that stays clear about being self-reported. | `pdf-receipt`, `self-reported`. |
| 9 | Your records stay in this browser on this device. | `local-privacy`, `session-persistence`. |
| 10 | The app sends no work-session data, analytics, or tracking requests. | `local-privacy`. |
| 9 | Saved work sessions open offline after the first visit. | `offline-reload`. |
| 6 | Open http://localhost:4173/demo after starting the app. | Clear sample instruction. |
| 6 | The live demo is at field-time-invoice-proof.sociobot.in/demo. | Clear sample instruction. |
| 12 | The demo starts with three work sessions and an open weekly receipt. | `demo-isolation`. |
| 8 | Its database is separate from your real records. | `demo-isolation`. |
| 14 | Use Reset demo to restore the sample or Start for real to discard it. | Clear demo instruction. |
| 8 | A timer and manual entry for work sessions. | `session-recording`. |
| 7 | A self-reported weekly receipt and PDF download. | `pdf-receipt`, `self-reported`. |
| 4 | JSON backup and import. | `json-roundtrip`. |
| 8 | CSV export with one row per work session. | `csv-export`. |
| 6 | Receipt name, client, and closing-note settings. | `receipt-settings`. |
| 11 | Install the app and open saved work sessions offline after one visit. | `installable-pwa`, `offline-reload`. |
| 11 | Recording, receipt details, PDFs, backup, import, and CSV export are free. | `free-core`. |
| 9 | There is no paid tier or embedded payment provider. | `free-core`. |
| 5 | Requires Node.js 20 or newer. | Developer prerequisite. |
| 3 | Each has one tagged browser test. | Confirmed by source scan. |
| 7 | The production build is written to dist/. | Confirmed by clean build. |
| 11 | Work Receipt does not request screen, camera, microphone, or location access. | `no-device-capture`. |
| 6 | It does not provide independent proof. | `self-reported`. |
| 11 | Evidence links are stored as text and open only when selected. | `evidence-control`. |
| 11 | Export a JSON backup before clearing browser data or moving devices. | Useful instruction. |
| 8 | See the built app’s /privacy/ and /terms/ pages. | Clear instruction. |
| 14 | Run npm run build, then deploy the contents of dist/ as a static site. | Clear developer instruction. |
| 14 | staticwebapp.config.json supplies routes, security headers, MIME types, immutable asset caching, and the 404 response. | Appropriate developer detail. |
| 5 | The project is MIT licensed. | Confirmed by `LICENSE`. |
| 8 | Image provenance is documented in .factory/design.md and assets/src/hero-notebook.json. | Confirmed in repository. |

Terminology is consistent: **work session** (saved unit), **weekly receipt** (client PDF), **break** (deducted time), **evidence link** (optional URL), **import** (bringing in JSON), **JSON backup** (portable copy), and **demo** (sample workspace). The catalog description is verb-led and 79 characters.

## Demo and sandbox behaviour

**PASS.** A fresh live visit created one real record, then entered `/?demo=1` from the landing action. The first demo screen already showed an open weekly receipt and three realistic Northwind/Harbor sessions. Both persistent demo notices read **“Demo — sample data, nothing is saved,”** and the required **Reset demo** and **Start for real** controls were present.

The real record was absent in demo. Reset returned the demo to exactly three sessions. Start for real returned to `/`, restored the real record, and left only `work-receipt` in IndexedDB; `demo:work-receipt` had been discarded. During that live flow every observed request was a same-origin GET with no body. The registered offline test separately reloaded the seeded demo after service-worker control with networking disabled.

## Claims verification

From a fresh `git clone --no-local` of this candidate: `npm ci`, `npm test`, and `npm run build` all passed. Every exact test command listed in `.factory/claims.json` was run individually and passed; every claim tag occurs exactly once.

| Claim id | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `local-privacy` | PASS |
| `no-device-capture` | PASS |
| `session-recording` | PASS |
| `session-details` | PASS |
| `session-management` | PASS |
| `session-persistence` | PASS |
| `evidence-control` | PASS |
| `receipt-settings` | PASS |
| `site-data-removal` | PASS |
| `offline-reload` | PASS |
| `json-roundtrip` | PASS |
| `csv-export` | PASS |
| `pdf-receipt` | PASS |
| `local-file-creation` | PASS |
| `installable-pwa` | PASS |
| `free-core` | PASS |
| `self-reported` | PASS |

Landing and README claim-like copy maps to those entries. No unlisted capability, privacy, offline, price, or output claim was found.

## History verification

All earlier review, polish, verification, and handoff documents were read, then each historical issue was checked in the live product and current source.

| Earlier finding | Result |
| --- | --- |
| F-1-1 demo isolation | FIXED — live sample receipt, banner, reset, exit, and real-data preservation work. |
| F-1-2 claims registry | FIXED — 18 one-tag, observable claim checks pass. |
| F-1-3 unavailable checkout | FIXED — no paid tier, checkout, or payment control remains. |
| F-1-4 missing brief | FIXED — brief exists and matches the product scope. |
| F-1-5 first-screen clarity | FIXED — job, audience, action, result, and facts are visible. |
| F-1-6 mobile overflow | FIXED — live phone width is `390/390`. |
| F-1-7 immutable assets | FIXED — hashed live assets use one-year immutable caching. |
| F-1-8 metadata/routes | FIXED — route metadata, discovery files, and designed HTTP 404 are present. |
| F-1-9 shared shell/focus | FIXED — including both sample-evidence pages: `Work Receipt` links to `/`; header nav is Demo and Privacy; contextual Return to demo stays in the body. |
| F-1-10 security policy | FIXED — CSP/frame denial, permissions, nosniff, and referrer policy are live response headers. |
| F-1-11 nested landmark | FIXED — full-impact axe scan is clean. |
| F-1-12 literal headings | FIXED — headings name tasks or recovery states. |
| F-1-13 terminology drift | FIXED — current user copy uses the terminology table above. |
| F-1-14 vague actions | FIXED — all non-dialog actions name a result. |
| F-1-15 long README sentence | FIXED — every sentence is at most 22 words. |
| F-1-16 reader-facing jargon | FIXED — browser/device language replaces implementation jargon. |
| F-1-17 mood adjectives | FIXED — receipt contents are stated concretely. |
| F-2-1 touch targets | FIXED — browser mobile checks pass. |
| F-2-2 offline prerequisite | FIXED — first-screen copy says “After your first visit.” |
| F-2-3 import/restore drift | FIXED — restore now refers only to reseeding the sample. |
| F-2-4 break/interruption drift | FIXED — user-facing copy consistently says break. |
| F-2-5 recovery headings | FIXED — live h1s say “Page not found” and “You are offline.” |

## Structure, accessibility, links, and identity

- Root, Demo, Privacy, Terms, 404, Offline, and both sample-evidence routes have `lang="en"`, exactly one h1, one main landmark, route-specific title/description/canonical/OG/Twitter data, favicon, and Apple touch icon.
- The eight route titles use a plain product/route pattern, and `/not-a-real-page-review-4` returned the designed page with HTTP 404.
- Forward and Back on app routes restore the expected URL, focus the new h1, and update the polite route announcement. The route suite verifies this.
- The live internal-link crawl found all nine distinct linked destinations returning below 400. The local route crawl covers every shipped HTML route and its links.
- The fresh-clone end-to-end suite completed without failed tests. It includes full-impact axe scans, mobile overflow and 44 px target checks, headers/metadata, shell consistency, link crawling, console/CSP checks, and offline loading.
- The warm ruled-paper notebook, still-life art, ink/teal/stamp palette, receipt sheet, and low-motion paper interaction grammar match `.factory/design.md` and are distinct from a generic SaaS template.

## Missed leverage

No missing feature was found. The brief requires import/export, which the product provides through JSON backup/import and CSV export. It excludes cloud sync to preserve its local-only boundary. It also excludes runtime AI generation because generated claims about completed work would weaken trust. The AI-assisted control is a plain disclosure label, not decorative generation, and no provider key or AI endpoint is embedded.

## What would make this perfect

Nothing is currently required to meet the stated product contract. Preserve the route-wide header test, one-claim-per-test registry, and clean-demo isolation checks as future changes are made.
