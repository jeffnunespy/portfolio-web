import { test, expect, type Page } from "@playwright/test";
import { getPerfil, getProjetosImplementados } from "../../lib/content";

const perfil = getPerfil();
const implementados = getProjetosImplementados();
const destaques = implementados.filter((p) => p.destaque).slice(0, 6);
// O repositório da plataforma é privado (FR-009a): a seção nomeia as fontes
// em texto, e nenhuma delas pode voltar a ser link para um destino que o
// visitante anônimo recebe como 404.
const fontesDescritas = [
  "Testes E2E com Playwright",
  "verificações WCAG 2.1 A/AA com axe-core",
] as const;
const arquivosNomeados = [
  "content/profile.json",
  "content/projects/",
  "lib/content.ts",
  "tests/unit/content.test.ts",
  ".github/workflows/ci.yml",
] as const;

test("US1 - nome, posicionamento e todas as competências estão na primeira dobra", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { level: 1, name: perfil.nome })).toBeVisible();
  await expect(page.getByText(perfil.tituloPosicionamento, { exact: true })).toBeVisible();
  await expect(page.getByText(perfil.descricaoPosicionamento, { exact: true })).toBeVisible();
  for (const { area, competencias } of perfil.competenciasPorArea) {
    const grupo = page
      .locator(".competency-card")
      .filter({ has: page.getByRole("heading", { level: 3, name: area, exact: true }) });
    await expect(grupo).toBeVisible();
    for (const competencia of competencias)
      await expect(grupo.getByText(competencia, { exact: true })).toBeVisible();
  }
  // toBeVisible sozinho aceita conteúdo fora da viewport. Medir cada item protege SC-001.
  const foraDaDobra = await page
    .locator(
      ".home-name, .home-intro__role, .home-intro__description, .home-competencies h2, .competency-card h3, .competency-card li",
    )
    .evaluateAll((elements) =>
      elements
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth;
        })
        .map((el) => el.textContent),
    );
  expect(foraDaDobra).toEqual([]);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  const projectsLink = page.getByRole("link", { name: "Ver projetos em destaque" });
  await expect(projectsLink).toHaveAttribute("href", "#projects-title");
  await expect(
    page.getByText(
      `${implementados.length} projetos implementados, com suas decisões e limitações.`,
    ),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "roadmap de estudos" })).toHaveAttribute(
    "href",
    "/roadmap",
  );

  const cards = page.getByTestId("project-card");
  await expect(cards).toHaveCount(destaques.length);
  for (const projeto of destaques) {
    const card = cards.filter({
      has: page.getByRole("heading", { name: projeto.titulo, exact: true }),
    });
    await expect(card.getByText(/Autoral|Acadêmico|Colaborativo|Profissional/)).toBeVisible();
    await expect(
      card.getByRole("link", { name: `Ver detalhes de ${projeto.titulo}` }),
    ).toHaveAttribute("href", `/projetos/${projeto.slug}`);
    const imagem = card.locator("img.project-image");
    if (projeto.slug === "nana-silva") {
      await expect(imagem).toHaveCount(0);
      await expect(card.getByText("Em validação", { exact: true })).toBeVisible();
    } else {
      await expect(imagem).toBeVisible();
      await expect(imagem).toHaveAttribute("alt", "");
    }
    await expect(card.getByRole("img")).toHaveCount(0);
  }
});

test("US1 - navegação por tabulação sem tabindex positivo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])')).toHaveCount(0);
  for (const nome of [
    "Pular para o conteúdo principal",
    `${perfil.nome} — Início`,
    "Início",
    "Projetos",
    "Roadmap (Plano)",
    "Sobre",
    "Currículo (CV)",
  ]) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        () =>
          document.activeElement?.getAttribute("aria-label") ??
          document.activeElement?.textContent?.trim(),
      ),
    ).toBe(nome);
  }
});

