import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const comprovacaoAberta of [false, true]) {
  test(`@a11y US1 - home com comprovação ${comprovacaoAberta ? "aberta" : "fechada"} sem violações automáticas WCAG 2.2 A/AA`, async ({
    page,
  }) => {
    await page.goto("/");
    if (comprovacaoAberta) await page.locator("#estrutura summary").click();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
