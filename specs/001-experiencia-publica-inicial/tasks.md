---
description: "Task list for Experiência Pública Inicial do Portfólio"
---

# Tasks: Experiência Pública Inicial do Portfólio — Convergência e Publicação

**Input**: Artefatos de design em `/specs/001-experiencia-publica-inicial/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/next16-compatibility.md` e `quickstart.md`

**Tests**: Incluídos. A constituição exige cobertura automatizada das regras de conteúdo e dos fluxos críticos; o plano define Vitest, Testing Library, Playwright e axe-core.

**Organization**: As tarefas preservam a aplicação existente e são agrupadas por user story. Setup e Foundation tratam a migração que bloqueia toda a experiência pública.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode ser feita em paralelo, pois usa arquivo distinto e não depende de tarefa incompleta.
- **[Story]**: Mapeia a tarefa à user story correspondente (`US1`–`US4`).
- Cada tarefa informa o caminho exato do arquivo a alterar ou validar.

Marcadores de estado: `[ ]` pendente, `[X]` concluída e validada, `[~]` superada por decisão
posterior — mantida no registro com a justificativa, em vez de removida ou marcada como concluída.

## Path Conventions

Aplicação Next.js única: `app/`, `components/`, `content/`, `lib/`, `tests/`, `.github/` e `docs/` na raiz do repositório.

---

## Phase 1: Setup (Contexto e ambiente compartilhado)

**Purpose**: Registrar o estado real e tornar o ambiente Node.js 24 reproduzível antes da convergência.

- [X] T001 Atualizar fase atual, decisões, riscos, próximos passos e resultados de validação em `docs/ACTIVE_CONTEXT.md`
- [X] T002 Atualizar o registro da Fase 8 e das entregas incrementais em `docs/DEVELOPMENT_PLAN.md`
- [X] T003 [P] Declarar Node.js 24 LTS em `.nvmrc`
- [X] T004 [P] Declarar engine Node.js 24 e scripts `lint`, `typecheck` e `format:check` em `package.json`
- [X] T005 [P] Ajustar a exceção para `.env.example` e confirmar as regras de artefatos em `.gitignore`
- [~] T006 [P] ~~Mover e nomear o asset-fonte de projeto em `assets/portfolio-source.webp`~~ — **não aplicável**: o asset-fonte (`original-8696facb…webp`) foi removido do versionamento no commit `3926229` por ser intermediário não utilizado no build. Não há arquivo a mover e `assets/` não existe. Reabrir apenas se um asset-fonte voltar a ser necessário para regenerar imagens otimizadas.

**Checkpoint**: Documentação, runtime e higiene do repositório refletem o estado operável pretendido sem descartar mudanças existentes.

---

## Phase 2: Foundational (Migração e gates bloqueantes)

**Purpose**: Remover a cadeia vulnerável, adaptar incompatibilidades do Next.js 16/React 19 e configurar gates que bloqueiam todas as user stories.

**⚠️ CRITICAL**: Nenhuma validação de story deve ser aceita antes de esta fase concluir.

- [X] T007 Atualizar Next.js, React, ReactDOM, tipos React, ESLint e `eslint-config-next` para as versões definidas em `package.json`
- [X] T008 Regenerar a resolução auditável compatível com T007 em `package-lock.json`
- [X] T009 Substituir configurações legadas por flat config com Core Web Vitals, TypeScript, Prettier e ignores existentes em `eslint.config.mjs`
- [X] T010 Remover a configuração ESLint legada substituída em `.eslintrc.json`
- [X] T011 Adaptar parâmetros assíncronos de página e metadados para Next.js 16 em `app/projetos/[slug]/page.tsx`
- [X] T012 Adaptar os tipos de retorno incompatíveis com React 19 em `components/layout/Header.tsx`
- [X] T013 Adaptar os tipos de retorno incompatíveis com React 19 em `components/layout/Footer.tsx`
- [X] T014 Verificar e preservar o comportamento de rolagem nas transições de rota em `app/layout.tsx`
- [X] T015 Criar workflow de CI com `npm ci`, lint/typecheck/unitários, build, E2E e acessibilidade em `.github/workflows/ci.yml`
- [X] T016 [P] Configurar atualizações automáticas de dependências em `.github/dependabot.yml`
- [X] T017 Registrar runtime, gates, diagnóstico Webpack e rollback em `specs/001-experiencia-publica-inicial/quickstart.md`

**Checkpoint**: A aplicação compila com Turbopack em Node.js 24, e o CI reproduz os gates obrigatórios sem `continue-on-error`.

---

## Phase 3: User Story 1 — Avaliar o posicionamento profissional na página inicial (Priority: P1) 🎯 MVP

**Goal**: Manter a página inicial estática, acessível e responsiva após a atualização de stack, com posicionamento, competências e projetos em destaque verificáveis.

**Independent Test**: Em `/`, a 1280px, título, descrição e competências aparecem na primeira dobra; em 320px/768px/1280px não há overflow, sobreposição nem texto cortado, e a navegação por teclado alcança todos os controles na ordem visual.

### Tests for User Story 1

- [X] T018 [US1] Cobrir primeira dobra, ordem de competências e limite de destaques em `tests/e2e/home.spec.ts`
- [X] T019 [US1] Cobrir todos os controles interativos, foco visível e ativação por teclado em `tests/e2e/home.spec.ts`
- [X] T020 [P] [US1] Executar axe-core e corrigir violações da rota inicial em `tests/e2e/home.a11y.spec.ts`
- [X] T021 [P] [US1] Cobrir overflow, sobreposição e corte de texto em 320px, 768px e 1280px em `tests/e2e/responsive.spec.ts`

