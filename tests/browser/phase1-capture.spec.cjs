const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const outputDir = path.resolve(__dirname, '../../artifacts/phase1');
fs.mkdirSync(outputDir, { recursive: true });

const chapters = {
  1: ['ch1-amplifiers', '증폭기와 능동 소자'],
  2: ['ch2-solid-state', '고체 소자 이론'],
  3: ['ch3-diodes', '다이오드 및 정류 회로']
};

async function openChapter(page, number) {
  const [slug, title] = chapters[number];
  await page.goto(`/#${slug}`);
  await expect(page.locator('#chapter-title-ko')).toContainText(title);
  await expect(page.locator('#chapter-list li')).toHaveCount(13);
}

async function openLab(page, number) {
  await openChapter(page, number);
  await page.locator('[data-tab-target="lab"]').click();
  await expect(page.locator('#lab-container')).toBeVisible();
  await expect.poll(() => page.locator(`#ch${number}-canvas`).evaluate(canvas => canvas.width))
    .toBeGreaterThan(0);
  // app.js schedules one resize and animation restart after the tab opens.
  await page.waitForTimeout(80);
  await freeze(page, number);
}

async function freeze(page, number, phase) {
  await page.evaluate(({ number, phase }) => {
    const simulator = window[`SimulatorCh${number}`];
    simulator.stop();
    if (phase !== undefined) simulator.time = phase;
    simulator.draw();
  }, { number, phase });
}

async function setRange(page, selector, value) {
  await page.locator(selector).evaluate((input, next) => {
    input.value = String(next);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

async function capture(page, name, locator) {
  const file = path.join(outputDir, `${name}.png`);
  if (locator) await locator.screenshot({ path: file, animations: 'disabled' });
  else await page.screenshot({ path: file, animations: 'disabled' });
  const layout = await page.evaluate(() => {
    const main = document.querySelector('#main-content');
    return {
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      mainWidth: main?.clientWidth,
      mainScrollWidth: main?.scrollWidth
    };
  });
  expect(layout.documentWidth, `${name}: document horizontal overflow`).toBeLessThanOrEqual(layout.viewport + 2);
  expect(layout.mainScrollWidth, `${name}: main horizontal overflow`).toBeLessThanOrEqual(layout.mainWidth + 2);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    let seed = 123456789;
    Math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page._phase1Errors = errors;
});

test.afterEach(async ({ page }) => {
  expect(page._phase1Errors, 'browser JavaScript or console errors').toEqual([]);
});

test('all Phase 1 reading tabs', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const chapter of [1, 2, 3]) {
    await openChapter(page, chapter);
    for (const tab of ['concepts', 'deepdive', 'resources']) {
      await page.locator(`[data-tab-target="${tab}"]`).click();
      await expect(page.locator(`#tab-content-${tab}`)).toBeVisible();
      await capture(page, `00-ch${chapter}-${tab}`);
    }
  }
});

