import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getPerfil, getProjetosImplementados, getRoadmap } from "../lib/content";
import { ETAPAS_INTEGRACAO_CONTINUA } from "../lib/ci";
import ProjectCard from "../components/project/ProjectCard";
import SurveyOpening from "../components/home/SurveyOpening";
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

// Separa o estado "em formação" para a segunda linha do título, em tom
// secundário, como na direção aprovada; sem o sufixo, o título fica inteiro.
function partesDoTitulo(titulo: string): [string, string | null] {
  const partes = /^(.*?)\s+(em formação)$/i.exec(titulo);
  return partes ? [partes[1], partes[2]] : [titulo, null];
}

export default function Home() {
  const perfil = getPerfil();
  const implementados = getProjetosImplementados();
  const planejados = getRoadmap();
  const destaques = implementados.filter((p) => p.destaque).slice(0, 6);

  const areasProfundidade = perfil.competenciasPorArea.slice(0, 2).map((a) => a.area);
  const competenciasDeclaradas = new Set(perfil.competenciasPorArea.flatMap((a) => a.competencias));
  // Mesma regra da validação de build (FR-024): só implementação conta como evidência.
  const projetosComEvidencia = implementados
    .filter((p) => p.competenciasDemonstradas.some((c) => competenciasDeclaradas.has(c)))
    .map((p) => p.titulo);
  const [tituloPrincipal, tituloEstado] = partesDoTitulo(perfil.tituloPosicionamento);

  return (
    <>
      <SurveyOpening
        tituloId="hero-title"
        corpo={
          <>
            <h1 id="hero-title" className="hero__title">
              <span className="hero__title-main">{tituloPrincipal}</span>
              {tituloEstado ? (
                <>
                  {" "}
                  <span className="hero__title-state">{tituloEstado}</span>
                </>
              ) : null}
            </h1>

            <p className="hero__description">{perfil.descricaoPosicionamento}</p>

            <div className="hero__evidence">
              <Link className="button button--primary" href="/projetos/plataforma-portfolio">
                Ver implementação e verificações
              </Link>
              <p className="hero__evidence-note">
                Fluxos E2E com Playwright e WCAG 2.1 A/AA com axe-core, executados como gates
                separados no CI.
              </p>
            </div>

            <div className="hero__actions">
              <Link className="button" href="/curriculo">
                Ver currículo
              </Link>
              <a
                className="button"
                href={perfil.linkLinkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar pelo LinkedIn
              </a>
            </div>
          </>
        }
        registro={
          <dl className="field-record">
            <div>
              <dt>Áreas de profundidade</dt>
              <dd>{areasProfundidade.join(" · ")}</dd>
            </div>
            <div>
              <dt>Competências comprovadas</dt>
              <dd>{competenciasDeclaradas.size}</dd>
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
        }
        estrutura={
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
                ausente, link inválido ou imagem inexistente interrompe a publicação.
              </dd>
            </div>
            <div>
              <dt>Competências com evidência</dt>
              <dd>
                As {competenciasDeclaradas.size} competências declaradas no perfil aparecem em
                trabalho implementado: {projetosComEvidencia.join(", ")}. Projetos apenas planejados
                não contam como evidência.
              </dd>
            </div>
          </dl>
        }
      />

      <div className="stations">
        <span className="traverse" aria-hidden="true" />

        <section className="station" aria-labelledby="levantado-title">
          <div className="station__head">
            <h2 id="levantado-title">Terreno levantado</h2>
            <p>
              Só entra aqui o que existe como software. Cada ficha leva ao estudo de caso e ao
              código-fonte, quando público.{" "}
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
                <ProjectCard key={projeto.slug} projeto={projeto} headingLevel={3} />
              ))}
            </div>
          )}

          <div className="ci-record">
            <h3 className="ci-record__title">Integração contínua desta plataforma</h3>
            <ol
              className="pipeline"
              role="list"
              aria-label="Etapas da integração contínua, em ordem"
            >
              {ETAPAS_INTEGRACAO_CONTINUA.map((etapa, ordem) => (
                <li key={etapa.rotulo} style={{ "--ordem": ordem } as CSSProperties}>
                  {etapa.rotulo}
                </li>
              ))}
            </ol>
            <p className="ci-record__note">
              Ordem configurada em <code>.github/workflows/ci.yml</code>. A animação é ilustrativa e
              não representa uma execução ao vivo.
            </p>
          </div>
        </section>

        <section className="station" aria-labelledby="competencies-title">
          <div className="station__head">
            <h2 id="competencies-title">Competências comprovadas nesta plataforma</h2>
            <p>
              Declaradas no perfil e conferidas no build contra as fichas implementadas: nenhuma
              entra sem trabalho que a sustente.
            </p>
          </div>

          <div className="competency-grid">
            {perfil.competenciasPorArea.map((area) => (
              <section className="competency-card" key={area.area}>
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

        {planejados.length > 0 ? (
          <section className="station" aria-labelledby="nao-levantado-title">
            <div className="station__head">
              <h2 id="nao-levantado-title">Terreno ainda não levantado</h2>
              <p>
                Escopo planejado de estudo. Nada aqui existe como código; por isso fica fora das
                fichas, sem marco nem imagem.
              </p>
            </div>

            <div className="unsurveyed">
              <p className="unsurveyed__count">
                <span className="cota">planejado · sem implementação</span>
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
      </div>
    </>
  );
}
