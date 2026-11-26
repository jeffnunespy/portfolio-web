import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../../lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Aviso de privacidade do portfólio";

export default function Image() {
  return renderOgImage({
    indice: "Registro 004 · Privacidade",
    titulo: "Privacidade",
    descricao: "Dados técnicos da hospedagem, mensagens por e-mail e direitos previstos na LGPD.",
  });
}
