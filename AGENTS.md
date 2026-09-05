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

## Automação opencode

Skills e agents em `.opencode/` aplicam a constituição de forma sistemática
e devem ser acionados quando a descrição no frontmatter casar com a tarefa.

### Agents (decisão e veredito)

| Agent | Quando acionar |
|---|---|
| `pr-reviewer` (`.opencode/agents/pr-reviewer.md`) | Cada PR, finalização de feature, "review do PR" |
| `spec-reviewer` (`.opencode/agents/spec-reviewer.md`) | Final de spec/plan/tasks, antes de implement, "revisão da spec" |
| `test-strategist` (`.opencode/agents/test-strategist.md`) | Adicionar componente novo, final de feature, "estratégia de testes" |
| `a11y-auditor` (`.claude/agents/a11y-auditor.md`) | Auditoria semântica de acessibilidade além do axe |
| `constitution-auditor` (`.claude/agents/constitution-auditor.md`) | Antes de commit, antes de PR, ao concluir tarefa do `tasks.md` |
| `content-integrity` (`.claude/agents/content-integrity.md`) | Após editar conteúdo, antes de publicar |

### Skills (execução e checklist)

| Skill | Quando acionar |
|---|---|
| `pre-commit-guard` (`.opencode/skills/pre-commit-guard/SKILL.md`) | Cada commit, antes de abrir PR, final de tarefa |
| `refactor-component` (`.opencode/skills/refactor-component/SKILL.md`) | Extrair, mover ou renomear componente |
| `new-route` (`.opencode/skills/new-route/SKILL.md`) | Criar página em `app/**/page.tsx` |
| `content-copy` (`.opencode/skills/content-copy/SKILL.md`) | Revisar/redigir textos do portfólio |
| `dependency-audit` (`.opencode/skills/dependency-audit/SKILL.md`) | Modificar `package.json`, adicionar dependência, "auditoria de segurança" |
| `verify-changed` (`.claude/skills/verify-changed/SKILL.md`) | Validar antes de commit, "rodar os testes" |
| `a11y-check` (`.claude/skills/a11y-check/SKILL.md`) | Criar página/componente, teste a11y falhou |
| `novo-projeto-conteudo` (`.claude/skills/novo-projeto-conteudo/SKILL.md`) | Adicionar/atualizar projeto em `content/projects/` |
| `seo-metadata` (`.claude/skills/seo-metadata/SKILL.md`) | Criar página nova, melhorar SEO/OG |
| `speckit-*` (`.claude/skills/speckit-*/`) | Fluxo de especificação Speckit |

### Convenção de uso

- O proprietário **solicita** o agente/skill pela intenção ("review do PR",
  "criar página de contato", etc.); o opencode escolhe pelo frontmatter.
- Para automatizar como hook de pré-commit, copie a lógica de
  `pre-commit-guard` para `.husky/pre-commit` (se houver Husky configurado).
- Em caso de conflito entre agentes, a **constituição prevalece**
  (ver seção "Fonte de verdade" acima).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
