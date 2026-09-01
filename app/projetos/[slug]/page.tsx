import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EvidenceLink from "../../../components/project/EvidenceLink";
import ProjectImage from "../../../components/project/ProjectImage";
import ProjectRecordFooter from "../../../components/project/ProjectRecordFooter";
import ProjectStatusBadge from "../../../components/project/ProjectStatusBadge";
import { getPerfil, getProjetosImplementados } from "../../../lib/content";
import { NATUREZA_LABEL } from "../../../lib/labels";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getProjetosImplementados().map((projeto) => ({ slug: projeto.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const projeto = getProjetosImplementados().find((item) => item.slug === slug);

  if (!projeto) {
    return {
      title: "Projeto não encontrado",
      description: "O projeto solicitado não está disponível.",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: projeto.titulo,
    description: projeto.resumo,
    alternates: { canonical: `/projetos/${projeto.slug}` },
    openGraph: {
      type: "article",
      title: projeto.titulo,
      description: projeto.resumo,
      url: `/projetos/${projeto.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  // Só ficha de projeto implementado é estudo de caso; escopo planejado tem
  // superfície própria em /roadmap e nunca resolve como ficha aqui.
  const projetos = getProjetosImplementados();
  const projeto = projetos.find((item) => item.slug === slug);

  if (!projeto) {
    notFound();
  }

  const perfil = getPerfil();

  return (
    <article className="project-detail">
      <header className="project-detail__hero">
        <div className="hero__index">
          <span>Ficha · {projeto.slug}</span>
          <span>{NATUREZA_LABEL[projeto.natureza]}</span>
        </div>
        <h1>{projeto.titulo}</h1>
        <p className="project-detail__lead">{projeto.resumo}</p>
        <div className="project-card__meta" role="group" aria-label="Classificação do projeto">
          <ProjectStatusBadge status={projeto.status} />
          <span className="tag">{projeto.categoria}</span>
          <span className="tag">{NATUREZA_LABEL[projeto.natureza]}</span>
        </div>
      </header>

      <ProjectImage src={projeto.imagemApresentacao} />

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
          <ul role="list">
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
          <ul role="list" className="chip-list">
            {projeto.stack.map((tecnologia) => (
              <li key={tecnologia}>{tecnologia}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Limitações conhecidas</h2>
          <ul role="list">
            {projeto.limitacoesConhecidas.map((limitacao) => (
              <li key={limitacao}>{limitacao}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Próximos passos</h2>
          <ul role="list">
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
            linkGithub={perfil.linkGithub}
          />
        </section>
      </div>

      <ProjectRecordFooter projeto={projeto} projetos={projetos} />
    </article>
  );
}
