# Independent verification — FAIL

**Candidate:** `4716d10191c65df5ebc2a0275179036fc274c341`  
**Verified:** 2026-08-28  
**Production URL:** https://field-time-invoice-proof.sociobot.in/  
**Verdict:** **FAIL** — two medium-severity acceptance defects remain in the deployed candidate.

## Reproduction and quality gates

Started from a clean, detached-dependency checkout at the candidate SHA.

| Check | Result | Evidence |
| --- | --- | --- |
| Install | PASS | `npm ci`: 87 packages installed; `npm audit`: 0 vulnerabilities. |
| Unit tests | PASS | `npm test`: 7/7 Vitest tests passed. |
| Type check / exact production build | PASS | `npm run build` (`tsc && vite build`) completed and emitted `dist/`. No separate lint or type-check script exists. |
| Repository browser suite | PASS | `npm run test:e2e`: 10 tests run; 9 passed and 1 expected duplicate axe scan skipped. `.last-run.json` reports `passed`. |
| Bundle budgets | PASS | Entry JS 125.29 KB raw / 41.84 KB gzip; entry CSS 17.45 KB raw / 4.79 KB gzip. The PDF chunks are lazy loaded. |
| Lighthouse mobile | PASS | Performance 99, Accessibility 100, Best Practices 100, SEO 92; FCP 1.1 s, LCP 1.9 s, TBT 0 ms, CLS 0.002. |

## Product and PWA exercise

On Chromium desktop and a 390 × 844 mobile viewport, independently exercised:

- empty state; manual self-reported session with project, outcome, AI flag, valid HTTPS evidence, interruption deduction, edit, persistence, filter, weekly receipt and PDF download;
- invalid recovery paths: interruption equal to session duration returns “Break time must be shorter than the session”; `ftp:` evidence returns “Evidence must be a valid http or https link”; malformed import returns “That file is not a valid Work Receipt backup”;
- JSON and CSV exports produce dated downloads; delete confirmation preserves the entry when dismissed;
- timer survives refresh and saves; saved record appears after the async IndexedDB refresh;
- keyboard skip link, Tab navigation, Enter activation and a visible 3px focus outline; reduced-motion disables the recording animation;
- serious/critical axe findings: **0**. Axe does report one moderate `landmark-complementary-is-top-level` finding for the nested timer `<aside>`.

PWA checks passed locally and on production: manifest installability reported no Chrome `Page.getInstallabilityErrors`; service worker `work-receipt-shell-v3` was active and cached the shell, entry JS/CSS, legal pages and hero assets; an offline reload after a controlled online first load showed the app and “Offline · saving on this device”. The source implements versioned cache names, `skipWaiting`, `clientsClaim`, and the update-available toast listener. A genuine changed-worker deployment could not be induced without changing the candidate, so the toast was code-inspected rather than triggered against a replacement artifact.

## Privacy, network, deployment, and headers

- A normal first load made no external request: only same-origin shell/assets were requested. Evidence links were not fetched. A routed license-return test made only `GET https://api.sociobot.in/api/v1/products/field-time-invoice-proof/verify?license=qa-token`; no work-record content was sent, and the token was stripped from the URL and retained locally.
- No console errors or page errors occurred on local desktop/mobile or live mobile loads. Local storage is IndexedDB/localStorage/cache based as described by the product.
- Production matches the candidate: the live `index-CsiWh28F.js` SHA-256 is `55f32389079e65b91ade0aafc745d5f38756dd2f95695c23b2065951ca7d642f` and `index-C2Q7du00.css` SHA-256 is `aeaf44d8c51c07f26432fc1b47db6bd507dfa41bb91ef8b54f681333540ce80f`, identical to `dist/`; live `sw.js` and `manifest.webmanifest` also match source bytes.
- Live headers include HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`. They lack CSP, frame-ancestors/X-Frame-Options, Permissions-Policy, and immutable caching for hashed files. The live manifest is sent as `application/octet-stream`, though Chrome reported it installable.

## Defects

### Medium

1. **390px mobile layout horizontally overflows.** At both `http://127.0.0.1:4174/` and the production URL, `document.documentElement.scrollWidth` is **402** while `clientWidth` is **390**. The rotated `.hero-figure::before` paper layer extends beyond the viewport. This contradicts the required intentional mobile layout/no horizontal clipping and the prior handoff’s claim of no clipping.
2. **Production does not give hashed static assets immutable caching.** The deployed entry JS and CSS both return `Cache-Control: public, must-revalidate, max-age=30`, despite content-hashed filenames. The PWA cache mitigates repeat app loads, but this fails the stated long-lived immutable hashed-asset caching requirement and needlessly forces revalidation.

### Low / hardening

1. **One axe moderate landmark issue:** `landmark-complementary-is-top-level` on the nested timer `<aside>`; no serious or critical findings.
2. **Browser policy hardening is incomplete:** no CSP/frame protection/Permissions-Policy, and `manifest.webmanifest` has `application/octet-stream` rather than a manifest MIME type. Installability currently succeeds, so this is not a release blocker by itself.

## Recommended next verification

Fix the hero backdrop overflow at 390px and set immutable caching for content-hashed assets in the deployment configuration. Then re-run this report’s local and live checks, including a new service-worker artifact update to observe the update toast.
