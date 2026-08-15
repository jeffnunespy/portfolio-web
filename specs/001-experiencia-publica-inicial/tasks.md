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

**Independent Test**: Acesso direto a `/projetos/<slug>` mostra todas as seções do caso e links corretos; `/projetos/slug-inexistente` apresenta alternativa amigável; a listagem contém todos os projetos publicados.

### Tests for User Story 2

- [X] T025 [US2] Cobrir acesso direto, link a partir da home e seções obrigatórias do estudo de caso em `tests/e2e/project-detail.spec.ts`
- [X] T026 [US2] Cobrir repositório público, ausência de demonstração e CTA `mailto:` para código privado em `tests/e2e/project-detail.spec.ts`
- [X] T027 [P] [US2] Cobrir rota de projeto inexistente e ação alternativa na listagem em `tests/e2e/project-not-found.spec.ts`
- [X] T028 [P] [US2] Executar axe-core nas rotas de detalhe e corrigir violações em `tests/e2e/project-detail.a11y.spec.ts`
- [X] T029 [P] [US2] Cobrir título e descrição próprios do detalhe e dos estados 404 em `tests/e2e/metadata.spec.ts`

### Implementation for User Story 2

- [X] T030 [US2] Gerar parâmetros estáticos, páginas e metadados por slug no formato assíncrono do Next.js 16 em `app/projetos/[slug]/page.tsx`
- [X] T031 [US2] Oferecer mensagem simples e link alternativo para projeto não encontrado em `app/projetos/[slug]/not-found.tsx`
- [X] T032 [US2] Garantir listagem de todos os projetos publicados em `app/projetos/page.tsx`
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
- [ ] T041 [US3] Substituir o arquivo de currículo por versão confirmada e consistente em `public/curriculo.pdf`

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
- [ ] T045 [US4] Substituir somente conteúdo profissional confirmado e com evidência associável em `content/profile.json`

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
- [ ] T052 Revisar cada estudo de caso com contexto, decisões, limitações, próximos passos, links e evidências confirmadas em `content/projects/*.json`
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

- [ ] T056 CRITICAL Substituir placeholders, URLs de exemplo e currículo por conteúdo profissional confirmado com evidência verificável em `content/profile.json` e `public/curriculo.pdf` per Constituição I/X e plan: P3 (contradicts)
- [X] T057 Fortalecer a validação de tipos, URLs, `mailto:`, enums, slugs, imagens, links e teto de destaques em `lib/content.ts` per FR-011a, FR-024 e contrato de conteúdo
- [X] T058 Cobrir todas as regras inválidas da validação de conteúdo em `tests/unit/content.test.ts` per FR-011a, FR-024 e Constitution V
- [X] T059 Expandir teclado, foco e axe-core para listagem, Sobre, currículo e ambos os estados 404 em `tests/e2e/accessibility.spec.ts` per FR-021, FR-022 e SC-005
- [X] T060 Definir e testar título e descrição próprios para 404 genérico e 404 de projeto em `app/not-found.tsx`, `app/projetos/[slug]/not-found.tsx` e `tests/e2e/metadata.spec.ts` per FR-029
- [X] T061 Cobrir links globais em todas as rotas públicas e responsividade sem sobreposição ou texto cortado em `tests/e2e/curriculo.spec.ts` e `tests/e2e/responsive.spec.ts` per SC-003 e SC-006
- [X] T062 Criar testes Testing Library para card, cabeçalho e rodapé em `tests/unit/ProjectCard.test.tsx` e `tests/unit/HeaderFooter.test.tsx` per plan: testes de componentes e Constitution V
- [~] T063 Mover o asset-fonte para `assets/portfolio-source.webp` e registrar estado, validações e riscos atuais em `docs/ACTIVE_CONTEXT.md` per plan: assets fonte e Constituição VIII (missing) — **parcialmente superada**: a segunda parte (estado, validações e riscos em `docs/ACTIVE_CONTEXT.md`) está cumprida; a movimentação do asset-fonte é não aplicável pelo mesmo motivo de T006.

---

## Phase 9: Convergence

- [X] T064 HIGH Adicionar `npm audit --omit=dev --audit-level=high` como gate obrigatório após `npm ci` em `.github/workflows/ci.yml` per plan: P1 / Constituição VI (partial)
- [X] T065 HIGH Separar os scripts/etapas de E2E funcional e axe-core e executá-los nessa ordem no CI em `.github/workflows/ci.yml`, `package.json` e `tests/e2e/` per contrato de CI / plan: Etapa 4 (partial)
- [X] T066 Definir e aplicar, com testes, o conjunto fechado permitido para `categoria` em `specs/001-experiencia-publica-inicial/data-model.md`, `lib/content.ts` e `tests/unit/content.test.ts` per plan: Etapa 5 / data-model: categoria (partial)