### Implementation for User Story 1

- [X] T022 [US1] Preservar a renderização estática e a ordem DOM de profundidade antes das competências complementares em `app/page.tsx`
- [X] T023 [US1] Exibir todos os campos obrigatórios do card e estados de imagem sem erro técnico em `components/project/ProjectCard.tsx`
- [X] T024 [US1] Preservar contraste, foco visível e layout responsivo da página inicial em `app/globals.css`

**Checkpoint**: US1 continua funcional e testável apenas pela rota `/` depois da convergência.

---

## Phase 4: User Story 2 — Consultar detalhes de um projeto específico (Priority: P1)

**Goal**: Garantir que estudos de caso, listagem, estados de link e 404 permaneçam estáticos, acessíveis e corretos no Next.js 16.

**Independent Test**: Acesso direto a `/projetos/<slug>` mostra todas as seções do caso implementado e links corretos; `/projetos/slug-inexistente` apresenta alternativa amigável; a listagem contém todos os projetos implementados e `/roadmap` mantém o escopo planejado sem ficha própria.

### Tests for User Story 2

- [X] T025 [US2] Cobrir acesso direto, link a partir da home e seções obrigatórias do estudo de caso em `tests/e2e/project-detail.spec.ts`
- [X] T026 [US2] Cobrir repositório público, ausência de demonstração e CTA `mailto:` para código privado em `tests/e2e/project-detail.spec.ts`
- [X] T027 [P] [US2] Cobrir rota de projeto inexistente e ação alternativa na listagem em `tests/e2e/project-not-found.spec.ts`
- [X] T028 [P] [US2] Executar axe-core nas rotas de detalhe e corrigir violações em `tests/e2e/project-detail.a11y.spec.ts`
- [X] T029 [P] [US2] Cobrir título e descrição próprios do detalhe e dos estados 404 em `tests/e2e/metadata.spec.ts`

### Implementation for User Story 2

- [X] T030 [US2] Gerar parâmetros estáticos, páginas e metadados por slug no formato assíncrono do Next.js 16 em `app/projetos/[slug]/page.tsx`
- [X] T031 [US2] Oferecer mensagem simples e link alternativo para projeto não encontrado em `app/projetos/[slug]/not-found.tsx`
- [X] T032 [US2] Garantir listagem de todos os projetos implementados em `app/projetos/page.tsx`
- [X] T033 [US2] Unificar links de demonstração, repositório público e código privado com CTA de contato em `components/project/EvidenceLink.tsx`
- [X] T034 [US2] Validar status fechado e sua apresentação consistente em `components/project/ProjectStatusBadge.tsx`

**Checkpoint**: US2 é navegável diretamente, não expõe links inválidos e não falha com erro técnico para slug inexistente.

---

## Phase 5: User Story 3 — Encontrar currículo, código-fonte e contato (Priority: P2)

**Goal**: Manter currículo, redes e contato acessíveis em toda página pública, sem coleta de dados e com metadados próprios.

**Independent Test**: Em home, listagem, detalhe, Sobre, currículo e 404, cabeçalho/rodapé expõem os links exigidos; `/curriculo` permite visualizar e baixar o PDF.

### Tests for User Story 3

- [X] T035 [US3] Cobrir links globais de currículo, GitHub, LinkedIn e `mailto:` em todas as rotas públicas em `tests/e2e/curriculo.spec.ts`
- [X] T036 [US3] Cobrir visualização e download do currículo em `tests/e2e/curriculo.spec.ts`
- [X] T037 [P] [US3] Cobrir metadados exclusivos da página de currículo em `tests/e2e/metadata.spec.ts`

### Implementation for User Story 3

- [X] T038 [US3] Preservar currículo visualizável, download e metadados próprios em `app/curriculo/page.tsx`
- [X] T039 [US3] Garantir navegação para currículo na ordem definida em `components/layout/Header.tsx`
- [X] T040 [US3] Garantir currículo, redes, contato `mailto:` e titularidade no rodapé em `components/layout/Footer.tsx`
- [X] T041 [US3] Substituir o arquivo de currículo por versão confirmada e consistente em `public/curriculo.pdf`

**Checkpoint**: US3 é verificável sem backend, formulário, cookies de rastreamento ou armazenamento de dados de visitantes.

---

## Phase 6: User Story 4 — Conhecer o proprietário na página Sobre (Priority: P2)

**Goal**: Manter uma apresentação profissional consistente e acessível após a atualização, sem afirmações não comprovadas.

**Independent Test**: A rota `/sobre` amplia o posicionamento da home, preserva navegação global e publica metadados específicos.

### Tests for User Story 4

- [X] T042 [US4] Cobrir conteúdo, navegação e consistência com o posicionamento da home em `tests/e2e/sobre.spec.ts`
- [X] T043 [P] [US4] Cobrir metadados próprios da página Sobre em `tests/e2e/metadata.spec.ts`

### Implementation for User Story 4

- [X] T044 [US4] Preservar apresentação consistente e metadados derivados do perfil em `app/sobre/page.tsx`
- [X] T045 [US4] Substituir somente conteúdo profissional confirmado e com evidência associável em `content/profile.json`

**Checkpoint**: US4 não contradiz a home nem introduz experiência, métricas ou competências sem evidência.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Reforçar a integridade de conteúdo, concluir cobertura de componentes, validar publicação e registrar o resultado.

