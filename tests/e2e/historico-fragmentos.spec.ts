import { test, expect, type Browser, type Page } from "@playwright/test";

// F1 (AUD03): depois de navegar por fragmento, Voltar/Avançar precisam manter
// URL e conteúdo coerentes. Cada passo compara título, h1 e item atual da
// navegação com os da mesma rota aberta diretamente.

type Referencia = { titulo: string; h1: string; navAtual: string | null };
const referencias = new Map<string, Referencia>();

async function referencia(browser: Browser, rota: string): Promise<Referencia> {
  const salva = referencias.get(rota);
  if (salva) return salva;
  const page = await browser.newPage();
  await page.goto(rota);
  const atual = page
    .getByRole("navigation", { name: "Navegação principal" })
    .locator('[aria-current="page"]');
  const nova = {
    titulo: await page.title(),
    h1: ((await page.locator("h1").textContent()) ?? "").replace(/\s+/g, " ").trim(),
    navAtual: (await atual.count()) ? await atual.getAttribute("href") : null,
  };
  await page.close();
  referencias.set(rota, nova);
  return nova;
}

async function esperarRota(page: Page, browser: Browser, url: string) {
  const [rota, fragmento] = url.split("#");
  const ref = await referencia(browser, rota);
  await expect(page).toHaveURL((u) => u.pathname + u.hash === url);
  await expect(page.locator("h1")).toHaveText(ref.h1);
  await expect(page).toHaveTitle(ref.titulo);
  const atual = page
    .getByRole("navigation", { name: "Navegação principal" })
    .locator('[aria-current="page"]');
  if (ref.navAtual) await expect(atual).toHaveAttribute("href", ref.navAtual);
  else await expect(atual).toHaveCount(0);
  // Ao voltar de outra rota, só o Chromium atualizou `:target` nas execuções da
  // AUD03; Firefox e WebKit do Playwright o deixaram nulo, e o Voltar comum do
  // App Router também não restaura a rolagem nesses casos. O projeto não usa
  // `:target` em CSS, então a coerência é verificada por URL e conteúdo.
  if (fragmento && browser.browserType().name() === "chromium") {
    await expect
      .poll(() => page.evaluate(() => document.querySelector(":target")?.id))
      .toBe(fragmento);
  }
}

async function hidratar(page: Page) {
  await page.waitForFunction(() => {
    const marca = document.querySelector("header a");
    return (
      !!marca &&
      Object.keys(marca).some((k) => k.startsWith("__reactFiber")) &&
      history.state !== null
    );
  });
}

async function abrir(page: Page, rota: string) {
  await page.goto(rota);
  await hidratar(page);
}

async function pularParaConteudo(page: Page) {
  await page.keyboard.press("Tab");
  await expect(page.locator("a.skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main-content")).toBeFocused();
}

// Aciona o skip link no HTML pré-renderizado, com os chunks retidos: a entrada
// de "/" fica sem estado. Devolve a função que libera os chunks.
async function pularAntesDaHidratacao(page: Page) {
  let liberar!: () => void;
  let retidos = 0;
  const portao = new Promise<void>((resolve) => (liberar = resolve));
  await page.route("**/_next/static/chunks/*.js", async (rota) => {
    retidos++;
    await portao;
    await rota.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await pularParaConteudo(page);
  // Garante que o skip link agiu de fato antes da hidratação.
  expect(retidos).toBeGreaterThan(0);
  expect(
    await page.evaluate(() => {
      const marca = document.querySelector("header a");
      return {
        hidratado: !!marca && Object.keys(marca).some((k) => k.startsWith("__reactFiber")),
        estado: history.state,
      };
    }),
  ).toEqual({ hidratado: false, estado: null });
  return liberar;
}

// Marca o documento para detectar recarga e coleta erros da página.
async function vigiar(page: Page) {
  const erros: string[] = [];
  page.on("pageerror", (erro) => erros.push(String(erro)));
  page.on("console", (msg) => {
    if (msg.type() === "error") erros.push(msg.text());
  });
  await page.evaluate(() => {
    (window as Window & { __documento?: string }).__documento = "inicial";
  });
  return async () => {
    expect(
      await page.evaluate(() => (window as Window & { __documento?: string }).__documento),
    ).toBe("inicial");
    expect(erros).toEqual([]);
  };
}

// Diagnóstico (sem asserção): rota da árvore que o App Router gravou na entrada
// corrente. É campo interno do Next.js, por isso fica fora das verificações.
async function anotarArvore(page: Page, momento: string) {
  const rota = await page.evaluate(() => {
    type No = [string | [string, string, string], Record<string, No>];
    let no = (history.state as { __PRIVATE_NEXTJS_INTERNALS_TREE?: { tree?: No } } | null)
      ?.__PRIVATE_NEXTJS_INTERNALS_TREE?.tree;
    if (!no) return history.state === null ? "estado nulo" : "sem árvore";
    const segmentos: string[] = [];
    while (no) {
      const segmento = Array.isArray(no[0]) ? no[0][1] : no[0];
      if (segmento && !segmento.startsWith("__PAGE__")) segmentos.push(segmento);
      no = no[1]?.children;
    }
    return "/" + segmentos.join("/");
  });
  test.info().annotations.push({ type: `árvore gravada (${momento})`, description: rota });
}

const navegar = (page: Page, rotulo: string) =>
  page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: rotulo, exact: true })
    .click();

