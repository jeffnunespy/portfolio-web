# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

Todo o domínio, tipos, campos JSON, mensagens de erro e documentação estão em português. Mantenha esse padrão: nomes de interfaces e propriedades novas (`Projeto`, `competenciasDemonstradas`, …) seguem o vocabulário existente, não traduza para inglês.

## Comandos

```bash
npm run dev            # dev server (porta 3000)
npm run build          # build de produção (valida conteúdo em tempo de build)
npm run lint           # eslint (next/core-web-vitals + prettier)
npx tsc --noEmit       # typecheck (não há script dedicado)

npm run test                              # Vitest (watch)
npm run test -- --run                     # Vitest single-run
npm run test -- --run tests/unit/content.test.ts   # um arquivo
npm run test -- --run -t "nome do teste"           # um teste

npm run test:e2e                                   # Playwright (build + start na 3001)
npm run test:e2e -- tests/e2e/home.spec.ts         # um arquivo
npm run test:e2e -- -g "texto do teste"            # um teste
```

`test:e2e` sobe seu próprio servidor via `webServer` (`npm run build && PORT=3001 npm run start`) e reutiliza um servidor já rodando na 3001 fora do CI. Vitest exclui `tests/e2e/**`.

## Arquitetura

Site estático Next.js 14 (App Router) + TypeScript, sem backend, sem banco e sem autenticação nesta fase. Deploy alvo: Vercel.

**Conteúdo como fonte de dados.** Não há CMS nem API: todo o conteúdo vive em JSON versionado em `content/` — `profile.json` (perfil) e `content/projects/*.json` (um estudo de caso por arquivo). `lib/content.ts` lê esses arquivos com `fs` em tempo de build e é o único ponto de acesso ao conteúdo; `lib/types.ts` define os tipos correspondentes.

**Validação que quebra o build (intencional).** `lib/content.ts` valida ao ler e lança erro em vez de degradar:

- todos os campos obrigatórios de `Projeto` e `PerfilProfissional` presentes e não vazios (FR-011a);
- `decisoesRelevantes` com pelo menos 2 itens;
- **toda** competência declarada em `perfil.competenciasPorArea` precisa aparecer em `competenciasDemonstradas` de algum projeto (FR-024/SC-007 — princípio constitucional "evidências acima de afirmações").

Consequência prática: adicionar uma competência ao perfil sem projeto que a comprove faz `npm run build` falhar. Não contorne removendo a validação — ajuste o conteúdo. Ao alterar o schema, atualize `lib/types.ts`, as listas `REQUIRED_*` em `lib/content.ts`, todos os JSONs existentes e `tests/unit/content.test.ts` juntos.

**Rotas.** `app/page.tsx` (home), `app/projetos/` (lista e `[slug]` com `generateStaticParams` + `generateMetadata`), `app/sobre/`, `app/curriculo/`. Componentes de apresentação em `components/layout/` e `components/project/`. Estilos globais em `app/globals.css` (CSS puro, sem framework).

**Testes.** `tests/unit/` (Vitest + Testing Library, jsdom) cobre sobretudo a validação de conteúdo. `tests/e2e/` (Playwright, Chromium) cobre navegação, metadados (`metadata.spec.ts`), responsividade e acessibilidade — os arquivos `*.a11y.spec.ts` usam `@axe-core/playwright` contra WCAG 2.1 A/AA.

## Processo (spec-kit)

Este repositório é dirigido por especificação. A ordem de precedência é: `.specify/memory/constitution.md` > `specs/<feature>/spec.md`, `plan.md`, `tasks.md` > sugestões do agente. Regras que importam na prática:

- Antes de implementar, leia a spec/plan e localize a tarefa em `specs/001-experiencia-publica-inicial/tasks.md`; marque-a concluída só depois de validar.
- Não altere requisitos aprovados durante a implementação — registre a divergência primeiro.
- Não adicione dependências sem justificativa; a constituição pede a solução mais simples que atenda ao requisito atual.
- Não remova nem afrouxe testes para fazer a implementação passar.
- Não invente métricas, resultados ou evidências em conteúdo de projeto (princípio X).
- Atualize `docs/ACTIVE_CONTEXT.md` quando o estado da feature avançar.

Skills locais em `.claude/skills/` cobrem os fluxos recorrentes: `novo-projeto-conteudo` (criar/editar JSON de projeto no schema válido), `a11y-check` (rodar e corrigir violações axe), `seo-metadata` (metadados de rota), `verify-changed` (rodar só as verificações relevantes aos arquivos alterados). Prefira-as a reinventar o procedimento.
