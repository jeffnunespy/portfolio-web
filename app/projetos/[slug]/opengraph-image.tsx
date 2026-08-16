import { notFound } from "next/navigation";
import { getProjetoBySlug, getProjetos } from "../../../lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage, truncar } from "../../../lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Estudo de caso do portfólio";

export function generateStaticParams() {
  return getProjetos().map((projeto) => ({ slug: projeto.slug }));
}

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: OgImageProps) {
  const { slug } = await params;
  const projeto = getProjetoBySlug(slug);

  if (!projeto) {
    notFound();
  }

  return renderOgImage({
    eyebrow: `${projeto.categoria} · ${projeto.status}`,
    titulo: projeto.titulo,
    descricao: truncar(projeto.resumo, 160),
  });
}
