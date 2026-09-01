<!-- impeccable:design-schema 2 -->

# DESIGN.md — A Ficha de Catálogo

Sistema visual do portfólio. Este documento descreve o mundo que está construído
em `app/globals.css` e `app/layout.tsx`, não uma intenção futura.

## Tese

O portfólio é um **fichário catalográfico**, não uma vitrine. Cada projeto é uma
ficha indexada que declara o que foi verificado e o que ainda não foi. A forma
serve ao princípio constitucional do projeto — evidências acima de afirmações:
uma ficha registra, não vende.

**Anti-referência declarada:** a grade de cartões roxos com gradiente, sombra
suave e cantos arredondados que o CSS anterior implementava e que a categoria
"portfólio de dev" sempre entrega. Nenhum elemento novo deve reintroduzir
gradiente decorativo, sombra ou raio de canto.

## Linhagem

Fichas de catálogo de arquivo e de biblioteca técnica. Papel-cartão, carimbo de
tinta, régua tipográfica, linha de índice. O relevo vem do papel e da hierarquia
de filetes — nunca de sombra simulada.

## Paleta

Tokens em `:root` (`app/globals.css`).

| Token           | Valor     | Papel                                                                            |
| --------------- | --------- | -------------------------------------------------------------------------------- |
| `--ink`         | `#1a1a17` | Tinta principal: títulos, filetes fortes, fundo dos botões primários             |
| `--ink-soft`    | `#4a4740` | Corpo de texto secundário; mínimo seguro sobre `--card-sunk`                     |
| `--ink-faint`   | `#6f6a5f` | Rótulos de campo e índices **sobre `--card` apenas**                             |
| `--card`        | `#f4f1e8` | Cartão: o fundo de toda a página                                                 |
| `--card-raised` | `#faf8f2` | Superfície elevada discreta                                                      |
| `--card-sunk`   | `#eae5d7` | Superfície rebaixada (notas, fundo de imagem)                                    |
| `--rule`        | `#c8c2b0` | Pauta decorativa: separa células de grade cujo conteúdo já é legível sozinho     |
| `--rule-edge`   | `#847d6a` | Contorno significante: o filete **é** o objeto (moldura, chip, nota, vazio)      |
| `--rule-strong` | `#1a1a17` | Filete de separação hierárquica                                                  |
| `--stamp`       | `#8a2c1e` | Carimbo cinábrio: voz única, aplicada com parcimônia                             |
| `--stamp-wash`  | `#f0e2dd` | Lavagem do carimbo                                                               |
| `--focus`       | `#1d4a4a` | Foco de teclado — distinto do carimbo, para não confundir estado com verificação |

**Regra de contraste verificada.** `--ink-faint` sobre `--card-sunk` alcança
apenas 4.27:1, abaixo do mínimo AA de 4.5:1 em corpo pequeno. Texto pequeno
sobre `--card-sunk` usa `--ink-soft` (ver `.private-code-note p` e
`.project-image--fallback`). Essa combinação já quebrou a suíte axe uma vez;
não a reintroduza.

**Filete decorativo vs. filete significante.** O sistema separa os dois porque a
WCAG os trata de forma diferente, e uni-los degrada um dos lados.

`--rule` é pauta: as hairlines que dividem as células de `.competency-grid`,
`.project-grid`, `.project-detail__content` e `.hero__record`. Cada célula já se
lê sozinha pelo texto; o filete só organiza a página. O critério 1.4.11 isenta
separadores puramente estéticos, então esses ficam claros e o papel continua
parecendo papel.

`--rule-edge` é contorno: os casos em que apagar o filete apaga o componente —
moldura de `.project-image`, borda de `.chip-list li`, `.empty-state`,
`.availability-note`/`.private-code-note`, `.project-detail__placeholder-notice`
e o polegar da barra de rolagem. Esses alcançam **≥3:1 sobre toda superfície em
que assentam, inclusive `--card-sunk`**, nos dois temas: 3.26:1 no claro e
3.74:1 no escuro no pior caso.

