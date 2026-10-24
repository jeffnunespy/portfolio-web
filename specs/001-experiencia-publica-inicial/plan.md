# Implementation Plan: Experiência Pública Inicial — Convergência de Stack e Publicação

**Branch**: `001-experiencia-publica-inicial` | **Date**: 2026-08-15 | **Spec**: [spec.md](./spec.md)

**Input**: Planejar a migração do Next.js 14 após `npm audit --omit=dev` encontrar 1
vulnerabilidade crítica e 2 altas; remediação registrada em [tasks.md](./tasks.md) (T043).
Escopo ampliado em 2026-08-15 pelas recomendações de convergência de stack
([recomendacoes-stack-portfolio.md](../../recomendacoes-stack-portfolio.md)), que acrescentam
higiene de repositório, CI, fortalecimento da validação de conteúdo, atualização do Vitest e
fechamento de conteúdo/currículo antes da publicação.

Emenda aprovada em 2026-09-01: o contrato público agora registra explicitamente a separação entre
projetos implementados (`/projetos`) e escopo planejado (`/roadmap`), além das remediações P1–P3 da
auditoria Impeccable. Os bloqueios P0 de conteúdo confirmado e currículo definitivo permanecem.

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

### Atualização de conteúdo — Nana Silva (2026-10-23)

O proprietário solicitou incluir o catálogo Nana Silva como implementação real e forneceu
`https://nana-silva-validacao.pages.dev/`. O relatório técnico de 2026-10-22 é a fonte para
funcionalidades, arquitetura e limitações; o endereço principal respondeu com HTTP 200 e seu HTML
identifica a artista e o catálogo. A publicação é apresentada como ambiente de validação, com
status "Em andamento", sem inferir lançamento comercial ou aprovação dos portões pendentes.

A premissa inicial de uma única implementação deixa de descrever o acervo atual. Isso é evolução
dos dados prevista em FR-004/FR-004a, sem alterar requisitos, schema ou componentes. Adicionar o JSON
e um índice SVG ilustrativo, ajustar a frase exclusiva do perfil e sincronizar seu PDF. Adaptar as
verificações que pressupõem ficha única para conferir posições, vizinhos e ordem de foco no acervo;
incluir o novo detalhe nas verificações de metadados, responsividade e acessibilidade. O proprietário
confirmou desenvolvimento completo e natureza profissional. O endereço principal fornecido é a
evidência pública; a consulta de metadados do repositório confirmou visibilidade privada, representada
por `linkRepositorio: "privado"`, sem divulgar seu endereço no estudo de caso.

### Visual oficial — Minimalismo escuro (2026-10-23)

O proprietário aprovou o HTML final **sem prévia de Nana Silva** como novo visual oficial.
Esta decisão substitui a direção Levantamento e sondagem para a próxima migração visual,
preservando stack e dados e formalizando a exceção de apresentação já autorizada em FR-006a.
Os demais requisitos funcionais permanecem vigentes. Registro em
[`direcao-minimalista-escura.md`](../../docs/referencias-visuais/direcao-minimalista-escura.md).
`DESIGN.md` passa a registrar o sistema aprovado, já construído no protótipo; as rotas Next.js
continuam na implementação anterior até a fase 17 de `tasks.md`.

## Summary

Levar a experiência pública já implementada da stack atual (Next.js 14.2.18, React 18.3, Node 20,
ESLint 8, Vitest 2) até um estado publicável, sem redesenhar a arquitetura. O núcleo da entrega é a
migração para Next.js 16.3.1 + React 19.2 + Node.js 24 LTS + ESLint 10 em flat config, eliminando a
cadeia vulnerável `next@14.2.18 -> postcss@8.4.31 -> nanoid@3.3.17`, preservando a experiência
pública e formalizando a separação aprovada entre fichas implementadas e roadmap. Em torno dela, a convergência adiciona os mecanismos de qualidade ainda ausentes:
pipeline de CI com gates executáveis, validação de conteúdo mais robusta, atualização do Vitest,
cobertura de acessibilidade/responsividade/metadados e substituição do conteúdo placeholder pelo
conteúdo real, incluindo o currículo definitivo. O critério de segurança é zero vulnerabilidades de
produção críticas ou altas, com todas as verificações funcionais, de acessibilidade e de geração
estática aprovadas.

