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

Desenvolvedor em formação com foco em backend Python/Django, apresentando profundidade em
engenharia de software, Google Cloud Platform e práticas de DevOps como diferencial sobre o perfil
júnior típico.

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
Sem coleta de dados de navegação. Deploy alvo: Vercel. Estilos em CSS puro (`app/globals.css`), sem
framework de CSS.

**Conteúdo como fonte de dados.** Não há CMS nem API. Todo o conteúdo vive em JSON versionado em
`content/` — `profile.json` e `content/projects/*.json` (um estudo de caso por arquivo). `lib/content.ts`
lê esses arquivos em tempo de build e é o único ponto de acesso.

**Validação que quebra o build, intencionalmente.** `lib/content.ts` lança erro em vez de degradar:
campos obrigatórios não vazios, enums fechados (`status`, `natureza`, `categoria`), slugs em
kebab-case sem duplicatas, URLs HTTPS válidas, arquivos referenciados existindo de fato em
`public/`, no máximo 6 projetos em destaque, e — a regra central — **toda competência declarada no
perfil precisa aparecer em `competenciasDemonstradas` de algum projeto**. Adicionar uma competência
sem projeto que a comprove faz o build falhar. Isso é o princípio constitucional em forma de
código; não deve ser contornado afrouxando a validação.

**Rotas públicas.** `/` (home), `/projetos` (lista), `/projetos/[slug]` (estudo de caso), `/sobre`,
`/curriculo`, mais dois estados 404 (global e de projeto inexistente).

**Idioma.** Todo o domínio, tipos, campos JSON, mensagens de erro e documentação estão em
português. Nomes de interfaces e propriedades seguem o vocabulário existente.

**Gates de CI** (Node 24): `npm ci` → `npm audit --omit=dev --audit-level=high` → `format:check` →
`lint` → `typecheck` → `test -- --run` → `build` → `test:e2e:functional` → `test:e2e:a11y`.

## Brand Commitments

Nome pessoal: Jefferson. Sem identidade visual, logotipo ou paleta previamente estabelecidos como
vinculantes.

Voz: sóbria, específica e verificável. O tom da constituição e dos estudos de caso evita superlativo
e promessa; descreve problema, decisão e limitação. Trabalho futuro deve preservar essa voz — o
portfólio ganha credibilidade por precisão, não por entusiasmo.

## Evidence on Hand

Esta seção existe para impedir que trabalho futuro trate como real algo que ainda não é. O estado
declarado pelo proprietário nesta sessão:

**Real e funcional hoje:**

- **GitHub** — `https://github.com/jeffnunespy`. É o **único link externo real e funcional** do
  portfólio.
- **LinkedIn** — `https://www.linkedin.com/in/jefferson-nunes-7bb309122/` (registrado em
  `profile.json` como link real).
- **A própria plataforma** — este repositório: Next.js 16, validação de conteúdo em build, testes
  Vitest, E2E funcionais e de acessibilidade (axe-core, WCAG 2.1 A/AA), CI completo, Dependabot.
  É código auditável e existente. A ficha `plataforma-portfolio` descreve **este** repositório e é
  por isso a única marcada `real: true` em `content/projects/`: o que ela afirma pode ser conferido
  lendo o código que a serve.

**Não reais — as outras quatro fichas descrevem estrutura planejada:**

`hayyanu`, `sistema-helpdesk`, `gerenciamento-filas` e `transcricao-audio` descrevem **escopo
planejado, não trabalho entregue**. Nenhum deles existe como código hoje. Os JSONs foram escritos
para exercitar o schema e a validação, não como relatos de projetos concluídos.

Consequência vinculante: essas quatro fichas só podem ser publicadas **enquanto se apresentarem
como planejamento**. O campo `real: false` governa isso no código — a ficha troca o estudo de caso
por um aviso "Estrutura de conteúdo", o cartão ganha a marca correspondente, e os textos
(`resumo`, `contexto`, `responsabilidadeProprietario`) estão redigidos em linguagem de intenção,
não de execução. Apresentá-las como trabalho realizado violaria o princípio I da constituição e
enganaria exatamente o leitor que o portfólio quer convencer. Trabalho futuro (design, copy, SEO,
metadados) não deve tratar esses textos, tecnologias, decisões arquiteturais ou status como fatos
sobre o proprietário.

**Placeholders explícitos ainda no conteúdo:**

- `contato.valor` = `SEU-EMAIL@exemplo.com` — e-mail real pendente. Passa na validação silenciosamente
  porque o formato é válido.
- `public/curriculo.pdf` — o PDF definitivo ainda não foi fornecido.
- As URLs inventadas de `transcricao-audio` (`exemplo-transcricao.vercel.app` e
  `github.com/transcricao-audio`) foram removidas do conteúdo; a ficha não expõe mais link algum.
- Imagens em `public/images/projects/*.svg` são apresentação genérica, não capturas de aplicações
  reais.

**Ausências que não podem ser preenchidas por invenção:** não há métricas de uso, número de
usuários, resultados de negócio, depoimentos, clientes, prêmios, experiência profissional
comprovada nem aplicações publicadas. Nada disso deve ser gerado, estimado ou sugerido em conteúdo,
copy ou metadados.

## Product Principles

1. **Evidência antes de afirmação.** Toda competência apresentada precisa ter algo verificável por
   trás. Quando não há evidência, a resposta correta é omitir ou declarar a ausência — nunca
   preencher com texto plausível. A validação de build já força isso; o design e a copy devem
   respeitar o mesmo padrão.

2. **Honestidade sobre o estágio é posicionamento, não fraqueza.** "Em formação" fica. O portfólio
   compete por precisão e profundidade de raciocínio, não por aparentar senioridade.

3. **Nesta fase, a plataforma é a demonstração.** Enquanto os projetos não existem, o artefato
   técnico real é o próprio site. Sua qualidade — validação, testes, acessibilidade, operação — é o
   que há de verificável.

4. **Simplicidade proporcional.** A solução mais simples que atende ao requisito atual vence.
   Dependências, camadas e abstrações novas exigem justificativa. Sem framework de CSS, sem CMS, sem
   backend enquanto o problema não pedir.

5. **Acessível e sólido por obrigação, não por enfeite.** Responsivo, navegável por teclado,
   semântico, com contraste adequado e estados claros. É gate de CI, não aspiração.

## Accessibility & Inclusion

WCAG 2.1 níveis A e AA, verificado automaticamente com `@axe-core/playwright` em todas as rotas
públicas (`npm run test:e2e:a11y`). As páginas devem ser responsivas, navegáveis por teclado, com
estrutura semântica, contraste adequado, textos alternativos e estados claros.

Verificações manuais ainda pendentes e registradas em `docs/ACTIVE_CONTEXT.md`: navegação completa
por teclado, zoom e leitor de tela.
