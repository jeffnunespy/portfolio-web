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
    "Links relacionados",
  ]) {
    await expect(page.getByRole("heading", { name: section })).toBeVisible();
  }

  await expect(page.locator('[data-testid="decision-card"]')).toHaveCount(2);
  await expect(page.getByText("CSS puro", { exact: true })).toBeVisible();
  await expect(page.getByText("Tailwind CSS", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Estrutura de conteúdo", { exact: true })).toHaveCount(0);
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
  // Nenhuma entrada de roadmap oferece link para ficha, demonstração ou código.
  await expect(page.getByRole("link", { name: /Ver detalhes de/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Abrir demonstração" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Acessar repositório" })).toHaveCount(0);
});

test("US2 - rota direta funciona e repositório privado informa o estado do contato", async ({
  page,
}) => {
  await page.goto("/projetos/plataforma-portfolio");

  await expect(
    page.getByRole("heading", { level: 1, name: "Plataforma de Portfólio" }),
  ).toBeVisible();
  // A evidência disponível lidera; a ressalva do código privado vem depois dela.
  await expect(page.getByRole("link", { name: "Ver perfil público no GitHub" })).toBeVisible();
  await expect(
    page.getByText(
      "O código-fonte deste projeto é privado e pode ser disponibilizado para avaliação mediante solicitação.",
    ),
  ).toBeVisible();
  // Com contato configurado no perfil, a ressalva termina numa ação: o pedido
  // de acesso vira um mailto assunto-preenchido, e o encaminhamento para o
  // LinkedIn — que só existe enquanto não há e-mail — sai da página.
  const solicitarAcesso = page.getByRole("link", { name: "Solicitar acesso ao código" });
  await expect(solicitarAcesso).toBeVisible();
  await expect(solicitarAcesso).toHaveAttribute(
    "href",
    /^mailto:[^@\s]+@[^?\s]+\?subject=Acesso ao código do projeto$/,
  );
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
