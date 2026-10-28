import { test, expect } from "@playwright/test";
import { getProjetosImplementados, getRoadmap } from "../../lib/content";

const projetosPlanejados = getRoadmap();
const projetosImplementados = getProjetosImplementados();
const atalhosFicha = [
  ["Contexto", "contexto"],
  ["Minha responsabilidade", "minha-responsabilidade"],
  ["Decisões", "decisoes"],
  ["Limitações", "limitacoes"],
] as const;

for (const width of [320, 390, 1280]) {
  for (const projeto of projetosImplementados) {
    test(`US2 - atalhos da apresentação levam às seções de ${projeto.slug} em ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/projetos/${projeto.slug}`);

      const nav = page.getByRole("navigation", { name: "Nesta ficha" });
      await expect(nav.getByRole("link")).toHaveText(atalhosFicha.map(([rotulo]) => rotulo));
      const navBox = await nav.boundingBox();
      const fontesBox = await page.locator(".project-detail__visual-index").boundingBox();
      expect(navBox!.y + navBox!.height).toBeLessThanOrEqual(fontesBox!.y);
      if (projeto.slug === "nana-silva") {
        await expect(nav).toBeInViewport({ ratio: 1 });
      }

      for (const [rotulo, id] of atalhosFicha) {
        const link = nav.getByRole("link", { name: rotulo, exact: true });
        await expect(link).toHaveAttribute("href", `#${id}`);
        const box = await link.boundingBox();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
        await link.click();
        await expect(page).toHaveURL(new RegExp(`/projetos/${projeto.slug}#${id}$`));
        await expect(page.locator(`h2#${id}`)).toBeInViewport({ ratio: 1 });
        await expect(page.locator(`h2#${id}`)).toBeFocused();
      }
    });
  }
}

test.describe("atalhos da ficha sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const projeto of projetosImplementados) {
    test(`US2 - teclado alcança e ativa os quatro atalhos de ${projeto.slug}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/projetos/${projeto.slug}`);
      const links = page.getByRole("navigation", { name: "Nesta ficha" }).getByRole("link");

      for (const [index, [, id]] of atalhosFicha.entries()) {
        await links.first().focus();
        for (let step = 0; step < index; step++) await page.keyboard.press("Tab");
        await expect(links.nth(index)).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(new RegExp(`/projetos/${projeto.slug}#${id}$`));
        await expect(page.locator(`h2#${id}`)).toBeInViewport({ ratio: 1 });
        await expect(page.locator(`h2#${id}`)).toBeFocused();
      }
    });
  }
});

