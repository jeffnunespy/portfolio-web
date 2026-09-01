import type { Metadata } from "next";
import { getPerfil } from "../../lib/content";
import { curriculoConfigurado, emailConfigurado } from "../../lib/labels";

export function generateMetadata(): Metadata {
  const perfil = getPerfil();

  const descricao = `Currículo, competências e perfis profissionais — ${perfil.tituloPosicionamento}.`;

  return {
    title: "Currículo",
    description: descricao,
    alternates: { canonical: "/curriculo" },
    openGraph: {
      title: "Currículo",
      description: descricao,
      url: "/curriculo",
    },
  };
}

export default function ResumePage() {
  const perfil = getPerfil();
  const podeContatar = emailConfigurado(perfil.contato.valor);
  const temPdf = curriculoConfigurado(perfil.linkCurriculo);

  return (
    <article className="resume-page">
      <header className="resume-page__header">
        <div>
          <div className="hero__index">
            <span>Registro 005 · Currículo</span>
          </div>
          <h1>Currículo</h1>
          <p className="resume-page__role">{perfil.tituloPosicionamento}</p>
        </div>
        {temPdf ? (
          <a className="button button--primary" href={perfil.linkCurriculo} download>
            Baixar currículo em PDF
          </a>
        ) : (
          /*
            Afirma o que esta página é, em vez de anunciar a falta de um
            arquivo. O currículo está inteiro abaixo: o PDF seria uma cópia,
            e uma cópia desatualizada é pior que nenhuma.
          */
          <p className="availability-note">
            Currículo completo nesta página. Versão em PDF em preparação.
          </p>
        )}
      </header>

      <section aria-labelledby="resume-summary">
        <h2 id="resume-summary">Resumo</h2>
        <p>{perfil.descricaoPosicionamento}</p>
        <p>{perfil.biografiaSobre}</p>
      </section>

      <section aria-labelledby="resume-skills">
        <h2 id="resume-skills">Competências técnicas</h2>
        <div className="resume-skills">
          {perfil.competenciasPorArea.map((area) => (
            <div key={area.area}>
              <h3>{area.area}</h3>
              <ul role="list">
                {area.competencias.map((competencia) => (
                  <li key={competencia}>{competencia}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="resume-links">
        <h2 id="resume-links">Contato e perfis</h2>
        {/*
          Os destinos que existem vêm primeiro; a ausência de e-mail fecha a
          lista em vez de abri-la. Liderar por "Contato em configuração" põe uma
          falta antes de dois perfis reais — mesma ordem corrigida em
          EvidenceLink: primeiro o que se pode abrir, depois a ressalva.
        */}
        <ul role="list" className="resume-contact">
          {podeContatar ? (
            <li>
              <a href={`mailto:${perfil.contato.valor}`}>{perfil.contato.valor}</a>
            </li>
          ) : null}
          <li>
            <a href={perfil.linkGithub}>GitHub</a>
          </li>
          <li>
            <a href={perfil.linkLinkedin}>LinkedIn</a>
          </li>
          {podeContatar ? null : (
            <li>
              <span className="muted-label">Contato por e-mail em configuração</span>
            </li>
          )}
        </ul>
      </section>
    </article>
  );
}
