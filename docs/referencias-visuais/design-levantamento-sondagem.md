---
name: Levantamento e sondagem
description: Levantamento de campo noturno — trabalho implementado é terreno medido; escopo planejado é terreno ainda não levantado.
colors:
  ground: "#0c0f0e"
  ground-2: "#121615"
  line-fine: "#232a27"
  line: "#34403a"
  line-index: "#5b6862"
  ink: "#e7e4da"
  ink-2: "#a9aea6"
  ink-3: "#7f877f"
  flag: "#e8703f"
  flag-ink: "#ff9a6b"
  focus: "#f2c46b"
typography:
  display:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, min(6.6vw, 10.5cqi), 5.75rem)"
    fontWeight: 200
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.75rem)"
    fontWeight: 200
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.6rem)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title-ficha:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.4rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title-roadmap:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title-estrutura:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 300
    letterSpacing: "-0.02em"
  title-chamada:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.1rem)"
    fontWeight: 300
    letterSpacing: "-0.02em"
  title-secao:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 300
    letterSpacing: "-0.015em"
  subtitle:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.65
  lead:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 300
    lineHeight: 1.65
  body:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 300
    lineHeight: 1.65
  body-small:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 300
    lineHeight: 1.65
  nav:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 300
  nav-compact:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 300
  note:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 300
    lineHeight: 1.65
  label:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label-compact:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0"
spacing:
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  content-width: "84rem"
  consulta: "19rem"
  consulta-gap: "clamp(2.5rem, 5.5vw, 5rem)"
  header-space: "5.5rem"
components:
  button-primary:
    textColor: "{colors.flag-ink}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0"
    height: "44px"
  button-secondary:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0"
    height: "44px"
  button-toggle:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1rem"
    height: "44px"
  button-toggle-open:
    backgroundColor: "{colors.flag}"
    textColor: "{colors.ground}"
  chip:
    textColor: "{colors.ink-2}"
    typography: "{typography.label-compact}"
    rounded: "{rounded.none}"
    padding: "0.3rem 0.55rem"
  status-badge:
    textColor: "{colors.ink}"
  status-badge-mark:
    backgroundColor: "{colors.flag}"
    size: "7px"
  status-badge-inactive:
    textColor: "{colors.ink-2}"
  nav-link:
    textColor: "{colors.ink-2}"
    height: "44px"
  nav-link-current:
    textColor: "{colors.ink}"
  nav-link-curriculo:
    textColor: "{colors.flag-ink}"
  project-card:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "2.5rem 0"
  project-image:
    backgroundColor: "{colors.ground-2}"
    rounded: "{rounded.none}"
  roadmap-entry:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2rem clamp(1.25rem, 3vw, 2.5rem) 2.2rem"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    padding: "0.75rem 1rem"
---

> **Registro histórico — substituído em 2026-10-23.** O proprietário aprovou
> **Minimalismo escuro** como novo visual oficial. O sistema normativo vigente
> está em [DESIGN.md](../../DESIGN.md), com a decisão registrada em
> [direcao-minimalista-escura.md](direcao-minimalista-escura.md).
> O conteúdo anterior foi preservado integralmente abaixo, incluindo alterações
> preexistentes do proprietário; apenas o link Markdown relativo ao candidato
> foi corrigido para esta pasta. Este registro descreve o visual de levantamento
> e sondagem que permanece nas rotas Next.js até uma migração posterior.
> As aprovações e verificações citadas abaixo pertencem àquele sistema e à sua
> implementação; não comprovam a migração para a direção nova.

<!-- impeccable:design-schema 2 -->

# Sistema visual: Levantamento e sondagem

Sistema visual do portfólio. Este documento descreve o que está construído em
`app/globals.css`, `app/layout.tsx`, `components/home/SurveyOpening.tsx` e nos
componentes de rota, não uma intenção futura. O frontmatter acima é normativo
para os valores; o texto explica onde e por que cada um se aplica. A direção foi
aprovada pelo proprietário em 2026-10-23, na versão **sem lente e com o
movimento das curvas**:
[candidato](candidato-levantamento-sondagem.md) e
protótipo `docs/referencias-visuais/prototipo-levantamento-sondagem.html`. As
divergências deliberadas em relação ao protótipo estão na emenda de direção
visual de `specs/001-experiencia-publica-inicial/plan.md`.

