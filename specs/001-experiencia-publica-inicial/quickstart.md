# Quickstart: Experiência Pública Inicial do Portfólio

Guia de validação end-to-end desta feature. Não é um manual de implementação — os campos de dados
estão em [data-model.md](./data-model.md) e as decisões técnicas em [research.md](./research.md).

## Pré-requisitos

- Node.js 20 LTS
- Conteúdo mínimo em `content/profile.json` e ao menos 1 arquivo em `content/projects/` válido
  conforme [data-model.md](./data-model.md)

## Setup

```bash
npm install
npm run build   # falha se alguma competência não tiver evidência (FR-024) ou campo obrigatório faltar
npm run dev
```

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

## Critério de conclusão

Feature considerada validada quando todos os cenários acima passam e `npm run build` conclui sem
erro de validação de conteúdo (evidência ausente, campo obrigatório faltante, ou projeto em
destaque acima do teto de 6).
