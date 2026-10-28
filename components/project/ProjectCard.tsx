import Link from "next/link";
import { NATUREZA_LABEL, emailConfigurado, estadoRepositorio } from "../../lib/labels";
import type { CompetenciaPorArea, ProjetoImplementado } from "../../lib/types";
import ProjectImage from "./ProjectImage";
import ProjectMark from "./ProjectMark";
import ProjectStatusBadge from "./ProjectStatusBadge";

export interface ProjectCardProps {
  projeto: ProjetoImplementado;
  headingLevel?: 2 | 3;
  contatoEmail?: string;
  competenciasPorArea?: CompetenciaPorArea[];
}

export default function ProjectCard({
  projeto,
  headingLevel = 2,
  contatoEmail,
  competenciasPorArea = [],
}: ProjectCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const repositorio = estadoRepositorio(projeto.linkRepositorio);
  // FR-006a dispensa apenas a apresentação da imagem, preservando o dado e seu arquivo.
  const textual = projeto.slug === "nana-silva";
  const decisao = projeto.decisoesRelevantes[0];
  const grupos = competenciasPorArea
    .map(({ area, competencias }) => ({
      area,
      competencias: competencias.filter((c) => projeto.competenciasDemonstradas.includes(c)),
    }))
    .filter(({ competencias }) => competencias.length > 0);
  const competenciasAgrupadas = new Set(grupos.flatMap(({ competencias }) => competencias));
  const semArea = projeto.competenciasDemonstradas.filter((c) => !competenciasAgrupadas.has(c));
  if (semArea.length > 0) {
    grupos.push({ area: "Outras competências", competencias: semArea });
  }

  return (
    <article
      className={`project-card${textual ? " project-card--textual" : ""}`}
      data-testid="project-card"
    >
      {!textual ? <ProjectImage src={projeto.imagemApresentacao} /> : null}
      <div className="project-card__body">
        <div className="project-card__story">
          <div className="project-card__meta" role="group" aria-label="Classificação do projeto">
            <ProjectStatusBadge status={projeto.status} />
            <span className="tag">{projeto.categoria}</span>
            <span className="tag">{NATUREZA_LABEL[projeto.natureza]}</span>
            {textual ? <span>Em validação</span> : null}
          </div>
          <Heading>
            <ProjectMark />
            {projeto.titulo}
          </Heading>
          <p className="project-card__summary">{projeto.resumo}</p>
          <p className="project-card__problem">
            <strong>Problema:</strong> {projeto.problemaTratado}
          </p>
        </div>
        <div className="project-card__proof">
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
            {repositorio === "publico" ? (
              <a
                className="text-link"
                href={projeto.linkRepositorio}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver código-fonte
              </a>
            ) : repositorio === "privado" ? (
              <>
                <span className="muted-label">Código privado</span>
                {contatoEmail && emailConfigurado(contatoEmail) ? (
                  <a
                    className="text-link"
                    href={`mailto:${contatoEmail}?subject=Acesso ao código do projeto`}
                  >
                    Solicitar acesso ao código
                  </a>
                ) : null}
              </>
            ) : (
              <span className="muted-label">Código não disponível publicamente</span>
            )}
          </div>
          <ul role="list" className="chip-list" aria-label={`Tecnologias de ${projeto.titulo}`}>
            {projeto.tecnologias.map((tecnologia) => (
              <li key={tecnologia}>{tecnologia}</li>
            ))}
          </ul>
          <div className="project-card__evidence">
            <p>Competências:</p>
            <dl className="project-card__competencies">
              {grupos.map(({ area, competencias }) => (
                <div key={area}>
                  <dt>{area}</dt>
                  <dd>{competencias.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {decisao ? (
          <details className="project-card__decisions">
            <summary>Escolhas e limites de {projeto.titulo}</summary>
            <div className="detail-content">
              <p>
                <strong>{decisao.titulo}</strong>
                {decisao.descricao}
              </p>
              <div>
                <strong>Limitações conhecidas</strong>
                <p>{projeto.limitacoesConhecidas[0]}</p>
              </div>
            </div>
          </details>
        ) : null}
      </div>
    </article>
  );
}
