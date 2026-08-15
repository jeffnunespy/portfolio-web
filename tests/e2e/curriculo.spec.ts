import { test, expect } from "@playwright/test";

for (const route of [
  "/",
  "/projetos",
  "/projetos/plataforma-portfolio",
  "/sobre",
  "/curriculo",
  "/rota-inexistente",
  "/projetos/slug-inexistente",
]) {
  test(`US3 - currículo, redes e contato acessíveis em ${route}`, async ({ page }) => {
    await page.goto(route);

    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: "Currículo" })).toHaveAttribute(
      "href",
      "/curriculo",
    );

    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      /^https:\/\//,
    );
    await expect(footer.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      /^https:\/\//,
    );
    await expect(footer.getByRole("link", { name: "Contato" })).toHaveAttribute("href", /^mailto:/);
  });
}

test("US3 - página de currículo é visualizável e oferece PDF para download", async ({ page }) => {
  await page.goto("/curriculo");

  await expect(page.getByRole("heading", { level: 1, name: "Currículo" })).toBeVisible();
  await expect(
    page.getByText("Desenvolvedor Full-Stack em Formação", { exact: true }),
  ).toBeVisible();

  const downloadLink = page.getByRole("link", { name: "Baixar currículo em PDF" });
  await expect(downloadLink).toHaveAttribute("href", "/curriculo.pdf");
  await expect(downloadLink).toHaveAttribute("download");

  const pdfResponse = await page.request.get("/curriculo.pdf");
  expect(pdfResponse.ok()).toBe(true);
  expect(pdfResponse.headers()["content-type"]).toContain("application/pdf");
});
