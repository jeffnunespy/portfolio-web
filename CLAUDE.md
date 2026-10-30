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

**Gates do CI** (`.github/workflows/ci.yml`, Node de `.nvmrc`): `npm ci` → `npm audit --omit=dev --audit-level=high` → `format:check` → `lint` → `typecheck` → `test -- --run` → `build` → `test:e2e:functional` → `test:e2e:a11y`. Rode o mesmo conjunto antes de considerar uma tarefa concluída.

## Arquitetura

Site Next.js 16 com pré-renderização (App Router, sem exportação estática para `out`) + React 19 + TypeScript, sobre Node.js `^24.15.0` (`engines.node`, com `engine-strict` em `.npmrc`; versão validada em `.nvmrc`), sem backend, sem banco e sem autenticação nesta fase. Publicado na Vercel; detalhes abaixo.

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

## Publicação — sessão de 2026-10-29

Registro inicial da sessão; a seção de verificação operacional posterior abaixo atualiza a configuração e as evidências.

- Projeto Vercel criado e vinculado: `jeff-0a6e/portfolio-web`; o proprietário concluiu a conexão GitHub com `jeffnunespy/portfolio-web` no painel.
- URL de produção: https://portfolio-web-three-zeta.vercel.app.
- Deployment da sessão: https://portfolio-a6yvbpbxy-jeff-0a6e.vercel.app.
- O log fornecido pelo proprietário registra build, TypeScript e geração de 18 páginas concluídos, com estado `Ready`. O proprietário confirmou abertura normal do site. O agente não conseguiu acessar a URL deste ambiente; rotas, recursos e acessibilidade hospedados não receberam validação completa nesta sessão.
- T055 permanece pendente. A publicação não comprova inspeções humanas, preview aprovado ou CI do commit candidato. Os registros anteriores que indicam Vercel não configurada, incluindo `docs/CHECKLIST_PUBLICACAO.md`, foram superados por esta sessão.

### Procedimento e aprendizados

- Preservar Framework Preset Next.js, raiz `./` e saída padrão. O build detectado foi `next build`; não definir `public` ou `out` como diretório de saída.
- Se a integração Git falhar por falta de Login Connection, conectar GitHub em configurações pessoais da Vercel → Authentication; depois usar projeto → Settings → Git. Reutilizar o projeto já criado.
- A CLI 65.8.0 avisou que `--target` está obsoleto e indicou `--environment`. O comando `vercel deploy --target=preview` desta sessão terminou em produção e recebeu o alias público. A causa não foi determinada; não considerar esse comando uma garantia de preview.
- Próximo comando de preview: `rtk proxy npx vercel deploy --environment=preview`. Conferir a ajuda da versão instalada e confirmar o ambiente no painel/log; o comando foi executado nesta sessão, gerando o preview `Ready` https://portfolio-bxwwi5lbi-jeff-0a6e.vercel.app, com ambiente confirmado por `vercel inspect` e HTML com HTTP 200 via CLI autenticada. Produção continua exigindo autorização explícita.
- `.env.local`, criado pela CLI com `VERCEL_OIDC_TOKEN`, e `.vercel/` estão ignorados pelo Git. Nunca divulgar ou versionar credenciais.
- O remoto compilou com Next.js 16.4.2. Avisos de peers do ESLint 10, `cache-dir` e script de instalação de `unrs-resolver` não impediram o build; lint, auditoria e demais gates do CI não foram comprovados por esse log.
- Conferir `NEXT_PUBLIC_SITE_URL` com a URL pública escolhida antes da próxima publicação em produção; sua configuração não foi confirmada. `lib/site.ts` usa `VERCEL_URL` como fallback hospedado.

## Processo (spec-kit)

Este repositório é dirigido por especificação. A ordem de precedência é: `.specify/memory/constitution.md` > `specs/<feature>/spec.md`, `plan.md`, `tasks.md` > sugestões do agente. Regras que importam na prática:

- Antes de implementar, leia a spec/plan e localize a tarefa em `specs/001-experiencia-publica-inicial/tasks.md`; marque-a concluída só depois de validar.
- Não altere requisitos aprovados durante a implementação — registre a divergência primeiro.
- Não adicione dependências sem justificativa; a constituição pede a solução mais simples que atenda ao requisito atual.
- Não remova nem afrouxe testes para fazer a implementação passar.
- Não invente métricas, resultados ou evidências em conteúdo de projeto (princípio X).
- Atualize `docs/ACTIVE_CONTEXT.md` quando o estado da feature avançar.

Skills locais em `.claude/skills/` cobrem os fluxos recorrentes: `novo-projeto-conteudo` (criar/editar JSON de projeto no schema válido), `a11y-check` (rodar e corrigir violações axe), `seo-metadata` (metadados de rota), `verify-changed` (rodar só as verificações relevantes aos arquivos alterados). Prefira-as a reinventar o procedimento.

## Verificação operacional posterior — 2026-10-29

- Projeto Vercel alinhado a Node 24.x e instalação `npm ci`; branch de produção confirmada como `master`.
- `NEXT_PUBLIC_SITE_URL` definida em Production como `https://portfolio-web-three-zeta.vercel.app`; aguarda novo build de produção para substituir a URL específica nos metadados publicados.
- Gates locais aprovados: formatação, lint, tipos, 53 unitários, build, 73 E2E funcionais e 27 E2E de acessibilidade; auditoria npm de produção sem vulnerabilidades.
- Produção verificada automaticamente: sete rotas com 200, duas 404, PDF/imagem/ícone com 200, nove páginas sem violações axe e sem overflow em 390/1280px. Inspeções humanas de T055 continuam pendentes.
- Registros detalhados e limites da validação em `docs/ACTIVE_CONTEXT.md` e `docs/CHECKLIST_PUBLICACAO.md`. Explorações visuais não rastreadas preservadas fora do commit operacional.
