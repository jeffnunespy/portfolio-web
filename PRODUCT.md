# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primário — recrutador técnico ou tech lead.** Avalia o proprietário para estágio, trainee ou vaga
júnior. Chega pelo LinkedIn, pelo GitHub ou por um currículo enviado em candidatura. Tem poucos
minutos e procura profundidade técnica verificável: como o candidato pensa arquitetura, o que ele
consegue conduzir sozinho da especificação ao deploy, e se as afirmações se sustentam.

**Secundário — cliente potencial de trabalho freelance.** Busca alguém capaz de construir uma
aplicação de ponta a ponta. Avalia capacidade de entregar produto completo — decisão, execução,
operação — e não apenas trechos de código.

Ambos chegam céticos por padrão: portfólios júnior costumam afirmar mais do que comprovam, e o
leitor sabe disso.

## Product Purpose

Portfólio profissional pessoal de Jefferson, entregue como site estático público. Apresenta
projetos como estudos de caso completos (problema, contexto, decisões, stack, limitações, próximos
passos), registra a evolução técnica do proprietário e apoia candidaturas para estágio, trainee e
vagas júnior.

Sucesso é um recrutador técnico concluir, em poucos minutos e sem precisar confiar em afirmações,
que o proprietário conduz uma aplicação da especificação ao deploy.

## Positioning

Desenvolvedor web em formação, com interesse em backend e percurso de estudo em Python e
Django. A plataforma demonstra práticas de versionamento, validação de conteúdo no build, testes
automatizados e integração contínua.

O posicionamento "em formação" é **uma escolha estratégica confirmada, a ser preservada**. Não é
uma lacuna a corrigir nem timidez a ser reescrita: é honestidade sobre o estágio de carreira,
coerente com o princípio constitucional "evidências acima de afirmações". Trabalho futuro não deve
inflar esse enquadramento para soar mais sênior.

O que um portfólio júnior vizinho não copiaria honestamente: estudos de caso que registram decisões
arquiteturais e suas razões, limitações conhecidas declaradas, e uma plataforma cuja própria
construção é auditável (validação de conteúdo que quebra o build, testes, CI, acessibilidade
verificada).

## Operating Context

O leitor avalia em sessão curta, frequentemente no celular, entre outras candidaturas. Costuma
chegar de um link externo (LinkedIn, GitHub, currículo em PDF) direto para uma rota específica, não
necessariamente pela home. Compara mentalmente com outros portfólios júnior, quase todos
indistinguíveis entre si.

O currículo em PDF (`public/curriculo.pdf`) é parte do fluxo: o site e o documento circulam juntos
e precisam contar a mesma história.

Repositório dirigido por especificação (spec-kit). A ordem de precedência é
`.specify/memory/constitution.md` > `specs/<feature>/` > sugestões de agente. Trabalho de design
não altera requisitos aprovados sem registrar a divergência primeiro.

## Capabilities and Constraints

**Stack e arquitetura.** Next.js 16 (App Router) + React 19 + TypeScript sobre Node.js 24. Site
estático: sem backend, sem banco de dados, sem autenticação e sem área administrativa nesta fase.
O site foi publicado na Vercel. Os estilos usam CSS puro (`app/globals.css`).

