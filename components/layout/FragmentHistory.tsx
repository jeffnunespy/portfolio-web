"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

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
 * com o navegador, e sem JavaScript nada muda. Nas rotas válidas, reage ao
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
 *
 * A1: a 404 genérica responde RSC 404 e o Next tenta uma navegação de documento
 * com `location.replace`. Com a URL atual contendo hash, o navegador mantém
 * o documento e o router fica suspenso. Só nesse retorno a uma 404 conhecida
 * exigimos uma recarga real, inclusive quando a entrada tem estado não nulo.
 */
export default function FragmentHistory() {
  const router = useRouter();
  const pathname = usePathname();
  const rotas404 = useRef(new Set<string>());
  const rotaConfirmada = useRef<{ pathname: string; generica404: boolean } | null>(null);

  // Só classifica após o commit, não pela URL/árvore de uma transição pendente.
  // O marcador pertence à 404 genérica; a 404 de projeto não participa de A1.
  useLayoutEffect(() => {
    if (pathname === null) return;
    const generica404 = !!document.querySelector("main#main-content > [data-generic-not-found]");
    rotaConfirmada.current = { pathname, generica404 };
    if (generica404) rotas404.current.add(pathname);
    else rotas404.current.delete(pathname);
  }, [pathname]);

  useEffect(() => {
    function aoNavegarNoHistorico(evento: PopStateEvent) {
      const { pathname: destino, hash } = window.location;
      const atual = rotaConfirmada.current;
      if (
        hash &&
        rotas404.current.has(destino) &&
        !(atual?.pathname === destino && atual.generica404)
      ) {
        // Precede o listener do Next: ele não deve iniciar o fallback MPA que
        // suspende o conteúdo enquanto esta recarga já está em andamento.
        evento.stopImmediatePropagation();
        // reload não cria entrada nem emite popstate: uma recuperação por
        // evento, sem um bloqueio persistente que sobreviva a uma carga abortada.
        window.location.reload();
        return;
      }
      // Na própria 404, mantém a F1: ela também cancela uma navegação pendente
      // se o visitante voltar entre fragmentos antes do commit de outra rota.
      if (evento.state !== null) return;
      router.replace(window.location.href, { scroll: false });
    }

    window.addEventListener("popstate", aoNavegarNoHistorico, true);
    return () => window.removeEventListener("popstate", aoNavegarNoHistorico, true);
  }, [router]);

  return null;
}
