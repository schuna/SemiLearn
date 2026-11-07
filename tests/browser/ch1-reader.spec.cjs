const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const screenshotDir = path.resolve(__dirname, '../../artifacts/phase1');
fs.mkdirSync(screenshotDir, { recursive: true });

test('Chapter 1 excerpts, translation, sources and mobile layout', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#ch1-amplifiers');
  await page.getByRole('button', { name: /교재 원문·번역/ }).first().click();
  await expect(page.locator('#tab-content-reader')).toBeVisible();
  await expect(page.locator('#tab-content-reader section')).toHaveCount(7);
  await expect(page.locator('#reader-electric-electronic [lang="en"]')).toHaveCount(8);
  await expect(page.locator('#reader-active-passive [lang="ko"]')).toHaveCount(4);
  await expect(page.locator('#reader-amplifiers [lang="ko"]')).toHaveCount(7);
  await expect(page.locator('#reader-amplifier-gain')).toContainText('A전체 = A₁ × A₂');
  await expect(page.locator('#reader-absolute-db')).toContainText('1 mW');
  await expect(page.locator('#reader-decibels [lang="ko"]')).toHaveCount(5);
  await expect(page.locator('#reader-absolute-db [lang="ko"]')).toHaveCount(5);
  await expect(page.locator('#reader-attenuators [id^="reader-attenuator-"]')).toHaveCount(7);
  await expect(page.locator('#reader-electric-electronic a[href="SEMI.pdf#page=10"]')).toHaveCount(1);
  await page.locator('#tab-content-reader').screenshot({ path: path.join(screenshotDir, 'ch1-reader-desktop.png') });
  await expect(page.locator('#reader-pair-power-source [lang="en"]')).toContainText('external source');
  await expect(page.locator('#reader-pair-power-source [lang="ko"]')).toContainText('외부 전원');
  await expect(page.locator('#tab-content-reader a[href*="SEMI_A3.html"]')).toHaveCount(1);
  await page.locator('[data-reader-section="decibels"]').click();
  await expect(page.locator('#reader-decibels')).toBeInViewport();

  await page.setViewportSize({ width: 320, height: 800 });
  await expect.poll(() => page.locator('#sidebar').evaluate(sidebar => sidebar.getBoundingClientRect().right))
    .toBeLessThanOrEqual(1);
  await expect(page.locator('#reader-decibels [lang="en"]').first()).toBeVisible();
  await expect(page.locator('#reader-decibels [lang="ko"]').first()).toBeVisible();
  await page.locator('#reader-decibels').screenshot({ path: path.join(screenshotDir, 'ch1-reader-mobile.png') });
  const overflow = await page.evaluate(() => {
    const main = document.getElementById('main-content');
    return main.scrollWidth - main.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(2);
  expect(errors).toEqual([]);
});
