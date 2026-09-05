import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

const perfil = JSON.parse(
  readFileSync(path.join(process.cwd(), "content", "profile.json"), "utf8"),
) as { tituloPosicionamento: string; descricaoPosicionamento: string };

// Escapa o texto do perfil para uso literal em expressão regular.
const literal = (value: string) => new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

const pages = [
  {
    route: "/",
    title: literal(perfil.tituloPosicionamento),
    description: literal(perfil.descricaoPosicionamento),
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
