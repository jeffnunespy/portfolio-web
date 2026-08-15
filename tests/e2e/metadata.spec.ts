import { test, expect } from "@playwright/test";

const pages = [
  {
    route: "/",
    title: /Desenvolvedor Full-Stack em Formação/,
    description: /foco em backend e engenharia de software/i,
  },
  {
    route: "/projetos",
    title: /Projetos/,
    description: /estudos de caso/i,
  },
  {
    route: "/projetos/plataforma-portfolio",
    title: /Plataforma de Portfólio/,
    description: /Next\.js/i,
  },
  {
    route: "/sobre",
    title: /Sobre/,
    description: /trajetória/i,
  },
  {
    route: "/curriculo",
    title: /Currículo/,
    description: /competências/i,
  },
  {
    route: "/rota-inexistente",
    title: /Página não encontrada/,
    description: /página solicitada não está disponível/i,
  },
  {
    route: "/projetos/slug-inexistente",
    title: /Projeto não encontrado/,
    description: /projeto solicitado não está disponível/i,
  },
];

for (const expected of pages) {
  test(`metadados próprios em ${expected.route}`, async ({ page }) => {
    await page.goto(expected.route);

    await expect(page).toHaveTitle(expected.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      expected.description,
    );
  });
}
