# Project: Experiência Pública Inicial do Portfólio

## Objetivo

Entregar a primeira experiência pública do portfólio como site estático, sem autenticação e sem backend dinâmico nesta fase.

## Stack

- Node.js 24
- Next.js 16 (App Router, build com Turbopack)
- TypeScript 5.x
- React 19
- ESLint 10 (flat config) + Prettier
- Vitest + Testing Library
- Playwright + axe-core
- CI no GitHub Actions + Dependabot
- Deploy alvo: Vercel

## Estrutura principal

```text
app/
components/
content/
lib/
tests/
```

## Restrições

Sem coleta de dados de navegação, sem área administrativa, sem estado de loading.
