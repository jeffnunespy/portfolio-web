import { test, expect } from "@playwright/test";

test("US4 - navegação leva à página Sobre com posicionamento consistente", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: "Sobre" })
    .click();

  await expect(page).toHaveURL(/\/sobre$/);
  await expect(page.getByRole("heading", { level: 1, name: "Sobre" })).toBeVisible();
  await expect(
    page.getByText(
      "Com foco em backend e engenharia de software, construo aplicações web completas da especificação ao deploy, aplicando cloud e práticas de DevOps.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Backend como profundidade" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Cloud e DevOps como diferenciais" }),
  ).toBeVisible();
});
