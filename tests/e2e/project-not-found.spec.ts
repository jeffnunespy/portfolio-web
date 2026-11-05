import { test, expect } from "@playwright/test";

// Slugs sem ficha publicada: um arbitrário e um item do escopo planejado.
const slugsSemFicha = ["slug-inexistente", "gerenciamento-filas"];

test("US2 - projeto inexistente exibe alternativa para a listagem", async ({ page }) => {
  const response = await page.goto("/projetos/slug-inexistente");

  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Página não encontrada");
  await expect(page.getByRole("link", { name: "Ver todos os projetos" })).toHaveAttribute(
    "href",
    "/projetos",
  );
  await expect(page.getByText("Acervo publicado")).toBeVisible();
  await expect(page.getByText("Escopo planejado")).toBeVisible();
  await expect(page.getByText("Destino de retorno")).toBeVisible();
});

// PROD-001: a UI da 404 de uma ficha inexistente precisa estar no HTML
// recebido, não só nos dados que o JavaScript usa para recuperá-la.
test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const slug of slugsSemFicha) {
    test(`404 de /projetos/${slug} traz mensagem e recuperação`, async ({ page }) => {
      for (const acesso of ["direto", "recarga"]) {
        const resposta =
          acesso === "direto" ? await page.goto(`/projetos/${slug}`) : await page.reload();

        expect(resposta?.status(), acesso).toBe(404);
        await expect(page.locator("main h1")).toHaveText("Página não encontrada");
        await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
        await expect(
          page.locator('meta[name="robots"][content*="noindex"]').first(),
        ).toBeAttached();
        await expect(
          page.getByRole("link", { name: "Voltar para a página inicial" }),
        ).toHaveAttribute("href", "/");
        await expect(page.getByRole("link", { name: "Ver todos os projetos" })).toHaveAttribute(
          "href",
          "/projetos",
        );
      }

      await page.getByRole("link", { name: "Ver todos os projetos" }).click();
      await expect(page).toHaveURL("/projetos");
      await expect(page.locator("h1")).toHaveText("Projetos");
    });
  }

  for (const slug of ["plataforma-portfolio", "nana-silva"]) {
    test(`ficha publicada /projetos/${slug} segue com HTTP 200`, async ({ page }) => {
      const resposta = await page.goto(`/projetos/${slug}`);

      expect(resposta?.status()).toBe(200);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    });
  }
});
