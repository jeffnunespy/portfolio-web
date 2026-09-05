import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

// A página Sobre publica a biografia do perfil (FR-013), não a descrição curta
// do hero. Ler o JSON evita que o teste fixe uma cópia da string que diverge do
// conteúdo real a cada edição de content/profile.json.
const perfil = JSON.parse(
  readFileSync(path.join(process.cwd(), "content", "profile.json"), "utf8"),
) as { biografiaSobre: string };

test("US4 - navegação leva à página Sobre com posicionamento consistente", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: "Sobre" })
    .click();

  await expect(page).toHaveURL(/\/sobre$/);
  await expect(page.getByRole("heading", { level: 1, name: "Sobre" })).toBeVisible();
  await expect(page.getByText(perfil.biografiaSobre, { exact: true })).toBeVisible();
  // A seção de método é verificada pela estrutura, não pelas frases: fixar os
  // títulos aqui já quebrou a suíte quando o conteúdo foi corrigido, e o
  // requisito é que o método esteja publicado — não que use certas palavras.
  const blocosDeMetodo = page
    .getByRole("heading", { level: 2, name: "Como organizo meu trabalho" })
    .locator("xpath=following-sibling::div[1]")
    .getByRole("heading", { level: 3 });
  await expect(blocosDeMetodo).toHaveCount(3);
  for (const bloco of await blocosDeMetodo.all()) {
    await expect(bloco).toBeVisible();
  }
});
