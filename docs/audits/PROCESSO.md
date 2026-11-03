# Processo de auditoria e integração

Validação proporcional ao risco, com evidência reaproveitada quando continua válida. A
constituição (`.specify/memory/constitution.md`) e a spec da feature prevalecem sobre este
documento. O fluxo de branch, PR e CI está em [`CONTRIBUTING.md`](../../CONTRIBUTING.md); o
estado das auditorias, em [`STATUS.md`](STATUS.md).

## 1. Classificação de risco

O nível é dado pelo impacto potencial da alteração, não pelo tamanho do diff. Na dúvida, use o
nível acima. O nível declarado no PR vale até que uma revisão o conteste; um PR que mistura
alterações assume o nível da mais arriscada.

| Nível            | Alcance                                                                                                                                                                             | Exemplos neste repositório                                                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 — baixo**    | Documentação, texto editorial e ajuste visual isolado, sem mudar estrutura, foco, semântica ou dados                                                                                | `docs/`, README, cópia em `content/` sem campo novo, cor ou espaçamento numa única regra CSS                                                                                                    |
| **2 — moderado** | Componentes, funcionalidades, comportamento acessível, schema de conteúdo, dependências sem major                                                                                   | `components/`, rotas em `app/`, `lib/content.ts`, foco/teclado/ARIA, PRs de minor/patch do Dependabot                                                                                           |
| **3 — alto**     | Segurança relevante, autenticação, concorrência, navegação crítica, arquitetura ou infraestrutura sensível. Inclui o que pode enfraquecer um gate ou mudar o que chega a Production | headers e CSP (`next.config.js`), histórico e fragmentos (`FragmentHistory`), workflows e permissões do Actions, configuração do Playwright, Node, majors de Next/React, configuração da Vercel |

## 2. Gates por nível

| Gate                                               | Nível 1                  | Nível 2                         | Nível 3                                                                 |
| -------------------------------------------------- | ------------------------ | ------------------------------- | ----------------------------------------------------------------------- |
| Check `quality` verde no head do PR                | Obrigatório              | Obrigatório                     | Obrigatório                                                             |
| Testes pertinentes locais (skill `verify-changed`) | Obrigatório              | Obrigatório                     | Obrigatório                                                             |
| Teste novo ou ajustado que cubra a mudança         | Se houver comportamento  | Obrigatório                     | Obrigatório, com controle negativo: o teste falha sem a correção        |
| Revisão independente                               | Opcional                 | Obrigatória                     | Obrigatória e adversarial                                               |
| Preview                                            | Rota afetada, se visível | Homologação das rotas afetadas  | Homologação aprofundada dos fluxos de risco, com identidade do artefato |
| Outros motores (Firefox/WebKit)                    | —                        | Quando o risco for de navegador | Obrigatório para navegação, foco e histórico                            |
| Autorização expressa do proprietário               | Obrigatória              | Obrigatória                     | Obrigatória                                                             |

O CI cobre só Chromium; outros motores rodam localmente com configuração própria registrada
nas evidências. Para mudanças de CI ou de configuração de testes, a homologação é observar os
gatilhos e os checks no GitHub depois de abrir o PR: teste local não reproduz o Actions.

## 3. Revisão independente

Feita por quem não produziu o patch: outra pessoa, ou um agente em sessão separada, que recebe o
PR e o diff, não o raciocínio do autor. Revisão adversarial (nível 3) tenta quebrar a
alteração: escreve controles negativos, explora concorrência, temporização e entradas fora do
padrão, e mostra o caminho de falha de cada achado.

Severidade dos achados:

- **P0** — quebra segurança, dados ou o site em Production;
- **P1** — defeito confirmado num fluxo importante ou gate que deixa de proteger;
- **P2** — defeito com contorno, cobertura insuficiente ou ressalva relevante;
- **P3** — melhoria, clareza, documentação.

O parecer vai para o PR (seção "Parecer" do template) com nível revisado, achados por
severidade e o head avaliado.

## 4. Reutilização de evidências

Uma evidência pode ser reaproveitada sem reexecução quando tudo abaixo continua igual:

- o código avaliado: mesmo commit, ou mesmo diff comprovado por `git patch-id --stable`;
- o `package-lock.json` e a versão do Node (`.nvmrc`);
- a origem `NEXT_PUBLIC_SITE_URL` usada no build e nos E2E;
- o registro: execução do Actions, log ou relatório com data, SHA e `BUILD_ID`.

O resumo de cada execução do CI registra evento, commit, head e base do PR e `BUILD_ID`. Cite
esse resumo em vez de copiar contagens.

Rebase ou merge da `master` sem conflito e com `patch-id` igual preserva a revisão
independente; o CI roda de novo sozinho. Qualquer alteração em arquivo coberto, conflito
resolvido à mão, atualização de dependência ou mudança de Next/React invalida a evidência
afetada. Uma reexecução local só substitui o CI quando o CI não pode rodar, e o motivo fica
registrado.

## 5. Critérios de bloqueio

O merge fica bloqueado enquanto houver:

- P0 ou P1 confirmado sem correção. A alternativa é uma decisão formal do proprietário no PR,
  com o risco aceito, a justificativa e a tarefa de acompanhamento;
- check `quality` vermelho, pendente ou ausente no head atual;
- teste removido, pulado ou afrouxado sem justificativa e validação no próprio PR;
- teste instável novo na área de risco do PR (o CI o anota como _flaky_). Fora dessa área, ele
  é registrado como ressalva;
- gate do nível não cumprido nem dispensado expressamente pelo proprietário.

## 6. Autorização de merge

O merge exige autorização expressa do proprietário para aquele PR e aquele head. A autorização
não se transfere para outro PR nem sobrevive a um novo commit. Agentes não fazem merge, não
marcam PR como pronto, não promovem para Production e não habilitam auto-merge sem esse pedido.

## 7. Validação de Production

Depois do merge:

1. o CI do `push` na `master` precisa passar no commit de merge;
2. o deploy de Production precisa apontar para esse commit (painel ou `vercel inspect`);
3. a verificação acompanha o nível: rota afetada com HTTP 200 (nível 1); rotas e recursos
   afetados, mais axe nelas (nível 2); smoke completo do nível 3 — rotas com 200, 404 esperados,
   recursos estáticos, axe e ausência de overflow em 390/1280 px.

Falha nesse passo vira achado no `STATUS.md` e, se for P0/P1, pede reversão (`git revert` em PR
próprio).

## 8. Limites conhecidos da suíte

- Os E2E testam o build local servido na porta 3001, não o Preview. Na Vercel os chunks ficam em
  `/_next/static/immutable/chunks/`; localmente, em `/_next/static/chunks/`. Testes que
  interceptam chunks (`historico-fragmentos.spec.ts`) não casam com a Vercel e falham na guarda
  explícita (`retidos > 0`), sem falso positivo. Ao homologar Preview com script próprio,
  ajuste o padrão.
- R05: a orientação por fragmento (`:target`, foco e rolagem) ao voltar de outra rota não é
  garantida em Firefox e WebKit; o teste confere `:target` só no Chromium. É limitação funcional
  conhecida (ver também a ressalva 3 do PR #41). Corrigir o teste ou o comportamento pede tarefa
  própria, com evidências próprias.
