import type { Metadata } from "next";
import Link from "next/link";
import { getPerfil, getProjetosImplementados, getRoadmap } from "../lib/content";
import { ETAPAS_INTEGRACAO_CONTINUA } from "../lib/ci";
import ProjectCard from "../components/project/ProjectCard";
import BuildEvidence from "../components/home/BuildEvidence";

export function generateMetadata(): Metadata {
  const perfil = getPerfil();
  return {
    title: { absolute: `${perfil.nome} — ${perfil.tituloPosicionamento}` },
    description: perfil.descricaoPosicionamento,
    alternates: { canonical: "/" },
  };
}

export default function Home() {
  const perfil = getPerfil();
  const implementados = getProjetosImplementados();
  const planejados = getRoadmap();
  const destaques = implementados.filter((p) => p.destaque).slice(0, 6);
  const competencias = new Set(perfil.competenciasPorArea.flatMap((area) => area.competencias));
  const projetosComEvidencia = implementados
    .filter((p) => p.competenciasDemonstradas.some((c) => competencias.has(c)))
    .map((p) => p.titulo);
  const [primeiroNome, ...sobrenomes] = perfil.nome.split(" ");

  return (
    <>
      <section className="home-intro" aria-labelledby="hero-title">
        <div className="home-intro__identity">
          <h1 id="hero-title" className="home-name" aria-label={perfil.nome}>
            {primeiroNome}
            <span className="home-name__last">
              {sobrenomes.join(" ")}
              <span className="signature-period" aria-hidden="true">
                .
              </span>
            </span>
          </h1>
          <p className="home-intro__role">{perfil.tituloPosicionamento}</p>
          <p className="home-intro__description">{perfil.descricaoPosicionamento}</p>
          <div className="home-intro__actions">
            <a className="button button--primary" href="#projects-title">
              Ver projetos em destaque
            </a>
            <Link className="text-link" href="/curriculo">
              Ver currículo
            </Link>
          </div>
        </div>
        <section className="home-competencies" aria-labelledby="competencies-title">
          <h2 id="competencies-title">Competências comprovadas nesta plataforma</h2>
          <div className="competency-grid">
            {perfil.competenciasPorArea.map((area) => (
              <section className="competency-card" key={area.area}>
                <h3>{area.area}</h3>
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
            aparecem apenas como estudo no <Link href="/roadmap">roadmap de estudos</Link>
            {"; não são competências declaradas nesta ficha."}
          </p>
        </section>
      </section>
      <section className="station" aria-labelledby="projects-title">
        <div className="station__head">
          <h2 id="projects-title" tabIndex={-1}>
            Trabalho em prática.
          </h2>
          <p>
            {implementados.length} projetos implementados, com suas decisões e limitações.{" "}
            <Link className="text-link" href="/projetos">
              Ver todas as fichas
            </Link>
          </p>
        </div>
        {destaques.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum projeto em destaque no momento.</p>
            <Link className="text-link" href="/projetos">
              Consultar todos os projetos
            </Link>
          </div>
        ) : (
          <div className="project-grid">
            {destaques.map((projeto) => (
              <ProjectCard
                key={projeto.slug}
                projeto={projeto}
                headingLevel={3}
                contatoEmail={perfil.contato.valor}
                competenciasPorArea={perfil.competenciasPorArea}
              />
            ))}
          </div>
        )}
      </section>
      <section className="station" aria-labelledby="build-title">
        <div className="station__head">
          <h2 id="build-title">Da fonte à página.</h2>
          {/*
            O repositório desta plataforma é privado (FR-009a): os arquivos são
            nomeados, não linkados — para um visitante anônimo, o GitHub responde
            404. O acesso ao código segue pelo pedido do cartão e da ficha.
          */}
          <p>
            Testes E2E com Playwright e verificações WCAG 2.1 A/AA com axe-core, executados
            separadamente na integração contínua.
          </p>
        </div>
        <BuildEvidence>
          <h3>O que sustenta esta plataforma</h3>
          <dl className="structure-notes__list">
            <div>
              <dt>Conteúdo rastreável</dt>
              <dd>
                Nome, posicionamento e competências vêm de <code>content/profile.json</code>; cada
                projeto, de um arquivo em <code>content/projects/</code>. Não há CMS nem banco.
              </dd>
            </div>
            <div>
              <dt>Validação antes de publicar</dt>
              <dd>
                <code>lib/content.ts</code> verifica o conteúdo em tempo de build. Campo obrigatório
                ausente, link em formato inválido ou imagem inexistente interrompe a publicação. Os
                testes de validação ficam em <code>tests/unit/content.test.ts</code>.
              </dd>
            </div>
            <div>
              <dt>Competências com evidência</dt>
              <dd>
                As {competencias.size} competências declaradas no perfil aparecem em trabalho
                implementado: {projetosComEvidencia.join(", ")}. Projetos apenas planejados não
                contam como evidência.
              </dd>
            </div>
          </dl>
        </BuildEvidence>
        <div className="ci-record">
          <h3>Integração contínua desta plataforma</h3>
          <ol className="pipeline" role="list" aria-label="Etapas da integração contínua, em ordem">
            {ETAPAS_INTEGRACAO_CONTINUA.map((etapa) => (
              <li key={etapa.rotulo}>{etapa.rotulo}</li>
            ))}
          </ol>
          <p>
            Ordem configurada em <code>.github/workflows/ci.yml</code>. Este registro descreve o
            fluxo; não representa uma execução ao vivo.
          </p>
        </div>
      </section>
      {planejados.length > 0 ? (
        <section className="station" aria-labelledby="planned-title">
          <div className="station__head">
            <h2 id="planned-title">Caminho em construção.</h2>
            <p>
              Escopo planejado de estudo. Nada aqui existe como código; por isso fica separado dos
              projetos implementados.
            </p>
          </div>
          <div className="planned-summary">
            <p>
              {planejados.length === 1
                ? "1 projeto registrado como escopo planejado."
                : `${planejados.length} projetos registrados como escopo planejado.`}
            </p>
            <Link className="button" href="/roadmap">
              Consultar o roadmap
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
