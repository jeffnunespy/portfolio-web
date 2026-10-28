# Auditoria 01 — Integridade e reprodutibilidade

Etapa de correção e validação, executada em 2026-10-28 numa cópia isolada reconstruída a partir de
`HEAD` (`9a90166`) + diff da árvore de trabalho + arquivos não rastreados, com hashes conferidos
contra o original antes de qualquer alteração. Branch: `docs/visual-oficial-minimalismo-escuro`.

## Ambiente da validação

| Item       | Versão                                           |
| ---------- | ------------------------------------------------ |
| Node.js    | 24.19.0 (mínimo também validado em 24.15.0)      |
| npm        | 11.17.0 (11.13.0 com Node 24.15.0)               |
| Playwright | 1.62.1, Chromium 1248                            |
| SO         | Linux 7.0.0 (local; CI fixado em `ubuntu-24.04`) |

## Achados

| ID        | Problema                                         | Correção                                                                                                                                                                    | Arquivos                                                                                       | Validação                                                                       |
| --------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| AUD01-001 | Estado atual fora do Git (`BuildEvidence.tsx`)   | Snapshot reproduzido em outro diretório (HEAD + diff + não rastreados), hashes idênticos. Commit não criado: depende de autorização.                                        | —                                                                                              | Status e SHA-256 da cópia iguais ao original; gates completos na cópia          |
| AUD01-002 | `24.x` aceita Node abaixo do piso de `jsdom@30`  | `engines.node` `^24.15.0`; `.nvmrc` 24.19.0; `engine-strict` em `.npmrc`; CI lê `.nvmrc`                                                                                    | `package.json`, `package-lock.json`, `.nvmrc`, `.npmrc`, `ci.yml`                              | Gates em 24.15.0 e 24.19.0; `npm ci` em 22.23.1 falha com `EBADENGINE`          |
| AUD01-003 | Plugins sem peer declarado para ESLint 10        | Exceção documentada (não há versão compatível publicada); teste que prova que as regras dos três plugins reportam                                                           | `tests/unit/eslint-plugins.test.ts`, `README.md`                                               | `npm ci` e `npm run lint` limpos; teste novo aprovado                           |
| AUD01-004 | Planejados consumiam o teto de 6 destaques       | Contagem só de `real && destaque`                                                                                                                                           | `lib/content.ts`, `tests/unit/content.test.ts`                                                 | 6 cenários; mutação revertendo a correção derruba 2 deles                       |
| AUD01-005 | `next/font/google` depende de rede no build      | Mantido; condição documentada                                                                                                                                               | `README.md`                                                                                    | Build frio sem rede falha; com `.next/cache` aquecido passa offline             |
| AUD01-006 | CI compilava 3 vezes                             | `E2E_BUILD_EXISTENTE=1` serve o build do gate; exige `.next/BUILD_ID`; passo que registra commit e `BUILD_ID`                                                               | `playwright.config.ts`, `ci.yml`                                                               | Sequência do CI: 1 build, `BUILD_ID` igual antes/depois, nenhum rebuild nos E2E |
| AUD01-007 | E2E reaproveitava servidor desconhecido na 3001  | `reuseExistingServer` só com `E2E_REUTILIZAR_SERVIDOR=1` e nunca no CI                                                                                                      | `playwright.config.ts`                                                                         | Servidor falso na 3001: padrão e CI recusam; opt-in reaproveita                 |
| AUD01-008 | `passWithNoTests` aprovava suíte vazia           | Opção removida                                                                                                                                                              | `vitest.config.ts`                                                                             | Filtro sem arquivos: saída 0 → 1                                                |
| AUD01-009 | README com `npm install` e preparo implícito     | Procedimento com `npm ci`, Node, Chromium, dependências Linux, modos E2E e reprodução isolada                                                                               | `README.md`, `CLAUDE.md`                                                                       | Comandos executados nesta auditoria                                             |
| AUD01-010 | Documentos divergentes do código                 | Matriz de validação, piso do Node, regra de destaque e status da spec atualizados; divergência do PDF registrada                                                            | `data-model.md`, `quickstart.md`, `next16-compatibility.md`, `spec.md`, `CHECKLIST_PUBLICACAO` | Revisão manual contra `lib/content.ts`                                          |
| AUD01-011 | Suítes E2E sobrescreviam relatório e artefatos   | `outputDir` e relatório HTML por grupo (`E2E_GRUPO`); reporter `list` no log; upload por suíte com `if: !cancelled()`, 14 dias                                              | `playwright.config.ts`, `package.json`, `ci.yml`                                               | Após as duas suítes, `funcional/` e `a11y/` coexistem                           |
| AUD01-012 | `ubuntu-latest`, Node `24`, npm não registrados  | `ubuntu-24.04`, Node de `.nvmrc`, passo que imprime runner, Node, npm e Playwright                                                                                          | `ci.yml`                                                                                       | Revisão do workflow; execução no GitHub ainda não observada                     |
| AUD01-013 | Metadados sem cobertura de roadmap, origem, etc. | `/roadmap` na lista; canonical, `og:url` e `og:image` absolutos na origem resolvida por `lib/site.ts`; sitemap exato; robots; origem `https://portfolio.example` nos testes | `tests/e2e/metadata.spec.ts`, `playwright.config.ts`, `ci.yml`                                 | 10 testes novos; build com outra origem reprova 9 deles                         |

## Pendências

- **Consolidação Git (AUD01-001).** Nenhum commit foi criado. O conjunto a versionar é toda a
  árvore de trabalho atual: as alterações rastreadas, a exclusão de
  `components/home/SurveyOpening.tsx` e os 41 arquivos não rastreados (código em
  `components/home/BuildEvidence.tsx`; os demais são documentação, auditorias visuais e
  referências). Nenhum deles é artefato gerado; os gerados (`.next/`, `test-results/`,
  `playwright-report/`, `tsconfig.tsbuildinfo`, `next-env.d.ts`) já estão no `.gitignore`.
- **`linkCurriculo` (AUD01-010).** FR-015 e a tabela de `PerfilProfissional` em `data-model.md`
  tratam o PDF como obrigatório; o schema o aceita ausente. Decisão do proprietário: tornar o campo
  obrigatório no schema ou registrar a exceção na spec.
- **ESLint 10 (AUD01-003).** Remover a exceção quando os plugins declararem ESLint 10.
- **Fonte (AUD01-005).** A Google Fonts pode publicar outra revisão da Geologica; builds frios em
  datas diferentes podem receber arquivos diferentes.
- **Primeira execução do workflow alterado** no GitHub Actions (versões impressas, upload de
  artefatos, `node-version-file`) ainda não foi observada.
- **SEO (fora do escopo).** `/roadmap` não tem imagem Open Graph própria; páginas 404 herdam o
  canonical da home. Ficam para a auditoria de SEO.
