# Implementation Plan: Experiência Pública Inicial do Portfólio

**Branch**: `001-experiencia-publica-inicial` | **Date**: 2026-08-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-experiencia-publica-inicial/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Entregar a primeira experiência pública do portfólio (página inicial, listagem e página de projeto,
página Sobre, currículo, cabeçalho/rodapé com redes e contato) como um site estático/pré-renderizado,
sem autenticação, sem área administrativa e sem persistência dinâmica nesta fase. O conteúdo de
projetos e perfil profissional é mantido como dados estruturados versionados no próprio repositório.

## Technical Context

**Language/Version**: TypeScript 5.x (Node.js 20 LTS)

**Primary Dependencies**: Next.js 14+ (App Router, geração estática/SSG), React 18

**Storage**: Nenhum banco de dados nesta fase; dados de projeto e perfil como arquivos estruturados (JSON) versionados no repositório

**Testing**: Vitest + Testing Library (unitário/componentes), Playwright (E2E dos fluxos de aceite), axe-core (varredura automática de acessibilidade)

**Target Platform**: Web público, navegadores modernos, responsivo (320px–1280px+)

**Project Type**: Aplicação web frontend única (sem backend/API nesta feature)

**Performance Goals**: Conteúdo entregue pré-renderizado/estático (alinhado a FR-028); sem metas de infraestrutura numéricas específicas, por serem tecnologicamente prematuras nesta fase (consistente com SC-001–SC-007, que são agnósticos de tecnologia)

**Constraints**: Sem autenticação/cadastro (FR-019); sem coleta de dados de navegação (FR-027); navegação 100% por teclado (FR-021, SC-005); sem estado de loading (FR-028)

**Scale/Scope**: 4 projetos iniciais, teto de 6 em destaque (FR-004); site majoritariamente estático, poucas dezenas de páginas nesta fase

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Status |
|---|---|---|
| I. Evidências acima de afirmações | FR-023/FR-024/SC-007 exigem evidência para toda competência/afirmação; dados de projeto incluem campo de evidência associada | PASS |
| II. Entregas verticais e incrementais | Feature entrega fatia completa e utilizável (UI + dados + testes + doc), sem depender de backend futuro | PASS |
| III. Simplicidade proporcional | Site estático sem banco de dados, sem API, sem autenticação — proporcional ao escopo (sem área administrativa) | PASS |
| IV. Backend como área de profundidade | Não aplicável nesta feature (escopo é só frontend público); aprofundamento de backend fica para features futuras (ex.: painel administrativo) — registrado como decisão, não como violação | PASS (com nota) |
| V. Qualidade verificável | Vitest/Testing Library + Playwright + axe-core cobrem critérios de aceite e regras de acessibilidade | PASS |
| VI. Segurança e privacidade desde o início | Sem cadastro/login (FR-019), sem coleta de dados de navegação (FR-027); superfície de ataque mínima por não ter backend dinâmico | PASS |
| VII. Acessibilidade e experiência consistente | FR-020 a FR-022, SC-005, SC-006 cobrem responsividade, teclado, estrutura semântica; axe-core no pipeline de teste | PASS |
| VIII. Documentação como parte da entrega | quickstart.md e data-model.md documentam o feature; projetos em si já exigem documentação de decisões via FR-012 | PASS |
| IX. Operação responsável | Deploy estático via Vercel é reproduzível e possui rollback trivial (redeploy de versão anterior); será detalhado em research.md | PASS |
| X. Uso responsável de IA | Nenhum dado fictício será apresentado como real (FR-026); conteúdo de projetos é fornecido pelo proprietário | PASS |

Nenhuma violação identificada. Complexity Tracking não se aplica.

**Re-check pós Phase 1 (design)**: data-model.md introduz validação de build que rejeita
competência sem evidência (reforça Princípio I) e não modela nenhuma entidade de
usuário/sessão/dado transacional (reforça Princípio VI). Nenhuma nova violação introduzida pelo
design. Gate permanece PASS.

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

### Source Code (repository root)

```text
app/                        # Next.js App Router
├── page.tsx                 # Página inicial
├── projetos/
│   ├── page.tsx              # Listagem de projetos (FR-004a)
│   └── [slug]/
│       ├── page.tsx           # Página resumida de projeto (FR-012)
│       └── not-found.tsx      # Página "não encontrado" (Edge Case, FR-013a)
├── sobre/page.tsx            # Página Sobre (FR-014)
├── curriculo/page.tsx        # Currículo visualizável (FR-015)
├── layout.tsx                # Cabeçalho + rodapé globais (FR-005, FR-018)
└── not-found.tsx             # 404 genérico

components/
├── layout/                  # Header, Footer, SkipLink
├── project/                 # ProjectCard, ProjectStatusBadge, EvidenceLink
└── ui/                       # Componentes de apresentação reutilizáveis

content/
├── profile.json              # Perfil profissional (Key Entity: Perfil profissional)
└── projects/
    └── *.json                 # Um arquivo por projeto (Key Entity: Projeto)

lib/
├── content.ts                 # Leitura/validação dos dados estáticos em build time
└── types.ts                   # Tipos das entidades (Projeto, Perfil, Competência)

tests/
├── unit/                      # lib/content.ts, mapeamento de dados
├── component/                 # ProjectCard, Header, Footer
└── e2e/                       # Playwright: fluxos das 4 User Stories + axe-core
```

**Structure Decision**: Aplicação Next.js única (App Router), sem diretório de backend/API nesta
feature — todo o conteúdo é resolvido em build time a partir de `content/*.json`. Estrutura reflete
diretamente as páginas exigidas pela spec (inicial, listagem, projeto, Sobre, currículo) e isola
dados de conteúdo (`content/`) da camada de apresentação (`components/`, `app/`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
