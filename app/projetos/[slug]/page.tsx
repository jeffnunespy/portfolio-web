import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EvidenceLink from "../../../components/project/EvidenceLink";
import ProjectImage from "../../../components/project/ProjectImage";
import ProjectStatusBadge from "../../../components/project/ProjectStatusBadge";
import { getPerfil, getProjetoBySlug, getProjetos } from "../../../lib/content";
import { NATUREZA_LABEL } from "../../../lib/labels";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getProjetos().map((projeto) => ({ slug: projeto.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const projeto = getProjetoBySlug(slug);

  if (!projeto) {
    return {
      title: "Projeto não encontrado",
      description: "O projeto solicitado não está disponível.",
    };
  }

  return {
    title: projeto.titulo,
    description: projeto.resumo,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projeto = getProjetoBySlug(slug);

  if (!projeto) {
    notFound();
  }

  const perfil = getPerfil();

  return (
    <article className="project-detail">
      <header className="project-detail__hero">
        <p className="eyebrow">Estudo de caso · {NATUREZA_LABEL[projeto.natureza]}</p>
        <h1>{projeto.titulo}</h1>
        <p className="project-detail__lead">{projeto.resumo}</p>
        <div className="project-card__meta" aria-label="Classificação do projeto">
          <ProjectStatusBadge status={projeto.status} />
          <span className="tag">{projeto.categoria}</span>
          <span className="tag">{NATUREZA_LABEL[projeto.natureza]}</span>
        </div>
      </header>

      <ProjectImage src={projeto.imagemApresentacao} title={projeto.titulo} />

      <div className="project-detail__content">
        <section>
          <h2>Contexto</h2>
          <p>{projeto.contexto}</p>
          <p>
            <strong>Problema tratado:</strong> {projeto.problemaTratado}
          </p>
        </section>

        <section>
          <h2>Objetivo</h2>
          <p>{projeto.objetivo}</p>
        </section>

        <section>
          <h2>Funcionalidades principais</h2>
          <ul>
            {projeto.funcionalidadesPrincipais.map((funcionalidade) => (
              <li key={funcionalidade}>{funcionalidade}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Minha responsabilidade</h2>
          <p>{projeto.responsabilidadeProprietario}</p>
        </section>

        <section className="project-detail__wide">
          <h2>Decisões relevantes</h2>
          <div className="decision-grid">
            {projeto.decisoesRelevantes.map((decisao) => (
              <article className="decision-card" data-testid="decision-card" key={decisao.titulo}>
                <h3>{decisao.titulo}</h3>
                <p>{decisao.descricao}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>Stack</h2>
          <ul className="chip-list">
            {projeto.stack.map((tecnologia) => (
              <li key={tecnologia}>{tecnologia}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Situação atual</h2>
          <p>
            O projeto está com status <strong>{projeto.status}</strong>.
          </p>
        </section>

        <section>
          <h2>Limitações conhecidas</h2>
          <ul>
            {projeto.limitacoesConhecidas.map((limitacao) => (
              <li key={limitacao}>{limitacao}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Próximos passos</h2>
          <ul>
            {projeto.proximosPassos.map((passo) => (
              <li key={passo}>{passo}</li>
            ))}
          </ul>
        </section>

        <section className="project-detail__wide">
          <h2>Links relacionados</h2>
          <EvidenceLink
            contatoEmail={perfil.contato.valor}
            linkDemonstracao={projeto.linkDemonstracao}
            linkRepositorio={projeto.linkRepositorio}
          />
        </section>
      </div>
    </article>
  );
}
