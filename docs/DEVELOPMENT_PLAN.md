# Development Plan: Experiência Pública Inicial do Portfólio

**Branch**: `001-experiencia-publica-inicial` | **Feature Spec**: `specs/001-experiencia-publica-inicial/spec.md`

## Fases

- Fase 1: Setup — runtime, higiene e documentação de contexto concluídos; asset-fonte aguarda o
  arquivo original.
- Fase 2: Foundational — migração para Next.js 16/React 19, ESLint flat config, CI e Dependabot
  concluídos.
- Fase 3: US1 — home, competências, destaques, teclado, responsividade e axe concluídos.
- Fase 4: US2 — listagem, detalhe, links condicionais, 404 e metadados concluídos.
- Fase 5: US3 — currículo, redes, contato e testes globais concluídos tecnicamente; o currículo e
  os dados profissionais finais aguardam confirmação.
- Fase 6: US4 — página Sobre, posicionamento e metadados concluídos tecnicamente; biografia final
  aguarda confirmação.
- Fase 7: Polish — validação de conteúdo, testes de componentes, responsividade, acessibilidade e
  gates automatizados concluídos. Inspeções manuais e conteúdo de publicação permanecem pendentes.
- Fase 8: Convergence — concluída para validações, testes e documentação; bloqueada somente pelas
  entradas confirmadas do proprietário, asset-fonte e preview/canário.

## Estado atual

Os gates automatizados foram executados em Node.js 24.19.0 em 2026-08-15: instalação limpa,
auditoria de produção, formatação, lint, tipos, 27 testes Vitest, build Turbopack e 35 testes
Playwright (25 funcionais + 10 de acessibilidade) passaram. O artefato não está pronto para
promoção enquanto houver placeholders ou conteúdo/currículo não confirmados.
