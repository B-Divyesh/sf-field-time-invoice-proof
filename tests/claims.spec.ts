import { expect, test, type Page, type Request } from '@playwright/test'
import { readFile } from 'node:fs/promises'

async function closeDemoReceipt(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Close', exact: true }).click()
}

async function addSession(page: Page, project: string, outcome: string, options: { breakMinutes?: number; evidence?: string; ai?: boolean } = {}) {
  await page.getByRole('button', { name: 'Add a work session', exact: true }).click()
  await page.getByLabel('Project *').fill(project)
  await page.getByLabel('Outcome for the client *').fill(outcome)
  if (options.breakMinutes) await page.getByLabel('Break time').fill(String(options.breakMinutes))
  if (options.evidence) await page.getByLabel('Evidence link', { exact: false }).last().fill(options.evidence)
  if (options.ai) await page.getByLabel('AI-assisted work').check()
  await page.getByRole('button', { name: 'Save work session' }).click()
  await expect(page.getByText(outcome)).toBeVisible()
}

const requestRecord = (request: Request) => ({ url: request.url(), method: request.method(), body: request.postData() })

function expectOnlyProductGets(requests: ReturnType<typeof requestRecord>[], origin: string) {
  const allowedPath = /^(?:\/$|\/demo$|\/index\.html$|\/404\.html$|\/sw\.js$|\/manifest\.webmanifest$|\/offline\.html$|\/legal\.css$|\/route-focus\.js$|\/assets\/|\/icons\/|\/privacy\/?$|\/terms\/?$|\/sample-evidence\/)/
  expect(requests.filter((request) => {
    const url = new URL(request.url)
    return url.origin !== origin || request.method !== 'GET' || request.body !== null || !allowedPath.test(url.pathname)
  })).toEqual([])
}

function extractPdfText(pdf: Buffer): string {
  return [...pdf.toString('latin1').matchAll(/\(([^()]*)\)\s*Tj/g)].map((match) => match[1]).join(' ')
}

test('@claim:demo-isolation keeps sample work separate and resets or discards it', async ({ page }) => {
  await page.goto('/')
  await addSession(page, 'Private client', 'A record that must not appear in demo')
  await page.getByRole('link', { name: 'Try it with sample data' }).click()
  await expect(page).toHaveURL(/\?demo=1$/)
  await expect(page.locator('.dialog-demo-banner').getByText('Demo — sample data, nothing is saved')).toBeVisible()
  await closeDemoReceipt(page)
  await expect(page.getByText('A record that must not appear in demo')).toHaveCount(0)
  await expect(page.locator('.session-entry')).toHaveCount(3)
  await addSession(page, 'Demo mutation', 'Temporary sample-only work')
  await expect(page.locator('.session-entry')).toHaveCount(4)
  await page.getByRole('button', { name: 'Reset demo' }).click()
  await closeDemoReceipt(page)
  await expect(page.getByText('Temporary sample-only work')).toHaveCount(0)
  await expect(page.locator('.session-entry')).toHaveCount(3)
  await page.getByRole('link', { name: 'Start for real' }).click()
  await expect(page).toHaveURL('/')
  await expect(page.getByText('A record that must not appear in demo')).toBeVisible()
  expect(await page.evaluate(() => indexedDB.databases().then((items) => items.map((item) => item.name)))).not.toContain('demo:work-receipt')
})

test('@claim:local-privacy permits only allowlisted same-origin GET requests', async ({ page, context }) => {
  const requests: ReturnType<typeof requestRecord>[] = []
  context.on('request', (request) => requests.push(requestRecord(request)))
  await page.goto('/demo')
  await closeDemoReceipt(page)
  await addSession(page, 'Privacy check', 'Verified the local request boundary', { evidence: 'https://evidence.invalid/private-proof' })
  await page.getByRole('button', { name: /Prepare weekly receipt/ }).click()
  await expect(page.getByRole('dialog', { name: 'Prepare weekly receipt' })).toBeVisible()
  expect(requests.some((request) => request.url.includes('evidence.invalid'))).toBe(false)
  expectOnlyProductGets(requests, new URL(page.url()).origin)
})

