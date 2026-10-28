# Auditoria 02 — Etapa 3: segurança das dependências e supply chain

Executada em 2026-10-28 num clone isolado da `master` remota (`7fc04b4`), branch
`security/auditoria-02-dependencies`. O diretório de trabalho local não foi alterado.

## Ambiente da validação

| Item | Versão                                    |
| ---- | ----------------------------------------- |
| Node | 24.19.0 (`.nvmrc`)                        |
| npm  | 11.17.0                                   |
| SO   | Linux 7.0.0 (CI fixado em `ubuntu-24.04`) |

## Estado encontrado

- Lockfile v3: 523 entradas (514 pacotes únicos), todas com `integrity` e `resolved` em
  `registry.npmjs.org`. 3 dependências diretas de produção e 15 de desenvolvimento.
- `npm audit` completo e `--omit=dev`: 0 vulnerabilidades. OSV (514 pacotes): 0 achados.
  `npm audit signatures`: 439 assinaturas de registry e 124 attestations verificadas.
- Pacotes com script de instalação: `unrs-resolver@1.12.2` (`postinstall`) e `fsevents` 2.3.2 e
  2.3.3 (`install`, só macOS). O `npm ci` avisava que o script de `unrs-resolver` não estava
  coberto por `allowScripts`.
- GitHub Actions: as três actions usadas (`checkout`, `setup-node`, `upload-artifact`) são da
  GitHub e estão fixadas por SHA; o repositório aceita qualquer action (`allowed_actions: all`).

## Achados

| ID        | Problema                                                                                                                                 | Correção                                                                                                    | Arquivos                                                 | Validação                                                                                                   |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| AUD02-009 | `next ^16.3.4` admitia versões com RCE (GHSA-673q-mjm6-r5xr, GHSA-2464-fhr4-w9xw, GHSA-vcvr-r3jv-pc5j — o app usa `next/og`), DoS e SSRF | Piso `^16.4.2` em `next` e `eslint-config-next`                                                             | `package.json`, `package-lock.json`                      | Lockfile já resolvia 16.4.2; só as faixas do pacote raiz mudaram. Nenhum advisory afeta 16.4.2              |
| AUD02-E3a | `vitest ^4.1.10` admitia 4.1.10 (GHSA-82fw-gwwq-j7x9, path traversal, médio)                                                             | Piso `^4.1.12`                                                                                              | `package.json`, `package-lock.json`                      | Versão instalada inalterada (4.1.12)                                                                        |
| AUD02-E3b | `postinstall` de `unrs-resolver` rodava sem revisão; se o binding faltasse, baixaria o tarball sem verificar integridade                 | `allowScripts` nega `unrs-resolver`, libera `fsevents` 2.3.2/2.3.3; `strict-allow-scripts=true` em `.npmrc` | `package.json`, `.npmrc`                                 | `node_modules` byte a byte idêntico ao de antes (24.752 arquivos); script novo sem decisão falha o `npm ci` |
| AUD02-E3c | Dependabot sem atraso de adoção nem agrupamento: PR #25 subiu `react` sem `react-dom` e quebrou os testes                                | `cooldown` de 7 dias (npm e Actions); grupos `react`, `next` e `desenvolvimento` (minor/patch)              | `.github/dependabot.yml`                                 | YAML conferido; efeito real só observável no GitHub                                                         |
| AUD02-E3d | Política de scripts e de Dependabot sem registro                                                                                         | Seções no README e no CONTRIBUTING                                                                          | `README.md`, `CONTRIBUTING.md`, `docs/ACTIVE_CONTEXT.md` | Revisão manual                                                                                              |

## Validação após as correções

`npm ci` (exit 0, sem aviso de scripts, lockfile com hash inalterado), `npm audit` completo e de
produção (0), `npm audit signatures` (439/124), `format:check`, `lint`, `typecheck`, 53 testes
unitários, build (Next.js 16.4.2, 18 páginas), 73 E2E funcionais e 27 de acessibilidade.

