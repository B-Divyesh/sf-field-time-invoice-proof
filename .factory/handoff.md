# Work Receipt v1 handoff — verification status: FAIL

## Independent verification (2026-08-28)

Candidate `4716d10191c65df5ebc2a0275179036fc274c341` was independently built and tested against https://field-time-invoice-proof.sociobot.in/. **FAIL:** the live deployment matches the candidate exactly, but it has two medium-severity acceptance defects: a 12px horizontal overflow at a 390px mobile viewport (`scrollWidth` 402 / `clientWidth` 390), and hashed production JS/CSS are served with only `Cache-Control: public, must-revalidate, max-age=30` rather than long-lived immutable caching.

The complete reproducible evidence, commands, product-path coverage, PWA/offline checks, header findings, and all defects are in `.factory/verification.md`. Local quality gates passed: `npm ci`, `npm test` (7/7), `npm run build`, and `npm run test:e2e` (9 passed, 1 expected skip); Lighthouse mobile was 99 performance / 100 accessibility. Do not treat the release as accepted until the two medium defects are corrected and reverified.

## What shipped

- A responsive, installable Vite + TypeScript PWA using the product-specific handwritten lab-notebook system documented in `design.md`.
- A durable local work log in IndexedDB with start/stop timers, manual sessions, client-readable outcome notes, declared interruption deductions, optional HTTP(S) evidence links, and explicit AI-assisted labels.
- Immediate local-save feedback, project filtering, edit and confirmed delete paths, empty/error/offline states, and timer continuity across refreshes.
- Weekly client receipt preview and locally generated branded PDF. Every receipt says the record is self-reported rather than independent verification.
- User-owned JSON backup/import and CSV export. No work record, evidence link, or receipt content is sent off-device.
- A $19 one-time Studio unlock through the Sociobot billing contract: hosted checkout, return-token capture, local token storage, daily background verification, optimistic cached/offline unlock, invalid-license handling, restore-by-token, and configurable receipt identity. Core notes, PDF, backup, accessibility, and safety remain free.
- PWA manifest with 192/512/maskable icons, versioned service-worker shell and asset caches, network-first navigation, offline fallback, and update notification.
- Original generated hero illustration (WebP: 33 KB mobile / 111 KB large) with source, prompt, review, and provenance retained under `assets/src/`.
- Standalone `/privacy/` and `/terms/` pages, MIT license, and complete README.

## Run and verify

Requires Node.js 20+.

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

The deploy command is exactly `npm run build`; its output is `dist/`, and `dist/index.html` is at the root.

Verification completed on 2026-08-28:

- `npm test`: 7/7 unit tests passed.
- `npm run test:e2e`: 9 passed, 1 intentionally skipped duplicate axe scan. Desktop Chromium and a 390×844 mobile Chromium project covered manual entry/persistence/filtering, timer refresh/save, weekly PDF download, no console errors, and offline reload.
- Playwright axe scan: zero serious or critical violations (full color-contrast rule enabled).
- `/opt/fleet/lib/verify-url.sh`: HTTP 200; title and `lang` present; exactly one h1; main landmark present; zero images missing alt; zero unlabeled buttons; zero console/page errors; observed local load 611 ms.
- Lighthouse mobile-class run: Performance 100, Accessibility 100, Best Practices 100, SEO 92; LCP 1.7 s, TBT 50 ms, CLS 0.002, Speed Index 1.1 s, Time to Interactive 1.7 s.
- Production payload: initial JS 125.29 KB raw / 41.84 KB gzip; CSS 17.45 KB raw / 4.79 KB gzip. PDF tooling is a lazy-loaded chunk and does not count toward first load. Hero variants are both below the 300 KB cap.
- `npm audit`: zero known vulnerabilities after the final dependency update.
- Visual inspection completed at 1440×1000 and 390×844; content stacks without horizontal clipping and all controls remain in document flow.

## Operational notes

- Production defaults to `https://api.sociobot.in` and product slug `field-time-invoice-proof`. Set `VITE_BILLING_BASE=https://pilot-api.sociobot.in` for a factory staging/test registration; no opaque product ID is embedded.
- Billing verification could not be exercised against a real registered token because product registration is a factory/deployment step. The free experience never waits on or depends on the billing API.
- Browsers can evict local site data. The UI, privacy page, and README all tell users to export backups; there is intentionally no cloud sync.
- SEO scored 92 because this is an app utility without marketing crawl infrastructure; all required app semantics and accessibility checks pass.
