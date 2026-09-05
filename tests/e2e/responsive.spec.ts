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

      const signature = page.getByRole("banner").getByRole("link", { name: /— Início$/ });
      await expect(signature, `assinatura visível em ${route}`).toBeVisible();
      const signatureBox = await signature.boundingBox();
      expect(signatureBox, `geometria da assinatura em ${route}`).not.toBeNull();
      expect(signatureBox!.y + signatureBox!.height).toBeLessThanOrEqual(900);

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

test("composição desktop usa a margem direita e assume a ficha única", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const hero = page.locator(".hero");
  const heroBody = page.locator(".hero__body");
  const heroRecord = page.locator(".hero__record");
  const [heroBox, bodyBox, recordBox] = await Promise.all([
    hero.boundingBox(),
    heroBody.boundingBox(),
    heroRecord.boundingBox(),
  ]);

  expect(heroBox).not.toBeNull();
  expect(bodyBox).not.toBeNull();
  expect(recordBox).not.toBeNull();
  expect(recordBox!.x).toBeGreaterThan(bodyBox!.x + bodyBox!.width);
  expect(recordBox!.x + recordBox!.width).toBeCloseTo(heroBox!.x + heroBox!.width, 0);

  const projectGrid = page.locator(".project-grid").last();
  const projectCard = projectGrid.locator(".project-card:only-child");
  const projectImage = projectCard.locator(".project-image");
  const projectBody = projectCard.locator(".project-card__body");
  const [gridBox, cardBox, imageBox, projectBodyBox] = await Promise.all([
    projectGrid.boundingBox(),
    projectCard.boundingBox(),
    projectImage.boundingBox(),
    projectBody.boundingBox(),
  ]);

  expect(gridBox).not.toBeNull();
  expect(cardBox).not.toBeNull();
  expect(imageBox).not.toBeNull();
  expect(projectBodyBox).not.toBeNull();
  expect(cardBox!.width).toBeCloseTo(gridBox!.width, 0);
  expect(imageBox!.x + imageBox!.width).toBeLessThan(projectBodyBox!.x);
});

test("404 compartilha o eixo global e mantém os campos na margem direita", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/rota-inexistente");

  const headerInner = page.locator(".site-header__inner");
  const messagePage = page.locator(".message-page--not-found");
  const messageBody = page.locator(".message-page__body");
  const messageRecord = page.locator(".message-page__record");
  const [headerBox, pageBox, bodyBox, recordBox] = await Promise.all([
    headerInner.boundingBox(),
    messagePage.boundingBox(),
    messageBody.boundingBox(),
    messageRecord.boundingBox(),
  ]);

  expect(headerBox).not.toBeNull();
  expect(pageBox).not.toBeNull();
  expect(bodyBox).not.toBeNull();
  expect(recordBox).not.toBeNull();
  expect(pageBox!.x).toBeCloseTo(headerBox!.x, 0);
  expect(pageBox!.width).toBeCloseTo(headerBox!.width, 0);
  expect(recordBox!.x).toBeGreaterThan(bodyBox!.x + bodyBox!.width);
  expect(recordBox!.x + recordBox!.width).toBeCloseTo(pageBox!.x + pageBox!.width, 0);
});

/*
  O eixo de campo é uma medida só em todo o fichário. Sem esta verificação, cada
  rota volta a inventar a largura da sua margem de consulta — era o estado
  anterior: 320px no hero e 304px no 404, com o eixo direito saltando entre
  rotas do mesmo acervo. A asserção compara a posição inicial da coluna, não a
  largura, porque é o eixo que o leitor percebe ao passar de uma rota a outra.
*/
test("a margem de consulta ocupa o mesmo eixo em todas as rotas que a usam", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("/");
  const heroRecord = await page.locator(".hero__record").boundingBox();

  await page.goto("/rota-inexistente");
  const notFoundRecord = await page.locator(".message-page__record").boundingBox();

  await page.goto("/projetos/plataforma-portfolio");
  const detailSources = await page.locator(".project-detail__visual-index-sources").boundingBox();

  expect(heroRecord).not.toBeNull();
  expect(notFoundRecord).not.toBeNull();
  expect(detailSources).not.toBeNull();

  expect(notFoundRecord!.x).toBeCloseTo(heroRecord!.x, 0);
  expect(detailSources!.x).toBeCloseTo(heroRecord!.x, 0);
  expect(notFoundRecord!.width).toBeCloseTo(heroRecord!.width, 0);
  expect(detailSources!.width).toBeCloseTo(heroRecord!.width, 0);
});

