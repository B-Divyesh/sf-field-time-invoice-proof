# Work Receipt polish round 1 handoff

## What changed

- Replaced the slogan-led first screen with the job-led headline “Turn freelance time into a client receipt,” a named audience, one-click demo action, next-step text, and three plain facts.
- Added a real `/demo` and `?demo=1` sandbox. It uses `demo:work-receipt`, seeds three current-week sessions, opens a receipt, shows persistent demo controls, resets independently, and deletes demo data before real use.
- Added `.factory/claims.json` with 10 observable claims and exactly one tagged Playwright test for each claim.
- Removed the unavailable Studio checkout and made receipt identity free. The product contains no checkout link, billing request, license state, or paid-tier promise.
- Added route-specific titles and canonical metadata, Open Graph/Twitter data, a 1200×630 social image, SVG and Apple icons, robots, sitemap, consistent legal shells, and a product-styled 404.
- Added Azure Static Web Apps routing, CSP and frame protection, Permissions-Policy, manifest MIME type, and immutable caching for built assets.
- Fixed the 390 px overflow and the nested complementary landmark. Axe now reports zero violations at every impact level.
- Rewrote headings, buttons, empty states, README, Privacy, and Terms around the single term “work session.”
- Restored the researched scope in `.factory/brief.json`; added demo, copy-audit, catalog, and finding-ledger documents.

## Verification

Run from the repository root:

```bash
npm ci
npm test
npm run test:claims
npm run build
npm run test:e2e
```

Local results on 2026-08-28:

- `npm test`: 7/7 unit tests passed.
- `npm run test:claims`: 10/10 claim tests passed from clean browser contexts.
- `npm run test:e2e`: 32 passed across desktop and 390×844 mobile; 2 duplicate project checks intentionally skipped.
- Playwright axe: zero violations on home and demo at desktop and mobile sizes.
- `/opt/fleet/lib/verify-url.sh`: no console errors; title and `lang` present; one h1; main present; no missing alt or unlabeled buttons.
- Mobile width: `scrollWidth=390`, `clientWidth=390` on home and demo.
- Installability: Chrome `Page.getInstallabilityErrors` returned `[]`.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 2.0 s, TBT 70 ms, CLS 0.003, TTI 2.0 s.
- Initial build assets: JS 126.08 KB raw / 41.77 KB gzip; CSS 18.95 KB raw / 5.03 KB gzip. PDF code remains lazy-loaded.
- Screenshots: `.factory/evidence/home-mobile.png`, `.factory/evidence/demo-mobile.png`, and `.factory/evidence/home-desktop.png`.

## Deployment and live verification

Production URL: `https://field-time-invoice-proof.sociobot.in`.

- Repair commits through `73df34d` were pushed to `origin/main` and deployed through `/opt/fleet/lib/deploy-static.sh field-time-invoice-proof dist`.
- A new clone of that remote commit passed `npm ci`, unit tests, build, each of the 10 claim commands separately, and the complete browser suite.
- Cold Chromium verified `/`, `/demo`, and `/?demo=1`. Demo isolation, reset, start-real, offline reload, titles, route announcement, and 390/390 mobile width passed.
- Cold request logging found no third-party request. Console and page errors were empty. Full-impact axe violations were empty.
- `/`, `/demo`, `/privacy/`, `/terms/`, `/robots.txt`, and `/sitemap.xml` return 200. An unknown URL returns the designed page with status 404.
- The manifest returns `application/manifest+json`. Root responses include CSP with `frame-ancestors 'none'`, Permissions-Policy, X-Frame-Options, nosniff, and referrer policy.
- Live hashed JS and CSS return `Cache-Control: public, max-age=31536000, immutable` and match local `dist/` SHA-256 hashes.
- The post-deploy crawl found two dead placeholder evidence links. They were replaced with bundled sample evidence pages, then the app was rebuilt and redeployed. The final demo crawl returns 200 for every link.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s, TBT 50 ms, CLS 0.003, TTI 1.7 s.
- Live evidence is under `.factory/evidence/live-home/`, `.factory/evidence/live-demo/`, and `.factory/evidence/lighthouse-live.json`.

## Known gaps and next steps

None. Runtime AI and cloud sync remain intentionally out of scope because they would weaken the local-only, self-reported job described in the brief.
