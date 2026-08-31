---
name: pre-commit-guard
provider: local
model: "claude-3-5-sonnet"
description: Executa o checklist completo antes de commit: a11y, conteúdo, constituição, lint, typecheck, testes do diff. Use para cada commit, antes de abrir PR ou ao finalizar tarefa do tasks.md.
compatibility: opencode
metadata:
  audience: developers
  workflow: pre-commit
---

# pre-commit-guard

Esta skill implementa uma verificação completa antes de commit no estilo PR.
Ela combina a revisão baseada em constituição (Princípios I–X) com as
verificações automatizadas do pipeline (lint, typecheck, unit, e2e, a11y).

## 1. Levantar o escopo

```bash
# Obter o diff de modificações no trabalho
echo "=== ESCOPO ==="
git status --porcelain
git diff --name-only HEAD
```

Identificar:
- Caminhos alterados
- Arquivos novos
- Arquivos não rastreados

## 2. Criar o checklist completo

### Arquitetura
- [ ] **Validação de git e clean**: `git status --porcelain`
- [ ] **Acesso a rede** (ex.: `https`, http: N/A sem autorização)
- [ ] **Segredos**: Nenhum token, chave, credencial exposta

### Desenvolvimento
- [ ] **TypeScript**: `npm run typecheck` ✓
- [ ] **Lint**: `npx eslint <arquivos>` ✓
- [ ] **Unidade**: `npx vitest run tests/unit/` (conteúdo → todo E2E, rotas alteradas → relevantes)
- [ ] **E2E**: `npx playwright test` (rotas alteradas + `.a11y.spec.ts` relevantes)

### Conteúdo
- [ ] **Integridade**: content-integrity run
- [ ] **Construção**: `npm run build` (N/A para apenas docs)

### Acessibilidade
- [ ] **axe**: `npm run test:e2e:a11y` (rotas alteradas)
- [ ] **Pessoal**: a11y-auditor run (componentes/páginas novos)

### Leitura
- [ ] **Constituição**: constitution-auditor run (diff)
- [ ] **Especificação**: spec-plan-tasks run (se spec ativo)

### Segurança
- [ ] **Dependência**: dependency-audit run (package.json, lock file, .github)
- [ ] **Conteúdo**: válido (lib/content.ts passa)

## 3. Regras de julgamento

- **Fail-fast:** parar no primeiro fail e reportar, não recomeçar
- **Práticas ruins:** ignorar .gitignore, debug logs em produção, PR hack
- **Violações:** devem ser corrigidas antes de commit; se não forem, bloquear commit

## 4. Retornar o veredito

```
## Checklist de pré-commit — <especificação>

### Passou
✅ typecheck (passou com 3 warnings)
✅ lint (passou sem fixes)
✅ unit (2 testes)
✅ e2e (home.spec + home.a11y.spec)
✅ a11y pessoal (ProjectCard component)
✅ constitution (I, V, VII verificados)
✅ segurança (dependência limpa, conteúdo íntegro)

### Observações
- Lint flag: tratar no próximo PR.

### Erros
- ❌ a11y: imagem sem alt em app/page.tsx:32
- ❌ constitution: evidência para competência "React" ausente

### Veredito
Pronto para commit / Precisa de ajustes antes de commit
```