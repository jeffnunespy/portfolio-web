# Active Context

## Feature

Experiência Pública Inicial do Portfólio (`001-experiencia-publica-inicial`).

## Status

Implementação das fases 1–16 entregue, exceto pelas inspeções de publicação de T055. A fase 15
(T092–T099) migrou todas as rotas para a direção visual **Levantamento e sondagem**.
Em 2026-10-23, o proprietário aprovou **Minimalismo escuro** como o novo visual oficial,
na versão final **sem prévia de Nana Silva**. O sistema está implementado no protótipo;
a migração das rotas Next.js está pendente na fase 17. `DESIGN.md` passa a orientar o novo
visual, e a implementação anterior fica registrada como histórico.
Em 2026-10-23, o proprietário confirmou o perfil atual e o estudo de caso da plataforma e autorizou
a geração do PDF. A publicação continua bloqueada pelas inspeções manuais/de preview.

## Visual oficial — Minimalismo escuro (2026-10-23)

- Aprovação explícita: “aprovado como novo visual oficial do projeto”. Registro em
  [`direcao-minimalista-escura.md`](referencias-visuais/direcao-minimalista-escura.md).
- Referência: [`prototipo-minimalista-escuro.html`](referencias-visuais/prototipo-minimalista-escuro.html),
  após a orientação “sem prévia”. Tema escuro, Geologica leve, linhas abertas, assinatura
  “Nunes.” com ponto laranja, decisões em primeira pessoa e diagrama semântico da plataforma.
  Nana Silva fica textual; não reintroduzir a captura. Não há paralaxe, terreno ou varredura.
- `DESIGN.md` e seu sidecar passam a registrar a direção oficial. O sistema das rotas ainda
  em código está preservado em
  [`design-levantamento-sondagem.md`](referencias-visuais/design-levantamento-sondagem.md).
- Perfil, fontes de conteúdo, validação, rotas, currículo e competências continuam sob a spec.
  Acervo e Intervalo são ficção do protótipo e não serão migrados para a aplicação.
- FR-006a formaliza a exceção de exibição já aprovada para Nana Silva: apresentação sem
  imagem, preservando campo, arquivo, metadados e demais campos/ações. FR-006 continua
  exigindo a exibição de imagem nos demais projetos.
- A composição deve ser adaptada para preservar FR-001–FR-003/SC-001, a navegação por rotas,
  os estudos de caso completos e a separação entre implementação e roadmap.
- Evidência do protótipo sem prévia: quatro larguras (320/390/768/1280), zero overflow/axe/erros,
  detalhes nativos, teclado, offline sem JavaScript, movimento reduzido e cores forçadas;
  revisão final `ship`. Relatório em `.impeccable/review/prototipo-minimalista-sem-previa/`.
- Esta etapa registra a decisão e prepara as tarefas; nenhuma rota foi migrada e o site
  não foi publicado. T055 permanece aberta e T102–T105 registram a migração pendente.
- T101 concluída após validação documental: YAML/JSON, sete cores e sete componentes,
  37 links locais em 11 documentos, Prettier, detector nativo e diff sem falhas. O HTML fora
  dos comentários permanece idêntico ao aprovado. Revisões de spec e constituição confirmaram
  a resolução da exceção visual FR-006a.

## Nana Silva — conteúdo profissional (T100, 2026-10-23)

- O proprietário solicitou incluir o projeto e confirmou desenvolvimento completo, natureza
  profissional e solução para uma necessidade real. A fonte técnica é o relatório
  `relatorio-tecnico-portfolio-catalogo-nana-silva-2026-10-22.md`, fornecido na Área de Trabalho;
  ele foi consultado, sem copiar o relatório integral ou arquivos privados do projeto para cá.
- `content/projects/nana-silva.json`: estudo de caso real e em destaque, categoria Web, natureza
  profissional, responsabilidade integral, quatro decisões técnicas, stack, funcionalidades,
  limitações e próximos passos. O status permanece "Em andamento" porque a publicação é de
  validação e o relatório registra verificações operacionais pendentes.
