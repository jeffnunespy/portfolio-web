# Galeria de explorações minimalistas

A [galeria HTML](exploracoes-minimalistas.html) reúne três estudos visuais para comparar
composições da home: **O trabalho abre**, **Índice aberto** e **Caderno de decisões**.
Atende ao pedido de uma página para os três principais candidatos, após a solicitação de
explorar outra versão minimalista. Nenhum candidato foi escolhido ou implementado como
site individual; o visual oficial permanece o registrado em [DESIGN.md](../../DESIGN.md)
e na [decisão de identidade](direcao-minimalista-escura.md).

Esta superfície tem modo **Read**: alternar prévias, entender diferenças e ampliar imagens.
Os estudos representam possibilidades para uma futura home de modo **Experience**.
A galeria pode ser aberta diretamente pelo HTML, mantendo a pasta `assets` ao lado, ou
na prévia local `http://127.0.0.1:4173/exploracoes-minimalistas.html` enquanto o servidor
estiver ativo. Não houve publicação, alteração de rotas ou adição de dependências.

## Composições comparadas

| Candidato           | Prioridade explorada                                                             | Limite apresentado                                                                  |
| ------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| O trabalho abre     | A plataforma ocupa a abertura; nome e posicionamento acompanham pela margem.     | A identidade pessoal ganha menos destaque.                                          |
| Índice aberto       | Identidade lateral e projetos em índice, com contexto na própria linha.          | A futura versão navegável exigiria abrir projetos para consultar parte do conteúdo. |
| Caderno de decisões | “Validar antes de publicar” conduz a leitura; projetos contextualizam a decisão. | Há mais leitura antes de chegar aos estudos de caso.                                |

Links, accordions e outros controles desenhados nos WebP são ilustrativos. A interação
implementada pertence à galeria: seleção de candidato, navegação por âncoras e ampliação.

## Sistema local construído

A galeria herda Geologica leve, paleta escura, marfim, acento laranja, foco âmbar e
composição aberta de [DESIGN.md](../../DESIGN.md). Não estabelece novos tokens globais.
O título local usa `clamp(2.5rem, 5.5vw, 4.75rem)`, peso 200 e entrelinha 1.1; o corpo
usa 1.0625rem, peso 300 e entrelinha 1.7. Filetes e espaço organizam o conteúdo, sem
sombras ou cartões decorativos.

O contêiner tem limite de 88rem e margens fluidas. No desktop, a abertura usa duas colunas
(1.5fr/1fr), os três seletores têm igual espaço e a prévia ocupa toda a largura de leitura.
Cada candidato inclui resumo, imagem ampliável e notas de mudança, leitura e atenção.
Até 760px, abertura, seletores e notas passam a uma coluna; as imagens preservam proporção.

A melhoria progressiva transforma os links de âncora em tabs: `tablist`, `tab`,
`tabpanel`, `aria-controls`, `aria-selected` e foco móvel entre seletores. Setas,
Home e End selecionam e focam; Espaço e Enter ativam. O hash abre o candidato indicado.
O selecionado recebe acento e filete; foco usa contorno de 2px afastado 5px, distinto
da seleção. Sem JavaScript, os três estudos continuam disponíveis em sequência.
A impressão revela todos os painéis, movimento reduzido remove a transição de cor e
cores forçadas preservam foco e seleção com cores de sistema.

## Assets e procedência

Os três WebP de 1505 × 1045 foram gerados por `image_gen.imagegen`, usando a
[captura da referência oficial](../../.impeccable/review/prototipo-minimalista-escuro/desktop.png)
como referência de identidade, e convertidos com `ffmpeg`. Cada arquivo mantém o prompt
embutido e um sidecar `.webp.json`. Os [prompts exatos](assets/exploracoes-minimalistas/prompts.json)
registram `approved: false` para os três candidatos. A nota visível na página identifica
a geração com IA e o caráter ilustrativo dos controles.

Geologica latin e latin-ext foram copiadas do cache existente de `next/font` para assets
locais. Imagens e fontes dispensam requisições externas na galeria; a primeira prévia tem
prioridade de carregamento e as demais usam carregamento adiado.

## Aceite e validação local

Os critérios de aceite da galeria foram atendidos: três candidatos comparáveis, identidade
oficial preservada, explicação das diferenças, ampliação em nova aba, navegação acessível,
leitura responsiva e fallback offline sem JavaScript.

O [registro de validação](../../.impeccable/review/exploracoes-minimalistas/validation.json)
documenta os três candidatos em 320, 390, 768 e 1280px sem overflow, seis verificações
axe WCAG 2.1 A/AA e verificações de teclado, deeplink, impressão, movimento reduzido,
cores forçadas, ampliação, ausência de JavaScript e abertura offline. Não houve erros de
página ou requisições. As capturas `desktop-*.png` e `mobile-*.png` estão na mesma pasta.

O script temporário `/tmp/portfolio-exploracoes-verify.cjs` executou essas verificações;
não integra a suíte permanente. Prettier do HTML e dos prompts, ESLint do JavaScript
inline por stdin e `git diff --check` passaram. O hook ativo não encontrou achados
determinísticos; o scan de procedência encontrou três rasters e nenhuma procedência ausente.
O revisor independente `impeccable_finish_reviewer` retornou `disposition: ship` para a
galeria, sem achado material nas cinco seções de revisão, com base em código, capturas
e registros; não executou verificações próprias.

Nenhum build da aplicação foi executado nesta entrega, pois seus arquivos não foram
alterados. As evidências validam a galeria local; não validam produção nem os três
conceitos como sites funcionais. Composições, ordem e textos dos estudos permanecem
exploratórios, sem autoridade sobre a identidade, especificações ou conteúdo oficial.
