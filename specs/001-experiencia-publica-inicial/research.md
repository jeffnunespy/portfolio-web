# Research: Experiência Pública Inicial do Portfólio

**Input**: Technical Context em [plan.md](./plan.md) — sem marcadores NEEDS CLARIFICATION pendentes;
este documento consolida a justificativa das decisões já tomadas com o proprietário.

## Framework e renderização — decisão atualizada em 2026-08-15

- **Decision**: Next.js 16.3.1 (App Router) com React/ReactDOM 19.2.x e TypeScript 5.9.x,
  preservando SSG para todas as páginas públicas.
- **Rationale**: A cadeia atual do Next.js 14.2.18 possui vulnerabilidades de produção e o audit
  indica 16.3.1 como correção. O caminho oficial 14 -> 15 -> 16 inclui React 19 e APIs de request
  assíncronas. SSG continua atendendo FR-028 sem loading perceptível. Fontes: guias oficiais de
  [upgrade para Next.js 15](https://nextjs.org/docs/app/guides/upgrading/version-15) e
  [Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16).
- **Alternatives considered**: Permanecer na linha 14 (não elimina o conjunto atual de advisories);
  parar em 15.5.21 (mantém PostCSS 8.4.31 vulnerável); manter React 18 porque o peer do pacote ainda
  o aceita (rejeitado para seguir o caminho oficial do App Router e evitar uma segunda migração).

## Cadeia de vulnerabilidades

- **Decision**: Resolver a cadeia pela atualização do framework e validar no lockfile
  `postcss >= 8.5.23` e `nanoid >= 3.3.18`; não adicionar overrides transitivos como solução final.
- **Rationale**: `npm audit --omit=dev` identificou `next` como crítico, `postcss` e `nanoid` como
  altos. Next.js 16.3.1 depende de PostCSS 8.5.23, que permite resolver Nano ID em versão segura.
- **Alternatives considered**: `npm audit fix --force` (rejeitado por aplicar mudança major sem
  revisão); `overrides` para PostCSS/Nano ID mantendo Next 14 (rejeitado porque não corrige os
  advisories diretos do framework).

## Runtime e navegadores

- **Decision**: Padronizar execução e CI em Node.js 24 LTS, declarando que o mínimo do framework é
  Node.js 20.9.0; manter o suporte de navegador definido pelo Next.js 16.
- **Rationale**: O ambiente local já usa Node.js 24.19.0 e Node.js 20 encerrou seu ciclo de vida em 2026. O Next.js 16 exige Node.js 20.9.0 ou superior, TypeScript 5.1 ou superior e navegadores
  Chrome/Edge/Firefox 111+ e Safari 16.4+. Fontes: [ciclo de releases do Node.js](https://nodejs.org/en/about/previous-releases)
  e [guia do Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16).
- **Alternatives considered**: Fixar Node 20.9 (atende o engine, mas está fora de suporte); usar
  apenas a versão local sem declará-la (rejeitado por prejudicar reprodutibilidade).

## APIs assíncronas e tipos React

- **Decision**: Adaptar a única rota dinâmica para `params` assíncrono e migrar os tipos para React
  19, removendo retornos baseados no namespace global `JSX`.
- **Rationale**: Next.js 16 remove o acesso síncrono a `params`; a busca local encontrou esse padrão
  apenas em `app/projetos/[slug]/page.tsx`. React 19 remove o namespace JSX global usado por
  `Header.tsx` e `Footer.tsx`. O codemod ajuda, mas seu diff deve ser revisado. Fonte:
  [guia de upgrade do React 19](https://react.dev/blog/2024/04/25/react-19-upgrade-guide).
- **Alternatives considered**: Usar os casts temporários do Next.js 15 (removidos no 16); manter
  anotações `JSX.Element` com declaração global própria (complexidade desnecessária).

## Lint e configuração

- **Decision**: Substituir `next lint` por `eslint .`, adotar ESLint 10.x e flat config explícita
  com `eslint-config-next` 16.3.1, Core Web Vitals, TypeScript e Prettier.
- **Rationale**: Next.js 16 remove `next lint` e não executa lint dentro de `next build`;
  `eslint-config-next@16.3.1` exige ESLint 9 ou superior. A configuração explícita permite que o
  pipeline mantenha o gate constitucional. Fonte: [configuração ESLint do Next.js](https://nextjs.org/docs/app/api-reference/config/eslint).
- **Alternatives considered**: ESLint 9 (compatível, mas criaria outro upgrade major posterior);
  Biome (troca de ferramenta sem necessidade para a remediação); manter `.eslintrc` (legado e
  incompatível com o alvo ESLint 10).

## Bundler e estratégia de migração

- **Decision**: Usar Turbopack, padrão do Next.js 16, como build final; manter
  `next build --webpack` somente como diagnóstico temporário. Executar o codemod oficial apontando
  para 16.3.1 e revisar o diff.
- **Rationale**: O projeto não possui configuração Webpack ou plugin que bloqueie Turbopack. A
  comparação com Webpack ajuda a isolar regressões, mas o aceite deve representar o padrão que será
  operado. Fonte: [codemods oficiais do Next.js](https://nextjs.org/docs/app/guides/upgrading/codemods).
- **Alternatives considered**: Fixar Webpack no script de produção (adiaria a validação do padrão
  do framework); migração manual sem codemod (maior risco de esquecer quebras entre duas majors).

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

## Modelo de entrega — SSG na Vercel vs. exportação estática

- **Decision**: Manter Next.js hospedado normalmente na Vercel, com todas as páginas
  pré-renderizadas em build time. **Não** adotar `output: "export"`.
- **Rationale**: O projeto é um candidato legítimo à exportação totalmente estática (não há API,
  autenticação, banco, sessões, Server Actions nem conteúdo dinâmico), mas o fluxo
  `GitHub -> Vercel Build -> Next.js -> CDN` já entrega o mesmo resultado ao visitante e preserva
  otimização de imagem, preview por PR e rollback imediato para o deploy anterior — exigidos pelo
  Princípio IX. Migrar para export exigiria `images.unoptimized` e removeria recursos do framework
  sem resolver problema algum. Decisão registrada explicitamente porque a ausência de registro era a
  lacuna apontada, não a escolha em si.
- **Alternatives considered**: `output: "export"` para HTML/CSS/JS puros em qualquer CDN (maior
  portabilidade, mas perde otimização de imagem e recursos do framework sem necessidade atual);
  deixar a decisão implícita (rejeitado — o modelo de entrega precisa ser uma decisão arquitetural
  registrada).

## Integração contínua

- **Decision**: GitHub Actions disparado por push e pull request, fixando Node.js 24 LTS, com gates
  encadeados: `npm ci` -> lint, typecheck e unitários -> build -> E2E -> acessibilidade.
- **Rationale**: O Princípio V exige que lint, formatação, verificação de tipos e testes sejam
  executados pelo pipeline de integração contínua; hoje não existe pipeline algum, o que torna todos
  os gates dependentes de disciplina manual. Colocar build antes de E2E evita gastar tempo de
  browser em um artefato que nem compila.
- **Alternatives considered**: Depender apenas das checagens de build da Vercel (cobre build, mas
  não lint, tipos, unitários, E2E nem acessibilidade); hooks de pré-commit como único gate
  (contornáveis e não reproduzíveis em ambiente limpo).

## Manutenção de dependências

- **Decision**: Habilitar Dependabot com PRs automáticos, mantendo `package-lock.json` versionado e
  `npm ci` como instalação de validação; atualizações major são revisadas em PR separado.
- **Rationale**: A causa raiz da vulnerabilidade atual não foi uma escolha errada de stack, e sim a
  ausência de mecanismo que sinalize defasagem — o projeto ficou em Next 14/ESLint 8/Node 20 até que
  um audit forçasse a remediação. O Princípio VI trata atualização de dependências como requisito
  contínuo, não como evento.
- **Alternatives considered**: Revisão manual periódica (foi exatamente o que falhou); Renovate
  (equivalente em função, sem vantagem que justifique sair do ecossistema nativo do GitHub); CodeQL
  (útil, mas resolve análise de código, não defasagem de dependências — pode ser adicionado depois).

## Atualização do Vitest

- **Decision**: Vitest 2.x -> 4.x, executado em PR próprio somente após Next.js, React e Node
  estarem estáveis. Manter Testing Library, Playwright 1.62 e `@axe-core/playwright`.
- **Rationale**: A ferramenta continua adequada — não há motivo para trocar por Jest. Sobrepor a
  atualização do runner à migração de duas majors do framework tornaria qualquer falha ambígua
  entre as duas causas.
- **Alternatives considered**: Atualizar tudo no mesmo PR (rejeitado por prejudicar diagnóstico e
  rollback); permanecer no Vitest 2 (adia o mesmo problema de defasagem que originou esta fase).

## Estratégia de validação de conteúdo

- **Decision**: Manter validação manual em `lib/content.ts`, ampliando a cobertura para tipos,
  URLs, unicidade de slug, enums de status/categoria/natureza, referências de competência, imagem
  referenciada, links opcionais e teto de destaque — cada regra com teste do caso inválido. Adotar
  biblioteca de schema runtime apenas se o arquivo passar a acumular blocos repetitivos de
  `if (!...) / if (typeof ...) / throw`.
- **Rationale**: Princípio III (simplicidade proporcional): são poucos schemas pequenos (Projeto,
  Perfil, Competência) e a validação atual já cumpre a função sem dependência externa. O risco real
  é o oposto — deixar o arquivo virar um mini-framework de validação artesanal. O critério explícito
  evita tanto a dependência prematura quanto a acumulação silenciosa.
- **Alternatives considered**: Adotar schema runtime imediatamente (dependência sem problema
  demonstrado); manter apenas a validação atual de presença de campos (insuficiente — não detecta
  slug duplicado, URL malformada nem status fora do conjunto fechado).

## Organização de componentes

- **Decision**: Não criar `components/ui/` nesta fase; manter `components/{layout,project}`.
- **Rationale**: A pasta estava prevista em diagrama preliminar, não em necessidade observada. Ainda
  não existem primitives realmente reutilizáveis (Button, Badge, Card, Container, Heading, Link)
  extraídos de uso repetido. Arquitetura deve refletir necessidade real.
- **Alternatives considered**: Criar a pasta para cumprir o plano original (rejeitado — produziria
  indireção sem ganho).

## Assets fonte

- **Decision**: Tratar `original-8696facb39b0641248efdeb31bc641db.webp` como asset fonte: mover para
  `assets/` com nome descritivo e versionar como origem para regenerar as versões otimizadas em
  `public/`.
- **Rationale**: O arquivo permite regerar versões otimizadas sem depender do arquivo original fora
  do repositório. Remover automaticamente arquivos não versionados seria destrutivo; deixá-lo solto
  na raiz sem decisão o transformaria em lixo permanente.
- **Alternatives considered**: Descartar como intermediário temporário (rejeitado — perderia a
  origem da imagem otimizada); manter na raiz sem versionar (rejeitado — pendência indefinida).

## Higiene de repositório

- **Decision**: Manter as regras atuais de `.gitignore` para artefatos de build e teste, ajustando
  apenas a regra `.env*` para preservar `.env.example` como exceção deliberada.
- **Rationale**: A verificação executada mostrou que `playwright-report/`, `test-results/`,
  `*.tsbuildinfo`, `.next/`, `out/`, `coverage/` e `*.log` já estão cobertos e que **nenhum**
  artefato indevido está rastreado no git — a suspeita de arquivos versionados por engano não se
  confirmou. A regra `.env*` atual, porém, bloquearia um arquivo de exemplo legítimo.
- **Alternatives considered**: Reescrever o `.gitignore` inteiro (desnecessário); remover arquivos
  do índice (não há o que remover).

## Acessibilidade — ordem de tabulação

- **Decision**: Ordem de tabulação nativa do DOM (nenhum `tabindex` positivo customizado),
  seguindo a ordem visual definida pelo HTML semântico.
- **Rationale**: Resposta de clarificação registrada em spec.md (Q4 da 3ª rodada) exige que a
  ordem de tabulação siga estritamente a ordem visual/de leitura, sem customização — a forma mais
  simples e robusta de garantir isso é nunca usar `tabindex` > 0.
- **Alternatives considered**: `tabindex` customizado por componente (rejeitado — contraria
  explicitamente a resposta de clarificação e adiciona complexidade de manutenção).
