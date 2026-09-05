import Link from "next/link";
import type { Metadata } from "next";
import { getProjetosImplementados, getRoadmap } from "../../../lib/content";

export const metadata: Metadata = {
  title: "Projeto não encontrado",
  description: "O projeto solicitado não está disponível no portfólio.",
  robots: { index: false, follow: true },
};

export default function ProjectNotFound() {
  const implementados = getProjetosImplementados();
  const planejados = getRoadmap();

  return (
    <section className="message-page message-page--not-found">
      <div className="hero__index">
        <span>HTTP 404 · Ficha inexistente</span>
      </div>
      <div className="message-page__layout">
        <div className="message-page__body">
          <h1>Projeto não encontrado</h1>
          <p>Não há uma ficha publicada para este endereço.</p>
          <Link className="button button--primary" href="/projetos">
            Ver todos os projetos
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
            <dd>Projetos</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
