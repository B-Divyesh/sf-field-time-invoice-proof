# Work Receipt

Turn freelance work sessions into a private weekly client receipt.

For independent hourly workers who need to explain billable time. Use it when review, waiting, and judgment do not show in an activity tracker.

Record timed or manual work sessions. Add outcomes, breaks, optional evidence links, and an AI-assisted label. Create a weekly PDF that stays clear about being self-reported.

Your records stay in this browser on this device. The app sends no work-session data, analytics, or tracking requests. Saved work sessions open offline after the first visit.

## Try the sample

Open `http://localhost:4173/demo` after starting the app. The live demo is at [field-time-invoice-proof.sociobot.in/demo](https://field-time-invoice-proof.sociobot.in/demo).

The demo starts with three work sessions and an open weekly receipt. Its database is separate from your real records. Use **Reset demo** to restore the sample or **Start for real** to discard it.

## What it includes

- A timer and manual entry for work sessions.
- A self-reported weekly receipt and PDF download.
- JSON backup and import.
- CSV export with one row per work session.
- Receipt name, client, and closing-note settings.
- Install the app and open saved work sessions offline after one visit.

Recording, receipt details, PDFs, backup, import, and CSV export are free. There is no paid tier or embedded payment provider.

## Run locally

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:4173`.

## Test and build

```bash
npm test
npm run test:claims
npm run build
npm run test:e2e
```

Claim checks are listed in `.factory/claims.json`. Each has one tagged browser test. The production build is written to `dist/`.

## Privacy and limits

Work Receipt does not request screen, camera, microphone, or location access. It does not provide independent proof. Evidence links are stored as text and open only when selected.

Export a JSON backup before clearing browser data or moving devices. See the built app’s `/privacy/` and `/terms/` pages.

## Deploy

Run `npm run build`, then deploy the contents of `dist/` as a static site. `staticwebapp.config.json` supplies routes, security headers, MIME types, immutable asset caching, and the 404 response.

The project is MIT licensed. Image provenance is documented in `.factory/design.md` and `assets/src/hero-notebook.json`.
