# Candidato potencial — Levantamento e sondagem

## Decisão do proprietário

Em 2026-10-09, depois de comparar cinco protótipos de direção para a página inicial, o proprietário gostou da fusão **Levantamento e sondagem**. Pediu que ela fosse registrada como **candidato potencial**. Isso é preferência registrada, não aprovação: o layout não está aprovado, o frontend não deve ser implementado e o `DESIGN.md` não deve ser substituído.

A fusão combina as duas direções de que o proprietário gostou. O visual vem de **Levantamento noturno** (mapa topográfico à noite) e a interação de assinatura vem de **Negatoscópio** (lente que revela a estrutura). Na mesma data, o proprietário descartou a referência 01B (`direcao-provavel.md`). A C3 — Encadernação interativa ficou como alternativa a considerar ([candidato-c3-encadernacao.md](candidato-c3-encadernacao.md)).

Protótipo navegável: [prototipo-levantamento-sondagem.html](prototipo-levantamento-sondagem.html). É um HTML autocontido; só as fontes vêm do Google Fonts.

## Ideia central

A página é um levantamento topográfico noturno. A superfície mostra o que foi feito. A lente funciona como uma sondagem: abaixo da superfície aparece a estrutura que sustenta a página, com anotações verificáveis (origem do conteúdo, validação que quebra o build, competências comprovadas). A metáfora serve ao princípio "evidências acima de afirmações": quem visita pode conferir.

## Linguagem visual

- **Cores:** fundo `#0c0f0e`; linhas `#232a27` / `#34403a` / `#5b6862`; texto marfim `#e7e4da` (secundários `#a9aea6`, `#7f877f`).
  - Marco laranja `#e8703f` / `#ff9a6b`, reservado a trabalho implementado e a evidência.
  - Foco âmbar `#f2c46b`.
- **Tipografia:** Geologica em peso leve (200–400) para títulos e texto corrido; Martian Mono para legenda, coordenadas, rótulos da ficha e anotações.
- **Legenda do mapa como contrato de honestidade:**
  - marco = implementado;
  - tracejado = planejado;
  - isolinhas = terreno ilustrativo, que não representa dado.

## Interações de assinatura

- **Curvas de nível**, geradas a partir de um terreno sintético, em três camadas com profundidade (paralaxe) ligada ao ponteiro. Aparecem varridas da esquerda para a direita, como num plotter (`@property --scan` + `mask-image`).
- **Lente de sondagem** seguindo o ponteiro: `clip-path: circle()` controlado por `--k`, `--lx` e `--ly`.
  - Dentro dela: quadriculado, textos só em contorno (`-webkit-text-stroke`), caixas tracejadas e anotações em `attr(data-note)`.
  - O anel com marcações é desenhado fora do recorte com `transform: scale(var(--k))`.
- **Botão "Ver estrutura"** (`aria-pressed`) expande a sondagem para a abertura inteira.
- **Painel de coordenadas** (E/N/cota) sob o ponteiro.
- **Linha de caminhamento** ligada à rolagem (`animation-timeline: scroll()`).
- **Estações da integração contínua** acendem em sequência quando a ficha entra na tela. Usa uma `view-timeline` nomeada e `animation-range` escalonado por `--i`.

## Estrutura da página

1. Abertura: posicionamento "Desenvolvedor Web em Formação", descrição, ações e legenda do mapa.
2. **Terreno levantado:** ficha de campo da Plataforma de Portfólio, com estes campos:
   - situação;
   - stack;
   - verificação;
   - integração contínua (audit → format → lint → typecheck → vitest → build → e2e → axe);
   - limitação conhecida;
   - repositório.
3. **Terreno ainda não levantado:** os quatro projetos planejados, em área tracejada e hachurada, sem marco, imagem nem link de detalhe.

## Limites e decisões pendentes

- **Anotações vindas do conteúdo:** na implementação, as anotações da lente precisam ser derivadas do conteúdo e do schema reais, nunca escritas fixas. O protótipo usa valores fixos ("13 competências declaradas / 13 comprovadas"), corretos em 2026-10-09.
- **Projetos planejados:** continuam claramente separados e nunca recebem o laranja de marco.
- **Celular:** as anotações ficam ocultas por falta de espaço. Falta decidir como apresentá-las, por exemplo em lista abaixo da abertura no modo "Ver estrutura".
- **Fontes:** no Next.js, usar `next/font` para servi-las pelo próprio site e evitar requisição ao Google Fonts.
- **Firefox e outros navegadores sem animação por rolagem:** as estações aparecem já acesas e a linha de caminhamento fica estática. É aceitável, mas precisa ser confirmado.
- **Acessibilidade:** a camada da lente é decorativa (`aria-hidden`). O conteúdo das anotações precisa existir também em texto acessível, se for considerado relevante. Validar com axe, foco visível e `prefers-reduced-motion`.
- **Desempenho:** medir o custo do SVG de curvas de nível (gerado em JS no protótipo) e considerar gerá-lo em tempo de build.
- **Fonte de verdade:** os requisitos em `specs/` e a constituição continuam valendo. Registrar divergências antes de implementar.

## Proveniência

O protótipo foi construído em código, sem imagem gerada, com o skill Impeccable em 2026-10-09. Outros protótipos da mesma rodada (fora do versionamento) ficam em `.impeccable/mocks/prototipos/`:

- `levantamento.html`
- `negatoscopio.html`
- `segmentos.html` e `especime.html` foram descartados e removidos em 2026-10-09