test("US2 - abre um projeto pela home e exibe todas as seções obrigatórias", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Ver detalhes de Plataforma de Portfólio" }).click();

  await expect(page).toHaveURL(/\/projetos\/plataforma-portfolio$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Plataforma de Portfólio" }),
  ).toBeVisible();

  for (const section of [
    "Contexto",
    "Objetivo",
    "Funcionalidades principais",
    "Minha responsabilidade",
    "Decisões relevantes",
    "Stack",
    "Limitações conhecidas",
    "Próximos passos",
    "Apresentação e fontes",
  ]) {
    await expect(page.getByRole("heading", { name: section })).toBeVisible();
  }

  await expect(page.locator('[data-testid="decision-card"]')).toHaveCount(2);
  await expect(page.getByText("CSS puro", { exact: true })).toBeVisible();
  await expect(page.getByText("Tailwind CSS", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Estrutura de conteúdo", { exact: true })).toHaveCount(0);

  // Esta ficha descreve o próprio repositório, que é público: o índice visual
  // aponta direto para o código, não para o perfil que serve de consolação
  // quando não há destino verificável.
  const indiceVisual = page.locator(".project-detail__visual-index");
  await expect(indiceVisual.getByText("Fonte e verificação", { exact: true })).toBeVisible();
  await expect(indiceVisual.getByRole("link", { name: "Ver código-fonte" })).toBeVisible();
  await expect(
    indiceVisual.getByRole("link", { name: "Ver perfil público no GitHub" }),
  ).toHaveCount(0);
});

test("US2 - projeto planejado não resolve como ficha e vive no roadmap", async ({ page }) => {
  // Escopo planejado não é estudo de caso: /projetos/<slug> só existe para
  // software implementado, e o planejado tem superfície própria.
  for (const projeto of projetosPlanejados) {
    const resposta = await page.goto(`/projetos/${projeto.slug}`);
    expect(resposta?.status()).toBe(404);
  }

  await page.goto("/roadmap");
  await expect(page.getByRole("heading", { level: 1, name: "Roadmap" })).toBeVisible();
  for (const projeto of projetosPlanejados) {
    await expect(page.getByRole("heading", { level: 2, name: projeto.titulo })).toBeVisible();
  }

  // Stack pretendida usa uma pauta editorial, não os chips reservados às
  // tecnologias de uma ficha implementada. A HAYYANU separa ainda a base da
  // aplicação dos nove serviços específicos de Google Cloud.
  await expect(page.locator(".roadmap-entry .chip-list")).toHaveCount(0);
  const hayyanu = page
    .locator(".roadmap-entry")
    .filter({ has: page.getByRole("heading", { level: 2, name: "HAYYANU" }) });
  const stackHayyanu = hayyanu.getByRole("region", { name: "Stack prevista" });
  await expect(stackHayyanu.locator(".roadmap-stack__group")).toHaveCount(2);
  await expect(stackHayyanu.getByText("Google Cloud Platform", { exact: true })).toBeVisible();
  await expect(stackHayyanu.getByRole("listitem")).toHaveCount(18);
  await expect(
    stackHayyanu.locator(".roadmap-stack__group").nth(1).getByRole("listitem"),
  ).toHaveCount(9);

  // Nenhuma entrada de roadmap oferece link para ficha, demonstração ou código.
  await expect(page.getByRole("link", { name: /Ver detalhes de/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Abrir demonstração" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Ver código-fonte" })).toHaveCount(0);
});

test("US2 - rota direta expõe o código-fonte público como evidência", async ({ page }) => {
  await page.goto("/projetos/plataforma-portfolio");

  await expect(
    page.getByRole("heading", { level: 1, name: "Plataforma de Portfólio" }),
  ).toBeVisible();
  const codigoFonte = page.getByRole("link", { name: "Ver código-fonte" });
  await expect(codigoFonte).toBeVisible();
  await expect(codigoFonte).toHaveAttribute("href", "https://github.com/jeffnunespy/portfolio-web");
  await expect(codigoFonte).toHaveAttribute("target", "_blank");
  await expect(codigoFonte).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.getByRole("link", { name: "Solicitar acesso ao código" })).toHaveCount(0);
  await expect(
    page.locator('.project-detail__visual-index-sources a[href^="mailto:"]'),
  ).toHaveCount(0);
  await expect(page.getByText(/O código-fonte deste projeto é privado/)).toHaveCount(0);
  await expect(page.getByText("Solicitações pelo LinkedIn, no rodapé desta página")).toHaveCount(0);
});

test("US2 - rodapé da ficha permite retomar o catálogo e abrir o currículo", async ({ page }) => {
  await page.goto("/projetos/plataforma-portfolio");

  await expect(page.getByRole("link", { name: "← Todas as fichas" })).toHaveAttribute(
    "href",
    "/projetos",
  );
  await expect(page.getByRole("link", { name: "Ver currículo" })).toHaveAttribute(
    "href",
    "/curriculo",
  );
});

