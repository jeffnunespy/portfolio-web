# Direção aprovada — Levantamento e sondagem

**Status: aprovado pelo proprietário em 2026-10-23.**

## Decisão do proprietário

O proprietário aprovou a versão **sem lente**, com o movimento das curvas
preservado, e solicitou o registro com a mensagem “aprovado, registra”. Essa é a
referência escolhida para o redesign do portfólio.

Referência aprovada:
[prototipo-levantamento-sondagem.html](prototipo-levantamento-sondagem.html).
Escopo, execução local e verificações:
[exemplo-interativo.md](exemplo-interativo.md).

A aprovação cobre a direção visual e a composição demonstrada nesse protótipo.
As demais rotas devem ser desenvolvidas no mesmo mundo visual, respeitando a
constituição e os requisitos de `specs/`. A migração do frontend e a publicação
são etapas posteriores. `DESIGN.md` descreve a implementação atual até a
migração para a direção aprovada.

## Conceito aprovado

Um levantamento topográfico noturno apresenta o trabalho verificável. As
curvas de nível dão profundidade e respondem ao ponteiro. As explicações sobre
conteúdo, validação e competências ficam em um painel textual acessível pelo
botão **Ver estrutura**.

A metáfora serve ao princípio “evidências acima de afirmações”: a apresentação
separa trabalho implementado de intenção e permite consultar o que sustenta
cada afirmação.

## Linguagem visual

- **Fundo:** preto esverdeado `#0c0f0e`.
- **Curvas e filetes:** `#232a27`, `#34403a` e `#5b6862`.
- **Texto:** marfim `#e7e4da`; secundários `#a9aea6` e `#7f877f`.
- **Acento de evidência:** laranja `#e8703f` / `#ff9a6b`.
- **Foco de teclado:** âmbar `#f2c46b`.
- **Tipografia:** Geologica leve nos títulos e no corpo; Martian Mono em
  coordenadas, legendas, campos e notação técnica.
- **Formas:** cantos retos, filetes finos, mapas geométricos e espaço entre
  grupos de conteúdo.
- **Legenda:** marco identifica implementação; tracejado identifica
  planejamento; isolinhas e coordenadas são ilustrativas, não dados reais.

## Composição e interações aprovadas

1. Cabeçalho horizontal com assinatura e navegação; navegação em outra linha
   nas telas estreitas.
2. Abertura ampla com terreno topográfico, posicionamento “Desenvolvedor Web em
   Formação”, descrição factual, ações e legenda.
3. Curvas em três camadas, com varredura inicial e paralaxe ligada ao ponteiro.
   Atualizações agrupadas por `requestAnimationFrame`, limitadas aos grupos SVG;
   ao sair da abertura, as curvas voltam à posição neutra.
4. Botão **Ver estrutura** abre o painel textual “O que sustenta a superfície”,
   também disponível no celular e por teclado, sem alterar o aspecto da abertura.
5. **Terreno levantado:** ficha da Plataforma de Portfólio, com situação, stack,
   verificações, ordem configurada da integração contínua, limitação e repositório.
   O estudo de caso pode ser expandido.
6. **Terreno ainda não levantado:** projetos planejados em área tracejada e
   hachurada, separados da implementação, sem imagem ou link de detalhe.
7. Rodapé com nome e contatos confirmados do perfil.

**A lente circular foi retirada por decisão explícita do proprietário.** Não
reintroduzir círculo seguindo o ponteiro, raio-X, cópia estrutural da abertura
ou efeitos que mudem o aspecto da página ao passar o mouse.

O movimento das curvas permanece aprovado, com respeito a
`prefers-reduced-motion`. A linha de caminhamento e as estações visuais de CI
usam animação por rolagem onde houver suporte; o fallback conserva a leitura.
A animação de CI ilustra a ordem configurada, não uma execução ao vivo.

## Limites para a implementação

- Preservar o posicionamento “em formação”, a voz sóbria e o conteúdo verificável.
- Derivar perfil, projetos, competências e explicações dos dados reais. O HTML
  aprovado contém um retrato do conteúdo consultado em 2026-10-23.
- Preservar a separação entre implementação e planejamento; o roadmap não conta
  como evidência e não recebe apresentação de projeto entregue.
- Preservar semântica, foco visível, teclado, responsividade e movimento reduzido.
  O protótipo foi verificado automaticamente em 1280, 390 e 320px; isso não
  substitui as inspeções humanas previstas para publicação do portfólio.
- Na aplicação Next.js, servir as fontes pelo próprio site com `next/font`.
- Avaliar desempenho e alternativas de geração do SVG durante a migração. As
  medições anteriores da lente não descrevem esta versão sem lente.
- Registrar divergências e alinhar spec, plano e tarefas antes da implementação
  nas rotas do portfólio. Não marcar a migração como entregue por esta aprovação.

## Histórico e proveniência

Em 2026-10-09, a fusão de **Levantamento noturno** com **Negatoscópio** foi
registrada como candidato potencial. A versão inicial incluía uma lente de
sondagem. Em 2026-10-23, o proprietário solicitou um exemplo navegável, avaliou
a manutenção da lente por desempenho e depois pediu sua retirada. A aprovação
atual corresponde à versão final **sem lente**.

A referência 01B — Planos suspensos foi descartada. C3 — Encadernação interativa
e C — Encadernação exposta permanecem referências alternativas de arquivo; não
são a direção escolhida. O nome deste arquivo foi preservado para manter os
links existentes.

O protótipo foi construído em HTML, CSS e JavaScript com o skill Impeccable, sem
imagem gerada. A referência executável é o HTML indicado acima. Outros estudos
da rodada inicial ficam em `.impeccable/mocks/prototipos/`, fora do versionamento.