O que permanece deliberadamente fora: banco de dados, CMS, API própria, autenticação, analytics,
Docker/Kubernetes em produção e qualquer framework alternativo ao Next.js. A arquitetura
`Git -> content/*.json -> validação -> build -> páginas estáticas` é preservada.

## Technical Context

**Language/Version**: TypeScript 5.9.x; Node.js 24 LTS como ambiente reproduzível (mínimo técnico
do Next.js 16: Node.js 20.9.0)

**Primary Dependencies**: Next.js 16.3.1 (App Router, SSG, Turbopack), React/ReactDOM 19.2.x,
ESLint 10.x, `eslint-config-next` 16.3.1

**Storage**: Nenhum banco de dados nesta fase; dados de projeto e perfil como arquivos estruturados (JSON) versionados no repositório

**Testing**: Vitest 2 -> 4.x (unitário/componentes) após o framework estabilizar, mantendo Testing
Library 16, Playwright 1.62 (E2E) e axe-core 4.12 (acessibilidade); adicionar verificação explícita
de tipos e auditoria de dependências ao gate

**CI/CD**: GitHub Actions com `npm ci` e gates de lint, typecheck, unitários, build, E2E e
acessibilidade; Dependabot para manutenção contínua de dependências

**Target Platform**: Web público; Chrome/Edge/Firefox 111+, Safari 16.4+; responsivo
(320px–1280px+)

**Project Type**: Aplicação web frontend única (sem backend/API nesta feature)

**Performance Goals**: Preservar todas as rotas pré-renderizadas/estáticas e não introduzir
carregamento perceptível; o build Turbopack não pode alterar o comportamento previsto por FR-028

**Deployment Model**: Next.js hospedado normalmente na Vercel com páginas pré-renderizadas em build
time (SSG). **Não** é usado `output: "export"` — decisão registrada em [research.md](./research.md).

**Constraints**: Nenhuma mudança de rota ou contrato sem registro na especificação; `/roadmap` é a
separação aprovada para escopo planejado, que nunca conta como evidência. A substituição de conteúdo
placeholder por conteúdo real continua permitida e exigida (P0 pendente), desde que os campos obrigatórios
e as evidências de competência continuem válidos; não usar `npm audit fix --force`; revisar a saída
de codemods; preservar alterações existentes do usuário; sem novas dependências de runtime além das
exigidas pelo framework; nenhuma tecnologia adicionada sem problema real que a justifique

**Scale/Scope**: Um aplicativo Next.js, 5 rotas públicas navegáveis (`/`, `/projetos`, `/roadmap`,
`/sobre`, `/curriculo`), uma página estática de projeto implementado e estados 404 genérico/de projeto;
uma rota dinâmica (`/projetos/[slug]`) exige adaptação de `params`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Princípio                                     | Avaliação                                                                                                                                                                         | Status            |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| I. Evidências acima de afirmações             | Competências só podem apontar para projetos implementados; itens de roadmap nunca contam como evidência; conteúdo P0 segue bloqueado até confirmação                              | PASS              |
| II. Entregas verticais e incrementais         | Cada prioridade (P0–P3) é uma fatia completa com código, testes, documentação e validação; PRs 1–8 evitam um lote único                                                           | PASS              |
| III. Simplicidade proporcional                | Atualiza apenas a cadeia necessária; nenhum banco, CMS, backend ou infraestrutura é adicionado; schema runtime fica condicionado a critério explícito                             | PASS              |
| IV. Backend como área de profundidade         | Sem mudança de domínio; o foco técnico é a segurança e a qualidade verificável da camada de aplicação web                                                                         | PASS (com nota)   |
| V. Qualidade verificável                      | Audit, formato, lint, tipos, unitários, build, E2E e acessibilidade tornam-se gates executados por CI, não apenas locais                                                          | PASS (reforçado)  |
| VI. Segurança e privacidade desde o início    | O plano elimina 1 vulnerabilidade crítica e 2 altas e adiciona manutenção contínua de dependências; publicação fica bloqueada enquanto o gate falhar                              | PASS (remediação) |
| VII. Acessibilidade e experiência consistente | O contrato exige regressão zero em teclado, axe e responsividade, com verificação manual complementar registrada                                                                  | PASS              |
| VIII. Documentação como parte da entrega      | Plano, pesquisa, contrato e quickstart registram versões, riscos e validação; `docs/ACTIVE_CONTEXT.md` volta a refletir o estado real antes de qualquer trabalho assistido por IA | PASS              |
| IX. Operação responsável                      | Preview/canário e redeploy do artefato anterior compõem a estratégia de rollback; CI garante build reproduzível                                                                   | PASS              |
| X. Uso responsável de IA                      | Codemods e alterações geradas devem ter diff revisado e testes executados; documentação desatualizada é tratada como risco operacional                                            | PASS              |

