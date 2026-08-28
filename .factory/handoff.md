# Work Receipt polish round 2 handoff

## Outcome

All cumulative findings in reviews 1 and 2 are resolved. The deployed PWA keeps its handwritten field-notebook identity and now has complete claims, routing, metadata, focus, recovery, mobile, privacy, and offline evidence.

## What changed

- Made `/?demo=1` the visible one-click sample path while preserving `/demo`; demo data stays in `demo:work-receipt` and Start for real waits for deletion.
- Expanded `.factory/claims.json` to 18 claims with exactly one tagged observable test each.
- Added tests for both recording paths, optional session details, edit/delete, receipt settings, evidence non-fetch, browser-data clearing, device access, and local file creation.
- Strengthened privacy tests to reject non-allowlisted URLs, non-GET methods, request bodies, analytics, tracking, and premature evidence fetches.
- Strengthened PDF tests to inspect the downloaded file for the outcome, billable duration, excluded break, evidence label, and self-reported disclaimer.
- Completed metadata on every shipped HTML route and added the shared shell plus h1 focus/announcement behavior to recovery and evidence pages.
- Removed Offline’s inline CSP violation and changed recovery h1s to “Page not found” and “You are offline.”
- Raised all reviewed phone navigation/recovery/demo controls to at least 44×44px.
- Added the first-visit offline qualifier and standardized “import” and “break” terminology.
- Applied saved name, business, client, and closing-note settings to the open and reloaded receipt.
- Updated catalog copy, copy audit, demo documentation, version to 1.2.0, and the service-worker cache to v6.

## Exact verification

Implementation commit: `1ac93b74ecffa9e9c5c42e0f139b8f5f73e5a578`.

Clean no-local clone at that commit:

```bash
npm ci
npm test
npm run build
npm run test:e2e
npm run test:claims -- --grep @claim:<id>  # each of 18 ids run separately
```

Results:

- Install: 87 packages, 0 vulnerabilities.
- Unit: 7/7 passed.
- Build: passed; `dist/index.html` present.
- Full browser suite: 53 passed, 5 intentional duplicate-project skips.
- Aggregate claims: 18/18 passed.
- Individual clean-clone claim commands: 18/18 passed separately.
- Route-wide full-impact axe: 0 violations on Home, Demo, Privacy, Terms, 404, Offline, and both evidence pages.
- Console/CSP route scan: 0 errors and no inline style blocks/attributes.
- Link crawl: every product link returned below 400.
- Offline: controlled demo reload preserved sample sessions and showed the offline state.
- Privacy: only allowlisted same-origin GET requests with empty bodies; no evidence request before selection.
- Mobile: root and demo `390/390`; all reviewed targets at least 44×44px.
- Entry budget: JS 127.05KB raw / 42.00KB gzip; CSS 19.43KB raw / 5.10KB gzip; mobile hero 33.14KB.
- Local Lighthouse: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 2.0s, TBT 0ms, CLS 0.003.

## Deployment and live checks

- Deployment: Azure Static Web Apps production, deployment id `896bf6a3-1519-4218-a914-904da682eee4`.
- Live: `https://field-time-invoice-proof.sociobot.in/`.
- Demo: `https://field-time-invoice-proof.sociobot.in/?demo=1`.
- Cold live verifier: Home, Demo, and Offline each have one h1/main, valid lang/title/alt text, and zero console errors.
- Cold live product flow: real record → demo isolation → demo mutation → Reset demo → Start for real → untouched real record passed.
- Cold live offline reload, seven-route metadata/axe scan, browser Back focus, six-route 44px audit, and real HTTP 404 all passed.
- Live headers: CSP, frame denial, Permissions-Policy, nosniff, strict referrer policy, manifest MIME, and immutable hashed-asset caching all present.
- Live/local artifact hashes match: JS `457b2f298805ed769f416d90b64d37ab2b2c80b821b28f05ccfa149184156564`; CSS `16cf8cb9a381ec5db505f725de1c294f896c74c8f2b808b6bfb72d51ddd80e49`.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.7s, TBT 0ms, CLS 0.003.
- Evidence: `.factory/evidence/polish-2-local/` and `.factory/evidence/polish-2-live/`.

## Known gaps and next steps

None within the brief or cumulative review findings. Deployment remains the factory’s responsibility; no infrastructure, DNS, billing, analytics, or runtime AI was added.
