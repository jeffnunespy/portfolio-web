import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../../lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Roadmap — escopo planejado";

export default function Image() {
  return renderOgImage({
    indice: "Escopo planejado",
    titulo: "Roadmap",
    descricao: "Problemas, objetivos e tecnologias previstas.",
  });
}
