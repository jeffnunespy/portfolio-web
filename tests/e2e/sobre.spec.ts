import { test, expect } from "@playwright/test";
import { getPerfil } from "../../lib/content";

const perfil = getPerfil();

test("US4 - navegação leva à página Sobre com posicionamento consistente", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: "Sobre" })
    .click();

  await expect(page).toHaveURL(/\/sobre$/);
  await expect(page.getByRole("heading", { level: 1, name: "Sobre" })).toBeVisible();
  const apresentacao = page.getByRole("region", { name: "Apresentação" });
  const metodo = page.getByRole("region", { name: "Como organizo meu trabalho" });
  await expect(
    apresentacao.getByText(perfil.descricaoPosicionamento, { exact: true }),
  ).toBeVisible();
  await expect(metodo.getByText(perfil.biografiaSobre, { exact: true })).toBeVisible();
});
