# Active Context

## Feature

Experiência Pública Inicial do Portfólio.

## Status

Fase 1 (Setup) concluída.

## Entregues

- Projeto Next.js 14 + TypeScript inicializado.
- ESLint + Prettier configurados.
- Vitest + Testing Library configurados.
- Playwright configurado.
- Scripts `build`, `dev`, `test`, `test:e2e` adicionados.
- Páginas/app básicas criadas: layout, home, globals.css, not-found.
- Arquivos de ignore criados/verificados: `.gitignore`, `.dockerignore`, `.eslintignore`, `.prettierignore`, `.npmignore`.

## Validação

- `npm run build` OK.
- `npm run test` OK (sem testes ainda, configuração OK).
- `npm run test:e2e` OK (placeholder E2E OK).

## Próximo passo

Iniciar Fase 2: `lib/types.ts`, `content/profile.json`, `content/projects/*.json`, `lib/content.ts`, Header, Footer, layout global e 404.

## Decisões

- Next.config como `.js` para compatibilidade com Next 14 no ambiente atual.
- Placeholder E2E mantido até a primeira suíte real ser implementada.