## Overview

**Creative North Star: "O Levantamento de Campo Noturno"**

O portfólio é um **levantamento de campo noturno**. Trabalho implementado é
terreno medido, marcado com um marco laranja; escopo planejado é terreno ainda
não levantado, tracejado e hachurado, sem marco. A forma serve ao princípio
constitucional — evidências acima de afirmações: o mapa mostra o que foi
medido e declara, na legenda, o que é ilustrativo.

A página é escura, rarefeita e plana. Marfim em pesos leves assenta sobre o
terreno; a notação em mono ocupa uma coluna de consulta fixa à direita; o
relevo vem de isolinhas e filetes, nunca de sombra. O laranja é raro de
propósito: aparece onde há evidência e em nenhum outro lugar.

**Anti-referências:** a vitrine de cartões com gradiente, sombra e cantos
arredondados da categoria “portfólio de dev”; e efeitos que alteram a página
sob o cursor (lente circular, raio-X, recorte de máscara). Nenhum elemento novo
deve reintroduzi-los.

**Key Characteristics:**

- Esquema único noturno: terreno quase preto, marfim e três tons de isolinha.
- Laranja de marco reservado a trabalho implementado e à ação que leva a ele.
- Geologica em pesos leves para leitura; Martian Mono só para notação.
- Dois eixos fixos: margem de leitura à esquerda, coluna de consulta à direita.
- Zero sombra, zero canto arredondado; relevo por isolinha e filete.
- Movimento de plotadora e paralaxe discreta, desligados sob movimento reduzido.

## Colors

Paleta noturna de terreno e marfim com uma única cor de evidência; esquema
único (`color-scheme: dark`), tokens em `:root` de `app/globals.css`.

### Primary

