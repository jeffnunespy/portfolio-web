# Processo de desenvolvimento, auditoria e integração

## 1. Um registro e um fluxo

O PR é o registro principal da correção: problema/critério de aceite, escopo,
risco, evidências, ressalvas e decisão. Use o [template](../../.github/pull_request_template.md)
com uma linha por seção quando suficiente. Não criar relatório por rodada, parecer
em vários arquivos ou cópias de logs já acessíveis. Auditoria transversal pode ter
um registro próprio somente quando o PR não comportar seu escopo, com justificativa.

1. Inspecionar estado do Git, spec/plano/tarefa e consumidores do trecho afetado.
2. Classificar risco, definir critérios e selecionar verificações pertinentes.
3. Implementar e validar o diff; reutilizar resultados válidos (§4).
4. Registrar no PR resultados, revisão exigida e pendências. Uma atualização
   substitui o estado vigente; histórico fica na conversa e no Git.
5. Após autorização, commit/push; exigir CI do novo head e homologação pertinente.
6. Autorizar merge separadamente; verificar o resultado integrado (§7).

`STATUS.md` serve de índice, não de cópia do PR. `ACTIVE_CONTEXT.md` recebe apenas
mudanças relevantes do estado da feature/operação e links. Tarefas só são encerradas
quando seus critérios forem atendidos; uma aprovação parcial não encerra a feature.

## 2. Risco e gates proporcionais

Classificar pelo impacto potencial, não pela quantidade de linhas. Mudanças que
possam enfraquecer gates, inclusive governança, são nível 3. PR misto assume
o maior nível. Na dúvida, utilizar o nível superior. Preservar a classificação
até revisão fundamentada, registrada no PR; um incremento só de testes/docs não
rebaixa o risco dos demais trechos do PR.

| Gate                       | 1 — baixo                                                       | 2 — moderado                                                              | 3 — alto                                                                              |
| -------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Exemplos                   | Docs editoriais, texto, visual isolado sem semântica/foco/dados | Componentes, schema, comportamento acessível, minor/patch de dependências | Segurança, concorrência, histórico, infraestrutura, CI/gates, Node, majors Next/React |
| `quality` completo no head | Obrigatório                                                     | Obrigatório                                                               | Obrigatório                                                                           |
| Verificação local          | Formato, links e diff; teste se houver comportamento            | Lint/tipos/testes dos caminhos afetados                                   | Verificações dos fluxos críticos e integrações afetadas                               |
| Regressão automatizada     | Quando houver comportamento                                     | Obrigatória quando aplicável                                              | Obrigatória para comportamento; correção exige controle negativo pertinente           |
| Revisão independente       | Opcional                                                        | Obrigatória                                                               | Obrigatória e adversarial                                                             |
| Preview                    | Se houver efeito visível                                        | Rotas/fluxos afetados                                                     | Homologação aprofundada dos fluxos de risco afetados, com identidade                  |
| Firefox/WebKit             | Se o impacto justificar                                         | Quando o risco depender do navegador                                      | Obrigatórios quando afetar navegação, foco ou histórico                               |

Mudança puramente documental de governança não exige teste artificial nem controle
negativo de aplicação: a revisão adversarial examina perda de controles e coerência.
Não é necessário criar uma nova regressão para cada ajuste que já tenha cobertura
adequada; referenciar o teste e justificar no PR.

O CI continua com auditoria de produção, formato, lint, tipos, unitários, build,
E2E funcional e a11y; nenhum passo ou proteção da master é alterado por este processo.
Localmente, rodar o que discrimina a mudança. Não repetir o pipeline inteiro antes
e depois de cada commit. Falha conhecida relevante deve ser tratada, não ignorada.

Homologação é direcionada, inclusive no nível 3. Ampliar para toda a aplicação
quando houver impacto global, incluindo, quando aplicável, CSP e headers HTTP,
configuração da Vercel, workflows e CI/CD, runtime Node, atualizações major do
Next.js ou React e navegação compartilhada. Avaliar o alcance real e justificar
no PR; manter homologação direcionada quando o impacto for efetivamente localizado.
Mudança de CI exige observar gatilhos/checks reais no GitHub, não simular aprovação localmente.

Manter WCAG 2.1 AA: axe nas rotas afetadas e avaliação humana pertinente de teclado,
foco, semântica, contraste, cores forçadas e responsividade. Quando o critério exigir
leitor real, automação não o substitui. T055 mantém seus critérios gerais; não é
reexecutada inteira a cada correção isolada nem encerrada por aprovação automatizada.

## 3. Revisão, defeitos e bloqueios

