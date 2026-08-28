# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-28
**Live URL:** `https://field-time-invoice-proof.sociobot.in`
**Viewports:** fresh Chromium contexts at 390 × 844 and 1440 × 1000
**Verdict:** **FAIL** — blocking findings remain. A visitor cannot safely try the product without entering personal data, its claimed privacy/offline/export behaviour has no claims registry or claim tests, and the paid checkout is dead.

## Cold first read

Before scrolling at 390 px, I inferred that this is a private timer/log which creates a weekly PDF for someone to send a client. I could not state the intended user precisely: the first screen says “Private field notes for billable work” and “your client,” not that it is for freelancers or independent hourly workers. I could infer that “Start session” is the first action for real use, but it requires me to enter my own project and outcome; it is not a safe way to assess the product.

The headline fails the first-read rule. Exact text: **“Show the work. Keep your privacy.”** It is a slogan, not the job, audience, or first action. The only visible first action is **“Start session”**; no text says what will happen after it. There is no “Try it with sample data” action.

Desktop has the same copy and no sample-data route. At 390 px, the document is horizontally scrollable: `scrollWidth` is 402 while `clientWidth` is 390.

## Findings

### Blocking

#### F-1-1 — No one-click, isolated sample-data demo

**Location / evidence:** The live first screen contains “Start session” and “Add manually,” but no “Try it with sample data.” `/demo` returns the ordinary app (HTTP 200) and `?demo=1` has no sample records, demo banner, “Reset demo,” or “Start for real” control. `.factory/demo.md` is absent.

I saved the normal record “A record that must not appear in demo,” then opened `/?demo=1` in the same fresh browser context. The record remained visible. Counts: `demoBanner=0`, `resetDemo=0`, `startReal=0`, `leakedRecord=1`.

**Why this fails:** A first-time visitor cannot try the receipt workflow without creating personal data. More seriously, the supposed demo URL shares the real IndexedDB namespace, so demo mode would expose and alter real data.

**Concrete fix:** Add a visible first-screen button, **“Try it with sample data — opens a sample weekly receipt”**. Make `/demo` (and `?demo=1` if retained) seed a realistic week of sessions in a `demo:` IndexedDB/localStorage namespace before rendering. Show a persistent **“Demo — sample data, nothing is saved”** banner with **“Reset demo”** and **“Start for real”**. Verify that opening demo never reads or writes the production namespace and document the flow in `.factory/demo.md`.

#### F-1-2 — Claims registry and all claim-tagged tests are missing

**Location / evidence:** `.factory/claims.json` does not exist, and `rg '@claim:'` finds no tests. The required claim-test commands therefore cannot be run from a clean clone. `npm test` passes 7 unit tests and `npm run test:e2e` passes 10 browser tests, but neither test suite contains a claim tag.

**Unlisted claims:** With no registry, every visitor-reliance claim is unlisted. This includes, at minimum:

- Landing hero: “No screenshots.” “No keystrokes.” “Nothing leaves this device.”
- Landing timer: “No activity capture.” “Your notes and evidence links stay in this browser.”
- Landing receipt/export area: “A … PDF with outcomes, time, interruptions, and only the evidence you chose to share.” “Back up everything as JSON … CSV.”
- README opening/privacy/install/licensing sections: “offline-first”; “All work records live in IndexedDB”; “There is no account, telemetry …”; “The app installs as a PWA”; “The free tier includes … weekly PDF generation … exports”; “No payment provider is embedded”; and “Clearing browser site data removes local records.”

**Why this fails:** Privacy, offline operation, export, storage, PWA, pricing, and payment-routing statements are claims a visitor may rely on. The required sandbox cannot prove them.

**Concrete fix:** Create `.factory/claims.json` and one clean-state observable test per claim, each tagged `@claim:<id>`. Include request-log tests for the privacy/no-data-leaves-device claim, service-worker offline reload with demo data, JSON/CSV/PDF output contents, demo storage isolation/reset, and the Studio checkout response. Remove any claim that cannot be tested.

#### F-1-3 — The paid Studio checkout link is dead

**Location / evidence:** Open **“Studio unlock”**, then inspect/crawl **“Buy Studio unlock.”** Its href is `https://api.sociobot.in/api/v1/products/field-time-invoice-proof/checkout`; an HTTP HEAD request on 2026-08-28 returned **404 `application/json`**.

**Why this fails:** A visitor is offered a $19 upgrade but cannot buy it. This is a dead link and makes the stated paid feature unavailable.

