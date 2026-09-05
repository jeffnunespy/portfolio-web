import type { Metadata } from "next";
import Link from "next/link";
import { getRoadmap } from "../../lib/content";
import { NATUREZA_LABEL } from "../../lib/labels";

const descricao =
  "Escopo planejado: projetos com problema e objetivo definidos, ainda sem software implementado.";

const PLATAFORMA_GCP = "Google Cloud Platform";

function StackPlanejada({
  slug,
  titulo,
  tecnologias,
}: {
  slug: string;
  titulo: string;
  tecnologias: string[];
}) {
  const indiceGcp = tecnologias.indexOf(PLATAFORMA_GCP);
  const baseTecnica = indiceGcp >= 0 ? tecnologias.slice(0, indiceGcp) : tecnologias;
  const servicosGcp = indiceGcp >= 0 ? tecnologias.slice(indiceGcp + 1) : [];
  const grupos = [
    {
      rotulo: servicosGcp.length > 0 ? "Aplicação" : "Base técnica",
      tecnologias: baseTecnica,
    },
    ...(servicosGcp.length > 0 ? [{ rotulo: PLATAFORMA_GCP, tecnologias: servicosGcp }] : []),
  ];
  const tituloId = `${slug}-stack-prevista`;

  return (
    <section className="roadmap-stack" aria-labelledby={tituloId}>
      <h3 id={tituloId}>Stack prevista</h3>
      <dl className="roadmap-stack__groups">
        {grupos.map((grupo) => (
          <div key={grupo.rotulo} className="roadmap-stack__group">
            <dt>{grupo.rotulo}</dt>
            <dd>
              <ul role="list" aria-label={`${grupo.rotulo} prevista de ${titulo}`}>
                {grupo.tecnologias.map((tecnologia) => (
                  <li key={tecnologia}>{tecnologia}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

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
              <StackPlanejada
                slug={projeto.slug}
                titulo={projeto.titulo}
                tecnologias={projeto.stack}
              />
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
