import { test, expect } from "@playwright/test";

test("US2 - projeto inexistente exibe alternativa para a listagem", async ({ page }) => {
  const response = await page.goto("/projetos/slug-inexistente");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Projeto não encontrado" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver todos os projetos" })).toHaveAttribute(
    "href",
    "/projetos",
  );
  await expect(page.getByText("Acervo publicado")).toBeVisible();
  await expect(page.getByText("Escopo planejado")).toBeVisible();
  await expect(page.getByText("Destino de retorno")).toBeVisible();
});