**Concrete fix:** Register/configure the product route so the checkout URL returns a valid hosted checkout, or remove the Studio purchase control and all paid-tier copy until it is available. Add a claim test that follows the configured checkout route and asserts the non-error destination. Label it as an external checkout.

#### F-1-4 — The required scope brief is absent

**Location / evidence:** `.factory/brief.json` is missing. The repository contains only `.factory/design.md`, `.factory/handoff.md`, and `.factory/verification.md` before this review.

**Why this fails:** The required brief is the source of truth for audience, real job-to-be-done, and the missed-leverage check. Without it, a reviewer cannot verify that the shipped capabilities match the researched opportunity.

**Concrete fix:** Restore the researched `.factory/brief.json`, including the primary user, job, constraints, and any expected import/export/sync/AI leverage. Then re-run this review against that scope.

#### F-1-5 — The first-screen headline does not name the job or audience

**Location / exact quote:** Hero `<h1>`: “Show the work. Keep your privacy.” The nearby line is “Private field notes for billable work.”

**Why this fails:** The h1 is two mood slogans. A cold visitor cannot tell whether this makes invoices, tracks time, proves work, or protects a client portal. “Billable work” does not identify the intended freelancer/independent worker audience.

**Concrete fix:** Replace with the job-led h1 **“Turn freelance time into a client receipt”**. Replace the supporting line with **“For independent workers who need to explain billable time without activity tracking.”**

#### F-1-6 — The earlier mobile-overflow defect is still unfixed

**History:** `.factory/verification.md`, Defect 1, reported a 12 px overflow and named `.hero-figure::before` as the cause.

**Current evidence:** On the live site at 390 × 844, `document.documentElement.scrollWidth` is **402** and `clientWidth` is **390**. Source still has `.hero-figure::before { inset: 18px -10px -12px 14px; }` and the rotated figure.

**Why this fails:** The phone layout can be panned sideways before a visitor has used the product.

**Concrete fix:** Constrain or clip the decorative paper layer at mobile widths without clipping meaningful content, then add a 390 px test asserting `scrollWidth === clientWidth`.

#### F-1-7 — The earlier cache-control defect is still unfixed

**History:** `.factory/verification.md`, Defect 2, reported non-immutable hashed assets.

**Current evidence:** Live `assets/index-CsiWh28F.js` returns `Cache-Control: public, must-revalidate, max-age=30` despite its content-hashed filename. The CSS has the same policy.

**Why this fails:** It regresses the expected static-PWA caching behaviour and forces needless revalidation of immutable build assets.

**Concrete fix:** Configure the static host to send a long-lived immutable policy, for example `public, max-age=31536000, immutable`, for content-hashed assets. Test the deployed response headers.

### Major

#### F-1-8 — Required routing, metadata, and discovery assets are incomplete

**Location / evidence:** The landing page has no canonical link, Open Graph/Twitter metadata, or Apple touch icon. `/robots.txt` and `/sitemap.xml` return 404. `staticwebapp.config.json`, `public/404.html`, `public/robots.txt`, and `public/sitemap.xml` are absent. `/404` returns HTTP 200 and renders the landing app title/h1 instead of a designed not-found page.

**Why this fails:** Shared links lack a product preview, search crawlers have no route map, and a mistyped URL misleadingly looks like a valid home page. There is no designed recovery route.

**Concrete fix:** Add canonical, OG/Twitter title/description/image, SVG/favicon and Apple touch declarations; publish robots and sitemap for `/`, `/demo`, `/privacy/`, and `/terms/`; add a product-styled 404 with a home link; and configure the host response override/navigation fallback. Crawl every route in CI for expected status and title.

#### F-1-9 — Navigation and legal-page shell are inconsistent

**Location / evidence:** The app header contains only the home wordmark, a save-status label, and **“Studio unlock.”** It has no Demo or Privacy nav link. `/privacy/` and `/terms/` contain a separate minimal header with only **“Back to app”**, and their footers omit Privacy, Terms, “Built by Param Factory,” and a version/build id.

**Why this fails:** A visitor cannot navigate to the demo or privacy policy from the header, and routes do not present a consistent product shell. Full page loads also provide no app route-change focus or live announcement.

**Concrete fix:** Use one header/footer on every route: wordmark home, Demo, Privacy, and no more than four clear links; footer one-liner, Privacy, Terms, “Built by Param Factory,” and build id. Implement real `/demo` routing and, for SPA transitions, history/back-forward scroll restoration, focus on the new h1, and a polite route announcement.

#### F-1-10 — Browser security policy headers are absent

