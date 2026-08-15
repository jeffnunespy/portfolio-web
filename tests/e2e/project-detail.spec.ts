import { test, expect } from "@playwright/test";

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
    "Situação atual",
    "Limitações conhecidas",
    "Próximos passos",
    "Links relacionados",
  ]) {
    await expect(page.getByRole("heading", { name: section })).toBeVisible();
  }

  await expect(page.locator('[data-testid="decision-card"]')).toHaveCount(2);
});

test("US2 - rota direta funciona e repositório privado oferece contato", async ({ page }) => {
  await page.goto("/projetos/sistema-helpdesk");

  await expect(
    page.getByRole("heading", { level: 1, name: "Sistema de Suporte/Helpdesk" }),
  ).toBeVisible();
  await expect(page.getByText("código privado — disponível mediante solicitação")).toBeVisible();
  await expect(page.getByRole("link", { name: "Solicitar acesso ao código" })).toHaveAttribute(
    "href",
    /^mailto:/,
  );
});
