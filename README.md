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
export NEXT_PUBLIC_SITE_URL=https://portfolio.example # origem reservada apenas para testes
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

### Scripts de instalação

`allowScripts` em `package.json` lista quais dependências podem executar scripts de instalação,
e `strict-allow-scripts=true` em `.npmrc` faz o `npm ci` falhar (`ESTRICTALLOWSCRIPTS`) quando
surge um script fora da lista. Decisões atuais:

- `unrs-resolver` (`postinstall`) está negado. O binding nativo já chega como dependência
  opcional pelo lockfile; o script só tentaria baixá-lo de novo, sem verificar integridade.
  Lint, testes e build passam sem ele.
- `fsevents` (`install`, só macOS) está liberado nas versões 2.3.2 e 2.3.3, como antes.

Se uma atualização trouxer um script novo, revise o pacote e registre a decisão com
`npm approve-scripts <pacote>` ou `npm deny-scripts <pacote>`; não use
`--dangerously-allow-all-scripts` nem remova a opção estrita.

**npm 11.16.0 ou superior é obrigatório.** As versões 11.15 e anteriores não conhecem
`allowScripts`: avisam apenas `Unknown project config "strict-allow-scripts"` e executam todos os
scripts, inclusive os negados, com instalação bem-sucedida. Por isso `engines.npm` é
`>=11.16.0` e, com `engine-strict=true`, um npm antigo recusa `npm ci`, `npm install` e
`--package-lock-only` com `EBADENGINE` antes de criar `node_modules`. O Node 24.15–24.17 traz
npm 11.13; nessas versões, atualize o npm ou use Node 24.18+ (`.nvmrc` fixa 24.19.0, com npm
11.17.0, que é o que o CI usa). Confira com `npm -v`.

Limitações: `--engine-strict=false` na linha de comando desliga a recusa, e `npm rebuild` com npm
antigo sobre um `node_modules` existente executa os scripts negados sem checar `engines`.

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
NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build # produção local via HTTP
npm run start
```

Em produção hospedada, `NEXT_PUBLIC_SITE_URL` é obrigatória e deve conter a origem HTTPS
confirmada, sem credenciais, caminho, query ou fragmento. O build falha se a configuração for
inválida ou estiver ausente; não usa localhost nem `VERCEL_URL` como domínio de produção.
Desenvolvimento/teste sem configuração usa `http://localhost:3000`. Um preview declarado por
`VERCEL_ENV=preview` pode usar `VERCEL_URL` válida em `*.vercel.app` quando a origem explícita
estiver ausente. HTTP explícito é permitido somente em loopback para testes locais; deployments
Vercel de produção/preview recusam loopback. URLs de exemplo acima não são domínio de produção.

Os headers e a CSP são configurados em `next.config.js`, sem Proxy e preservando SSG. A CSP
é aplicada em `next build/start`, inclusive previews; em `next dev` ela é omitida para o HMR.
Decisões, exceções e verificações: [Auditoria 02 — Etapa 4](docs/audits/auditoria-02-etapa4-next-http.md).

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