**Location / evidence:** A live root response includes HSTS, referrer policy, and `X-Content-Type-Options`, but no `Content-Security-Policy`, frame-ancestors/X-Frame-Options, or Permissions-Policy. The manifest is served as `application/octet-stream`.

**Why this fails:** The static product is missing the requested CSP/frame protection and has an incorrect manifest MIME type.

**Concrete fix:** Add the host configuration with a CSP matching self-hosted assets, `frame-ancestors` as a response header, and Permissions-Policy. Serve the manifest as `application/manifest+json`. Verify headers on production.

#### F-1-11 — The previous axe landmark issue is still present

**History:** `.factory/verification.md`, Low/hardening finding 1.

**Current evidence:** A live `@axe-core/playwright` scan reports `landmark-complementary-is-top-level`, impact **moderate**, one node: “Aside should not be contained in another landmark.” Source places `<aside class="timer-panel">` inside `<section class="workbench">`.

**Why this fails:** Landmark nesting gives assistive technology an invalid page outline. This is not fixed merely because serious/critical axe checks pass.

**Concrete fix:** Make the timer a top-level complementary landmark or replace the nested `aside` with a non-landmark element. Keep an axe test that fails for all impacts until the scan is clean.

### Copy findings

#### F-1-12 — Landing headings use slogans and metaphors instead of section names

**Location / exact quotes:** “Show the work. Keep your privacy.”; “Ready for invoice day”; “Turn the week into a receipt.”; “Your data, your exit”; “A notebook with an open back cover.”

**Why this fails:** These headings do not independently name the product task or section for a first-time or screen-reader visitor. “A notebook with an open back cover” supplies no useful information.

**Concrete fix:** Use **“Create a weekly client receipt”** for the receipt section and **“Back up or restore your records”** for the export/import section. Use the F-1-5 h1 replacement. Delete “Ready for invoice day” and “Your data, your exit.”

#### F-1-13 — Terms for the same record are inconsistent

**Location / exact quotes:** The landing alternates among “field notes,” “time note,” “session,” “work log,” “record,” and “receipt.” The README uses “field notebook,” “sessions,” “work records,” and “receipt.”

**Why this fails:** A visitor has to infer whether a field note, session, and record are the same saved object.

**Concrete fix:** Define one primary term, for example **“work session,”** and use it in the timer, empty state, list, exports, README, and receipt. Reserve “weekly receipt” for the generated PDF only.

#### F-1-14 — Two visible buttons do not name their result

**Location / exact quotes:** “Studio unlock” and “Add manually.”

**Why this fails:** Neither is a result-naming verb. The first could open a price dialog or activate a license; the second could add a project, time, or note.

**Concrete fix:** Rename to **“View Studio price”** and **“Add a work session.”**

#### F-1-15 — README audience sentence exceeds the 22-word cap

**Location / exact quote (27 words):** “Independent knowledge workers who bill hourly and want a humane attachment for invoices—especially when time includes prompting, review, waiting, and judgment that activity trackers represent poorly.”

**Why this fails:** It stacks audience, use case, contrast, and examples into one sentence.

**Concrete fix:** **“For independent hourly workers who need to explain billable time. Use it when review, waiting, and judgment do not show in an activity tracker.”**

#### F-1-16 — README uses internal jargon where plain wording is needed

**Location / exact quotes:** “All work records live in IndexedDB on the current device.” “The app installs as a PWA after its first successful load.” “Production defaults to the registered slug and Sociobot API …”

**Why this fails:** “IndexedDB,” “PWA,” and “registered slug” do not help a user decide whether the product meets their needs.

**Concrete fix:** User-facing text: **“Your records stay in this browser on this device.”** and **“After one visit, you can install the app and use saved records offline.”** Move deployment configuration to a clearly labelled developer section.

#### F-1-17 — Landing copy contains unneeded marketing/mood adjectives

**Location / exact quote:** “A calm, client-readable PDF …”; README: “a humane attachment for invoices.”

**Why this fails:** “Calm” and “humane” do not explain an observable outcome.

**Concrete fix:** **“Create a weekly PDF that lists outcomes, time, interruptions, and selected evidence.”**

## Copy audit

Word counts use whitespace/punctuation-delimited words; UI labels, headings, and prose are included where they read as a sentence or standalone copy unit. Code blocks and form field labels are excluded. The cold landing starts with the empty state, so no user-generated session text is included.

### Landing page

