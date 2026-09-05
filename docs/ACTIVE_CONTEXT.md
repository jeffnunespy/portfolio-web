# Active Context

## Feature

Experiência Pública Inicial do Portfólio (`001-experiencia-publica-inicial`).

## Status

Convergência técnica concluída para as fases 1–7 e itens técnicos da Fase 8. A publicação continua
bloqueada por conteúdo profissional que precisa ser confirmado pelo proprietário e por validações
manuais/de preview.

## Entregues

- Runtime Node.js 24, Next.js 16.3.1, React 19, ESLint flat config e CI com Dependabot.
- Rotas públicas estáticas de home, projetos, detalhe, Sobre, currículo e ambos os estados 404.
- Validação de conteúdo em build para tipos, campos obrigatórios, enums (`status`, `natureza`,
  `categoria`), slugs, URLs HTTPS, e-mail, imagens publicadas, evidências de competência e limite de
  seis destaques.
- Cobertura Vitest de validação e componentes; cobertura Playwright de fluxos, links globais,
  metadados, responsividade, teclado e axe-core em todas as rotas públicas.
- Metadados próprios para os dois estados 404.
- Auditoria de documentação (2026-08-15): `CLAUDE.md`, `README.md`, `docs/PROJECT.md` e
  `docs/DEVELOPMENT_PLAN.md` alinhados à stack real (Next.js 16, React 19, Node 24) e aos scripts
  existentes (`typecheck`, `format:check`, `test:e2e:functional`, `test:e2e:a11y`); as skills
  `verify-changed` e `a11y-check` corrigidas — `next lint` não existe mais no Next.js 16 (trocado
  por `npx eslint <arquivos>`) e a verificação de a11y passou a usar `npm run test:e2e:a11y`, que
  inclui `accessibility.a11y.spec.ts` (única cobertura de `/projetos`, `/sobre` e `/curriculo`).
- Removido `tests/e2e/placeholder.spec.ts`, resíduo de scaffold sem asserção real.
- `linkGithub` e `linkLinkedin` de `content/profile.json` substituídos pelos valores reais.

## Validação executada em 2026-08-15

- `node --version` → `v24.19.0`
- `npm ci` → concluído
- `npm audit --omit=dev --audit-level=high` → 0 vulnerabilidades
- `npm exec prettier -- --check .` → concluído
- `npm run lint` → concluído
- `npm run typecheck` → concluído
- `npm test -- --run` → 37 testes aprovados
- `npm run build` → Turbopack concluído; rotas estáticas e SSG geradas
- `npm run test:e2e:functional` → 33 testes Playwright aprovados
- `npm run test:e2e:a11y` → 15 testes Playwright aprovados

## Separação entre fichas e roadmap (2026-08-31; reconciliada em 2026-09-01)

Origem: `/impeccable critique` encontrou que o gate de FR-024/SC-007 em
`lib/content.ts` contava projetos **não implementados** como evidência de
competência. Consequência medida: 18 das 18 competências do perfil não tinham
lastro em software existente, e as que a plataforma real demonstra sequer
estavam declaradas. O gate constitucional "evidências acima de afirmações"
estava invertido — aceitava conteúdo ficcional como prova.

Correção aplicada, aprovada pelo proprietário: `validateCompetenciasComEvidencia`
passa a considerar somente projetos com `real: true`.

Os quatro registros de escopo planejado saíram de `/projetos` e passaram a uma
superfície própria, `/roadmap`, sem página de detalhe (`/projetos/<slug>` desses
slugs retorna 404). Em 2026-09-01, `spec.md`, `plan.md`, `tasks.md`, modelo de
dados, contrato, quickstart e checklists foram atualizados para registrar essa
decisão. A divergência documental está encerrada; somente projetos `real: true`
contam como evidência, destaque ou ficha pública.

## Hardening de acessibilidade e integridade factual (2026-08-31)

Origem: bloqueios apontados pelo `pre-commit-guard`. Entregue nesta rodada, com
verificação registrada abaixo:

- **Suíte E2E destravada.** Os testes de `curriculo.spec.ts` e `sobre.spec.ts`
  fixavam strings do perfil e exigiam um link `mailto:` que a interface suprime
  de propósito enquanto `contato.valor` for placeholder. Passaram a ler
  `content/profile.json` em tempo de execução e a ramificar pelo estado real —
  sem endereço fabricado e sem afrouxar o requisito de contato (FR-017). O
  rodapé oferece "Contato pelo LinkedIn" (destino verificável) e a página de
  currículo declara "Contato em configuração", explícito e não interativo.
