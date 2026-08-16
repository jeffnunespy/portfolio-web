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

  return (
    <section className="page-section page-intro" aria-labelledby="projects-title">
      <p className="eyebrow">Estudos de caso</p>
      <h1 id="projects-title">Projetos</h1>
      <p className="page-intro__lead">
        Decisões, responsabilidades e aprendizados apresentados com contexto e limitações.
      </p>

      <div className="project-grid">
        {projetos.map((projeto) => (
          <ProjectCard key={projeto.slug} projeto={projeto} />
        ))}
      </div>
    </section>
  );
}
