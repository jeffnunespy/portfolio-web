import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../../lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Roadmap de estudos — escopo planejado";

export default function Image() {
  return renderOgImage({
    indice: "Planejamento · Roadmap de estudos",
    titulo: "Roadmap",
    descricao: "Escopo planejado: projetos ainda sem software implementado.",
  });
}
