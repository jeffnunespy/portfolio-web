import { getPerfil } from "../../lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage, truncar } from "../../lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Currículo profissional";

export default function Image() {
  const perfil = getPerfil();

  return renderOgImage({
    indice: "Registro 003 · Currículo",
    titulo: "Currículo",
    descricao: truncar(perfil.tituloPosicionamento, 160),
  });
}
