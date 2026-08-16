# Portfólio

Experiência pública inicial do portfólio, entregue como site estático com Next.js 16 (App Router), React 19 e TypeScript.

## Requisitos

- Node.js 24 (ver `.nvmrc`)
- npm

## Setup

```bash
npm install
npm run dev
```

## Verificações

```bash
npm run format:check   # prettier
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
```

## Testes

```bash
npm run test -- --run          # Vitest (single-run)
npm run test:e2e               # Playwright completo
npm run test:e2e:functional    # E2E exceto os marcados @a11y
npm run test:e2e:a11y          # somente acessibilidade (axe-core)
```

## Build

```bash
npm run build
```

## Deploy

Build estático preparado para deploy em Vercel.

## Documentação

- `docs/PROJECT.md` — visão geral do projeto
- `docs/DEVELOPMENT_PLAN.md` — plano de desenvolvimento
- `docs/ACTIVE_CONTEXT.md` — contexto ativo da implementação
- `specs/001-experiencia-publica-inicial/` — especificação, plano, tasks e documentos de feature
