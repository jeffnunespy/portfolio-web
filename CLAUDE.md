# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

Todo o domínio, tipos, campos JSON, mensagens de erro e documentação estão em português. Mantenha esse padrão: nomes de interfaces e propriedades novas (`Projeto`, `competenciasDemonstradas`, …) seguem o vocabulário existente, não traduza para inglês.

## Comandos

```bash
npm run dev            # dev server (porta 3000)
npm run build          # build de produção com Turbopack (valida conteúdo em tempo de build)
npm run lint           # eslint flat config (next/core-web-vitals + typescript + prettier)
npm run typecheck      # tsc --noEmit
npm run format:check   # prettier --check .

npm run test                              # Vitest (watch)
npm run test -- --run                     # Vitest single-run
npm run test -- --run tests/unit/content.test.ts   # um arquivo
npm run test -- --run -t "nome do teste"           # um teste

npm run test:e2e                                   # Playwright (build + start na 3001)
npm run test:e2e:functional                        # E2E exceto os marcados @a11y
npm run test:e2e:a11y                              # somente os marcados @a11y
npm run test:e2e -- tests/e2e/home.spec.ts         # um arquivo
npm run test:e2e -- -g "texto do teste"            # um teste
```

`test:e2e` sobe seu próprio servidor via `webServer` (`npm run build && PORT=3001 npm run start`) e falha se a 3001 já estiver ocupada. `E2E_BUILD_EXISTENTE=1` serve o `.next/` já gerado sem recompilar (usado no CI); `E2E_REUTILIZAR_SERVIDOR=1` reaproveita um servidor aberto, só para iteração local — não vale como aceite. Relatórios ficam em `playwright-report/<grupo>/` e `test-results/<grupo>/`. Os metadados são testados contra `NEXT_PUBLIC_SITE_URL=https://portfolio.example`. Vitest exclui `tests/e2e/**` e falha quando não encontra testes.

`next lint` não existe mais no Next.js 16 — para lintar arquivos específicos use `npx eslint <arquivos>`.

**Gates do CI** (`.github/workflows/ci.yml`, Node de `.nvmrc`): `npm ci` → `npm audit --omit=dev --audit-level=high` → `format:check` → `lint` → `typecheck` → `test -- --run` → `build` → `test:e2e:functional` → `test:e2e:a11y`. O CI completo continua obrigatório no head do PR. Localmente, execute somente as verificações pertinentes ao diff ou reutilize evidências válidas, conforme `docs/audits/PROCESSO.md`; não repita toda a sequência por rotina.

## Arquitetura

Site Next.js 16 com pré-renderização (App Router, sem exportação estática para `out`) + React 19 + TypeScript, sobre Node.js `^24.22.1` (`engines.node`, piso de segurança com `engine-strict` em `.npmrc`; `.nvmrc` fixa 24.22.2), sem backend, sem banco e sem autenticação nesta fase. Publicado na Vercel; detalhes abaixo.

**Conteúdo como fonte de dados.** Não há CMS nem API: todo o conteúdo vive em JSON versionado em `content/` — `profile.json` (perfil) e `content/projects/*.json` (um estudo de caso por arquivo). `lib/content.ts` lê esses arquivos com `fs` em tempo de build e é o único ponto de acesso ao conteúdo; `lib/types.ts` define os tipos correspondentes.

**Validação que quebra o build (intencional).** `lib/content.ts` valida ao ler e lança erro em vez de degradar:

- todos os campos obrigatórios de `Projeto` e `PerfilProfissional` presentes e não vazios (FR-011a);
- enums fechados: `status`, `natureza` e `categoria` (FR-006) só aceitam os valores das constantes `STATUS_PROJETO`, `NATUREZA_PROJETO` e `CATEGORIA_PROJETO`;
- `slug` em kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`) e sem duplicatas entre projetos;
- `linkDemonstracao` e `linkRepositorio` precisam ser URLs HTTPS válidas — `linkRepositorio` aceita também o literal `"privado"` (FR-009a); `linkGithub`/`linkLinkedin` são HTTPS obrigatórios e `contato.valor` precisa ter formato de e-mail;
- `imagemApresentacao` e `linkCurriculo` precisam ser caminhos absolutos e o arquivo tem de existir de fato em `public/`;
- `decisoesRelevantes` com pelo menos 2 itens, cada um com `titulo` e `descricao` não vazios;
- no máximo 6 projetos reais (`real: true`) com `destaque: true` — escopo planejado não consome o teto — e ao menos um projeto publicado;
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
- Use o PR como registro principal. Atualize `docs/ACTIVE_CONTEXT.md` apenas quando mudar o estado relevante da feature/operação, com link ao PR, sem copiar a auditoria.

Skills locais em `.claude/skills/` cobrem os fluxos recorrentes: `novo-projeto-conteudo` (criar/editar JSON de projeto no schema válido), `a11y-check` (rodar e corrigir violações axe), `seo-metadata` (metadados de rota), `verify-changed` (rodar só as verificações relevantes aos arquivos alterados). Prefira-as a reinventar o procedimento.

## Governança e operação

Siga `AGENTS.md`, `CONTRIBUTING.md` e `docs/audits/PROCESSO.md`. Na dúvida, use
o nível de risco superior e preserve a classificação até revisão fundamentada.
Revisão independente é exigida pelos níveis 2/3, adversarial no 3. Skills e agentes
especializados não são uma cadeia obrigatória: use apenas os pertinentes ao diff.

Reabra investigação encerrada somente por fato novo discriminante ou erro
demonstrado na análise anterior. Preexistência não
significa aceite automático. Registre risco, evidência, impacto, acompanhamento e
decisão do proprietário no PR; inconclusivo não significa corrigido nem risco aceito.
Risco indeterminado com potencial P0/P1 recebe tratamento conservador até decisão expressa.

Autorizações podem agrupar commit, push e atualização do PR, vinculadas à branch
e aos arquivos exatos ou patch-id; alteração material fora do escopo exige nova
aprovação. Force-push, reescrita de histórico, marcar PR como pronto e auto-merge
exigem autorização própria. Merge exige autorização específica para PR/SHA final;
deploy exige autorização própria. Nunca contorne CI, proteção da master ou requisitos
de acessibilidade.

Estado e histórico operacional: `docs/ACTIVE_CONTEXT.md` e
`docs/CHECKLIST_PUBLICACAO.md`. Não duplicar registros de publicação neste arquivo.
Preservar preset Next.js, raiz `./` e saída padrão da Vercel. Antes de deploy
autorizado, confirmar ambiente e origem de build. Não versionar `.env.local` ou
`.vercel/`. Inspeções humanas seguem os critérios aprovados; automação não as substitui.
