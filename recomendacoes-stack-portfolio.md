# Recomendações de Atualização e Convergência da Stack

## Projeto: Portfólio Profissional

**Contexto:** portfólio público de desenvolvedor full-stack em formação, com foco em backend e engenharia de software.  
**Objetivo desta revisão:** manter a arquitetura atual, atualizar componentes defasados e concluir a fase de convergência antes do deploy público.

---

## 1. Resumo executivo

A arquitetura escolhida é adequada ao projeto e não precisa ser reformulada.

A recomendação principal é **preservar o desenho atual**:

- Next.js;
- React;
- TypeScript;
- conteúdo estático versionado;
- geração pré-renderizada;
- testes unitários;
- testes E2E;
- testes de acessibilidade;
- Vercel;
- ausência de banco de dados e backend nesta fase.

Os principais problemas encontrados estão relacionados à **defasagem do baseline de dependências** e à ausência de alguns mecanismos de qualidade ainda planejados.

### Prioridades principais

1. atualizar o contexto/documentação do projeto;
2. corrigir arquivos indevidamente versionados;
3. atualizar Node.js;
4. migrar Next.js;
5. atualizar React;
6. modernizar ESLint;
7. revisar vulnerabilidades e dependências;
8. implementar CI;
9. fortalecer validação de conteúdo;
10. completar testes de acessibilidade, teclado e componentes;
11. substituir placeholders e revisar conteúdo real;
12. gerar o currículo definitivo.

---

# 2. Stack atual

## Runtime

- Node.js 20 LTS

## Frontend

- Next.js 14.2.18
- App Router
- React 18.3
- TypeScript 5.x com `strict`

## Conteúdo

- arquivos JSON versionados;
- leitura em build time;
- validação centralizada em `lib/content.ts`;
- nenhum banco de dados;
- nenhuma API própria;
- nenhuma autenticação.

## Testes

- Vitest 2.x;
- Testing Library;
- jest-dom;
- Playwright 1.62;
- `@axe-core/playwright`.

## Qualidade

- ESLint 8;
- `eslint-config-next`;
- Prettier 3.

## Deploy

- Vercel;
- páginas estáticas/pré-renderizadas.

---

# 3. Avaliação geral

| Área | Nota | Avaliação |
|---|---:|---|
| Arquitetura | 9,0/10 | Muito adequada ao problema |
| Simplicidade | 9,5/10 | Sem backend ou infraestrutura desnecessária |
| Type safety | 8,5/10 | Boa base, com espaço para validar melhor dados externos |
| Testes | 9,0/10 | Acima da média para um portfólio |
| Acessibilidade | 9,0/10 | Muito boa decisão arquitetural |
| Segurança arquitetural | 9,0/10 | Superfície de ataque reduzida |
| Atualidade das dependências | 4,5/10 | Principal ponto de atenção |
| CI/CD | 5,0/10 | CI ainda ausente |
| Manutenibilidade | 8,5/10 | Estrutura simples e compreensível |
| Valor como portfólio | 9,5/10 | Demonstra processo de engenharia, não apenas interface |

---

# 4. Recomendações de stack

## 4.1. Next.js

### Estado atual

```text
Next.js 14.2.18
```

### Recomendação

```text
Next.js 16.3.x
```

### Motivos

- Next.js 14 está fora da linha atual de suporte;
- o projeto ainda não está consolidado em produção;
- o tamanho reduzido do código torna este um bom momento para migrar;
- evita manter um framework antigo e corrigir CVEs individualmente;
- mantém o projeto alinhado ao ecossistema atual.

### Decisão recomendada

**Manter Next.js, mas atualizar o major.**

Não há justificativa suficiente para migrar o projeto para Astro, Vite, Remix ou outro framework apenas por modernização.

---

# 5. React

## Estado atual

```text
React 18.3
```

## Recomendação

```text
React 19.2.x
```

### Motivos

- alinhar o projeto à geração atual do Next.js;
- reduzir dependências legadas;
- evitar manter React 18 artificialmente durante a atualização.

### Estratégia

Atualizar React no mesmo ciclo de migração do Next.js, mas manter o trabalho isolado em um branch/PR específico.

---

# 6. Node.js

## Estado atual

```text
Node.js 20
```

## Recomendação

```text
Node.js 24 LTS
```

### Motivos

