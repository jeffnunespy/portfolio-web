import type { Metadata } from "next";
import { getPerfil, getProjetos } from "../lib/content";
import ProjectCard from "../components/project/ProjectCard";
import Link from "next/link";

export function generateMetadata(): Metadata {
  const perfil = getPerfil();

  return {
    // A home usa o título absoluto: o template "%s | Portfólio" do layout
    // duplicaria o posicionamento que já é o title padrão do site.
    title: { absolute: perfil.tituloPosicionamento },
    description: perfil.descricaoPosicionamento,
    alternates: { canonical: "/" },
  };
}

export default function Home() {
  const perfil = getPerfil();
  const todosProjetos = getProjetos();
  const destaques = todosProjetos.filter((p) => p.destaque).slice(0, 6);
  const projetosReais = destaques.filter((p) => p.real);
  const projetosEstrutura = destaques.filter((p) => !p.real);

  const areasProfundidade = perfil.competenciasPorArea.slice(0, 2).map((a) => a.area);
  const totalCompetencias = perfil.competenciasPorArea.reduce(
    (soma, area) => soma + area.competencias.length,
    0,
  );

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__index">
          <span>Registro 001 · Portfólio profissional</span>
          <span>pt-BR</span>
        </div>

        <h1 id="hero-title" className="hero__name">
          {perfil.tituloPosicionamento}
        </h1>

        <p className="hero__description">{perfil.descricaoPosicionamento}</p>

        <p className="hero__stamp">Em formação</p>

        <div className="hero__actions">
          <Link className="button button--primary" href="/projetos">
            Consultar fichas
          </Link>
          <Link className="button button--secondary" href="/curriculo">
            Ver currículo
          </Link>
        </div>

        <dl className="hero__record">
          <div>
            <dt>Áreas de profundidade</dt>
            <dd>{areasProfundidade.join(" · ")}</dd>
          </div>
          <div>
            <dt>Competências catalogadas</dt>
            <dd>{totalCompetencias}</dd>
          </div>
          <div>
            <dt>Fichas de projeto</dt>
            <dd>{todosProjetos.length}</dd>
          </div>
          <div>
            <dt>Código-fonte</dt>
            <dd>
              <a
                className="text-link"
                href={perfil.linkGithub}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="page-section" aria-labelledby="competencies-title">
        <div className="section-heading">
          <h2 id="competencies-title">Competências por área</h2>
        </div>

        <div className="competency-grid">
          {perfil.competenciasPorArea.map((area, index) => (
            <section
              className={`competency-card${index < 2 ? " competency-card--depth" : ""}`}
              key={area.area}
            >
              <h3>{area.area}</h3>
              <ul>
                {area.competencias.map((competencia) => (
                  <li key={competencia}>{competencia}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="page-section" aria-labelledby="featured-projects-title">
        <div className="section-heading">
          <h2 id="featured-projects-title">Projetos em destaque</h2>
          <Link className="text-link" href="/projetos">
            Ver todas as fichas
          </Link>
        </div>
        {destaques.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum projeto em destaque no momento.</p>
            <Link href="/projetos">Consultar todos os projetos</Link>
          </div>
        ) : (
          <>
            {projetosReais.length > 0 ? (
              <div className="project-grid">
                {projetosReais.map((projeto) => (
                  <ProjectCard key={projeto.slug} projeto={projeto} headingLevel={3} />
                ))}
              </div>
            ) : null}

            {projetosEstrutura.length > 0 ? (
              <div className="project-group project-group--estrutura">
                <p className="project-group__label">
                  Estrutura de conteúdo em validação — projetos ainda não implementados
                </p>
                <div className="project-grid">
                  {projetosEstrutura.map((projeto) => (
                    <ProjectCard key={projeto.slug} projeto={projeto} headingLevel={3} />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
