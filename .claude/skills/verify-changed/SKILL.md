---
name: verify-changed
description: Executa apenas as verificações relevantes para os arquivos alterados (typecheck, lint, Vitest, Playwright). Use antes de commit, ao finalizar uma tarefa do tasks.md, ou quando o usuário pedir para "validar", "verificar" ou "rodar os testes" das mudanças atuais. Evita rodar a suíte inteira sem necessidade.
---

# verify-changed

Roda o conjunto mínimo de verificações que cobre o diff atual. O objetivo é
feedback rápido: a suíte completa só é executada quando o diff realmente a exige.

## 1. Levantar o escopo

```bash
git status --porcelain
git diff --name-only HEAD
```

Considere também arquivos não rastreados (`??`). Monte a lista de caminhos alterados.

## 2. Mapear caminhos para verificações

Aplique todas as regras que casarem. Não rode nada fora delas.

| Caminho alterado | Verificações obrigatórias |
|---|---|
| Qualquer `.ts`/`.tsx` | `npx tsc --noEmit` e `npx next lint --file <arquivos>` |
| `lib/content.ts`, `lib/types.ts` | `npx vitest run tests/unit/content.test.ts` **e** todo o E2E (o conteúdo alimenta todas as rotas) |
| `content/**/*.json` | `npx vitest run tests/unit/content.test.ts` + E2E das rotas que exibem o conteúdo (`home`, `project-detail`, `sobre`, `curriculo`) |
| `app/page.tsx` | `tests/e2e/home.spec.ts`, `home.a11y.spec.ts`, `metadata.spec.ts` |
| `app/projetos/**` | `project-detail.spec.ts`, `project-detail.a11y.spec.ts`, `project-not-found.spec.ts`, `metadata.spec.ts` |
| `app/sobre/**` | `sobre.spec.ts`, `metadata.spec.ts` |
| `app/curriculo/**` | `curriculo.spec.ts`, `metadata.spec.ts` |
| `app/layout.tsx`, `app/globals.css` | Todo o E2E (layout e estilos são globais), incluindo `responsive.spec.ts` |
| `app/not-found.tsx` | `project-not-found.spec.ts` |
| `components/layout/**` | E2E de todas as rotas + `responsive.spec.ts` |
| `components/project/**` | `home.spec.ts`, `project-detail.spec.ts` e os `.a11y.spec.ts` correspondentes |
| `public/images/**` | `project-detail.spec.ts` (verifica renderização de imagem) |
| Somente `specs/**`, `*.md`, `docs/**` | Nenhuma verificação de código. Reporte isso e pare. |
| `package.json`, `next.config.js`, `tsconfig.json` | `npx tsc --noEmit` + `npm run build` + todo o E2E |

Se o diff tocar mais de ~60% das rotas, rode a suíte completa em vez de arquivos
individuais — é mais rápido que orquestrar seleções parciais.

## 3. Executar

Ordem: typecheck → lint → unit → e2e. Pare no primeiro erro, corrija e retome
do passo que falhou (não recomece do zero).

```bash
npx tsc --noEmit
npx next lint --file app/page.tsx --file components/project/ProjectCard.tsx
npx vitest run tests/unit/content.test.ts
npx playwright test tests/e2e/home.spec.ts tests/e2e/home.a11y.spec.ts
```

Notas de execução:

- Playwright sobe `npm run build && PORT=3001 npm run start` automaticamente
  (`playwright.config.ts`). O primeiro E2E da sessão leva ~1 min por causa do build.
- Use `npx vitest run` (nunca `npm test`, que fica em modo watch).
- `next lint --file` aceita múltiplos `--file`; passe só os arquivos alterados.

## 4. Reportar

Liste, em no máximo 5 linhas:

1. Quais verificações rodaram e por quê (regra que disparou).
2. Resultado de cada uma (passou / falhou com a mensagem essencial).
3. O que foi **deliberadamente não executado** e a razão.

Nunca declare "tudo validado" se alguma verificação da tabela foi pulada — diga
explicitamente o que ficou de fora.