- Link principal `https://nana-silva-validacao.pages.dev/`, sem fragmento: HTTP 200 e HTML com título
  "Portfólio · Nana Silva", artista e seção de flashes conferidos. A consulta de metadados confirmou
  repositório privado; a ficha usa `linkRepositorio: "privado"` sem divulgar seu endereço.
- Índice ilustrativo `public/images/projects/nana-silva.svg` no sistema visual existente, sem fotos
  de clientes nem captura simulada da aplicação. `content/profile.json` passou de "é esta
  plataforma" para "inclui esta plataforma", preservando as competências e o posicionamento.
  `public/curriculo.pdf` foi sincronizado: uma página, 30 textos do perfil e três links conferidos
  com pypdf, além de renderização e inspeção visual.
- A segunda ficha expôs expectativas de ficha única nos testes. Foram preservadas as verificações
  de posição, limites, destinos, ordem de foco, largura dos cards e ações mobile, agora aplicadas a
  todas as fichas. A primeira suíte completa teve 72/73 por seletor singular no teste de ação em
  320px; o teste passou após percorrer todos os cards, e a repetição integral aprovou 73/73.
- Validação executada: `npm run format:check`, `npm run lint`, `npm run typecheck`, 44 unitários em
  oito arquivos e `npx playwright test --workers=2` (73 testes, incluindo axe, teclado, metadados,
  PDF, navegação e responsividade). O webServer do Playwright executou o build de produção; o
  manifesto de pré-renderização contém ambas as fichas e seus cartões Open Graph. Após a última
  alteração de testes, ESLint localizado, tipos e Prettier localizado também passaram.
- Inspeção visual local do detalhe e rodapé em 1280/320px e das duas fichas na home; sem alteração
  de layout. `content-integrity` não encontrou inconsistências. O agente constitucional ficou
  indisponível por limite de uso; a auditoria foi realizada manualmente conforme suas instruções,
  com constituição, requisitos, plano, tarefa e diff revisados, sem violações no escopo.
- Nenhuma dependência adicionada. Mudanças preexistentes de AGENTS, direção visual e rótulo
  "Ver comprovação" foram preservadas. Sem commit, push ou deploy; T055 continua aberta.

## Histórico — direção Levantamento e sondagem aprovada em 2026-10-23

Substituída como direção oficial por **Minimalismo escuro**, registrado acima. O texto desta
seção descreve a aprovação anterior e a migração já entregue na fase 15.

O proprietário aprovou **Levantamento e sondagem**, na versão **sem lente**, e
solicitou o registro da decisão. A referência aprovada é
[`prototipo-levantamento-sondagem.html`](referencias-visuais/prototipo-levantamento-sondagem.html).
Preservar o mapa topográfico noturno, as curvas em movimento, Geologica e
Martian Mono, o marfim sobre fundo escuro, o laranja para evidência e o painel
textual “Ver estrutura”. A lente circular e o raio-X foram retirados por decisão
do proprietário e não devem ser reintroduzidos em uma passagem de acabamento.

Decisão completa em
[`candidato-levantamento-sondagem.md`](referencias-visuais/candidato-levantamento-sondagem.md);
escopo e verificações do protótipo em
[`exemplo-interativo.md`](referencias-visuais/exemplo-interativo.md).
A migração foi implementada em 2026-10-23 (fase 15, abaixo). Seu sistema está preservado em
`referencias-visuais/design-levantamento-sondagem.md`; a gramática **A Ficha de Catálogo**
foi substituída naquela entrega. O `DESIGN.md` atual já registra a nova direção oficial.

## Migração visual — Levantamento e sondagem (fase 15, 2026-10-23)

- T092: emenda de direção visual em `plan.md` com as divergências registradas antes do código
  (home sem listar itens planejados, estudo de caso mantido na rota de detalhe, orçamento de duas
  fontes, esquema noturno único e fichas SVG redesenhadas).
- T093: tokens noturnos, Geologica variável e Martian Mono 400 via `next/font`, foco âmbar, seleção,
  barra de rolagem, skip link, forced-colors, impressão e movimento reduzido em `app/layout.tsx` e
  `app/globals.css`.
- T094: `components/home/SurveyOpening.tsx` — três camadas SVG de um `<path>` cada, geradas no
  cliente; varredura inicial; paralaxe só para mouse com ponteiro fino, agrupada em um
  `requestAnimationFrame`; legenda; leitura “ilustrativo”; “Ver estrutura” como botão de divulgação
  com painel textual derivado de `content/` e Escape devolvendo o foco. Sem lente nem raio-X.
