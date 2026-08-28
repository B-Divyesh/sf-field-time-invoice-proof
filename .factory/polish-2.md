# Polish round 2 finding ledger

Candidate `702ae502641fac834497ee210566c15fabba48c0` was repaired against cumulative review commit `5d2e38a4c49933777ed97e3e360c9ef0ad643d2c`. Implementation commit: `1ac93b74ecffa9e9c5c42e0f139b8f5f73e5a578`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved `/demo`, made `/?demo=1` the first-screen one-click path, and fixed Start for real to wait for demo database deletion before navigation. | `@claim:demo-isolation`; [local demo screenshot](evidence/polish-2-local/demo-mobile.png); live `/?demo=1` isolation/reset/start-real cold check. |
| F-1-2 | Expanded the registry from 10 to 18 claims. Added manual/timed recording, session details, edit/delete, receipt settings, evidence non-fetch, site-data clearing, device access, and local-file tests. Strengthened privacy to allowlisted GETs with empty bodies. Inspected actual PDF text for outcomes, time, breaks, evidence, and disclaimer. | `.factory/claims.json`; `tests/claims.spec.ts`; clean-clone 18/18 aggregate pass and 18/18 commands passed separately. |
| F-1-3 | Kept the unavailable paid tier and checkout removed; every recording, receipt, PDF, import, and export control remains free. | `@claim:free-core`; live crawl found no checkout/license control or external payment request. |
| F-1-4 | Preserved the researched brief as the scope source. | `.factory/brief.json`; clean-clone JSON parse and scope review. |
| F-1-5 | Preserved the job-led h1, audience sentence, adjacent sample action/result, and three facts. | `creates, persists, and filters a manual session`; [local phone screenshot](evidence/polish-2-local/home-mobile.png); live cold read at 390px. |
| F-1-6 | Preserved the constrained mobile paper layer and added home plus demo 390px width assertions. | `fits home and demo in a 390px viewport without horizontal overflow`; live `390/390`; local home/demo screenshots. |
| F-1-7 | Preserved one-year immutable caching for hashed `/assets/*`. | Live `index-DljYdITD.js`: `Cache-Control: public, max-age=31536000, immutable`; live/local SHA-256 `457b2f…6564`. |
| F-1-8 | Completed canonical, description, OG, Twitter image, SVG favicon, and Apple icon metadata on Privacy, Terms, 404, Offline, and both sample evidence pages. Preserved discovery files and real 404 override. | `serves complete route-specific metadata and a configured real 404`; live seven-route metadata crawl; `/not-a-real-page` returned HTTP 404. |
| F-1-9 | Added the shared header, skip link, footer, legal links, version, route announcer, and h1 focus to Offline and all static pages. Added `pageshow` focus restoration for browser Back. | `focuses and announces route headings after forward and back navigation`; [live offline screenshot](evidence/polish-2-live/offline/screenshot-mobile.png); live home → Demo → Back and home → Privacy → Back passed. |
| F-1-10 | Removed the Offline inline style, moved it to self-hosted `legal.css`, and kept frame/CSP directives in response headers. | `loads every route without console errors or inline CSP styling`; live Offline console errors `[]`; live CSP, X-Frame-Options, Permissions-Policy, nosniff, and referrer headers present. |
| F-1-11 | Preserved the non-landmark timer container and expanded axe to every shipped HTML route. | `has no accessibility violations on every shipped HTML route`; local and live full-impact axe violations: 0. |
| F-1-12 | Preserved literal task/section headings and changed recovery headings to state their conditions. | `.factory/copy-audit.md`; live heading crawl; 404 says “Page not found,” Offline says “You are offline.” |
| F-1-13 | Preserved “work session” and “weekly receipt”; completed the remaining import and break terminology fixes. | Terminology table in `.factory/copy-audit.md`; source scan has no user-facing interruption/restore drift. |
| F-1-14 | Preserved result-naming actions and the removed paid control. | Browser role assertions; live control crawl. |
| F-1-15 | Preserved the split README audience copy; every audited sentence remains at most 22 words. | `.factory/copy-audit.md`; README word-count audit. |
| F-1-16 | Replaced the user-facing manifest/service-worker sentence with “Install the app and open saved work sessions offline after one visit.” | README copy audit; `@claim:installable-pwa`; `@claim:offline-reload`. |
| F-1-17 | Preserved exact PDF contents instead of mood adjectives. | `.factory/copy-audit.md`; `@claim:pdf-receipt`; live copy review. |
| F-2-1 | Added 44px inline-flex hit areas to mobile wordmarks, header/footer navigation, recovery links, and demo exit/reset links. | `gives mobile navigation, recovery, and demo-exit controls 44px targets`; live 390px bounding-box audit passed on six routes. |
| F-2-2 | Added the service-worker prerequisite to the first-screen fact. | Exact live copy: “After your first visit, saved work sessions open offline.”; `@claim:offline-reload`. |
| F-2-3 | Standardized backup ingestion as “import”; “restore” remains only for resetting demo sample data. | Source/copy scan; h2 is “Back up or import your work sessions”; README says “JSON backup and import.” |
| F-2-4 | Standardized the deduction as “break”: Break time, break excluded, Break minutes. Updated claims and PDF assertions. | `@claim:session-details`; `@claim:pdf-receipt`; source scan contains no user-facing interruption wording. |
| F-2-5 | Replaced metaphor recovery h1s with “Page not found” and “You are offline.” | Route test; [local offline screenshot](evidence/polish-2-local/offline-mobile.png); live `/not-a-real-page` and `/offline.html`. |
| Verification defect 1 | Kept the 390px overflow repair and tests it on home and demo. | Browser width test and live `390/390`. |
| Verification defect 2 | Kept immutable cache headers and verified them after deployment. | Live asset header and exact artifact hashes. |
| Verification hardening | Kept manifest MIME, CSP/frame/permissions headers, and zero-impact axe baseline. | Live headers; route-wide console/CSP test; local/live axe 0. |

## Final evidence

- Clean clone: commit `1ac93b74ecffa9e9c5c42e0f139b8f5f73e5a578`; `npm ci`, unit, build, full browser suite, aggregate claims, and every registry command passed.
- Local screenshots: `.factory/evidence/polish-2-local/`.
- Live verifier screenshots and JSON: `.factory/evidence/polish-2-live/home/`, `demo/`, and `offline/`.
- Live URL: `https://field-time-invoice-proof.sociobot.in/`; demo: `https://field-time-invoice-proof.sociobot.in/?demo=1`.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.7s, TBT 0ms, CLS 0.003.
- Known unresolved findings: none.
