import { test, expect } from "@playwright/test";

test("US1 - posicionamento profissional e competências na home", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const title = page.getByRole("heading", {
    level: 1,
    name: "Desenvolvedor Full-Stack em Formação",
  });
  const description = page.getByText(
    "Com foco em backend e engenharia de software, construo aplicações web completas da especificação ao deploy, aplicando cloud e práticas de DevOps.",
  );

  await expect(title).toBeVisible();
  await expect(description).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Backend" })).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "Engenharia de Software" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Cloud" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "DevOps" })).toBeVisible();

  const titleBox = await title.boundingBox();
  const descriptionBox = await description.boundingBox();
  expect(titleBox && titleBox.y + titleBox.height).toBeLessThanOrEqual(720);
  expect(descriptionBox && descriptionBox.y + descriptionBox.height).toBeLessThanOrEqual(720);

  const projectCards = page.locator('[data-testid="project-card"]');
  const count = await projectCards.count();
  expect(count).toBe(4);

  for (const card of await projectCards.all()) {
    await expect(card.getByText(/Autoral|Acadêmico|Colaborativo|Profissional/)).toBeVisible();
    await expect(card.getByRole("img")).toBeVisible();
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
    "Sobre",
    "Currículo",
  ];

  for (const expectedLabel of expectedLabels) {
    await page.keyboard.press("Tab");
    const focusedLabel = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focusedLabel).toBe(expectedLabel);
  }
});
