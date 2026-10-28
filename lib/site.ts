interface SiteEnvironment {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_URL?: string;
  VERCEL_ENV?: string;
  NODE_ENV?: string;
}

// Apenas configuração de build, nunca Host/headers recebidos de visitantes.
// Não incluir o valor inválido no erro: ele pode conter credenciais por engano.
export function resolveSiteUrl(env: SiteEnvironment): string {
  const producaoRemota = env.VERCEL_ENV === "production";
  const preview = env.VERCEL_ENV === "preview";
  let candidata = env.NEXT_PUBLIC_SITE_URL;

  if (candidata === undefined && preview) {
    const host = env.VERCEL_URL?.trim();
    if (!host || !/^[a-z0-9-]+\.vercel\.app$/i.test(host)) {
      throw new Error("Preview exige NEXT_PUBLIC_SITE_URL ou VERCEL_URL válida da Vercel.");
    }
    candidata = `https://${host}`;
  }

  if (candidata === undefined) {
    if (env.NODE_ENV === "production" || producaoRemota) {
      throw new Error("Defina NEXT_PUBLIC_SITE_URL com a origem HTTPS antes do build de produção.");
    }
    return "http://localhost:3000";
  }

  const invalida = () =>
    new Error("NEXT_PUBLIC_SITE_URL deve ser uma origem HTTPS, ou HTTP de loopback local.");
  const valor = candidata.trim();
  // Exigir sintaxe absoluta antes de URL normalizar entradas ambíguas.
  if (!/^https?:\/\/[^/?#]+\/?$/i.test(valor) || /[\s\\]/.test(valor)) throw invalida();

  let url: URL;
  try {
    url = new URL(valor);
  } catch {
    throw invalida();
  }

  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    valor.includes("?") ||
    valor.includes("#") ||
    (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) ||
    ((producaoRemota || preview) && loopback)
  ) {
    throw invalida();
  }

  return url.origin;
}

export const SITE_URL = resolveSiteUrl({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  NODE_ENV: process.env.NODE_ENV,
});

export const SITE_NAME = "Portfólio";

export const SITE_LOCALE = "pt_BR";