- T095: home em estações (terreno levantado com registro de CI de `lib/ci.ts`, competências
  comprovadas, terreno ainda não levantado só com contagem e link) e linguagem estendida a
  `/projetos`, `/projetos/[slug]`, `/roadmap`, `/sobre`, `/curriculo`, 404 e erro; `ProjectMark`
  marca só trabalho implementado.
- T096: fichas SVG de `public/images/projects/` redesenhadas (paleta fixa, 5:3, marco só no
  implementado, tracejado nos planejados), ícone e cartões Open Graph na paleta noturna.
- T097: orçamento tipográfico de quatro para dois woff2 (teto de 100 KiB mantido); cor da ficha
  verificada como `[18, 22, 21]` nos esquemas claro e escuro; novos E2E para “Ver estrutura”/Escape,
  paralaxe sem alterar a página e movimento reduzido; `tests/unit/ci.test.ts` confere as etapas
  contra `.github/workflows/ci.yml`.
- T098: `format:check`, `lint`, `typecheck`, `test -- --run` (8 arquivos, 44 testes), `build`,
  `test:e2e:functional` (47 testes) e `test:e2e:a11y` (21 testes) aprovados. Inspeção visual em
  1280, 390 e 320px de todas as rotas, sem rolagem horizontal; rodada de correção ajustou o marco
  da legenda e as isolinhas das fichas SVG. Sem commit, push ou deploy.
- T099: o botão de divulgação da abertura passa de “Ver estrutura” a “Ver comprovação”/“Ocultar
  comprovação” (divergência 4 da emenda de `plan.md`): ao lado da legenda, “estrutura” lia como
  camada do mapa. Título do painel, `id="estrutura"`, teclado e Escape inalterados.

## Execução Speckit — 2026-10-23

- Git inicialmente limpo; checklists de requisitos e pré-implementação completos (53 itens).
- T041/T052/T056: conteúdo atual confirmado pelo proprietário nesta sessão. PDF de uma página
  gerado a partir do perfil, com nome, posicionamento, formação, trajetória, competências e links.
  Renderização inspecionada; extração de 31 textos do perfil e três links conferida com pypdf.
  Download configurado em `/curriculo`; E2E aciona o link, verifica a conclusão do download e
  compara os bytes com `public/curriculo.pdf`. Nenhuma dependência de PDF foi adicionada ao projeto:
  as ferramentas de autoria e inspeção foram isoladas em `/tmp`.
- T052: os cinco registros foram revisados. Somente `plataforma-portfolio` é implementação e
  sustenta as 13 competências do perfil; contexto, decisões, limitações e próximos passos são
  coerentes com os arquivos locais. As quatro intenções permanecem exclusivamente no roadmap.
  Todas as imagens existem; não há imagens órfãs nem métricas inventadas. O parecer especializado
  `content-integrity` confirmou a revisão e a consistência do PDF. Disponibilidade HTTP externa
  das redes e do repositório não foi revalidada nesta sessão.
- Divergência registrada antes da remediação: a auditoria de produção atual voltou a falhar
  (lockfile Next 16.3.1/Sharp 0.35.3; instalação local Next 16.3.4/Sharp 0.35.4;
  source-map-js 1.2.1), apesar dos resultados históricos verdes. T090 atualizou a resolução para
  Next/config 16.4.2, Sharp 0.35.5 e source-map-js 1.2.2, dentro das faixas já aprovadas no
  manifesto, sem `--force`, overrides ou alteração dos requisitos públicos.
- Não há hooks `before_implement`/`after_implement`: `.specify/extensions.yml` ausente.
- T091: a revisão semântica encontrou nomes acessíveis que não continham os rótulos compactos
  “Plano” e “CV”. A regressão reproduziu a falha em 320px antes da correção; os nomes agora são
  “Roadmap (Plano)” e “Currículo (CV)”, sem mudança visual. Os testes de tabulação e de componentes
  foram alinhados, e a regressão passou em 320px/1280px. Os gates de código, build e E2E foram
  repetidos após essa correção.

