import type { Metadata } from "next";
import Link from "next/link";
import { getRoadmap } from "../../lib/content";
import { NATUREZA_LABEL } from "../../lib/labels";

const descricao =
  "Escopo planejado: projetos com problema e objetivo definidos, ainda sem software implementado.";

export const metadata: Metadata = {
  title: "Roadmap",
  description: descricao,
  alternates: { canonical: "/roadmap" },
  openGraph: {
    title: "Roadmap",
    description: descricao,
    url: "/roadmap",
  },
};

export default function RoadmapPage() {
  const planejados = getRoadmap();

  return (
    <section className="page-section page-intro" aria-labelledby="roadmap-title">
      <div className="hero__index">
        <span>Registro 003 · Escopo planejado</span>
        <span>
          {planejados.length} {planejados.length === 1 ? "entrada" : "entradas"}
        </span>
      </div>
      <h1 id="roadmap-title">Roadmap</h1>
      <p className="page-intro__lead">
        Estas entradas registram intenção, não entrega. Nenhuma delas existe como software hoje, e
        nenhuma sustenta competência declarada no currículo. Estão publicadas para tornar o
        planejamento auditável — não para serem lidas como trabalho realizado.
      </p>

      {planejados.length > 0 ? (
        <ol role="list" className="roadmap-list">
          {planejados.map((projeto) => (
            <li key={projeto.slug} className="roadmap-entry">
              <div className="roadmap-entry__index">
                <span className="muted-label">{NATUREZA_LABEL[projeto.natureza]}</span>
                <span className="muted-label">{projeto.categoria}</span>
              </div>
              <h2>{projeto.titulo}</h2>
              <p className="roadmap-entry__problem">
                <strong>Problema que pretende tratar:</strong> {projeto.problemaTratado}
              </p>
              <p className="roadmap-entry__goal">
                <strong>Objetivo:</strong> {projeto.objetivo}
              </p>
              <ul
                role="list"
                className="chip-list"
                aria-label={`Stack prevista de ${projeto.titulo}`}
              >
                {projeto.stack.map((tecnologia) => (
                  <li key={tecnologia}>{tecnologia}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-state">Nenhuma entrada de escopo planejado registrada.</p>
      )}

      <p className="page-intro__aside">
        Para o que já está implementado e verificável,{" "}
        <Link className="text-link" href="/projetos">
          consulte as fichas de projeto
        </Link>
      </p>
    </section>
  );
}
