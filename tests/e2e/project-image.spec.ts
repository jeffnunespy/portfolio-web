import { createHash } from "node:crypto";
import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { imageServer, imagePath } from "./helpers/image-server";

const route = "/projetos/plataforma-portfolio";
const hash = (data: Buffer) => createHash("sha256").update(data).digest("hex");
const surface = (page: Page) => page.locator(".project-image__surface");
const caption = (page: Page) => page.locator(".project-image__caption");
const layoutBox = (page: Page) =>
  surface(page).evaluate((el) => {
    const box = el.getBoundingClientRect();
    return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height };
  });

async function ready(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          Array.from(document.fonts).some((f) => f.status === "loaded") &&
          Array.from(document.fonts).every((f) => f.status !== "loading"),
      ),
    )
    .toBe(true);
}

async function hydrated(page: Page) {
  await page.waitForFunction(() => {
    const header = document.querySelector(".site-header");
    return header && Object.keys(header).some((key) => key.startsWith("__reactProps$"));
  });
}

async function evidence(page: Page, info: TestInfo, name: string) {
  await info.attach(`${name}-dom`, { body: await page.content(), contentType: "text/html" });
  await info.attach(`${name}-visual`, {
    body: await page.locator("figure.project-image").screenshot({ animations: "disabled" }),
    contentType: "image/png",
  });
  await info.attach(`${name}-tree`, {
    body: await caption(page).ariaSnapshot(),
    contentType: "text/plain",
  });
}

async function neutral(page: Page) {
  await expect(surface(page)).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("figure.project-image img")).toHaveCount(0);
  await expect(page.getByText("Imagem indisponível", { exact: true })).toHaveCount(0);
  await expect(caption(page)).toContainText("Se a prévia não aparecer");
  const link = caption(page).getByRole("link", {
    name: "Ler descrição de Plataforma de Portfólio",
  });
  await expect(link).toHaveAttribute("href", "#contexto");
  await expect(link).toBeVisible();
}

