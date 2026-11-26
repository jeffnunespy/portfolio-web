import type { Metadata } from "next";
import Link from "next/link";
import { getPerfil } from "../../lib/content";

export function generateMetadata(): Metadata {
  const perfil = getPerfil();

  const descricao = `Conheça a biografia e o método de trabalho de ${perfil.nome}.`;

  return {
    title: "Sobre",
    description: descricao,
    alternates: { canonical: "/sobre" },
    openGraph: {
      type: "website",
      title: "Sobre",
      description: descricao,
      url: "/sobre",
    },
  };
}

export default function AboutPage() {
  const perfil = getPerfil();

  return (
    <article className="about-page">
      <header>
        <h1>Sobre</h1>
        <p className="about-page__lead">{perfil.tituloPosicionamento}</p>
      </header>

      <section aria-labelledby="about-positioning">
        <h2 id="about-positioning">Apresentação</h2>
        <p>{perfil.descricaoPosicionamento}</p>
      </section>

      <section aria-labelledby="about-method">
        <h2 id="about-method">Como organizo meu trabalho</h2>
        <p>{perfil.biografiaSobre}</p>
      </section>

      <div className="about-page__actions">
        <Link className="button button--primary" href="/projetos">
          Conhecer os projetos
        </Link>
        <Link className="button button--secondary" href="/curriculo">
          Consultar currículo
        </Link>
      </div>
    </article>
  );
}
