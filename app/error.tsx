"use client";

import Link from "next/link";
import { useEffect } from "react";

export interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  // Sem isto o `digest` se perde e a falha em produção fica ininvestigável:
  // é o único identificador que liga esta tela ao log do servidor.
  useEffect(() => {
    console.error("Falha ao renderizar rota", { digest: error.digest, message: error.message });
  }, [error]);

  return (
    <section className="message-page" aria-labelledby="error-title">
      <div className="hero__index">
        <span>Falha temporária · Registro indisponível</span>
        {error.digest ? <span>Ref. {error.digest}</span> : null}
      </div>
      <h1 id="error-title">Não foi possível exibir esta página</h1>
      <p role="alert">
        Tente carregar o conteúdo novamente. Se o problema continuar, volte à página inicial e
        escolha outro caminho.
      </p>
      <div className="message-page__actions">
        <button className="button button--primary" type="button" onClick={retry}>
          Tentar novamente
        </button>
        <Link className="button button--secondary" href="/">
          Voltar para a página inicial
        </Link>
      </div>
    </section>
  );
}