for (const [index, projeto] of projetosImplementados.entries()) {
  test(`US2 - navegação entre fichas respeita posição e limites de ${projeto.slug}`, async ({
    page,
  }) => {
    await page.goto(`/projetos/${projeto.slug}`);

    const position = page.locator(".project-record-footer__position");
    await expect(position).toContainText(`Ficha ${index + 1} de ${projetosImplementados.length}`);
    await expect(position.locator('[aria-hidden="true"]')).toHaveText(
      `${index + 1} / ${projetosImplementados.length}`,
    );

    const anterior = projetosImplementados[index - 1];
    const proximo = projetosImplementados[index + 1];
    for (const [name, vizinho] of [
      [/Ficha anterior/, anterior],
      [/Próxima ficha/, proximo],
    ] as const) {
      const link = page.getByRole("link", { name });
      if (vizinho) {
        await expect(link).toHaveAttribute("href", `/projetos/${vizinho.slug}`);
        await expect(link).toContainText(vizinho.titulo);
        await link.click();
        await expect(page.getByRole("heading", { level: 1, name: vizinho.titulo })).toBeVisible();
        await page.goto(`/projetos/${projeto.slug}`);
      } else {
        await expect(link).toHaveCount(0);
      }
    }
  });
}

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1280, height: 720 },
]) {
  test(`US2 - ficha direta de Nana informa validação antes da demonstração em ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/projetos/nana-silva");

    const classificacao = page.getByRole("group", { name: "Classificação do projeto" });
    const validacao = classificacao.getByText("Em validação", { exact: true });
    await expect(classificacao.getByText("Em andamento", { exact: true })).toBeInViewport({
      ratio: 1,
    });
    await expect(validacao).toBeInViewport({ ratio: 1 });

    const demonstracao = page.getByRole("link", { name: "Abrir demonstração" });
    const validacaoBox = await validacao.boundingBox();
    const demonstracaoBox = await demonstracao.boundingBox();
    expect(validacaoBox).not.toBeNull();
    expect(demonstracaoBox).not.toBeNull();
    expect(validacaoBox!.y + validacaoBox!.height).toBeLessThan(demonstracaoBox!.y);
  });
}

test("US2 - Nana Silva aparece no catálogo e oferece acesso ao site publicado", async ({
  page,
}) => {
  await page.goto("/projetos");
  await expect(page.getByRole("link", { name: "Ver detalhes de Nana Silva" })).toBeVisible();
  for (const route of ["/", "/projetos"]) {
    await page.goto(route);
    const card = page
      .getByTestId("project-card")
      .filter({ has: page.getByRole("heading", { name: "Nana Silva", exact: true }) });
    await expect(card.locator("img")).toHaveCount(0);
    await expect(card.getByRole("link", { name: "Solicitar acesso ao código" })).toHaveAttribute(
      "href",
      /^mailto:/,
    );
  }

  await page.goto("/");
  await page.getByRole("link", { name: "Ver detalhes de Nana Silva" }).click();
  await expect(page).toHaveURL(/\/projetos\/nana-silva$/);
  await expect(page.getByRole("heading", { level: 1, name: "Nana Silva" })).toBeVisible();
  await expect(page.getByText("Em andamento", { exact: true })).toBeVisible();
  await expect(page.getByText(/ambiente de validação/).first()).toBeVisible();
  const demonstracao = page.getByRole("link", { name: "Abrir demonstração" });
  await expect(demonstracao).toHaveAttribute("href", "https://nana-silva-validacao.pages.dev/");
  await expect(demonstracao).toHaveAttribute("target", "_blank");
  await expect(demonstracao).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.getByText(/O código-fonte deste projeto é privado/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Solicitar acesso ao código" })).toHaveAttribute(
    "href",
    /^mailto:/,
  );
  await expect(page.getByRole("link", { name: "Ver código-fonte" })).toHaveCount(0);

  await expect(page.locator("img.project-image")).toHaveCount(0);
  const nana = projetosImplementados.find((projeto) => projeto.slug === "nana-silva")!;
  expect(nana.imagemApresentacao).toBeTruthy();
  const recurso = await page.request.get(nana.imagemApresentacao);
  expect(recurso.ok()).toBe(true);
  const og = page.locator('meta[property="og:image"]').first();
  await expect(og).toHaveAttribute("content", /nana-silva/);
  const ogResponse = await page.request.get(
    (await og.getAttribute("content"))!.replace(/^https?:\/\/[^/]+/, ""),
  );
  expect(ogResponse.ok()).toBe(true);
});
