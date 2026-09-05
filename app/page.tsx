import type { Metadata } from "next";
import { getPerfil, getProjetosImplementados, getRoadmap } from "../lib/content";
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
  const implementados = getProjetosImplementados();
  const planejados = getRoadmap();
  const destaques = implementados.filter((p) => p.destaque).slice(0, 6);

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

        <div className="hero__layout">
          <div className="hero__body">
            <h1 id="hero-title" className="hero__name">
              {perfil.tituloPosicionamento}
            </h1>

            <p className="hero__description">{perfil.descricaoPosicionamento}</p>

            <p className="hero__stamp">Em formação</p>

            <div className="hero__evidence">
              <Link className="button button--primary" href="/projetos/plataforma-portfolio">
                Ver implementação e verificações
              </Link>
              <p id="hero-evidence-note" className="hero__evidence-note">
                Fluxos E2E com Playwright e WCAG 2.1 A/AA com axe-core, executados como gates
                separados no CI.
              </p>
            </div>

            <div className="hero__actions hero__actions--secondary">
              <Link className="button button--secondary" href="/projetos">
                Consultar fichas
              </Link>
              <Link className="button button--secondary" href="/curriculo">
                Ver currículo
              </Link>
              <a
                className="button button--secondary"
                href={perfil.linkLinkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar pelo LinkedIn
              </a>
            </div>
          </div>

          <dl className="hero__record">
            <div>
              <dt>Áreas de profundidade</dt>
              <dd>{areasProfundidade.join(" · ")}</dd>
            </div>
            <div>
              <dt>Competências comprovadas</dt>
              <dd>{totalCompetencias}</dd>
            </div>
            <div>
              <dt>Projetos implementados</dt>
              <dd>{implementados.length}</dd>
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
        </div>
      </section>

      <section className="page-section" aria-labelledby="competencies-title">
        <div className="section-heading">
          <h2 id="competencies-title">Competências comprovadas nesta plataforma</h2>
        </div>

        <div className="competency-grid">
          {perfil.competenciasPorArea.map((area, index) => (
            <section
              className={`competency-card${index < 2 ? " competency-card--depth" : ""}`}
              key={area.area}
            >
              <h3>{area.area}</h3>
              {/* role="list" preserva a semântica que o Safari/VoiceOver descarta quando list-style é none. */}
              <ul role="list">
                {area.competencias.map((competencia) => (
                  <li key={competencia}>{competencia}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="competency-roadmap-note">
          Tecnologias de backend e cloud, como Python, Django, Docker e Google Cloud Platform,
          aparecem apenas como estudo no{" "}
          <Link className="text-link" href="/roadmap">
            roadmap de estudos
          </Link>
          {"; não são competências declaradas nesta ficha."}
        </p>
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
          <div className="project-grid">
            {destaques.map((projeto) => (
              <ProjectCard key={projeto.slug} projeto={projeto} headingLevel={3} />
            ))}
          </div>
        )}

        {planejados.length > 0 ? (
          <p className="page-intro__aside">
            Outros {planejados.length} projetos estão registrados como escopo planejado, sem
            software implementado.{" "}
            <Link className="text-link" href="/roadmap">
              Consultar o roadmap
            </Link>
          </p>
        ) : null}
      </section>
    </>
  );
}
