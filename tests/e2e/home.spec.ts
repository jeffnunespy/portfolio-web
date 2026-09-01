import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

// O hero publica o posicionamento do perfil. Ler o JSON evita fixar uma cópia
// da string que diverge do conteúdo real a cada edição de content/profile.json.
const perfil = JSON.parse(
  readFileSync(path.join(process.cwd(), "content", "profile.json"), "utf8"),
) as {
  tituloPosicionamento: string;
  descricaoPosicionamento: string;
  competenciasPorArea: { area: string }[];
};

// A home destaca apenas projetos implementados: escopo planejado vive em
// /roadmap. Contar a partir do conteúdo evita fixar um número que muda a cada
// projeto entregue.
const projectsDir = path.join(process.cwd(), "content", "projects");
const destaquesImplementados = readdirSync(projectsDir)
  .filter((fileName) => fileName.endsWith(".json"))
  .map(
    (fileName) =>
      JSON.parse(readFileSync(path.join(projectsDir, fileName), "utf8")) as {
        destaque: boolean;
        real: boolean;
      },
  )
  .filter((projeto) => projeto.real && projeto.destaque).length;

test("US1 - posicionamento profissional e competências na home", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const title = page.getByRole("heading", {
    level: 1,
    name: perfil.tituloPosicionamento,
  });
  const description = page.getByText(perfil.descricaoPosicionamento);

  await expect(title).toBeVisible();
  await expect(description).toBeVisible();
  // Toda área declarada no perfil precisa aparecer como cabeçalho de competência.
  for (const { area } of perfil.competenciasPorArea) {
    await expect(page.getByRole("heading", { level: 3, name: area })).toBeVisible();
  }

  const titleBox = await title.boundingBox();
  const descriptionBox = await description.boundingBox();
  expect(titleBox && titleBox.y + titleBox.height).toBeLessThanOrEqual(720);
  expect(descriptionBox && descriptionBox.y + descriptionBox.height).toBeLessThanOrEqual(720);

  const projectCards = page.locator('[data-testid="project-card"]');
  const count = await projectCards.count();
  expect(count).toBe(destaquesImplementados);

  for (const card of await projectCards.all()) {
    await expect(card.getByText(/Autoral|Acadêmico|Colaborativo|Profissional/)).toBeVisible();
    // A ficha de índice é decorativa (alt=""): fica visível, mas fora da árvore
    // de acessibilidade, para não repetir o título que o cartão já anuncia.
    const fichaDeIndice = card.locator("img.project-image");
    await expect(fichaDeIndice).toBeVisible();
    await expect(fichaDeIndice).toHaveAttribute("alt", "");
    await expect(card.getByRole("img")).toHaveCount(0);
    await expect(card.getByRole("link", { name: /Ver detalhes de/ })).toBeVisible();
  }
});

test("US1 - navegação por tabulação sem tabindex positivo", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])')).toHaveCount(0);

  const expectedLabels = [
    "Pular para o conteúdo principal",
    "Início",
    "Projetos",
    "Roadmap",
    "Sobre",
    "Currículo",
  ];

  for (const expectedLabel of expectedLabels) {
    await page.keyboard.press("Tab");
    const focusedLabel = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focusedLabel).toBe(expectedLabel);
  }
});