### Gates executados após instalação limpa

- `node --version` → v24.19.0.
- `npm ci --cache /tmp/portfolio-npm-cache` → concluído pelo lockfile atualizado.
- `npm audit --omit=dev --audit-level=high --cache /tmp/portfolio-npm-cache` → 0 vulnerabilidades.
- `npm run format:check`, `npm run lint` e `npm run typecheck` → aprovados.
- `npm test -- --run` → 7 arquivos, 43 testes aprovados.
- `npm run build` → Next.js 16.4.2/Turbopack concluído; rotas estáticas e ficha SSG preservadas.
- `npm run test:e2e:functional` → 43 testes aprovados, incluindo download real do currículo,
  metadados, navegação, roadmap, 404, responsividade 320/768/1280px e zoom de texto a 200%.
- `npm run test:e2e:a11y` → 21 testes aprovados, incluindo axe, teclado, foco, cores forçadas e
  correspondência entre rótulo visível e nome acessível no mobile/desktop.
- `git diff --check` → limpo. Revisão final constitucional e consolidação do diff sem bloqueadores;
  o limite de publicação de T055 permanece explícito.

### T055 — inspeções ainda não concluídas

| Item                                               | Evidência nesta sessão                        | Inspeção manual              |
| -------------------------------------------------- | --------------------------------------------- | ---------------------------- |
| Teclado, foco, ordem e skip link                   | E2E aprovado em todas as rotas                | Pendente                     |
| Zoom e responsividade                              | E2E de texto a 200% e 320/768/1280px aprovado | Pendente                     |
| Headings, landmarks, alternativas e nomes de links | axe aprovado; revisão estrutural do código    | Pendente no navegador/leitor |
| Leitor de tela real                                | Não executado                                 | Pendente                     |
| Preview/canário e links externos                   | URL desta versão não fornecida                | Pendente                     |

A ferramenta de inspeção de UI não disponibilizou navegador nem aplicativo nesta sessão. Testes
automatizados e revisão de código não foram registrados como inspeção humana. A URL do preview e
eventual resultado de leitor de tela foram solicitados ao proprietário. T055 continua aberta;
nenhum deploy, commit, push ou promoção foi executado.

## Entregues

- Runtime Node.js 24, Next.js 16.3.1, React 19, ESLint flat config e CI com Dependabot.
- Rotas públicas estáticas de home, projetos, detalhe, Sobre, currículo e ambos os estados 404.
- Validação de conteúdo em build para tipos, campos obrigatórios, enums (`status`, `natureza`,
  `categoria`), slugs, URLs HTTPS, e-mail, imagens publicadas, evidências de competência e limite de
  seis destaques.
- Cobertura Vitest de validação e componentes; cobertura Playwright de fluxos, links globais,
  metadados, responsividade, teclado e axe-core em todas as rotas públicas.
- Metadados próprios para os dois estados 404.
- Auditoria de documentação (2026-08-15): `CLAUDE.md`, `README.md`, `docs/PROJECT.md` e
  `docs/DEVELOPMENT_PLAN.md` alinhados à stack real (Next.js 16, React 19, Node 24) e aos scripts
  existentes (`typecheck`, `format:check`, `test:e2e:functional`, `test:e2e:a11y`); as skills
  `verify-changed` e `a11y-check` corrigidas — `next lint` não existe mais no Next.js 16 (trocado
  por `npx eslint <arquivos>`) e a verificação de a11y passou a usar `npm run test:e2e:a11y`, que
  inclui `accessibility.a11y.spec.ts` (única cobertura de `/projetos`, `/sobre` e `/curriculo`).
- Removido `tests/e2e/placeholder.spec.ts`, resíduo de scaffold sem asserção real.
- `linkGithub` e `linkLinkedin` de `content/profile.json` substituídos pelos valores reais.

## Validação executada em 2026-08-15

- `node --version` → `v24.19.0`
- `npm ci` → concluído
- `npm audit --omit=dev --audit-level=high` → 0 vulnerabilidades
- `npm exec prettier -- --check .` → concluído
- `npm run lint` → concluído
- `npm run typecheck` → concluído
- `npm test -- --run` → 37 testes aprovados
- `npm run build` → Turbopack concluído; rotas estáticas e SSG geradas
- `npm run test:e2e:functional` → 33 testes Playwright aprovados
- `npm run test:e2e:a11y` → 15 testes Playwright aprovados