- [X] T046 Fortalecer tipos, strings/arrays, URLs, `mailto:`, slugs únicos, enums, imagens, links opcionais e teto de destaques em `lib/content.ts`
- [X] T047 Cobrir cada regra inválida da validação de conteúdo em `tests/unit/content.test.ts`
- [X] T048 Atualizar Vitest para 4.x depois de a migração do framework estar estável em `package.json`
- [X] T049 Atualizar a resolução do Vitest 4 e dependências de teste em `package-lock.json`
- [X] T050 [P] Cobrir comportamentos condicionais e links dos cards em `tests/unit/ProjectCard.test.tsx`
- [X] T051 [P] Cobrir navegação e links globais em `tests/unit/HeaderFooter.test.tsx`
- [X] T052 Revisar cada estudo de caso com contexto, decisões, limitações, próximos passos, links e evidências confirmadas em `content/projects/*.json`
- [X] T053 Verificar a existência das imagens publicadas referenciadas pelo conteúdo em `public/images/projects/`
- [X] T054 Executar formatação, lint, tipos, unitários, build Turbopack, E2E e auditoria de produção conforme `specs/001-experiencia-publica-inicial/quickstart.md`
- [ ] T055 Registrar a inspeção manual de teclado, foco, headings, zoom, leitor de tela, links e preview/canário em `docs/ACTIVE_CONTEXT.md`

**Checkpoint**: O commit candidato atende ao contrato de compatibilidade, não possui vulnerabilidades críticas/altas de produção e está pronto para validação em preview antes de promoção.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências; T001–T002 devem preceder alterações relevantes.
- **Foundational (Phase 2)**: depende de Setup; T007–T015 bloqueiam a aceitação de todas as stories.
- **US1 e US2 (P1)**: começam após Foundation; são o MVP e podem avançar em paralelo se a alteração compartilhada de `app/globals.css` for coordenada.
- **US3 e US4 (P2)**: começam após Foundation; dependem de `content/profile.json` válido e podem avançar em paralelo.
- **Polish (Phase 7)**: T046–T047 antecedem a validação final T054; T048–T049 antecedem os testes unitários finais; T052 e T041 dependem de conteúdo e currículo confirmados pelo proprietário.
- **Convergence (Phases 8–10)**: registra o hardening já entregue; T056 permanece bloqueante para publicação e independente da remediação visual.
- **Remediação Impeccable (Phase 11)**: T081 registra o contrato; T082–T085 podem avançar em paralelo depois dele; T086 depende da conclusão e validação de T081–T085.

### User Story Dependencies

- **US1 (P1)**: independente após Foundation.
- **US2 (P1)**: independente após Foundation; reutiliza dados validados por `lib/content.ts` e deve manter os links da US3 como comportamento global.
- **US3 (P2)**: independente após Foundation; requer valores reais e confirmados em `content/profile.json` e `public/curriculo.pdf`.
- **US4 (P2)**: independente após Foundation; requer `content/profile.json` validado e não depende de US1.

### Parallel Opportunities

- T003–T006 podem ser distribuídas em paralelo.
- T012, T013, T016 e T017 podem avançar em paralelo depois de T007–T008.
- Após Foundation, os grupos de teste por story marcados `[P]` podem ocorrer em paralelo quando não alterarem o mesmo arquivo.
- T021, T028, T029, T037, T043, T050 e T051 usam arquivos distintos e podem ser paralelizadas conforme seus pré-requisitos.

---

## Parallel Example: User Story 2

