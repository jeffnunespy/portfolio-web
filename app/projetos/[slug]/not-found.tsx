import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <section className="message-page">
      <p className="eyebrow">Erro 404</p>
      <h1>Projeto não encontrado</h1>
      <p>Este projeto não existe ou não está mais disponível.</p>
      <Link className="button button--primary" href="/projetos">
        Ver todos os projetos
      </Link>
    </section>
  );
}
