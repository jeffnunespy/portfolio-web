import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/projetos",
  "/projetos/plataforma-portfolio",
  "/roadmap",
  "/sobre",
  "/curriculo",
  "/rota-inexistente",
  "/projetos/slug-inexistente",
];

for (const width of [320, 768, 1280]) {
  test(`páginas públicas não têm rolagem horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const route of routes) {
      await page.goto(route);

      const dimensions = await page.evaluate(() => ({
        bodyWidth: document.body.scrollWidth,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));

      expect(dimensions.bodyWidth, `overflow no body de ${route}`).toBeLessThanOrEqual(
        dimensions.viewportWidth,
      );
      expect(dimensions.documentWidth, `overflow no documento de ${route}`).toBeLessThanOrEqual(
        dimensions.viewportWidth,
      );
      const overflowingText = await page.locator("h1, h2, h3, p, a, li").evaluateAll((elements) =>
        elements
          .filter((element) => {
            const style = window.getComputedStyle(element);
            return (
              !element.matches(".skip-link") && element.clientWidth > 0 && style.display !== "none"
            );
          })
          .filter((element) => element.scrollWidth > element.clientWidth + 1)
          .map((element) => element.textContent?.trim() || element.tagName),
      );
      expect(overflowingText, `texto cortado em ${route}`).toEqual([]);
      await expect(page.locator("main")).toBeVisible();
    }
  });
}

test("conteúdo longo e sem espaços não rompe fichas ou ações em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/projetos");

  await page.evaluate(() => {
    const textoExtremo = "Projeto超長內容🚀".repeat(24);
    for (const selector of [
      ".project-card h2",
      ".project-card__summary",
      ".project-card .tag",
      ".project-card .chip-list li",
      ".project-card .button",
    ]) {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = textoExtremo;
      }
    }
  });

  const dimensions = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    overflowingElements: Array.from(
      document.querySelectorAll(
        ".project-card h2, .project-card__summary, .project-card .tag, .project-card .chip-list li, .project-card .button",
      ),
    )
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => element.className || element.tagName),
  }));

  expect(dimensions.bodyWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(dimensions.overflowingElements).toEqual([]);
});

test("títulos longos não rompem as entradas do roadmap em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/roadmap");

  await page.locator(".roadmap-entry h2").evaluateAll((elements) => {
    for (const element of elements) {
      element.textContent = "ProjetoComTítuloExtremamenteLongoESemEspaços".repeat(8);
    }
  });

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    overflowingElements: Array.from(
      document.querySelectorAll(".roadmap-entry h2, .roadmap-entry p, .roadmap-entry li"),
    )
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => element.textContent?.trim() || element.tagName),
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(dimensions.overflowingElements).toEqual([]);
});

test("rótulos da navegação permanecem inteiros em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");

  const lineCounts = await page.locator(".site-nav a").evaluateAll((links) =>
    links.map((link) => {
      const range = document.createRange();
      range.selectNodeContents(link);
      return range.getClientRects().length;
    }),
  );

  expect(lineCounts).toEqual([1, 1, 1, 1, 1]);
});

test("ação principal da ficha permanece legível e ocupa a coluna em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");

  const card = page.locator(".project-card__body");
  const action = card.getByRole("link", { name: /ver detalhes/i });
  const [cardBox, actionBox] = await Promise.all([card.boundingBox(), action.boundingBox()]);

  expect(cardBox).not.toBeNull();
  expect(actionBox).not.toBeNull();
  expect(actionBox!.width).toBeGreaterThanOrEqual(cardBox!.width - 1);
  expect(actionBox!.height).toBeLessThanOrEqual(72);
});

test("ficha ilustrada preserva a proporção 5:3 sem corte", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/projetos/plataforma-portfolio");

  const imageBox = await page.locator(".project-detail > .project-image").boundingBox();

  expect(imageBox).not.toBeNull();
  expect(imageBox!.width / imageBox!.height).toBeCloseTo(5 / 3, 2);
});

test("texto ampliado a 200% reflui sem corte em todas as rotas públicas", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      overflowingText: Array.from(document.querySelectorAll("h1, h2, h3, p, a, li"))
        .filter((element) => {
          const style = window.getComputedStyle(element);
          return (
            !element.matches(".skip-link") && element.clientWidth > 0 && style.display !== "none"
          );
        })
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .map((element) => element.textContent?.trim() || element.tagName),
    }));

    expect(dimensions.documentWidth, `refluxo em ${route}`).toBeLessThanOrEqual(
      dimensions.viewportWidth,
    );
    expect(dimensions.overflowingText, `texto cortado em ${route}`).toEqual([]);
  }
});

test("ficha ilustrada acompanha o tema escuro", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/projetos/plataforma-portfolio");

  const image = page.locator(".project-detail > .project-image");
  await expect(image).toHaveJSProperty("complete", true);

  const backgroundPixel = await image.evaluate((element) => {
    const imageElement = element as HTMLImageElement;
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 72;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    return Array.from(context.getImageData(1, 1, 1, 1).data.slice(0, 3));
  });

  expect(backgroundPixel).toEqual([36, 32, 25]);
});
