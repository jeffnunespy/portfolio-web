import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../../lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Projetos do portfólio";

export default function Image() {
  return renderOgImage({
    eyebrow: "Estudos de caso",
    titulo: "Projetos",
    descricao: "Decisões, responsabilidades e limitações apresentadas com contexto.",
  });
}
