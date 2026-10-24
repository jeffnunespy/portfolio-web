---
name: Minimalismo escuro
description: Autoria visível — nome, trabalho e escolhas técnicas apresentados com precisão e espaço.
colors:
  ground: "#0c0f0e"
  surface: "#121615"
  ink: "#e7e4da"
  muted: "#a9aea6"
  line: "#34403a"
  accent: "#ff9a6b"
  focus: "#f2c46b"
typography:
  display:
    fontFamily: "Geologica, Segoe UI, sans-serif"
    fontSize: "clamp(3.6rem, 7.6vw, 5.75rem)"
    fontWeight: 200
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geologica, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 2.5rem)"
    fontWeight: 200
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geologica, Segoe UI, sans-serif"
    fontSize: "clamp(1.5rem, 2.9vw, 2.375rem)"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  callout:
    fontFamily: "Geologica, Segoe UI, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.75rem)"
    fontWeight: 200
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Geologica, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.5
  body:
    fontFamily: "Geologica, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 300
    lineHeight: 1.7
  body-small:
    fontFamily: "Geologica, Segoe UI, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 300
    lineHeight: 1.7
  nav:
    fontFamily: "Geologica, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 300
    lineHeight: 1.7
  action:
    fontFamily: "Geologica, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Geologica, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 300
    lineHeight: 1.7
rounded:
  none: "0"
  point: "50%"
spacing:
  gutter: "clamp(1.25rem, 5vw, 5rem)"
  content-width: "88rem"
  column-gap: "3rem"
  section-space: "clamp(3rem, 6vw, 5.5rem)"
  project-space: "2.75rem"
  detail-padding: "clamp(1.25rem, 3vw, 2rem)"
components:
  name-signature:
    textColor: "{colors.ink}"
    typography: "{typography.display}"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.nav}"
  nav-resume:
    textColor: "{colors.accent}"
    typography: "{typography.nav}"
  text-link:
    textColor: "{colors.ink}"
    typography: "{typography.action}"
  text-link-accent:
    textColor: "{colors.accent}"
    typography: "{typography.action}"
  project-text:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2.75rem 0"
  project-details:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "{spacing.detail-padding}"
  build-diagram:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2rem"
---

<!-- impeccable:design-schema 2 -->

# Design System: Minimalismo escuro

## Overview

**Creative North Star: "Autoria visível"**

**Minimalismo escuro** é o visual oficial do portfólio, aprovado expressamente pelo
proprietário em 2026-10-23. A tese **Autoria visível** aproxima o nome, o trabalho e as
escolhas técnicas: Geologica leve, marfim sobre fundo escuro, ponto laranja recorrente e
linhas abertas deixam a evidência e seus limites conduzirem a leitura.

A direção já está implementada no [protótipo de referência](docs/referencias-visuais/prototipo-minimalista-escuro.html),
na versão final **sem prévia de Nana Silva**. Esta aprovação é documental: as rotas Next.js
ainda usam o visual anterior e sua migração será uma tarefa posterior. Não houve publicação
nem migração da aplicação nesta etapa. O frontmatter registra valores extraídos do HTML;
este texto e o sidecar descrevem sua aplicação e os compromissos que a migração deve preservar.

A [decisão oficial](docs/referencias-visuais/direcao-minimalista-escura.md) registra a autoridade
da direção. O [sistema anterior](docs/referencias-visuais/design-levantamento-sondagem.md) foi
preservado como histórico da implementação que continua em código. Composição exata da home,
ordem dos projetos e exemplos fictícios pertencem ao documento da referência e ao brief local
`.impeccable/surfaces/docs-referencias-visuais-prototipo-minimalista-escuro-html.md`,
não ao sistema global. Rotas, competências, estudos de caso completos e roadmap continuam
sob a especificação em `specs/` e a constituição do projeto.

O sidecar e os artefatos em `.impeccable/` são locais e seguem as exclusões existentes do Git.
As regras e os valores normativos necessários à migração estão neste documento versionado.

**Key Characteristics:**

