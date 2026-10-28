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
4. Rode as verificações do [README](README.md#verificações) relevantes ao que mudou; antes de
   abrir o PR, o conjunto completo.
5. Faça o commit.
6. Envie a branch: `git push -u origin <branch>`.
7. Abra o pull request para `master`.
8. Aguarde o workflow `CI`. Ele roda nos eventos `push` e `pull_request`, então o check `quality`
   aparece duas vezes no PR: a execução de `push` testa o commit da branch, e a de
   `pull_request`, o resultado da combinação com a `master`. Espere as duas aprovadas.
9. Confira o resultado do `quality` e, em caso de falha, os artefatos `e2e-funcional` e `e2e-a11y`.
10. Revise o diff do PR.
11. Faça o merge somente quando o GitHub indicar que as regras foram atendidas.

Como a `master` pode avançar sem que o PR seja atualizado, o CI do evento `push` na `master`
valida de novo o resultado combinado depois do merge.

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
