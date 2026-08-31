import { getPerfil } from "../../lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage, truncar } from "../../lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Sobre o profissional";

export default function Image() {
  const perfil = getPerfil();

  return renderOgImage({
    indice: "Registro 002 · Trajetória",
    titulo: "Sobre",
    descricao: truncar(perfil.tituloPosicionamento, 160),
  });
}