- **Semântica de lista preservada.** Toda `<ul>` sob `list-style: none` recebeu
  `role="list"` (`app/page.tsx`, `app/curriculo/page.tsx`,
  `app/projetos/[slug]/page.tsx`, `components/project/ProjectCard.tsx`): o
  Safari/VoiceOver descarta a semântica quando o marcador some.
- **Imagem de projeto decorativa.** `ProjectImage` publica com `alt=""` e perdeu
  a prop `title`, que só servia para duplicar o texto adjacente; o estado de
  falha saiu da árvore de acessibilidade. Nenhuma regra axe foi silenciada.
- **Glifos fora do nome acessível.** Os sete `::before` decorativos de
  `app/globals.css` passaram à forma `content: "X" / ""`, mantendo a marca
  visível — exigida por DESIGN.md para estado sem cor — e fora do nome
  acessível. `forced-colors.a11y.spec.ts` passou a verificar as duas partes.
- **Contradições factuais resolvidas.** As quatro fichas sem software foram
  reescritas em linguagem de intenção e vivem em `/roadmap`; `PRODUCT.md` e
  `DESIGN.md` foram alinhados. `plataforma-portfolio` é a única implementação
  real e verificável.
- **Rodada visual (2 rodadas, desktop 1280px e mobile 390px).** Dois defeitos
  encontrados e corrigidos: a ficha de índice em `/projetos/<slug>` esticava até
  os 1280px do container e sua linha de índice interna superava o `<h1>` da
  página (teto `width: min(100%, 34rem)`); e o "Resumo" do currículo imprimia
  `descricaoPosicionamento` e `biografiaSobre` como paráfrases um do outro —
  a biografia passou a descrever o método, que a síntese não cobre.
- **Princípios do Sobre alinhados à evidência.** "Backend como profundidade" e
  "Cloud e DevOps como diferenciais" anunciavam como diferencial o que o perfil
  não sustenta — backend segue registrado como escopo planejado em `/roadmap`.
  Passaram a descrever o método verificável no repositório. O teste de Sobre
  verifica a estrutura da seção, não as frases.
- **Artefatos locais do Impeccable fora do escopo versionável.** `.gitignore`
  passou a cobrir `config.local.json`, cache do hook, PIDs, portas, logs e
  sessões de pergunta. Nenhum arquivo foi removido.

## Validação executada em 2026-08-31

- `npm run typecheck` → sem erros
- `npx eslint` nos arquivos TS/TSX alterados → 0 erros (aviso apenas para
  `app/globals.css`, que o flat config não cobre)
- `npx vitest run tests/unit/` → 6 arquivos, 37 testes aprovados
- `npm run test:e2e:a11y` → 17 testes Playwright aprovados
- `npx playwright test` → 48 testes Playwright aprovados
- `npm run build` → compilado com sucesso; validação de conteúdo sem erros
- `npx prettier --check .` → conforme
- `git diff --check` → limpo

## Remediação Impeccable P1–P3 (2026-09-01)

- **P1 — contrato reconciliado.** Os artefatos Speckit e o sistema visual agora
  registram o posicionamento factual "Desenvolvedor Web em Formação", a ordem
  real das competências, o destino `/roadmap` na navegação e a separação entre
  implementação e intenção. Nenhum requisito P0 foi removido ou afrouxado.
- **P2 — mobile, imagem e tema.** O card único passa a uma coluna real em 320px,
  suas ações empilham em largura integral e a ficha mantém a proporção 5:3 sem
  recorte. As cinco imagens SVG respondem ao tema escuro dentro do próprio
  recurso, sem tentar herdar tokens CSS da página.
- **P2 — cobertura de acessibilidade.** A suíte percorre todos os controles de
  todas as rotas públicas por Tab, verifica foco visível e ausência de armadilha,
  testa zoom de texto a 200% e inclui `/roadmap` no axe. Leitor de tela real e
  preview/canário continuam como inspeções humanas de publicação.
- **P3 — lint focado no produto.** Bundles locais copiados de skills em
  `.agents/`, `.claude/`, `.github/skills/` e `.opencode/skills/` foram excluídos
  do lint. Regras e arquivos da aplicação não receberam supressão.
- **Rodada visual única.** Home clara e detalhe escuro foram inspecionados em
  1280px e 320px. CTA mobile, proporção da ficha, hierarquia, foco visual e
  paleta escura permaneceram coerentes com `DESIGN.md`; nenhuma segunda rodada
  de correção foi necessária.

## Validação executada em 2026-09-01

