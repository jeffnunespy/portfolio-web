---

description: "Task list for Experiência Pública Inicial do Portfólio"
---

# Tasks: Experiência Pública Inicial do Portfólio

**Input**: Design documents from `/specs/001-experiencia-publica-inicial/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Incluídos — Princípio V da constituição ("Qualidade verificável") exige testes
automatizados para regras de negócio e fluxos críticos, e o plan.md já define o stack de testes
(Vitest, Testing Library, Playwright, axe-core).

**Organization**: Tarefas agrupadas por user story (spec.md) para permitir implementação e teste
independentes de cada uma.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência)
- **[Story]**: US1–US4, conforme spec.md
- Caminhos de arquivo exatos, conforme estrutura definida em plan.md

## Path Conventions

Projeto único Next.js (App Router) — `app/`, `components/`, `content/`, `lib/`, `tests/` na raiz
do repositório, conforme `plan.md` § Project Structure.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização do projeto Next.js/TypeScript e ferramentas de qualidade

- [ ] T001 Inicializar projeto Next.js 14+ (App Router, TypeScript) na raiz do repositório
- [ ] T002 Configurar ESLint + Prettier com regras TypeScript/React em `.eslintrc.json` / `.prettierrc`
- [ ] T003 [P] Configurar Vitest + Testing Library em `vitest.config.ts`
- [ ] T004 [P] Configurar Playwright + axe-core em `playwright.config.ts`
- [ ] T005 [P] Adicionar scripts `build`, `dev`, `test`, `test:e2e` em `package.json` conforme quickstart.md

**Checkpoint**: `npm run dev` sobe um projeto Next.js vazio; `npm run test` e `npm run test:e2e` executam sem erro de configuração.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Modelo de dados, validação de conteúdo e layout global — bloqueia todas as user stories

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase estar completa

- [ ] T006 [P] Definir tipos `Projeto`, `PerfilProfissional`, `Competencia` em `lib/types.ts` conforme data-model.md
- [ ] T007 [P] Criar `content/profile.json` com dados reais do proprietário (título, descrição, competências por área, bio, links, contato) conforme FR-002, FR-003, FR-015–FR-017
- [ ] T008 [P] Criar os 4 arquivos iniciais em `content/projects/*.json` (plataforma de portfólio, helpdesk, gerenciamento de filas, transcrição/análise de áudio) conforme data-model.md e Assumptions do spec.md
- [ ] T009 Implementar `lib/content.ts`: leitura de `content/*.json` em build time, com validação que falha o build se algum campo obrigatório estiver ausente (FR-011a — sem estado de rascunho/publicação parcial) ou se alguma competência em `profile.json` não tiver projeto que a referencie em `competenciasDemonstradas` (FR-024, SC-007)
- [ ] T010 [P] Teste unitário de `lib/content.ts` em `tests/unit/content.test.ts`: cobre caso de sucesso, campo obrigatório ausente e competência sem evidência (depende de T009)
- [ ] T011 Implementar `components/layout/Header.tsx`: navegação (início, listagem de projetos, Sobre, currículo) sem `tabindex` customizado, conforme FR-005, FR-021
- [ ] T012 Implementar `components/layout/Footer.tsx`: links de currículo, GitHub, LinkedIn, contato e titularidade, conforme FR-018
- [ ] T013 Implementar `app/layout.tsx` compondo Header + Footer + skip-link para navegação por teclado (depende de T011, T012)
- [ ] T014 Implementar `app/not-found.tsx` (404 genérico com mensagem amigável), conforme FR-025

**Checkpoint**: Layout global funcional, dados de conteúdo validados em build — user stories podem começar.

---

## Phase 3: User Story 1 - Avaliar o posicionamento profissional na página inicial (Priority: P1) 🎯 MVP

**Goal**: Visitante identifica, só na página inicial, quem é o proprietário, área de profundidade, competências complementares e projetos em destaque.

**Independent Test**: Carregar `/` e verificar título, descrição, competências por área e projetos em destaque, sem depender de outra página.

### Tests for User Story 1

- [ ] T015 [P] [US1] Teste E2E em `tests/e2e/home.spec.ts`: título, descrição de posicionamento e competências por área visíveis (Acceptance Scenarios 1–2, SC-001)
- [ ] T016 [P] [US1] Teste E2E em `tests/e2e/home.spec.ts`: navegação completa por Tab segue ordem visual, sem `tabindex` positivo (Acceptance Scenario 4, FR-021, SC-005)
- [ ] T017 [P] [US1] Teste axe-core em `tests/e2e/home.a11y.spec.ts` para a rota `/` (FR-022)

### Implementation for User Story 1

- [ ] T018 [P] [US1] Implementar `components/project/ProjectCard.tsx`: título, resumo, status, categoria, natureza, link para página do projeto (FR-006, FR-007, FR-010)
- [ ] T019 [P] [US1] Implementar `components/project/ProjectStatusBadge.tsx` com os 4 valores fechados de status (FR-011)
- [ ] T020 [US1] Implementar `app/page.tsx`: apresentação profissional (FR-002), competências por área com distinção visual (FR-003) e seção de projetos em destaque respeitando teto de 6 (FR-004), usando ProjectCard (depende de T018, T019)
- [ ] T021 [US1] Tratar ausência de imagem de apresentação/link de demonstração no ProjectCard sem quebrar layout (Edge Cases)
- [ ] T022 [US1] Adaptar seção de projetos quando há menos projetos que o teto, sem placeholders vazios (Edge Cases)

**Checkpoint**: User Story 1 completa e testável de forma independente.

---

## Phase 4: User Story 2 - Consultar detalhes de um projeto específico (Priority: P1)

**Goal**: Visitante acessa a página de um projeto e encontra contexto, decisões, situação atual e links relacionados.

**Independent Test**: Acessar `/projetos/<slug>` diretamente por URL e verificar todas as seções obrigatórias.

### Tests for User Story 2

- [ ] T023 [P] [US2] Teste E2E em `tests/e2e/project-detail.spec.ts`: acesso via link da home e via URL direta, todas as seções obrigatórias presentes (Acceptance Scenarios 1–2, FR-012, FR-013)
- [ ] T024 [P] [US2] Teste E2E em `tests/e2e/project-detail.spec.ts`: projeto com `linkRepositorio: "privado"` exibe CTA de contato em vez de link (Acceptance Scenario 4, FR-009a)
- [ ] T025 [P] [US2] Teste E2E em `tests/e2e/project-not-found.spec.ts`: URL de projeto inexistente exibe página "não encontrado" com link para listagem (Edge Case)
- [ ] T026 [P] [US2] Teste axe-core em `tests/e2e/project-detail.a11y.spec.ts` para uma rota de projeto (FR-022)

### Implementation for User Story 2

- [ ] T027 [P] [US2] Implementar `components/project/EvidenceLink.tsx` para repositório público, privado (CTA contato) e demonstração (FR-008, FR-009, FR-009a)
- [ ] T028 [US2] Implementar `app/projetos/[slug]/page.tsx`: contexto, objetivo, funcionalidades, responsabilidade do proprietário, decisões relevantes (mín. 2), stack, situação atual, limitações, próximos passos (FR-012) (depende de T027)
- [ ] T029 [US2] Implementar `app/projetos/[slug]/not-found.tsx`: mensagem amigável + link para listagem de projetos (Edge Case)
- [ ] T030 [US2] Implementar `app/projetos/page.tsx`: listagem de todos os projetos publicados, incluindo os que excedem o teto de destaque (FR-004a)
- [ ] T031 [US2] Gerar rotas estáticas para todos os slugs de projeto via `generateStaticParams` em `app/projetos/[slug]/page.tsx` (depende de T028)

**Checkpoint**: User Stories 1 e 2 funcionam de forma independente e integrada.

---

## Phase 5: User Story 3 - Encontrar currículo, código-fonte e contato (Priority: P2)

**Goal**: A partir de qualquer página, visitante encontra currículo, GitHub, LinkedIn e contato.

**Independent Test**: A partir de qualquer página pública, verificar cabeçalho (currículo) e rodapé (currículo, GitHub, LinkedIn, contato) funcionais.

### Tests for User Story 3

- [ ] T032 [P] [US3] Teste E2E em `tests/e2e/curriculo.spec.ts`: link de currículo no cabeçalho em qualquer página; GitHub/LinkedIn/contato no rodapé (Acceptance Scenarios 1–2, SC-003)
- [ ] T033 [P] [US3] Teste E2E em `tests/e2e/curriculo.spec.ts`: página `/curriculo` exibe currículo visualizável com opção de download (FR-015)

### Implementation for User Story 3

- [ ] T034 [US3] Implementar `app/curriculo/page.tsx`: currículo visualizável na página + link de download do arquivo (FR-015)
- [ ] T035 [US3] Adicionar arquivo de currículo (PDF) em `public/curriculo.pdf` e referenciar em `content/profile.json` (depende de T007)

**Checkpoint**: User Stories 1, 2 e 3 funcionam de forma independente.

---

## Phase 6: User Story 4 - Conhecer o proprietário na página Sobre (Priority: P2)

**Goal**: Visitante aprofunda o entendimento da trajetória e posicionamento do proprietário.

**Independent Test**: Acessar `/sobre` diretamente e verificar conteúdo consistente com a página inicial.

### Tests for User Story 4

- [ ] T036 [P] [US4] Teste E2E em `tests/e2e/sobre.spec.ts`: navegação até "Sobre" e conteúdo consistente com posicionamento da home (Acceptance Scenarios 1–2, FR-014)

### Implementation for User Story 4

- [ ] T037 [US4] Implementar `app/sobre/page.tsx`: biografia e posicionamento consistente com a home, usando `content/profile.json` (FR-014)

**Checkpoint**: Todas as 4 user stories funcionam de forma independente.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validações finais que atravessam todas as user stories

- [ ] T038 [P] Teste E2E de responsividade em `tests/e2e/responsive.spec.ts` nas larguras 320px/768px/1280px, sem rolagem horizontal (SC-006)
- [ ] T039 [P] Adicionar metadados de página (`title`, `description`) próprios por rota usando `generateMetadata` do Next.js, derivados do conteúdo de cada página (FR-029)
- [ ] T040 Rodar `npm run build` e confirmar que a validação de conteúdo de T009 passa sem erros
- [ ] T041 Executar `quickstart.md` integralmente e confirmar todos os cenários de validação

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências
- **Foundational (Phase 2)**: depende do Setup — bloqueia todas as user stories
- **User Stories (Phase 3–6)**: todas dependem do Foundational; podem prosseguir em paralelo ou em ordem de prioridade (US1/US2 P1 → US3/US4 P2)
- **Polish (Phase 7)**: depende de todas as user stories desejadas estarem completas

### User Story Dependencies

- **US1 (P1)**: sem dependência de outra story
- **US2 (P1)**: independente de US1, mas US1 já cria `ProjectCard`/`ProjectStatusBadge` reaproveitados pela listagem (T018, T019 antecedem T030 na prática, embora não bloqueiem tecnicamente)
- **US3 (P2)**: independente; consome `content/profile.json` (Phase 2)
- **US4 (P2)**: independente; consome `content/profile.json` (Phase 2)

### Parallel Opportunities

- T003, T004, T005 em paralelo após T001/T002
- T006, T007, T008 em paralelo (arquivos distintos)
- Testes de uma mesma user story marcados [P] em paralelo
- US3 e US4 podem ser implementadas em paralelo por desenvolvedores diferentes após Phase 2

---

## Parallel Example: User Story 1

```bash
Task: "Teste E2E home.spec.ts (título/descrição/competências)"
Task: "Teste E2E home.spec.ts (ordem de tabulação)"
Task: "Teste axe-core home.a11y.spec.ts"
Task: "Implementar ProjectCard.tsx"
Task: "Implementar ProjectStatusBadge.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2, ambas P1)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (bloqueia tudo)
3. Completar Phase 3: US1 (home)
4. Completar Phase 4: US2 (página de projeto) — página inicial sem página de projeto não entrega valor completo, ambas P1
5. **PARAR e VALIDAR**: rodar `quickstart.md` cenários 1 e 2
6. Deploy/demo do MVP

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 + US2 → MVP funcional (P1) → deploy
3. US3 (currículo/redes/contato) → deploy
4. US4 (Sobre) → deploy
5. Polish → deploy final desta feature

---

## Notes

- [P] = arquivos diferentes, sem dependência
- [Story] mapeia a tarefa à user story correspondente em spec.md
- Testes devem falhar antes da implementação correspondente
- Validação de build (T009) é o mecanismo automatizado que impõe FR-024/SC-007 (evidência obrigatória)
- Parar em qualquer checkpoint para validar a story isoladamente
