import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('US1 - posicionamento profissional e competências na home', async ({ page }) => {
  await page.goto(BASE_URL);

  await expect(page.locator('h1')).toHaveText('Portfólio');
  await expect(page.locator('text=Desenvolvedor Full-Stack em Formação')).toBeVisible();
  await expect(page.locator('text=Backend')).toBeVisible();
  await expect(page.locator('text=Engenharia de Software')).toBeVisible();
  await expect(page.locator('text=Cloud')).toBeVisible();
  await expect(page.locator('text=DevOps')).toBeVisible();

  const projectCards = page.locator('[data-testid="project-card"]');
  const count = await projectCards.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(6);
});

test('US1 - navegação por tabulação sem tabindex positivo', async ({ page }) => {
  await page.goto(BASE_URL);

  const body = await page.locator('body').innerHTML();
  expect(body).not.toMatch(/tabindex="[1-9][0-9]*"/);

  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focused);
});
