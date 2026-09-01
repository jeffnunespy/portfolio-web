import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/projetos",
  "/projetos/plataforma-portfolio",
  "/roadmap",
  "/sobre",
  "/curriculo",
  "/rota-inexistente",
  "/projetos/slug-inexistente",
];

for (const route of publicRoutes) {
  test(`@a11y ${route} não possui violações WCAG 2.1 A/AA`, async ({ page }) => {
    await page.goto(route);

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("@a11y primeiro Tab alcança o skip link e segue a ordem visual da navegação", async ({
  page,
}) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo principal" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Início" }).first()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Projetos" }).first()).toBeFocused();
});

test("@a11y todas as rotas permitem percorrer os controles por teclado sem armadilha", async ({
  page,
}) => {
  const seletorInterativo = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  for (const route of publicRoutes) {
    await page.goto(route);

    const interativos = page.locator(seletorInterativo);
    const total = await interativos.count();
    expect(total, `controles interativos em ${route}`).toBeGreaterThan(0);

    for (let index = 0; index < total; index += 1) {
      await page.keyboard.press("Tab");

      const recebeuFoco = await interativos
        .nth(index)
        .evaluate((element) => element === document.activeElement);
      expect(recebeuFoco, `ordem de foco em ${route}, item ${index + 1}/${total}`).toBe(true);

      const focoVisivel = await interativos.nth(index).evaluate((element) => {
        const style = window.getComputedStyle(element);
        return style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) >= 2;
      });
      expect(focoVisivel, `indicador de foco em ${route}, item ${index + 1}/${total}`).toBe(true);
    }
  }
});
