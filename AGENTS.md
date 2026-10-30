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

## Estado da publicação — sessão de 2026-10-29

Registro inicial da sessão; a seção de verificação operacional posterior abaixo atualiza a configuração e as evidências.

- Projeto Vercel criado e vinculado: `jeff-0a6e/portfolio-web`.
- Conexão com GitHub `jeffnunespy/portfolio-web` concluída pelo proprietário no painel.
- URL de produção: https://portfolio-web-three-zeta.vercel.app.
- Deployment da sessão: https://portfolio-a6yvbpbxy-jeff-0a6e.vercel.app.
- O log fornecido pelo proprietário registra build, TypeScript e geração de 18 páginas concluídos, com estado `Ready`. O proprietário confirmou que o site abriu normalmente. O agente não conseguiu acessar a URL deste ambiente; isso não equivale a uma inspeção completa das rotas, recursos ou acessibilidade.
- T055 permanece pendente: abertura do site e build hospedado não substituem inspeções humanas, preview aprovado e CI do commit candidato. Não registrar novos testes ou gates como aprovados sem evidência.
- `docs/CHECKLIST_PUBLICACAO.md` e registros anteriores ainda descrevem a Vercel como não configurada; esse estado histórico foi superado pela publicação desta sessão.

### Aprendizados operacionais da Vercel

- O projeto usa Next.js com pré-renderização, sem `output: "export"`. Preservar o preset Next.js, diretório raiz `./` e saída padrão; não configurar `public` ou `out` como saída. O comando de build detectado foi `next build`.
- A integração Git exigiu primeiro adicionar GitHub em configurações pessoais da Vercel → Authentication. Depois, conectar o repositório em projeto → Settings → Git. A falha nessa integração não impediu a criação do projeto; reutilizar o projeto existente.
- A CLI 65.8.0 avisou que `--target` está obsoleto e indicou `--environment`. Nesta sessão, `vercel deploy --target=preview` terminou explicitamente em produção e recebeu o alias público. A causa dessa seleção de ambiente não foi determinada; não assumir que esse comando gera preview.
- Para novos previews, usar `rtk proxy npx vercel deploy --environment=preview`, conferindo antes a ajuda da versão instalada e depois o ambiente no painel/log. O comando foi executado nesta sessão: preview `Ready` em https://portfolio-bxwwi5lbi-jeff-0a6e.vercel.app, ambiente confirmado por `vercel inspect` e HTML com HTTP 200 via CLI autenticada. Publicação em produção continua exigindo autorização explícita.
- A CLI criou `.env.local` com `VERCEL_OIDC_TOKEN`; `.env.local` e `.vercel/` estão ignorados pelo Git. Não divulgar nem versionar credenciais.
- O build remoto usou Next.js 16.4.2 e emitiu avisos de peers do ESLint 10, `cache-dir` e script de instalação de `unrs-resolver`. Foram avisos, sem falha de build; isso não comprova aprovação do lint, auditoria ou demais gates do CI.
- Ao preparar produção, conferir `NEXT_PUBLIC_SITE_URL` com a URL pública escolhida; sua configuração não foi confirmada nesta sessão. `lib/site.ts` também usa `VERCEL_URL` como fallback hospedado.

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

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Verificação operacional posterior — 2026-10-29

- Projeto Vercel alinhado a Node 24.x e instalação `npm ci`; branch de produção confirmada como `master`.
- `NEXT_PUBLIC_SITE_URL` definida em Production como `https://portfolio-web-three-zeta.vercel.app`; aguarda novo build de produção para substituir a URL específica nos metadados publicados.
- Gates locais aprovados: formatação, lint, tipos, 53 unitários, build, 73 E2E funcionais e 27 E2E de acessibilidade; auditoria npm de produção sem vulnerabilidades.
- Produção verificada automaticamente: sete rotas com 200, duas 404, PDF/imagem/ícone com 200, nove páginas sem violações axe e sem overflow em 390/1280px. Inspeções humanas de T055 continuam pendentes.
- Registros detalhados e limites da validação em `docs/ACTIVE_CONTEXT.md` e `docs/CHECKLIST_PUBLICACAO.md`. Explorações visuais não rastreadas preservadas fora do commit operacional.
