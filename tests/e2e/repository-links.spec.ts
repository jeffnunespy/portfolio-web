import { test, expect, type Page } from "@playwright/test";
import { getPerfil, getProjetosImplementados } from "../../lib/content";
import { classificarLink } from "./links-externos";

const perfil = getPerfil();
const implementados = getProjetosImplementados();

// Repositórios cujo acesso anônimo foi confirmado. A validação de build só
// confere o formato da URL, e o GitHub responde 404 tanto para repositório
// privado quanto inexistente: um link para repositório fora desta lista
// promete ao visitante um código que ele não vai abrir (FR-009/FR-009a). Só
// inclua um repositório depois de conferir o acesso sem sessão, no formato
// "dono/repositório" em minúsculas.
const REPOSITORIOS_PUBLICOS: readonly string[] = [];

const rotas = [
  "/",
  "/projetos",
  ...implementados.map((projeto) => `/projetos/${projeto.slug}`),
  "/roadmap",
  "/sobre",
  "/curriculo",
  "/rota-inexistente",
];

async function linksRenderizados(page: Page) {
  return page.locator("a[href]").evaluateAll((links) =>
    links.map((link) => ({
      nome: (link.textContent ?? "").replace(/\s+/g, " ").trim(),
      href: link.getAttribute("href") ?? "",
      target: link.getAttribute("target"),
      rel: link.getAttribute("rel"),
    })),
  );
}

for (const javaScriptEnabled of [true, false]) {
  const modo = javaScriptEnabled ? "com" : "sem";
  test.describe(`${modo} JavaScript`, () => {
    test.use({ javaScriptEnabled });

    for (const rota of rotas) {
      test(`FR-009a - ${rota} ${modo} JavaScript só aponta para repositórios públicos confirmados`, async ({
        page,
      }) => {
        const resposta = await page.goto(rota);
        expect(resposta?.status()).toBe(rota === "/rota-inexistente" ? 404 : 200);

        let perfis = 0;
        for (const link of await linksRenderizados(page)) {
          const destino = classificarLink(link.href, page.url());
          if (destino.tipo === "interno") continue;
          if (destino.tipo === "email") {
            expect(link.href, link.nome).toMatch(/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+/);
            continue;
          }
          // Todo outro destino é HTTPS externo, aberto em nova aba sem expor a
          // página de origem.
          expect(destino.url.protocol, link.href).toBe("https:");
          expect(link.target, link.href).toBe("_blank");
          expect(link.rel, link.href).toBe("noopener noreferrer");

          if (destino.tipo === "repositorio") {
            expect(REPOSITORIOS_PUBLICOS, `${link.nome} → ${link.href}`).toContain(
              destino.repositorio,
            );
          } else if (destino.tipo === "perfil") {
            // O perfil não substitui o repositório: nenhum rótulo o apresenta
            // como acesso ao código.
            expect(link.nome, link.href).not.toMatch(/código/i);
            perfis++;
          }
        }
        // O rodapé leva ao perfil em toda rota: sem ele, a varredura não
        // chegou a classificar a página que o visitante recebe.
        expect(perfis, `perfil de ${perfil.linkGithub}`).toBeGreaterThan(0);
      });
    }
  });
}

for (const rota of ["/", "/projetos"]) {
  test(`FR-009a - cartão da Plataforma em ${rota} declara o código privado e o pedido de acesso`, async ({
    page,
  }) => {
    await page.goto(rota);
    const cartao = page.getByTestId("project-card").filter({
      has: page.getByRole("heading", { name: "Plataforma de Portfólio", exact: true }),
    });
    await expect(cartao.getByText("Código privado", { exact: true })).toBeVisible();
    await expect(cartao.getByRole("link", { name: "Solicitar acesso ao código" })).toHaveAttribute(
      "href",
      `mailto:${perfil.contato.valor}?subject=Acesso ao código do projeto`,
    );
    await expect(cartao.getByRole("link", { name: "Ver código-fonte" })).toHaveCount(0);
    await expect(cartao.locator('a[href*="github.com"]')).toHaveCount(0);
  });

  test(`FR-008 - demonstração pública da Nana Silva continua disponível em ${rota}`, async ({
    page,
  }) => {
    const nana = implementados.find((projeto) => projeto.slug === "nana-silva")!;
    await page.goto(rota);
    const cartao = page.getByTestId("project-card").filter({
      has: page.getByRole("heading", { name: "Nana Silva", exact: true }),
    });
    const demonstracao = cartao.getByRole("link", { name: "Ver demonstração" });
    await expect(demonstracao).toHaveAttribute("href", nana.linkDemonstracao!);
    await expect(demonstracao).toHaveAttribute("target", "_blank");
    await expect(demonstracao).toHaveAttribute("rel", "noopener noreferrer");
  });
}