**Privacidade.** Nesta versão, o portfólio não coleta dados de navegação do visitante.
O [FR-027](specs/001-experiencia-publica-inicial/spec.md#functional-requirements) veda analytics próprios
e cookies de rastreamento. A restrição também impede incorporar conteúdo de terceiros, como
players de vídeo ou botões de compartilhamento, quando isso implica carregar cookies ou
rastreamento de terceiros. A seção [Dados técnicos do acesso](https://portfolio-web-three-zeta.vercel.app/privacidade#privacy-access)
do aviso de privacidade descreve o tratamento dos dados técnicos da conexão pela hospedagem.

**Conteúdo como fonte de dados.** Não há CMS nem API. Todo o conteúdo vive em JSON versionado em
`content/` — `profile.json` e `content/projects/*.json` (um estudo de caso por arquivo). `lib/content.ts`
lê esses arquivos em tempo de build e é o único ponto de acesso.

**Validação que quebra o build, intencionalmente.** `lib/content.ts` lança erro em vez de degradar:
campos obrigatórios não vazios, enums fechados (`status`, `natureza`, `categoria`), slugs em
kebab-case sem duplicatas, URLs HTTPS válidas, arquivos referenciados existindo de fato em
`public/`, no máximo 6 projetos em destaque, e — a regra central — **toda competência declarada no
perfil precisa aparecer em `competenciasDemonstradas` de algum projeto implementado**. Adicionar
uma competência sem projeto que a comprove faz o build falhar. Isso é o princípio constitucional em forma de
código; não deve ser contornado afrouxando a validação.

**Rotas públicas.** `/` apresenta o perfil, os destaques e as evidências do build. `/projetos`
lista o trabalho implementado e `/projetos/[slug]` exibe os estudos de caso. `/roadmap` reúne
o escopo planejado. `/sobre` descreve a biografia e o método de trabalho. `/curriculo` reúne
perfil, formação, trajetória, competências e download do PDF. `/privacidade` apresenta o aviso
acessível pelo rodapé. Rotas e slugs inexistentes oferecem recuperação com HTTP 404.

**Idioma.** Todo o domínio, tipos, campos JSON, mensagens de erro e documentação estão em
português. Nomes de interfaces e propriedades seguem o vocabulário existente.

**Gates de CI** (Node 24): `npm ci` → `npm audit --omit=dev --audit-level=high` → `format:check` →
`lint` → `typecheck` → `test -- --run` → `build` → `test:e2e:functional` → `test:e2e:a11y`.

## Brand Commitments

Nome pessoal: Jefferson. Em 2026-10-23, o proprietário aprovou a direção visual
**Minimalismo escuro** como o novo visual oficial, conforme o
[`registro da decisão`](docs/referencias-visuais/direcao-minimalista-escura.md) e a versão final de
[`prototipo-minimalista-escuro.html`](docs/referencias-visuais/prototipo-minimalista-escuro.html).
Tema escuro, Geologica leve, composição aberta, assinatura “Nunes.” com ponto laranja e
interações simples definem a identidade. Nana Silva aparece em texto, sem prévia de imagem.
Terreno, curvas e animações da direção anterior deixam de orientar o projeto.

`DESIGN.md` registra o sistema oficial construído no protótipo e aplicado às rotas na
execução de T102–T105 em 2026-10-24, com validação local em `docs/ACTIVE_CONTEXT.md`.
Os exemplos fictícios do HTML continuam exclusivos da demonstração visual;
aprovar o visual não os transforma em conteúdo ou evidência do portfólio.

Voz: sóbria, específica e verificável. O tom da constituição e dos estudos de caso evita superlativo
e promessa; descreve problema, decisão e limitação. Trabalho futuro deve preservar essa voz — o
portfólio ganha credibilidade por precisão, não por entusiasmo.

## Evidence on Hand

Esta seção existe para impedir que trabalho futuro trate como real algo que ainda não é. O estado
declarado pelo proprietário nesta sessão:

**Real e funcional hoje:**

- **GitHub** — `https://github.com/jeffnunespy`, perfil público e funcional. O repositório
  `jeffnunespy/portfolio-web` está público (conferido sem sessão em 2026-11-06).
  O perfil é um destino institucional; o acesso ao código usa o link do repositório.
- **LinkedIn** — `https://www.linkedin.com/in/jefferson-nunes-7bb309122/` (registrado em
  `profile.json` como link real).
- **A própria plataforma** — este repositório: Next.js 16, validação de conteúdo em build, testes
  Vitest, E2E funcionais e de acessibilidade (axe-core, WCAG 2.1 A/AA), CI completo, Dependabot.
  O repositório `jeffnunespy/portfolio-web` é **público**. Em 2026-11-06, o proprietário
  autorizou voltar a anunciar seu código, superando a premissa privada do PR #40.
  A ficha `plataforma-portfolio` descreve **este** repositório; cartões e detalhe devem
  oferecer `https://github.com/jeffnunespy/portfolio-web` como acesso ao código (FR-008).
  Demonstração pública e código público são evidências distintas; a abertura deste
  repositório não muda a condição privada do código de Nana Silva.
- **Nana Silva** — projeto profissional desenvolvido integralmente pelo proprietário para uma
  necessidade real da artista, conforme confirmação em 2026-10-23. Catálogo estático com Astro,
  conteúdo no Notion e automação de publicação com Cloudflare Workers/KV. A ficha `nana-silva`
  também usa `real: true` e aponta para `https://nana-silva-validacao.pages.dev/`, ambiente publicado
  de validação. O relatório técnico de 2026-10-22 fundamenta a arquitetura e as limitações; não é
  aprovação de lançamento comercial nem comprovação de todos os portões operacionais.

**Escopo planejado no roadmap:**

`hayyanu`, `sistema-helpdesk`, `gerenciamento-filas` e `transcricao-audio` registram escopos
planejados. HAYYANU tem implementação parcial do backend em Django. O domínio de negócio e o
site público seguem planejados. A publicação de novas evidências depende da aprovação do
proprietário.

O campo `real: false` mantém essas quatro entradas exclusivamente em `/roadmap`, como
escopo planejado. Elas ficam fora do catálogo, das fichas públicas e da comprovação de
competências. Seus textos e tecnologias previstas descrevem intenções de projeto.

**Conteúdo de publicação confirmado em 2026-10-23:**

- Nome, e-mail, formação, trajetória e estudo de caso da plataforma foram confirmados pelo
  proprietário. O perfil atual não usa e-mail placeholder.
- `public/curriculo.pdf` foi gerado com esses dados e está disponível para download em `/curriculo`.
  O documento tem uma página, com conteúdo e links conferidos contra `content/profile.json`.
- As URLs inventadas de `transcricao-audio` (`exemplo-transcricao.vercel.app` e
  `github.com/transcricao-audio`) foram removidas do conteúdo; a ficha não expõe mais link algum.
- Imagens em `public/images/projects/*.svg` são apresentação genérica, não capturas de aplicações
  reais.

**Afirmações públicas exigem fonte.** Use somente os projetos e o trabalho descritos nas
fichas. Métricas de uso, resultados de negócio, depoimentos, clientes, prêmios e outras
experiências exigem evidência própria antes de entrar no conteúdo ou nos metadados.

## Product Principles

1. **Evidência antes de afirmação.** Toda competência apresentada precisa ter algo verificável por
   trás. Quando não há evidência, a resposta correta é omitir ou declarar a ausência — nunca
   preencher com texto plausível. A validação de build já força isso; o design e a copy devem
   respeitar o mesmo padrão.

2. **Honestidade sobre o estágio é posicionamento, não fraqueza.** "Em formação" fica. O portfólio
   compete por precisão e profundidade de raciocínio, não por aparentar senioridade.

3. **Os projetos implementados são a demonstração.** A plataforma tem código público e
   demonstra validação, testes, acessibilidade e operação. Nana Silva tem um catálogo publicado
   em ambiente de validação. O roadmap registra os demais projetos como escopo planejado.

4. **Simplicidade proporcional.** A solução mais simples que atende ao requisito atual vence.
   Dependências, camadas e abstrações novas exigem justificativa. Sem framework de CSS, sem CMS, sem
   backend enquanto o problema não pedir.

5. **Acessível e sólido por obrigação, não por enfeite.** Responsivo, navegável por teclado,
   semântico, com contraste adequado e estados claros. É gate de CI, não aspiração.

## Accessibility & Inclusion

WCAG 2.1 níveis A e AA orienta o requisito de acessibilidade. A suíte
`npm run test:e2e:a11y` verifica critérios automatizáveis com `@axe-core/playwright`. As páginas devem ser responsivas, navegáveis por teclado, com
estrutura semântica, contraste adequado, textos alternativos e estados claros.

Verificações manuais ainda pendentes e registradas em `docs/ACTIVE_CONTEXT.md`: navegação completa
por teclado, zoom e leitor de tela.
