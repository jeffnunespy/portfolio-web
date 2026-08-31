import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página solicitada não está disponível no portfólio.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="message-page">
      <div className="hero__index">
        <span>HTTP 404 · Registro inexistente</span>
      </div>
      <h1>Página não encontrada</h1>
      <p>A página que você procura não existe ou foi removida.</p>
      <Link className="button button--primary" href="/">
        Voltar para a página inicial
      </Link>
    </section>
  );
}
