# Protótipo aprovado — Levantamento e sondagem

**Aprovado pelo proprietário em 2026-10-23**, na versão sem lente e com o
movimento das curvas preservado. Registro da decisão e referência para o
redesign: [direção aprovada](candidato-levantamento-sondagem.md).

## Escopo autorizado

Pedido de 2026-10-23: disponibilizar um site simples para experimentar no
navegador a direção visual discutida. O exemplo reutiliza
`prototipo-levantamento-sondagem.html`, separado das rotas Next.js. A aprovação
registra a direção e a composição deste protótipo como referência para o
redesign. A implementação nas rotas do portfólio e a publicação são etapas
posteriores.

Modo da superfície: **Experience**. A abertura apresenta um terreno topográfico
noturno com curvas em movimento. “Ver estrutura” revela as explicações em um
painel textual. Paleta, fontes e metáfora seguem
`candidato-levantamento-sondagem.md`. Curvas e coordenadas são ilustrativas.

Decisão atual do proprietário: **retirar a lente**, preservando o movimento das
curvas. A remoção inclui o círculo, a cena em raio-X, seus estilos, referências
SVG e o código que dimensionava e posicionava a lente. O candidato histórico e
o frontend do portfólio permanecem fora deste ajuste.

## Critérios de aceite

- Mover o ponteiro movimenta as curvas e atualiza as coordenadas ilustrativas;
  retirar o ponteiro restaura as curvas. Não há lente ou mudança de aspecto da página.
- “Ver estrutura” funciona por clique, toque e teclado e revela as anotações
  em texto, inclusive no celular. “Ocultar estrutura” fecha o painel.
- Os eventos do ponteiro são agrupados por `requestAnimationFrame` e modificam
  apenas os grupos de desenho. Há uma única cena SVG no DOM.
- A preferência por movimento reduzido desativa as animações e a paralaxe.
  Alterar essa preferência restaura a posição neutra das curvas.
- Navegação local e estudo de caso possuem destinos reais dentro do exemplo.
- Trabalho implementado e escopo planejado permanecem distintos; informações
  profissionais seguem os JSONs de `content/`, consultados em 2026-10-23.
- Layout utilizável a 320px e em desktop, sem rolagem horizontal; foco visível,
  link para pular navegação e respeito a movimento reduzido.

## Abrir no navegador

Na raiz do repositório:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs/referencias-visuais
```

Abra <http://localhost:4173/prototipo-levantamento-sondagem.html>.
O exemplo também abre diretamente pelo arquivo HTML. Não há instalação,
backend ou coleta de dados. As fontes são carregadas do Google Fonts; sem rede,
o conteúdo e as interações permanecem disponíveis com fontes alternativas.

## Limite da demonstração

As anotações são um retrato do repositório na data acima. A animação das etapas
de CI ilustra a ordem configurada; não executa testes nem informa o estado de
uma execução. Este HTML não reproduz a validação de build da aplicação Next.js.

## Verificação em 2026-10-23

- Chromium em 1280, 390 e 320px: nenhuma rolagem horizontal ou exceção JavaScript.
- axe WCAG 2 A/AA e 2.1 AA: zero violações nas vistas normal e expandida nas
  três larguras.
- Verificados: destinos dos links locais, movimento e coordenadas, estudo de caso
  expansível, link de salto, Enter, Escape e botão de estrutura por toque.
- ESLint do JavaScript embutido, sintaxe, Prettier e `git diff --check` passaram.
- Competências conferidas contra os JSONs atuais; nenhuma dependência adicionada.
- As verificações de build e tipos do Next.js não se aplicam ao HTML isolado.

## Detector de design

As exceções de `cramped-padding` e `repeating-stripes-gradient` estão restritas a
este HTML, em `.impeccable/config.json`. O painel usa padding lateral de pelo
menos 16px; os itens do planejamento usam pelo menos 20px, por variáveis CSS e
`clamp()` que o detector não resolve. A hachura identifica o planejamento na
metáfora cartográfica. Os demais testes do detector continuam ativos.

A lente e seus contornos foram removidos a pedido do proprietário. As
informações que ela revelava continuam disponíveis no painel textual. Não foi
adicionada dependência nem estimada uma nova melhoria percentual de desempenho.