- Node.js 20 já chegou ao fim de vida;
- Node 24 é uma linha LTS apropriada para produção;
- não há necessidade de utilizar a linha Current para este projeto.

### Locais que devem ser atualizados

- `.nvmrc`;
- `package.json` → `engines`;
- GitHub Actions;
- configuração da Vercel;
- README;
- documentação de desenvolvimento.

### Objetivo

Garantir que:

```text
ambiente local
=
CI
=
Vercel
=
documentação
```

utilizem a mesma versão principal.

---

# 7. TypeScript

## Estado atual

```text
TypeScript 5.x
strict: true
```

## Recomendação

```text
TypeScript 5.9.x
```

### Motivos

- manter uma versão madura durante a migração do Next;
- evitar introduzir simultaneamente breaking changes do TypeScript 6;
- preservar `strict: true`.

### Estratégia

Primeiro:

```text
Next 16 + React 19 + Node 24 + TypeScript 5.9
```

Depois de estabilizar o projeto:

```text
avaliar TypeScript 6 separadamente
```

Isso facilita diagnóstico e rollback.

---

# 8. ESLint

## Estado atual

```text
ESLint 8
```

## Problema

A versão já está fora de suporte.

## Recomendação

Migrar para:

```text
versão do ESLint suportada pelo Next.js adotado
+
eslint-config-next correspondente
+
flat config
```

### Estratégia

Não fazer uma atualização isolada antes da migração do Next.

Preferir:

```text
Next.js
+
eslint-config-next
+
ESLint
```

como um único trabalho de compatibilidade.

---

# 9. Prettier

## Estado atual

```text
Prettier 3
```

## Recomendação

**Manter.**

Não há necessidade arquitetural de substituição.

Garantir apenas:

- integração consistente com editor;
- script de verificação;
- execução em CI, quando apropriado.

---

# 10. Vitest

## Estado atual

```text
Vitest 2.x
```

## Recomendação

```text
Vitest 4.x
```

### Prioridade

Média.

### Motivos

- ferramenta continua adequada;
- não há necessidade de trocar por Jest;
- atualização deve ser feita após framework/runtime estarem estabilizados.

---

# 11. Testing Library

## Recomendação

**Manter.**

Utilizar principalmente para testar:

- componentes reutilizáveis;
- estados condicionais;
- comportamento de links;
- badges;
- elementos de navegação;
- comportamento semântico.

Evitar transformar testes de componentes em testes excessivamente acoplados à implementação.

---

# 12. Playwright

## Estado atual

```text
Playwright 1.62
```

## Recomendação

**Manter.**

É uma excelente ferramenta para o tipo de requisito do projeto.

### Priorizar testes E2E para

- navegação principal;
- páginas de projetos;
- rotas inválidas;
- responsividade;
- currículo;
- links externos;
- metadata;
- teclado;
- acessibilidade;
- ausência de overflow horizontal;
- comportamento de repositório privado.

---

# 13. axe-core

## Recomendação

**Manter `@axe-core/playwright`.**

É uma boa forma de transformar requisitos de acessibilidade em verificações automatizadas.

Entretanto, axe não substitui validação manual.

### Verificações manuais complementares

- fluxo completo somente com teclado;
- foco visível;
- sequência de foco;
- semântica de headings;
- links compreensíveis;
- textos alternativos;
- zoom;
- navegação com leitor de tela;
- skip link.

---

# 14. Conteúdo em JSON

## Recomendação

**Manter o modelo atual.**

Não adicionar nesta fase:

- PostgreSQL;
- SQLite;
- Prisma;
- Supabase;
- Firebase;
- Strapi;
- Sanity;
- CMS headless;
- API própria;
- área administrativa.

### Arquitetura recomendada

```text
Git
 ↓
content/*.json
 ↓
validação
 ↓
build
 ↓
páginas estáticas
```

### Benefícios

- versionamento;
- histórico;
- revisão;
- rollback;
- simplicidade;
- ausência de infraestrutura adicional;
- conteúdo auditável.

---

# 15. Validação de conteúdo

A regra que exige evidência para competências deve ser preservada.

## Modelo conceitual

```text
Afirmação profissional
        ↓
Competência
        ↓
Projeto
        ↓
Evidência
```

Essa abordagem evita listas de tecnologias sem comprovação prática.

## Recomendação

Fortalecer a validação de `lib/content.ts`.

