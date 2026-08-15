import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("US2 - detalhe de projeto sem violações automáticas WCAG 2.1 A/AA", async ({ page }) => {
  await page.goto("/projetos/plataforma-portfolio");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

  expect(results.violations).toEqual([]);
});
