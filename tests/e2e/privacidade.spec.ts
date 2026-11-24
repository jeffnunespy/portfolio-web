import { expect, test, type Page } from "@playwright/test";
import { getPerfil } from "../../lib/content";

// FR-030 (AUD13-001): aviso estático, acessível pelo rodapé, sem coleta nova.
const perfil = getPerfil();

const SECOES = [
  "Em resumo",
  "Quem é o responsável",
  "Dados técnicos do acesso",
  "Mensagens por e-mail",
  "Conservação das mensagens",
  "Provedores",
  "Seus direitos",
  "Links externos",
];

const REFERENCIAS = [
  {
    nome: "Lei Geral de Proteção de Dados Pessoais",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm",
  },
  {
    nome: "Aviso de privacidade da Vercel (em inglês)",
    href: "https://vercel.com/legal/privacy-notice",
  },
  {
    nome: "Política de Privacidade do Google",
    href: "https://policies.google.com/privacy?hl=pt-BR",
  },
  {
    nome: "petição à Agência Nacional de Proteção de Dados (ANPD)",
    href: "https://www.gov.br/anpd/pt-br/assuntos/denuncia-de-descumprimento-da-lgpd",
  },
];

async function conferirAviso(page: Page) {
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1, name: "Privacidade" })).toBeVisible();
  await expect(main.locator("time")).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
  await expect(main.getByText(/^Última atualização:/)).toBeVisible();
  await expect(main.getByRole("heading", { level: 2 })).toHaveText(SECOES);

  // O canal do titular é o mesmo e-mail publicado no perfil, por mailto.
  const emails = main.getByRole("link", { name: perfil.contato.valor, exact: true });
  await expect(emails).toHaveCount(2);
  for (const email of await emails.all()) {
    await expect(email).toHaveAttribute("href", `mailto:${perfil.contato.valor}`);
    await expect(email).not.toHaveAttribute("target", /.+/);
  }

  for (const { nome, href } of REFERENCIAS) {
    const link = main.getByRole("link", { name: nome, exact: true });
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }

  // Sem formulário, consentimento ou banner: o aviso só informa.
  await expect(page.locator("form, input, textarea, select, dialog")).toHaveCount(0);
}

for (const javaScriptEnabled of [true, false]) {
  const modo = javaScriptEnabled ? "com" : "sem";
  test.describe(`${modo} JavaScript`, () => {
    test.use({ javaScriptEnabled });

    test(`FR-030 - aviso completo em /privacidade ${modo} JavaScript`, async ({ page }) => {
      const resposta = await page.goto("/privacidade");
      expect(resposta?.status()).toBe(200);
      await conferirAviso(page);
    });

    test(`FR-030 - rodapé leva ao aviso por teclado ${modo} JavaScript`, async ({ page }) => {
      await page.goto("/");
      const link = page
        .getByRole("navigation", { name: "Links secundários" })
        .getByRole("link", { name: "Privacidade", exact: true });
      await expect(link).toHaveAttribute("href", "/privacidade");
      await link.focus();
      await expect(link).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/privacidade$/);
      await expect(page.getByRole("heading", { level: 1, name: "Privacidade" })).toBeVisible();
    });
  });
}

test("FR-030 - fluxo normal não cria cookies, armazenamento, service worker nem requisições externas", async ({
  page,
  context,
}) => {
  const origem = new URL(test.info().project.use.baseURL!).origin;
  const externas: string[] = [];
  const setCookie: string[] = [];
  page.on("request", (requisicao) => {
    const url = new URL(requisicao.url());
    if (url.protocol !== "data:" && url.origin !== origem) externas.push(requisicao.url());
  });
  page.on("response", async (resposta) => {
    if ((await resposta.headerValue("set-cookie")) !== null) setCookie.push(resposta.url());
  });

  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Links secundários" })
    .getByRole("link", { name: "Privacidade", exact: true })
    .click();
  await expect(page).toHaveURL(/\/privacidade$/);
  await page.getByRole("heading", { level: 1, name: "Privacidade" }).waitFor();
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: "Sobre" })
    .click();
  await expect(page).toHaveURL(/\/sobre$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/privacidade$/);
  await page.waitForLoadState("networkidle");

  expect(externas).toEqual([]);
  expect(setCookie).toEqual([]);
  expect(await context.cookies()).toEqual([]);
  const armazenamento = await page.evaluate(async () => ({
    cookie: document.cookie,
    local: localStorage.length,
    sessao: sessionStorage.length,
    serviceWorkers: (await navigator.serviceWorker.getRegistrations()).length,
    indexedDB: (await indexedDB.databases()).length,
    caches: (await caches.keys()).length,
  }));
  expect(armazenamento).toEqual({
    cookie: "",
    local: 0,
    sessao: 0,
    serviceWorkers: 0,
    indexedDB: 0,
    caches: 0,
  });
});