### Verificar

- tipos esperados;
- campos obrigatórios;
- arrays vazios;
- URLs;
- slugs;
- status permitidos;
- categorias;
- natureza do projeto;
- duplicidade de slug;
- referências a competências;
- projeto inexistente;
- imagem ausente;
- links opcionais;
- valores inconsistentes.

---

# 16. Evitar criar um mini-framework de validação

Se `lib/content.ts` começar a acumular muitas regras manuais como:

```ts
if (!...)
if (typeof ...)
if (!Array.isArray(...))
throw ...
```

avaliar a adoção de uma biblioteca de schema runtime.

Arquitetura conceitual:

```text
JSON
 ↓
Schema runtime
 ↓
dados validados
 ↓
aplicação
```

Não é obrigatório adicionar uma biblioteca agora.

### Critério

- poucos schemas pequenos → validação manual é aceitável;
- muitos campos e regras → schema runtime passa a ser preferível.

---

# 17. SSG versus exportação completamente estática

É importante documentar explicitamente qual modelo está sendo usado.

## Opção A — Next.js hospedado normalmente na Vercel

```text
GitHub
 ↓
Vercel Build
 ↓
Next.js
 ↓
CDN / infraestrutura Vercel
```

## Opção B — exportação completamente estática

```text
Next build
 ↓
HTML + CSS + JS + assets
 ↓
CDN
```

Como o projeto não possui:

- APIs;
- autenticação;
- banco;
- sessões;
- Server Actions necessárias;
- conteúdo dinâmico;

ele é um excelente candidato a arquitetura completamente estática.

### Recomendação

Escolher uma das duas estratégias e registrá-la como decisão arquitetural.

---

# 18. Deploy

## Recomendação

**Manter Vercel.**

Não adicionar infraestrutura própria apenas para demonstrar conhecimento.

Evitar neste projeto:

- VPS;
- Nginx manual;
- Kubernetes;
- Docker em produção;
- Coolify;
- reverse proxy próprio;
- banco de dados gerenciado.

### Princípio

Tecnologia deve existir para resolver um problema.

Docker, cloud, infraestrutura e backend podem ser demonstrados em projetos que realmente precisem deles.

---

# 19. Backend

A ausência de backend é adequada.

O projeto pode demonstrar competência em backend por meio dos projetos apresentados.

Não é necessário criar um backend artificial apenas para o próprio portfólio.

### Decisão recomendada

```text
Portfólio = apresentação estática
Projetos = demonstração de backend, cloud e engenharia
```

---

# 20. Testes

A stack atual já é suficiente.

Não adicionar sem necessidade:

- Cypress;
- Jest em paralelo;
- Selenium;
- outro runner E2E;
- Storybook apenas para aumentar a stack.

### Estratégia recomendada

```text
         E2E
     Playwright
        ▲
        │
 Componentes
Testing Library
        ▲
        │
   Unitários
    Vitest
```

Neste projeto, os E2E podem ter peso relativamente alto porque muitos requisitos são relacionados a:

- interface;
- navegação;
- responsividade;
- acessibilidade;
- metadata.

---

# 21. CI/CD

Esta é uma das principais lacunas atuais.

## Recomendação

Criar pipeline com GitHub Actions.

### Fluxo recomendado

```text
git push / pull request
          ↓
    GitHub Actions
          ↓
      npm ci
          ↓
   ┌──────┼────────┐
   ↓      ↓        ↓
 lint  typecheck  unit
   │      │        │
   └──────┼────────┘
          ↓
        build
          ↓
       E2E
          ↓
 accessibility
          ↓
      aprovação
```

### Gates sugeridos

- instalação reproduzível;
- lint;
- typecheck;
- testes unitários;
- build;
- E2E;
- acessibilidade.

---

# 22. Dependências e supply chain

Adicionar mecanismos básicos de manutenção.

## Recomendações

- utilizar `npm ci` em CI;
- manter `package-lock.json`;
- executar auditoria de dependências;
- habilitar Dependabot ou ferramenta equivalente;
- criar PRs automáticos de atualização;
- revisar atualizações major separadamente;
- opcionalmente utilizar CodeQL.

### Objetivo

Reduzir a chance de o projeto voltar a ficar anos atrás das versões suportadas.

---

# 23. `.gitignore`

Revisar imediatamente.

