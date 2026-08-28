import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => { await page.goto('/') })

test('creates, persists, and filters a manual session', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Turn freelance time into a client receipt')
  await page.getByRole('button', { name: 'Add a work session', exact: true }).click()
  await page.getByLabel('Project *').fill('Northstar')
  await page.getByLabel('Outcome for the client *').fill('Reviewed and shipped the onboarding copy')
  await page.getByLabel('AI-assisted work').check()
  await page.getByRole('button', { name: 'Save work session' }).click()
  await expect(page.getByText('Reviewed and shipped the onboarding copy')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Reviewed and shipped the onboarding copy')).toBeVisible()
  await page.getByLabel('Filter work sessions').selectOption('Northstar')
  await expect(page.getByText('AI-assisted', { exact: true })).toBeVisible()
})

test('prepares and downloads a weekly PDF receipt without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.getByRole('button', { name: 'Add a work session', exact: true }).click()
  await page.getByLabel('Project *').fill('Redwood')
  await page.getByLabel('Outcome for the client *').fill('Delivered the approved integration plan')
  await page.getByRole('button', { name: 'Save work session' }).click()
  await page.getByRole('button', { name: /Prepare weekly receipt/ }).click()
  await expect(page.getByRole('dialog', { name: 'Prepare weekly receipt' }).getByText('Delivered the approved integration plan')).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download PDF' }).click()
  expect((await download).suggestedFilename()).toMatch(/^work-receipt-.*\.pdf$/)
  expect(errors).toEqual([])
})

test('timer survives refresh and saves', async ({ page }) => {
  await page.getByLabel('Project', { exact: true }).fill('Acme')
  await page.getByLabel('Working toward').fill('Resolved the release blocker')
  await page.getByRole('button', { name: 'Start work session' }).click()
  await page.reload()
  await expect(page.getByText('Recording a self-reported session')).toBeVisible()
  await page.getByRole('button', { name: 'Stop & save' }).click()
  await expect(page.getByText('Resolved the release blocker')).toBeVisible()
})

test('has no accessibility violations', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Axe smoke runs once in desktop project')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('fits a 390px viewport without horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile layout assertion')
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
  expect(widths.scroll).toBe(widths.client)
})

test('serves route-specific titles, metadata, legal links, and a real 404', async ({ page, request }) => {
  await expect(page).toHaveTitle('Work Receipt — turn freelance time into a receipt')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://field-time-invoice-proof.sociobot.in/')
  await page.goto('/demo')
  await expect(page).toHaveTitle('Demo — Work Receipt')
  await page.goto('/privacy/')
  await expect(page).toHaveTitle('Privacy — Work Receipt')
  await expect(page.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms/')
  await page.goto('/terms/')
  await expect(page).toHaveTitle('Terms — Work Receipt')
  expect((await request.get('/robots.txt')).status()).toBe(200)
  expect((await request.get('/sitemap.xml')).status()).toBe(200)
  const missing = await request.get('/404.html')
  expect(missing.status()).toBe(200)
  expect(await missing.text()).toContain('This page is not in the notebook')
})

test('loads app shell while offline after first visit', async ({ page, context }) => {
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByText(/Offline · saving on this device/)).toBeVisible()
})
