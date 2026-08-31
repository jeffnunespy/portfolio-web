import type { Metadata } from "next";
import { getPerfil } from "../../lib/content";
import { emailConfigurado } from "../../lib/labels";

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

  return (
    <article className="resume-page">
      <header className="resume-page__header">
        <div>
          <div className="hero__index">
            <span>Registro 004 · Currículo</span>
          </div>
          <h1>Currículo</h1>
          <p className="resume-page__role">{perfil.tituloPosicionamento}</p>
        </div>
        <a className="button button--primary" href={perfil.linkCurriculo} download>
          Baixar currículo em PDF
        </a>
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
              <ul>
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
        <ul className="resume-contact">
          <li>
            {podeContatar ? (
              <a href={`mailto:${perfil.contato.valor}`}>{perfil.contato.valor}</a>
            ) : (
              <span className="muted-label">Contato em configuração</span>
            )}
          </li>
          <li>
            <a href={perfil.linkGithub}>GitHub</a>
          </li>
          <li>
            <a href={perfil.linkLinkedin}>LinkedIn</a>
          </li>
        </ul>
      </section>
    </article>
  );
}