- **Laranja de marco** (`--flag`, #e8703f; 6,26:1 sobre o terreno): marco de
  trabalho implementado (`ProjectMark`, legenda, ícone), seleção de texto
  (`::selection`, terreno sobre laranja), traço da travessia, quadrado do selo de
  estado e fundo de “Ver comprovação” aberto.
- **Laranja de leitura** (`--flag-ink`, #ff9a6b; 9,25:1): texto laranja — a ação
  de evidência “Ver implementação e verificações”, títulos de decisão de uma
  ficha implementada e o destaque do currículo na navegação.

### Secondary

- **Âmbar de foco** (`--focus`, #f2c46b; 11,82:1): exclusivamente o anel de foco
  de teclado (2px sólido, afastado 4px). É distinto do laranja para que estado
  de interação nunca seja lido como evidência.

### Neutral

- **Terreno noturno** (`--ground`, #0c0f0e): fundo de toda a página e de
  `<html>`.
- **Prancheta de consulta** (`--ground-2`, #121615): fundo das fichas SVG, da
  moldura da imagem da ficha e do painel de estrutura.
- **Isolinha fina** (`--line-fine`, #232a27; decorativo): isolinhas finas,
  travessia, pauta discreta entre células.
- **Isolinha intermediária** (`--line`, #34403a; decorativo): isolinhas
  intermediárias, filetes de grade, contorno de chips e da imagem da ficha.
- **Isolinha mestra** (`--line-index`, #5b6862; 3,30:1): isolinhas mestras,
  filetes significantes, tracejado do roadmap, polegar da barra de rolagem.
- **Marfim de campo** (`--ink`, #e7e4da; 15,14:1): títulos e corpo principal.
- **Marfim apagado** (`--ink-2`, #a9aea6; 8,52:1): corpo secundário, segunda
  linha do título (“em formação”), navegação em repouso.
- **Notação de cota** (`--ink-3`, #7f877f; 5,20:1, ou 4,93:1 sobre a prancheta):
  notação mono — rótulos de campo, cotas, legenda.

### Named Rules

**A Regra do Laranja como Evidência.** `--flag`/`--flag-ink` só marcam trabalho
implementado e a ação que leva a ele (marco, “Ver implementação e
verificações”, selo de estado, travessia, destaque do currículo, títulos de
decisões de uma ficha implementada e “Ver comprovação” aberto, que expõe como a
plataforma é verificada). Escopo planejado nunca recebe laranja.

**A Regra do Filete Significante.** `--line-fine` e `--line` são pauta e
terreno: separam células que já se leem pelo texto, e o critério 1.4.11 os
isenta. Quando apagar o filete apaga o objeto — moldura tracejada do roadmap e de
“Terreno ainda não levantado”, sublinhado-trilho do `.button`, polegar da barra
de rolagem — o filete usa `--line-index` (≥3:1). Corpo pequeno nunca usa tom
abaixo de `--ink-3`.

Seleção (`::selection`), barra de rolagem (`scrollbar-color`) e foco são
tematizados.

### Cores forçadas

`@media (forced-colors: active)` troca os tokens por cores de sistema
(`Canvas`, `CanvasText`, `LinkText`, `Highlight`, `HighlightText`, `ButtonText`,
`ButtonFace`), oculta o terreno decorativo, aumenta o foco para 3px `Highlight`,
devolve sublinhado aos links e borda `ButtonText` ao `.button`.
`forced-color-adjust: none` fica restrito a elementos cuja inversão carrega
sentido (ação primária, “Ver comprovação” aberto, selos) e, nesses, usa só cores
de sistema.

## Typography

**Display Font:** Geologica variável (com “Segoe UI”, `system-ui`, sans-serif)
**Body Font:** Geologica variável (mesma pilha)
**Label/Mono Font:** Martian Mono 400 (com `ui-monospace`, “SFMono-Regular”,
Menlo, monospace)

**Character:** uma sans geométrica de traço fino, usada leve como grafite de
prancheta, contra uma mono larga de instrumento que só aparece para medir,
rotular e citar código.

As duas famílias são servidas pelo próprio site via `next/font/google`
(`app/layout.tsx`, variáveis `--font-sans` e `--font-mono`), subconjunto latino,
`display: swap`. `--display` e `--mono` encadeiam fallbacks da mesma classe. A
primeira visita baixa **dois** woff2 (~35 KB): a Geologica variável só no eixo
`wght` e a Martian Mono estática. A regressão de
`tests/e2e/loading-performance.spec.ts` fixa dois arquivos e teto de 100 KiB.

### Hierarchy

- **Display** (200, `clamp(2.25rem, min(6.6vw, 10.5cqi), 5.75rem)`, 0,96): só o
  título do hero. “em formação” desce para uma segunda linha em `--ink-2`; o
  `<h1>` continua com o texto completo de `perfil.tituloPosicionamento`.
- **Headline** (200, `clamp(2.5rem, 6vw, 4.75rem)`, 1): `h1` das rotas internas,
  do detalhe de projeto e das páginas de mensagem.
- **Title** (300, `clamp(2rem, 4.6vw, 3.6rem)`, 1,02): `h2` das estações da home.
- **Title de ficha** (400, `clamp(1.6rem, 3vw, 2.4rem)`, 1,1): nome do projeto
  na ficha.
- **Title de roadmap** (400, `clamp(1.4rem, 2.6vw, 1.9rem)`, 1,15): a mesma voz
  da ficha um degrau abaixo, no nome de cada entrada do roadmap.
- **Title de estrutura** (300, `clamp(1.5rem, 3vw, 2.25rem)`): `h2` do painel
  “Ver comprovação” da abertura.
- **Title de chamada** (300, `clamp(1.5rem, 3vw, 2.1rem)`): `h2` da chamada ao
  currículo no rodapé do registro de projeto.
- **Title de seção** (300, 1.5rem): `h2` das seções do estudo de caso e do
  currículo; também a sigla do índice de reserva das fichas.
- **Subtitle** (300, 1.25rem): abertura de “Sobre”, cargo no currículo; em 400
  no título do registro de CI e no nome do projeto vizinho do rodapé do
  registro.
- **Lead** (300, 1.125rem): descrição do hero e abertura das rotas, em
  `--ink-2`, com medida de 34–40rem.
- **Body** (300, 1.0625rem, 1,65): texto corrido; `strong` em 500.
- **Body pequeno** (300, 0.95rem): conteúdo secundário de leitura — registro de
  campo, notas de estrutura, listas de competências e de stack, evidência da
  ficha, notas de código privado, estado vazio, rodapé e registro das páginas
  de mensagem.
- **Nota** (300, 0.875rem): notas de proveniência sob uma ação (evidência do
  hero, nota do registro de CI).
- **Navegação** (300, 0.9rem; 0.85rem até 640px): links do cabeçalho.
- **Label** (Martian Mono 400, `--type-notation` 0.8125rem, algarismos
  tabulares): rótulos de campo, cotas, legenda, leitura de coordenadas, pipeline.
- **Label compacto** (Martian Mono 400, `--type-notation-compact` 0.75rem):
  chips e linha de direitos autorais do rodapé.

Títulos usam `text-wrap: balance`; parágrafos, `text-wrap: pretty`.

### Named Rules

**A Regra da Notação.** Mono só para notação, dados e código — nunca para corpo
ou títulos.

**A Regra da Cota Abaixo.** Nenhum eyebrow ou kicker acima de títulos; a cota
mono vem **abaixo** do `h1` e carrega dado real (contagem, slug, código HTTP).

## Layout

### Os dois eixos

**Eixo de leitura**: a margem esquerda do container (`--content-width`,
`--gutter`), onde começam cabeçalho, `h1`, corpo e rodapé em todas as rotas.

**Coluna de consulta**: `--consulta` à direita, separada por `--consulta-gap`. É
onde assentam os registros em notação — o registro de campo e a legenda do hero
(`.hero__record`), os campos do 404 (`.message-page__record`), a procedência do
índice visual da ficha (`.project-detail__visual-index-sources`) e o bloco de
contato do rodapé.

As composições de corpo + consulta usam `flex-wrap` (corpo `flex: 1 1 28rem`,
consulta `flex: 0 0 var(--consulta)` com `margin-left: auto`): quando não cabem
lado a lado, a consulta desce para baixo do corpo sem media query própria. Abaixo
de 900px os eixos colapsam em um só.

**A Regra da Coluna de Consulta.** A coluna tem uma largura só, para o mesmo
tipo de dado estar sempre no mesmo lugar; a regressão E2E confere x e largura
iguais entre essas rotas.

### Estações da home

Depois do hero, a home é uma sequência de estações com cabeçalho em duas colunas
(`.station__head`, `1fr 1.25fr`) e respiro vertical generoso
(`clamp(4.5rem, 12vh, 8rem)`):

1. **Terreno levantado** — fichas de projetos implementados em destaque
   (`ProjectCard`) e o registro de integração contínua.
2. **Competências comprovadas nesta plataforma** — `perfil.competenciasPorArea`
   em grade de 4/2/1 colunas, com a nota que mantém backend e cloud no roadmap.
3. **Terreno ainda não levantado** — só a contagem de escopo planejado e o link
   para `/roadmap`, em moldura tracejada e hachurada. A home não lista itens
   planejados (FR-004/FR-004b/SC-008).

### Escassez assumida

**A Regra da Escassez Assumida.** O acervo tem uma ficha implementada, e o
layout declara isso:

- Uma ficha única ocupa a grade inteira em vez de fingir duas colunas.
- Em `.project-detail__content`, o último campo ímpar ocupa a linha inteira e
  perde o filete vertical; a paridade é contada a partir de
  `.project-detail__wide`.
- Nenhum vazio é preenchido com placeholder, métrica ou ficha inventada.

### Responsivo

Breakpoints em 900px (eixos colapsam, grades de competência vão a 2 colunas,
campo do terreno reposicionado) e 640px (uma coluna, cabeçalho absoluto com
rótulos compactos, ações das fichas em largura integral, `--header-space`
maior). A suíte E2E verifica ausência de rolagem horizontal em 320, 768 e
1280px, título e descrição do hero acima de 720px de altura em 1280px, geometria
dos CTAs em 320px, proporção 5:3 das fichas, coluna de consulta alinhada entre
rotas e texto a 200% sem perda.

## Elevation & Depth

O sistema é plano: nenhuma superfície tem sombra. A profundidade vem de três
fontes — a hierarquia de isolinhas (fina, intermediária, mestra), a paralaxe das
três camadas do terreno no hero e o contraste tonal entre terreno e prancheta. O
único degradê é funcional: o cabeçalho fixo vai de `--ground` (55%) a
transparente para manter a navegação legível sobre o conteúdo que rola por
baixo. O botão “Ver comprovação” assenta sobre um véu do próprio terreno
(`rgba(12, 15, 14, 0.6)`) para não perder leitura sobre as curvas.

**A Regra do Relevo por Isolinha.** Zero `box-shadow`. Se um elemento precisa se
destacar, ganha filete, posição ou peso de texto — nunca sombra simulada.

## Shapes

- **Canto vivo em tudo.** Zero `border-radius`: botões, chips, fichas, imagens,
  molduras e o painel de estrutura são retângulos.
- **Marco**: triângulo de contorno (`M6 1 11 11H1Z` em 12×12, traço 1.3 em
  `--flag`, sem preenchimento). É a única figura do sistema e identifica trabalho
  implementado; a legenda usa a mesma forma.
- **Tracejado e hachura** significam escopo planejado: moldura
  `1px dashed var(--line-index)` com hachura diagonal a 135° em 7% de `--ink-3`.
- **Selo de estado**: quadrado de 7px; pausado e arquivado usam só contorno.
- **Isolinhas** usam `vector-effect: non-scaling-stroke`, para manter a espessura
  ao escalar.

**A Regra do Canto Vivo.** Nenhum canto arredondado, em nenhum componente novo.

## Components

### Buttons

Ação é texto com filete, não pílula: o traço de base do levantamento.

- **Shape:** sem caixa (`{rounded.none}`); um filete `--line-index` de 1px na
  base, desenhado por dois gradientes de 1px em `background` (não decoração).
  Altura mínima de 44px.
- **Seta:** desenhada por máscara SVG em `::after` — `→` para avançar, `↗` para
  `target="_blank"`, `↓` para `download`. `button.button` não leva seta.
- **Primary** (`.button--primary`): texto em `--flag-ink`. Uma por tela, e só
  quando leva a evidência.
- **Secondary** (`.button`): texto em `--ink`.
- **Hover / Focus:** o filete é preenchido em `currentColor` da esquerda para a
  direita (0,6 s em `--ease-out`) e a seta avança 0.3em no hover; no foco, além
  do preenchimento, o anel âmbar.
- **Alternância “Ver comprovação”** (`.survey__toggle`): o único botão com
  contorno — retângulo `--line-index` em mono sobre o véu do terreno; no hover a
  borda clareia para `--ink-2`; aberto (`aria-expanded="true"`), inverte para
  terreno sobre `--flag` (em cores forçadas, `HighlightText` sobre `Highlight`).

### Chips

- **Style:** retângulos mono compactos com contorno `--line` e texto `--ink-2`
  (`.chip-list`), só para stack de trabalho implementado.
- **State:** não interativos. Tecnologia pretendida no roadmap usa
  `.roadmap-stack`, nunca `.chip-list`.

### Selo de estado

Cada status de projeto mantém uma marca legível sem cor. Em repouso, quadrado de
7px em `--flag` antes do rótulo; pausado e arquivado passam o texto a `--ink-2`
e o quadrado a contorno `--ink-3`. Em cores forçadas, o quadrado é substituído
por glifos — `✓` concluído, `▶` em andamento, `‖` pausado, `▣` arquivado —
escritos como `content: "✓" / ""`, para ficarem visíveis e fora do nome
acessível. Pausado e arquivado também se distinguem por borda tracejada e
pontilhada. Toda `<ul>` com `list-style: none` leva `role="list"`.

### Fichas e roadmap: duas superfícies, nunca uma

**A Regra das Duas Superfícies.** O leitor nunca deve precisar do texto para
saber se vê entrega ou intenção.

- **Ficha** (`/projetos`, só software implementado, `real: true`): grade
  `1fr 1.25fr` com imagem à esquerda (5:3, fundo `--ground-2`, contorno `--line`),
  marco laranja antes do título (`ProjectMark`, decorativo), selo de estado,
  campos de problema e competências em caderneta mono (`9rem 1fr`, filetes
  `--line-fine`), chips de stack e ações. Fichas separadas por filete `--line`;
  a grade abre com filete `--line-index`.
- **Entrada de roadmap** (`/roadmap`, `.roadmap-entry`): moldura tracejada e
  hachurada, sem imagem, sem marco, sem selo, sem link de detalhe e sem
  competências.
- **Detalhe** (`/projetos/[slug]`): abre com o marco no `h1` (0.5em), a cota
  `Ficha · slug`, o índice visual 5:3 com a procedência na coluna de consulta e
  os campos do estudo de caso em duas colunas.

### Navigation

- **Cabeçalho** fixo, com degradê de `--ground` para transparente e
  `pointer-events: none` no fundo (só os links capturam clique). `--header-space`
  reserva a altura e alimenta `scroll-padding-top`. Assinatura em 500 à
  esquerda; links em 0.9rem `--ink-2`, alvo de 44px.
- **Estados:** a rota atual fica em `--ink` com sublinhado permanente; o hover
  clareia para `--ink` e desenha o sublinhado por `scaleX` a partir da esquerda;
  o link do currículo fica em `--flag-ink`.
- **Mobile (≤640px):** `position: absolute`, assinatura numa faixa própria e
  rótulos compactos “Plano” e “CV”.
- **Prefetch:** a navegação global mantém o prefetch do Next.js para destinos
  diferentes da rota atual; a rota aberta usa `prefetch={false}` e o rodapé não
  repete as antecipações do cabeçalho.
- **Skip link** `.skip-link` → `#main-content`: terreno sobre marfim, em 500; o
  `<main>` tem `tabIndex={-1}` e não exibe anel quando recebe foco programático.
- **Rodapé** em grade `1fr var(--consulta)`: navegação à esquerda, contato na
  coluna de consulta sob filete `--line-index`, direitos autorais em mono
  compacto `--ink-3`.

### Abertura da home (componente assinatura)

`SurveyOpening` (componente cliente) desenha o terreno atrás do hero.

- **Desenho**: `div.survey__drawing` com três `<svg>` empilhados — isolinhas
  finas (`--line-fine`, 1), intermediárias (`--line`, 1) e mestras
  (`--line-index`, 1.4) —, cada um com um único `<path>`. As coordenadas são
  geradas no navegador por função determinística, em fatias de ~8 ms para não
  bloquear a thread principal, e ficam em cache entre navegações. Nada disso vai
  ao HTML nem ao payload RSC; o desenho é `aria-hidden`. O texto do hero é
  servido estático e não espera o terreno.
- **Varredura inicial**: quando o desenho existe (`data-desenhado`), uma máscara
  linear anima a propriedade registrada `@property --scan` de 0% a 108% em 3,2 s,
  velocidade constante, como uma plotadora.
- **Paralaxe**: `pointermove` passivo, aceito só para `pointerType === "mouse"`
  com `(hover: hover) and (pointer: fine)`. Cada evento só guarda a posição; um
  único `requestAnimationFrame` lê as medidas e depois escreve `translate3d` em
  cada `<svg>` com profundidade distinta. `pointerleave` e mudanças de mídia
  restauram as camadas (transição de 1,4 s em `--ease-out`). `will-change` só
  existe onde a paralaxe acontece.
- **Leitura de coordenadas**: `.survey__readout` mostra
  `ilustrativo · E … N … cota …` sob o ponteiro, `aria-hidden` e oculta em
  dispositivos sem hover ou com ponteiro grosso. O rótulo “ilustrativo” é
  obrigatório: as coordenadas não medem nada.
- **Registro de campo** (`dl.field-record`): rótulo mono `--ink-3` à esquerda,
  valor tabular alinhado à direita, na coluna de consulta.
- **Legenda** (`ul.map-legend`, `role="list"`): marco = trabalho implementado;
  tracejado = escopo planejado; isolinhas = terreno ilustrativo.
- **Ver comprovação**: botão de divulgação com `aria-expanded` e
  `aria-controls="estrutura"`; o rótulo alterna entre “Ver comprovação” e “Ocultar
  comprovação”. Revela `section#estrutura` (“O que sustenta a superfície”), texto
  puro com contagens derivadas de `content/` por `lib/content.ts`. Ao abrir, o
  painel é trazido à vista (`scrollIntoView` `nearest`); Escape fecha e devolve o
  foco ao botão.

**A Regra da Única Resposta ao Ponteiro.** O único movimento ligado ao ponteiro é
o deslocamento das camadas do terreno; hover comum de link (sublinhado, seta) é
permitido.

### Travessia e pipeline

- **Travessia** (`.traverse`): fio vertical `--line-fine` à esquerda das
  estações; um traço `--flag` cresce com a rolagem (`animation-timeline:
scroll(root)`), sem JavaScript.
- **Pipeline de CI** (`.pipeline`): as etapas de `lib/ci.ts` — testadas contra a
  ordem real de `.github/workflows/ci.yml` em `tests/unit/ci.test.ts` — acendem em
  ordem por view timeline. A nota ao lado diz que a animação é ilustrativa, não
  execução ao vivo. Sem suporte a timelines, tudo aparece aceso.

**Movimento reduzido** (`prefers-reduced-motion: reduce`): sem máscara nem
varredura, sem paralaxe (o JavaScript não escreve `transform`), sem travessia
animada, sem transições de deslocamento em navegação e setas, rolagem
instantânea. Ficam as curvas estáticas e as mudanças de cor de hover e foco. Os
dois casos têm E2E em `tests/e2e/home.spec.ts`.

### Índices visuais de projeto

`public/images/projects/*.svg` (1200×720, proporção 5:3) são **índices visuais
desenhados**, não capturas de tela, e cada um declara isso no `<desc>`. Usam a
paleta fixa do site, sem media query de esquema: fundo `--ground-2`, cruzes de
grade `--line-fine`, isolinhas `--line` e mestras `--line-index` em anéis
irregulares gerados por semente do slug, notação `--ink-3`, título `--ink` e
subtítulo `--ink-2`. Só o projeto implementado leva o marco laranja no cume; os
de escopo planejado têm isolinhas tracejadas e nenhum marco. Os quatro planejados
existem porque a validação de build exige o arquivo, mas não são renderizados em
`/roadmap`.

Na página, o índice é decorativo (`alt=""`), porque o título ao lado já o
identifica. A regressão confere o pixel de fundo `[18, 22, 21]` nos esquemas
claro e escuro do sistema.

### Ícone e Open Graph

`app/icon.tsx`: marco laranja (`--flag`, contorno) sobre `--ground`.
`lib/og-image.tsx` renderiza 1200×630 na mesma paleta: marfim sobre terreno,
filetes `--line-index`/`--line`, descrição em `--ink-2`, linha de índice em
`--ink-3` e “Em formação” em `--flag-ink`. Usa as fontes padrão do runtime; o
cartão não carrega webfont.

### Páginas de mensagem

404 e erro (`.message-page`): título na voz Headline, cota mono
(`HTTP 404 · Registro inexistente`), ação de retorno e, no 404, o registro em
`dl` na coluna de consulta.

## Do's and Don'ts

### Do:

- **Do** reservar `--flag`/`--flag-ink` para trabalho implementado e para a ação
  que leva a ele, com uma única `.button--primary` por tela.
- **Do** usar `--line-index` sempre que apagar o filete apagar o objeto, e
  `--line-fine`/`--line` só como pauta.
- **Do** assentar registros em notação na coluna de consulta (`--consulta`),
  com rótulo mono `--ink-3` e valor tabular.
- **Do** rotular como “ilustrativo” qualquer coordenada, curva ou animação que
  não meça nada.
- **Do** manter alvo mínimo de 44px em ações e links de navegação, e o anel de
  foco âmbar de 2px afastado 4px.
- **Do** agrupar leituras de ponteiro em um único `requestAnimationFrame` e
  desligar varredura, paralaxe e travessia sob `prefers-reduced-motion`.
- **Do** dar a todo estado uma marca legível sem cor (glifo, borda tracejada ou
  pontilhada) e `role="list"` a toda lista sem marcador.

### Don't:

- **Don't** usar lente, raio-X, máscara sob o cursor ou efeito que mude o
  aspecto da página ao passar o mouse; hover comum de link (sublinhado, seta) é
  permitido.
- **Don't** pôr eyebrow ou kicker acima de títulos; a cota mono vem **abaixo**
  do `h1` e carrega dado real (contagem, slug, código HTTP).
- **Don't** usar gradiente decorativo, texto em gradiente, sombra ou canto
  arredondado.
- **Don't** usar borda lateral colorida como acento.
- **Don't** usar mono para corpo ou títulos — só para notação, dados e código.
- **Don't** aplicar laranja em escopo planejado.
- **Don't** inventar métrica, resultado ou evidência em conteúdo ou imagem; as
  coordenadas do terreno são rotuladas como ilustrativas.
- **Don't** renderizar projeto não implementado como ficha, nem deixar
  `/projetos/<slug>` resolver para escopo planejado.
- **Don't** usar `title` como portador de informação essencial.
