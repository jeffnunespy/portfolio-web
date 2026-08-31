// URL pública do site. Em produção vem de NEXT_PUBLIC_SITE_URL; a Vercel
// expõe VERCEL_URL automaticamente em preview deploys, e o fallback local
// mantém o build reproduzível sem configuração.
function resolveSiteUrl(): string {
  const configurada = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configurada) {
    return configurada.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "Portfólio";

export const SITE_LOCALE = "pt_BR";
