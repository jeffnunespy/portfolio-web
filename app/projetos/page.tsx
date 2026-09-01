import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "../../components/project/ProjectCard";
import { getProjetosImplementados, getRoadmap } from "../../lib/content";

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
  const projetos = getProjetosImplementados();
  const planejados = getRoadmap();

  return (
    <section className="page-section page-intro" aria-labelledby="projects-title">
      <div className="hero__index">
        <span>Registro 002 · Fichas de projeto</span>
        {/*
          A contagem carrega o acervo inteiro, não só esta rota. "1 ficha"
          sozinho lê como acervo vazio; o par implementado/planejado é dado
          real e anuncia a existência do roadmap acima da dobra, sem precisar
          de um segundo CTA.
        */}
        <span>
          {projetos.length} {projetos.length === 1 ? "implementado" : "implementados"}
          {planejados.length > 0 ? ` · ${planejados.length} planejados` : ""}
        </span>
      </div>
      <h1 id="projects-title">Projetos</h1>
      <p className="page-intro__lead">
        Decisões, responsabilidades e aprendizados apresentados com contexto e limitações. Esta rota
        lista apenas software implementado.
      </p>

      {projetos.length > 0 ? (
        <div className="project-grid">
          {projetos.map((projeto) => (
            <ProjectCard key={projeto.slug} projeto={projeto} />
          ))}
        </div>
      ) : (
        <p className="empty-state">Nenhuma ficha de projeto implementado publicada até aqui.</p>
      )}

      {planejados.length > 0 ? (
        <p className="page-intro__aside">
          Há {planejados.length} projetos registrados como escopo planejado — intenção declarada,
          ainda sem software.{" "}
          <Link className="text-link" href="/roadmap">
            Consultar o roadmap
          </Link>
        </p>
      ) : null}
    </section>
  );
}