```text
Task: "Cobrir rota de projeto inexistente e ação alternativa em tests/e2e/project-not-found.spec.ts"
Task: "Executar axe-core nas rotas de detalhe em tests/e2e/project-detail.a11y.spec.ts"
Task: "Cobrir metadados de detalhe e 404 em tests/e2e/metadata.spec.ts"
Task: "Unificar links e CTA de código privado em components/project/EvidenceLink.tsx"
Task: "Validar status fechado em components/project/ProjectStatusBadge.tsx"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Concluir Setup e Foundation, incluindo a atualização de runtime e os gates de CI.
2. Concluir US1 e US2, preservando home, listagem, detalhes e 404 no Next.js 16.
3. Executar os testes de cada story e `npm run build`.
4. Validar o MVP em preview antes de acrescentar conteúdo final, currículo e stories P2.

### Incremental Delivery

1. Setup + Foundation → ambiente seguro e reproduzível.
2. US1 + US2 → avaliação profissional e estudos de caso (MVP).
3. US3 → conversão para currículo, redes e contato.
4. US4 → contexto profissional aprofundado.
5. Polish → validação de conteúdo, modernização de testes e promoção após preview/canário.

## Notes

- Não inventar conteúdo, evidências, métricas, links ou currículo: T041, T045 e T052 exigem dados confirmados pelo proprietário.
- O build deve falhar para conteúdo inválido; não introduzir estado de rascunho, banco de dados, analytics, autenticação ou backend nesta feature.
- Antes de promoção, T054 e T055 devem registrar tanto os gates automatizados quanto as inspeções manuais exigidas pelo contrato.

---

## Phase 8: Convergence

- [X] T056 CRITICAL Substituir placeholders, URLs de exemplo e currículo por conteúdo profissional confirmado com evidência verificável em `content/profile.json` e `public/curriculo.pdf` per Constituição I/X e plan: P3 (contradicts)
- [X] T057 Fortalecer a validação de tipos, URLs, `mailto:`, enums, slugs, imagens, links e teto de destaques em `lib/content.ts` per FR-011a, FR-024 e contrato de conteúdo
- [X] T058 Cobrir todas as regras inválidas da validação de conteúdo em `tests/unit/content.test.ts` per FR-011a, FR-024 e Constitution V
- [X] T059 Expandir teclado, foco e axe-core para listagem, Sobre, currículo e ambos os estados 404 em `tests/e2e/accessibility.a11y.spec.ts` per FR-021, FR-022 e SC-005
- [X] T060 Definir e testar título e descrição próprios para 404 genérico e 404 de projeto em `app/not-found.tsx`, `app/projetos/[slug]/not-found.tsx` e `tests/e2e/metadata.spec.ts` per FR-029
- [X] T061 Cobrir links globais em todas as rotas públicas e responsividade sem sobreposição ou texto cortado em `tests/e2e/curriculo.spec.ts` e `tests/e2e/responsive.spec.ts` per SC-003 e SC-006
- [X] T062 Criar testes Testing Library para card, cabeçalho e rodapé em `tests/unit/ProjectCard.test.tsx` e `tests/unit/HeaderFooter.test.tsx` per plan: testes de componentes e Constitution V
- [~] T063 Mover o asset-fonte para `assets/portfolio-source.webp` e registrar estado, validações e riscos atuais em `docs/ACTIVE_CONTEXT.md` per plan: assets fonte e Constituição VIII (missing) — **parcialmente superada**: a segunda parte (estado, validações e riscos em `docs/ACTIVE_CONTEXT.md`) está cumprida; a movimentação do asset-fonte é não aplicável pelo mesmo motivo de T006.

---

## Phase 9: Convergence

- [X] T064 HIGH Adicionar `npm audit --omit=dev --audit-level=high` como gate obrigatório após `npm ci` em `.github/workflows/ci.yml` per plan: P1 / Constituição VI (partial)
- [X] T065 HIGH Separar os scripts/etapas de E2E funcional e axe-core e executá-los nessa ordem no CI em `.github/workflows/ci.yml`, `package.json` e `tests/e2e/` per contrato de CI / plan: Etapa 4 (partial)
- [X] T066 Definir e aplicar, com testes, o conjunto fechado permitido para `categoria` em `specs/001-experiencia-publica-inicial/data-model.md`, `lib/content.ts` e `tests/unit/content.test.ts` per plan: Etapa 5 / data-model: categoria (partial)
- [X] T067 [US2] Fechar o fim de `/projetos/[slug]` com rodapé de ficha, acesso à listagem, navegação anterior/próxima determinística, CTA para currículo e cobertura unitária/E2E/a11y/responsiva per FR-013b
- [X] T068 [US1] [US2] [US3] [US4] Reforçar cores forçadas e alto contraste com tokens de sistema, foco, links e estados não dependentes de cor em `app/globals.css`, `tests/e2e/forced-colors.a11y.spec.ts` e `DESIGN.md` per FR-021, FR-022 e Constituição VII

---

## Phase 10: Hardening de acessibilidade e integridade factual

Entregue e verificado nesta rodada (typecheck, eslint dos arquivos alterados,
`vitest run tests/unit/` e `npm run build` executados; ver `docs/ACTIVE_CONTEXT.md`
para os resultados exatos e para o que permanece falhando).

- [X] T069 [US1] [US2] [US3] [US4] Preservar a semântica de lista onde `list-style: none` a remove no Safari/VoiceOver, com `role="list"` explícito em `app/page.tsx`, `app/curriculo/page.tsx`, `app/projetos/[slug]/page.tsx` e `components/project/ProjectCard.tsx` per FR-022 e Constituição VII
- [X] T070 [US1] [US2] Publicar a ficha de índice do projeto como imagem decorativa (`alt=""`) em `components/project/ProjectImage.tsx`, com cobertura em `tests/unit/ProjectImage.test.tsx` e `tests/unit/ProjectCard.test.tsx`, em vez de repetir o título já anunciado pelo cartão per FR-022 e Constituição VII
- [X] T071 [US1] [US2] Manter os glifos decorativos de badge, `.tag` e listas de campo fora do nome acessível com `content: "X" / ""` em `app/globals.css`, verificado em `tests/e2e/forced-colors.a11y.spec.ts` per FR-021, FR-022 e Constituição VII
- [X] T072 [US3] [US4] Desacoplar os testes E2E das cópias literais de `content/profile.json`, lendo o perfil real em `tests/e2e/curriculo.spec.ts`, `tests/e2e/sobre.spec.ts`, `tests/e2e/home.spec.ts` e `tests/e2e/metadata.spec.ts` per Constituição V
- [X] T073 Redigir as quatro fichas não implementadas (`hayyanu`, `sistema-helpdesk`, `gerenciamento-filas`, `transcricao-audio`) em linguagem de escopo planejado, retirando afirmações de experiência concluída em `status`, `natureza`, `contexto` e `responsabilidadeProprietario` per Constituição I/X
- [X] T074 Alinhar `PRODUCT.md` e `DESIGN.md` ao estado real do conteúdo: `plataforma-portfolio` registrada como implementação verificável, as outras quatro como estrutura planejada, e as decisões de a11y desta fase documentadas per Constituição VIII
- [X] T075 Manter o estado local do Impeccable (`config.local.json`, cache do hook, PIDs, portas, logs e sessões de pergunta) fora do escopo versionável em `.gitignore`, sem remover arquivo algum per Constituição VI
- [X] T076 Remover do perfil a competência "Django", declarada sem projeto que a referencie em `competenciasDemonstradas` e ainda classificada na área "Front-end". Decisão do proprietário nesta sessão: remover em vez de fabricar evidência. `npm run build` volta a passar o gate FR-024 per FR-024, SC-007 e Constituição I/X
- [X] T077 Consolidar a arquitetura de `/roadmap` em `app/roadmap/page.tsx`, navegação global e filtros de conteúdo; alinhar `tests/e2e/project-detail.spec.ts` e `tests/e2e/project-detail.a11y.spec.ts` para navegar a `plataforma-portfolio`, verificar 404 dos slugs planejados e cobrir o roadmap sem link de detalhe, demonstração ou repositório per FR-004b, FR-013b e Constituição V
- [X] T078 [US2] Limitar a ficha de índice em `/projetos/<slug>` à medida em que foi desenhada (`width: min(100%, 34rem)` em `app/globals.css`): sem teto ela esticava pelos 1280px do container e sua linha de índice interna superava o `<h1>` da página per Constituição VIII
- [X] T079 [US3] Eliminar a redundância do "Resumo" do currículo, onde `descricaoPosicionamento` e `biografiaSobre` eram paráfrases um do outro: a biografia passou a descrever o método de trabalho, verificável neste repositório, que a síntese não cobre per FR-016 e Constituição I
- [X] T080 [US4] Alinhar os três princípios de `app/sobre/page.tsx` ao que o perfil sustenta: "Backend como profundidade" e "Cloud e DevOps como diferenciais" anunciavam como diferencial o que segue registrado como escopo planejado em `/roadmap`. `tests/e2e/sobre.spec.ts` passou a verificar a estrutura da seção, não as frases per Constituição I/X

---

## Phase 11: Remediação Impeccable P1–P3

Escopo aprovado em 2026-09-01: resolver os achados P1, P2 e P3 da auditoria visual
sem alterar os bloqueios factuais P0.

- [X] T081 Alinhar `spec.md`, `plan.md`, `tasks.md`, checklist, `DESIGN.md` e `docs/ACTIVE_CONTEXT.md` à separação entre projeto implementado e roadmap per Constituição I/VIII/X
- [X] T082 [US1] [US2] Empilhar as ações dos cards em 320px e preservar a proporção nativa 5:3 das fichas SVG sem recorte em `app/globals.css` e `tests/e2e/responsive.spec.ts` per FR-020, SC-006 e craft floor
- [X] T083 [US1] [US2] Adaptar as cinco fichas SVG ao tema escuro no próprio recurso e cobrir a paleta renderizada em `tests/e2e/responsive.spec.ts` per FR-022 e `DESIGN.md`
- [X] T084 [US1] [US2] [US3] [US4] Cobrir ordem completa de tabulação, foco visível e zoom de texto a 200% em todas as rotas públicas, mantendo leitor de tela e preview/canário como inspeções manuais pendentes per FR-021, FR-022, SC-005 e SC-006
- [X] T085 Restringir o lint ao código do produto, ignorando bundles locais copiados de skills em `eslint.config.mjs`, sem suprimir regras ou arquivos da aplicação per Constituição V/VI
- [X] T086 Executar detector Impeccable, diff check, formato, lint, tipos, unitários, build, E2E funcional/a11y e revisão visual; registrar resultados e pareceres especializados antes de concluir a fase
- [X] T087 [US2] Substituir os chips de stack do roadmap por uma pauta editorial de tecnologias previstas e agrupar a HAYYANU em aplicação e nove serviços GCP, preservando os 19 itens sem reutilizar o vocabulário visual de entrega, com regressão E2E e responsiva per FR-004b, Constituição I/VII/X e `DESIGN.md`

---

## Phase 12: Currículo P0

- [X] T088 [US3] Usar o nome como `<h1>` de `/curriculo`, publicar formação e trajetória técnica datadas a partir de fatos verificáveis e exibir a assinatura do proprietário acima da dobra em todas as rotas e larguras suportadas per FR-005a, FR-015a e Constituição I/VII/X

---

## Phase 13: Otimização de carregamento

- [X] T089 [US1] [US2] [US3] [US4] Reduzir requisições especulativas e payload tipográfico da primeira visita, preservando navegação cliente, identidade do fichário e métricas de acessibilidade, com medição antes/depois em mobile e desktop per FR-028 e Constituição IV/VII

---

## Phase 14: Revalidação de segurança e fechamento de conteúdo

Auditoria de 2026-10-23 identificou novas vulnerabilidades de produção após os gates históricos.
O perfil atual e o estudo de caso da plataforma foram confirmados pelo proprietário nesta sessão;
T041/T052/T056 mantêm seus critérios originais, e T055 permanece dependente de inspeção real com
leitor de tela e preview/canário.

- [X] T090 Remediar as vulnerabilidades de produção em Next.js, Sharp e source-map-js com atualização direcionada de `package-lock.json` dentro das faixas já declaradas em `package.json`, mantendo a configuração Next alinhada, e reexecutar instalação limpa, auditoria, formato, lint, tipos, unitários, build Turbopack e E2E funcional/a11y per Constituição V/VI e contrato de segurança
- [X] T091 Corrigir a divergência preexistente entre os rótulos compactos visíveis e os nomes acessíveis da navegação em `components/layout/Header.tsx`, com regressão mobile/desktop em `tests/e2e/accessibility.a11y.spec.ts`, preservando a ordem, os rótulos visuais e o layout per FR-021/FR-022 e WCAG 2.5.3

**Resultado de 2026-10-23**: T041/T052/T056/T090/T091 concluídas após confirmação do conteúdo, revisão
de integridade e gates verdes. T055 permanece aberta: cobertura automatizada e revisão semântica
não substituem inspeção humana, leitor de tela real e preview/canário. Detalhes em
`docs/ACTIVE_CONTEXT.md`. T006/T063 seguem superadas, sem arquivo a recuperar.

---

## Phase 15: Migração visual — Levantamento e sondagem

**Histórico:** esta fase foi entregue. A direção oficial passou a Minimalismo escuro;
a nova migração está registrada separadamente na fase 17.

Direção aprovada pelo proprietário em 2026-10-23 (versão sem lente, com movimento das curvas),
registrada em `docs/referencias-visuais/candidato-levantamento-sondagem.md`. Divergências com a
composição aprovada e com a regressão existente estão na emenda de direção visual de `plan.md`.

- [X] T092 Alinhar `plan.md` e `tasks.md` à direção aprovada, registrando as divergências com FR-004/FR-004b/SC-008, o estudo de caso expansível, o orçamento tipográfico e o redesenho das fichas SVG antes de editar código per Constituição VIII
- [X] T093 [US1] [US2] [US3] [US4] Substituir tokens, tipografia (Geologica e Martian Mono via `next/font`), foco âmbar, seleção, barra de rolagem, forced-colors e movimento reduzido em `app/layout.tsx` e `app/globals.css` per FR-021/FR-022
- [X] T094 [US1] Implementar a abertura da home com terreno de isolinhas em três camadas SVG de um `<path>` cada, varredura inicial, paralaxe agrupada por `requestAnimationFrame`, legenda e botão “Ver estrutura” com painel textual derivado de `content/`, sem lente per FR-001, FR-024 e direção aprovada
- [X] T095 [US1] [US2] [US3] [US4] Reorganizar a home em estações (terreno levantado, competências comprovadas, terreno ainda não levantado) e estender a linguagem a `/projetos`, `/projetos/[slug]`, `/roadmap`, `/sobre`, `/curriculo`, 404 e erro, preservando conteúdo, ações e separação entre implementação e roadmap per FR-004/FR-004b/SC-008
- [X] T096 [US1] [US2] Redesenhar as fichas SVG de `public/images/projects/`, o ícone e a imagem de compartilhamento na paleta noturna, preservando a proporção 5:3 e os arquivos exigidos pela validação
- [X] T097 Ajustar a regressão afetada (orçamento tipográfico, cor da ficha) com força equivalente e cobrir “Ver estrutura”, Escape e movimento reduzido em E2E
- [X] T098 Executar formato, lint, tipos, unitários, build, E2E funcional/a11y e inspeção visual em 1280, 390 e 320 px; atualizar `DESIGN.md` com o sistema implementado e `docs/ACTIVE_CONTEXT.md`
- [X] T099 [US1] Renomear o botão de divulgação da abertura para “Ver comprovação”/“Ocultar comprovação”, registrando a divergência em `plan.md` antes do código, e atualizar o E2E, `DESIGN.md` e `docs/ACTIVE_CONTEXT.md`

---

## Phase 16: Conteúdo — catálogo Nana Silva

- [X] T100 [US1] [US2] Incluir o estudo de caso Nana Silva com conteúdo apoiado no relatório técnico de 2026-10-22 e créditos confirmados pelo proprietário, URL principal de validação, índice SVG ilustrativo, perfil/PDF coerentes e verificações de navegação entre fichas, metadados, responsividade e acessibilidade per FR-004/FR-004a/FR-006/FR-011a/FR-012 e Constituição I/V/VIII/X

**Resultado**: ficha estática `/projetos/nana-silva` gerada, dois projetos implementados no acervo,
44 unitários e 73 E2E aprovados; formato, lint e tipos sem falhas. Perfil/PDF sincronizados, revisão
de conteúdo e auditoria constitucional concluídas. Evidências e limites em `docs/ACTIVE_CONTEXT.md`.

---

## Phase 17: Visual oficial — Minimalismo escuro

Aprovação do proprietário em 2026-10-23: `docs/referencias-visuais/prototipo-minimalista-escuro.html`,
versão final sem prévia de Nana Silva. A emenda vigente de `plan.md` registra as adaptações
necessárias aos contratos de `spec.md`. Os exemplos fictícios do protótipo não são conteúdo da
aplicação. A aprovação não declara migração ou publicação como entregues.

- [X] T101 Registrar a aprovação oficial em `DESIGN.md`, sidecar, `PRODUCT.md`, `docs/ACTIVE_CONTEXT.md`, referência e spec/plan/tasks; preservar o sistema anterior como histórico e validar formato, links, consistência entre artefatos e conformidade constitucional antes de concluir esta tarefa documental
- [X] T102 [US1] [US3] Migrar a moldura global e a home para o visual oficial, preservando navegação por rotas, nome, posicionamento e competências na primeira dobra, comprovações reais, currículo e contatos; retirar a linguagem topográfica/efeitos da abertura sem perder informação requerida, servir Geologica localmente e validar a fatia com testes funcionais/a11y e inspeção responsiva per FR-001–FR-004, FR-015–FR-024 e SC-001/SC-005/SC-006; depende de T101
- [X] T103 [US2] Adaptar catálogo e fichas de projeto ao novo sistema, preservando dados, status/natureza, decisões, limites, links, navegação entre fichas, metadados e imagens exigidas pelo modelo; aplicar FR-006a verificando Nana Silva em validação, sem prévia na interface e com campo/arquivo/metadados de imagem preservados, mantendo a exibição exigida por FR-006 nos demais projetos; não copiar ficção do protótipo; validar fluxos, teclado, axe e responsividade dessa fatia per FR-004–FR-013b, FR-020–FR-024 e SC-002/SC-004/SC-006; depende de T102
- [X] T104 [US3] [US4] Aplicar o sistema a `/roadmap`, `/sobre`, `/curriculo` e estados 404/erro, preservando a separação do planejamento, trajetória/formação, PDF, ações de recuperação e metadados; validar cada rota com testes funcionais/a11y e inspeção em desktop/celular per FR-014–FR-022, FR-025, FR-029 e SC-003/SC-005/SC-006/SC-008; depende de T102
- [X] T105 Executar formato, lint, tipos, unitários, build, E2E funcional/a11y e orçamento de fontes; inspecionar todas as rotas em 1280, 768, 390 e 320px, confirmar contraste/foco/movimento reduzido, atualizar documentação com a implementação efetiva e concluir a revisão de regressões; registrar separadamente as inspeções ainda pendentes de T055, sem deploy automático; depende de T103 e T104

**Resultado de T101**: aprovação oficial registrada; YAML/JSON, sete cores do protótipo e sete
componentes do sidecar conferidos; 37 links locais em 11 documentos sem destinos ausentes;
Prettier, detector nativo e `git diff --check` aprovados. O hash do HTML sem comentários
permaneceu idêntico ao da versão aprovada. Revisões de spec e constituição encerraram o conflito
de exibição por meio de FR-006a. Na conclusão documental de T101, T102–T105 e T055
permaneciam pendentes; não havia migração das rotas nem publicação naquela etapa.

**Resultado de T102–T105 — 2026-10-24:** migração local de Minimalismo escuro concluída,
com os cinco achados do audit tratados. Tipos, lint, 45 unitários, build Turbopack e 75 E2E
passaram; confirmação de nove rotas em quatro larguras sem overflow, erros de página ou
violações axe mobile adicionais. Contraste inconclusivo: zero nos nove cenários mobile e
nos gates de rotas/detalhes abertos. SC-001 confirmado em 1280 × 720; zoom a 200% em
320/768/1280 e menu 44 × 44 verificados. Revisões de conteúdo, constituição, semântica e
código sem bloqueadores; evidências em `docs/audits/impeccable-2026-10-24-correcoes.md`.
T055 continua aberta. Não houve commit, push ou deploy.

---

## Phase 18: Comprovações com acesso direto

- [X] T106 [US1] Vincular as referências de conteúdo, validação, testes e workflow da home aos arquivos/diretórios públicos correspondentes em `jeffnunespy/portfolio-web`, preservando o aviso de que o diagrama/registro de CI não representa execução ao vivo; validar destinos, teclado, funcionamento sem JavaScript, axe com o painel aberto, lint, tipos e formato per FR-019, FR-021, FR-022, FR-024 e Constituição I/V/VII/VIII

**Resultado de T106 — 2026-10-24:** sete destinos confirmados pela API pública do GitHub na
branch padrão `master`. Tipos, ESLint dos três arquivos TypeScript alterados, Prettier dos
cinco arquivos da tarefa e `git diff --check` aprovados; 29 unitários de conteúdo/CI e
16 E2E de home/acessibilidade/metadados passaram, com build de produção. Links alcançáveis
por teclado e presentes sem JavaScript; axe sem violações com comprovação aberta e fechada.
Inspeção visual em 1280/390px e medições em 320/390/768/1280px, com texto a 100% e 200%,
sem overflow ou links cortados. Revisões de conteúdo e constituição sem bloqueadores.
T055 permanece independente deste ajuste; não houve commit, push ou deploy.

---

## Phase 19: Clareza do ambiente Nana Silva

- [X] T107 [US2] Repetir “Em validação” nos metadados da ficha direta de Nana Silva antes da demonstração, preservando “Em andamento”, os dados e a apresentação textual; validar a primeira tela em 390 × 844 e desktop, regressão funcional, axe, formato, lint e tipos per FR-006a/FR-011/FR-012/FR-013 e Constituição I/V/VII/VIII/X

**Resultado de T107 — 2026-10-24:** rótulo presente na classificação da ficha, antes da
demonstração e integralmente na primeira tela em 390 × 844 e 1280 × 720. Tipos, ESLint,
Prettier e `git diff --check` aprovados; 32 unitários de conteúdo/cartão e 22 E2E de
fichas/acessibilidade/404/metadados passaram, com build de produção. Inspeção visual da
ficha nas duas larguras, também com texto a 200%, sem overflow horizontal ou erros de
página; axe sem violações nas duas larguras. Revisões de conteúdo e constituição sem
bloqueadores. Status, links, dados e apresentação textual preservados, sem dependências
novas, commit, push ou deploy.

---

## Phase 20: Percurso curto na ficha de projeto

- [X] T108 [US2] Adicionar âncoras discretas Contexto, Minha responsabilidade, Decisões e Limitações após a apresentação inicial das fichas, com destinos focáveis e navegação nativa sem JavaScript; preservar todas as seções e validar teclado, alvos de 44px, refluxo mobile/desktop, axe, formato, lint e tipos per FR-012/FR-013/FR-021/FR-022 e Constituição III/V/VII/VIII

**Resultado de T108 — 2026-10-24:** quatro links nativos após a classificação e antes de
“Apresentação e fontes”, nas duas fichas. Em Nana, todos ficam na primeira tela em
390 × 844 px (y479–571), com alvos mínimos de 44 × 44px. Os saltos focam os títulos
correspondentes, preservando todas as seções, sua ordem e seus textos. Tipos, ESLint,
Prettier e `git diff --check` aprovados; 45 unitários e 88 E2E passaram, com build de
produção e cobertura de teclado, destinos e ausência de JavaScript. Inspeção visual em
390/1280px; medições em 320/390/768/1280px com texto a 100% e 200%, sem overflow ou
conteúdo cortado. Axe adicional em 390/1280px sem violações e nenhum erro de página;
detector de layout sem achados e revisão constitucional sem violações. A inspeção
avulsa precisou executar Chromium fora do sandbox após restrição de inicialização;
nenhuma alteração na aplicação foi necessária. O aviso preexistente de sidecar do
design desatualizado permanece sem reparo fora de escopo. T055 segue independente;
sem dependências novas, commit, push ou deploy.

---

## Phase 21: Medida de leitura

- [X] T109 [US1] [US2] Limitar a prosa extensa dos cartões e fichas de projeto, o apoio do catálogo, a nota de CI e a lista de próximos passos a `min(70ch, 36em)`, calibrando a Geologica para aproximadamente 65–75 caracteres por linha; preservar a composição aberta e as medidas existentes de resumos/introduções; validar desktop/celular, texto a 200%, regressões responsivas, axe, formato, lint e tipos per FR-020/FR-022, SC-006 e Constituição III/V/VII/VIII

**Resultado de T109 — 2026-10-24:** medida compartilhada aplicada apenas à prosa/listas,
com a composição aberta preservada. Em desktop amplo (1600px), os blocos de projetos chegaram
a 72 caracteres por linha; apoio do catálogo e nota de CI, 69; “Próximos passos”, 71 em Nana
e 74 na plataforma. As demais passagens das fichas ficaram em até 75; colunas estreitas e
textos curtos podem ter menos. Inspeção das quatro rotas em 32 cenários, com fonte carregada,
320/390/768/1280/1600px e texto a 200% em 320/768/1280px: sem overflow ou erros de página,
com a última seção mantendo a largura integral. Lint, tipos, 45 unitários, build de produção,
Prettier, detector tipográfico (`[]`) e `git diff --check` aprovados; confirmação final dos
88 E2E, incluindo axe e refluxo, aprovada. Revisão constitucional sem bloqueadores.

---

## Phase 22: Percurso de avaliação da home

- [X] T110 [US1] [US2] [US4] Executar as quatro melhorias da crítica Impeccable: salto nativo focável aos destaques, competências dos cartões agrupadas pelas áreas do perfil com ações antecipadas, imagem editorial da plataforma complementar ao diagrama de build e encerramento com contato explícito; preservar dados, campos obrigatórios, SC-001 e a exceção de Nana Silva; validar teclado/sem JavaScript, responsividade/texto a 200%, tipos, lint, unitários, build, E2E/a11y e revisão constitucional/de conteúdo antes de concluir

**Resultado de T110 — 2026-10-27:** quatro melhorias e polimento integrado concluídos.
Tipos, lint, 46 unitários e 90 E2E (incluindo axe, teclado, ausência de JavaScript, fontes
e refluxo) passaram, com build de produção pelo servidor de testes. SC-001 confirmado em
1280 × 720. Inspeção visual em 390/1280px e medições de home/catálogo em 320/390/768/1280px,
com texto a 100% e 200% (16 cenários), sem overflow, conteúdo cortado ou erros de página,
incluindo os textos do rodapé. Em 390px, o catálogo começa em y1261 e o primeiro cartão em
y1431, com acesso direto pela abertura. O agrupamento mantém todas as competências; ações
antecedem tecnologias e evidências na ordem do documento. Revisões constitucional, de
conteúdo e semântica sem bloqueadores. O hook não encontrou problemas determinísticos na
home; o aviso preexistente de sidecar desatualizado não foi reparado fora do escopo. T055
permanece independente; sem dependências novas, commit, push ou deploy.

Formatação direcionada e `git diff --check` aprovados. A checagem global de Prettier
apontou três JSONs preexistentes, não alterados nesta tarefa, em
`docs/referencias-visuais/assets/exploracoes-minimalistas/` (caderno-decisoes, indice-aberto
e trabalho-abre, com sufixo `.webp.json`). A limitação global está registrada em
`docs/ACTIVE_CONTEXT.md`; esses arquivos foram preservados fora do escopo.

---

## Phase 23: Preparação para publicação

- [X] T111 Formatar os três JSONs de metadados visuais pendentes preservando os dados; sincronizar apenas o sidecar local com `DESIGN.md` e a implementação; validar formato global, JSON/schema, amostras e ausência de defasagem; registrar roteiro e pendências reais de T055, estado de CI/preview e limites do ambiente sem promover verificações automatizadas a inspeção humana

**Resultado de T111 — 2026-10-27:** Prettier global e `git diff --check` aprovados; dados dos
três JSONs, `DESIGN.md` e 50 arquivos da aplicação preservados por comparação de hashes.
Sidecar local sincronizado em schema 2, com nove exemplos e zero achados de defasagem;
18 cenários em shadow DOM sem overflow ou referências ARIA locais ausentes. Auditoria de
produção atualizada: zero vulnerabilidades. Revisão constitucional e links locais da
documentação aprovados. Roteiro em `docs/CHECKLIST_PUBLICACAO.md`, incluindo configuração
da Vercel ainda não iniciada pelo proprietário. CI do SHA local sem execuções/status;
as alterações posteriores ainda precisam compor um candidato enviado ao GitHub. T055,
leitor de tela real, aparelho físico e preview continuam pendentes, sem falsa aprovação.
Tipos, lint, 46 unitários, build e 90 E2E de T110 não foram repetidos porque nenhum arquivo
da aplicação mudou. Nenhum commit, push, dependência nova ou deploy foi executado.
