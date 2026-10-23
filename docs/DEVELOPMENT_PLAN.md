# Development Plan: Experiência Pública Inicial do Portfólio

**Branch**: `001-experiencia-publica-inicial` | **Feature Spec**: `specs/001-experiencia-publica-inicial/spec.md`

## Fases

- Fase 1: Setup — runtime, higiene e documentação de contexto concluídos; movimentação do
  asset-fonte superada conforme T006/T063.
- Fase 2: Foundational — migração para Next.js 16/React 19, ESLint flat config, CI e Dependabot
  concluídos.
- Fase 3: US1 — home, competências, destaques, teclado, responsividade e axe concluídos.
- Fase 4: US2 — listagem, detalhe, links condicionais, 404 e metadados concluídos.
- Fase 5: US3 — currículo HTML/PDF, redes, contato e testes globais concluídos; dados confirmados
  pelo proprietário em 2026-10-23.
- Fase 6: US4 — página Sobre, posicionamento, conteúdo confirmado e metadados concluídos.
- Fase 7: Polish — validação de conteúdo, testes de componentes, responsividade, acessibilidade e
  gates automatizados concluídos. Inspeções manuais de publicação permanecem pendentes em T055.
- Fase 8: Convergence — concluída para validações, testes e documentação; bloqueada somente pelas
  inspeções de publicação de T055.
- Fases 9–13: hardening, separação de roadmap, acessibilidade, identidade do currículo e otimização
  de carregamento concluídos conforme T064–T089.
- Fase 14: conteúdo e PDF confirmados, revisão de integridade concluída e dependências de produção
  corrigidas por T090 dentro das faixas existentes no manifesto. T091 inclui os rótulos compactos
  da navegação em seus nomes acessíveis, preservando o layout e cobrindo mobile/desktop.

## Estado atual

Gates reexecutados em Node.js 24.19.0 em 2026-10-23: instalação limpa, auditoria de produção com
zero vulnerabilidades, formatação, lint, tipos, 43 testes Vitest, build Turbopack/Next.js 16.4.2 e
64 testes Playwright (43 funcionais + 21 de acessibilidade) passaram. O PDF possui uma página e
reflete os dados confirmados do perfil. A promoção depende das inspeções humanas e do
preview/canário de T055, além do CI no commit candidato. Resultados e limites estão em
`docs/ACTIVE_CONTEXT.md`.
