import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

async function closeDemoReceipt(page: import('@playwright/test').Page) {
  const dialog = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Close', exact: true }).click()
}

async function addSession(page: import('@playwright/test').Page, project: string, outcome: string) {
  await page.getByRole('button', { name: 'Add a work session', exact: true }).click()
  await page.getByLabel('Project *').fill(project)
  await page.getByLabel('Outcome for the client *').fill(outcome)
  await page.getByRole('button', { name: 'Save work session' }).click()
  await expect(page.getByText(outcome)).toBeVisible()
}

test('@claim:demo-isolation keeps sample work separate and resets it', async ({ page }) => {
  await page.goto('/')
  await addSession(page, 'Private client', 'A record that must not appear in demo')
  await page.getByRole('link', { name: 'Try it with sample data' }).click()
  await expect(page).toHaveURL(/\/demo$/)
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
})

test('@claim:local-privacy keeps the complete work-session flow same-origin', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto('/demo')
  await closeDemoReceipt(page)
  await addSession(page, 'Privacy check', 'Verified the local-only request boundary')
  await page.getByRole('button', { name: /Prepare weekly receipt/ }).click()
  await expect(page.getByRole('dialog', { name: 'Prepare weekly receipt' })).toBeVisible()
  const origin = new URL(page.url()).origin
  expect(requests.filter((url) => new URL(url).origin !== origin)).toEqual([])
})

test('@claim:session-persistence keeps a saved work session after reload', async ({ page }) => {
  await page.goto('/')
  await addSession(page, 'Northstar', 'Reviewed and shipped the onboarding copy')
  await page.reload()
  await expect(page.getByText('Reviewed and shipped the onboarding copy')).toBeVisible()
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

test('@claim:json-roundtrip exports and restores every work session', async ({ page }) => {
  await page.goto('/')
  await addSession(page, 'Redwood', 'Delivered the approved integration plan')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export backup (.json)' }).click()
  const download = await downloadEvent
  const path = await download.path()
  expect(path).not.toBeNull()
  const bundle = JSON.parse(await readFile(path!, 'utf8'))
  expect(bundle.sessions).toHaveLength(1)
  expect(bundle.sessions[0].outcome).toBe('Delivered the approved integration plan')
  page.once('dialog', (dialog) => dialog.accept())
  await page.locator('.delete-session').click()
  await expect(page.getByText('Delivered the approved integration plan')).toHaveCount(0)
  page.once('dialog', (dialog) => dialog.accept())
  await page.locator('#import-json').setInputFiles(path!)
  await expect(page.getByText('Delivered the approved integration plan')).toBeVisible()
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

test('@claim:pdf-receipt creates a receipt with the promised details', async ({ page }) => {
  await page.goto('/demo')
  const dialog = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  await expect(dialog.getByText('Mapped checkout errors and agreed on the revised purchase flow.')).toBeVisible()
  await expect(dialog.getByText(/15m break excluded/)).toBeVisible()
  await expect(dialog.getByText(/Evidence included/).first()).toBeVisible()
  const downloadEvent = page.waitForEvent('download')
  await dialog.getByRole('button', { name: 'Download PDF' }).click()
  const pdfDownload = await downloadEvent
  const pdf = await readFile((await pdfDownload.path())!)
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
  expect(pdf.byteLength).toBeGreaterThan(5_000)
})

test('@claim:installable-pwa exposes a valid manifest and controlling worker', async ({ page }) => {
  await page.goto('/')
  const manifest = await page.evaluate(async () => (await fetch('/manifest.webmanifest')).json())
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
  await expect(page.locator('a[href*="checkout"], button:has-text("license"), a:has-text("Buy")')).toHaveCount(0)
})

test('@claim:self-reported labels every weekly receipt honestly', async ({ page }) => {
  await page.goto('/demo')
  const dialog = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  await expect(dialog.getByText('SELF-REPORTED WORK RECEIPT')).toBeVisible()
  await expect(dialog.getByText(/not independent verification/i)).toBeVisible()
})