## Separação entre fichas e roadmap (2026-08-31; reconciliada em 2026-09-01)

Origem: `/impeccable critique` encontrou que o gate de FR-024/SC-007 em
`lib/content.ts` contava projetos **não implementados** como evidência de
competência. Consequência medida: 18 das 18 competências do perfil não tinham
lastro em software existente, e as que a plataforma real demonstra sequer
estavam declaradas. O gate constitucional "evidências acima de afirmações"
estava invertido — aceitava conteúdo ficcional como prova.

Correção aplicada, aprovada pelo proprietário: `validateCompetenciasComEvidencia`
passa a considerar somente projetos com `real: true`.

Os quatro registros de escopo planejado saíram de `/projetos` e passaram a uma
superfície própria, `/roadmap`, sem página de detalhe (`/projetos/<slug>` desses
slugs retorna 404). Em 2026-09-01, `spec.md`, `plan.md`, `tasks.md`, modelo de
dados, contrato, quickstart e checklists foram atualizados para registrar essa
decisão. A divergência documental está encerrada; somente projetos `real: true`
contam como evidência, destaque ou ficha pública.

## Hardening de acessibilidade e integridade factual (2026-08-31)

Origem: bloqueios apontados pelo `pre-commit-guard`. Entregue nesta rodada, com
verificação registrada abaixo:

- **Suíte E2E destravada.** Os testes de `curriculo.spec.ts` e `sobre.spec.ts`
  fixavam strings do perfil e exigiam um link `mailto:` que a interface suprime
  de propósito enquanto `contato.valor` for placeholder. Passaram a ler
  `content/profile.json` em tempo de execução e a ramificar pelo estado real —
  sem endereço fabricado e sem afrouxar o requisito de contato (FR-017). O
  rodapé oferece "Contato pelo LinkedIn" (destino verificável) e a página de
  currículo declara "Contato em configuração", explícito e não interativo.
- **Semântica de lista preservada.** Toda `<ul>` sob `list-style: none` recebeu
  `role="list"` (`app/page.tsx`, `app/curriculo/page.tsx`,
  `app/projetos/[slug]/page.tsx`, `components/project/ProjectCard.tsx`): o
  Safari/VoiceOver descarta a semântica quando o marcador some.
- **Imagem de projeto decorativa.** `ProjectImage` publica com `alt=""` e perdeu
  a prop `title`, que só servia para duplicar o texto adjacente; o estado de
  falha saiu da árvore de acessibilidade. Nenhuma regra axe foi silenciada.
- **Glifos fora do nome acessível.** Os sete `::before` decorativos de
  `app/globals.css` passaram à forma `content: "X" / ""`, mantendo a marca
  visível — exigida por DESIGN.md para estado sem cor — e fora do nome
  acessível. `forced-colors.a11y.spec.ts` passou a verificar as duas partes.
- **Contradições factuais resolvidas.** As quatro fichas sem software foram
  reescritas em linguagem de intenção e vivem em `/roadmap`; `PRODUCT.md` e
  `DESIGN.md` foram alinhados. `plataforma-portfolio` é a única implementação
  real e verificável.
- **Rodada visual (2 rodadas, desktop 1280px e mobile 390px).** Dois defeitos
  encontrados e corrigidos: a ficha de índice em `/projetos/<slug>` esticava até
  os 1280px do container e sua linha de índice interna superava o `<h1>` da
  página (teto `width: min(100%, 34rem)`); e o "Resumo" do currículo imprimia
  `descricaoPosicionamento` e `biografiaSobre` como paráfrases um do outro —
  a biografia passou a descrever o método, que a síntese não cobre.
- **Princípios do Sobre alinhados à evidência.** "Backend como profundidade" e
  "Cloud e DevOps como diferenciais" anunciavam como diferencial o que o perfil
  não sustenta — backend segue registrado como escopo planejado em `/roadmap`.
  Passaram a descrever o método verificável no repositório. O teste de Sobre
  verifica a estrutura da seção, não as frases.