Nenhuma violação identificada. Complexity Tracking não se aplica.

**Re-check pós Phase 1 (design)**: o modelo de conteúdo permanece inalterado em estrutura — a Fase 8
apenas fortalece as regras de validação já existentes e substitui valores placeholder. O contrato de
compatibilidade torna audit, SSG, rotas, metadados, 404, currículo, acessibilidade e ausência de
erros de hidratação condições observáveis, e o pipeline de CI transforma cada gate em verificação
executável. Nenhuma violação foi introduzida. Gate permanece PASS.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (arquivos afetados pela convergência)

```text
.nvmrc                               # Node.js 24 LTS declarado (novo)
package.json                         # Versões, engines e scripts lint/typecheck/format
package-lock.json                    # Cadeia resolvida e auditável
eslint.config.mjs                    # Flat config do ESLint para Next.js 16 (substitui .eslintrc.json)
.github/
├── workflows/ci.yml                 # Gates: npm ci, lint, typecheck, unit, build, E2E, axe (novo)
└── dependabot.yml                   # Atualizações automáticas de dependências (novo)
app/
├── layout.tsx                       # Decisão explícita sobre scroll em navegação SPA
├── roadmap/page.tsx                 # Escopo planejado, separado das fichas implementadas
└── projetos/[slug]/page.tsx         # params assíncrono em página e metadados
components/layout/
├── Header.tsx                       # Tipos JSX compatíveis com React 19
└── Footer.tsx                       # Tipos JSX compatíveis com React 19
lib/content.ts                       # Validação fortalecida e discriminação real/planejado
content/
├── profile.json                     # Conteúdo real substituindo placeholders (P3)
└── projects/*.json                  # Contexto, status, decisões, limitações e links reais (P3)
assets/                              # Assets fonte versionados (origem das versões otimizadas)
public/curriculo.pdf                 # Currículo definitivo (P3)
public/images/projects/*.svg         # Fichas 5:3 com paleta responsiva ao tema
tests/                               # Regressão unitária, componentes, E2E, axe e responsividade
docs/
├── ACTIVE_CONTEXT.md                # Estado real das fases antes de novo trabalho assistido por IA
└── DEVELOPMENT_PLAN.md              # Fases concluídas e Fase 8 registrada
specs/001-experiencia-publica-inicial/
├── research.md                      # Decisões e alternativas da convergência
├── data-model.md                    # Modelo de conteúdo e regras de validação
├── contracts/next16-compatibility.md # Contrato público e gates
└── quickstart.md                    # Validação e rollback
```

**Structure Decision**: Migração in-place, sem criar aplicação paralela e sem modificar a estrutura
do modelo de conteúdo. A configuração ESLint passa a usar o formato flat recomendado pelo Next.js
16; o build final usa Turbopack, mantendo `next build --webpack` somente como diagnóstico temporário.
`components/ui/` **não** é criado nesta fase: a divisão atual `components/{layout,project}` é
coerente e a pasta só se justifica quando existirem primitives realmente reutilizáveis
(Button, Badge, Card, Container). A validação de conteúdo permanece manual em `lib/content.ts`; uma
biblioteca de schema runtime só entra se o arquivo passar a acumular regras a ponto de virar um
mini-framework de validação — critério registrado em [research.md](./research.md).