- Tema escuro único, marfim legível e uma cor de acento usada com parcimônia.
- Geologica leve como voz única; informação de apoio em tamanho menor, sem mono obrigatória.
- Nome em duas linhas, “Nunes.” recuado e ponto laranja como assinatura reconhecível.
- Projetos em linhas abertas; superfícies tonais apenas para contexto e diagramas.
- Interação nativa, foco visível e somente transição de cor nos links.
- Evidência real, estágio declarado e nenhum preenchimento fictício nas rotas públicas.

## Colors

Paleta noturna de marfim e verdes quase neutros, com laranja de leitura e âmbar reservado
a foco. Os sete valores canônicos estão no frontmatter e correspondem às propriedades de
`:root` do HTML de referência; não se herdam as camadas de isolinha da direção anterior.

### Primary

- **Laranja de autoria** (`accent`): ponto do nome e da assinatura, marcadores de projeto real
  e de decisão, links destacados, hover dos links, ícones do fluxo e marcador nativo de
  `summary`. Seleção de texto inverte para fundo escuro sobre esse laranja.

### Secondary

- **Âmbar de foco** (`focus`): contorno de teclado distinto do acento editorial. Não indica
  status nem entrega.

### Neutral

- **Fundo noturno** (`ground`): página, contêiner e base da leitura.
- **Superfície de contexto** (`surface`): conteúdo expandido e diagrama semântico.
- **Marfim principal** (`ink`): nome, títulos, tecnologias, rótulo de projeto real e links.
- **Marfim de apoio** (`muted`): descrições, contexto, metadados, legendas e navegação em repouso.
- **Filete discreto** (`line`): separação entre conteúdos já identificados por texto e espaço.
  É decorativo; não serve como único limite de controle, indicador de estado ou portador de sentido.

### Named Rules

**The Ponto de Autoria Rule.** O laranja assina o nome e aproxima projetos reais e decisões documentadas. Não certifica publicação, maturidade ou resultado; o texto sempre declara o estágio.

WCAG 2.1 A/AA é requisito preservado. Texto usa os tons de leitura; estado e significado
precisam continuar legíveis sem cor. O filete discreto não substitui o anel de foco nem a
sinalização textual. Em cores forçadas, preservar as cores de sistema: o HTML usa `Highlight`
no foco e `CanvasText` nos pequenos pontos de projeto e decisão. A migração deve manter links,
marcadores e controles perceptíveis nesse modo, sem impor a paleta de marca.

## Typography

**Display Font:** Geologica (com “Segoe UI”, sans-serif).

**Body Font:** Geologica (mesma pilha).

**Label/Mono Font:** Geologica; não há família mono no protótipo aprovado.

**Character:** sans geométrica leve com títulos de traço fino e corpo arejado. A hierarquia
vem de escala, posição e respiro; pesos médios ficam nos links, na assinatura pequena e nas
frases que apresentam decisões.

### Hierarchy

- **Display:** nome pessoal, no papel `display`; duas linhas, “Nunes.” com recuo de 0.55em e
  ponto decorativo. O nome acessível continua completo, sem o ponto.
- **Headline:** títulos de seção, no papel `headline`; traço leve e linhas equilibradas.
- **Title:** nomes de projetos, no papel `title`; diferenciados do corpo pela escala.
- **Callout:** chamada de contato, no papel `callout`; a escala maior encerra a leitura sem
  impor essa composição às demais rotas.
- **Lead:** posicionamento, no papel `lead`; o estágio “em formação” permanece explícito.
- **Body:** leitura principal, no papel `body`; corpo menor de descrições usa `body-small`,
  com medida observada de 40ch nos projetos e 42ch no texto de apresentação.
- **Nav / Action:** navegação em 300 e links de ação em 400, nos papéis `nav` e `action`.
- **Label:** metadados, tecnologias, legenda e rodapé; texto comum, sem caixa-alta compulsória.

Os títulos usam `text-wrap: balance`. Até 760px, a navegação compacta usa 0.8125rem. As
variações locais de chamada e do primeiro viewport pertencem ao brief; não impõem a mesma
composição a todas as rotas.

**The Uma Voz Rule.** Geologica atende nome, títulos, corpo, navegação e metadados. Martian Mono não é uma voz obrigatória da direção nova.

O HTML independente carrega Geologica pelo Google Fonts e tem fallback. **Na produção, servir
a fonte localmente pelo mecanismo `next/font` já existente**; a URL externa do protótipo não
é requisito nem dependência da aplicação. Esta etapa não altera a configuração de fontes,
nem os testes de carregamento que ainda descrevem o sistema anterior.

