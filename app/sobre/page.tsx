import type { Metadata } from "next";
import Link from "next/link";
import { getPerfil } from "../../lib/content";

export function generateMetadata(): Metadata {
  const perfil = getPerfil();

  const descricao = `Conheça a trajetória, o método de trabalho e o posicionamento de ${perfil.tituloPosicionamento}.`;

  return {
    title: "Sobre",
    description: descricao,
    alternates: { canonical: "/sobre" },
    openGraph: {
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
        <p className="eyebrow">Trajetória e método</p>
        <h1>Sobre</h1>
        <p className="about-page__lead">{perfil.tituloPosicionamento}</p>
      </header>

      <section aria-labelledby="about-positioning">
        <h2 id="about-positioning">Da especificação ao deploy</h2>
        <p>{perfil.descricaoPosicionamento}</p>
        <p>{perfil.biografiaSobre}</p>
      </section>

      <section aria-labelledby="about-method">
        <h2 id="about-method">Como organizo meu trabalho</h2>
        <div className="about-principles">
          <article>
            <span>01</span>
            <h3>Backend como profundidade</h3>
            <p>Modelagem, regras de negócio e integridade orientam as decisões técnicas.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Engenharia como método</h3>
            <p>Especificação, testes e documentação tornam cada entrega verificável.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Cloud e DevOps como diferenciais</h3>
            <p>Automação e operação responsável conectam o código ao ambiente real.</p>
          </article>
        </div>
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
