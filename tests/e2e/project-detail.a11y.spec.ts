import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { getProjetosImplementados } from "../../lib/content";

for (const projeto of getProjetosImplementados()) {
  test(`@a11y US2 - detalhe de ${projeto.slug} sem violações automáticas WCAG 2.1 A/AA`, async ({
    page,
  }) => {
    await page.goto(`/projetos/${projeto.slug}`);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test("@a11y - roadmap sem violações automáticas WCAG 2.1 A/AA", async ({ page }) => {
  await page.goto("/roadmap");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

for (const projeto of getProjetosImplementados()) {
  test(`@a11y US2 - rodapé de ${projeto.slug} mantém a ordem de foco entre fichas e currículo`, async ({
    page,
  }) => {
    await page.goto(`/projetos/${projeto.slug}`);

    const rodape = page.locator(".project-record-footer");
    const links = rodape.getByRole("link");
    await expect(links.first()).toHaveAccessibleName("← Todas as fichas");
    await expect(links.last()).toHaveAccessibleName("Ver currículo");
    await links.first().focus();
    for (const link of (await links.all()).slice(1)) {
      await page.keyboard.press("Tab");
      await expect(link).toBeFocused();
    }
  });
}
