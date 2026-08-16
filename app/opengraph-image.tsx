import { getPerfil } from "../lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage, truncar } from "../lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portfólio profissional";

export default function Image() {
  const perfil = getPerfil();

  return renderOgImage({
    // Mesmo eyebrow exibido na home, em vez de repetir "Portfólio" que já
    // aparece no rodapé do cartão.
    eyebrow: "Backend · Engenharia de Software · Cloud · DevOps",
    titulo: perfil.tituloPosicionamento,
    descricao: truncar(perfil.descricaoPosicionamento, 160),
  });
}
