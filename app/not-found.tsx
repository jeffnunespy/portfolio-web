import Link from "next/link";
import type { Metadata } from "next";
import { getProjetosImplementados, getRoadmap } from "../lib/content";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página solicitada não está disponível no portfólio.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const implementados = getProjetosImplementados();
  const planejados = getRoadmap();

  return (
    <section className="message-page message-page--not-found">
      <div className="hero__index">
        <span>HTTP 404 · Registro inexistente</span>
      </div>
      <div className="message-page__layout">
        <div className="message-page__body">
          <h1>Página não encontrada</h1>
          <p>A página que você procura não existe ou foi removida.</p>
          <Link className="button button--primary" href="/">
            Voltar para a página inicial
          </Link>
        </div>
        <dl className="message-page__record">
          <div>
            <dt>Acervo publicado</dt>
            <dd>
              {implementados.length} {implementados.length === 1 ? "ficha" : "fichas"}
            </dd>
          </div>
          <div>
            <dt>Escopo planejado</dt>
            <dd>
              {planejados.length} {planejados.length === 1 ? "entrada" : "entradas"}
            </dd>
          </div>
          <div>
            <dt>Destino de retorno</dt>
            <dd>Página inicial</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
