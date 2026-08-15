import Link from "next/link";
import type { Projeto } from "../../lib/types";
import ProjectImage from "./ProjectImage";
import ProjectStatusBadge from "./ProjectStatusBadge";

export interface ProjectCardProps {
  projeto: Projeto;
  headingLevel?: 2 | 3;
}

const NATUREZA_LABEL: Record<Projeto["natureza"], string> = {
  autoral: "Autoral",
  acadêmico: "Acadêmico",
  colaborativo: "Colaborativo",
  profissional: "Profissional",
};

export default function ProjectCard({ projeto, headingLevel = 2 }: ProjectCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="project-card" data-testid="project-card">
      <ProjectImage src={projeto.imagemApresentacao} title={projeto.titulo} />
      <div className="project-card__body">
        <div className="project-card__meta" aria-label="Classificação do projeto">
          <ProjectStatusBadge status={projeto.status} />
          <span className="tag">{projeto.categoria}</span>
          <span className="tag">{NATUREZA_LABEL[projeto.natureza]}</span>
        </div>

        <Heading>{projeto.titulo}</Heading>
        <p className="project-card__summary">{projeto.resumo}</p>
        <p className="project-card__problem">
          <strong>Problema:</strong> {projeto.problemaTratado}
        </p>

        <ul className="chip-list" aria-label={`Tecnologias de ${projeto.titulo}`}>
          {projeto.tecnologias.map((tecnologia) => (
            <li key={tecnologia}>{tecnologia}</li>
          ))}
        </ul>

        <p className="project-card__evidence">
          <strong>Competências:</strong> {projeto.competenciasDemonstradas.join(", ")}
        </p>

        <div className="project-card__actions">
          <Link className="button button--primary" href={`/projetos/${projeto.slug}`}>
            Ver detalhes de {projeto.titulo}
          </Link>
          {projeto.linkDemonstracao ? (
            <a
              className="text-link"
              href={projeto.linkDemonstracao}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver demonstração
            </a>
          ) : null}
          {projeto.linkRepositorio && projeto.linkRepositorio !== "privado" ? (
            <a
              className="text-link"
              href={projeto.linkRepositorio}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver código
            </a>
          ) : projeto.linkRepositorio === "privado" ? (
            <span className="muted-label">Código privado</span>
          ) : (
            <span className="muted-label">Código não disponível publicamente</span>
          )}
        </div>
      </div>
    </article>
  );
}
