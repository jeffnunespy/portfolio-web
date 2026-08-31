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
      "Em formação, com foco em desenvolvimento backend com Python e Django, construo aplicações web de ponta a ponta, da arquitetura ao deploy, com PostgreSQL e Google Cloud Platform.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Backend como profundidade" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Cloud e DevOps como diferenciais" }),
  ).toBeVisible();
});