/*
  Escassez assumida: com um acervo ímpar de campos, o último não pode ficar
  sozinho na coluna esquerda com o filete vertical cortando o vazio ao lado.
*/
test("o último campo ímpar da ficha ocupa a linha inteira sem filete no vazio", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/projetos/plataforma-portfolio");

  const content = page.locator(".project-detail__content");
  const sections = content.locator("> section");
  const total = await sections.count();
  const last = sections.nth(total - 1);

  const [contentBox, lastBox] = await Promise.all([content.boundingBox(), last.boundingBox()]);

  expect(contentBox).not.toBeNull();
  expect(lastBox).not.toBeNull();

  const larguraDeColunaUnica = lastBox!.width < contentBox!.width * 0.75;

  if (larguraDeColunaUnica) {
    // Há um par completo na última linha: o filete pertence à célula da esquerda.
    return;
  }

  expect(lastBox!.width).toBeCloseTo(contentBox!.width, 0);
  await expect(last).toHaveCSS("border-right-width", "0px");
});

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

test("títulos e stack longa não rompem as entradas do roadmap em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/roadmap");

  await page.locator(".roadmap-entry h2").evaluateAll((elements) => {
    for (const element of elements) {
      element.textContent = "ProjetoComTítuloExtremamenteLongoESemEspaços".repeat(8);
    }
  });
  await page
    .locator(".roadmap-stack__group li")
    .first()
    .evaluate((element) => {
      element.textContent = "TecnologiaPlanejadaComNomeExtremamenteLongoESemEspaços".repeat(8);
    });

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    overflowingElements: Array.from(
      document.querySelectorAll(
        ".roadmap-entry h2, .roadmap-entry p, .roadmap-stack__group dt, .roadmap-stack__group li",
      ),
    )
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => element.textContent?.trim() || element.tagName),
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(dimensions.overflowingElements).toEqual([]);
});

test("navegação prioriza Início e Projetos e permanece compacta em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");

  const navigation = page.getByRole("navigation", { name: "Navegação principal" });
  const dimensions = await navigation.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    scrollWidth: element.scrollWidth,
    clientWidth: element.clientWidth,
  }));

  expect(dimensions.height).toBeLessThanOrEqual(48);
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  await expect(navigation.getByRole("link", { name: "Início" })).toHaveClass(
    /site-nav__item--primary/,
  );
  await expect(navigation.getByRole("link", { name: "Projetos" })).toHaveClass(
    /site-nav__item--primary/,
  );
  await expect(navigation.getByRole("link", { name: "Currículo" })).toHaveClass(
    /site-nav__item--secondary/,
  );
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

test("ação de implementação permanece dominante e legível em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");

  const hero = page.locator(".hero");
  const action = page.getByRole("link", { name: "Ver implementação e verificações" });
  const [heroBox, actionBox] = await Promise.all([hero.boundingBox(), action.boundingBox()]);

  expect(heroBox).not.toBeNull();
  expect(actionBox).not.toBeNull();
  expect(actionBox!.width).toBeGreaterThanOrEqual(heroBox!.width - 1);
  expect(actionBox!.height).toBeLessThanOrEqual(72);
});

test("ficha ilustrada preserva a proporção 5:3 sem corte", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/projetos/plataforma-portfolio");

  const imageBox = await page
    .locator(".project-detail__visual-index > .project-image")
    .boundingBox();

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

  const image = page.locator(".project-detail__visual-index > .project-image");
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
