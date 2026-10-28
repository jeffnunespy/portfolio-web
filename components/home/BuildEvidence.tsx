import type { ReactNode } from "react";

const ETAPAS = [
  {
    titulo: "Conteúdo",
    descricao: "JSON versionado",
    desenho: "M6 3h11l5 5v17H6ZM17 3v6h5M10 14l-2 2 2 2m8-4 2 2-2 2m-4-5-2 6",
  },
  {
    titulo: "Validação",
    descricao: "Campos e evidências",
    desenho: "M14 3 24 7v7c0 5-6 9-10 11C10 23 4 19 4 14V7ZM9 14l3 3 7-7",
  },
  {
    titulo: "Publicação",
    descricao: "Páginas estáticas",
    desenho: "M3 5h22v18H3ZM3 10h22M7 7.5h2m2 0h2M8 15h12M8 19h8",
  },
] as const;

/** Comprovação disponível sem hidratação, eventos de ponteiro ou cálculo decorativo. */
export default function BuildEvidence({ children }: { children: ReactNode }) {
  return (
    <div className="build-evidence">
      <figure className="build-preview" aria-labelledby="build-caption">
        <ol className="build-flow" role="list" aria-label="Etapas do fluxo de publicação">
          {ETAPAS.map(({ titulo, descricao, desenho }, index) => (
            <li key={titulo}>
              <svg className="stage-icon" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
                <path d={desenho} />
              </svg>
              <strong>{titulo}</strong>
              <span>{descricao}</span>
              {index < ETAPAS.length - 1 ? (
                <svg className="flow-next" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                  <path d="M3 10h14m-5-5 5 5-5 5" />
                </svg>
              ) : null}
            </li>
          ))}
        </ol>
        <figcaption id="build-caption">
          O caminho do conteúdo até a página. Esquema simplificado do build.
        </figcaption>
      </figure>
      <details className="structure-notes" id="estrutura">
        <summary>Ver comprovação</summary>
        <div className="structure-notes__inner">{children}</div>
      </details>
    </div>
  );
}
