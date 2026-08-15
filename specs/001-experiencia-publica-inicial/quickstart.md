# Quickstart: Experiência Pública Inicial do Portfólio

Guia de validação end-to-end desta feature. Não é um manual de implementação — os campos de dados
estão em [data-model.md](./data-model.md) e as decisões técnicas em [research.md](./research.md).

## Pré-requisitos

- Node.js 24 LTS (o Next.js 16 exige no mínimo 20.9.0)
- Conteúdo mínimo em `content/profile.json` e ao menos 1 arquivo em `content/projects/` válido
  conforme [data-model.md](./data-model.md)

## Setup

```bash
npm ci
npm run build   # falha se alguma competência não tiver evidência (FR-024) ou campo obrigatório faltar
npm run dev
```

## Validação da migração para Next.js 16

Executar em ordem, a partir de uma instalação limpa e com o mesmo runtime usado no deploy:

```bash
node --version
npm ci
npm audit --omit=dev --audit-level=high
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run test:e2e
```

Resultados esperados:

- Node.js 24.x e instalação reproduzível pelo lockfile;
- `next` e `eslint-config-next` em 16.3.1, `postcss >= 8.5.23` e `nanoid >= 3.3.18`;
- zero vulnerabilidades críticas ou altas em dependências de produção;
- zero erros de formatação, lint, tipos, unitários, build ou E2E;
- build Turbopack identifica todas as rotas esperadas como estáticas/pré-renderizadas;
- nenhuma mensagem de hidratação ou erro não tratado no navegador.

Se o build Turbopack falhar, executar `npm exec next -- build --webpack` uma vez para diagnóstico.
Um build Webpack aprovado não substitui o gate Turbopack final.

## Validação da convergência de stack

Além da sequência acima, a Fase 8 introduz verificações próprias.

### Higiene de repositório

```bash
git ls-files | grep -E 'playwright-report|test-results|tsbuildinfo|^\.next/|^out/|coverage|\.log$'
```

**Resultado esperado**: saída vazia — nenhum artefato de build ou teste versionado. Confirmar também
que `.env.example`, se existir, não é bloqueado pela regra `.env*` do `.gitignore`.

### Documentação de estado

`docs/ACTIVE_CONTEXT.md` deve refletir o estado real antes de qualquer trabalho assistido por IA:
fase atual, fases concluídas, tarefas pendentes, decisões recentes, branch, próximos passos, estado
dos testes, estado do build, pendências de dependências e riscos conhecidos.

**Resultado esperado**: a fase declarada no documento coincide com o que existe no código.

### Integração contínua

```bash
git push   # ou abrir pull request
```

**Resultado esperado**: o workflow executa `npm ci`, lint, typecheck, unitários, build, E2E e
acessibilidade nesta ordem, em Node.js 24, e reprova o PR se qualquer etapa falhar. Nenhum gate
marcado como `continue-on-error`.

### Validação de conteúdo

Para cada regra da matriz em [data-model.md](./data-model.md), existe teste unitário cobrindo o caso
inválido:

```bash
npm test -- --run
```

**Resultado esperado**: o build falha com mensagem identificando arquivo e campo diante de campo
obrigatório ausente, tipo inesperado, slug duplicado ou malformado, `status`/`natureza`/`categoria`
fora do conjunto permitido, URL inválida, imagem inexistente, competência sem projeto que a sustente
ou mais de 6 projetos em destaque.

### Acessibilidade — verificações manuais

O axe-core não substitui inspeção humana. Executar e registrar:

- fluxo completo somente com teclado, do topo ao rodapé;
- foco visível em todos os elementos interativos;
- sequência de foco seguindo a ordem visual, sem saltos;
- semântica de headings (hierarquia sem níveis pulados);
- links compreensíveis fora de contexto;
- textos alternativos descritivos;
- zoom até 200% sem perda de conteúdo;
- navegação com leitor de tela;
- skip link (já implementado em `app/layout.tsx`) alcançável pelo primeiro Tab e funcional.