## Convergence Design

### Emenda vigente — Minimalismo escuro (2026-10-23)

Referência oficial: `docs/referencias-visuais/prototipo-minimalista-escuro.html`, na versão
sem captura de Nana Silva. Tokens e componentes em `DESIGN.md`; composição da home no documento
adjacente e no brief da superfície. O registro desta decisão é a tarefa T101; T102–T105
continuam pendentes. Nenhuma implementação ou publicação é declarada por esta emenda.

- **Arquitetura e dados:** preservar Next.js 16, React 19, TypeScript, CSS puro, geração
  estática, metadados, `lib/content.ts`, JSONs e validação de evidências. Nenhuma dependência,
  coleta de dados ou alteração de schema é necessária. Consultar os guias locais do Next.js
  antes de implementar.
- **Identidade:** tema escuro, marfim, laranja discreto, Geologica leve, assinatura “Nunes.” e
  composição aberta por texto, espaço e filetes. Servir Geologica localmente pelo mecanismo
  `next/font` já adotado. A URL Google Fonts do protótipo não é requisito da aplicação.
  Martian Mono, isolinhas, terreno, lente, varredura e paralaxe deixam de orientar o novo visual.
- **Conteúdo:** derivar todas as seções e comprovações dos dados reais. Manter Nana Silva em
  validação, com repositório privado, apresentação textual e seus limites. Acervo e Intervalo
  não entram em `content/` ou em evidências. O esquema da plataforma é semântico e ilustrativo,
  sem sugerir execução de CI ao vivo.
- **Adaptações do protótipo ao contrato vigente:** a navegação por âncoras do HTML não remove
  as rotas existentes. A home precisa conservar posicionamento e competências por área na
  primeira dobra em 1280px (FR-001–FR-003/SC-001), e somente projetos reais podem ser destacados.
  Preservar `/roadmap`, campos completos dos estudos de caso e currículo HTML/PDF. A retirada
  da prévia é a exceção de exibição de FR-006a para Nana Silva; não remove imagens obrigatórias
  do schema, arquivos públicos ou metadados. A exigência de exibição de FR-006 continua para
  os demais projetos. T103 deve verificar a ausência da prévia de Nana e a presença do seu
  campo/arquivo/metadados, além dos campos e ações preservados.
- **Interações e acessibilidade:** preservar os destinos e a informação útil dos controles
  existentes, reorganizando a comprovação técnica para a nova composição. Usar divulgações
  nativas quando houver conteúdo expansível. Foco, salto, ordem de teclado, contraste AA,
  `role="list"` em listas sem marcador, movimento reduzido e cores forçadas permanecem gates.
- **Validação por fatia:** T102 cobre moldura/home e seus fluxos; T103 cobre catálogo/fichas;
  T104 cobre demais rotas e estados. Cada uma inclui testes funcionais/a11y e documentação.
  T105 repete formato, lint, tipos, unitários, build e E2E funcional/a11y, confere o orçamento
  tipográfico existente e inspeciona desktop/celular. Alterar expectativas visuais somente
  quando substituídas por verificações equivalentes da nova direção, sem afrouxar os contratos.

**Limite operacional:** a aprovação do visual não autoriza deploy. T055 continua aberta até
as inspeções humanas/de preview serem efetivamente concluídas.

### Histórico — emenda Levantamento e sondagem (2026-10-23)

Esta emenda documenta a migração entregue na fase 15. Foi substituída como direção normativa
pela emenda vigente acima; seus resultados e tarefas concluídas permanecem no histórico.

Direção aprovada pelo proprietário em 2026-10-23, na versão sem lente e com o movimento das curvas:
[candidato-levantamento-sondagem.md](../../docs/referencias-visuais/candidato-levantamento-sondagem.md)
e o protótipo `docs/referencias-visuais/prototipo-levantamento-sondagem.html`. A migração substitui
a gramática de ficha catalográfica em todas as rotas públicas sem alterar requisitos funcionais,
modelo de conteúdo, validação de build, rotas ou metadados.

