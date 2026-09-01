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
        <div className="hero__index">
          <span>Registro 004 · Perfil</span>
          <span>pt-BR</span>
        </div>
        <h1>Sobre</h1>
        <p className="about-page__lead">{perfil.tituloPosicionamento}</p>
      </header>

      <section aria-labelledby="about-positioning">
        <h2 id="about-positioning">Da especificação ao deploy</h2>
        <p>{perfil.biografiaSobre}</p>
      </section>

      <section aria-labelledby="about-method">
        <h2 id="about-method">Como organizo meu trabalho</h2>
        <div className="about-principles">
          {/*
            Os três blocos descrevem o método aplicado nesta plataforma — o que é
            verificável no repositório. Não declaram senioridade nem área de
            atuação consolidada: backend segue registrado como escopo planejado
            em /roadmap, e anunciá-lo aqui como profundidade contradiria a ficha.
          */}
          <article>
            <h3>Especificação antes do código</h3>
            <p>Requisito aprovado vira tarefa registrada antes de virar implementação.</p>
          </article>
          <article>
            <h3>Verificação como parte da entrega</h3>
            <p>Testes, checagem de acessibilidade e integração contínua rodam a cada mudança.</p>
          </article>
          <article>
            <h3>Evidência acima de afirmação</h3>
            <p>O que ainda é intenção fica separado do que já está implementado e publicado.</p>
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
