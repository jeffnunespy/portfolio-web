"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Mantém URL e conteúdo coerentes no Voltar/Avançar depois de navegar por
 * fragmento (skip link, índice da ficha, `location.hash`, barra de endereço).
 *
 * A navegação nativa por fragmento cria uma entrada de histórico com
 * `history.state === null`, e o App Router ignora `popstate` com estado nulo
 * (vercel/next.js#75072, aberta; sem correção até 16.5.0-canary.36). Ao voltar
 * a essa entrada depois de trocar de rota, a URL mudava e a página não.
 *
 * O fragmento continua nativo — rolagem, foco, `:target` e `hashchange` ficam
 * com o navegador, e sem JavaScript nada muda. Este componente só reage ao
 * `popstate` com estado nulo (criação da entrada do fragmento ou volta a uma
 * entrada sem estado) e pede ao router a rota da URL atual, substituindo a
 * entrada. A árvore gravada é a que o router resolve para a URL, e uma
 * navegação em andamento é substituída por esta. Esse comportamento foi
 * verificado no Next.js 16.4.2; ao atualizar o Next.js (sobretudo se #75072 for
 * corrigida), rode `tests/e2e/historico-fragmentos.spec.ts` em todos os motores.
 *
 * Não use `history.replaceState` aqui: numa entrada sem árvore o App Router
 * reaproveita a árvore corrente, que pode ser de outra rota durante uma
 * transição, e grava essa associação errada como estado válido (F1-CODEX-01).
 * `scroll: false` deixa rolagem e foco como o navegador os deixou.
 */
export default function FragmentHistory() {
  const router = useRouter();

  useEffect(() => {
    function aoNavegarNoHistorico(evento: PopStateEvent) {
      if (evento.state !== null) return;
      router.replace(window.location.href, { scroll: false });
    }

    window.addEventListener("popstate", aoNavegarNoHistorico);
    return () => window.removeEventListener("popstate", aoNavegarNoHistorico);
  }, [router]);

  return null;
}