## Layout

O contêiner observado limita a largura a `spacing.content-width`, centraliza a página e usa
`spacing.gutter` para as margens fluidas. Filetes e intervalos verticais estabelecem o ritmo,
sem enquadrar cada unidade. A grade recorrente é assimétrica (1.3fr / 1fr), com intervalo
`spacing.column-gap`; o projeto que acompanha um diagrama inverte a proporção. Isso é
vocabulário de composição, não uma grade obrigatória para todas as rotas.

Seções usam `spacing.section-space`; linhas de projetos, `spacing.project-space`, com ajustes
nas extremidades. Textos longos mantêm medidas de leitura, sem esticar parágrafos para ocupar
o contêiner. Cabeçalhos, metadados, grupos de links e rodapé quebram linha naturalmente.

Até 760px, as composições de duas colunas se empilham, o cabeçalho assume direção vertical e
a navegação distribui os links na largura disponível. O diagrama passa a uma coluna até
1050px, com etapas em ordem e conectores reposicionados. Preservar leitura, zoom, ordem de
foco e ausência de perda de conteúdo nas larguras estreitas. Esses limiares são os observados
no protótipo; adaptações de outras rotas devem responder ao conteúdo real sob a especificação.

O cabeçalho do protótipo participa do fluxo normal, sem posição fixa ou fundo em degradê.
O deslocamento para âncoras reserva 2rem no topo. A ordem exata de seções, a posição do
primeiro projeto e os exemplos fictícios ficam no brief da superfície.

## Elevation & Depth

O sistema é plano: não usa sombras, degradês nem relevo por terreno. A única mudança de
plano é tonal, em `surface`, para explicar um fluxo ou revelar contexto em `details`.
Filetes, tipografia e espaço distinguem unidades sem fabricar camadas decorativas.

**The Linha Aberta Rule.** Organizar trabalho por texto, filetes e espaço. Reservar a superfície tonal a contexto revelado e diagramas; não cercar cada projeto com um cartão decorativo.

Não há paralaxe, varredura, lente, curva de terreno ou efeito ligado ao ponteiro. A única
transição do protótipo é `color 160ms ease-out` em links; `prefers-reduced-motion: reduce`
a remove. Mudanças de layout e a abertura nativa de `details` permanecem imediatas.

## Shapes

Superfícies e áreas de conteúdo têm cantos retos, sem cápsulas. A exceção recorrente é o
ponto circular de autoria (`rounded.point`): aparece como pontuação tipográfica no nome e
na assinatura; como marca de 5px nos rótulos de projeto real e nos títulos de decisões.
O ponto de texto não deve receber dimensões artificiais de marcador.

Filetes de 1px separam linhas abertas; os exemplos fictícios do protótipo usam tracejado e
rótulo explícito, sem converter esse recurso local em regra para o roadmap. Ícones são SVG
lineares, sem preenchimento; setas de link usam traço `currentColor` de 1.5 e terminais retos.
Não são imagens raster nem fontes de ícones.

## Components

### Assinatura e nome

A assinatura pequena do cabeçalho é um link em Geologica 400, sem sublinhado e com alvo
mínimo de 44px. O nome em destaque usa o papel `display`, quebra em duas linhas e desloca
“Nunes.” em 0.55em. Ambos repetem o ponto laranja; `aria-hidden="true"` remove a pontuação
decorativa do nome acessível “Jefferson Nunes”. A assinatura reconhecível não obriga toda
rota a repetir o hero da home.

### Navigation

Navegação horizontal flexível, em `muted`; currículo e hover em `accent`, sem movimento ou
sublinhado animado. O HTML usa âncoras reais e mantém o currículo acessível por link.
Até 760px, cabeçalho e navegação se reorganizam sem menu novo. Estados de rota atual e
integração Next.js serão definidos na migração conforme as rotas e acessibilidade existentes;
o protótipo não implementa um estado de rota atual.

### Links de ação e foco

