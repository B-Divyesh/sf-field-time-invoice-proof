# Work Receipt adversarial review 2 handoff

## What was done

- Reviewed the deployed product cold at 390 × 844 and 1440 × 1000.
- Audited landing and README copy, the one-click demo, storage isolation/reset, live offline behavior, request traffic, registered claims, every earlier finding, route metadata/shell/focus, links, accessibility, mobile targets, and visual identity.
- Wrote `.factory/review-2.md` with a **FAIL** verdict, five blocking findings, one major finding, and four minor findings.
- Did not modify product code.

## Verification

Clean clone at `702ae502641fac834497ee210566c15fabba48c0`:

```bash
npm ci
npm test
npm run build
npm run test:e2e
npm run test:claims -- --grep @claim:<id>  # run separately for all 10 ids
```

Results:

- Unit: 7/7 passed.
- Build: passed and produced `dist/`.
- Browser: 32 passed, 2 intentional duplicate-project skips.
- Registered claims: all 10 commands passed individually.
- Live root verifier and full-impact axe checks passed.
- Live demo isolation, reset, start-real, same-origin request log, and offline reload passed.
- Live hashed JS/CSS match the clean build.

## Findings left for the repair round

- **Blocking:** F-1-2 incomplete/insufficient claims coverage; F-1-8 incomplete route metadata; F-1-9 incomplete shared shell and back-navigation focus; F-1-10 offline-page CSP error; F-1-16 README implementation jargon.
- **Major:** F-2-1 sub-44 px mobile navigation and demo-exit targets.
- **Minor:** F-2-2 missing first-visit offline qualifier; F-2-3 restore/import drift; F-2-4 break/interruption drift; F-2-5 metaphor recovery headings.

See `.factory/review-2.md` for exact quotes, live evidence, word counts, and required fixes.
