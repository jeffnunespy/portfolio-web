import { test, expect, type Page } from "@playwright/test";
import { getProjetosImplementados } from "../../lib/content";

const routes = [
  "/",
  "/projetos",
  ...getProjetosImplementados().map((p) => `/projetos/${p.slug}`),
  "/roadmap",
  "/sobre",
  "/curriculo",
  "/rota-inexistente",
  "/projetos/slug-inexistente",
];

async function expectReflow(page: Page, route: string) {
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    viewport: document.documentElement.clientWidth,
    overflowing: Array.from(
      document.querySelectorAll(
        "main h1,main h2,main h3,main p,main a,main li,main dt,main dd,main summary,footer h2,footer p,footer a",
      ),
    )
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return (
          r.left < -1 ||
          r.right > innerWidth + 1 ||
          (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1)
        );
      })
      .map((el) => ({ text: el.textContent?.trim().slice(0, 100), className: el.className })),
  }));
  expect(dimensions.documentWidth, `documento: ${route}`).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.bodyWidth, `body: ${route}`).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.overflowing, `conteúdo cortado: ${route}`).toEqual([]);
}

for (const width of [320, 390, 768, 1280]) {
  test(`páginas públicas e navegação cabem em ${width}px com alvos de 44px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expectReflow(page, route);
      const assinatura = page.getByRole("banner").getByRole("link", { name: /— Início$/ });
      await expect(assinatura).toBeVisible();
      const box = await assinatura.boundingBox();
      expect(box!.y + box!.height).toBeLessThanOrEqual(900);
      const targets = await page.locator(".site-nav a").evaluateAll((elements) =>
        elements.map((el) => {
          const r = el.getBoundingClientRect();
          const hit = document
            .elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
            ?.closest("a");
          return { width: r.width, height: r.height, correct: hit === el };
        }),
      );
      expect(targets).toHaveLength(5);
      expect(targets.every((t) => t.width >= 44 && t.height >= 44 && t.correct)).toBe(true);
    }
  });
}

for (const width of [320, 768, 1280]) {
  test(`texto a 200% reflui sem perda, inclusive detalhes abertos, em ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
      await page.evaluate(() => document.fonts.ready);
      await expectReflow(page, route);
      await page
        .locator("details")
        .evaluateAll((elements) => elements.forEach((el) => el.setAttribute("open", "")));
      await expectReflow(page, route + " (detalhes abertos)");
    }
  });
}

test("moldura, projetos e estados de recuperação compartilham o contêiner", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const [route, selector] of [
    ["/", ".home-intro"],
    ["/projetos", ".page-section"],
    ["/projetos/plataforma-portfolio", ".project-detail"],
    ["/rota-inexistente", ".message-page"],
    ["/projetos/slug-inexistente", ".message-page"],
  ]) {
    await page.goto(route);
    const header = await page.locator(".site-header__inner").boundingBox();
    const surface = await page.locator(selector).boundingBox();
    expect(header).not.toBeNull();
    expect(surface).not.toBeNull();
    expect(surface!.x).toBeCloseTo(header!.x, 0);
    expect(surface!.width).toBeCloseTo(header!.width, 0);
    await expectReflow(page, route);
  }
});

test("campos do estudo de caso e sua última seção usam o espaço sem coluna vazia", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/projetos/plataforma-portfolio");
  const content = await page.locator(".project-detail__content").boundingBox();
  const last = await page.locator(".project-detail__content > section").last().boundingBox();
  expect(last!.width).toBeCloseTo(content!.width, 0);
  expect(last!.x).toBeCloseTo(content!.x, 0);
});

test("conteúdo longo e sem espaços não rompe projetos, ações ou detalhes em 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/projetos");
  await page
    .locator("details")
    .evaluateAll((elements) => elements.forEach((el) => el.setAttribute("open", "")));
  await page.evaluate(() => {
    for (const selector of [
      ".project-card h2",
      ".project-card__summary",
      ".project-card .tag",
      ".project-card .chip-list li",
      ".project-card .button",
      ".project-card summary",
      ".detail-content p",
    ]) {
      const el = document.querySelector(selector);
      if (el) el.textContent = "Projeto超長內容🚀".repeat(24);
    }
  });
  await expectReflow(page, "/projetos (conteúdo extremo)");
});

test("títulos e stack longa não rompem as entradas do roadmap em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/roadmap");
  await page
    .locator(".roadmap-entry h2, .roadmap-stack__group li")
    .evaluateAll((elements) =>
      elements.forEach(
        (el) =>
          (el.textContent = "TecnologiaPlanejadaComNomeExtremamenteLongoESemEspaços".repeat(8)),
      ),
    );
  await expectReflow(page, "/roadmap (conteúdo extremo)");
});

test("navegação preserva prioridade e rótulos compactos em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(nav.getByRole("link", { name: "Início", exact: true })).toHaveClass(
    /site-nav__item--primary/,
  );
  await expect(nav.getByRole("link", { name: "Projetos", exact: true })).toHaveClass(
    /site-nav__item--primary/,
  );
  await expect(nav.getByRole("link", { name: "Currículo" })).toHaveClass(
    /site-nav__item--secondary/,
  );
  const rect = await nav.boundingBox();
  expect(rect!.height).toBeLessThanOrEqual(48);
});

test("ações de projeto e implementação são legíveis e ocupam a coluna no celular", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  for (const container of [
    page.locator(".home-intro__identity"),
    ...(await page.locator(".project-card__proof").all()),
  ]) {
    const action = container.locator(".button--primary").first();
    const [parent, box] = await Promise.all([container.boundingBox(), action.boundingBox()]);
    expect(box!.width).toBeGreaterThanOrEqual(parent!.width - 1);
    expect(box!.height).toBeLessThanOrEqual(72);
  }
});

test("imagem dos demais projetos mantém a proporção 5:3 sem recorte", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/projetos/plataforma-portfolio");
  const box = await page.locator(".project-detail__visual-index > .project-image").boundingBox();
  expect(box!.width / box!.height).toBeCloseTo(5 / 3, 2);
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`imagem de projeto preserva o tema noturno com preferência ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/projetos/plataforma-portfolio");
    const image = page.locator(".project-detail__visual-index > .project-image");
    await expect(image).toHaveJSProperty("complete", true);
    const pixel = await image.evaluate((el) => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 72;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(el as HTMLImageElement, 0, 0, 120, 72);
      return Array.from(ctx.getImageData(1, 1, 1, 1).data.slice(0, 3));
    });
    expect(pixel).toEqual([18, 22, 21]);
  });
}
