import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { expect, test, type APIResponse } from "@playwright/test";
import { getProjetosImplementados } from "../../lib/content";

const politica = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
].join("; ");

function verificarHeaders(resposta: APIResponse) {
  const esperados = {
    "content-security-policy": politica,
    "x-frame-options": "DENY",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  };
  for (const [nome, valor] of Object.entries(esperados)) {
    expect(resposta.headers()[nome], `${resposta.url()} — ${nome}`).toBe(valor);
    expect(resposta.headersArray().filter((h) => h.name.toLowerCase() === nome)).toHaveLength(1);
  }
  expect(resposta.headers()["x-powered-by"]).toBeUndefined();
  expect(resposta.headers()["content-security-policy-report-only"]).toBeUndefined();
}

test("headers de produção cobrem páginas, erros e arquivos públicos em GET/HEAD", async ({
  request,
}) => {
  const rotas = [
    "/",
    "/projetos",
    ...getProjetosImplementados().map((p) => `/projetos/${p.slug}`),
    "/curriculo",
    "/sobre",
    "/roadmap",
    "/rota-inexistente",
    "/projetos/slug-inexistente",
    "/curriculo.pdf",
    "/images/projects/plataforma-portfolio.svg",
    "/robots.txt",
    "/sitemap.xml",
  ];
  for (const rota of rotas) {
    const get = await request.get(rota);
    const head = await request.head(rota);
    expect(head.status(), rota).toBe(get.status());
    verificarHeaders(get);
    verificarHeaders(head);
  }
});

test("JavaScript, CSS e fontes mantêm MIME e cache imutável", async ({ page, request }) => {
  const resposta = await request.get("/");
  const caminhos = [
    ...new Set(
      [...(await resposta.text()).matchAll(/(?:src|href)="([^\"]+)"/g)]
        .map((m) => m[1].replaceAll("&amp;", "&"))
        .filter((p) => p.startsWith("/_next/static/")),
    ),
  ];
  for (const [extensao, mime] of [
    [".js", /javascript/],
    [".css", /text\/css/],
    [".woff2", /font\/woff2/],
  ] as const) {
    const caminho = caminhos.find((p) => p.endsWith(extensao));
    expect(caminho, extensao).toBeDefined();
    const asset = await request.get(caminho!);
    expect(asset.status()).toBe(200);
    expect(asset.headers()["content-type"]).toMatch(mime);
    expect(asset.headers()["cache-control"]).toContain("immutable");
    verificarHeaders(asset);
    verificarHeaders(await request.head(caminho!));
    if (extensao === ".js") expect((await request.get(`${caminho}.map`)).status()).toBe(404);
  }
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].some((f) => f.status === "loaded"))).toBe(
    true,
  );
});

