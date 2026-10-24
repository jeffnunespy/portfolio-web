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
- Fase 15: sistema Levantamento e sondagem aplicado às rotas e verificado; T099 ajusta o rótulo
  para “Ver comprovação”, preservando conteúdo e comportamento.
- Fase 16: catálogo Nana Silva incluído como projeto profissional real, em validação, com perfil,
  PDF e regressões ajustados para dois projetos implementados.
- Fase 17: Minimalismo escuro aprovado como novo visual oficial na versão sem prévia de Nana.
  T101 conclui o registro e a consistência documental; T102–T105 mantêm pendente a migração das
  rotas, incluindo a adaptação da home a SC-001 e a exceção visual FR-006a.

## Estado atual

Gates reexecutados em 2026-10-23: auditoria de produção com zero vulnerabilidades, formatação,
lint, tipos, 44 testes Vitest, build de produção e 73 testes Playwright, incluindo fluxos e
acessibilidade, passaram. O PDF possui uma página e reflete os dados confirmados do perfil.

O visual oficial está implementado no protótipo; a aplicação ainda usa Levantamento e sondagem.
A revisão de PR identificou uma lacuna herdada em SC-001: os testes atuais não comprovam as
competências por área na primeira dobra. A correção e sua verificação estão explícitas em T102.
A promoção depende das inspeções humanas e do preview/canário de T055, além do CI no commit
candidato. Resultados e limites estão em `docs/ACTIVE_CONTEXT.md`.