test("F1 - skip link: Voltar e Avançar mantêm URL e conteúdo coerentes", async ({
  page,
  browser,
}) => {
  await abrir(page, "/");
  await pularParaConteudo(page);
  await navegar(page, "Sobre");
  await esperarRota(page, browser, "/sobre");

  await page.goBack();
  await esperarRota(page, browser, "/#main-content");
  await page.goForward();
  await esperarRota(page, browser, "/sobre");
  await page.goBack();
  await page.goBack();
  await esperarRota(page, browser, "/");
});

test("F1 - âncora da home: Voltar da ficha retorna aos projetos em destaque", async ({
  page,
  browser,
}) => {
  await abrir(page, "/");
  await page.getByRole("link", { name: "Ver projetos em destaque" }).click();
  await expect(page.locator("h2#projects-title")).toBeFocused();
  await page.getByRole("link", { name: "Ver detalhes de Nana Silva" }).click();
  await esperarRota(page, browser, "/projetos/nana-silva");

  await page.goBack();
  await esperarRota(page, browser, "/#projects-title");
  await expect(page.locator("h2#projects-title")).toBeInViewport();
});

test("F1 - índice da ficha: fragmentos diferentes e Voltar até a ficha sem fragmento", async ({
  page,
  browser,
}) => {
  const ficha = "/projetos/nana-silva";
  await abrir(page, ficha);
  const indice = page.getByRole("navigation", { name: "Nesta ficha" });
  for (const rotulo of ["Contexto", "Decisões", "Limitações"]) {
    await indice.getByRole("link", { name: rotulo, exact: true }).click();
  }
  await navegar(page, "Projetos");
  await esperarRota(page, browser, "/projetos");

  for (const fragmento of ["#limitacoes", "#decisoes", "#contexto", ""]) {
    await page.goBack();
    await esperarRota(page, browser, ficha + fragmento);
  }
});

test("F1 - mesmo fragmento duas vezes não cria entrada nem quebra o Voltar", async ({
  page,
  browser,
}) => {
  await abrir(page, "/");
  const ancora = page.getByRole("link", { name: "Ver projetos em destaque" });
  await ancora.click();
  const tamanho = await page.evaluate(() => history.length);
  await ancora.click();
  expect(await page.evaluate(() => history.length)).toBe(tamanho);
  await navegar(page, "Sobre");
  await esperarRota(page, browser, "/sobre");

  await page.goBack();
  await esperarRota(page, browser, "/#projects-title");
  await page.goBack();
  await esperarRota(page, browser, "/");
});

test("F1 - location.hash e barra de endereço: Voltar e Avançar coerentes", async ({
  page,
  browser,
}) => {
  await abrir(page, "/");
  await page.evaluate(() => {
    location.hash = "projects-title";
  });
  await navegar(page, "Sobre");
  await esperarRota(page, browser, "/sobre");
  await page.goBack();
  await esperarRota(page, browser, "/#projects-title");

  // Mesmo documento: a barra de endereço só troca o fragmento.
  await page.goto("/#main-content");
  await navegar(page, "Projetos");
  await esperarRota(page, browser, "/projetos");
  await page.goBack();
  await esperarRota(page, browser, "/#main-content");
  await page.goForward();
  await esperarRota(page, browser, "/projetos");
});

test("F1 - skip link antes da hidratação: Voltar e history.go(-2) coerentes", async ({
  page,
  browser,
}) => {
  const liberar = await pularAntesDaHidratacao(page);
  liberar();
  await hidratar(page);

  await navegar(page, "Sobre");
  await esperarRota(page, browser, "/sobre");
  await page.goBack();
  await esperarRota(page, browser, "/#main-content");
  await page.goForward();
  await esperarRota(page, browser, "/sobre");

  // Salta a entrada intermediária: chega direto à entrada sem estado de "/".
  await page.evaluate(() => history.go(-2));
  await esperarRota(page, browser, "/");
});

