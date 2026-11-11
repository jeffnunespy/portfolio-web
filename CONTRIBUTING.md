# Fluxo de contribuição

A branch `master` é protegida pelo ruleset `proteger-master` do GitHub. Toda alteração entra por
pull request, e o merge só é liberado com o check `quality` (job do workflow `CI`) aprovado.
Vulnerabilidades seguem outro caminho: veja [`.github/SECURITY.md`](.github/SECURITY.md).

## Regras em vigor na `master`

| Regra                    | Efeito                                                                   |
| ------------------------ | ------------------------------------------------------------------------ |
| Pull request obrigatório | Push direto é recusado. Não há exigência de aprovação de revisor         |
| Check `quality`          | O merge fica bloqueado até o job `quality` do GitHub Actions passar      |
| Branch desatualizada     | Permitida: o PR não precisa estar atualizado com a `master` para o merge |
| Force push               | Recusado                                                                 |
| Exclusão da branch       | Recusada                                                                 |
| Métodos de merge         | Merge commit, squash ou rebase                                           |
| Exceções (bypass)        | Nenhuma, nem para administradores                                        |

As demais branches não têm regras.

## Passo a passo

1. Atualize a referência: `git fetch origin`.
2. Crie a branch a partir dela: `git switch -c <tipo>/<descricao> origin/master`.
3. Implemente a alteração.
4. Classifique o risco e execute as verificações locais pertinentes ao diff, conforme
   [PROCESSO](docs/audits/PROCESSO.md). Reutilize evidências válidas; não duplique localmente
   todo o CI por rotina. O `quality` completo continua obrigatório no novo head.
5. Faça o commit.
6. Envie a branch: `git push -u origin <branch>`.
7. Abra o pull request para `master`.
8. Aguarde o workflow `CI`. No PR ele roda uma vez por commit, no evento `pull_request`, sobre a
   combinação com a `master`; um commit novo cancela a execução anterior do mesmo PR. Push em
   branch sem PR não dispara o CI: use **Run workflow** (`workflow_dispatch`) na aba Actions.
   PR com conflito não recebe o check até o conflito ser resolvido.
9. Confira o resultado do `quality` e, em caso de falha, os artefatos `e2e-funcional` e `e2e-a11y`.
10. Revise o diff do PR.
11. Faça o merge somente com autorização específica para o PR e SHA final e quando o
    GitHub indicar que as regras foram atendidas.

Como a `master` pode avançar sem que o PR seja atualizado, o CI do evento `push` na `master`
valida de novo o resultado combinado depois do merge. Nível de risco, revisão e evidências de
cada PR seguem [`docs/audits/PROCESSO.md`](docs/audits/PROCESSO.md).

Na Vercel, o build de Production pode executar independentemente desse CI.
A promoção automática ao domínio público deve aguardar o Deployment Check
GitHub `quality`, bloqueante para Production e correspondente ao SHA integrado
na `master`, com conclusão `success`. Check ausente, pendente, cancelado ou
falho não libera a promoção. Enquanto a nova versão estiver bloqueada, o domínio
público deve manter a versão anterior.

`Force Promote` contorna esse controle: é exceção administrativa e exige
autorização específica e registro, conforme o
[PROCESSO](docs/audits/PROCESSO.md).

O PR é o registro principal: vincule a tarefa, os resultados e as decisões, sem criar
relatórios por rodada. Revisão independente é obrigatória nos níveis 2/3, adversarial no 3.
A homologação cobre os fluxos afetados e suas integrações; amplie somente por impacto
demonstrado, conforme o [processo](docs/audits/PROCESSO.md). Na dúvida, use o nível
de risco superior e preserve a classificação até revisão fundamentada.

É possível autorizar em conjunto commit, push e atualização do PR, vinculando a autorização
à branch e ao conjunto exato de arquivos ou patch-id. Não repita pedidos dentro desse escopo.
Alterações materiais fora dele exigem nova aprovação. Force-push, reescrita de histórico,
marcar PR como pronto e auto-merge exigem autorização explícita própria. Merge requer sempre
autorização específica para o PR e o SHA final. Deploy não é implícito.

