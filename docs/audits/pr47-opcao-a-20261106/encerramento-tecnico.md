# Encerramento técnico dirigido — PR #47 — 2026-11-06

**NO-GO para homologação/merge pelo processo vigente (risco 3).**
A análise técnica dirigida está encerrada. Restam inspeções humanas específicas
da #45 e decisão formal de aceite/dispensa dos gates afetados pelos riscos
residuais. Após envio autorizado do patch haverá também CI obrigatório no novo
head; o verde atual não se transfere ao futuro commit. Nenhum aceite é presumido.

## B/skip

**Causa original indeterminada; regressão do PR #47 não demonstrada.**
Coleta encerrada: zero novas execuções nesta retomada. O último par limitado
original/sincronizado WebKit já passou nas duas versões; instrumentar novamente
sem hipótese discriminante não justifica mais coleta. A telemetria pode alterar
a temporização e não recupera a sequência original sem trace. Evidências, falhas,
testes e diagnósticos preservados. Incidente não declarado corrigido. A ausência
de regressão demonstrada não garante ausência de regressão. Impacto possível:
retorno à 404 terminar em Projetos, com perda de contexto e orientação por foco.
Não se exige reprodução indefinida para encerrar esta triagem.

## Candidata e verificações

Consulta somente leitura ao GitHub confirmou head `3736977a1dad19f2a4635fac8c789fe1f0c2ccf4`,
base `0d69203e5553578c252714baed7d1e924ba685dd` e CI 42144767147 completed/success.
SHA256 dos três arquivos locais idênticos à versão revisada independentemente;
`git diff --check` aprovado. Nenhuma linha removida no ajuste incremental:
asserções de foco, URL, conteúdo, histórico, RSC, erros e controles pré-hidratação
preservadas. Aplicação, dependências e CI rastreados intactos em relação ao head.
Diagnósticos não rastreados preexistentes excluídos da candidata.

A espera pelo listener estabelece prontidão; URL Projetos e estabilidade são
exigidas antes de Voltar. Não há novo timeout fixo. A espera networkidle no retorno
antecede a verificação hidratada de Avançar; isso delimita o cenário e não prova
correção das corridas pré-hidratação. Janelas anteriores e guardas continuam.
O observador depende do único listener popstate com captura na aplicação.

Reutilizados tipos, lint, formato, revisão e resultados dirigidos já registrados
em `evidencias/bskip-continuacao/validacao.json`; hashes reconferidos em
`evidencias/encerramento-identidade.json`. Não repetidos build, suítes ou auditoria.
Não há rodada integral verde do diff final; a cobertura dirigida e seus limites
estão preservados no relatório. Não se afirma CI para o ajuste ainda não enviado.

Preparados `candidata-testes.patch` (dois testes + helper) e `mensagem-commit.txt`.
Commit ainda não criado; pacote pronto para aplicação/commit no branch do PR,
sem incluir documentação ou diagnósticos neste commit exclusivamente de testes.
Minuta substitutiva em `descricao-pr47-proposta.md`; nada atualizado remotamente.

## Risco e aceite da #45

- Comprovado nos cenários executados: skip → Tab mantém foco, queries confirmadas,
  ausência de RSC redundante, cancelamento suspenso e recuperação; controle negativo
  falha na base. Ajustes de testes revisados independentemente, CI do head verde.
- A (`:target` hospedado Chromium) e C (fragmento perdido antes da hidratação)
  reproduzidos na master e no PR: riscos preexistentes, passíveis de acompanhamento
  próprio e decisão formal. Podem afetar orientação, foco e histórico. Não estender
  automaticamente R05 ao Chromium nem dispensar homologação por preexistência.
- History API durante commit suspenso: preexistência comprovada; acompanhamento
  separado já decidido na opção A, sem declarar correção ou aceite de outros riscos.
- B/skip permanece indeterminado. Nenhuma regressão nova comprovada nestas comparações;
  não equivale a garantia de estabilidade ou aceite do risco residual.
- Aceite automatizado da correção original sustentado nos casos executados;
  homologação humana de teclado e leitor real da #45 permanece pendente.
  Dependência do App Router exige revalidação após atualização do Next.

## Roteiro humano curto — ainda não executado

Registrar pessoa, data, SO, navegador/versão, leitor/versão, URL, SHA/BUILD_ID,
latência aplicada e resultado por passo; usar o Preview identificado no relatório.

1. Sem mouse, abrir `/rota-inexistente` (repetir com `?q=2`), pressionar Tab:
   skip visível e foco identificável; Enter deve levar ao conteúdo principal.
2. Pressionar Tab logo após Enter: foco deve progredir ao link de retorno.
   Com rede lenta, aguardar o término do carregamento assíncrono e confirmar que
   o foco não retorna a main, nem há salto tardio. Registrar se não houve RSC;
   não afirmar reprodução de resposta atrasada ausente.
3. Iniciar Sobre sob rede lenta; se a 404 ainda estiver apresentada, usar skip e
   Tab. Após a rede concluir, conferir permanência, conteúdo e foco na 404.
   Se a janela não ocorrer, registrar cenário não exercitado.
4. Ativar o link de retorno por Enter; testar Voltar/Avançar e Tab/Shift+Tab:
   URL, página e foco devem permitir recuperação sem prender a navegação.
5. Repetir com leitor de tela real: conferir anúncio do skip, região principal,
   página 404 e link de retorno, ordem de leitura e orientação após carregar e
   recuperar a navegação. Registrar anúncios observados e qualquer desorientação.

Playwright não executa esta avaliação humana. T055 geral (demais rotas, zoom,
aparelho físico etc.) fica separado e aberto; R05 e T113 também não encerrados.

Próxima ação: executar e registrar o roteiro e decidir expressamente o risco
residual/gates pendentes. Autorizar separadamente push/atualização do PR quando
cabível; exigir CI do novo head. Sem merge, deploy ou dispensa nesta entrega.

## Registro histórico retirado das regras permanentes

O antigo §8 do processo tratava exclusivamente do PR #47, sem conceder novos
aceites: GO COM RESSALVAS para atualização autorizada e NO-GO para homologação/merge.
Seu roteiro exigia preservar F1/A1/PROD-001 e asserções, revisão adversarial,
validação dirigida nos três motores, identidade do Preview, CI do novo head e
inspeções humanas pertinentes. O pacote então proposto de 223 arquivos podia ser
reduzido com manifesto, acesso e integridade preservados, sem apagar originais.

As decisões sobre A (`:target` Chromium hospedado), C técnico (Avançar antes da
hidratação) e incerteza B/skip eram individuais e pendentes; não havia aceite pelo
processo. O acompanhamento separado de History API seguia a opção A. A dispensa
expressa de B humano não aceitava B/skip nem comprovava leitor real; C humano
limitava-se à cena registrada. #45/T113, T055 e R05 mantinham critérios próprios.
O fluxo encerrava com autorização de merge vinculada ao head final e verificação
pós-merge. Este registro preserva o contexto histórico, sem alterar decisões ou
substituir as evidências e pendências deste documento.
