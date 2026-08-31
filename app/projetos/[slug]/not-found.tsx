import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projeto não encontrado",
  description: "O projeto solicitado não está disponível no portfólio.",
  robots: { index: false, follow: true },
};

export default function ProjectNotFound() {
  return (
    <section className="message-page">
      <div className="hero__index">
        <span>HTTP 404 · Ficha inexistente</span>
      </div>
      <h1>Projeto não encontrado</h1>
      <p>Este projeto não existe ou não está mais disponível.</p>
      <Link className="button button--primary" href="/projetos">
        Ver todos os projetos
      </Link>
    </section>
  );
}