// F1-CODEX-01: Voltar no instante em que o conteúdo de Sobre é confirmado,
// antes de o resto da troca de rota terminar. A entrada sem estado de "/" não
// pode receber a árvore de Sobre; o ciclo Avançar/Voltar seguinte confere que
// a associação gravada no histórico é a da URL.
test("F1-CODEX-01 - Voltar durante a troca de rota mantém a entrada sem estado coerente", async ({
  page,
  browser,
}) => {
  for (const rota of ["/", "/sobre"]) await referencia(browser, rota);
  const liberar = await pularAntesDaHidratacao(page);
  liberar();
  await hidratar(page);
  const conferir = await vigiar(page);
  const entradas = await page.evaluate(() => history.length);

  await page.evaluate(() => {
    const observador = new MutationObserver(() => {
      if (document.querySelector("h1")?.textContent !== "Sobre") return;
      observador.disconnect();
      (window as Window & { __voltou?: boolean }).__voltou = true;
      history.go(-2);
    });
    observador.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  });
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: "Sobre", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect
    .poll(() => page.evaluate(() => (window as Window & { __voltou?: boolean }).__voltou))
    .toBe(true);

  await esperarRota(page, browser, "/");
  await anotarArvore(page, "primeiro Voltar");
  await page.goForward();
  await esperarRota(page, browser, "/#main-content");
  await page.goBack();
  await esperarRota(page, browser, "/");
  await anotarArvore(page, "segundo Voltar");
  // Só a entrada de Sobre foi acrescentada; nenhuma outra foi criada.
  expect(await page.evaluate(() => history.length)).toBe(entradas + 1);
  await conferir();
});

test("F1-CODEX-01 - Voltar com a navegação para Sobre pendente mantém a entrada coerente", async ({
  page,
  browser,
}) => {
  for (const rota of ["/", "/sobre"]) await referencia(browser, rota);
  // Retém as respostas RSC de Sobre (prefetch e navegação) até depois do Voltar.
  let liberarSobre!: () => void;
  const sobre = new Promise<void>((resolve) => (liberarSobre = resolve));
  let retidas = 0;
  await page.route(
    (url) => url.pathname === "/sobre",
    async (rota) => {
      if (rota.request().resourceType() === "document") return rota.continue();
      retidas++;
      await sobre;
      await rota.continue().catch(() => {});
    },
  );
  const liberar = await pularAntesDaHidratacao(page);
  liberar();
  await hidratar(page);
  const conferir = await vigiar(page);

  await navegar(page, "Sobre");
  await expect.poll(() => retidas).toBeGreaterThan(0);
  await expect(page.locator("h1")).not.toHaveText("Sobre");
  await page.evaluate(() => history.go(-1));
  await expect(page).toHaveURL((u) => u.pathname + u.hash === "/");
  liberarSobre();

  await esperarRota(page, browser, "/");
  await anotarArvore(page, "primeiro Voltar");
  await page.goForward();
  await esperarRota(page, browser, "/#main-content");
  await page.goBack();
  await esperarRota(page, browser, "/");
  await anotarArvore(page, "segundo Voltar");
  await conferir();
});

// Variante determinística: a árvore de Sobre chega (prefetch "/_tree"), mas os
// dados do segmento ficam retidos. O router já adota a árvore de Sobre enquanto o
// commit fica suspenso com a Home na tela; o Voltar até a entrada sem estado de
// "/" acontece exatamente nessa janela, sem depender de temporização.
test("F1-CODEX-01 - Voltar com a árvore de Sobre adotada e o commit suspenso mantém a entrada coerente", async ({
  page,
  browser,
}) => {
  for (const rota of ["/", "/sobre"]) await referencia(browser, rota);
  let liberarSobre!: () => void;
  const sobre = new Promise<void>((resolve) => (liberarSobre = resolve));
  const retidas: string[] = [];
  let arvoreRecebida = false;
  page.on("requestfinished", (requisicao) => {
    if (requisicao.headers()["next-router-segment-prefetch"] === "/_tree") {
      if (new URL(requisicao.url()).pathname === "/sobre") arvoreRecebida = true;
    }
  });
  await page.route(
    (url) => url.pathname === "/sobre",
    async (rota) => {
      const requisicao = rota.request();
      const segmento = requisicao.headers()["next-router-segment-prefetch"];
      if (requisicao.resourceType() === "document" || segmento === "/_tree") {
        return rota.continue();
      }
      retidas.push(segmento ?? "navegação");
      await sobre;
      await rota.continue().catch(() => {});
    },
  );
  const liberar = await pularAntesDaHidratacao(page);
  liberar();
  await hidratar(page);
  const conferir = await vigiar(page);
  // A árvore de Sobre já está no cliente e os dados do segmento, retidos.
  await expect.poll(() => arvoreRecebida).toBe(true);
  await expect.poll(() => retidas.length).toBeGreaterThan(0);

  await navegar(page, "Sobre");
  // O commit de Sobre não acontece enquanto os dados estiverem retidos.
  await page.waitForTimeout(300);
  await expect(page).toHaveURL((u) => u.pathname + u.hash === "/#main-content");
  await expect(page.locator("h1")).not.toHaveText("Sobre");
  await page.evaluate(() => history.go(-1));
  await expect(page).toHaveURL((u) => u.pathname + u.hash === "/");
  liberarSobre();

  await esperarRota(page, browser, "/");
  await anotarArvore(page, "primeiro Voltar");
  await page.goForward();
  await esperarRota(page, browser, "/#main-content");
  await page.goBack();
  await esperarRota(page, browser, "/");
  await anotarArvore(page, "segundo Voltar");
  await page.waitForLoadState("networkidle");
  await esperarRota(page, browser, "/");
  await conferir();
});
