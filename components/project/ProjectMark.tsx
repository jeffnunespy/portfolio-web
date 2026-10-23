/**
 * Marco topográfico que identifica trabalho implementado, conforme a legenda
 * da home. Decorativo: o título ao lado já diz de que projeto se trata, e
 * escopo planejado nunca recebe este sinal.
 */
export default function ProjectMark() {
  return (
    <svg className="project-mark" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M6 1 11 11H1Z" />
    </svg>
  );
}
