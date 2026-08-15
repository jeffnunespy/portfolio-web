"use client";

import { useState } from "react";

export interface ProjectImageProps {
  src: string;
  title: string;
}

export default function ProjectImage({ src, title }: ProjectImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="project-image project-image--fallback"
        role="img"
        aria-label={`Imagem indisponível para ${title}`}
      >
        <span aria-hidden="true">&lt;/&gt;</span>
        <small>Imagem indisponível</small>
      </div>
    );
  }

  return (
    // A imagem é conteúdo versionado; onError garante um estado alternativo em falhas de rede/runtime.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="project-image"
      src={src}
      alt={`Imagem de apresentação do projeto ${title}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
