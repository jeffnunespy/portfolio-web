import type { Metadata } from "next";
import ProjectCard from "../../components/project/ProjectCard";
import { getProjetos } from "../../lib/content";

const descricao =
  "Estudos de caso com contexto, decisões técnicas, responsabilidades e limitações.";

export const metadata: Metadata = {
  title: "Projetos",
  description: descricao,
  alternates: { canonical: "/projetos" },
  openGraph: {
    title: "Projetos",
    description: descricao,
    url: "/projetos",
  },
};

export default function ProjectsPage() {
  const projetos = getProjetos();
  const projetosReais = projetos.filter((p) => p.real);
  const projetosEstrutura = projetos.filter((p) => !p.real);

  return (
    <section className="page-section page-intro" aria-labelledby="projects-title">
      <div className="hero__index">
        <span>Registro 002 · Fichas de projeto</span>
        <span>{projetos.length} fichas</span>
      </div>
      <h1 id="projects-title">Projetos</h1>
      <p className="page-intro__lead">
        Decisões, responsabilidades e aprendizados apresentados com contexto e limitações.
      </p>

      {projetosReais.length > 0 ? (
        <div className="project-grid">
          {projetosReais.map((projeto) => (
            <ProjectCard key={projeto.slug} projeto={projeto} />
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
              <ProjectCard key={projeto.slug} projeto={projeto} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
