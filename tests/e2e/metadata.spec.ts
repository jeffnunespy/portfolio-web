import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { getProjetosImplementados, getRoadmap } from "../../lib/content";
import { SITE_URL } from "../../lib/site";

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
  ...getProjetosImplementados().map((projeto) => ({
    route: `/projetos/${projeto.slug}`,
    title: literal(projeto.titulo),
    description: literal(projeto.resumo),
  })),
  {
    route: "/roadmap",
    title: /Roadmap/,
    description: /escopo planejado/i,
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

// A origem esperada é a mesma que o build resolve em lib/site.ts; o
// playwright.config.ts fixa NEXT_PUBLIC_SITE_URL em uma URL de validação, então
// um build feito com outra origem (ou com o fallback local) falha aqui.
const absoluta = (rota: string) => new URL(rota, SITE_URL).toString().replace(/\/$/, "");

const indexaveis = [
  { route: "/", ogImage: true },
  { route: "/projetos", ogImage: true },
  ...getProjetosImplementados().map((projeto) => ({
    route: `/projetos/${projeto.slug}`,
    ogImage: true,
  })),
  // /roadmap ainda não tem imagem Open Graph própria; fica para a auditoria de SEO.
  { route: "/roadmap", ogImage: false },
  { route: "/sobre", ogImage: true },
  { route: "/curriculo", ogImage: true },
];

for (const { route, ogImage } of indexaveis) {
  test(`canonical e Open Graph absolutos na origem configurada em ${route}`, async ({ page }) => {
    await page.goto(route);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical?.replace(/\/$/, "")).toBe(absoluta(route));
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
    expect(ogUrl?.replace(/\/$/, "")).toBe(absoluta(route));

    if (ogImage) {
      const imagem = await page
        .locator('meta[property="og:image"]')
        .first()
        .getAttribute("content");
      const url = new URL(imagem!);
      expect(url.origin).toBe(new URL(SITE_URL).origin);
      const resposta = await page.request.get(url.pathname + url.search);
      expect(resposta.ok()).toBe(true);
      expect(resposta.headers()["content-type"]).toContain("image/png");
    }
  });
}

test("sitemap lista exatamente as rotas públicas na origem configurada", async ({ request }) => {
  const resposta = await request.get("/sitemap.xml");
  expect(resposta.ok()).toBe(true);
  const locs = [...(await resposta.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);

  const esperadas = [
    "/",
    "/projetos",
    "/roadmap",
    "/sobre",
    "/curriculo",
    ...getProjetosImplementados().map((projeto) => `/projetos/${projeto.slug}`),
  ].map((rota) => new URL(rota, SITE_URL).toString());
  expect([...locs].sort()).toEqual([...esperadas].sort());

  // Escopo planejado não é página própria e não pode aparecer como ficha.
  for (const planejado of getRoadmap()) {
    expect(locs.some((loc) => loc.includes(planejado.slug))).toBe(false);
  }
  for (const loc of locs) {
    const pagina = await request.get(new URL(loc).pathname);
    expect(pagina.status(), loc).toBe(200);
  }
});

test("robots permite indexação e aponta o sitemap da origem configurada", async ({ request }) => {
  const resposta = await request.get("/robots.txt");
  expect(resposta.ok()).toBe(true);
  const texto = await resposta.text();

  expect(texto).toMatch(/^User-Agent: \*$/m);
  expect(texto).toMatch(/^Allow: \/$/m);
  expect(texto).toContain(`Sitemap: ${new URL("/sitemap.xml", SITE_URL).toString()}`);
});
