import { test, expect } from "@playwright/test";
import {
  esperarHistoricoFragmentos,
  observarHistoricoFragmentos,
} from "./helpers/fragment-history";

test.beforeEach(async ({ page }) => {
  await observarHistoricoFragmentos(page);
});

for (const entrada of ["direta", "query direta", "query alterada"]) {
  test(`issue #45 - ${entrada}: Tab após skip da 404 preserva foco sob latência RSC`, async ({
    page,
  }) => {
    const respostas: number[] = [];
    await page.route("**/rota-inexistente?*", async (rota) => {
      if (!rota.request().headers().rsc) return rota.continue();
      const resposta = await rota.fetch();
      await new Promise((resolve) => setTimeout(resolve, 300));
      respostas.push(resposta.status());
      await rota.fulfill({ response: resposta });
    });
    const resposta = await page.goto(
      "/rota-inexistente" + (entrada === "query direta" ? "?q=2" : ""),
    );
    expect(resposta?.status()).toBe(404);
    await page.waitForFunction(() => {
      const marca = document.querySelector("header a");
      return (
        history.state !== null &&
        !!marca &&
        Object.keys(marca).some((chave) => chave.startsWith("__reactFiber"))
      );
    });
    await esperarHistoricoFragmentos(page);
    await page.waitForLoadState("networkidle");
    if (entrada === "query alterada") {
      await page.evaluate(() => history.pushState(null, "", "?q=2"));
      await page.waitForTimeout(100);
    }
    const entradas = await page.evaluate(() => history.length);
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
    await page.waitForTimeout(150);
    await page.keyboard.press("Tab");
    const voltar = page.getByRole("link", { name: "Voltar para a página inicial" });
    await expect(voltar).toBeFocused();
    // Detecta inclusive uma perda transitória de foco depois do Tab.
    await page.evaluate(() => {
      document.addEventListener(
        "focusin",
        () => {
          document.documentElement.dataset.focoDeslocado = "true";
        },
        { once: true },
      );
    });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    await test.info().attach("respostas-rsc", {
      body: JSON.stringify(respostas),
      contentType: "application/json",
    });
    await expect(voltar).toBeFocused();
    await expect(page.locator("html")).not.toHaveAttribute("data-foco-deslocado", "true");
    await expect(page).toHaveURL(/\/rota-inexistente(?:\?q=2)?#main-content$/);
    await expect(page.locator("h1")).toHaveText("Página não encontrada");
    expect(await page.evaluate(() => history.length)).toBe(entradas + 1);
    expect(respostas).toEqual([]);
  });
}

test("issue #45 - skip da 404 cancela commit de Sobre suspenso", async ({ page }) => {
  let liberar!: () => void;
  const portao = new Promise<void>((resolve) => (liberar = resolve));
  let retidas = 0;
  let arvoreRecebida = false;
  page.on("requestfinished", (requisicao) => {
    if (
      new URL(requisicao.url()).pathname === "/sobre" &&
      requisicao.headers()["next-router-segment-prefetch"] === "/_tree"
    ) {
      arvoreRecebida = true;
    }
  });
  await page.route(
    (url) => url.pathname === "/sobre",
    async (rota) => {
      const requisicao = rota.request();
      if (
        requisicao.resourceType() === "document" ||
        requisicao.headers()["next-router-segment-prefetch"] === "/_tree"
      ) {
        return rota.continue();
      }
      retidas++;
      await portao;
      await rota.continue().catch(() => {});
    },
  );
  await page.goto("/rota-inexistente");
  await esperarHistoricoFragmentos(page);
  await expect.poll(() => arvoreRecebida).toBe(true);
  await expect.poll(() => retidas).toBeGreaterThan(0);
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: "Sobre", exact: true })
    .click();
  await page.waitForTimeout(300);
  await expect(page.locator("h1")).toHaveText("Página não encontrada");
  await page.locator(".skip-link").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab");
  const voltar = page.getByRole("link", { name: "Voltar para a página inicial" });
  await expect(voltar).toBeFocused();
  liberar();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/rota-inexistente#main-content$/);
  await expect(page.locator("h1")).toHaveText("Página não encontrada");
  await expect(voltar).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/rota-inexistente$/);
  await expect(page.locator("h1")).toHaveText("Página não encontrada");
  // Voltar pode iniciar uma nova carga da 404 depois da navegação nativa.
  // A fase seguinte verifica Avançar com o gerenciador novamente instalado.
  await page.waitForLoadState("networkidle");
  await esperarHistoricoFragmentos(page);
  await page.goForward();
  await expect(page).toHaveURL(/\/rota-inexistente#main-content$/);
  await expect(page.locator("h1")).toHaveText("Página não encontrada");
});
