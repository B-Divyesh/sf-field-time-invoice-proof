import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => indexedDB.deleteDatabase('work-receipt'))
  await page.reload()
})

test('creates, persists, and filters a manual session', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Show the work/)
  await page.getByRole('button', { name: /Add manually/ }).click()
  await page.getByLabel('Project *').fill('Northstar')
  await page.getByLabel('Outcome for the client *').fill('Reviewed and shipped the onboarding copy')
  await page.getByLabel('AI-assisted work').check()
  await page.getByRole('button', { name: 'Save field note' }).click()
  await expect(page.getByText('Reviewed and shipped the onboarding copy')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Reviewed and shipped the onboarding copy')).toBeVisible()
  await page.getByLabel('Filter notes').selectOption('Northstar')
  await expect(page.getByText('AI-assisted', { exact: true })).toBeVisible()
})

test('prepares and downloads a weekly PDF receipt without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.getByRole('button', { name: /Add manually/ }).click()
  await page.getByLabel('Project *').fill('Redwood')
  await page.getByLabel('Outcome for the client *').fill('Delivered the approved integration plan')
  await page.getByRole('button', { name: 'Save field note' }).click()
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
  await page.getByRole('button', { name: 'Start session' }).click()
  await page.reload()
  await expect(page.getByText('Recording a self-reported session')).toBeVisible()
  await page.getByRole('button', { name: 'Stop & save' }).click()
  await expect(page.getByText('Resolved the release blocker')).toBeVisible()
})

test('has no serious accessibility violations', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Axe smoke runs once in desktop project')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''))).toEqual([])
})

test('loads app shell while offline after first visit', async ({ page, context }) => {
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByText(/Offline · saving on this device/)).toBeVisible()
})
