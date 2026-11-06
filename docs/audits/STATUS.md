# Estado das auditorias

Registro único do estado de cada auditoria e pendência. O detalhe fica no relatório ou no PR
indicado; aqui só entram estado, onde está a evidência e o que falta. Estados seguem
[`PROCESSO.md`](PROCESSO.md); uma auditoria só é encerrada com evidência registrada.

Atualizado em 2026-11-03, sobre a `master` em `cafc77e`.

## Auditorias

| ID         | Escopo                                                  | Estado                                         | Evidência                                                                                                                                                          | Em aberto                                                                                              |
| ---------- | ------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| AUD01      | Integridade e reprodutibilidade                         | Concluída com ressalvas                        | [Relatório](auditoria-01-integridade-reprodutibilidade.md)                                                                                                         | Pendências na seção própria do relatório                                                               |
| AUD02      | Dependências, superfície HTTP do Next.js e runtime Node | Concluída com ressalvas                        | [Etapa 3](auditoria-02-etapa3-dependencias.md), [Etapa 4](auditoria-02-etapa4-next-http.md), [Node](auditoria-02-followup-node-runtime.md); PRs #30, #31, #34, #35 | Pendências de cada relatório; T055                                                                     |
| AUD03      | Links para o repositório privado (T112)                 | Integrada no PR #40; pendências em aberto      | PR #40; `docs/ACTIVE_CONTEXT.md`, seção "Auditoria 03"                                                                                                             | "Auditável" no perfil e em `PRODUCT.md`, fallback do `Footer.tsx`, texto de "link em formato inválido" |
| AUD03/F1   | Navegação de histórico por fragmento                    | GO PRODUCTION COM RESSALVAS — PR #41 integrado | PR #41 (validação, ressalvas 1–5 aceitas)                                                                                                                          | Ressalvas do PR #41; R05; T055                                                                         |
| AUD03/F4   | AUD03-001 — fallback neutro de imagem                   | PR #36 em Draft                                | PR #36                                                                                                                                                             | T055; gates de nível do [`PROCESSO.md`](PROCESSO.md)                                                   |
| Impeccable | Revisões de design de 2026-10-23 e 2026-10-24           | Registro histórico; estado formal não definido | [10-23](impeccable-2026-10-23.md), [10-24](impeccable-2026-10-24.md), [correções](impeccable-2026-10-24-correcoes.md)                                              | Definir estado com o proprietário                                                                      |

## Pendências abertas

| ID          | Situação                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T055        | Inspeções humanas de publicação (teclado, foco, zoom, leitor de tela real, aparelho físico)                                                                   |
| PROD-001    | Aberta. Definida nas evidências da Auditoria 03, ainda não versionadas                                                                                        |
| F5          | Aberta: riscos residuais do fallback da F4 (fundo CSS sem lazy nativo, alto contraste, rasterização, impressão); alcance do aceite a confirmar                |
| SECURITY.md | Aberta: `.github/SECURITY.md` aponta para os advisories de um repositório privado                                                                             |
| R05         | Limitação funcional conhecida: `:target`, foco e rolagem por fragmento em Firefox/WebKit ([`PROCESSO.md`, §8](PROCESSO.md#8-limites-conhecidos-da-suíte))     |
| Ruleset     | Verificar: a API de rulesets responde 403 com o repositório privado no plano gratuito; a proteção descrita no `CONTRIBUTING.md` pode não estar sendo aplicada |
