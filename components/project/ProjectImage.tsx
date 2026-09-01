"use client";

import { useState } from "react";

export interface ProjectImageProps {
  src: string;
}

/**
 * Ficha de índice desenhada do projeto (`public/images/projects/*.svg`).
 *
 * A imagem é decorativa por decisão de design: conforme DESIGN.md, ela não é
 * captura de aplicação nem carrega informação ausente do texto — repete a
 * identificação que o título e os metadados adjacentes já dão. Por isso vai com
 * `alt=""` e sai da árvore de acessibilidade, em vez de duplicar o nome da ficha
 * no leitor de tela. Se algum dia essas imagens passarem a transmitir dado
 * próprio (uma captura real, um diagrama), o alternativo precisa descrever esse
 * dado — não voltar a repetir o título.
 */
export default function ProjectImage({ src }: ProjectImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    // O estado de falha também é decorativo: nada se perde para quem não vê a
    // moldura, porque a ficha inteira permanece legível em texto.
    return (
      <div className="project-image project-image--fallback" aria-hidden="true">
        <span>&lt;/&gt;</span>
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
      alt=""
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}