- **Arquitetura**: mesma stack (Next.js 16, React 19, TypeScript, CSS puro em `app/globals.css`).
  Geologica (variável) e Martian Mono 400 entram por `next/font/google` e são servidas pelo próprio
  site. Nenhuma dependência nova.
- **Terreno**: desenho decorativo (`aria-hidden`) em componente cliente da home: três `<svg>`
  empilhados (isolinhas finas, intermediárias e mestras), cada um com um único `<path>`, gerados no
  navegador por função determinística, em fatias curtas e com cache entre navegações. São três
  elementos porque a paralaxe desloca cada camada em profundidade distinta; o `transform` vai no
  `<svg>` da camada, sem duplicar coordenadas. Gerar no servidor levaria centenas de KB de
  coordenadas ilustrativas ao HTML e ao payload RSC, sem valor para leitor de tela ou indexação. A
  paralaxe responde só a mouse com ponteiro fino, agrupada por `requestAnimationFrame`;
  `prefers-reduced-motion` desliga varredura, paralaxe e animações por rolagem.
- **Ver comprovação**: botão de divulgação com `aria-expanded` e `aria-controls` revela o painel
  textual “O que sustenta a superfície”, com contagens derivadas de `content/` por `lib/content.ts`.
  O protótipo usava `aria-pressed` com rótulo alternado; o APG pede rótulo fixo para botões de
  alternância, e o rótulo alternado é próprio do padrão de divulgação.
- **Divergências registradas antes da implementação**:
  1. A composição aprovada (item 6) lista os projetos planejados na home; FR-004, FR-004b e SC-008
     determinam que itens não implementados apareçam somente em `/roadmap`. Prevalece a spec: a home
     mostra a área tracejada “Terreno ainda não levantado” com a contagem e o link para o roadmap,
     sem listar itens; o tratamento tracejado e hachurado vale para as entradas de `/roadmap`.
  2. O estudo de caso expansível da home (item 5) já existe como a rota `/projetos/<slug>`; a home
     leva a ele pela ação da ficha em vez de duplicar o conteúdo em `<details>`.
  3. O orçamento tipográfico de `tests/e2e/loading-performance.spec.ts` passa de quatro para dois
     arquivos woff2, mantido o teto de 100 KiB.
  4. O rótulo do protótipo, “Ver estrutura”, passa a “Ver comprovação”/“Ocultar comprovação”
     (decisão do proprietário em 2026-10-23, T099). Ao lado da legenda e da leitura do mapa,
     “estrutura” lia como camada do desenho; “comprovação” nomeia o que o painel entrega e repete o
     termo do registro de campo. Título do painel, `id="estrutura"` e comportamento permanecem.
  4. O site passa a ter um único esquema noturno (`color-scheme: dark`). As fichas SVG de
     `public/images/projects/` são redesenhadas nessa paleta, e a regressão de cor da ficha verifica
     o fundo noturno nos dois esquemas do sistema.
  5. Testes que fixavam a composição anterior mudam apenas onde a estrutura mudou, com força
     equivalente; nenhuma verificação de acessibilidade, teclado, responsividade ou conteúdo sai.

### Emenda de auditoria Impeccable — 2026-09-01

A remediação P1–P3 formaliza `/projetos` como catálogo exclusivo de implementações reais e
`/roadmap` como superfície prospectiva; alinha posicionamento, competências e navegação a essa
distinção. O layout mobile empilha as ações dos cards em largura integral, as fichas SVG preservam
a proporção nativa 5:3 e acompanham o tema do sistema, e a regressão cobre a sequência completa de
teclado, zoom de texto a 200%, responsividade e cores dos SVGs. O lint ignora apenas cópias locais
de bundles de skills, que não são código da aplicação. Nenhuma dessas mudanças resolve ou reduz os
bloqueios P0 de identidade, contato, currículo e conteúdo profissional ainda não confirmados.

