import Link from "next/link";
import type { Projeto } from "../../lib/types";

type ProjectReference = Pick<Projeto, "slug" | "titulo">;

interface ProjectRecordFooterProps {
  projeto: ProjectReference;
  projetos: ProjectReference[];
}

export default function ProjectRecordFooter({ projeto, projetos }: ProjectRecordFooterProps) {
  const currentIndex = projetos.findIndex((item) => item.slug === projeto.slug);
  const previousProject = currentIndex > 0 ? projetos[currentIndex - 1] : undefined;
  const nextProject = currentIndex >= 0 ? projetos[currentIndex + 1] : undefined;

  return (
    <footer className="project-record-footer">
      <div className="project-record-footer__orientation">
        <Link href="/projetos">← Todas as fichas</Link>
        {currentIndex >= 0 ? (
          <span className="project-record-footer__position">
            <span className="visually-hidden">
              Ficha {currentIndex + 1} de {projetos.length}
            </span>
            <span aria-hidden="true">
              {currentIndex + 1} / {projetos.length}
            </span>
          </span>
        ) : null}
      </div>

      {previousProject || nextProject ? (
        <nav
          aria-label="Navegação entre fichas de projeto"
          className="project-record-footer__navigation"
        >
          {previousProject ? (
            <Link
              className="project-record-footer__project-link project-record-footer__project-link--previous"
              href={`/projetos/${previousProject.slug}`}
            >
              <span>← Ficha anterior</span>
              <strong>{previousProject.titulo}</strong>
            </Link>
          ) : null}
          {nextProject ? (
            <Link
              className="project-record-footer__project-link project-record-footer__project-link--next"
              href={`/projetos/${nextProject.slug}`}
            >
              <span>Próxima ficha →</span>
              <strong>{nextProject.titulo}</strong>
            </Link>
          ) : null}
        </nav>
      ) : null}

      <section className="project-record-footer__resume" aria-labelledby="project-resume-title">
        <div>
          <h2 id="project-resume-title">Continue pelo currículo</h2>
          <p>
            Veja o resumo profissional, as competências técnicas e os perfis em uma visão
            consolidada.
          </p>
        </div>
        <Link className="button button--primary" href="/curriculo">
          Ver currículo
        </Link>
      </section>
    </footer>
  );
}
