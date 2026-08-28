import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'

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

test('has no accessibility violations on every shipped HTML route', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Full axe route scan runs once in desktop Chromium')
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/404.html', '/offline.html', '/sample-evidence/checkout-review.html', '/sample-evidence/research-summary.html']) {
    await page.goto(route)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations, `${route}: ${results.violations.map((item) => item.id).join(', ')}`).toEqual([])
  }
})

test('fits home and demo in a 390px viewport without horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile layout assertion')
  for (const route of ['/', '/?demo=1']) {
    await page.goto(route)
    const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(widths.scroll, route).toBe(widths.client)
  }
})

test('gives mobile navigation, recovery, and demo-exit controls 44px targets', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile touch-target assertion')
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/404.html', '/offline.html']) {
    await page.goto(route)
    const selector = route === '/demo'
      ? '.site-header .brand, .site-header nav a, footer nav a, .demo-banner a, .demo-banner button, .dialog-demo-banner a, .dialog-demo-banner button'
      : '.site-header .brand, .site-header nav a, footer nav a, main > p:last-child > a'
    const targets = page.locator(selector)
    for (let index = 0; index < await targets.count(); index++) {
      const target = targets.nth(index)
      if (!(await target.isVisible())) continue
      const box = await target.boundingBox()
      expect(box, `${route} target ${index}`).not.toBeNull()
      expect(box!.height, `${route} target ${index} height`).toBeGreaterThanOrEqual(44)
      expect(box!.width, `${route} target ${index} width`).toBeGreaterThanOrEqual(44)
    }
  }
})

test('serves complete route-specific metadata and a configured real 404', async ({ page, request }) => {
  const routes = [
    { path: '/', title: 'Work Receipt — turn freelance time into a receipt', canonical: '/' },
    { path: '/demo', title: 'Demo — Work Receipt', canonical: '/demo' },
    { path: '/privacy/', title: 'Privacy — Work Receipt', canonical: '/privacy/' },
    { path: '/terms/', title: 'Terms — Work Receipt', canonical: '/terms/' },
    { path: '/404.html', title: 'Page not found — Work Receipt', canonical: '/404.html' },
    { path: '/offline.html', title: 'Offline — Work Receipt', canonical: '/offline.html' },
    { path: '/sample-evidence/checkout-review.html', title: 'Sample checkout review — Work Receipt', canonical: '/sample-evidence/checkout-review.html' },
    { path: '/sample-evidence/research-summary.html', title: 'Sample research summary — Work Receipt', canonical: '/sample-evidence/research-summary.html' },
  ]
  for (const route of routes) {
    await page.goto(route.path)
    await expect(page).toHaveTitle(route.title)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://field-time-invoice-proof.sociobot.in${route.canonical}`)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title)
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /\S/)
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://field-time-invoice-proof.sociobot.in${route.canonical}`)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /work-receipt-social\.jpg$/)
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', route.title)
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /\S/)
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /work-receipt-social\.jpg$/)
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/icons/icon.svg')
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/icons/apple-touch-icon.png')
  }
  expect((await request.get('/robots.txt')).status()).toBe(200)
  expect((await request.get('/sitemap.xml')).status()).toBe(200)
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8'))
  expect(config.responseOverrides['404'].rewrite).toBe('/404.html')
  await page.goto('/404.html')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
})

test('uses the standard header shell on every shipped HTML route', async ({ page }) => {
  const routes = ['/', '/demo', '/privacy/', '/terms/', '/404.html', '/offline.html', '/sample-evidence/checkout-review.html', '/sample-evidence/research-summary.html']
  for (const route of routes) {
    await page.goto(route)
    const header = page.locator('.site-header')
    const brand = header.locator('.brand')
    const navigation = header.getByRole('navigation', { name: 'Primary navigation' })
    await expect(brand, `${route} wordmark`).toHaveAttribute('href', '/')
    await expect(brand, `${route} wordmark`).toHaveText('Work Receipt')
    await expect(navigation.locator('a'), `${route} header links`).toHaveCount(2)
    await expect(navigation.getByRole('link', { name: 'Demo', exact: true })).toHaveAttribute('href', '/demo')
    await expect(navigation.getByRole('link', { name: 'Privacy', exact: true })).toHaveAttribute('href', '/privacy/')
  }
})

test('crawls every product link without a dead destination', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Link crawl runs once')
  const paths = new Set<string>()
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/404.html', '/offline.html', '/sample-evidence/checkout-review.html', '/sample-evidence/research-summary.html']) {
    await page.goto(route)
    for (const href of await page.locator('a[href]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href))) {
      const url = new URL(href)
      if (url.origin === new URL(page.url()).origin) paths.add(`${url.pathname}${url.search}`)
    }
  }
  for (const path of paths) expect((await request.get(path)).status(), path).toBeLessThan(400)
})

test('focuses and announces route headings after forward and back navigation', async ({ page }) => {
  const homeHeading = page.getByRole('heading', { level: 1 })
  await expect(homeHeading).toBeFocused()
  await page.locator('.header-nav').getByRole('link', { name: 'Demo' }).click()
  const receipt = page.getByRole('dialog', { name: 'Prepare weekly receipt' })
  await receipt.getByRole('button', { name: 'Close', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expect(page.locator('#route-announcer')).toHaveText('Demo — Work Receipt')
  await page.goBack()
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expect(page.locator('#route-announcer')).toHaveText('Work Receipt — turn freelance time into a receipt')
  await page.locator('.header-nav').getByRole('link', { name: 'Privacy' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expect(page.locator('#route-announcer')).toHaveText('Privacy — Work Receipt')
  await page.goBack()
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
})

test('loads every route without console errors or inline CSP styling', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Console and CSP route scan runs once')
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/404.html', '/offline.html', '/sample-evidence/checkout-review.html', '/sample-evidence/research-summary.html']) {
    errors.length = 0
    await page.goto(route)
    await page.waitForLoadState('networkidle')
    expect(errors, route).toEqual([])
    expect(await page.locator('style').count(), `${route} inline style blocks`).toBe(0)
    expect(await page.locator('[style]').count(), `${route} inline style attributes`).toBe(0)
  }
})

test('loads app shell and demo data offline after first visit', async ({ page, context }) => {
  await page.goto('/demo')
  await page.getByRole('dialog', { name: 'Prepare weekly receipt' }).getByRole('button', { name: 'Close', exact: true }).click()
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('#session-list').getByText('Mapped checkout errors and agreed on the revised purchase flow.')).toBeVisible()
  await expect(page.getByText(/Offline · saving on this device/)).toBeVisible()
})