Ações são links de texto com SVG de seta quando pertinente, sublinhado legível e intervalo
de 0.75rem entre texto e ícone. A variante padrão usa `ink`; a destacada, `accent`. O hover
altera somente a cor. Navegação, ações e `summary` têm altura mínima de 44px. O foco visível
usa contorno sólido de 2px em `focus`, afastado 5px, e `Highlight` em cores forçadas.

O link de salto, oculto fora de foco, aparece como texto escuro sobre marfim e aponta para
o `main` com `tabindex="-1"`. Nome de link, alvo e ordem do documento devem permitir uso
completo por teclado. Nenhuma informação essencial depende de hover ou `title`.

### Projeto textual

O projeto é uma linha editorial aberta: título, rótulo “Projeto real”, natureza e estágio,
descrição, stack, evidência e limitações. Metadados e grupos de links quebram linha. A marca
laranja acompanha o rótulo textual; a cor sozinha não distingue trabalho entregue de intenção.

Na referência aprovada, **Nana Silva permanece textual**, em validação, com link real para
o site de validação e nota de repositório privado. Não há imagem, captura, legenda de captura
ou link de PNG. A exceção de apresentação está formalizada em **FR-006a** da especificação;
os demais projetos continuam sujeitos a FR-006. Isso não autoriza retirar os arquivos de imagem referenciados pelo schema
de conteúdo nem eliminar estudos de caso completos. A aprovação visual tampouco muda o
estado de lançamento do projeto ou as competências comprovadas.

### Detalhes de decisão

`details` e `summary` nativos revelam escolha e limite sem JavaScript. O marcador de
`summary` usa `accent`; texto em repouso usa `muted` e passa a `ink` no hover ou quando
aberto. O painel usa `surface` e `spacing.detail-padding`, com duas colunas que se empilham
até 760px. Títulos internos em 400 e pontos decorativos ajudam a leitura, sem substituir o
conteúdo. Preservar abertura e fechamento por teclado, foco e estado nativos.

A primeira pessoa descreve somente decisões sustentadas pelas fontes reais. Resumos em
`details` complementam a consulta; não substituem os campos de estudo de caso aprovados
na especificação.

### Diagrama semântico de publicação

`figure` com `figcaption`, superfície tonal e três etapas em **`ol role="list"`**: Conteúdo
(JSON versionado), Validação (campos e evidências) e Publicação (páginas estáticas). O papel
explícito preserva semântica de lista ao retirar os marcadores. Toda lista sem marcador
mantém `role="list"`.

Os ícones e conectores são SVG decorativos com `aria-hidden="true"`; o texto carrega o
significado. A legenda identifica um esquema simplificado do build. Não é monitor de CI
nem execução ao vivo. A composição horizontal passa a vertical até 1050px; nada anima as
etapas. O diagrama é HTML/SVG, sem raster publicado na referência atual.

## Do's and Don'ts

### Do:

- **Do** usar os tokens do frontmatter e a mesma Geologica leve em toda a hierarquia.
- **Do** preservar o nome acessível “Jefferson Nunes” e esconder o ponto decorativo da tecnologia assistiva.
- **Do** declarar estágio, limitações, procedência e caráter simplificado de cada evidência.
- **Do** manter alvos de pelo menos 44px, foco visível, operação por teclado e listas sem marcador com `role="list"`.
- **Do** preservar WCAG 2.1 A/AA, cores forçadas, movimento reduzido e legibilidade no empilhamento responsivo.
- **Do** servir Geologica localmente na produção com o mecanismo `next/font` existente.

### Don't:

- **Don't** reintroduzir terreno, curvas, paralaxe, varredura, lente ou movimento complexo.
- **Don't** usar sombra, gradiente decorativo, cápsulas ou cartões contornados para ornamentar projetos.
- **Don't** apresentar Nana Silva com captura, prévia de imagem ou link de PNG; preservar o estado de validação e o link real.
- **Don't** tratar o diagrama de build como execução ao vivo ou inventar verificação, métrica ou resultado.
- **Don't** promover Acervo, Intervalo, a ordem dos projetos ou a composição exata da home a regra global ou dado a migrar.
- **Don't** remover imagens exigidas pelo schema de conteúdo nem reduzir estudos de caso, competências, rotas ou roadmap por causa desta aprovação visual.
- **Don't** assumir que a aprovação documental já migrou ou publicou a aplicação, nem usar `title` como portador de informação essencial.
