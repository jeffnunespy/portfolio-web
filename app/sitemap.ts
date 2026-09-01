import type { MetadataRoute } from "next";
import { getProjetosImplementados } from "../lib/content";
import { SITE_URL } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const rotasEstaticas = ["/", "/projetos", "/roadmap", "/sobre", "/curriculo"];

  return [
    ...rotasEstaticas.map((rota) => ({
      url: new URL(rota, SITE_URL).toString(),
      changeFrequency: "monthly" as const,
      priority: rota === "/" ? 1 : 0.8,
    })),
    ...getProjetosImplementados().map((projeto) => ({
      url: new URL(`/projetos/${projeto.slug}`, SITE_URL).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