## Falhas no CI

Um `quality` vermelho bloqueia o merge. Corrija na mesma branch e envie um novo commit; não
remova nem afrouxe testes para obter aprovação. Se a falha vier do ambiente (indisponibilidade do
GitHub Actions ou do registro npm), use **Re-run jobs** antes de investigar o código.

## Atualizações do Dependabot

O Dependabot abre PRs semanais de versão (npm e GitHub Actions) e PRs de segurança quando há
alerta. Eles seguem as mesmas regras: só entram com o `quality` aprovado e depois de revisão,
sem merge automático. Um PR com CI falhando indica incompatibilidade real e precisa de correção
ou de ser fechado.

- PRs de versão só propõem releases publicadas há pelo menos 7 dias (`cooldown`); os de
  segurança não esperam.
- `react`/`react-dom`/tipos e `next`/`eslint-config-next` chegam sempre juntos, cada conjunto
  num único PR. Minors e patches de desenvolvimento vêm agrupados; majors vêm um por PR.
- Se o `npm ci` falhar com `ESTRICTALLOWSCRIPTS`, a atualização trouxe um script de instalação
  novo. Leia o script, decida e registre com `npm approve-scripts` ou `npm deny-scripts` no
  próprio PR (ver "Scripts de instalação" no README).
- `EBADENGINE` com `"npm":">=11.16.0"` indica npm antigo, que ignoraria `allowScripts`.
  Atualize o npm; não contorne com `--engine-strict=false`.
- `EBADENGINE` com `"node":"^24.22.1"` indica runtime fora da linha/piso corrigido.
  Use `nvm use` antes de instalar: `.nvmrc` fixa Node 24.22.2 com npm 11.19.1, também lido pelo CI.

## Conflitos de merge

Resolva na branch do PR (`git fetch origin && git merge origin/master`, ou rebase da branch de
trabalho) e envie de novo; o CI roda outra vez. Em PRs do Dependabot, comente
`@dependabot rebase`.

## Correções urgentes

Correções urgentes seguem o mesmo fluxo, numa branch `fix/…` com PR próprio e o mesmo check. O
`quality` leva poucos minutos, então a proteção não atrasa uma correção de forma relevante.

Desativar ou editar o ruleset é uma medida administrativa excepcional, não um atalho. Ela só se
justifica quando a própria proteção impede uma correção necessária, por exemplo com o workflow
quebrado de um jeito que nenhum PR consegue passar. Nesse caso, a exceção precisa ser:

1. justificada e autorizada pelo proprietário do repositório;
2. registrada, com motivo, horário e o que foi feito, em `docs/ACTIVE_CONTEXT.md` ou numa issue;
3. revertida logo em seguida, com a confirmação de que as regras voltaram a valer.

## Reverter uma alteração

Use `git revert <commit>` numa branch nova e abra um PR; para um merge commit, use
`git revert -m 1 <merge>`. Nunca reescreva o histórico da `master`: force push é bloqueado
justamente para isso.

## Antes de começar

O repositório é **dirigido por especificação**. A ordem de precedência é
[`.specify/memory/constitution.md`](.specify/memory/constitution.md) >
[`specs/001-experiencia-publica-inicial/`](specs/001-experiencia-publica-inicial/) (`spec.md`,
`plan.md`, `tasks.md`) > sugestões de ferramentas ou agentes.

> [!IMPORTANT]
> Requisitos aprovados não mudam durante a implementação. Se uma mudança contradiz a spec, abra
> uma issue descrevendo a divergência antes de escrever código.

Toda alteração parte de uma tarefa em `tasks.md`, marcada como concluída só depois de validada.
Quando mudar o estado relevante da feature/operação, atualize
[`docs/ACTIVE_CONTEXT.md`](docs/ACTIVE_CONTEXT.md) com um resumo e link ao PR, sem copiar a auditoria.
Ao participar, você concorda em seguir o [Código de conduta](.github/CODE_OF_CONDUCT.md).