test('@claim:no-device-capture never requests sensitive device access', async ({ page }) => {
  await page.addInitScript(() => {
    const calls: string[] = []
    Object.defineProperty(window, '__sensitiveCalls', { value: calls })
    const originalListener = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) {
      if ((this === window || this === document) && ['keydown', 'keyup', 'mousemove', 'pointermove'].includes(type)) calls.push(`activity:${type}`)
      return originalListener.call(this, type, listener, options)
    }
    if (navigator.mediaDevices) {
      Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, value: () => { calls.push('media'); throw new Error('blocked') } })
      Object.defineProperty(navigator.mediaDevices, 'getDisplayMedia', { configurable: true, value: () => { calls.push('screen'); throw new Error('blocked') } })
    }
    Object.defineProperty(navigator.geolocation, 'getCurrentPosition', { configurable: true, value: () => calls.push('location') })
    Object.defineProperty(navigator.geolocation, 'watchPosition', { configurable: true, value: () => { calls.push('location-watch'); return 1 } })
  })
  await page.goto('/')
  await addSession(page, 'Permission check', 'Saved without device capture')
  await page.getByLabel('Project', { exact: true }).fill('Timed permission check')
  await page.getByLabel('Working toward').fill('Recorded a timer without capture')
  await page.getByRole('button', { name: 'Start work session' }).click()
  await page.getByRole('button', { name: 'Stop & save' }).click()
  expect(await page.evaluate(() => (window as unknown as { __sensitiveCalls: string[] }).__sensitiveCalls)).toEqual([])
})

test('@claim:session-recording saves manual and timed work sessions', async ({ page }) => {
  await page.goto('/')
  await addSession(page, 'Manual project', 'Saved a completed manual session')
  await page.getByLabel('Project', { exact: true }).fill('Timed project')
  await page.getByLabel('Working toward').fill('Saved a timed session')
  await page.getByRole('button', { name: 'Start work session' }).click()
  await page.reload()
  await expect(page.getByText('Recording a self-reported session')).toBeVisible()
  await page.getByRole('button', { name: 'Stop & save' }).click()
  await expect(page.getByText('Saved a completed manual session')).toBeVisible()
  await expect(page.getByText('Saved a timed session')).toBeVisible()
  await expect(page.locator('.session-entry')).toHaveCount(2)
})

test('@claim:session-details records outcome, break, evidence, and AI label', async ({ page }) => {
  await page.goto('/')
  await addSession(page, 'Detailed project', 'Prepared the signed release plan', { breakMinutes: 15, evidence: 'https://example.com/release-plan', ai: true })
  const entry = page.locator('.session-entry')
  await expect(entry.getByText('Prepared the signed release plan')).toBeVisible()
  await expect(entry.getByText('Break: 15m')).toBeVisible()
  await expect(entry.getByText(/AI-assisted/)).toBeVisible()
  await expect(entry.getByRole('link', { name: /Open evidence/ })).toHaveAttribute('href', 'https://example.com/release-plan')
  await page.getByRole('button', { name: /Prepare weekly receipt/ }).click()
  const dialog = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  await expect(dialog.getByText(/15m break excluded/)).toBeVisible()
  await expect(dialog.getByText(/Evidence included/)).toBeVisible()
  await expect(dialog.getByText(/AI-assisted/)).toBeVisible()
})

test('@claim:session-management edits and deletes a saved work session', async ({ page }) => {
  await page.goto('/')
  await addSession(page, 'Editable project', 'First outcome')
  await page.getByRole('button', { name: 'Edit Editable project session' }).click()
  await page.getByLabel('Outcome for the client *').fill('Updated outcome')
  await page.getByRole('button', { name: 'Save work session' }).click()
  await expect(page.getByText('Updated outcome')).toBeVisible()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Delete Editable project session' }).click()
  await expect(page.getByText('Updated outcome')).toHaveCount(0)
})

test('@claim:session-persistence keeps a saved work session after reload', async ({ page }) => {
  await page.goto('/')
  await addSession(page, 'Northstar', 'Reviewed and shipped the onboarding copy')
  await page.reload()
  await expect(page.getByText('Reviewed and shipped the onboarding copy')).toBeVisible()
})

