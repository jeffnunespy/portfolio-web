import type { Page } from "@playwright/test";

type JanelaObservada = Window & { historicoFragmentosPronto?: boolean };

// FragmentHistory é o único listener de popstate com captura na aplicação.
// Observar o registro evita confundir hidratação do Header com prontidão do
// gerenciador. Rever este contrato se a implementação de FragmentHistory mudar.
export async function observarHistoricoFragmentos(page: Page) {
  await page.addInitScript(() => {
    const janela = window as JanelaObservada;
    const inscritos = new Set<EventListenerOrEventListenerObject>();
    const adicionar = EventTarget.prototype.addEventListener;
    const remover = EventTarget.prototype.removeEventListener;
    janela.historicoFragmentosPronto = false;

    EventTarget.prototype.addEventListener = function (tipo, listener, opcoes) {
      adicionar.call(this, tipo, listener, opcoes);
      const captura = typeof opcoes === "boolean" ? opcoes : opcoes?.capture;
      if (this === window && tipo === "popstate" && captura && listener) {
        inscritos.add(listener);
        janela.historicoFragmentosPronto = true;
      }
    };
    EventTarget.prototype.removeEventListener = function (tipo, listener, opcoes) {
      remover.call(this, tipo, listener, opcoes);
      const captura = typeof opcoes === "boolean" ? opcoes : opcoes?.capture;
      if (this === window && tipo === "popstate" && captura && listener) {
        inscritos.delete(listener);
        janela.historicoFragmentosPronto = inscritos.size > 0;
      }
    };
  });
}

export async function esperarHistoricoFragmentos(page: Page) {
  await page.waitForFunction(() => (window as JanelaObservada).historicoFragmentosPronto === true);
}