- `npx impeccable detect app/globals.css tests/e2e/accessibility.a11y.spec.ts tests/e2e/responsive.spec.ts` → sem achados
- `npm run format:check` → conforme
- `npm run lint` → 0 erros e 0 avisos
- `npm run typecheck` → sem erros
- `npx vitest run tests/unit/` → 6 arquivos, 38 testes aprovados
- `npm run build` → Turbopack concluído; `/roadmap` estática e uma ficha SSG geradas
- `npm run test:e2e:functional` → 35 testes Playwright aprovados
- `npm run test:e2e:a11y` → 19 testes Playwright aprovados
- `git diff --check` → limpo
- Pareceres especializados → spec green; acessibilidade aprovada; duas ressalvas
  baixas de integridade documental corrigidas; auditoria constitucional aprovada após
  SC-008 passar a derivar todos os slugs do roadmap

## Currículo P0 — 2026-09-04

- `/curriculo` usa `Jefferson Nunes` como `<h1>` e organiza perfil profissional,
  formação, trajetória técnica, competências e contato em uma hierarquia própria de
  currículo.
- `content/profile.json` ganhou `formacao` e `trajetoria`, ambas obrigatórias e
  validadas como listas de marcos com `periodo`, `titulo` e `descricao`. Os períodos
  publicados cobrem apenas a evolução comprovável desta plataforma desde agosto de
  2026; nenhuma instituição de ensino ou experiência profissional foi inferida.
- O cabeçalho global substituiu a marca decorativa pela assinatura `Jefferson Nunes`,
  vinculada ao início e visível acima da dobra em todas as rotas. Em 320px, ela ocupa
  uma faixa de 44px e a navegação usa toda a largura sem quebrar rótulos.
- A mensagem obsoleta de que o e-mail estaria em configuração foi removida da home;
  `/curriculo` descreve os destinos reais de contato conforme o estado do perfil.

### Validação executada em 2026-09-04

- `node .agents/skills/impeccable/scripts/detect.mjs app/curriculo/page.tsx app/globals.css components/layout/Header.tsx` → sem achados
- `npm run format:check` → conforme
- `npm run lint` → 0 erros e 0 avisos
- `npm run typecheck` → sem erros
- `npx vitest run tests/unit/` → 6 arquivos, 41 testes aprovados
- `npm run build` → Turbopack concluído; `/curriculo` pré-renderizada
- `npm run test:e2e:functional` → 39 testes Playwright aprovados
- `npm run test:e2e:a11y` → 19 testes Playwright aprovados
- Revisão visual → `/curriculo` em 1280px e 320px; cabeçalho confirmado em 320px após
  corrigir a quebra do rótulo “Projetos”
- `git diff --check` → limpo

## Pendências e riscos conhecidos

- `content/profile.json` ainda tem `contato.valor` como placeholder
  (`SEU-EMAIL@exemplo.com`). Não quebra o build: a validação só exige formato de e-mail
  válido, então o placeholder passa silenciosamente. Não publicar antes de substituir.
- `content/profile.json` traz `"nome": "Jefferson Nunes"`, **inferido** do handle do GitHub e
  do LinkedIn. Precisa de confirmação do proprietário — aparece no rodapé de todas as páginas.
- `plataforma-portfolio` é hoje o único projeto implementado e não tem `linkDemonstracao`. O
  repositório está público em `https://github.com/jeffnunespy/portfolio-web`, verificado sem
  autenticação em 2026-09-04; a ficha agora oferece acesso direto ao código. Publicar a URL de
  produção permanece como a próxima evidência externa de maior efeito no valor da peça.
- Os estudos de caso e `public/curriculo.pdf` exigem confirmação do proprietário antes de serem
  declarados conteúdo profissional publicado.
- O asset-fonte `original-8696facb39b0641248efdeb31bc641db.webp` não está no workspace; portanto
  `assets/portfolio-source.webp` não pode ser criado sem receber o arquivo original.
- Teclado completo e zoom a 200% possuem cobertura automatizada; leitor de tela real e
  preview/canário permanecem como verificações manuais antes da publicação.
- `npm ci` emite avisos de peer dependency porque plugins transitivos do `eslint-config-next` ainda
  declaram suporte até ESLint 9; o lint em ESLint 10.8.1 passa. Não foi feita troca de versões fora
  do plano aprovado.

## Próximos passos

1. Fornecer e revisar biografia, e-mail, currículo, conteúdo/evidências reais dos projetos e o
   asset-fonte ausente. Os links de redes já estão definidos.
2. Atualizar os arquivos de conteúdo sem introduzir métricas ou experiências não verificadas.
3. Executar e registrar as inspeções manuais de acessibilidade e o preview/canário antes da promoção.