| Tipo                  | Como proceder                                                                    |
| --------------------- | -------------------------------------------------------------------------------- |
| 🐛 Bug                | Issue com passos para reproduzir, resultado esperado e resultado obtido.         |
| ♿ Acessibilidade     | Informe a tecnologia assistiva, o navegador e o trecho da página afetado.        |
| ✏️ Texto e ortografia | PR direto é bem-vindo; mantenha o português com acentuação completa.             |
| 💡 Melhoria           | Abra uma issue antes, para alinhar com a spec e a constituição.                  |
| 🔒 Vulnerabilidade    | **Não abra issue pública.** Siga a [política de segurança](.github/SECURITY.md). |

## Padrões do projeto

### Idioma

Domínio, tipos, campos JSON, mensagens de erro e documentação estão em **português**. Novas
interfaces e propriedades seguem o vocabulário existente (`Projeto`, `PerfilProfissional`,
`competenciasDemonstradas`, …) — não traduza para inglês.

### Código

- **TypeScript estrito.** Tipos do domínio ficam em `lib/types.ts`.
- **Conteúdo só via `lib/content.ts`.** Rotas e componentes não leem arquivos diretamente.
- **CSS puro** em `app/globals.css`, seguindo os tokens e regras do [`DESIGN.md`](DESIGN.md). Não
  adicione frameworks de estilo.
- **Simplicidade proporcional.** Prefira a solução mais simples que atenda ao requisito atual.
- **Dependências** só com justificativa registrada no PR: cada uma amplia a superfície de ataque
  e o custo de manutenção.
- **Formatação** pelo Prettier (`.prettierrc`: aspas duplas, ponto e vírgula, 100 colunas).

### Testes

- Mudanças em validação de conteúdo exigem casos em `tests/unit/content.test.ts`.
- Mudanças visíveis em páginas exigem cobertura E2E em `tests/e2e/`; páginas novas precisam de
  um `*.a11y.spec.ts` com axe-core.
- `E2E_REUTILIZAR_SERVIDOR=1` agiliza a iteração local, mas não vale como aceite.

### Acessibilidade

O alvo é **WCAG 2.1 AA**. Nos fluxos afetados, além do axe, confira manualmente a navegação por teclado com
foco visível, a hierarquia de cabeçalhos, textos de link que façam sentido fora de contexto,
alternativas textuais significativas, o modo de cores forçadas e a largura de 390 px sem rolagem
horizontal.

## Conteúdo de projetos

Os estudos de caso vivem em `content/projects/<slug>.json` e são validados no build.

> [!CAUTION]
> **Não invente métricas, resultados ou evidências.** Tudo o que for declarado precisa ser
> verificável por um link, um teste ou um artefato. O que ainda é intenção aparece como escopo
> planejado, nunca como entrega.

Se o build falhar por validação, **ajuste o conteúdo**, nunca a validação. As regras estão no
[README](README.md#validação-que-quebra-o-build-intencional). Ao mudar o schema, atualize juntos
`lib/types.ts`, as listas `REQUIRED_*` de `lib/content.ts`, todos os JSONs e
`tests/unit/content.test.ts`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/pt-br/), com descrição em
português no imperativo:

```text
feat(projetos): exibir decisões relevantes no estudo de caso
fix(build): corrigir validação de links de repositório privado
docs: registrar evidências do preview
chore(deps): atualizar dependências de teste
```

Use o [modelo de PR](.github/pull_request_template.md) para registrar a mudança, o risco,
as evidências, as ressalvas e a decisão. Vincule os resultados do CI e mantenha a decisão
no PR até a validação pós-merge, conforme o [processo de auditoria](docs/audits/PROCESSO.md).

## Uso de inteligência artificial

Assistentes de IA podem ser usados com responsabilidade (princípio X da constituição): toda
saída gerada é revisada por uma pessoa, passa pelos mesmos gates e é de responsabilidade de quem
a submete. Não use IA para produzir evidências, métricas ou resultados que não existam.
