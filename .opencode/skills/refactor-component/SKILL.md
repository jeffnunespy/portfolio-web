---
name: refactor-component
description: Extrai, move ou renomeia um componente garantindo que testes unitários e e2e permaneçam verdes para todas as importações alteradas. Use quando o usuário pedir para extrair, mover ou renomear um componente.
compatibility: opencode
metadata:
  audience: developers
  workflow: component-refactoring
---

# refactor-component

Este skill implementa o Princípio II (entregas verticais e incrementais) mais
o Princípio V (qualidade verificável) ao garantir que cada extração ou
movimentação de componente seja testada por unidade e ponta a ponta antes de
commit.

## 1. Analisar a mudança necessária

**Identificar**:
- Componente a ser extraído/movido/renomeado
- Fontes de uso:
  - Arquivos de código (`app/`, `components/`, `lib/`)
  - Testes unitários (`tests/unit/`)
  - Testes e2e (`tests/e2e/**/*.spec.ts`)
- Caminhos relativos atuais que serão substituídos
  (ex.: `../components/project/ProjectCard`)

**Perguntas críticas**:
- O componente é usado por mais de uma rota?
- Ele reexporta tipos ou interfaces?
- Já existe um agrupamento equivalente no projeto
  (hoje: `components/project/`, `components/layout/`)?

## 2. Planejar a movimentação

**Convenção atual do projeto**:
- `components/project/` — componentes usados em páginas de projetos
  (`ProjectCard`, `EvidenceLink`, `ProjectImage`, `ProjectStatusBadge`)
- `components/layout/` — header/footer globais
- Não criar nova pasta sem necessidade concreta (Princípio III)

**Só mova entre pastas quando a nova localização refletir o uso real do
componente**. Para um simples rename dentro da mesma pasta, ajuste apenas os
caminhos de importação.

## 3. Mover com testes em mente

1. **Copiar** o código para o novo local, preservando:
   - Tipos exportados (interface/type)
   - Default export
   - Props esperadas pelos consumidores

2. **Mover o teste unitário** se o teste vive junto do componente:
   ```bash
   git mv tests/unit/ProjectCard.test.tsx tests/unit/ProjectCard.test.tsx
   ```
   (No projeto atual, os testes ficam em `tests/unit/` no mesmo nível —
   mantenha a estrutura.)

3. **Atualizar importações nos testes** que usam o componente:
   ```tsx
   // tests/unit/ProjectCard.test.tsx
   import { Projeto } from "../../lib/types";
   import ProjectCard from "../../components/project/ProjectCard";
   ```

4. **Atualizar importações em cada consumidor** (`app/`, `components/`):
   ```bash
   # Conferir todas as referências antes de mover
   grep -rn "components/project/ProjectCard" app/ components/ tests/
   ```

5. **Garantir que reexports antigos sejam preservados** se algum consumidor
   externo importa via path antigo:
   ```tsx
   // components/project/index.ts (opcional, só se houver importadores
   // externos fora de app/ e components/)
   export { default as ProjectCard } from "./ProjectCard";
   ```

## 4. Garantir a cobertura de ponta a ponta

Execute apenas os E2E que renderizam o(s) componente(s) tocado(s):

```bash
# Mapeie componente → specs que o renderizam
npx playwright test tests/e2e/home.spec.ts \
                   tests/e2e/project-detail.spec.ts \
                   tests/e2e/home.a11y.spec.ts \
                   tests/e2e/project-detail.a11y.spec.ts
```

Se o componente aparece em mais de uma rota, liste os specs afetados
explicitamente em vez de rodar a suíte inteira.

## 5. Validar as importações de teste

### Casos de teste a checar
- [ ] O componente continua importável pelo nome (default export existe)
- [ ] Tipos exportados permanecem disponíveis para `instanceof` ou anotações
- [ ] Testes unitários (`tests/unit/*.test.tsx`) continuam compilando
- [ ] Specs e2e que renderizam o componente continuam passando

### Compatibilidade com consumidores
- [ ] Componente ainda aceita as mesmas props
  (conferir `type Projeto` em `lib/types.ts`)
- [ ] Sem mudança de ordem na renderização de filhos
- [ ] Sem mudança de classes CSS que quebre seletores de teste

## 6. Executar as verificações

Use a skill `verify-changed` para selecionar o conjunto mínimo de checagens
relevante para o diff. Resumo:

```bash
# typecheck e lint nos arquivos tocados
npm run typecheck
npx eslint <arquivos do diff>

# unit
npx vitest run tests/unit/<teste-do-componente>.test.tsx

# e2e das rotas afetadas
npx playwright test <specs que renderizam o componente>

# auditoria constitucional do diff
# (executada por constitution-auditor)
```

## 7. Reportar a migração

```
## Migração de componente — <origem> → <destino>

### Importações atualizadas
- `app/<arquivo>.tsx` · caminho antigo → caminho novo
- `components/<arquivo>.tsx` · caminho antigo → caminho novo
- `tests/unit/<arquivo>.test.tsx` · caminho antigo → caminho novo

### Testes executados
✅ typecheck
✅ lint
✅ vitest (teste unitário do componente)
✅ playwright (specs das rotas afetadas)

### Compatibilidade
- Default export preservado
- Tipos exportados preservados
- Ordem de renderização preservada

### Erros críticos
Nenhum

### Veredito
Pronto para commit — testes unitário e e2e confirmam a migração
```

Se algum teste falhar, reverta a mudança e investigue antes de prosseguir —
nunca silencie testes para fazer a migração passar.
