import { test, expect } from "@playwright/test";
import { getRoadmap } from "../../lib/content";

const projetosPlanejados = getRoadmap();

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
    "Índice visual do registro",
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

test("US2 - navegação entre fichas comunica os limites sem links inválidos", async ({ page }) => {
  await page.goto("/projetos/plataforma-portfolio");

  const position = page.locator(".project-record-footer__position");
  await expect(position).toContainText("Ficha 1 de 1");
  await expect(position.locator('[aria-hidden="true"]')).toHaveText("1 / 1");
  // Ficha única: nenhum vizinho, e nenhum link apontando para lugar nenhum.
  await expect(page.getByRole("link", { name: /Ficha anterior/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Próxima ficha/ })).toHaveCount(0);
});