test("PDF, range e SVG continuam acessíveis com os tipos corretos", async ({ request }) => {
  const pdf = await request.get("/curriculo.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toBe("application/pdf");
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  expect(pdf.headers()["content-disposition"]).toBeUndefined();
  const trecho = await request.get("/curriculo.pdf", { headers: { Range: "bytes=0-4" } });
  expect(trecho.status()).toBe(206);
  expect((await trecho.body()).toString()).toBe("%PDF-");
  verificarHeaders(trecho);
  const svg = await request.get("/images/projects/plataforma-portfolio.svg");
  expect(svg.status()).toBe(200);
  expect(svg.headers()["content-type"]).toContain("image/svg+xml");
});

test("todas as imagens Open Graph válidas são PNGs e slugs desconhecidos retornam 404", async ({
  request,
}) => {
  for (const rota of [
    "/opengraph-image",
    "/projetos/opengraph-image",
    "/curriculo/opengraph-image",
    "/sobre/opengraph-image",
    "/icon",
    ...getProjetosImplementados().map((p) => `/projetos/${p.slug}/opengraph-image`),
  ]) {
    const imagem = await request.get(rota);
    expect(imagem.status()).toBe(200);
    expect(imagem.headers()["content-type"]).toBe("image/png");
    expect((await imagem.body()).subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
    verificarHeaders(imagem);
  }
  expect((await request.get("/projetos/slug-inexistente/opengraph-image")).status()).toBe(404);
});

test("otimizador desnecessário responde 404 inclusive para imagem local válida", async ({
  request,
}) => {
  for (const rota of [
    "/_next/image",
    "/_next/image?url=%2Ficon&w=64&q=75",
    "/_next/image?url=%2Fimages%2Fprojects%2Fplataforma-portfolio.svg&w=640&q=75",
    "/_next/image?url=https%3A%2F%2Fexample.invalid%2Fx.png&w=64&q=75",
  ]) {
    const resposta = await request.get(rota);
    expect(resposta.status(), rota).toBe(404);
    verificarHeaders(resposta);
  }
});

test("slugs imprevistos não publicam fichas nem acessam caminhos arbitrários", async ({
  request,
}) => {
  for (const slug of [
    "slug-inexistente",
    "gerenciamento-filas",
    "%3Cscript%3E",
    "%2e%2e%2fsegredo",
    "%00",
    "a%C3%A7%C3%A3o",
    "PLATAFORMA-PORTFOLIO",
    "plataforma-portfolio/extra",
  ]) {
    expect((await request.get(`/projetos/${slug}`)).status(), slug).toBe(404);
  }
  expect((await request.get("/projetos/%70lataforma-portfolio")).status()).toBe(200);
});

test("arquivos internos, relatórios e source maps não são publicados", async ({ request }) => {
  for (const rota of [
    "/.env",
    "/.env.local",
    "/.git/config",
    "/next.config.js",
    "/package.json",
    "/package-lock.json",
    "/lib/site.ts",
    "/tests/unit/content.test.ts",
    "/playwright-report/index.html",
    "/node_modules/next/package.json",
    "/_next/static/missing.js.map",
  ]) {
    expect((await request.get(rota)).status(), rota).toBe(404);
  }
});

test("build mantém páginas pré-renderizadas e fecha fallback das imagens OG", () => {
  const manifesto = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
  for (const rota of ["/", "/projetos", "/roadmap", "/sobre", "/curriculo"]) {
    expect(manifesto.routes[rota], rota).toBeDefined();
  }
  for (const projeto of getProjetosImplementados()) {
    expect(manifesto.routes[`/projetos/${projeto.slug}`]).toBeDefined();
    expect(manifesto.routes[`/projetos/${projeto.slug}/opengraph-image`]).toBeDefined();
  }
  expect(manifesto.dynamicRoutes["/projetos/[slug]/opengraph-image"].fallback).toBe(false);
});

test("navegação, hidratação e recursos legítimos funcionam sob CSP aplicada", async ({
  page,
  baseURL,
}) => {
  const erros: string[] = [];
  const falhas: string[] = [];
  const externos: string[] = [];
  const violacoes: string[] = [];
  await page.exposeFunction("registrarViolacao", (diretiva: string) => violacoes.push(diretiva));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) => {
      void (
        window as unknown as { registrarViolacao: (d: string) => Promise<void> }
      ).registrarViolacao(e.effectiveDirective);
    });
  });
  page.on("pageerror", (erro) => erros.push(erro.message));
  page.on("console", (mensagem) => {
    if (mensagem.type() === "error" && !mensagem.text().includes("status of 404")) {
      erros.push(mensagem.text());
    }
  });
  page.on("requestfailed", (r) => falhas.push(r.url()));
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.request().isNavigationRequest()) falhas.push(r.url());
    if (new URL(r.url()).origin !== new URL(baseURL!).origin) externos.push(r.url());
  });

  for (const rota of [
    "/",
    "/projetos",
    ...getProjetosImplementados().map((p) => `/projetos/${p.slug}`),
    "/roadmap",
    "/sobre",
    "/curriculo",
    "/rota-inexistente",
    "/projetos/slug-inexistente",
  ]) {
    await page.goto(rota);
    await page.waitForLoadState("networkidle");
    expect(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.every((i) => i instanceof HTMLImageElement && i.complete && i.naturalWidth > 0),
        ),
      rota,
    ).toBe(true);
  }
  await page.goto("/");
  await page.locator('.site-header a[href="/curriculo"]').click();
  await expect(page).toHaveURL(/\/curriculo$/);
  expect(violacoes).toEqual([]);
  expect(erros).toEqual([]);
  expect(falhas).toEqual([]);
  expect(externos).toEqual([]);
});

test("CSP bloqueia script e conexão externos, objetos, base e handlers inline", async ({
  page,
}) => {
  const violacoes: string[] = [];
  await page.exposeFunction("registrarBloqueio", (d: string) => violacoes.push(d));
  await page.goto("/");
  await page.evaluate(() => {
    document.addEventListener("securitypolicyviolation", (e) => {
      void (
        window as unknown as { registrarBloqueio: (d: string) => Promise<void> }
      ).registrarBloqueio(e.effectiveDirective);
    });
    const script = document.createElement("script");
    script.src = "https://blocked.example.invalid/script.js";
    document.body.append(script);
    void fetch("https://blocked.example.invalid/data").catch(() => {});
    const objeto = document.createElement("object");
    objeto.data = "/curriculo.pdf";
    document.body.append(objeto);
    const base = document.createElement("base");
    base.href = "https://blocked.example.invalid/";
    document.head.append(base);
    const botao = document.createElement("button");
    botao.setAttribute("onclick", "window.__handlerExecutou = true");
    document.body.append(botao);
    botao.click();
  });
  await expect
    .poll(() => [...new Set(violacoes)].sort())
    .toEqual(
      ["base-uri", "connect-src", "object-src", "script-src-attr", "script-src-elem"].sort(),
    );
  expect(await page.evaluate(() => Reflect.get(window, "__handlerExecutou"))).toBeUndefined();
});

test("frame-ancestors impede incorporação por outra origem", async ({ page, baseURL }) => {
  const bloqueios: string[] = [];
  page.on("console", (m) => {
    if (m.text().includes("frame-ancestors")) bloqueios.push(m.text());
  });
  // Duas origens de loopback reais: um documento interceptado pelo Playwright
  // tem espaço de IP desconhecido e o Chromium pode bloquear antes da CSP.
  const pai = createServer((_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end(`<!doctype html><iframe src="${baseURL}/"></iframe>`);
  });
  await new Promise<void>((resolve, reject) => {
    pai.once("error", reject);
    pai.listen(0, "127.0.0.1", resolve);
  });
  try {
    const endereco = pai.address();
    if (!endereco || typeof endereco === "string") throw new Error("Porta local não disponível.");
    await page.goto(`http://127.0.0.1:${endereco.port}`);
    await expect.poll(() => bloqueios.length).toBeGreaterThan(0);
    expect(page.frames().some((f) => f.url() === `${baseURL}/`)).toBe(false);
  } finally {
    await new Promise<void>((resolve) => pai.close(() => resolve()));
  }
});
