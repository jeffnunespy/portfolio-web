// Hosts que servem o perfil em /<dono> e o repositório em
// /<dono>/<repositório>[/…]. Os outros subdomínios do GitHub (docs, gist,
// status…) têm outra finalidade e caem em "externo", como qualquer site.
const HOSTS_GITHUB = new Set(["github.com", "www.github.com"]);
// Servem arquivos ou o pacote de um repositório no mesmo formato de caminho,
// sem perfil.
const HOSTS_ARQUIVOS_DE_REPOSITORIO = new Set([
  "raw.githubusercontent.com",
  "raw.github.com",
  "codeload.github.com",
]);
// A API expõe o repositório em /repos/<dono>/<repositório>[/…].
const HOST_API_GITHUB = "api.github.com";

export type DestinoLink =
  | { tipo: "interno"; url: URL }
  | { tipo: "email"; url: URL }
  | { tipo: "perfil"; url: URL }
  | { tipo: "repositorio"; url: URL; repositorio: string }
  | { tipo: "externo"; url: URL };

// Resolver o href contra a página trata do mesmo jeito "/rota", "#âncora" e
// "//host/…": interno é só o que permanece na origem da página. O repositório
// sai como "dono/repositório" em minúsculas e sem ".git", porque o GitHub não
// diferencia maiúsculas nesses nomes.
export function classificarLink(href: string, paginaAtual: string): DestinoLink {
  const url = new URL(href, paginaAtual);
  if (url.origin === new URL(paginaAtual).origin) return { tipo: "interno", url };
  if (url.protocol === "mailto:") return { tipo: "email", url };

  const host = url.hostname.replace(/\.$/, "");
  const github = HOSTS_GITHUB.has(host);
  const segmentos = url.pathname.split("/").filter(Boolean);
  const api = host === HOST_API_GITHUB && segmentos[0] === "repos";
  const [dono, repositorio] = api ? segmentos.slice(1) : segmentos;
  if ((github || api || HOSTS_ARQUIVOS_DE_REPOSITORIO.has(host)) && dono && repositorio) {
    return {
      tipo: "repositorio",
      url,
      repositorio: `${dono}/${repositorio.replace(/\.git$/i, "")}`.toLowerCase(),
    };
  }
  if (github && dono) return { tipo: "perfil", url };
  return { tipo: "externo", url };
}
