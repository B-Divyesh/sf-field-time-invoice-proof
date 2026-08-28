# Review 1 handoff — FAIL

## What was done

Performed the requested independent, read-only adversarial review of the live site at desktop and 390 px mobile. No product code was changed. The full evidence and all findings are in `.factory/review-1.md`.

## Verification run

- Fresh Chromium cold loads at 390 × 844 and 1440 × 1000.
- Live demo probe: a normal saved record remained visible at `/?demo=1`; no demo banner/reset/start-for-real/sample data exists.
- Live route/link checks: `/`, `/privacy/`, and `/terms/` return 200; `/robots.txt` and `/sitemap.xml` return 404; `/404` returns the home app; Studio checkout returns 404.
- Live request-log probe: initial demo-query load made same-origin requests only.
- Live headers, document metadata, link census, mobile layout, and axe scan checked.
- Local clean dependency install and quality commands passed: `npm ci`, `npm test` (7/7), `npm run build`, and `npm run test:e2e` (10 passed).

## Known gaps / required next steps

The review is a FAIL. Blocking items are missing isolated demo/sample data, missing claims registry/tests, dead Studio checkout, absent scope brief, unclear first-screen job/audience copy, continuing 390 px overflow, and continuing short cache headers. Major route/metadata/security/footer/accessibility and copy findings also remain. See the review for exact evidence and fixes.