| Words | Exact rendered copy | Audit |
|---:|---|---|
| 6 | Private field notes for billable work | Audience is vague; F-1-5 rewrite. |
| 3 | Show the work. | Slogan; F-1-5/F-1-12. |
| 3 | Keep your privacy. | Slogan; F-1-5/F-1-12. |
| 15 | Record what happened, account for interruptions, and make a clear weekly PDF for your client. | Claim; add claim test (F-1-2). |
| 2 | No screenshots. | Privacy claim; add request-log test (F-1-2). |
| 2 | No keystrokes. | Privacy claim; add request-log test (F-1-2). |
| 4 | Nothing leaves this device. | Privacy claim; add request-log test (F-1-2). |
| 3 | Self-reported by design | Define as receipt status; use consistently (F-1-13). |
| 9 | Your record is a statement of work, not surveillance. | Useful limitation; test/status-copy coverage needed (F-1-2). |
| 4 | Field timer · local only | Jargon/term drift; use “Timer for work sessions” (F-1-13). |
| 4 | Keep a time note | Term drift; use “Start a work session” (F-1-13). |
| 3 | No activity capture. | Privacy claim; add request-log/behaviour test (F-1-2). |
| 9 | Your notes and evidence links stay in this browser. | Privacy/storage claim; add test (F-1-2). |
| 3 | Recent field notes | Term drift; use “Recent work sessions” (F-1-13). |
| 5 | Your first note starts here | Term drift; use “Add your first work session” (F-1-13). |
| 10 | Start the field timer or add work you already completed. | Rewrite “Start a work session or add a completed session.” |
| 5 | Every save appears here immediately. | Observable claim; add test (F-1-2). |
| 4 | Ready for invoice day | Mood heading; delete (F-1-12). |
| 6 | Turn the week into a receipt. | Replace with section name (F-1-12). |
| 16 | A calm, client-readable PDF with outcomes, time, interruptions, and only the evidence you chose to share. | “Calm” is empty; claim needs test (F-1-2/F-1-17). |
| 4 | Your data, your exit | Mood heading; delete (F-1-12). |
| 7 | A notebook with an open back cover. | Metaphor; replace (F-1-12). |
| 10 | Back up everything as JSON or take a spreadsheet-friendly CSV. | Export claim; add output test (F-1-2). |
| 10 | Import a backup on another device whenever you need it. | Import claim; add clean-state test (F-1-2). |
| 6 | Work Receipt · local-first, self-reported work records. | “local-first” is jargon; use “stored in this browser” (F-1-16). |
| 9 | Still-life artwork generated for this product with Azure OpenAI. | Provenance, not a product claim; okay once image use is disclosed. |
| 8 | No client data is used in the image. | Privacy claim; add build/provenance test or remove (F-1-2). |

Visible controls separately audited: **“Start session,” “Prepare weekly receipt,” “Export backup (.json),” “Export sessions (.csv),”** and **“Import backup”** name their results. **“Studio unlock”** and **“Add manually”** fail F-1-14. The missing demo button is F-1-1.

### README

| Words | Exact sentence | Audit |
|---:|---|---|
| 18 | Work Receipt is a private, offline-first field notebook for freelancers who need to explain billable work without surveillance. | “offline-first” claim/jargon; registry test (F-1-2/F-1-16). |
| 19 | Record timed or manual sessions, describe outcomes and interruptions, attach optional evidence links, and generate a client-readable weekly PDF. | Feature claims; registry tests (F-1-2). |
| 14 | AI-assisted work can be labelled openly without pretending that a timer independently verifies it. | Feature/limitation claim; registry test (F-1-2). |
| 10 | All work records live in IndexedDB on the current device. | Jargon/privacy claim; F-1-16/F-1-2. |
| 10 | There is no account, telemetry, screenshot capture, or activity inference. | Privacy claim; registry request/behaviour test (F-1-2). |
| 10 | JSON backup/import and CSV export keep the data portable. | Export/import claim; registry tests (F-1-2). |
| 27 | Independent knowledge workers who bill hourly and want a humane attachment for invoices—especially when time includes prompting, review, waiting, and judgment that activity trackers represent poorly. | Over 22 words; F-1-15 rewrite. |
| 6 | Requires Node.js 20 or newer. | Developer fact; okay. |
| 4 | Open http://localhost:4173. | Instruction; okay. |
| 11 | The app installs as a PWA after its first successful load. | Jargon/installation claim; F-1-16/F-1-2. |
| 9 | The exact production build command is npm run build. | Developer instruction; okay. |
| 14 | Static deployment output is written to dist/, with dist/index.html at its root. | Developer instruction; okay. |
| 6 | Preview it using npm run preview. | Developer instruction; okay. |
| 13 | The free tier includes core recording, weekly PDF generation, and all data exports. | Product/price claim; registry tests (F-1-2). |
| 8 | The one-time Studio unlock adds custom receipt identity. | Product/price claim; registry test; checkout is dead (F-1-2/F-1-3). |
| 17 | Production defaults to the registered slug and Sociobot API; factory builds can override these without changing source: | “registered slug” jargon; move developer detail (F-1-16). |
| 5 | No payment provider is embedded. | Payment-routing claim; registry test (F-1-2). |
| 9 | Checkout and license verification use the Sociobot billing API. | Payment-routing claim; checkout currently 404 (F-1-2/F-1-3). |
| 13 | Receipts are explicitly self-reported; they are not independent proof, invoices, or surveillance records. | Important limitation; registry test/status review (F-1-2). |
| 11 | Clearing browser site data removes local records, so export backups regularly. | Storage claim; registry test (F-1-2). |
| 8 | See /privacy/ and /terms/ in the built app. | Links resolve; okay. |
| 9 | Deploy the contents of dist/ as a static site. | Developer instruction; okay. |
| 15 | Configure clean directory URLs so /privacy/ and /terms/ resolve to their respective index.html files. | Developer instruction; okay. |
| 6 | No server or secret is required. | Deployment claim; registry/config verification (F-1-2). |
| 2 | MIT licensed. | Licensing fact; okay. |
| 16 | The generated hero image provenance is documented in .factory/design.md and assets/src/hero-notebook.json. | Repository fact; okay. |