### Conteúdo publicado

Antes do deploy, confirmar que não resta placeholder em `content/profile.json` nem nos projetos, que
nenhum projeto incompleto aparece como concluído, que nenhum repositório privado aparece como
acessível, que nenhuma tecnologia não utilizada é apresentada como competência comprovada e que
`public/curriculo.pdf` está atualizado e consistente com o site.

## Cenários de validação (mapeados às User Stories da spec)

### 1. Posicionamento profissional na página inicial (US1, P1)

1. Acessar `/`.
2. Verificar título "Desenvolvedor Full-Stack em Formação" e descrição de posicionamento visíveis
   sem rolagem em desktop (SC-001).
3. Verificar competências agrupadas por área, com distinção visual entre área de profundidade e
   complementares (FR-003).
4. Verificar até 6 projetos em destaque, cada um com título, resumo, status e categoria (FR-004,
   FR-006).
5. Navegar por Tab: todos os elementos interativos devem ser alcançáveis em ordem visual
   estrita, sem saltos (FR-021, SC-005).

**Resultado esperado**: nenhum elemento textual ausente; nenhum `tabindex` positivo no DOM
renderizado.

### 2. Detalhes de um projeto (US2, P1)

1. A partir da home, clicar em um projeto em destaque → deve chegar à página do projeto em 1 clique
   (SC-002).
2. Acessar a mesma página diretamente por URL (`/projetos/<slug>`) sem passar pela home (FR-013).
3. Verificar presença de: contexto, objetivo, funcionalidades principais, responsabilidade do
   proprietário, no mínimo 2 decisões relevantes, stack, situação atual, limitações, próximos
   passos (FR-012).
4. Para um projeto com `linkRepositorio: "privado"`, verificar texto "código privado — disponível
   mediante solicitação" com CTA de contato, nunca um link quebrado (FR-009a).
5. Acessar `/projetos/slug-inexistente` → deve exibir página "não encontrado" com link para a
   listagem de projetos, nunca erro técnico bruto (Edge Case).

### 3. Currículo, redes e contato (US3, P2)

1. Em qualquer página pública, verificar que o cabeçalho expõe link de currículo (FR-005, FR-015).
2. Verificar que o rodapé expõe GitHub, LinkedIn e um meio de contato em todas as páginas (FR-018,
   SC-003).
3. Acessar `/curriculo` → currículo visualizável na página com opção de download do arquivo
   (FR-015).

### 4. Página Sobre (US4, P2)

1. Acessar `/sobre` a partir da navegação principal.
2. Verificar que o conteúdo amplia, sem contradizer, o posicionamento da home (FR-014).

## Verificação de acessibilidade e responsividade

```bash
npm run test:e2e   # Playwright + axe-core, cobre os 4 cenários acima
```

- Testar larguras 320px, 768px e 1280px: sem rolagem horizontal, sem sobreposição, sem texto
  cortado (SC-006).
- Rodar axe-core em cada rota pública: zero violações críticas de acessibilidade (FR-022).

## Checklist final antes da publicação

Todos os itens são obrigatórios e cumulativos:

```text
lint
typecheck
unit tests
build
E2E
accessibility (axe + verificações manuais)
metadata
responsive (320 / 768 / 1280)
links
currículo
conteúdo (sem placeholder)
CI verde no commit promovido
audit sem crítica/alta em produção
deploy validado em preview antes de promover
```

## Critério de conclusão

Feature considerada validada quando todos os cenários acima passam e `npm run build` conclui sem
erro de validação de conteúdo (evidência ausente, campo obrigatório faltante, ou projeto em
destaque acima do teto de 6). Para a migração e a convergência, também são obrigatórios o contrato
em [contracts/next16-compatibility.md](./contracts/next16-compatibility.md), o checklist final acima
e a auditoria sem vulnerabilidades de produção críticas/altas.
