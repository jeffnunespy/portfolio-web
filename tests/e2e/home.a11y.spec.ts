import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('US1 - acessibilidade básica da home', async ({ page }) => {
  await page.goto(BASE_URL);

  const accessibilityScanResults = await page.evaluate(async () => {
    // axe-core would be injected here in a real setup; for now, assert basic semantics
    const landmarks = document.querySelectorAll('header, nav, main, footer');
    return { landmarkCount: landmarks.length };
  });

  expect(accessibilityScanResults.landmarkCount).toBeGreaterThanOrEqual(3);
});
