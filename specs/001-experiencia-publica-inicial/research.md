# Research: Experiência Pública Inicial do Portfólio

**Input**: Technical Context em [plan.md](./plan.md) — sem marcadores NEEDS CLARIFICATION pendentes;
este documento consolida a justificativa das decisões já tomadas com o proprietário.

## Framework e renderização

- **Decision**: Next.js 14+ (App Router) com React 18 e TypeScript, usando geração estática
  (SSG) para todas as páginas públicas.
- **Rationale**: FR-028 exige conteúdo estático/pré-carregado sem espera perceptível; SSG elimina
  a necessidade de estado de loading por construção. App Router simplifica roteamento por arquivo,
  o que mapeia diretamente para as páginas exigidas (`/`, `/projetos`, `/projetos/[slug]`, `/sobre`,
  `/curriculo`), incluindo `not-found.tsx` nativo para o Edge Case de projeto inexistente.
- **Alternatives considered**: Astro (também SSG-first, porém ecossistema de testes/acessibilidade
  menos maduro para este caso); SPA pura com React Router (exigiria loading state, contrariando
  FR-028); site estático manual sem framework (reimplementaria roteamento e build sem ganho real).

## Armazenamento de conteúdo

- **Decision**: Dados de projeto e perfil como arquivos JSON versionados em `content/`, lidos e
  validados em build time.
- **Rationale**: Constituição (Princípio III, Simplicidade proporcional) e spec (Assumptions:
  "Não há gestão de conteúdo dinâmica nesta especificação") descartam banco de dados e área
  administrativa nesta fase. JSON versionado é auditável via git e não introduz infraestrutura
  adicional.
- **Alternatives considered**: Markdown com frontmatter (viável, mas adiciona parsing extra sem
  necessidade, já que não há corpo de texto longo em prosa livre); banco de dados relacional
  (rejeitado — nenhuma necessidade de escrita em runtime nesta feature).

## Testes

- **Decision**: Vitest + Testing Library para unidade/componentes; Playwright para os fluxos E2E
  das 4 User Stories; axe-core integrado aos testes Playwright para varredura de acessibilidade.
- **Rationale**: Constituição Princípio V exige testes automatizados para regras de negócio e
  fluxos críticos. As User Stories têm Acceptance Scenarios em Given/When/Then diretamente
  mapeáveis para testes E2E. FR-021/FR-022/SC-005 (teclado, semântica) são melhor verificados com
  axe-core do que manualmente.
- **Alternatives considered**: Cypress (viável, mas Playwright tem melhor suporte a testes de
  teclado/foco, relevantes para SC-005); Jest (Vitest escolhido por integração nativa mais rápida
  com o toolchain Next.js/TypeScript atual).

## Hospedagem e operação

- **Decision**: Deploy em Vercel a partir de build estático do Next.js.
- **Rationale**: Constituição Princípio IX exige deploys reproduzíveis com rollback adequado ao
  risco. Vercel oferece build reproduzível a partir do commit e rollback imediato para deploy
  anterior, proporcional ao risco de um site estático sem dados dinâmicos.
- **Alternatives considered**: GitHub Pages (rollback menos direto, sem preview de PR nativo);
  infraestrutura própria em container (complexidade desproporcional a um site estático nesta fase).

## Acessibilidade — ordem de tabulação

- **Decision**: Ordem de tabulação nativa do DOM (nenhum `tabindex` positivo customizado),
  seguindo a ordem visual definida pelo HTML semântico.
- **Rationale**: Resposta de clarificação registrada em spec.md (Q4 da 3ª rodada) exige que a
  ordem de tabulação siga estritamente a ordem visual/de leitura, sem customização — a forma mais
  simples e robusta de garantir isso é nunca usar `tabindex` > 0.
- **Alternatives considered**: `tabindex` customizado por componente (rejeitado — contraria
  explicitamente a resposta de clarificação e adiciona complexidade de manutenção).
