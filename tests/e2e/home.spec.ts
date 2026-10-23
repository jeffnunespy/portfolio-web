import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

// O hero publica o posicionamento do perfil. Ler o JSON evita fixar uma cópia
// da string que diverge do conteúdo real a cada edição de content/profile.json.
const perfil = JSON.parse(
  readFileSync(path.join(process.cwd(), "content", "profile.json"), "utf8"),
) as {
  nome: string;
  tituloPosicionamento: string;
  descricaoPosicionamento: string;
  competenciasPorArea: { area: string }[];
};

// A home destaca apenas projetos implementados: escopo planejado vive em
// /roadmap. Contar a partir do conteúdo evita fixar um número que muda a cada
// projeto entregue.
const projectsDir = path.join(process.cwd(), "content", "projects");
const projetos = readdirSync(projectsDir)
  .filter((fileName) => fileName.endsWith(".json"))
  .map(
    (fileName) =>
      JSON.parse(readFileSync(path.join(projectsDir, fileName), "utf8")) as {
        destaque: boolean;
        real: boolean;
      },
  );
const totalImplementados = projetos.filter((projeto) => projeto.real).length;
const destaquesImplementados = projetos.filter(
  (projeto) => projeto.real && projeto.destaque,
).length;

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

  const evidenceLink = page.getByRole("link", { name: "Ver implementação e verificações" });
  await expect(evidenceLink).toBeVisible();
  await expect(evidenceLink).toHaveAttribute("href", "/projetos/plataforma-portfolio");
  await expect(
    page.getByText(
      "Fluxos E2E com Playwright e WCAG 2.1 A/AA com axe-core, executados como gates separados no CI.",
    ),
  ).toBeVisible();

  const registroImplementados = page.getByText("Projetos implementados").locator("..");
  await expect(registroImplementados.locator("dd")).toHaveText(String(totalImplementados));

  await expect(
    page.getByRole("heading", { level: 2, name: "Competências comprovadas nesta plataforma" }),
  ).toBeVisible();
  const roadmapDeEstudos = page.getByRole("link", { name: "roadmap de estudos" });
  await expect(roadmapDeEstudos).toHaveAttribute("href", "/roadmap");
  await expect(
    page.getByText(
      "Tecnologias de backend e cloud, como Python, Django, Docker e Google Cloud Platform, aparecem apenas como estudo no",
    ),
  ).toBeVisible();

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
    `${perfil.nome} — Início`,
    "Início",
    "Projetos",
    "Roadmap (Plano)",
    "Sobre",
    "Currículo (CV)",
  ];

  for (const expectedLabel of expectedLabels) {
    await page.keyboard.press("Tab");
    const focusedLabel = await page.evaluate(
      () =>
        document.activeElement?.getAttribute("aria-label") ??
        document.activeElement?.textContent?.trim(),
    );
    expect(focusedLabel).toBe(expectedLabel);
  }
});

test("US1 - Ver estrutura abre o painel textual e Escape devolve o foco", async ({ page }) => {
  await page.goto("/");

  const painel = page.locator("#estrutura");
  const abrir = page.getByRole("button", { name: "Ver estrutura" });
  await expect(abrir).toHaveAttribute("aria-expanded", "false");
  await expect(abrir).toHaveAttribute("aria-controls", "estrutura");
  await expect(painel).toBeHidden();

  await abrir.focus();
  await page.keyboard.press("Enter");

  const ocultar = page.getByRole("button", { name: "Ocultar estrutura" });
  await expect(ocultar).toHaveAttribute("aria-expanded", "true");
  await expect(painel).toBeVisible();
  await expect(
    painel.getByRole("heading", { level: 2, name: "O que sustenta a superfície" }),
  ).toBeVisible();
  await expect(painel.getByText("content/profile.json")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(painel).toBeHidden();
  await expect(page.getByRole("button", { name: "Ver estrutura" })).toBeFocused();
});

test("US1 - curvas acompanham o mouse sem alterar a página", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await expect(page.locator(".survey__drawing")).toHaveAttribute("data-desenhado", "");

  const titulo = page.locator(".hero__title");
  const corAntes = await titulo.evaluate((element) => getComputedStyle(element).color);

  await page.mouse.move(900, 300);
  await page.mouse.move(980, 360);
  await expect
    .poll(() =>
      page.locator(".survey__layer--index").evaluate((element) => element.style.transform),
    )
    .toContain("translate3d");

  // Sem lente nem raio-X: só as camadas do terreno se deslocam.
  expect(await titulo.evaluate((element) => getComputedStyle(element).color)).toBe(corAntes);
});

test("US1 - movimento reduzido mostra as curvas sem varredura nem deslocamento", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const desenho = page.locator(".survey__drawing");
  await expect(desenho).toHaveAttribute("data-desenhado", "");
  expect(
    await desenho.evaluate((element) => {
      const estilo = getComputedStyle(element);
      return { mascara: estilo.maskImage, animacao: estilo.animationName };
    }),
  ).toEqual({ mascara: "none", animacao: "none" });

  await page.mouse.move(900, 300);
  await page.mouse.move(980, 360);
  await page.waitForTimeout(100);
  for (const camada of await page.locator(".survey__layer").all()) {
    expect(await camada.evaluate((element) => element.style.transform)).toBe("");
  }
});