A convergência é organizada em quatro prioridades. Cada uma é entregue como um PR próprio, evitando
misturar runtime, qualidade e conteúdo em um único diff — o que preserva diagnóstico e rollback
independentes.

| Prioridade | Objetivo                     | PRs | Bloqueia publicação? |
| ---------- | ---------------------------- | --- | -------------------- |
| P0         | Contexto, higiene e migração | 1–2 | Sim                  |
| P1         | Qualidade e segurança        | 4–6 | Sim                  |
| P2         | Modernização e cobertura     | 3   | Não                  |
| P3         | Conteúdo e publicação        | 7–8 | Sim                  |

### P0 — Contexto, higiene e migração de runtime/framework

#### Etapa 0 — Baseline e contenção

1. Não publicar o artefato atual enquanto houver vulnerabilidade crítica/alta conhecida.
2. Atualizar `docs/ACTIVE_CONTEXT.md` e `docs/DEVELOPMENT_PLAN.md` **antes** de qualquer trabalho
   significativo assistido por IA. Hoje `ACTIVE_CONTEXT.md` declara "Fase 1 (Setup) concluída"
   enquanto o código já entregou as Fases 2–7 — contexto incorreto produz plano incorreto e
   retrabalho. Registrar: fase atual, fases concluídas, tarefas pendentes, decisões recentes, branch,
   próximos passos, estado dos testes, estado do build, pendências de dependências e riscos
   conhecidos.
3. Revisar `.gitignore` e artefatos versionados. Verificação já executada: `playwright-report/`,
   `test-results/`, `*.tsbuildinfo`, `.next/`, `out/`, `coverage/` e `*.log` estão cobertos e nenhum
   artefato indevido está rastreado. A pendência real é a regra `.env*`, que hoje ignora tudo —
   ajustar para preservar `.env.example` como exceção deliberada.
4. Tratar `original-8696facb39b0641248efdeb31bc641db.webp` (hoje solto na raiz, não versionado) como
   **asset fonte**: mover para `assets/` com nome descritivo e versionar como origem para regenerar
   as versões otimizadas em `public/`. Não remover automaticamente.
5. Registrar resultados de `npm ci`, audit, formatação, lint, tipos, testes, build e E2E antes da
   troca, preservando todas as mudanças existentes no worktree.
6. Confirmar Node.js 24 LTS no desenvolvimento e no ambiente de build/deploy, declarando a versão em
   `.nvmrc`, `package.json` -> `engines`, GitHub Actions, configuração da Vercel e documentação, de
   modo que ambiente local = CI = Vercel = documentação.

#### Etapa 1 — Dependências e codemods

1. Executar o codemod oficial para `16.3.1` e revisar integralmente o diff antes de aceitar mudanças.
2. Alinhar `next` e `eslint-config-next` em 16.3.1; React/ReactDOM em 19.2.x e respectivos tipos;
   ESLint na linha 10.x; manter Vitest/Vite/Playwright fora deste upgrade.
3. Regenerar o lockfile por instalação normal, sem `npm audit fix --force`, e confirmar nele
   `postcss >= 8.5.23` e `nanoid >= 3.3.18`.

#### Etapa 2 — Compatibilidade manual

1. Tornar `params` uma `Promise<{ slug: string }>` e aguardar o valor em `generateMetadata` e na
   página `/projetos/[slug]`.
2. Substituir `next lint` por `eslint .` e migrar `.eslintrc.json`/`.eslintignore` para
   `eslint.config.mjs`, preservando Core Web Vitals, TypeScript, Prettier e ignores atuais.
3. Remover dependência do namespace JSX global nos componentes afetados, preferindo inferência do
   retorno.
4. Decidir e testar o comportamento de `scroll-behavior: smooth`; adicionar
   `data-scroll-behavior="smooth"` ao `<html>` apenas se necessário para preservar o retorno
   instantâneo ao topo nas transições.

### P1 — Qualidade e segurança

#### Etapa 3 — Auditoria de dependências e supply chain

1. Executar a auditoria e avaliar cada ocorrência individualmente. Não usar
   `npm audit fix --force` indiscriminadamente nem suprimir advisory.
