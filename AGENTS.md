# Instruções do projeto

## Fonte de verdade e processo

A constituição em `.specify/memory/constitution.md` prevalece sobre este arquivo.
Leia a spec e o plano correspondentes em `specs/`, identifique a tarefa e preserve
os requisitos aprovados. Registre divergências antes de implementar.

O fluxo de contribuição está em `CONTRIBUTING.md`; os gates, critérios de
encerramento e reaproveitamento estão em `docs/audits/PROCESSO.md`.

## Execução

1. Confira branch, estado do Git e escopo; preserve alterações preexistentes.
2. Classifique o risco pelo impacto, inclusive mudanças de governança ou testes.
   Na dúvida, use o nível superior e preserve-o até revisão fundamentada.
3. Inspecione o fluxo afetado e implemente a menor alteração necessária.
4. Execute verificações pertinentes ou cite evidências ainda válidas. Não repita
   CI completo localmente por rotina. Reabra investigações somente por fato novo
   ou erro demonstrado na análise anterior.
5. Use o PR como registro principal: problema, mudança, risco, evidências,
   ressalvas e decisão. Atualize tarefas somente após validar seus critérios.
6. Vincule autorizações agrupadas à branch e aos arquivos exatos ou patch-id.
   Alteração material fora do escopo exige nova aprovação. Force-push, reescrita
   de histórico, marcar PR como pronto e auto-merge exigem autorização própria;
   merge exige autorização específica para PR e SHA final.

Não adicionar dependências sem justificativa; não expor segredos; não afrouxar
asserções para obter verde; não executar ações destrutivas, merge ou deploy sem
autorização. CI e proteção da master não podem ser contornados.

## Ferramentas e revisões

Skills e agentes locais são recursos especializados, não uma sequência obrigatória
a cada commit. Selecione pelo trabalho efetivo e pelos gates do nível de risco:

- `verify-changed`: verificações pertinentes ao diff;
- `a11y-check` e `a11y-auditor`: interface, semântica, teclado ou foco afetados;
- `content-copy`, `novo-projeto-conteudo` e `content-integrity`: conteúdo alterado;
- `dependency-audit`: dependências e segurança afetadas;
- `new-route`, `seo-metadata`, `refactor-component` e `speckit-*`: conforme escopo;
- `pr-reviewer`: revisão independente obrigatória nos níveis 2/3; adversarial no 3;
- `constitution-auditor` e `test-strategist`: quando houver questão constitucional
  ou necessidade de estratégia de testes que a revisão existente não cubra.

`pre-commit-guard` pode organizar o checklist, sem obrigar nova execução de
verificações já válidas. Não encadear auditores para repetir o mesmo parecer.
Constituição, requisitos aprovados e gates aplicáveis prevalecem sobre checklists
genéricos de ferramentas; registrar a razão de itens não aplicáveis no próprio PR.

## Operação e contexto

O estado operacional e os registros históricos estão em `docs/ACTIVE_CONTEXT.md`
e `docs/CHECKLIST_PUBLICACAO.md`; não duplicar logs de sessão aqui. Atualize contexto
somente quando mudar o estado relevante da feature ou da operação, com link ao PR.
Critérios de inspeção humana não são encerrados por automação. Histórico de
publicação não constitui aprovação do candidato atual.

Preservar preset Next.js, raiz `./` e saída padrão da Vercel (sem `output: "export"`).
Antes de deploy autorizado, conferir ambiente e `NEXT_PUBLIC_SITE_URL`; nunca inferir
Preview apenas de uma flag da CLI. `.env.local` e `.vercel/` não devem ser versionados.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
