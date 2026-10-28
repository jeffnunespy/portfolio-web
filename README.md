# Portfólio

Experiência pública inicial do portfólio, entregue como site estático com Next.js 16 (App Router), React 19 e TypeScript.

## Requisitos

- Node.js `^24.15.0` (`engines.node`). O piso vem de `jsdom@30`, que exige 24.15.0 na linha 24.
  A versão validada fica em `.nvmrc` (24.19.0) e é a mesma usada pelo CI.
- npm: o que acompanha essa versão do Node (11.x). `.npmrc` liga `engine-strict`, então `npm ci`
  falha em Node fora da faixa em vez de só avisar.
- Acesso a `fonts.googleapis.com` e `fonts.gstatic.com` no primeiro build: `next/font/google`
  baixa a Geologica em tempo de build e a serve pelo próprio site. Um build sem rede e sem
  `.next/cache` falha; com o cache aquecido, o build funciona offline. Em runtime não há
  dependência externa.
- Para E2E: o Chromium da versão do `@playwright/test` instalada e, no Linux, as bibliotecas de
  sistema dele.

## Setup

```bash
nvm use                         # ou outra forma de usar a versão de .nvmrc
npm ci                          # instalação reproduzível pelo lockfile; não use npm install
npx playwright install chromium # navegador dos E2E
npm run dev
```

No Linux, se o Chromium não abrir por falta de bibliotecas, `npx playwright install-deps chromium`
instala as dependências do sistema (pede privilégio de administrador). O CI usa
`npx playwright install --with-deps chromium`, que faz as duas coisas.

## Verificações

Mesma sequência dos gates do CI (`.github/workflows/ci.yml`):

```bash
npm audit --omit=dev --audit-level=high
npm run format:check   # prettier
npm run lint           # eslint
npm run typecheck      # tsc --noEmit (não depende de tipos gerados em .next/)
npm test -- --run      # Vitest; falha se nenhum arquivo de teste for encontrado
npm run build
npm run test:e2e:functional
npm run test:e2e:a11y
```

### ESLint 10 — exceção de peer dependency

`eslint-plugin-react@7.37.5`, `eslint-plugin-jsx-a11y@6.10.2` e `eslint-plugin-import@2.32.0`,
puxados por `eslint-config-next`, ainda declaram `eslint` só até a versão 9, e não há versão
publicada que inclua a 10. `npm ci` emite avisos de peer e `npm ls eslint` marca `invalid`; a
instalação e o lint funcionam. O `fixupConfigRules` de `@eslint/compat` em `eslint.config.mjs`
adapta as regras, e `tests/unit/eslint-plugins.test.ts` garante que regras dos três plugins
continuam reportando. Remover a exceção quando os plugins declararem ESLint 10.

## Testes E2E

```bash
npm run test:e2e               # Playwright completo
npm run test:e2e:functional    # E2E exceto os marcados @a11y
npm run test:e2e:a11y          # somente acessibilidade (axe-core)
```

- Por padrão, cada execução faz `npm run build` e sobe `next start` na porta 3001. Se a porta já
  estiver ocupada, a execução falha: os testes nunca rodam contra um servidor de versão
  desconhecida.
- `E2E_BUILD_EXISTENTE=1` serve o `.next/` já gerado em vez de recompilar. Use só logo após
  `npm run build` sobre a mesma árvore (é o que o CI faz).
- `E2E_REUTILIZAR_SERVIDOR=1` reaproveita um servidor já aberto na 3001, para iteração local. A
  versão servida não é verificada, então essa execução não vale como aceite; no CI é ignorado.
- Os metadados são validados contra a origem `https://portfolio.example`, definida em
  `NEXT_PUBLIC_SITE_URL` pelo `playwright.config.ts` quando a variável não vem do ambiente. O
  build servido precisa ter usado a mesma origem; um build com outra origem reprova os testes de
  canonical, Open Graph, sitemap e robots.
- Relatórios ficam separados por suíte: `playwright-report/{funcional,a11y,completo}/` e
  `test-results/{funcional,a11y,completo}/` (traces, contexto de erro). No CI, ambos são
  publicados como artefatos `e2e-funcional` e `e2e-a11y`, inclusive quando há falha.

## Reprodução isolada

Para validar um snapshot fora da árvore de trabalho, sem caches nem servidores locais:

```bash
git clone <repositório> /tmp/portfolio-validacao
cd /tmp/portfolio-validacao
nvm use
npm ci
npx playwright install chromium
NEXT_PUBLIC_SITE_URL=https://portfolio.example npm run build
E2E_BUILD_EXISTENTE=1 npm run test:e2e:functional
E2E_BUILD_EXISTENTE=1 npm run test:e2e:a11y
```

Antes, rode os demais gates da seção Verificações. Confirme que nada escuta na porta 3001.

## Build

```bash
npm run build
```

## Deploy

Build estático preparado para deploy em Vercel.

## Documentação

- `CONTRIBUTING.md` — fluxo de pull request e regras de proteção da `master`
- `.github/SECURITY.md` — como relatar vulnerabilidades
- `docs/PROJECT.md` — visão geral do projeto
- `docs/DEVELOPMENT_PLAN.md` — plano de desenvolvimento
- `docs/ACTIVE_CONTEXT.md` — contexto ativo da implementação
- `docs/audits/auditoria-01-integridade-reprodutibilidade.md` — achados e correções da Auditoria 01
- `specs/001-experiencia-publica-inicial/` — especificação, plano, tasks e documentos de feature