test('desktop shell, chapter 1, and chapter 2', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openChapter(page, 1);
  await expect(page.locator('.katex').first()).toBeVisible();
  await capture(page, '01-desktop-dark-shell');

  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await capture(page, '02-desktop-light-shell');

  await page.locator('#chapter-search').fill('다이오드');
  await expect(page.locator('#chapter-list li')).toHaveCount(1);
  await capture(page, '03-desktop-search');
  await page.locator('#chapter-search').clear();

  await openLab(page, 1);
  await capture(page, '04-ch1-default', page.locator('#lab-container'));
  await setRange(page, '#ch1-slider-gain', 15);
  await setRange(page, '#ch1-slider-inamp', 3);
  await setRange(page, '#ch1-slider-vsupply', 3);
  await expect(page.locator('#ch1-metric-clip')).toContainText('클리핑');
  await freeze(page, 1);
  await capture(page, '05-ch1-clipping', page.locator('#lab-container'));

  await page.locator('#ch1-db-in').fill('1');
  await page.locator('#ch1-db-out').fill('0.5');
  await expect(page.locator('#ch1-db-result')).toContainText('-6.02 dB');
  await capture(page, '06-ch1-attenuation', page.locator('#lab-container'));

  await openLab(page, 2);
  await capture(page, '07-ch2-equilibrium', page.locator('#lab-container'));
  await setRange(page, '#ch2-slider-bias', -2);
  await freeze(page, 2);
  await capture(page, '08-ch2-reverse', page.locator('#lab-container'));
  await setRange(page, '#ch2-slider-bias', 0.7);
  await freeze(page, 2);
  await capture(page, '09-ch2-forward', page.locator('#lab-container'));

  await page.locator('#ch2-tab-band').click();
  for (const [material, button] of [
    ['conductor', 'cond'], ['semiconductor', 'semi'], ['insulator', 'insu']
  ]) {
    await page.locator(`#ch2-btn-${button}`).click();
    await freeze(page, 2);
    const particlesInBands = await page.evaluate(() => {
      const sim = window.SimulatorCh2;
      const height = sim.canvas.height;
      const conductionY = sim.material === 'conductor' ? height * 0.42
        : sim.material === 'insulator' ? height * 0.15 : height * 0.25;
      const valenceY = sim.material === 'conductor' ? height * 0.48
        : sim.material === 'insulator' ? height * 0.8 : height * 0.7;
      return sim.bandParticles.every(p =>
        Math.abs(p.y - (conductionY - 22)) < 2 || Math.abs(p.y - (valenceY + 22)) < 2);
    });
    expect(particlesInBands, `${material}: electron dots should be inside a band`).toBe(true);
    await capture(page, `10-ch2-band-${material}`, page.locator('#lab-container'));
  }
});

test('chapter 3 rectifier, I-V curve, and reference link', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openLab(page, 3);
  await freeze(page, 3, Math.PI / 2);
  await capture(page, '11-ch3-bridge-positive', page.locator('#lab-container'));
  await freeze(page, 3, 3 * Math.PI / 2);
  await capture(page, '12-ch3-bridge-negative', page.locator('#lab-container'));
  await page.locator('#ch3-btn-cap').click();
  await freeze(page, 3, Math.PI / 2);
  await capture(page, '13-ch3-filter-on', page.locator('#lab-container'));

  await page.locator('#ch3-tab-iv').click();
  for (const [material, button, voltage] of [
    ['silicon', 'si', 0.7], ['germanium', 'ge', 0.3], ['schottky', 'sch', 0.25]
  ]) {
    await page.locator(`#ch3-btn-${button}`).click();
    await setRange(page, '#ch3-slider-vd', voltage);
    await freeze(page, 3);
    await capture(page, `14-ch3-iv-${material}`, page.locator('#lab-container'));
  }

  await page.locator('[data-tab-target="resources"]').click();
  await expect(page.getByRole('link', { name: /PhET Semiconductors/ }))
    .toHaveAttribute('href', 'https://phet.colorado.edu/en/simulations/semiconductor');
  await capture(page, '15-ch3-resources');
});

test('320px mobile navigation, chapter lab, and saved progress', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await openChapter(page, 1);
  await page.locator('#sidebar-toggle').click();
  await capture(page, '16-mobile-sidebar');
  await page.locator('#chapter-list li').filter({ hasText: '다이오드 및 정류 회로' }).click();
  await expect(page.locator('#chapter-title-ko')).toContainText('다이오드 및 정류 회로');
  await page.locator('[data-tab-target="lab"]').click();
  await expect.poll(() => page.locator('#ch3-canvas').evaluate(canvas => canvas.width))
    .toBeGreaterThan(0);
  await page.waitForTimeout(80);
  await freeze(page, 3, Math.PI / 2);
  await capture(page, '17-mobile-ch3-lab', page.locator('#lab-container'));

  await page.locator('#btn-toggle-complete').click();
  await expect(page.locator('#progress-text')).toContainText('1/13');
  await page.reload();
  await expect(page.locator('#progress-text')).toContainText('1/13');
  await capture(page, '18-mobile-progress');
});
