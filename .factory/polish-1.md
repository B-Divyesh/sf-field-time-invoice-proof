# Polish round 1 finding ledger

Candidate `4716d10191c65df5ebc2a0275179036fc274c341` was repaired against cumulative review commit `2a5513147ed7f6f6fb15cde445e527f3b0f11099`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added `/demo` and `?demo=1`, three sample sessions, an opened receipt, the required banner, reset/start-real controls, and separate IndexedDB/localStorage names. | `@claim:demo-isolation`; `.factory/evidence/demo-mobile.png`; `.factory/demo.md`; live `/demo` cold check. |
| F-1-2 | Added 10 claims with one observable tagged test each, covering demo, privacy, persistence, offline, JSON, CSV, PDF, PWA, price, and self-reported status. | `.factory/claims.json`; `npm run test:claims` → 10/10 passed. |
| F-1-3 | Removed the unavailable Studio checkout, all paid-tier copy, billing requests, and license state; receipt identity is free. | `@claim:free-core`; source search finds no checkout/license control; live link crawl. |
| F-1-4 | Restored audience, job, constraints, scope, and leverage decisions. | `.factory/brief.json` parses as JSON and matches shipped features. |
| F-1-5 | Replaced the h1 and support line with the review’s job-led and audience-led wording. | `tests/app.spec.ts` first-screen assertion; `.factory/evidence/home-mobile.png`; live root check. |
| F-1-6 | Removed mobile rotation and constrained the paper layer inside the figure. | `fits a 390px viewport without horizontal overflow`; measured 390/390 on home and demo. |
| F-1-7 | Added one-year immutable caching for `/assets/*` in the host configuration. | `public/staticwebapp.config.json`; live hashed JS/CSS header checks. |
| F-1-8 | Added canonical/OG/Twitter metadata, social art, SVG/Apple icons, robots, sitemap, and a designed 404. | `serves route-specific titles, metadata, legal links, and a real 404`; live route/status crawl. |
| F-1-9 | Unified wordmark, Demo/Privacy nav, legal/footer links, factory credit, and build id; demo route focuses/announces its title and dialogs manage focus. | Route test; Playwright keyboard/dialog checks; live `/`, `/demo`, `/privacy/`, `/terms/`. |
| F-1-10 | Added CSP with header-only `frame-ancestors`, X-Frame-Options, Permissions-Policy, nosniff, referrer policy, and manifest MIME configuration. | `public/staticwebapp.config.json`; live response-header and manifest Content-Type checks. |
| F-1-11 | Replaced the nested timer `aside` with a labelled non-landmark container. | Full-impact Playwright axe scan: zero violations on home and demo. |
| F-1-12 | Replaced metaphor headings with “Create a weekly client receipt,” “Back up or restore your work sessions,” and literal section names. | `.factory/copy-audit.md`; screenshots; live copy check. |
| F-1-13 | Standardized saved entries as “work sessions”; reserved “weekly receipt” for the client PDF. | Terminology table in `.factory/copy-audit.md`; source/copy scan. |
| F-1-14 | Replaced “Add manually” with “Add a work session” and removed “Studio unlock” with the dead paid tier. | Browser role assertions; live control check. |
| F-1-15 | Split the README audience text into two short sentences. | `.factory/copy-audit.md`; README review. |
| F-1-16 | Replaced user-facing IndexedDB/PWA/slug jargon with browser, device, install, and offline wording; technical terms stay in developer sections. | README and legal copy review; `.factory/copy-audit.md`. |
| F-1-17 | Replaced “calm” and “humane” copy with an exact list of receipt contents. | Copy scan; `@claim:pdf-receipt`; live receipt section. |
| Verification defect 1 | Fixed 390 px horizontal overflow. | Mobile browser test and screenshot. |
| Verification defect 2 | Added immutable asset caching. | Host configuration and live cache header checks. |
| Verification hardening 1 | Removed the moderate complementary-landmark violation. | Full-impact axe results are empty. |

## Local evidence summary

- Unit: 7 passed.
- Claims: 10 passed.
- Browser: 32 passed, 2 intentional duplicate-project skips.
- Lighthouse: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO.
- Screenshots: `.factory/evidence/home-mobile.png`, `.factory/evidence/demo-mobile.png`, `.factory/evidence/home-desktop.png`.

## Live evidence summary

- Deployed repair commits: `fe60b4b` plus the final live-link repair `73df34d`.
- `/`, `/demo`, `/?demo=1`, `/privacy/`, `/terms/`, `/robots.txt`, and `/sitemap.xml`: expected content and status 200.
- `/not-a-real-page`: designed 404 content and HTTP 404.
- Demo: three sample sessions; visible banner; isolated database; reset passed; start-real restored the untouched real record; offline reload passed.
- Privacy: complete cold demo flow made zero cross-origin requests. Console errors: zero.
- Accessibility: axe violations at all impact levels: zero. Mobile width: `390/390`.
- Titles: root, Demo, Privacy, and Terms all matched their route-specific titles. `?demo=1` updated to `Demo — Work Receipt` after initialization.
- Headers: CSP/frame protection/Permissions-Policy present; manifest MIME is `application/manifest+json`; hashed JS/CSS are `public, max-age=31536000, immutable`.
- Link crawl: every root, Demo, Privacy, Terms, footer, and bundled sample-evidence link returns 200. The first deployment exposed two 404 placeholder evidence links; both were replaced and the product was redeployed before handoff.
- Artifact match: live JS SHA-256 `29b2ddfedb53193fe11d725100d9bc72ffe9b65e729290bd0a9d975ae0bc0050`; live CSS SHA-256 `d8e811f9d38ce8a1f2cfa2746a8bd5e9e4edf5c80684ccb770cba4d24f23fa32`; both equal local `dist/`.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.7 s, TBT 50 ms, CLS 0.003, TTI 1.7 s.
- Screenshots and verifier JSON: `.factory/evidence/live-home/` and `.factory/evidence/live-demo/`.
