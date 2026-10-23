"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
  Terreno ilustrativo da abertura: soma de elevações gaussianas com ondulação,
  amostrada numa grade e convertida em isolinhas por marching squares. Os
  valores não representam dado algum — a legenda declara as curvas e as
  coordenadas como ilustrativas.

  O desenho é gerado no navegador, e não no servidor, porque as ~11 mil
  coordenadas somam centenas de KB que iriam para o HTML e para o payload RSC
  sem valor para leitor de tela ou indexação.
*/
const LARGURA = 1000;
const ALTURA = 700;
const COLUNAS = 170;
const LINHAS = 120;
const NIVEIS = 36;

// [centro x, centro y, raio, amplitude], em coordenadas normalizadas.
const ELEVACOES = [
  [0.7, 0.4, 0.2, 1],
  [0.36, 0.7, 0.16, 0.55],
  [0.92, 0.82, 0.13, 0.42],
  [0.18, 0.22, 0.12, 0.3],
  [0.55, 0.12, 0.1, 0.28],
] as const;

/*
  Cada camada é um <svg> próprio com um único <path>: o navegador compõe o
  elemento inteiro e a paralaxe só translada essa camada pronta, sem repintar
  milhares de segmentos a cada quadro. `deslocamento` é o máximo, em px — a
  camada mais marcada se move mais.
*/
const CAMADAS = [
  { nome: "fina", classe: "survey__layer--fine", deslocamento: [8, 6] },
  { nome: "media", classe: "survey__layer--mid", deslocamento: [18, 12] },
  { nome: "mestra", classe: "survey__layer--index", deslocamento: [30, 20] },
] as const;

type Camada = (typeof CAMADAS)[number]["nome"];
type Camadas = Record<Camada, string>;

function cota(x: number, y: number): number {
  let valor = 0;
  for (const [cx, cy, raio, amplitude] of ELEVACOES) {
    const dx = x - cx;
    const dy = (y - cy) * 1.15;
    valor += amplitude * Math.exp(-(dx * dx + dy * dy) / (2 * raio * raio));
  }
  return valor + 0.05 * Math.sin(x * 9.1 + y * 3.7) + 0.035 * Math.sin(y * 13.3 - x * 5.2);
}

function amostrarGrade(): Float32Array {
  const grade = new Float32Array((COLUNAS + 1) * (LINHAS + 1));
  for (let j = 0; j <= LINHAS; j++) {
    for (let i = 0; i <= COLUNAS; i++) {
      grade[j * (COLUNAS + 1) + i] = cota(i / COLUNAS, j / LINHAS);
    }
  }
  return grade;
}

const interpolar = (a: number, b: number, t: number) => a + (b - a) * t;

function isolinha(grade: Float32Array, nivel: number): string {
  const trechos: string[] = [];
  const pontos: [number, number][] = [];

  for (let j = 0; j < LINHAS; j++) {
    for (let i = 0; i < COLUNAS; i++) {
      const a = grade[j * (COLUNAS + 1) + i];
      const b = grade[j * (COLUNAS + 1) + i + 1];
      const c = grade[(j + 1) * (COLUNAS + 1) + i + 1];
      const d = grade[(j + 1) * (COLUNAS + 1) + i];
      const x0 = (i / COLUNAS) * LARGURA;
      const x1 = ((i + 1) / COLUNAS) * LARGURA;
      const y0 = (j / LINHAS) * ALTURA;
      const y1 = ((j + 1) / LINHAS) * ALTURA;

      pontos.length = 0;
      if (a < nivel !== b < nivel) pontos.push([interpolar(x0, x1, (nivel - a) / (b - a)), y0]);
      if (b < nivel !== c < nivel) pontos.push([x1, interpolar(y0, y1, (nivel - b) / (c - b))]);
      if (d < nivel !== c < nivel) pontos.push([interpolar(x0, x1, (nivel - d) / (c - d)), y1]);
      if (a < nivel !== d < nivel) pontos.push([x0, interpolar(y0, y1, (nivel - a) / (d - a))]);

      for (let k = 0; k + 1 < pontos.length; k += 2) {
        const [xa, ya] = pontos[k];
        const [xb, yb] = pontos[k + 1];
        trechos.push(`M${xa.toFixed(1)} ${ya.toFixed(1)}L${xb.toFixed(1)} ${yb.toFixed(1)}`);
      }
    }
  }

  return trechos.join("");
}

// Uma geração por carregamento da aplicação: voltar à home reaproveita o desenho.
let terrenoEmCache: Camadas | null = null;