- **Artefatos locais do Impeccable fora do escopo versionável.** `.gitignore`
  passou a cobrir `config.local.json`, cache do hook, PIDs, portas, logs e
  sessões de pergunta. Nenhum arquivo foi removido.

## Validação executada em 2026-08-31

- `npm run typecheck` → sem erros
- `npx eslint` nos arquivos TS/TSX alterados → 0 erros (aviso apenas para
  `app/globals.css`, que o flat config não cobre)
- `npx vitest run tests/unit/` → 6 arquivos, 37 testes aprovados
- `npm run test:e2e:a11y` → 17 testes Playwright aprovados
- `npx playwright test` → 48 testes Playwright aprovados
- `npm run build` → compilado com sucesso; validação de conteúdo sem erros
- `npx prettier --check .` → conforme
- `git diff --check` → limpo

## Remediação Impeccable P1–P3 (2026-09-01)

- **P1 — contrato reconciliado.** Os artefatos Speckit e o sistema visual agora
  registram o posicionamento factual "Desenvolvedor Web em Formação", a ordem
  real das competências, o destino `/roadmap` na navegação e a separação entre
  implementação e intenção. Nenhum requisito P0 foi removido ou afrouxado.
- **P2 — mobile, imagem e tema.** O card único passa a uma coluna real em 320px,
  suas ações empilham em largura integral e a ficha mantém a proporção 5:3 sem
  recorte. As cinco imagens SVG respondem ao tema escuro dentro do próprio
  recurso, sem tentar herdar tokens CSS da página.
- **P2 — cobertura de acessibilidade.** A suíte percorre todos os controles de
  todas as rotas públicas por Tab, verifica foco visível e ausência de armadilha,
  testa zoom de texto a 200% e inclui `/roadmap` no axe. Leitor de tela real e
  preview/canário continuam como inspeções humanas de publicação.
- **P3 — lint focado no produto.** Bundles locais copiados de skills em
  `.agents/`, `.claude/`, `.github/skills/` e `.opencode/skills/` foram excluídos
  do lint. Regras e arquivos da aplicação não receberam supressão.
- **Rodada visual única.** Home clara e detalhe escuro foram inspecionados em
  1280px e 320px. CTA mobile, proporção da ficha, hierarquia, foco visual e
  paleta escura permaneceram coerentes com `DESIGN.md`; nenhuma segunda rodada
  de correção foi necessária.

## Validação executada em 2026-09-01

- `npx impeccable detect app/globals.css tests/e2e/accessibility.a11y.spec.ts tests/e2e/responsive.spec.ts` → sem achados
- `npm run format:check` → conforme
- `npm run lint` → 0 erros e 0 avisos
- `npm run typecheck` → sem erros
- `npx vitest run tests/unit/` → 6 arquivos, 38 testes aprovados
- `npm run build` → Turbopack concluído; `/roadmap` estática e uma ficha SSG geradas
- `npm run test:e2e:functional` → 35 testes Playwright aprovados
- `npm run test:e2e:a11y` → 19 testes Playwright aprovados
- `git diff --check` → limpo
- Pareceres especializados → spec green; acessibilidade aprovada; duas ressalvas
  baixas de integridade documental corrigidas; auditoria constitucional aprovada após
  SC-008 passar a derivar todos os slugs do roadmap

## Currículo P0 — 2026-09-04

- `/curriculo` usa `Jefferson Nunes` como `<h1>` e organiza perfil profissional,
  formação, trajetória técnica, competências e contato em uma hierarquia própria de
  currículo.
- `content/profile.json` ganhou `formacao` e `trajetoria`, ambas obrigatórias e
  validadas como listas de marcos com `periodo`, `titulo` e `descricao`. Os períodos
  publicados cobrem apenas a evolução comprovável desta plataforma desde agosto de
  2026; nenhuma instituição de ensino ou experiência profissional foi inferida.
- O cabeçalho global substituiu a marca decorativa pela assinatura `Jefferson Nunes`,
  vinculada ao início e visível acima da dobra em todas as rotas. Em 320px, ela ocupa
  uma faixa de 44px e a navegação usa toda a largura sem quebrar rótulos.
