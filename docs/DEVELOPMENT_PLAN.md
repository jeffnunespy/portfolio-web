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
  T101 conclui o registro e a consistência documental; T102–T105 aplicam a migração local das
  rotas, incluindo a adaptação da home a SC-001 e a exceção visual FR-006a.
- Fases 18–21: fontes públicas de comprovação, rótulo de validação de Nana, atalhos nas fichas
  e medida de leitura concluídos por T106–T109.
- Fase 22: T110 conclui as melhorias da crítica da home e seu polimento integrado.
- Fase 23: T111 conclui a manutenção de metadados/sidecar e o roteiro de T055; formatação
  global aprovada. Inspeção humana, configuração de hospedagem e CI do candidato pendentes.

## Estado atual

Gates de T110 em 2026-10-27: lint, tipos, 46 testes Vitest, build de produção e 90 testes
Playwright, incluindo fluxos e acessibilidade, passaram. T111 corrige os três metadados JSON
que ainda falhavam na formatação global, atualiza o sidecar local e registra o roteiro de
publicação. A auditoria de produção de 2026-10-27 retornou zero vulnerabilidades. O PDF,
os dados do perfil e os arquivos da aplicação foram preservados nesta manutenção.

O visual oficial é aplicado às rotas na execução de T102–T105 em 2026-10-24.
A lacuna herdada de SC-001 recebe uma regressão geométrica para as competências e seus itens
na primeira dobra, além dos cenários de texto ampliado identificados pelo audit.
A promoção depende das inspeções humanas e do preview/canário de T055, além do CI no commit
candidato. Resultados e limites estão em `docs/ACTIVE_CONTEXT.md`.
O proprietário confirmou que ainda não configurou a Vercel; o primeiro preview e as
inspeções humanas seguem o roteiro de `docs/CHECKLIST_PUBLICACAO.md`.

### Execução da fase 17 — 2026-10-24

As correções de adapt, harden, layout, optimize e polish foram autorizadas conjuntamente
após o audit técnico. A implementação segue a direção aprovada sem alterar requisitos ou
conteúdo factual. O código remove efeitos topográficos, aplica a composição aberta, preserva
rotas/PDF/evidências e acrescenta regressões de primeira dobra, zoom, toque e WCAG 2.1.
O resultado dos gates e da revisão final fica em `ACTIVE_CONTEXT.md`; T055 permanece aberta.