Arquivos normalmente não versionados:

```text
playwright-report/
test-results/
tsconfig.tsbuildinfo
.next/
out/
coverage/
*.log
```

Revisar também regras relacionadas a:

```text
.env*
```

preservando apenas exemplos deliberados, como:

```text
.env.example
```

## `original-*.webp`

Não remover automaticamente.

### Manter se

- forem assets fonte;
- fizerem parte do histórico do projeto;
- forem necessários para regenerar versões otimizadas.

### Remover do Git se

- forem intermediários temporários;
- forem cópias redundantes;
- não forem utilizados no processo de build ou edição.

---

# 24. Documentação de estado

`docs/ACTIVE_CONTEXT.md` precisa ser atualizado antes de continuar trabalho significativo com agentes de IA.

## Problema

Se o documento indica Fase 2 enquanto o código já concluiu Fases 3–7:

```text
contexto incorreto
        ↓
agente interpreta estado errado
        ↓
plano incorreto
        ↓
mudanças desnecessárias
        ↓
retrabalho
```

## Recomendação

Atualizar pelo menos:

- fase atual;
- fases concluídas;
- tarefas pendentes;
- decisões recentes;
- branch atual;
- próximos passos;
- estado dos testes;
- estado do build;
- pendências de dependências;
- riscos conhecidos.

---

# 25. Skip Link

Implementar um `SkipLink` se ainda não existir.

Exemplo conceitual:

```text
Tab
 ↓
"Pular para conteúdo principal"
 ↓
<main>
```

Isso reduz repetição de navegação para usuários de teclado e reforça os requisitos de acessibilidade.

---

# 26. `components/ui/`

Não criar a pasta apenas porque estava prevista no plano.

A estrutura atual:

```text
components/
├── layout/
└── project/
```

já é coerente.

Criar `components/ui/` apenas quando houver primitives realmente reutilizáveis, por exemplo:

```text
Button
Badge
Card
Container
Heading
Link
```

Arquitetura deve refletir necessidades reais, não apenas diagramas preliminares.

---

# 27. Stack alvo recomendada

```text
Portfolio
│
├── Runtime
│   └── Node.js 24 LTS
│
├── Frontend
│   ├── Next.js 16.3.x
│   ├── React 19.2.x
│   └── TypeScript 5.9.x
│
├── Conteúdo
│   ├── JSON versionado
│   └── validação em build time
│
├── Testes
│   ├── Vitest 4.x
│   ├── Testing Library
│   ├── Playwright 1.62
│   └── axe-core/playwright
│
├── Qualidade
│   ├── ESLint suportado pelo Next adotado
│   ├── eslint-config-next correspondente
│   └── Prettier 3
│
├── CI
│   └── GitHub Actions
│       ├── npm ci
│       ├── lint
│       ├── typecheck
│       ├── unit
│       ├── build
│       ├── E2E
│       └── acessibilidade
│
└── Deployment
    └── Vercel
```

---

# 28. Ordem recomendada para a Fase 8

## P0 — antes de continuar desenvolvimento

### 1. Atualizar documentação de estado

- `ACTIVE_CONTEXT.md`;
- `DEVELOPMENT_PLAN.md`, se necessário;
- situação real das fases;
- próximas tarefas.

### 2. Corrigir `.gitignore`

Remover artefatos indevidos do versionamento.

### 3. Atualizar Node.js

```text
20 → 24 LTS
```

### 4. Migrar Next.js

```text
14.2.18 → 16.3.x
```

### 5. Migrar React

```text
18.3 → 19.2.x
```

---

## P1 — qualidade e segurança

### 6. Modernizar ESLint

Migrar em conjunto com o ecossistema do Next atualizado.

### 7. Revisar vulnerabilidades

Executar auditoria e avaliar cada ocorrência.

Não utilizar `npm audit fix --force` indiscriminadamente.

### 8. Criar GitHub Actions

Adicionar gates de qualidade.

### 9. Fortalecer `lib/content.ts`

Cobrir dados inválidos e inconsistências.

### 10. Completar acessibilidade

Adicionar:

- SkipLink;
- E2E por teclado;
- axe-core;
- foco;
- semântica.

---

## P2 — modernização e cobertura

### 11. Atualizar Vitest

```text
2.x → 4.x
```

### 12. Adicionar testes de componentes necessários

