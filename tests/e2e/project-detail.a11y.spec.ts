import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("@a11y US2 - detalhe de projeto sem violações automáticas WCAG 2.1 A/AA", async ({ page }) => {
  await page.goto("/projetos/plataforma-portfolio");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

  expect(results.violations).toEqual([]);
});

test("@a11y - roadmap sem violações automáticas WCAG 2.1 A/AA", async ({ page }) => {
  await page.goto("/roadmap");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

  expect(results.violations).toEqual([]);
});

test("@a11y US2 - rodapé da ficha mantém nome e ordem de foco coerentes", async ({ page }) => {
  await page.goto("/projetos/plataforma-portfolio");

  const allProjectsLink = page.getByRole("link", { name: "← Todas as fichas" });
  const resumeLink = page.getByRole("link", { name: "Ver currículo" });

  // Com uma única ficha implementada não há vizinhos: o rodapé omite a navegação
  // inteira em vez de renderizar links mortos, e o foco vai direto ao currículo.
  await expect(
    page.getByRole("navigation", { name: "Navegação entre fichas de projeto" }),
  ).toHaveCount(0);
  await allProjectsLink.focus();
  await page.keyboard.press("Tab");
  await expect(resumeLink).toBeFocused();
});