test('@claim:evidence-control fetches evidence only after the worker selects it', async ({ page, context }) => {
  const evidenceUrl = 'https://evidence.invalid/private-proof'
  const evidenceRequests: string[] = []
  context.on('request', (request) => { if (request.url() === evidenceUrl) evidenceRequests.push(request.url()) })
  await context.route('https://evidence.invalid/**', (route) => route.fulfill({ contentType: 'text/html', body: '<title>Selected evidence</title>' }))
  await page.goto('/')
  await addSession(page, 'Evidence project', 'Linked the approved decision', { evidence: evidenceUrl })
  expect(evidenceRequests).toEqual([])
  const popupPromise = page.waitForEvent('popup')
  await page.getByRole('link', { name: /Open evidence/ }).click()
  const popup = await popupPromise
  await popup.waitForLoadState()
  expect(evidenceRequests).toEqual([evidenceUrl])
  await popup.close()
})

test('@claim:receipt-settings saves and applies receipt identity, client, and note', async ({ page }) => {
  await page.goto('/demo')
  const receipt = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  await receipt.getByRole('button', { name: 'Edit receipt details' }).click()
  const settings = page.getByRole('dialog', { name: 'Receipt identity' })
  await settings.getByLabel('Your name').fill('Mira Chen')
  await settings.getByLabel('Business or studio').fill('Mira Chen Studio')
  await settings.getByLabel('Default client').fill('Northwind Partners')
  await settings.getByLabel('Receipt note').fill('Prepared from my work-session notes and reviewed before sharing.')
  await settings.getByRole('button', { name: 'Save identity' }).click()
  await expect(receipt.getByText('Mira Chen Studio')).toBeVisible()
  await expect(receipt.getByText('Mira Chen', { exact: true })).toBeVisible()
  await expect(receipt.getByText('Northwind Partners')).toBeVisible()
  await expect(receipt.getByText('Prepared from my work-session notes and reviewed before sharing.')).toBeVisible()
  await page.reload()
  const reloaded = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  await expect(reloaded.getByText('Mira Chen Studio')).toBeVisible()
  await expect(reloaded.getByText('Northwind Partners')).toBeVisible()
})

test('@claim:site-data-removal clears saved sessions and receipt settings', async ({ page }) => {
  await page.goto('/')
  await addSession(page, 'Disposable project', 'This record is removed with site data')
  await page.getByRole('button', { name: /Prepare weekly receipt/ }).click()
  await page.getByRole('button', { name: 'Edit receipt details' }).click()
  await page.getByLabel('Your name').fill('Disposable name')
  await page.getByRole('button', { name: 'Save identity' }).click()
  const session = await page.context().newCDPSession(page)
  await session.send('Storage.clearDataForOrigin', { origin: new URL(page.url()).origin, storageTypes: 'all' })
  await page.reload()
  await expect(page.getByText('This record is removed with site data')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Add your first work session' })).toBeVisible()
  await page.getByRole('button', { name: /Prepare weekly receipt/ }).click()
  await page.getByRole('button', { name: 'Edit receipt details' }).click()
  await expect(page.getByLabel('Your name')).toHaveValue('')
})

test('@claim:offline-reload opens demo work sessions without a network', async ({ page, context }) => {
  await page.goto('/demo')
  await closeDemoReceipt(page)
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null)
  await context.setOffline(true)
  await page.reload()
  await expect(page.locator('#session-list').getByText('Mapped checkout errors and agreed on the revised purchase flow.')).toBeVisible()
  await expect(page.getByText(/Offline · saving on this device/)).toBeVisible()
})

test('@claim:json-roundtrip exports and imports every work session', async ({ page }) => {
  await page.goto('/')
  await addSession(page, 'Redwood', 'Delivered the approved integration plan')
  await addSession(page, 'Bluebird', 'Reviewed the launch checklist')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export backup (.json)' }).click()
  const path = await (await downloadEvent).path()
  expect(path).not.toBeNull()
  const bundle = JSON.parse(await readFile(path!, 'utf8'))
  expect(bundle.sessions).toHaveLength(2)
  expect(bundle.sessions.map((item: { outcome: string }) => item.outcome).sort()).toEqual(['Delivered the approved integration plan', 'Reviewed the launch checklist'])
  for (let index = 0; index < 2; index++) {
    page.once('dialog', (dialog) => dialog.accept())
    await page.locator('.delete-session').first().click()
  }
  await expect(page.locator('.session-entry')).toHaveCount(0)
  page.once('dialog', (dialog) => dialog.accept())
  await page.locator('#import-json').setInputFiles(path!)
  await expect(page.locator('.session-entry')).toHaveCount(2)
})