test("US1 - comprovação nativa abre e fecha por Enter e Espaço", async ({ page }) => {
  await page.goto("/");
  const details = page.locator("#estrutura");
  const summary = details.locator("summary");
  const conteudo = details.locator(".structure-notes__inner");
  await expect(conteudo).toBeHidden();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(conteudo).toBeVisible();
  await expect(summary).toBeFocused();
  await expect(conteudo.getByText("content/profile.json")).toBeVisible();
  const total = new Set(perfil.competenciasPorArea.flatMap((area) => area.competencias)).size;
  await expect(conteudo.getByText(new RegExp(`As ${total} competências declaradas`))).toBeVisible();
  // As fontes são texto, não destinos: o Tab seguinte ao resumo sai da seção
  // em vez de parar em links para o repositório privado.
  await page.keyboard.press("Tab");
  const foco = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    naSecao: Boolean(document.activeElement?.closest('[aria-labelledby="build-title"]')),
  }));
  expect(foco).toEqual({ tag: "A", naSecao: false });
  await summary.focus();
  await page.keyboard.press("Space");
  await expect(conteudo).toBeHidden();
  await expect(summary).toBeFocused();
});

async function conferirFontesDescritas(page: Page) {
  const secao = page.locator("section.station").filter({
    has: page.getByRole("heading", { name: "Da fonte à página.", exact: true }),
  });
  for (const fonte of fontesDescritas) {
    await expect(secao.getByText(fonte)).toBeVisible();
  }
  for (const arquivo of arquivosNomeados) {
    const codigo = secao.locator("code").filter({ hasText: arquivo });
    await expect(codigo).toHaveText([arquivo]);
    await expect(codigo).toBeVisible();
  }
  // Texto descritivo não se apresenta como destino: a seção não tem nenhum
  // link, e a página inteira nenhum href para o repositório privado.
  await expect(secao.getByRole("link")).toHaveCount(0);
  await expect(page.locator('a[href*="github.com/jeffnunespy/portfolio-web"]')).toHaveCount(0);
  return secao;
}

test("US1 - comprovações nomeiam as fontes sem link ao repositório privado nem execução ao vivo", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#estrutura summary").click();
  const secao = await conferirFontesDescritas(page);
  for (const titulo of ["O que sustenta esta plataforma", "Integração contínua desta plataforma"]) {
    await expect(secao.getByRole("heading", { level: 3, name: titulo, exact: true })).toBeVisible();
  }
  await expect(secao.locator("figcaption")).toContainText("Esquema simplificado do build.");
  await expect(secao.locator(".ci-record")).toContainText(
    "Este registro descreve o fluxo; não representa uma execução ao vivo.",
  );
});

test("US1 - comprovação e projetos permanecem disponíveis sem JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3001/");
  await page.getByRole("link", { name: "Ver projetos em destaque" }).click();
  await expect(page.locator("#projects-title")).toBeFocused();
  await page.locator("#estrutura summary").click();
  await expect(page.locator("#estrutura .structure-notes__inner")).toBeVisible();
  await conferirFontesDescritas(page);
  await expect(
    page.getByRole("list", { name: "Etapas do fluxo de publicação" }).getByRole("listitem"),
  ).toHaveCount(3);
  await page.getByRole("link", { name: "Ver detalhes de Plataforma de Portfólio" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Plataforma de Portfólio" }),
  ).toBeVisible();
  await context.close();
});

for (const width of [390, 1280]) {
  test(`US1 - salto aos destaques por teclado permite abrir uma ficha em ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.getByRole("link", { name: "Ver projetos em destaque" }).focus();
    await page.keyboard.press("Enter");
    const title = page.getByRole("heading", { name: "Trabalho em prática.", exact: true });
    await expect(title).toBeFocused();
    await expect(title).toBeInViewport();
    const primeiroProjeto = destaques[0];
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const link = page.getByRole("link", { name: `Ver detalhes de ${primeiroProjeto.titulo}` });
    await expect(link).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(`/projetos/${primeiroProjeto.slug}`);
    await expect(
      page.getByRole("heading", { level: 1, name: primeiroProjeto.titulo }),
    ).toBeVisible();
  });
}

test("US1 - movimento reduzido preserva a leitura e elimina transições", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: perfil.nome })).toBeVisible();
  expect(
    await page
      .locator("a")
      .evaluateAll((elements) =>
        elements.every((el) => getComputedStyle(el).transitionDuration === "0s"),
      ),
  ).toBe(true);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await expect(page.locator(".survey__drawing")).toHaveCount(0);
});
