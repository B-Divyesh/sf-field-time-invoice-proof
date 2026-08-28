# Work Receipt

Work Receipt is a private, offline-first field notebook for freelancers who need to explain billable work without surveillance. Record timed or manual sessions, describe outcomes and interruptions, attach optional evidence links, and generate a client-readable weekly PDF. AI-assisted work can be labelled openly without pretending that a timer independently verifies it.

All work records live in IndexedDB on the current device. There is no account, telemetry, screenshot capture, or activity inference. JSON backup/import and CSV export keep the data portable.

## Who it is for

Independent knowledge workers who bill hourly and want a humane attachment for invoices—especially when time includes prompting, review, waiting, and judgment that activity trackers represent poorly.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:4173`. The app installs as a PWA after its first successful load.

## Test and build

```bash
npm test
npm run build
npm run test:e2e
```

The exact production build command is `npm run build`. Static deployment output is written to `dist/`, with `dist/index.html` at its root. Preview it using `npm run preview`.

## Studio license configuration

The free tier includes core recording, weekly PDF generation, and all data exports. The one-time Studio unlock adds custom receipt identity. Production defaults to the registered slug and Sociobot API; factory builds can override these without changing source:

```bash
VITE_PRODUCT_SLUG=field-time-invoice-proof
VITE_BILLING_BASE=https://pilot-api.sociobot.in
```

No payment provider is embedded. Checkout and license verification use the Sociobot billing API.

## Privacy and limitations

Receipts are explicitly self-reported; they are not independent proof, invoices, or surveillance records. Clearing browser site data removes local records, so export backups regularly. See `/privacy/` and `/terms/` in the built app.

## Deployment

Deploy the contents of `dist/` as a static site. Configure clean directory URLs so `/privacy/` and `/terms/` resolve to their respective `index.html` files. No server or secret is required.

MIT licensed. The generated hero image provenance is documented in `.factory/design.md` and `assets/src/hero-notebook.json`.
