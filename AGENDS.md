# Instruções do projeto

## Fonte de verdade

- As especificações oficiais estão em `specs/`.
- A constituição do projeto prevalece sobre sugestões dos agentes.
- O código deve permanecer consistente com `spec.md`, `plan.md` e `tasks.md`.
- Não alterar requisitos aprovados durante a implementação.
- Divergências devem ser registradas antes de modificar o código.

## Fluxo de trabalho

1. Ler a especificação correspondente.
2. Ler o plano técnico.
3. Identificar a tarefa em `tasks.md`.
4. Inspecionar o código existente.
5. Implementar a menor alteração necessária.
6. Executar testes, lint e verificações estáticas.
7. Atualizar a tarefa somente depois da validação.
8. Registrar limitações, decisões ou desvios.

## Restrições

- Não adicionar dependências sem justificativa.
- Não expor segredos, tokens ou credenciais.
- Não remover testes para fazer a implementação passar.
- Não alterar arquivos fora do escopo sem necessidade demonstrável.
- Não executar comandos destrutivos sem autorização explícita.

## Critério de conclusão

Uma tarefa somente está concluída quando:

- a implementação corresponde à especificação;
- os testes relevantes passam;
- lint e análise estática passam;
- erros são tratados;
- documentação afetada foi atualizada;
- nenhuma regressão conhecida foi introduzida.