- A mensagem obsoleta de que o e-mail estaria em configuração foi removida da home;
  `/curriculo` descreve os destinos reais de contato conforme o estado do perfil.

### Validação executada em 2026-09-04

- `node .agents/skills/impeccable/scripts/detect.mjs app/curriculo/page.tsx app/globals.css components/layout/Header.tsx` → sem achados
- `npm run format:check` → conforme
- `npm run lint` → 0 erros e 0 avisos
- `npm run typecheck` → sem erros
- `npx vitest run tests/unit/` → 6 arquivos, 41 testes aprovados
- `npm run build` → Turbopack concluído; `/curriculo` pré-renderizada
- `npm run test:e2e:functional` → 39 testes Playwright aprovados
- `npm run test:e2e:a11y` → 19 testes Playwright aprovados
- Revisão visual → `/curriculo` em 1280px e 320px; cabeçalho confirmado em 320px após
  corrigir a quebra do rótulo “Projetos”
- `git diff --check` → limpo

## Otimização de carregamento — 2026-09-05

- A navegação global deixou de antecipar a rota que já está aberta, e o rodapé
  não repete o trabalho do cabeçalho. Os demais destinos mantêm o prefetch do
  Next.js: em ensaio local sob rede limitada, retirar essa antecipação excedeu
  o limiar de 200 ms adotado para a medição.
- Zilla Slab passou de três pesos para 600 e 700. Dados catalográficos e leads
  compartilham o peso 600, eliminando um arquivo WOFF2 sem mudar a família ou a
  hierarquia tipográfica do fichário.
- A regressão automatizada em `tests/e2e/loading-performance.spec.ts` limita a
  primeira visita a quatro fontes e 100 KiB de payload tipográfico, verifica que
  o rodapé não dispara prefetch duplicado, cobre a rota atual na home e em uma
  rota interna e comprova navegação cliente sem recarregar o documento.
- As varreduras responsiva e de acessibilidade existentes cobrem as rotas
  públicas após a mudança tipográfica; medições exploratórias sem artefato
  versionado não são tratadas como gate nem como fonte de verdade.
- Gates executados antes da conclusão de T089: Prettier, TypeScript, ESLint,
  43 testes unitários, build de produção, 42 testes E2E funcionais e 19 testes
  E2E de acessibilidade. Depois do reforço da regressão de carregamento, seus
  dois casos direcionados também passaram; a suíte funcional completa foi
  repetida antes do commit.

## Pendências e riscos conhecidos

- `plataforma-portfolio` não tem `linkDemonstracao`. O catálogo Nana Silva agora é a segunda
  implementação, com endereço público de validação. Para a própria plataforma, o
  repositório está público em `https://github.com/jeffnunespy/portfolio-web`, verificado sem
  autenticação em 2026-09-04; a ficha agora oferece acesso direto ao código. Publicar a URL de
  produção permanece como a próxima evidência externa de maior efeito no valor da peça.
- Perfil e estudo de caso confirmados pelo proprietário em 2026-10-23; PDF definitivo gerado e
  consistente. As pendências anteriores de identidade, e-mail e currículo foram encerradas.
- T006/T063 estão superadas: o asset-fonte removido era intermediário sem uso no build; não há
  bloqueio de publicação por esse arquivo ausente.
- T055 continua como o bloqueio de publicação: inspeção humana de teclado/foco/zoom, leitor de
  tela real, links e preview/canário não concluídos. CI remoto não foi executado nesta sessão.
- `npm ci` reportou 10 alertas ao incluir dependências de desenvolvimento (2 moderados e 8 altos).
  A auditoria de produção após T090 retorna zero; a modernização do ferramental de desenvolvimento
  não foi ampliada nesta entrega.
- `npm ci` emite avisos de peer dependency porque plugins transitivos do `eslint-config-next` ainda
  declaram suporte até ESLint 9; o lint em ESLint 10.8.1 passa. Também houve aviso de script
  pendente de `unrs-resolver`; nenhuma permissão de scripts foi ampliada, e os gates passaram.

## Próximos passos

1. Executar e registrar as inspeções humanas de T055, incluindo leitor de tela real.
2. Validar esta versão em preview/canário e confirmar o CI no commit candidato antes da promoção.