Revisor independente não produziu o patch: outra pessoa ou agente em sessão separada.
O revisor deve receber PR, diff, requisitos e evidências acessíveis, sem depender
da interpretação do autor. Identificar o head avaliado no parecer. Alteração
posterior em código coberto exige revisão independente do delta afetado; preservar
o parecer das partes equivalentes conforme §4. No nível 3, explorar
controles negativos, concorrência e entradas pertinentes, sem repetir sondas concluídas.
Registrar revisor, escopo/head, achados e parecer no PR; não encadear auditores por rotina.

Severidades: P0 compromete segurança/dados/site em Production; P1 quebra fluxo
importante ou gate; P2 é limitação relevante com contorno/cobertura insuficiente;
P3 é melhoria. Separar severidade, causalidade e etapa bloqueada.

Merge bloqueado por `quality` ausente/pendente/vermelho no head atual, teste removido,
pulado ou afrouxado sem justificativa/validação, flaky novo na área de risco ou gate
não cumprido/dispensado expressamente. `quality` e proteção da master não são dispensáveis.
P0/P1 confirmado exige correção ou decisão formal do proprietário no PR com risco,
justificativa e acompanhamento; o agente não concede aceite. Risco indeterminado
com potencial impacto P0/P1 recebe o mesmo tratamento conservador, mantendo
bloqueada a etapa potencialmente afetada até decisão expressa do proprietário.

Preexistência exige evidência comparável e não implica aceite. Separar regressão,
defeito preexistente e causa indeterminada. Um achado independente pode seguir em
issue própria, mas qualquer gate afetado ainda requer resultado ou dispensa expressa.
Aceite deve nomear impacto, incertezas, evidência, responsável/próxima ação e etapa
que libera (atualização do PR, homologação ou merge). Não aceitar toda uma auditoria.

## 4. Evidência mínima, reutilização e retenção

No PR, vincular CI e registrar comando/cenário, resultado, data e versão avaliada.
Para build/Preview, incluir SHA, BUILD_ID e origem; para dependência de navegador,
versão/motor. Para inspeção humana, pessoa, ambiente e observações reais. Não inventar
resultado nem apresentar repetição positiva como apagamento de falha anterior.

Reutilizar somente quando a equivalência técnica estiver demonstrada. Identificar
no PR os arquivos efetivamente cobertos, incluindo código, configuração de testes
e imports relevantes, além de dependências/runtime e ambiente. Comprovar equivalência
por hashes desses arquivos ou comparação de patches com `git patch-id --stable`,
considerando também lockfile e `.nvmrc`; comparar origem de build/E2E quando a
evidência depender dela. Registrar a associação e sua justificativa de forma breve
no PR. Não presumir que alterações em `content/` ou `public/` sejam puramente
documentais: avaliar consumo, validações e efeitos no build e na aplicação. Mudança
editorial sem efeito no comportamento não invalida teste funcional por si só; mudança
em código coberto, imports, dependência, configuração de testes, origem relevante
ou conflito resolvido manualmente invalida a parte afetada.
Novo commit sempre exige CI próprio; evidência local não substitui `quality`.

Preferir links para Actions, Preview identificado e anexos acessíveis ao revisor.
Versionar somente o que é necessário para reproduzir ou compreender a decisão;
evitar árvores completas de resultados, caches, screenshots repetidos e ZIPs de cada rodada.
Para material essencial externo: URL acessível ao revisor, SHA256 e prazo de retenção.
Conferir acesso e expiração antes do merge; se expirar antes da revisão, preservar
uma cópia mínima em local autorizado ou versionar o artefato indispensável. `/tmp`
e links privados inacessíveis não são evidência compartilhada. Remover segredos antes
de compartilhar; hash não torna um arquivo sensível seguro.

Preservar evidências históricas que sustentam decisões. Redução de pacote já preparado
exige manifesto atualizado e preservação dos elementos que sustentam a decisão.

## 5. Encerramento de investigação inconclusiva

Definir pergunta, hipótese discriminante, cenários e limite de coleta antes de investigar.
Na ausência de limite específico, fazer uma rodada dirigida e, se surgir hipótese nova,
uma rodada de controle. Ampliação só com justificativa e próximo resultado discriminante.
Não repetir execução idêntica apenas para obter verde ou tentar provar ausência de bug.

Encerrar a coleta como **inconclusiva** quando: (a) resultados e falhas estão preservados;
(b) hipóteses testadas e limites foram registrados; (c) não existe nova hipótese testável
com os dados/meios disponíveis; e (d) impacto possível e próximo responsável/ação estão
indicados. Registrar tudo no PR, sem novo relatório. O limite de rodadas não autoriza
encerrar se ainda houver uma hipótese discriminante viável; justificar a extensão.

Encerrar investigação não significa corrigir o incidente, aprovar gate ou aceitar risco.
Defeito confirmado continua aberto; risco indeterminado exige decisão proporcional ao
impacto; se houver potencial P0/P1, aplicar o tratamento conservador do §3 até
decisão expressa. Reabrir por erro demonstrado na análise anterior ou fato novo:
trace discriminante, reprodução nova, mudança no código/ambiente relevante ou falha
em gate. Retomada de sessão não é fato novo.