Não promova toda hairline a `--rule-edge`: elevar a pauta ao mesmo peso
aproximaria os filetes do valor de `--ink-faint` e as grades de quatro colunas
passariam a competir com o próprio texto. A distinção é funcional, não estética.
Os glifos `::before` (`·` em `.tag`, `—` em listas) permanecem em `--rule` — são
ornamento adjacente a texto que já carrega o sentido.

## Tipografia

Três fontes auto-hospedadas via `next/font/google` (`app/layout.tsx`), expostas
como variáveis CSS:

| Variável         | Fonte          | Uso                                                                                 |
| ---------------- | -------------- | ----------------------------------------------------------------------------------- |
| `--font-display` | Zilla Slab     | Títulos e nomes de ficha; a serifa com peso de catálogo impresso                    |
| `--font-body`    | Archivo        | Corpo de texto corrido                                                              |
| `--font-field`   | Archivo Narrow | Rótulos de campo, índices, botões, tags — sempre em caixa alta com `letter-spacing` |

Os fallbacks acompanham a classe tipográfica da fonte real (sans para Archivo,
serif para Zilla Slab), para o texto não trocar de classe durante o carregamento.

`.hero__name` usa `clamp(2.7rem, 11vw, 7rem)` com `hyphens: auto` — o piso e a
hifenização existem porque "Desenvolvedor" sozinho estoura a viewport de 320px
no corpo monumental.

## Forma

- **Zero `border-radius`. Zero `box-shadow`.** Em todo o sistema, sem exceção.
- Estrutura vem de filetes de 1px (`--rule`/`--rule-edge`) e 2px/3px (`--rule-strong`).
- O corpo carrega uma textura de fibra cruzada quase imperceptível (dois
  `repeating-linear-gradient` a 1.5% e 1.2% de opacidade) — é papel, não cor chapada.
- Botões são carimbos retangulares em Archivo Narrow, caixa alta.
- `::selection` é tematizada.

## Estado sem depender de cor

Cada status de projeto carrega uma **marca tipográfica legível sem cor alguma**,
via `::before` em `.project-status-badge--*`:

| Status       | Marca | Tratamento                      |
| ------------ | ----- | ------------------------------- |
| Concluído    | `✓`   | Tinta sólida invertida          |
| Em andamento | `▶`   | Carimbo cinábrio                |
| Pausado      | `‖`   | Borda tracejada                 |
| Arquivado    | `▣`   | Borda pontilhada, tinta apagada |

Arquivado usou `line-through` numa versão anterior; foi removido porque riscava
o rótulo inteiro e prejudicava a leitura. O glifo e a borda bastam.

Os glifos são escritos como `content: "✓" / ""` — o alternativo vazio mantém a
marca visível e a mantém fora do nome acessível, para o leitor de tela anunciar
"Concluído" e não "✓ Concluído". Vale para todo glifo decorativo do sistema:
badge de estado, marca de estrutura de conteúdo, ponto de `.tag` e travessão das
listas de campo. Um glifo novo entra pela mesma forma.

Pelo mesmo motivo, toda `<ul>` que recebe `list-style: none` carrega `role="list"`
no JSX: o Safari com VoiceOver descarta a semântica de lista quando o marcador
some, e o papel explícito a devolve sem alterar um pixel.

## Alto contraste e cores forçadas

`@media (forced-colors: active)` troca os tokens autorais pelas cores semânticas
do sistema (`Canvas`, `CanvasText`, `LinkText` e `Highlight`). A textura do cartão
é removida, o foco cresce para 3px e links textuais recuperam sublinhado. A aba
atual mantém filete e sublinhado; os quatro status mantêm glifos e estilos de
borda distintos.

`forced-color-adjust: none` é restrito aos elementos cuja inversão ou traço
carrega significado — botão primário, destaque de currículo, carimbo e badges —
e esses elementos usam somente cores de sistema nesse modo. Nunca aplique essa
exceção a uma árvore inteira nem restaure nela cores hexadecimais da paleta.

## Índices visuais de projeto

