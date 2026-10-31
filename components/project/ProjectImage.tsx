export interface ProjectImageProps {
  src: string;
  descriptionHref: string;
  descriptionLabel: string;
}

/**
 * Ficha de índice decorativa: repete informação presente no texto do projeto.
 * Somente a superfície sai da árvore acessível; legenda e ação são legíveis.
 * Imagens com informação exclusiva exigem outro tratamento, não este componente.
 *
 * Não há estado React para reconciliar: o navegador apresenta carregamento,
 * cache e decodificação sem depender de eventos anteriores à hidratação.
 */
export default function ProjectImage({
  src,
  descriptionHref,
  descriptionLabel,
}: ProjectImageProps) {
  return (
    <figure className="project-image">
      <figcaption className="project-image__caption">
        <a className="text-link" href={descriptionHref}>
          {descriptionLabel}
        </a>
        <p>
          Prévia ilustrativa. Se a prévia não aparecer, a descrição do projeto continua disponível.
        </p>
      </figcaption>
      <div
        className="project-image__surface"
        aria-hidden="true"
        style={{ backgroundImage: src ? `url(${JSON.stringify(src)})` : undefined }}
      />
    </figure>
  );
}
