import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_CONTENT_TYPE = "image/png";

interface OgImageParams {
  /** Linha de índice da ficha: identifica o registro, não vende o conteúdo. */
  indice: string;
  titulo: string;
  descricao?: string;
}

// Gera o PNG de preview em tempo de build, na paleta noturna de levantamento
// de app/globals.css: marfim sobre terreno escuro, filetes de curva de nível,
// zero raio e laranja só no estado "em formação".
// Usa apenas as fontes padrão do runtime — o cartão não carrega webfont.
export function renderOgImage({ indice, titulo, descricao }: OgImageParams): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#0c0f0e",
        color: "#e7e4da",
        border: "3px solid #34403a",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "2px solid #5b6862",
          paddingBottom: 20,
          fontSize: 24,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#7f877f",
        }}
      >
        <div>{indice}</div>
        <div>pt-BR</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ fontSize: 72, fontWeight: 400, lineHeight: 1.1 }}>{titulo}</div>
        {descricao ? (
          <div style={{ fontSize: 31, lineHeight: 1.45, color: "#a9aea6" }}>{descricao}</div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #34403a",
          paddingTop: 20,
          fontSize: 25,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#7f877f",
        }}
      >
        <div>{SITE_NAME}</div>
        <div style={{ color: "#ff9a6b" }}>Em formação</div>
      </div>
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