## Claims, privacy, and sandbox checks

- **Registry:** missing; no `@claim:` tests exist. This prevents the mandatory per-claim clean-clone test run (F-1-2).
- **Quality gates run:** `npm ci` passed; `npm test` passed (7/7); `npm run build` passed and emitted `dist/`; `npm run test:e2e` passed (10 tests). These are not sufficient claim coverage.
- **Requests:** Fresh `/?demo=1` load requested only `https://field-time-invoice-proof.sociobot.in`; no third-party runtime request was observed. This is evidence for the initial load only, not proof of the unregistered privacy claims.
- **Demo isolation:** failed, as documented in F-1-1. Normal data is visible at `?demo=1`.
- **Offline:** repository e2e test proves a cached shell reload after a prior local visit, but no demo exists and no registry entry proves the visitor-facing offline claim with sample data.
- **AI leverage:** The UI only labels a session “AI-assisted”; it does not present this as an AI feature and does not embed an AI key. Without the required brief, it is not possible to determine whether an AI-assisted drafting/extraction feature is implied. No decorative runtime AI feature was found.
- **Import/export leverage:** JSON import/export and CSV export exist, but their claimed observable results lack registry tests. No cloud sync is implied by the available product materials; local-first storage is explicit.

## Structure and history checks

| Check | Result | Evidence |
|---|---|---|
| Title / one h1 / lang / main / description | Pass on landing | `Work Receipt — honest time notes for clients`; one h1; `lang=en`; one main; description present. |
| Route titles | Partial | Privacy and Terms have suitable titles; `/demo` and `/404` render the home title. |
| Canonical / OG / Twitter / Apple touch | Fail | None present on the landing page. |
| Favicon | Partial | PNG favicon linked; SVG and Apple touch variants are not declared. |
| Robots / sitemap | Fail | Both live URLs return 404. |
| Designed 404 | Fail | `/404` returns 200 with the landing app. |
| Deep links / back / focus | Fail | No real demo route; no SPA route-change handling or focus/live announcement. |
| Crawled ordinary links | Partial | Home, Privacy, Terms return 200; Studio checkout returns 404 (F-1-3). |
| Header/footer consistency | Fail | Legal pages use a different sparse shell (F-1-9). |
| Visual identity | Pass | The ruled-paper/notebook treatment and original hero art are distinct from a generic SaaS template and match `.factory/design.md`. |
| Serious/critical axe | Pass | No serious/critical issues; one moderate landmark issue remains (F-1-11). |
| Earlier review/polish files | None | No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. |
| Earlier handoff/verification defects | Fail | Mobile overflow, non-immutable hashed caching, and axe landmark issue remain, as F-1-6, F-1-7, F-1-11. |

## What would make this perfect

Ship a genuinely isolated `/demo` that opens directly on a populated, client-readable weekly receipt; make the first screen say plainly that it turns freelance work sessions into a self-reported receipt; establish and run a complete claims registry; register or remove the Studio checkout; make every route, metadata asset, 404, header/footer, and security header production-complete; then resolve the mobile overflow, cache policy, landmark, and all copy flags. Re-run this entire review from a fresh browser context and clean clone. Only a zero-finding result merits PASS.