## 6. Autorizações e decisões por etapa

O proprietário pode autorizar um conjunto de operações como commit, push e
atualização do PR, vinculado à branch e ao conjunto exato de arquivos ou ao patch-id
do diff autorizado. Não solicitar confirmação a cada subetapa já autorizada.
Alterações materiais fora desse escopo exigem nova aprovação antes de executá-las.
Force-push, reescrita de histórico, marcar PR como pronto e auto-merge não estão
incluídos em autorizações genéricas; exigem autorização explícita própria.
Rejeição automática de aprovação deve ser comunicada com ação e motivo, sem contorno.

Separar sempre: aptidão para commit/push, homologação e merge. Risco pendente de aceite
para merge não impede atualizar o PR com ressalvas, desde que não exponha segredos nem
represente resultado falso. Preview inacessível ou gate humano não executado permanece
pendente até validação ou dispensa expressa, com cenário e verificação posterior definidos.

Merge exige autorização específica para aquele PR e head final; novo commit invalida
essa autorização. Nenhuma autorização de commit/push inclui merge, auto-merge, promoção
ou deploy. Não alterar ruleset, fazer bypass ou push direto na master. Fluxo Git em
[CONTRIBUTING](../../CONTRIBUTING.md).

## 7. Verificação após merge autorizado

Exigir `quality: success` na execução de evento `push` da `master` para o SHA
integrado. Confirmar que o deployment de Production corresponde ao mesmo SHA
antes da promoção automática ao domínio público. Conferir o evento `push` é regra
deste processo, não garantia configurada na Vercel, cujo Deployment Check avalia
o check `quality` associado ao commit.
Verificar rotas/recursos afetados, status esperados, axe e overflow em 390/1280 quando
houver interface afetada; no nível 3, repetir smoke dos fluxos críticos tocados e das
integrações pertinentes. Smoke completo da aplicação é exigido quando houver impacto
global justificado, não apenas pelo rótulo de risco. Incorporar verificações prometidas
em dispensas; se exigência aprovada específica for maior, ela prevalece.

Registrar no próprio PR: head revisado, SHA integrado, URL/ID e tentativa da
execução de CI da master, resultado do `quality`, ID/URL do deployment Vercel,
ambiente, SHA associado, alias público e BUILD_ID efetivamente servido. O
BUILD_ID servido identifica o build da Vercel; como CI e Vercel compilam de forma
independente, os identificadores podem ser distintos, e sua comparação não
comprova o vínculo, que se comprova pelo SHA.
Registrar os horários de conclusão do check e de promoção quando observáveis;
distinguir a associação ao SHA da comprovação temporal de espera.

Se o build terminar antes do CI, comprovar que o deployment aguarda aprovação
e que o domínio ainda serve a versão anterior, registrando o BUILD_ID durante
a espera e após a promoção. Se o CI terminar primeiro, registrar que a espera
não foi observada. Havendo integrações concorrentes, conferir a ordem de
promoção e se uma versão antiga substituiu indevidamente uma posterior.

Em bloqueio, preservar a versão pública anterior, conferir SHA e resultado do
check e distinguir falha do código, do CI ou da associação na Vercel. Propor a
menor intervenção necessária, respeitando as autorizações vigentes. Não remover
o Deployment Check nem desativar a proteção da master para liberar a publicação.
`Force Promote` é exceção administrativa com autorização específica e registro,
não um procedimento automático de recuperação. Nova publicação ou rollback
exige autorização própria e identificação da versão de destino.

Falha vira pendência vinculada;
P0/P1 pede avaliação de reversão por `git revert` em PR próprio. Atualizar `STATUS.md`
só quando mudar o estado da auditoria. Verificação posterior não dispensa gate anterior
sem decisão expressa nem autoriza deploy por si só.

## 8. Limites conhecidos da suíte

O CI cobre Chromium e build local na porta 3001. Na Vercel os chunks usam
`/_next/static/immutable/chunks/`; interceptações locais podem não casar. Adaptar
harness hospedado preservando guardas e asserções, sem declarar equivalência automática.

R05: orientação por fragmento (:target, foco e rolagem) no retorno não garantida em
Firefox/WebKit; asserção :target da suíte cobre Chromium. Limitações observadas
em outros motores ou ambientes exigem evidência própria; não são automaticamente
abrangidas por R05. Evidências históricas: [AUD03/F1 — PR #41](https://github.com/jeffnunespy/portfolio-web/pull/41)
e [encerramento técnico dirigido AUD03](pr47-opcao-a-20261106/encerramento-tecnico.md).