`public/images/projects/*.svg` são **índices visuais desenhados**, não capturas
de tela. Somente o índice de `plataforma-portfolio` é publicado como imagem de
uma ficha, porque esse registro representa software implementado. Os quatro SVGs
de escopo planejado permanecem como assets catalográficos, mas não são renderizados
em `/roadmap` nem transformam intenção em ficha ou evidência. Simular telas de
aplicações inexistentes seria evidência inventada — proibido pelo princípio X da
constituição. Cada SVG declara sua natureza no próprio `<desc>`.

Constroem-se em tinta sobre cartão, na mesma grade de campo do site, sem
gradiente e sem raio.

A moldura preserva a proporção nativa **5:3 (1200×720)** no card e no detalhe,
sem recorte por `object-fit`. Cada SVG traz uma folha de estilo interna para
`prefers-color-scheme: dark`: cartão `#242019`, tinta `#efe9db`, tinta secundária
`#b9b1a0` e pauta `#41392c`. Como o SVG é carregado como imagem externa, essa
adaptação precisa viver no próprio arquivo; os tokens CSS da página não atravessam
a fronteira do recurso.

Quando publicado, o índice é **decorativo na árvore de acessibilidade**:
`ProjectImage` usa `alt=""`, porque a ficha ao lado já dá a identificação que a imagem repetiria.
Se alguma passar a carregar dado próprio — uma captura real, um diagrama — o
alternativo precisa descrever esse dado, não o título.

## Cartões Open Graph

`lib/og-image.tsx` renderiza o mesmo mundo em 1200×630: cartão `#f4f1e8`,
moldura de tinta de 3px, linha de índice no topo entre filetes, carimbo
"Em formação" no rodapé. Recebe `indice` (não `eyebrow`).

## Bans locais

- Nenhum `eyebrow` — nem como classe, nem como campo de dados. Foi removido de
  todas as rotas e do helper de OG; a linha de índice (`.hero__index`) o
  substitui e carrega dado real (registro, contagem, slug, código HTTP).
- Nenhuma numeração decorativa (`01`/`02`/`03`) que não seja um índice real.
- Nenhum gradiente, sombra ou canto arredondado.
- Nenhuma métrica, resultado ou evidência inventada em conteúdo ou imagem.
- Nenhum projeto não implementado renderizado como ficha, nem `/projetos/<slug>`
  resolvendo para escopo planejado.
- Nenhum `title` como portador de informação essencial: não é anunciado de forma
  confiável por leitor de tela nem alcançável por teclado ou toque.

## Fichas e roadmap: duas superfícies, nunca uma

A distinção é constitucional, não estética. `/projetos` só abriga software
implementado (`real: true`): tem imagem, selo de status, competências e link de
detalhe. Escopo planejado vive em `/roadmap` e usa vocabulário próprio —
`.roadmap-entry`, moldura `1px dashed var(--rule-edge)` sobre `--card-sunk`,
lista numerada (`<ol>`), sem imagem, sem selo, sem link de detalhe e sem
competências. Uma entrada de roadmap declara intenção; uma ficha declara
entrega, e o leitor nunca deve precisar do texto para saber qual está vendo.

`.roadmap-entry` deliberadamente não reusa `.project-card` nem `.project-grid`:
reutilizar a moldura da ficha faria plano parecer trabalho. A moldura tracejada
é o vocabulário já estabelecido do sistema para registro incompleto (ver
`.private-code-note`).

Sobre `--card-sunk`, `--ink-faint` fica em 4.27:1 e reprova em AA; por isso
`.roadmap-entry__index .muted-label` sobe para `--ink-soft`. Vale para qualquer
corpo pequeno que assente sobre o cartão rebaixado.

Ordem dos registros: 001 Início · 002 Fichas · 003 Escopo planejado ·
004 Perfil · 005 Currículo.

## Responsivo

Breakpoints em 900px, 820px e 640px. Em 640px a grade colapsa para uma coluna,
os filetes verticais somem, os botões do hero empilham na mesma medida e as
ações do card ocupam a largura inteira para evitar CTAs estreitos e quebrados.
A suíte E2E verifica ausência de rolagem horizontal em 320px, 768px e 1280px,
a geometria dos CTAs em 320px, a proporção 5:3 das fichas e zoom de texto a
200% sem perda de conteúdo.