Testes negativos: sem a entrada de `fsevents`, o `npm ci` estrito falha com
`ESTRICTALLOWSCRIPTS` também em Linux; com `npm ci --ignore-scripts` todos os gates passam,
o que confirma que nenhum script é necessário para o projeto funcionar.

## Correção complementar — versão mínima do npm

O piso `^24.15.0` do Node admitia npm 11.13 (Node 24.15.0), que não implementa a política.

**Evidência no código.** `allowScripts`, `strict-allow-scripts`, `script-allowed.js` e os
comandos `approve-scripts`/`deny-scripts` não existem nos pacotes publicados do npm 11.13.0,
11.14.0, 11.14.1 e 11.15.0, e aparecem a partir do 11.16.0 (2026-05-27). Do 11.16.0 ao 11.19.1,
a semântica de `strict-allow-scripts` não muda. A 11.17.0 só passa a negar em vez de deixar sem
revisão em casos sem `resolved` verificável e em dependências `link`; no 11.16.0 esses casos
caem como não revisados e o modo estrito recusa a instalação, ou seja, também falham fechados.

**Evidência empírica.** Fixture local com três pacotes `file:` cujo `postinstall` só grava um
arquivo marcador (um negado, um autorizado, um sem decisão), com `npm ci`:

| npm                       | Sem `engines.npm`                                                      | Com `engines.npm >=11.16.0`                             |
| ------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| 11.13.0, 11.14.1, 11.15.0 | exit 0; executa os 3 scripts; só avisa `Unknown project config`        | exit 1, `EBADENGINE`; sem `node_modules`, nenhum script |
| 11.16.0, 11.17.0, 11.19.1 | sem decisão: `ESTRICTALLOWSCRIPTS`; revisados: só o autorizado executa | idem                                                    |

Também com npm 11.13.0: `npm install`, `npm ci --force` e `--package-lock-only` falham com
`EBADENGINE`; `--engine-strict=false` e `npm rebuild` (sobre `node_modules` existente) executam o
script negado. No projeto real, npm 11.13.0 e 11.15.0 recusam com `EBADENGINE` sem criar
`node_modules`; npm 11.16.0 (Node 24.18.0) instala com `node_modules` idêntico ao de referência e
não executa o `postinstall` de `unrs-resolver`.

**Correção.** `engines.npm` `>=11.16.0` em `package.json` (e na raiz do lockfile); `engines.node`
mantido. O CI usa Node 24.19.0 (`.nvmrc`) com npm 11.17.0 e não precisou mudar.

## Pendências

- **PRs do Dependabot (#23–#27)**, todos sobre uma base 15 commits atrás. Nenhum foi alterado:
  #23 (eslint 10.10.0) está obsoleto; #24 (vitest 5) quebra os tipos do jest-dom; #25 (react
  19.3.0) precisa vir junto com `react-dom`; #26 (Playwright 1.63.0) pode seguir após rebase e
  CI; #27 (`@types/node` 26.5.1) exige ajuste em `tests/unit/content.test.ts`. Eles ocupam o
  limite de 5 PRs de versão.
- **Actions restritas a `selected` e SHA obrigatório**: recomendado e não aplicado (alteração
  remota, depende do proprietário).
- npm < 11.16 é recusado por `engines.npm`, exceto com `--engine-strict=false` explícito ou
  `npm rebuild` sobre um `node_modules` existente. Ambos exigem ação deliberada.
- Dependabot e Vercel também passam pela checagem de `engines`; a versão de npm que usam só é
  verificável no próximo PR do Dependabot e no primeiro preview.
- Comportamento do `fsevents` em macOS não testado.
- `@types/node` 26 com runtime Node 24: desalinhamento a corrigir numa mudança própria.
- Exceção de peer do ESLint 10 (AUD01-003) continua.
- Push, PR e primeira execução do CI com estas mudanças não realizados.