test('@claim:csv-export writes one row per demo work session', async ({ page }) => {
  await page.goto('/demo')
  await closeDemoReceipt(page)
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export work sessions (.csv)' }).click()
  const path = await (await downloadEvent).path()
  const csv = await readFile(path!, 'utf8')
  const rows = csv.trim().split(/\r?\n/)
  expect(rows).toHaveLength(4)
  expect(rows[0]).toContain('"Project","Outcome"')
  expect(csv).toContain('"Northwind website"')
  expect(csv).toContain('"Harbor research"')
})

test('@claim:pdf-receipt proves promised details inside the downloaded PDF', async ({ page }) => {
  await page.goto('/demo')
  const dialog = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  const downloadEvent = page.waitForEvent('download')
  await dialog.getByRole('button', { name: 'Download PDF' }).click()
  const pdf = await readFile((await (await downloadEvent).path())!)
  const pdfText = extractPdfText(pdf)
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
  expect(pdfText).toContain('Mapped checkout errors and agreed on the revised purchase flow.')
  expect(pdfText).toContain('2h')
  expect(pdfText).toContain('15m break excluded')
  expect(pdfText).toContain('Evidence link')
})

test('@claim:local-file-creation creates PDF, JSON, and CSV without uploading records', async ({ page, context }) => {
  const requests: ReturnType<typeof requestRecord>[] = []
  context.on('request', (request) => requests.push(requestRecord(request)))
  await page.goto('/demo')
  const pdfEvent = page.waitForEvent('download')
  await page.getByRole('dialog', { name: 'Prepare weekly receipt' }).getByRole('button', { name: 'Download PDF' }).click()
  const pdf = await pdfEvent
  await closeDemoReceipt(page)
  const jsonEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export backup (.json)' }).click()
  const json = await jsonEvent
  const csvEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export work sessions (.csv)' }).click()
  const csv = await csvEvent
  expect((await readFile((await pdf.path())!)).byteLength).toBeGreaterThan(5_000)
  expect(JSON.parse(await readFile((await json.path())!, 'utf8')).sessions).toHaveLength(3)
  expect((await readFile((await csv.path())!, 'utf8')).trim().split(/\r?\n/)).toHaveLength(4)
  expectOnlyProductGets(requests, new URL(page.url()).origin)
})

test('@claim:installable-pwa exposes a valid manifest and controlling worker', async ({ page }) => {
  await page.goto('/')
  const manifest = await page.evaluate(async () => (await fetch('/manifest.webmanifest')).json())
  expect(manifest.name).toContain('Work Receipt')
  expect(manifest.display).toBe('standalone')
  expect(manifest.icons.some((icon: { sizes: string }) => icon.sizes === '192x192')).toBe(true)
  expect(manifest.icons.some((icon: { sizes: string; purpose?: string }) => icon.sizes === '512x512' && icon.purpose === 'maskable')).toBe(true)
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null)
})

test('@claim:free-core has no paywall on recording, receipts, or exports', async ({ page }) => {
  await page.goto('/demo')
  const dialog = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  await expect(dialog.getByRole('button', { name: 'Download PDF' })).toBeEnabled()
  await expect(dialog.getByRole('button', { name: 'Edit receipt details' })).toBeEnabled()
  await dialog.getByRole('button', { name: 'Close', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Add a work session' })).toBeEnabled()
  await expect(page.getByRole('button', { name: 'Export backup (.json)' })).toBeEnabled()
  await expect(page.getByRole('button', { name: 'Export work sessions (.csv)' })).toBeEnabled()
  await expect(page.locator('a[href*="/api/v1/products/"][href*="/checkout"], button:has-text("license"), a:has-text("Buy")')).toHaveCount(0)
})

test('@claim:self-reported labels the preview and downloaded PDF honestly', async ({ page }) => {
  await page.goto('/demo')
  const dialog = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  await expect(dialog.getByText('SELF-REPORTED WORK RECEIPT')).toBeVisible()
  await expect(dialog.getByText(/not independent verification/i)).toBeVisible()
  const downloadEvent = page.waitForEvent('download')
  await dialog.getByRole('button', { name: 'Download PDF' }).click()
  const pdfText = extractPdfText(await readFile((await (await downloadEvent).path())!))
  expect(pdfText).toContain('SELF-REPORTED WORK RECORD')
  expect(pdfText).toContain('not independent verification')
})