Priorizar comportamento relevante.

### 13. Revisar responsividade

Validar:

- 320 px;
- 768 px;
- 1280 px;
- ausência de overflow horizontal.

### 14. Revisar metadata

Validar títulos e descrições por rota.

---

## P3 — conteúdo e publicação

### 15. Substituir placeholders

Atualizar `profile.json`.

### 16. Revisar projetos

Garantir:

- contexto real;
- status real;
- decisões reais;
- limitações reais;
- próximos passos reais;
- links válidos.

### 17. Gerar currículo final

Atualizar:

```text
public/curriculo.pdf
```

### 18. Executar checklist final

Confirmar:

```text
lint
typecheck
unit tests
build
E2E
accessibility
metadata
responsive
links
currículo
conteúdo
deploy
```

---

# 29. Estratégia de branches/PRs

Evitar misturar todas as alterações em um único commit ou PR.

## Sugestão

### PR 1 — contexto e higiene

```text
docs + gitignore
```

### PR 2 — runtime e framework

```text
Node 24
Next 16
React 19
TypeScript 5.9
ESLint
```

### PR 3 — dependências de teste

```text
Vitest
Testing Library
Playwright, se necessário
axe
```

### PR 4 — CI

```text
GitHub Actions
```

### PR 5 — validação

```text
lib/content.ts
schemas
testes
```

### PR 6 — acessibilidade

```text
SkipLink
keyboard E2E
axe
foco
```

### PR 7 — conteúdo final

```text
profile
projects
currículo
assets
```

### PR 8 — convergência

```text
testes completos
build
deploy
revisão final
```

---

# 30. O que não adicionar

Não adicionar tecnologias apenas para aumentar a quantidade de itens da stack.

## Evitar sem necessidade

- Django;
- FastAPI;
- Express;
- NestJS;
- PostgreSQL;
- Redis;
- Prisma;
- Docker em produção;
- Kubernetes;
- Terraform;
- Nginx;
- CMS;
- autenticação;
- analytics;
- filas;
- microserviços;
- GraphQL.

Essas tecnologias podem ser demonstradas em outros projetos em que resolvam problemas reais.

---

# 31. Princípios arquiteturais recomendados

## 31.1. Simplicidade proporcional

Escolher a solução mais simples que atenda completamente aos requisitos.

## 31.2. Evidência verificável

Toda afirmação profissional relevante deve apontar para evidência concreta.

## 31.3. Qualidade automatizada

Sempre que possível, transformar requisitos em gates executáveis.

## 31.4. Dependências atualizadas

Não permitir que versões fora de suporte permaneçam silenciosamente no projeto.

## 31.5. Documentação como parte do sistema

Em desenvolvimento assistido por IA, documentação desatualizada representa risco operacional real.

## 31.6. Infraestrutura com propósito

Não adicionar infraestrutura apenas para demonstrar conhecimento.

## 31.7. Transparência

Não apresentar:

- projeto incompleto como concluído;
- repositório privado como acessível;
- tecnologia não utilizada como competência comprovada;
- dados fictícios como reais.

---

# 32. Resultado esperado

Após a convergência, o projeto deve demonstrar um fluxo completo:

```text
Especificação
      ↓
Arquitetura
      ↓
Conteúdo versionado
      ↓
Type safety
      ↓
Validação
      ↓
Componentes
      ↓
Testes
      ↓
Acessibilidade
      ↓
CI
      ↓
Build
      ↓
Deploy
      ↓
Evidência profissional
```

Esse fluxo é mais valioso para o posicionamento profissional do projeto do que adicionar artificialmente backend, banco ou infraestrutura.

---

# 33. Conclusão

A stack não precisa ser redesenhada.

A recomendação é realizar uma **modernização controlada**:

```text
Next 14
React 18
Node 20
ESLint 8
Vitest 2
```

para aproximadamente:

```text
Next 16
React 19
Node 24 LTS
TypeScript 5.9
ESLint suportado
Vitest 4
```

mantendo:

```text
JSON
Playwright
Testing Library
axe-core
Prettier
Vercel
```

e adicionando:

```text
GitHub Actions
gates de qualidade
manutenção automatizada de dependências
validação de conteúdo mais robusta
```

O objetivo final deve ser um portfólio tecnicamente simples, mas com processo de engenharia demonstrável, verificável e profissional.
