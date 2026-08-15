import type { Metadata } from "next";
import { getPerfil, getProjetos } from "../lib/content";
import ProjectCard from "../components/project/ProjectCard";
import Link from "next/link";

export function generateMetadata(): Metadata {
  const perfil = getPerfil();

  return {
    title: perfil.tituloPosicionamento,
    description: perfil.descricaoPosicionamento,
  };
}

export default function Home() {
  const perfil = getPerfil();
  const projetos = getProjetos()
    .filter((p) => p.destaque)
    .slice(0, 6);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__eyebrow">Backend · Engenharia de Software · Cloud · DevOps</div>
        <h1 id="hero-title">{perfil.tituloPosicionamento}</h1>
        <p className="hero__description">{perfil.descricaoPosicionamento}</p>
        <div className="hero__actions">
          <Link className="button button--primary" href="/projetos">
            Explorar projetos
          </Link>
          <Link className="button button--secondary" href="/curriculo">
            Ver currículo
          </Link>
        </div>

        <div className="competency-grid" aria-label="Competências por área">
          {perfil.competenciasPorArea.map((area, index) => (
            <section
              className={`competency-card${index < 2 ? " competency-card--depth" : ""}`}
              key={area.area}
            >
              <span className="competency-card__kind">
                {index < 2 ? "Área de profundidade" : "Competência complementar"}
              </span>
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
          <div>
            <p className="eyebrow">Trabalho em contexto</p>
            <h2 id="featured-projects-title">Projetos em destaque</h2>
          </div>
          <Link className="text-link" href="/projetos">
            Ver todos os projetos
          </Link>
        </div>
        {projetos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum projeto em destaque no momento.</p>
            <Link href="/projetos">Consultar todos os projetos</Link>
          </div>
        ) : (
          <div className="project-grid">
            {projetos.map((projeto) => (
              <ProjectCard key={projeto.slug} projeto={projeto} headingLevel={3} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
