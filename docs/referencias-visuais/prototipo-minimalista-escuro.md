# Referência oficial — Minimalismo escuro

Protótipo solicitado em 2026-10-23 e aprovado pelo proprietário como o **novo visual oficial
do projeto**, na versão final sem prévia de Nana Silva. A decisão completa está em
[`direcao-minimalista-escura.md`](direcao-minimalista-escura.md).
Substitui a direção Levantamento e sondagem; a migração da aplicação Next.js permanece pendente.

## Como abrir

Abra [`prototipo-minimalista-escuro.html`](prototipo-minimalista-escuro.html) diretamente no
navegador. O HTML funciona por `file://`, inclusive com JavaScript desativado; a fonte externa
tem fallback local. Preserve a estrutura do repositório para acessar o currículo relativo.

O servidor local de inspeção atual também oferece o
[protótipo em http://127.0.0.1:8765](http://127.0.0.1:8765/docs/referencias-visuais/prototipo-minimalista-escuro.html).
Esse endereço é local e não representa publicação.

## Escopo e critérios de aceite

- Um HTML separado, utilizável diretamente no navegador ou servido pela raiz do repositório.
- Tema escuro, tipografia leve, espaço generoso e laranja discreto herdados da referência.
- Composição nova, com nome em destaque, projetos em linhas abertas, apresentação e contato.
- Sem paralaxe, canvas, animações de entrada, efeitos de ponteiro ou JavaScript obrigatório.
- Nome, posicionamento, contato, formação e projetos reais apoiados nos JSONs de `content/`.
- Assinatura com ponto laranja, apresentação textual de Nana Silva e diagrama semântico da plataforma.
- Dois exemplos fictícios para preencher a composição, identificados individualmente e sem
  alegação de entrega, cliente, resultado ou endereço de demonstração inventado.
- Links locais válidos, divulgações nativas operáveis por teclado e ausência de rolagem
  horizontal em 320, 390, 768 e 1280px.
- Contraste WCAG AA e respeito a movimento reduzido e cores forçadas.

O conteúdo fictício é autorizado expressamente pelo proprietário e permanece apenas neste
protótipo, conforme FR-026. Não entra em `content/`, em competências ou nas rotas públicas.
O visual desta referência é oficial. Os dados fictícios continuam exclusivos do protótipo;
os contratos funcionais e de publicação da aplicação permanecem vigentes.

## Refinamento de personalidade aprovado

Em 2026-10-23, o proprietário aprovou o conceito deste protótipo e solicitou aplicar os quatro
refinamentos apresentados: assinatura tipográfica em “Nunes.” com ponto laranja recorrente;
prévias estáticas específicas dos projetos; redação em primeira pessoa para explicar decisões;
e variação de escala e composição entre o projeto em destaque e o seguinte, mais compacto.

A implementação permanece neste HTML independente. Após avaliar a imagem de Nana Silva, o
proprietário definiu “sem prévia”: a apresentação desse projeto fica somente em texto,
com tecnologias, link de validação e detalhes de decisões. A plataforma mantém
um esquema semântico simplificado de conteúdo, validação e publicação, apoiado no código e nos
JSONs existentes. O destaque visual não implica publicação comercial de Nana Silva nem altera
seus limites. A navegação, o currículo, os detalhes nativos e a ficção identificada permanecem.

Critérios adicionais: Nana Silva não exibe imagem ou link para captura; o diagrama mantém texto
semântico; o ponto decorativo não deve interromper o nome acessível; as composições precisam
se empilhar em telas estreitas; e nenhuma animação, dependência ou coleta de dados é acrescentada.

## Plano de execução

1. Conferir as fontes reais e registrar o limite entre implementação e demonstração.
2. Construir `prototipo-minimalista-escuro.html` com HTML/CSS, sem dependência nova.
3. Verificar formatação, links, funcionamento sem JavaScript, teclado, responsividade e axe.
4. Inspecionar capturas desktop e celular em uma rodada; corrigir os achados em conjunto.
5. Registrar os resultados e submeter o artefato à revisão final independente.

## Conteúdo e sistema desta alternativa

**Modo:** Experience. O visitante identifica o desenvolvedor, consulta o trabalho e encontra
os links de evidência e contato. A composição prioriza texto e leitura, sem simular uma aplicação.

**Fontes reais:** `content/profile.json`, `content/projects/plataforma-portfolio.json` e
`content/projects/nana-silva.json`, consultados em 2026-10-23. Os resumos são condensados dessas
fontes. Nana Silva permanece explicitamente em validação, com repositório privado.

**Ficção:** Acervo e Intervalo são exercícios imaginários de interface para popular esta
alternativa. Não são trabalhos do proprietário, projetos planejados do roadmap ou implementações.

**Linguagem:** fundo `#0c0f0e`, superfície `#121615`, texto `#e7e4da`, apoio `#a9aea6`,
filetes `#34403a`, laranja de leitura `#ff9a6b` e foco `#f2c46b`. Geologica em pesos leves;
corpo de 17px com entrelinha 1,7, nome fluido até 92px, títulos de seção até 40px e títulos
dos projetos até 38px. A chamada de contato usa uma escala própria, até 76px.
Filetes e espaço separam os conteúdos; não há sombras, gradientes nem cartões contornados.

**Composição:** contêiner de até 88rem, margem lateral `clamp(1.25rem, 5vw, 5rem)` e grade
de duas colunas na proporção 1,3:1. “Nunes.” recebe recuo de 0,55em e ponto laranja decorativo,
repetido na assinatura do cabeçalho, nos marcadores de projetos reais e nas escolhas comentadas.
O nome acessível permanece “Jefferson Nunes”. Nana Silva abre a seleção, com título em linha
própria, contexto à esquerda e tecnologias e evidência à direita. A plataforma seguinte usa texto
à esquerda e diagrama à direita, em grade 1:1,3. Até 760px, as grades passam a uma coluna.
O diagrama muda de horizontal para vertical até 1050px. Projetos reais têm filetes contínuos;
exemplos fictícios, tracejados e rótulos explícitos. A composição continua baseada no HTML
aprovado, sem nova proposta de identidade ou composição gerada.

**Meios:** não há imagens raster na versão atual. A captura de Nana Silva, sua legenda, o link
para a captura e o arquivo PNG sem uso foram retirados após a orientação “sem prévia”.
O link do site de validação permanece disponível. O fluxo da plataforma usa
HTML semântico (`ol` com `role="list"`, por não exibir marcadores) e ícones SVG:
conteúdo JSON → validação de campos/evidências → páginas
estáticas. A legenda declara que é uma representação simplificada do build, não execução ao vivo.

**Voz:** os dois detalhes passam a apresentar “Uma escolha deste catálogo” e “Uma escolha
desta plataforma”. As decisões são narradas em primeira pessoa, apoiadas nos motivos já
registrados nos JSONs: edição pelo celular via Notion e simplificação operacional com JSON.
Os limites e as verificações pendentes continuam explícitos.

**Interações:** navegação por âncoras, links reais e `details`/`summary` para contexto e
limitações, sem scripts. Só a cor dos links tem transição de 160ms (`ease-out`), removida em
movimento reduzido. Ações têm altura mínima de 44px; o foco usa contorno de 2px afastado 5px.
Em cores forçadas, o foco usa `Highlight` e os pequenos marcos usam `CanvasText`.
As fontes usam Google Fonts com fallback local, como na referência; o conteúdo continua
acessível se a fonte externa não carregar.

`DESIGN.md` da raiz registra o sistema oficial extraído desta referência aprovada. Este
documento mantém as decisões específicas da composição e seu histórico de validação.
As rotas Next.js ainda usam o sistema anterior, preservado em
[`design-levantamento-sondagem.md`](design-levantamento-sondagem.md), até a migração da fase 17.
O brief local `.impeccable/surfaces/docs-referencias-visuais-prototipo-minimalista-escuro-html.md`
persiste a estratégia e o contrato de direção da referência, com seed `e2a62ffd`.
Regras reutilizáveis passam a `DESIGN.md`; os exemplos e a composição de cada rota continuam
subordinados à especificação.
Brief, sidecar e capturas em `.impeccable/` são artefatos locais ignorados pelo Git;
este documento e `DESIGN.md` preservam a orientação necessária no repositório.

## Validação atual — sem prévia

Em 2026-10-23, após retirar a prévia de Nana Silva: 320, 390, 768 e 1280px sem
transbordamento, erros de página ou violações axe WCAG 2.1 A/AA, incluindo ambos os
detalhes abertos em desktop e celular. Confirmada a ausência de imagens, figura e link de
captura no projeto e a remoção do PNG sem uso. Nome acessível, diagrama da plataforma,
ficção identificada, links e currículo preservados. Abertura offline por `file://`, teclado,
movimento reduzido e cores forçadas passaram. Prettier, `git diff --check` e detector nativo
passaram, sem novas exceções. Capturas e relatório em
`.impeccable/review/prototipo-minimalista-sem-previa/`.

## Histórico: validação do refinamento de personalidade

Executada em 2026-10-23, após adicionar os quatro pontos aprovados:

- `npm run lint`, `npm run typecheck` e os 44 testes unitários em 8 arquivos passaram.
- Playwright em 1280×900, 390×844, 320×740 e 768×1024: sem transbordamento, sem erros
  de página e zero violações axe WCAG 2.1 A/AA. Os dois detalhes abertos também passaram
  em desktop e celular.
- A captura local carregou com 1200×659px. As duas prévias, o nome acessível, os rótulos
  real/fictício, os links e o currículo foram conferidos.
- Abertura por `file://`, offline e sem JavaScript: imagem local carregada, salto e ambos
  os detalhes operáveis por teclado, sem rolagem horizontal em 320px. Movimento reduzido
  e foco em cores forçadas preservados.
- O detector nativo retornou zero achados com a configuração existente. Não foi adicionada
  nova supressão; permanece somente a exceção de `cramped-padding` documentada abaixo.
- `embed-prompt.mjs --scan docs/referencias-visuais/assets`: um raster, nenhuma origem ausente.

Capturas desta rodada em `.impeccable/review/prototipo-minimalista-personalidade/`:
`desktop.png`, `mobile.png`, `mobile-320.png`, `tablet.png`, `desktop-details.png` e
`mobile-details.png`. O relatório é `validation.json`, no mesmo diretório.

## Histórico de validação inicial

Verificações executadas em 2026-10-23:

- `npm run lint` e `npm run typecheck`: passaram.
- `npm test -- --run`: 44 testes passaram em 8 arquivos.
- `npx prettier --check` nos arquivos HTML e Markdown desta alternativa: passou.
- `git diff --check`: passou.
- Playwright headless em 1280×900, 390×844, 320×740 e 768×1024: sem rolagem horizontal,
  elementos transbordando ou violações axe WCAG 2.1 A/AA. A análise com detalhes abertos
  também retornou zero violações.
- Âncoras e links locais conferidos; currículo respondeu HTTP 200 com `application/pdf`.
  URLs externas coincidem com os JSONs de origem; sua disponibilidade externa não foi verificada.
- Link de salto focável e visível; Enter abre e Espaço fecha `details`, sem JavaScript.
  Movimento reduzido remove a transição e cores forçadas preservam o foco.
- Smoke do link de salto com foco e hover: texto `rgb(12, 15, 14)` sobre fundo
  `rgb(231, 228, 218)`, com zero violações axe. Abertura offline por `file://` em 320px,
  sem JavaScript: detalhes operáveis e sem transbordamento. O artefato contém zero scripts.

As capturas locais `desktop.png`, `mobile.png`, `mobile-320.png` e `tablet.png` foram
inspecionadas em `.impeccable/review/prototipo-minimalista-escuro/`.
As medições estão no `validation.json` desse diretório local.
Isso registra a inspeção do protótipo; a aprovação oficial posterior está documentada acima.

O detector manual foi executado uma vez em modo degradado: faltavam `htmlparser2`,
`css-select`, `css-tree` e `domutils`. A verificação por expressões regulares retornou zero
achados; esse resultado não equivale à análise completa do detector. Os hooks apontaram
a escala tipográfica, ajustada com valores do `DESIGN.md` existente; o contraste do hover
do link de salto também foi corrigido. Nessa validação inicial, nenhuma regra foi suprimida.

Na triagem posterior do hook, o detector nativo reproduziu `cramped-padding` nos dois
painéis `.detail-content` e em três seções. A medição no Chromium em 320, 390, 768 e 1280px
confirmou de 20 a 32px entre o conteúdo dos painéis e suas quatro bordas, e pelo menos 48px
de recuo superior nas seções. São falsos positivos da leitura estática de `clamp()` e
`padding-block`; o HTML e a composição foram preservados. A exceção foi registrada pela CLI
apenas para `cramped-padding` neste HTML, mantendo as demais regras ativas. A nova execução
do detector nativo, com essa configuração, retornou zero achados.

As medições estão em `padding-validation.json`, com capturas dos painéis abertos
`padding-1280.png` e `padding-390.png`, no diretório local
`.impeccable/review/prototipo-minimalista-escuro/`.

Build do Next.js e E2E das rotas públicas não foram executados: esta alteração se limita a
HTML e documentação independentes, sem modificar as rotas da aplicação.
