import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/projetos",
  "/projetos/plataforma-portfolio",
  "/sobre",
  "/curriculo",
  "/rota-inexistente",
  "/projetos/slug-inexistente",
];

for (const width of [320, 768, 1280]) {
  test(`páginas públicas não têm rolagem horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const route of routes) {
      await page.goto(route);

      const dimensions = await page.evaluate(() => ({
        bodyWidth: document.body.scrollWidth,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));

      expect(dimensions.bodyWidth, `overflow no body de ${route}`).toBeLessThanOrEqual(
        dimensions.viewportWidth,
      );
      expect(dimensions.documentWidth, `overflow no documento de ${route}`).toBeLessThanOrEqual(
        dimensions.viewportWidth,
      );
      const overflowingText = await page.locator("h1, h2, h3, p, a, li").evaluateAll((elements) =>
        elements
          .filter((element) => {
            const style = window.getComputedStyle(element);
            return (
              !element.matches(".skip-link") && element.clientWidth > 0 && style.display !== "none"
            );
          })
          .filter((element) => element.scrollWidth > element.clientWidth + 1)
          .map((element) => element.textContent?.trim() || element.tagName),
      );
      expect(overflowingText, `texto cortado em ${route}`).toEqual([]);
      await expect(page.locator("main")).toBeVisible();
    }
  });
}