/**
 * Gera as isolinhas em fatias de ~8 ms, cedendo a thread principal entre elas,
 * para o desenho não virar uma tarefa longa em aparelhos modestos.
 */
function gerarTerreno(aoConcluir: (camadas: Camadas) => void): () => void {
  if (terrenoEmCache) {
    aoConcluir(terrenoEmCache);
    return () => {};
  }

  let grade: Float32Array | null = null;
  const niveis: Record<Camada, string[]> = { fina: [], media: [], mestra: [] };
  let n = 1;
  let tarefa = 0;

  const passo = () => {
    const limite = performance.now() + 8;
    grade ??= amostrarGrade();

    while (n <= NIVEIS && performance.now() < limite) {
      // Uma isolinha mestra a cada cinco, intermediárias nas pares.
      const camada: Camada = n % 5 === 0 ? "mestra" : n % 2 === 0 ? "media" : "fina";
      niveis[camada].push(isolinha(grade, -0.06 + n * 0.032));
      n += 1;
    }

    if (n <= NIVEIS) {
      tarefa = window.setTimeout(passo, 0);
      return;
    }

    terrenoEmCache = {
      fina: niveis.fina.join(""),
      media: niveis.media.join(""),
      mestra: niveis.mestra.join(""),
    };
    aoConcluir(terrenoEmCache);
  };

  tarefa = window.setTimeout(passo, 0);
  return () => window.clearTimeout(tarefa);
}

export interface SurveyOpeningProps {
  tituloId: string;
  /** Posicionamento, descrição e ações da abertura. */
  corpo: ReactNode;
  /** Campos de registro exibidos na coluna de consulta. */
  registro: ReactNode;
  /** Conteúdo do painel “O que sustenta a superfície”. */
  estrutura: ReactNode;
}

/**
 * Abertura da home: levantamento topográfico noturno com legenda honesta e o
 * painel textual da estrutura. As curvas são decorativas (`aria-hidden`); o
 * movimento acompanha apenas mouse com ponteiro fino e respeita
 * `prefers-reduced-motion`. Não há lente nem efeito que altere a página sob o
 * cursor: só as camadas do terreno se deslocam.
 */
