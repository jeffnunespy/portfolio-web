# Estado das auditorias

## Reconciliação — 2026-11-06

Este quadro supera os estados históricos abaixo; não representa nova auditoria.
Roteiro: inventário original AUD03 de 30/10 e consolidação de 31/10
(`portfolio-auditoria03-consolidacao-20261031T012051Z/relatorio-consolidado.md`).
Base da preparação atual: master `17753a097248f2c0482954c357ad111f38354c4a`.

| Frente            | Estado vigente / próxima ação                                                                                                                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUD03-001/F4      | [#36](https://github.com/jeffnunespy/portfolio-web/pull/36) integrado; não repetir correção ou validações concluídas.                                                                                                                                                               |
| T112              | [#40](https://github.com/jeffnunespy/portfolio-web/pull/40) integrado; implementação entregue. Registro histórico em tasks.md ainda não comprova todos os gates hospedados para encerramento formal; reconciliar evidência existente, sem refazer testes.                           |
| F1 / A1           | [#41](https://github.com/jeffnunespy/portfolio-web/pull/41) e [#44](https://github.com/jeffnunespy/portfolio-web/pull/44) integrados; ressalvas preservadas.                                                                                                                        |
| PROD-001          | Encerrado tecnicamente: [#46](https://github.com/jeffnunespy/portfolio-web/pull/46), merge `0d69203`; CI 42122200149 e homologação Production nos três motores registrados no relatório 06 do pacote permanente `auditorias/portfolio-web/aud03/prod-001/relatorios/`. Não reabrir. |
| #45/T113          | [#47](https://github.com/jeffnunespy/portfolio-web/pull/47) integrado; #45 encerrada após CI/smoke pós-merge.                                                                                                                                                                       |
| AUD04             | [#50](https://github.com/jeffnunespy/portfolio-web/pull/50) concluído, CI e homologação pós-merge registrados. AUD05 não definida; não iniciar.                                                                                                                                     |
| AUD03-003         | Concluída pelo [#51](https://github.com/jeffnunespy/portfolio-web/pull/51), merge `8f037a6`; CI pós-merge e validação dirigida Production aprovados, registrados no PR.                                                                                                             |
| AUD03-004         | Concluída pelo [#52](https://github.com/jeffnunespy/portfolio-web/pull/52), merge `17753a0`; CI e validação dirigida Production aprovados, registrados no PR.                                                                                                                       |
| AUD03-002 / 005   | T116/T117 preparadas em `fix/aud03-002-disponibilidade-codigo`: aviso com demo, cartão privado completo e divulgação pública da plataforma autorizada em 06/11. Pendentes de CI, Preview e integração.                                                                              |
| SECURITY.md       | Premissa histórica superada: API atual informa visibility=public. Confirmar relato privado habilitado e acessível antes de encerrar; não trocar canal sem essa confirmação.                                                                                                         |
| F5                | Riscos residuais aceitos no alcance do #36; acompanhamento aberto, não correção pendente automática. Reavaliar alto contraste quando disponível e impressão/lazy/rasterização nos gatilhos registrados no PR.                                                                       |
| T055              | Inspeções humanas restantes em acompanhamento, conforme aceites do #36; revisão até 04/12/2026 ou mudança relevante. Automação não encerra a tarefa.                                                                                                                                |
| R05 / #49         | Acompanhamentos independentes. #49 aberta com responsável @jeffnunespy: A/C/B-skip/L e History API separado. Coleta B encerrada; reabrir somente por fato discriminante novo. R05 não abrange automaticamente Chromium hospedado.                                                   |
| Conteúdo residual | “Auditável” no perfil/PRODUCT, fallback do Footer e texto de formato inválido seguem para disposição editorial separada.                                                                                                                                                            |

AUD03 continua aberta pelos achados restantes. A premissa privada do [PR #40](https://github.com/jeffnunespy/portfolio-web/pull/40)
foi superada para a plataforma; os avisos/CTAs de outros projetos privados permanecem.
Nenhum aceite anterior equivale a autorização de novo merge.

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
