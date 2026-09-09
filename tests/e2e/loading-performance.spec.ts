import { expect, test } from "@playwright/test";

test("home evita trabalho redundante sem perder navegação cliente imediata", async ({ page }) => {
  const requisicoesRsc: string[] = [];
  const documentos: string[] = [];
  const fontes = new Set<string>();
  const tamanhosDasFontes: Promise<number>[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());

    if (url.searchParams.has("_rsc")) requisicoesRsc.push(url.pathname);
    if (request.resourceType() === "document") documentos.push(url.pathname);
    if (url.pathname.endsWith(".woff2")) fontes.add(url.pathname);
  });
  page.on("response", (response) => {
    if (new URL(response.url()).pathname.endsWith(".woff2")) {
      tamanhosDasFontes.push(response.body().then((body) => body.byteLength));
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // O cabeçalho não deve antecipar a própria rota, mas mantém pronto um
  // destino secundário para cumprir o contrato de navegação sem espera.
  expect(requisicoesRsc.filter((pathname) => pathname === "/")).toHaveLength(0);
  expect(requisicoesRsc).toContain("/curriculo");

  // O orçamento tipográfico da primeira visita é: Zilla Slab 600/700,
  // Archivo variável e Archivo Narrow variável.
  expect(fontes.size).toBe(4);
  expect(
    (await Promise.all(tamanhosDasFontes)).reduce((total, bytes) => total + bytes, 0),
  ).toBeLessThanOrEqual(100 * 1024);

  // Expor o rodapé não deve repetir os prefetches iniciados pelo cabeçalho.
  const requisicoesAntesDoRodape = [...requisicoesRsc];
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  expect(requisicoesRsc).toEqual(requisicoesAntesDoRodape);

  await page.evaluate(() => {
    Reflect.set(window, "__portfolioNavigationMarker", true);
  });
  const documentosAntesDoClique = documentos.length;

  await page.locator('.site-header a[href="/curriculo"]').click();

  await expect(page).toHaveURL(/\/curriculo$/);
  await expect(page.getByRole("heading", { level: 1, name: "Jefferson Nunes" })).toBeVisible();
  expect(await page.evaluate(() => Reflect.get(window, "__portfolioNavigationMarker"))).toBe(true);
  expect(documentos).toHaveLength(documentosAntesDoClique);
});

test("rota interna não antecipa a si mesma e mantém os demais destinos prontos", async ({
  page,
}) => {
  const requisicoesRsc: string[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());

    if (url.searchParams.has("_rsc")) requisicoesRsc.push(url.pathname);
  });

  await page.goto("/curriculo");
  await page.waitForLoadState("networkidle");

  expect(requisicoesRsc.filter((pathname) => pathname === "/curriculo")).toHaveLength(0);
  expect(requisicoesRsc).toContain("/");
});
