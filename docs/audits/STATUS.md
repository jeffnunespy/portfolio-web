# Estado das auditorias

## Reconciliação — 2026-11-06

Este quadro supera os estados históricos abaixo; não representa nova auditoria.
Roteiro original de 30/10 e consolidação de 31/10:
`portfolio-auditoria03-consolidacao-20261031T012051Z/relatorio-consolidado.md`.
Versão reconciliada: master `140b34ec2d7cbd4dd4f26053c88293f235e2faca`.

| Item | Classificação e evidência vigente |
| --- | --- |
| AUD03-001/F4 | Concluído — [#36](https://github.com/jeffnunespy/portfolio-web/pull/36) integrado; F5 e inspeções humanas mantidos separadamente conforme aceites. |
| T112 | Concluído — implementação e revisão no [#40](https://github.com/jeffnunespy/portfolio-web/pull/40); controles de links com/sem JS, CI e homologação integrada no [#53](https://github.com/jeffnunespy/portfolio-web/pull/53). A decisão pública de 06/11 supera a premissa privada para a plataforma; não refazer o estado histórico privado. |
| AUD03-003 / T114 | Concluído — [#51](https://github.com/jeffnunespy/portfolio-web/pull/51), merge `8f037a6`, CI pós-merge [42293555651](https://github.com/jeffnunespy/portfolio-web/actions/runs/42293555651) e validação dirigida Production registrados no PR. |
| AUD03-004 / T115 | Concluído — PDF obrigatório confirmado pelo proprietário e implementado no [#52](https://github.com/jeffnunespy/portfolio-web/pull/52), merge `17753a0`; CI pós-merge [42319282832](https://github.com/jeffnunespy/portfolio-web/actions/runs/42319282832), download e bytes preservados em Production. |
| AUD03-002 / 005; T116 / T117 | Concluído — [#53](https://github.com/jeffnunespy/portfolio-web/pull/53), merge `140b34e`; matriz de disponibilidade e indicação completa do cartão privado validadas. CI pós-merge [42323527710](https://github.com/jeffnunespy/portfolio-web/actions/runs/42323527710): 155 unitários, 210 funcionais, 27 a11y, sem retries. Production identificada e homologada; 16 cenários, quatro axe e A1 dirigido 1/1 sem retry registrados no PR. |
| F1 / A1 | Concluído o escopo integrado nos [#41](https://github.com/jeffnunespy/portfolio-web/pull/41) e [#44](https://github.com/jeffnunespy/portfolio-web/pull/44). A ocorrência A1 do #53 permanece ressalva aceita, causa indeterminada, responsável @jeffnunespy e acompanhamento naquele PR; PASS posterior não comprova correção da causa. |
| PROD-001 / T113 / #45 | Concluído — [#46](https://github.com/jeffnunespy/portfolio-web/pull/46) e [#47](https://github.com/jeffnunespy/portfolio-web/pull/47), com CI/homologação pós-merge registrados. #45 encerrada; riscos seguem na #49. |
| SECURITY.md | Concluído — repositório público confirmado pela API. Consulta somente leitura a `GET /repos/jeffnunespy/portfolio-web/private-vulnerability-reporting` retornou `{"enabled":true}`; página pública Security retornou 200 e oferece “Report a vulnerability” para o destino documentado. Canal preservado, sem envio de relato ou mudança de configuração. |
| Conteúdo residual | Concluído o exame editorial: “auditável” em perfil/PRODUCT tem sustentação no código público autorizado no #53. O fallback do Footer aponta ao perfil GitHub, que agora contém o código público; não há promessa inacessível demonstrada. “Link em formato inválido” descreve validação sintática, sem prometer disponibilidade HTTP. Nenhuma correção obrigatória; eventual preferência de redação não bloqueia encerramento. |
| F5 | Em acompanhamento independente — riscos residuais aceitos no alcance do #36; alto contraste real quando disponível, impressão/lazy/rasterização nos gatilhos registrados. Não corrigido nem encerrado. |
| T055 | Em acompanhamento independente — inspeções humanas restantes conforme aceites do #36; responsável proprietário, revisão até 04/12/2026 ou mudança relevante. Automação não encerra a tarefa. |
| R05 / #49 | Em acompanhamento independente — [#49](https://github.com/jeffnunespy/portfolio-web/issues/49) aberta, @jeffnunespy responsável por A/C/B-skip/L; History API separado. Coleta B encerrada, reabrir somente por fato discriminante novo. R05 não abrange automaticamente Chromium hospedado. |
| AUD04 | Concluído no [#50](https://github.com/jeffnunespy/portfolio-web/pull/50); não reaberto. AUD05 não iniciada. |

**Encerramento formal: AUD03 CONCLUÍDA COM RESSALVAS**, vinculado à versão
acima e aos aceites existentes. Não é conformidade integral nem encerramento de T055,
F5, R05, #49 ou da ressalva A1. Nenhuma correção objetiva ou decisão técnica indispensável
restante identificada no roteiro; publicação documental autorizada em branch própria e PR; merge exige
autorização específica para PR e SHA final.
Os limites de cobertura permanecem nos PRs: não se promove dispensa a inspeção humana.
Evidências reaproveitadas; nenhum teste repetido, nova auditoria ou alteração de aplicação.

## Histórico (superado onde divergir do quadro acima)

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