2. Manter `package-lock.json` versionado e padronizar `npm ci` como instalação de validação.
3. Habilitar Dependabot (`.github/dependabot.yml`) com PRs automáticos, revisando atualizações major
   separadamente das demais. Objetivo: impedir que o projeto volte a ficar anos atrás das versões
   suportadas.

#### Etapa 4 — Integração contínua

1. Criar `.github/workflows/ci.yml` disparado por push e pull request, fixando Node.js 24 LTS.
2. Encadear os gates na ordem: `npm ci` -> lint, typecheck e unitários (paralelizáveis) -> build ->
   E2E -> acessibilidade. Uma falha em qualquer etapa reprova o PR.
3. Adicionar os scripts que hoje faltam em `package.json` (`typecheck`, verificação de formatação) e
   substituir `next lint` por `eslint .`, conforme a Etapa 2.

#### Etapa 5 — Fortalecimento da validação de conteúdo

`lib/content.ts` hoje valida presença de campos obrigatórios, mínimo de 2 decisões e evidência de
competências. A convergência amplia a cobertura para:

- tipos esperados de cada campo (e não apenas ausência/vazio);
- formato de URLs (demonstração, repositório, currículo, GitHub, LinkedIn) e de `mailto:`;
- formato e unicidade de slug entre projetos;
- pertencimento de `status` ao conjunto fechado ("Em andamento", "Concluído", "Pausado", "Arquivado");
- valores válidos de categoria e natureza (autoral/acadêmico/colaborativo/profissional);
- referências de competência apontando para projeto existente;
- presença da imagem de apresentação referenciada;
- coerência dos links opcionais (ausente vs. privado vs. URL);
- teto de 6 projetos em destaque.

Cada regra ganha teste unitário cobrindo o caso inválido. A validação permanece manual enquanto os
schemas forem poucos e pequenos; se o arquivo passar a acumular blocos repetitivos de
`if (!...) / if (typeof ...) / throw`, avaliar a adoção de uma biblioteca de schema runtime como
decisão registrada — não como reflexo.

#### Etapa 6 — Acessibilidade completa

1. `SkipLink` já implementado em `app/layout.tsx` com estilo em `app/globals.css` — verificar
   comportamento com teclado, não reimplementar.
2. Completar os E2E de teclado: alcance de todos os elementos interativos, foco visível, sequência de
   foco em ordem visual estrita e ausência de `tabindex` positivo.
3. Manter a varredura axe-core em todas as rotas públicas.
4. Executar as verificações manuais que o axe não cobre: fluxo completo somente por teclado, foco
   visível, semântica de headings, links compreensíveis fora de contexto, textos alternativos, zoom
   e navegação com leitor de tela. Registrar o resultado.

### P2 — Modernização e cobertura

#### Etapa 7 — Vitest e testes de componentes

1. Atualizar Vitest 2.x -> 4.x **somente após** framework e runtime estarem estáveis, para não
   sobrepor diagnósticos. Manter Testing Library, Playwright e axe-core.
2. Adicionar testes de componentes onde há comportamento relevante: estados condicionais, badges de
   status, comportamento de links (incluindo repositório privado) e elementos de navegação. Evitar
   testes acoplados a detalhes de implementação.
3. Distribuição alvo: unitários (Vitest) na base, componentes (Testing Library) no meio, E2E
   (Playwright) com peso relativamente alto — coerente com requisitos de interface, navegação,
   responsividade, acessibilidade e metadados.

#### Etapa 8 — Responsividade e metadados

1. Validar 320px, 768px e 1280px sem rolagem horizontal, sobreposição ou texto cortado.
2. Validar título e descrição meta próprios por rota, derivados do conteúdo (FR-029).

### P3 — Conteúdo e publicação

#### Etapa 9 — Conteúdo real

1. Substituir placeholders em `content/profile.json` por conteúdo real, incluindo nome,
   formação datada e trajetória técnica exibidos no currículo HTML.