for (const width of [390, 1280]) {
  for (const phase of ["before", "after", "nojs"] as const) {
    for (const mode of ["valid", "transparent", "network", "404", "500", "invalid"] as const) {
      test(`AUD03-001 ${width}px ${phase} ${mode}`, async ({ browser }, info) => {
        const server = await imageServer(mode);
        const context = await browser.newContext({
          javaScriptEnabled: phase !== "nojs",
          viewport: { width, height: 900 },
          reducedMotion: "reduce",
        });
        const page = await context.newPage();
        const errors: string[] = [];
        let clientFinished = false;
        const completed = (url: string) => {
          if (new URL(url).pathname === imagePath) clientFinished = true;
        };
        page.on("requestfinished", (request) => completed(request.url()));
        page.on("requestfailed", (request) => completed(request.url()));
        page.on("pageerror", (error) => errors.push(error.message));
        try {
          const response = await page.goto(server.origin + route, {
            waitUntil: "domcontentloaded",
          });
          expect(response?.status()).toBe(200);
          const html = await response!.text();
          await info.attach("resposta-ssr", { body: html, contentType: "text/html" });
          expect(html).toContain('class="project-image__surface"');
          expect(html).toContain("Se a prévia não aparecer");
          expect(response!.headers()["content-security-policy"]).toContain("object-src 'none'");
          await surface(page).scrollIntoViewIfNeeded();
          await ready(page);
          await surface(page).scrollIntoViewIfNeeded();
          await expect.poll(() => server.requests).toBeGreaterThan(0);
          const before = await layoutBox(page);
          await neutral(page);
          const pending = await surface(page).screenshot({ animations: "disabled" });
          await evidence(page, info, "pendente");
          if (phase === "after") {
            server.releaseScripts();
            await hydrated(page);
          }
          server.releaseImage();
          await expect.poll(() => server.finished && clientFinished).toBe(true);
          if (mode === "valid" || mode === "transparent") {
            await expect
              .poll(async () => hash(await surface(page).screenshot({ animations: "disabled" })))
              .not.toBe(hash(pending));
          } else {
            expect(hash(await surface(page).screenshot({ animations: "disabled" }))).toBe(
              hash(pending),
            );
          }
          if (phase === "before") {
            // O recurso já terminou, mas o runtime que inicia a hidratação segue retido.
            expect(
              await page
                .locator(".site-header")
                .evaluate((el) => Object.keys(el).some((k) => k.startsWith("__reactProps$"))),
            ).toBe(false);
            const preHydration = await surface(page).screenshot({ animations: "disabled" });
            server.releaseScripts();
            await hydrated(page);
            expect(hash(await surface(page).screenshot({ animations: "disabled" }))).toBe(
              hash(preHydration),
            );
          }
          await neutral(page);
          expect(await layoutBox(page)).toEqual(before);
          await evidence(page, info, "final");
          const link = caption(page).getByRole("link");
          await link.focus();
          await page.keyboard.press("Tab");
          await page.keyboard.press("Shift+Tab");
          await expect(link).toBeFocused();
          expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe("none");
          await page.keyboard.press("Enter");
          await expect(page.locator("h2#contexto")).toBeFocused();
          expect(errors).toEqual([]);
        } finally {
          await context.close();
          await server.close();
        }
      });
    }
  }

  for (const mode of ["valid", "invalid"] as const) {
    test(`AUD03-001 ${width}px ${mode === "valid" ? "cache válido" : "recurso inválido aquecido (cache ou reconsulta)"} antes da hidratação`, async ({
      browser,
    }, info) => {
      const server = await imageServer(mode, true);
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      try {
        server.releaseImage();
        await page.goto(server.origin + "/__aud03/warm");
        await expect(page.locator("img")).toHaveJSProperty("complete", true);
        await expect(page.locator("img")).toHaveJSProperty(
          "naturalWidth",
          mode === "valid" ? 1000 : 0,
        );
        const warmedRequests = server.requests;
        await page.goto(server.origin + route, { waitUntil: "domcontentloaded" });
        await ready(page);
        await neutral(page);
        await surface(page).scrollIntoViewIfNeeded();
        const originalBackground = await surface(page).evaluate(
          (el) => (el as HTMLElement).style.backgroundImage,
        );
        await surface(page).evaluate((el) => {
          (el as HTMLElement).style.backgroundImage = "none";
        });
        const empty = await surface(page).screenshot({ animations: "disabled" });
        await surface(page).evaluate((el, background) => {
          (el as HTMLElement).style.backgroundImage = background;
        }, originalBackground);
        if (mode === "valid") {
          await expect
            .poll(async () => hash(await surface(page).screenshot({ animations: "disabled" })))
            .not.toBe(hash(empty));
        } else
          expect(hash(await surface(page).screenshot({ animations: "disabled" }))).toBe(
            hash(empty),
          );
        const cached = await surface(page).screenshot({ animations: "disabled" });
        const resource = await page.evaluate(
          (path) =>
            performance
              .getEntriesByType("resource")
              .filter((e) => new URL(e.name).pathname === path)
              .map((e) => ({
                transferSize: (e as PerformanceResourceTiming).transferSize,
                decodedBodySize: (e as PerformanceResourceTiming).decodedBodySize,
              })),
          imagePath,
        );
        // Firefox pode reutilizar imagem decodificada sem publicar ResourceTiming.
        // Cache é demonstrado por pintura e ausência de nova requisição.
        await info.attach("cache-observacao", {
          body: JSON.stringify({
            mode,
            resource,
            warmedRequests,
            finalRequests: server.requests,
            originalBackground,
            emptyHash: hash(empty),
            cachedHash: hash(cached),
          }),
          contentType: "application/json",
        });
        if (mode === "valid") {
          expect(resource.every((e) => e.transferSize === 0)).toBe(true);
          expect(server.requests).toBe(warmedRequests);
        }
        // WebKit pode descartar bytes inválidos e consultá-los novamente.
        // Não exigir cache de um erro; exigir sempre a apresentação neutra.

        server.releaseScripts();
        await hydrated(page);
        expect(hash(await surface(page).screenshot({ animations: "disabled" }))).toBe(hash(cached));
        await evidence(page, info, "cache");
        await info.attach("cache-transporte", {
          body: JSON.stringify({
            mode,
            resource,
            warmedRequests,
            finalRequests: server.requests,
            reusedWithoutNetwork: server.requests === warmedRequests,
          }),
          contentType: "application/json",
        });
      } finally {
        await context.close();
        await server.close();
      }
    });
  }

  test(`AUD03-001 ${width}px origem antiga não sobrescreve a atual`, async ({ browser }, info) => {
    const server = await imageServer("network");
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    try {
      server.releaseScripts();
      await page.goto(server.origin + route, { waitUntil: "domcontentloaded" });
      await hydrated(page);
      await ready(page);
      const pending = await surface(page).screenshot({ animations: "disabled" });
      await expect.poll(() => server.requests).toBeGreaterThan(0);
      // O rerender React é coberto no unitário. Aqui é exercitado o mecanismo
      // nativo de troca da propriedade CSS emitida pelo componente, sob corrida.
      await surface(page).evaluate((el) => {
        (el as HTMLElement).style.backgroundImage = 'url("/__aud03/source-b.svg")';
      });
      await expect
        .poll(async () => hash(await surface(page).screenshot({ animations: "disabled" })))
        .not.toBe(hash(pending));
      const current = await surface(page).screenshot({ animations: "disabled" });
      server.releaseImage();
      await expect.poll(() => server.finished).toBe(true);
      expect(hash(await surface(page).screenshot({ animations: "disabled" }))).toBe(hash(current));
      await neutral(page);
      await evidence(page, info, "origem-atual");
    } finally {
      await context.close();
      await server.close();
    }
  });

  for (const listing of ["/", "/projetos"]) {
    test(`AUD03-001 ${width}px orientação em ${listing} sem JS`, async ({ browser }) => {
      const server = await imageServer("404");
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      try {
        server.releaseImage();
        await page.goto(server.origin + listing, { waitUntil: "domcontentloaded" });
        const card = page.getByTestId("project-card").filter({
          has: page.getByRole("heading", { name: "Plataforma de Portfólio", exact: true }),
        });
        const link = card.getByRole("link", { name: "Ler descrição de Plataforma de Portfólio" });
        await expect(link).toHaveAttribute("href", route + "#contexto");
        await link.click();
        await expect(page.locator("h2#contexto")).toBeFocused();
        await expect(page.locator("h2#contexto")).toBeInViewport();
      } finally {
        await context.close();
        await server.close();
      }
    });
  }
}
