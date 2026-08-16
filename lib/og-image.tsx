import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_CONTENT_TYPE = "image/png";

interface OgImageParams {
  eyebrow: string;
  titulo: string;
  descricao?: string;
}

// Gera o PNG de preview em tempo de build. Usa apenas as fontes padrão do
// runtime e cores alinhadas ao gradiente de app/globals.css.
export function renderOgImage({ eyebrow, titulo, descricao }: OgImageParams): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundImage: "linear-gradient(135deg, #231942 0%, #5e548e 100%)",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          fontSize: 26,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "#d6ccf0",
        }}
      >
        {eyebrow}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.15 }}>{titulo}</div>
        {descricao ? (
          <div style={{ fontSize: 32, lineHeight: 1.4, color: "#e6e1f4" }}>{descricao}</div>
        ) : null}
      </div>

      <div style={{ fontSize: 28, color: "#d6ccf0" }}>{SITE_NAME}</div>
    </div>,
    OG_SIZE,
  );
}

// Limita o texto para não estourar o cartão de 1200x630, cortando na última
// fronteira de palavra para não partir termos no meio ("Goog…").
export function truncar(texto: string, limite: number): string {
  const limpo = texto.trim();
  if (limpo.length <= limite) {
    return limpo;
  }

  const cortado = limpo.slice(0, limite - 1);
  const ultimoEspaco = cortado.lastIndexOf(" ");
  let base = ultimoEspaco > limite * 0.6 ? cortado.slice(0, ultimoEspaco) : cortado;

  // Evita terminar em conectivo solto ("… com PostgreSQL e…"), recuando para
  // a palavra anterior.
  const conectivos = new Set(["e", "ou", "com", "de", "da", "do", "em", "para", "a", "o"]);
  let palavras = base.split(" ");
  while (palavras.length > 1 && conectivos.has(palavras[palavras.length - 1].toLowerCase())) {
    palavras = palavras.slice(0, -1);
    base = palavras.join(" ");
  }

  return `${base.replace(/[\s,;:.–-]+$/, "")}…`;
}