export default function SurveyOpening({
  tituloId,
  corpo,
  registro,
  estrutura,
}: SurveyOpeningProps) {
  const [aberto, setAberto] = useState(false);
  const secaoRef = useRef<HTMLElement>(null);
  const campoRef = useRef<HTMLDivElement>(null);
  const desenhoRef = useRef<HTMLDivElement>(null);
  const camadasRef = useRef<(SVGSVGElement | null)[]>([]);
  const tracosRef = useRef<(SVGPathElement | null)[]>([]);
  const leituraRef = useRef<HTMLParagraphElement>(null);
  const painelRef = useRef<HTMLElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () =>
      gerarTerreno((terreno) => {
        CAMADAS.forEach(({ nome }, indice) => {
          tracosRef.current[indice]?.setAttribute("d", terreno[nome]);
        });
        // A varredura começa só quando há o que varrer.
        desenhoRef.current?.setAttribute("data-desenhado", "");
      }),
    [],
  );

  useEffect(() => {
    const secao = secaoRef.current;
    const campo = campoRef.current;
    const leitura = leituraRef.current;
    if (!secao || !campo || !leitura) return;

    const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ponteiroFino = window.matchMedia("(hover: hover) and (pointer: fine)");
    const camadas = CAMADAS.map(
      ({ deslocamento }, indice) => [camadasRef.current[indice], ...deslocamento] as const,
    );
    const leituraInicial = leitura.textContent;
    let ponteiro: { x: number; y: number } | null = null;
    let quadro = 0;

    const atualizar = () => {
      quadro = 0;
      if (!ponteiro) return;

      // Todas as medidas são lidas antes de qualquer escrita de estilo.
      const area = campo.getBoundingClientRect();
      const { x, y } = ponteiro;
      const px = (x / window.innerWidth - 0.5) * 2;
      const py = (y / window.innerHeight - 0.5) * 2;
      const u = (x - area.left) / area.width;
      const v = (y - area.top) / area.height;

      if (!movimentoReduzido.matches) {
        for (const [camada, dx, dy] of camadas) {
          camada?.style.setProperty("transform", `translate3d(${-px * dx}px, ${-py * dy}px, 0)`);
        }
      }

      if (u >= 0 && u <= 1 && v >= 0 && v <= 1) {
        const valor = `ilustrativo · E ${u.toFixed(3)}  N ${(1 - v).toFixed(3)}  cota ${Math.round(Math.max(0, cota(u, v)) * 400)}`;
        if (leitura.textContent !== valor) leitura.textContent = valor;
      }
    };

    const mover = (evento: PointerEvent) => {
      if (evento.pointerType !== "mouse" || !ponteiroFino.matches) return;
      ponteiro = { x: evento.clientX, y: evento.clientY };
      if (!quadro) quadro = window.requestAnimationFrame(atualizar);
    };

    const restaurar = () => {
      if (quadro) window.cancelAnimationFrame(quadro);
      quadro = 0;
      ponteiro = null;
      for (const [camada] of camadas) camada?.style.removeProperty("transform");
      leitura.textContent = leituraInicial;
    };

    secao.addEventListener("pointermove", mover, { passive: true });
    secao.addEventListener("pointerleave", restaurar);
    movimentoReduzido.addEventListener("change", restaurar);
    ponteiroFino.addEventListener("change", restaurar);

    return () => {
      restaurar();
      secao.removeEventListener("pointermove", mover);
      secao.removeEventListener("pointerleave", restaurar);
      movimentoReduzido.removeEventListener("change", restaurar);
      ponteiroFino.removeEventListener("change", restaurar);
    };
  }, []);

  useEffect(() => {
    if (!aberto) return;

    const painel = painelRef.current;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // O painel abre abaixo da abertura, muitas vezes fora da tela: sem trazê-lo
    // à vista, o clique pareceria não ter efeito.
    painel?.scrollIntoView({ block: "nearest", behavior: reduzido ? "auto" : "smooth" });

    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key !== "Escape") return;
      const ativo = document.activeElement;
      const focoNaEstrutura =
        ativo === document.body ||
        Boolean(ativo && (secaoRef.current?.contains(ativo) || painel?.contains(ativo)));
      if (!focoNaEstrutura) return;

      setAberto(false);
      botaoRef.current?.focus();
    };

    document.addEventListener("keydown", fecharComEscape);
    return () => document.removeEventListener("keydown", fecharComEscape);
  }, [aberto]);

  return (
    <>
      <section ref={secaoRef} className="survey" aria-labelledby={tituloId}>
        <div ref={campoRef} className="survey__field" aria-hidden="true">
          <div ref={desenhoRef} className="survey__drawing">
            {CAMADAS.map(({ nome, classe }, indice) => (
              <svg
                key={nome}
                ref={(elemento) => {
                  camadasRef.current[indice] = elemento;
                }}
                className={`survey__layer ${classe}`}
                viewBox={`0 0 ${LARGURA} ${ALTURA}`}
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
              >
                <path
                  ref={(elemento) => {
                    tracosRef.current[indice] = elemento;
                  }}
                />
              </svg>
            ))}
          </div>
        </div>

        <div className="hero">
          <div className="hero__body">{corpo}</div>

          <div className="hero__record">
            {registro}

            {/* role="list" preserva a semântica que o Safari/VoiceOver descarta quando list-style é none. */}
            <ul className="map-legend" role="list" aria-label="Legenda do mapa">
              <li>
                <svg viewBox="0 0 30 12" aria-hidden="true" focusable="false">
                  <path className="map-legend__mark" d="M15 1 20 11H10Z" />
                </svg>
                Marco: trabalho implementado
              </li>
              <li>
                <svg viewBox="0 0 30 12" aria-hidden="true" focusable="false">
                  <path className="map-legend__dashed" d="M1 6h28" />
                </svg>
                Tracejado: escopo planejado
              </li>
              <li>
                <svg viewBox="0 0 30 12" aria-hidden="true" focusable="false">
                  <path className="map-legend__contour" d="M1 8c8-6 18 2 28-4" />
                </svg>
                Isolinhas: terreno ilustrativo
              </li>
            </ul>

            <div className="survey__probe">
              <p ref={leituraRef} className="survey__readout" aria-hidden="true">
                Mova o ponteiro para explorar
              </p>
              <button
                ref={botaoRef}
                type="button"
                className="survey__toggle"
                aria-expanded={aberto}
                aria-controls="estrutura"
                onClick={() => setAberto((valor) => !valor)}
              >
                {aberto ? "Ocultar estrutura" : "Ver estrutura"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={painelRef}
        id="estrutura"
        className="structure-notes"
        aria-labelledby="estrutura-titulo"
        hidden={!aberto}
      >
        <div className="structure-notes__inner">
          <h2 id="estrutura-titulo">O que sustenta a superfície</h2>
          {estrutura}
        </div>
      </section>
    </>
  );
}
