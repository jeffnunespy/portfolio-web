import { notFound } from "next/navigation";
import { getProjetosImplementados } from "../../../lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage, truncar } from "../../../lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Estudo de caso do portfólio";

export function generateStaticParams() {
  return getProjetosImplementados().map((projeto) => ({ slug: projeto.slug }));
}

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: OgImageProps) {
  const { slug } = await params;
  const projeto = getProjetosImplementados().find((item) => item.slug === slug);

  if (!projeto) {
    notFound();
  }

  return renderOgImage({
    indice: `Ficha · ${projeto.slug}`,
    titulo: projeto.titulo,
    descricao: truncar(projeto.resumo, 160),
  });
}
