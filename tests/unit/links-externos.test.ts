import { describe, expect, it } from "vitest";
import { classificarLink } from "../e2e/links-externos";

const pagina = "http://localhost:3001/projetos";

describe("classificarLink", () => {
  it.each(["/sobre", "#contexto", "?pagina=2", "http://localhost:3001/curriculo"])(
    "trata %s como interno",
    (href) => {
      expect(classificarLink(href, pagina).tipo).toBe("interno");
    },
  );

  it.each([
    ["https://github.com/jeffnunespy/portfolio-web", "jeffnunespy/portfolio-web"],
    ["https://www.github.com/jeffnunespy/portfolio-web", "jeffnunespy/portfolio-web"],
    ["https://GitHub.com/JeffNunesPy/Portfolio-Web.git", "jeffnunespy/portfolio-web"],
    ["https://github.com./jeffnunespy/portfolio-web", "jeffnunespy/portfolio-web"],
    [
      "https://github.com/jeffnunespy/portfolio-web/blob/master/lib/content.ts",
      "jeffnunespy/portfolio-web",
    ],
    [
      "https://raw.githubusercontent.com/jeffnunespy/portfolio-web/master/lib/content.ts",
      "jeffnunespy/portfolio-web",
    ],
    [
      "https://raw.github.com/jeffnunespy/portfolio-web/master/README.md",
      "jeffnunespy/portfolio-web",
    ],
    [
      "https://codeload.github.com/jeffnunespy/portfolio-web/zip/refs/heads/master",
      "jeffnunespy/portfolio-web",
    ],
    ["https://api.github.com/repos/jeffnunespy/portfolio-web", "jeffnunespy/portfolio-web"],
  ])("reconhece %s como o repositório %s", (href, repositorio) => {
    expect(classificarLink(href, pagina)).toMatchObject({ tipo: "repositorio", repositorio });
  });

  it("não ignora o repositório escrito como URL relativa ao protocolo", () => {
    const destino = classificarLink("//github.com/jeffnunespy/portfolio-web", pagina);
    expect(destino).toMatchObject({
      tipo: "repositorio",
      repositorio: "jeffnunespy/portfolio-web",
    });
    // Herda o protocolo da página: fora do HTTPS exigido para destino externo.
    expect(destino.url.protocol).toBe("http:");
  });

  it.each(["https://github.com/jeffnunespy", "https://www.github.com/jeffnunespy/"])(
    "reconhece %s como perfil, não como repositório",
    (href) => {
      expect(classificarLink(href, pagina).tipo).toBe("perfil");
    },
  );

  it.each([
    "https://github.com.example.org/jeffnunespy/portfolio-web",
    "https://notgithub.com/jeffnunespy/portfolio-web",
    "https://gist.github.com/jeffnunespy/abc123",
    "https://docs.github.com/pt/repositories",
    "https://api.github.com/users/jeffnunespy",
    "https://www.linkedin.com/in/jefferson-nunes-7bb309122/",
    "https://nana-silva-validacao.pages.dev/",
  ])("trata %s como externo comum", (href) => {
    expect(classificarLink(href, pagina).tipo).toBe("externo");
  });

  it("separa e-mail dos demais protocolos", () => {
    expect(classificarLink("mailto:contato@example.com?subject=Acesso", pagina).tipo).toBe("email");
    const script = classificarLink("javascript:void(0)", pagina);
    expect(script.tipo).toBe("externo");
    expect(script.url.protocol).toBe("javascript:");
  });
});