2. Revisar cada projeto garantindo contexto, status, decisões, limitações, próximos passos e links
   reais. Nenhum projeto incompleto pode ser apresentado como concluído, nenhum repositório privado
   como acessível, nenhuma tecnologia não utilizada como competência comprovada e nenhum dado
   fictício como real.
3. Gerar o currículo definitivo em `public/curriculo.pdf`, consistente com o conteúdo do site.

#### Etapa 10 — Gates e entrega

1. Executar os comandos de [quickstart.md](./quickstart.md) em Node.js 24 LTS.
2. Aceitar somente build Turbopack sem erro, páginas esperadas pré-renderizadas e auditoria sem
   vulnerabilidades críticas/altas de produção. Usar Webpack apenas para diagnosticar eventual
   diferença do bundler.
3. Executar o checklist final completo: lint, typecheck, unitários, build, E2E, acessibilidade,
   metadados, responsividade, links, currículo, conteúdo e deploy.
4. Publicar primeiro em preview/canário; validar o contrato de
   [contracts/next16-compatibility.md](./contracts/next16-compatibility.md).
5. Promover o mesmo artefato aprovado. Em regressão, retirar o canário e redeployar o artefato
   anterior; a reversão de código inclui manifest, lockfile, configuração ESLint e adaptações de API.

## Estratégia de branches e PRs

Nenhuma dessas mudanças deve ser misturada em um commit ou PR único.

| PR  | Escopo                                                             | Prioridade |
| --- | ------------------------------------------------------------------ | ---------- |
| 1   | Documentação de estado + `.gitignore` + asset fonte                | P0         |
| 2   | Node 24, Next 16, React 19, TypeScript 5.9, ESLint flat config     | P0         |
| 3   | Dependências de teste (Vitest 4, Testing Library, Playwright, axe) | P2         |
| 4   | GitHub Actions + Dependabot                                        | P1         |
| 5   | Validação de `lib/content.ts` e testes correspondentes             | P1         |
| 6   | Acessibilidade: teclado E2E, foco, axe, verificação manual         | P1         |
| 7   | Conteúdo final: profile, projetos, currículo, assets               | P3         |
| 8   | Convergência: testes completos, build, deploy, revisão final       | P3         |

A numeração segue a ordem sugerida no documento de recomendações; a ordem de execução respeita as
prioridades (P0 -> P1 -> P2 -> P3), com o PR 3 podendo ser intercalado assim que o PR 2 estabilizar.

## Riscos conhecidos

**Revalidação de segurança — 2026-10-23**: o baseline instalado `next@16.3.4`,
`sharp@0.35.4` e `source-map-js@1.2.1` passou a apresentar uma vulnerabilidade crítica e duas
altas. T090 atualiza somente esses pacotes e a configuração Next correspondente dentro das faixas
existentes no manifesto (alvo da resolução: Next/config 16.4.2, Sharp 0.35.5, source-map-js 1.2.2).
Esta manutenção preserva Node.js 24, React 19, SSG, os requisitos públicos e a arquitetura; as
versões 16.3.1 citadas acima registram o alvo histórico da migração inicial. O novo lockfile deve
passar por `npm ci`, auditoria e todos os gates antes de ser aceito.

| Risco                                                                   | Mitigação                                                                          |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Duas majors de uma vez (Next 14 -> 16) escondendo a origem de uma falha | Codemod oficial com diff revisado; PR isolado; `--webpack` apenas como diagnóstico |
| React 19 quebrando tipos em componentes existentes                      | Remover dependência do namespace JSX global; typecheck como gate                   |
| Vitest 4 e migração de framework colidindo no diagnóstico               | Vitest fica em PR separado, executado só após o framework estabilizar              |
| Documentação defasada induzindo agentes a planos incorretos             | `ACTIVE_CONTEXT.md` atualizado como primeira tarefa, antes de qualquer código      |
| Validação de conteúdo crescendo até virar mini-framework                | Critério explícito para migrar a schema runtime, registrado em `research.md`       |
| Conteúdo placeholder chegando à publicação                              | Checklist final bloqueia deploy; validação de build reprova campos obrigatórios    |

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Não aplicável: o desenho não introduz violação constitucional.
