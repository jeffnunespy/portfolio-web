# Como contribuir

Obrigado pelo interesse em contribuir com o portfólio! Este é um projeto pessoal, mas
correções, sugestões e relatos de problemas são bem-vindos. Este guia explica como o
repositório funciona e o que se espera de cada contribuição.

## Sumário

- [Antes de começar](#antes-de-começar)
- [Tipos de contribuição](#tipos-de-contribuição)
- [Ambiente local](#ambiente-local)
- [Fluxo de trabalho](#fluxo-de-trabalho)
- [Padrões do projeto](#padrões-do-projeto)
- [Conteúdo de projetos](#conteúdo-de-projetos)
- [Verificações obrigatórias](#verificações-obrigatórias)
- [Commits](#commits)
- [Pull requests](#pull-requests)
- [Uso de inteligência artificial](#uso-de-inteligência-artificial)

## Antes de começar

O repositório é **dirigido por especificação**. Antes de propor mudanças, leia:

1. [`.specify/memory/constitution.md`](../.specify/memory/constitution.md) — os dez princípios
   que prevalecem sobre qualquer outra orientação.
2. [`specs/001-experiencia-publica-inicial/spec.md`](../specs/001-experiencia-publica-inicial/spec.md)
   e [`plan.md`](../specs/001-experiencia-publica-inicial/plan.md) — requisitos e decisões
   técnicas aprovados.
3. [`specs/001-experiencia-publica-inicial/tasks.md`](../specs/001-experiencia-publica-inicial/tasks.md)
   — tarefas rastreáveis da feature.

> [!IMPORTANT]
> Requisitos aprovados não mudam durante a implementação. Se uma mudança contradiz a spec,
> abra uma issue descrevendo a divergência antes de escrever código.

Ao participar, você concorda em seguir o [Código de conduta](CODE_OF_CONDUCT.md).

## Tipos de contribuição

| Tipo                  | Como proceder                                                                     |
| --------------------- | --------------------------------------------------------------------------------- |
| 🐛 Bug                | Abra uma issue com passos para reproduzir, resultado esperado e resultado obtido. |
| ♿ Acessibilidade     | Descreva a tecnologia assistiva, o navegador e o trecho da página afetado.        |
| ✏️ Texto e ortografia | PR direto é bem-vindo; mantenha o português com acentuação completa.              |
| 💡 Melhoria           | Abra uma issue antes, para alinhar com a spec e a constituição.                   |
| 🔒 Vulnerabilidade    | **Não abra issue pública.** Siga a [política de segurança](SECURITY.md).          |

## Ambiente local

```bash
nvm use                         # Node de .nvmrc (24.19.0); engines exige ^24.15.0
npm ci                          # nunca npm install: o lockfile é a fonte da verdade
npx playwright install chromium # navegador dos testes E2E
npm run dev                     # http://localhost:3000
```

Detalhes de requisitos, variáveis de ambiente dos E2E e reprodução isolada estão no
[README](../README.md#requisitos).

## Fluxo de trabalho

1. Crie uma branch a partir de `master` com prefixo descritivo: `feat/`, `fix/`, `docs/`,
   `chore/`, `test/`.
2. Localize (ou proponha) a tarefa correspondente em `tasks.md`.
3. Faça a menor mudança que resolva o problema por completo, sem alterar arquivos não
   relacionados.
4. Rode as [verificações obrigatórias](#verificações-obrigatórias).
5. Marque a tarefa como concluída somente depois de validada e atualize
   [`docs/ACTIVE_CONTEXT.md`](../docs/ACTIVE_CONTEXT.md) quando o estado da feature avançar.
6. Abra o pull request contra `master`.

## Padrões do projeto

### Idioma

Domínio, tipos, campos JSON, mensagens de erro e documentação estão em **português**. Novas
interfaces e propriedades seguem o vocabulário existente (`Projeto`, `PerfilProfissional`,
`competenciasDemonstradas`, …) — não traduza para inglês.

### Código

- **TypeScript estrito.** Sem `any` implícito; tipos do domínio ficam em `lib/types.ts`.
- **Conteúdo só via `lib/content.ts`.** Rotas e componentes não leem arquivos diretamente.
- **CSS puro** em `app/globals.css`, seguindo os tokens e regras do [`DESIGN.md`](../DESIGN.md).
  Não adicione frameworks de estilo.
- **Simplicidade proporcional.** Prefira a solução mais simples que atenda ao requisito atual.
- **Dependências** só com justificativa registrada no PR. Toda dependência nova amplia a
  superfície de ataque e o custo de manutenção.
- **Formatação** pelo Prettier (`.prettierrc`: aspas duplas, ponto e vírgula, 100 colunas).

### Testes

- Não remova nem afrouxe testes para fazer a implementação passar.
- Mudanças em validação de conteúdo exigem casos em `tests/unit/content.test.ts`.
- Mudanças visíveis em páginas exigem cobertura E2E em `tests/e2e/`; páginas novas precisam de
  um `*.a11y.spec.ts` com axe-core.

### Acessibilidade

O alvo é **WCAG 2.1 AA**. Além do axe, confira manualmente:

- navegação completa por teclado, com foco sempre visível;
- hierarquia de cabeçalhos coerente;
- textos de link que façam sentido fora de contexto;
- alternativas textuais significativas para imagens;
- funcionamento em modo de cores forçadas e em 390 px de largura sem rolagem horizontal.

## Conteúdo de projetos

Os estudos de caso vivem em `content/projects/<slug>.json` e são validados no build.

> [!CAUTION]
> **Não invente métricas, resultados ou evidências.** Tudo o que for declarado precisa ser
> verificável por um link, um teste ou um artefato. O que ainda é intenção deve aparecer como
> escopo planejado, nunca como entrega.

Regras que fazem o build falhar:

- campos obrigatórios ausentes ou vazios;
- `status`, `natureza` ou `categoria` fora dos valores permitidos;
- `slug` fora de kebab-case ou duplicado;
- links que não sejam HTTPS válidos (`linkRepositorio` aceita `"privado"`);
- imagem ou currículo inexistente em `public/`;
- menos de duas `decisoesRelevantes`;
- mais de seis projetos reais em destaque;
- competência do perfil sem projeto que a demonstre.

Se o build falhar por validação, **ajuste o conteúdo** — nunca a validação. Ao mudar o schema,
atualize juntos `lib/types.ts`, as listas `REQUIRED_*` de `lib/content.ts`, todos os JSONs e
`tests/unit/content.test.ts`.

## Verificações obrigatórias

A mesma sequência do CI precisa passar antes do PR:

```bash
npm audit --omit=dev --audit-level=high
npm run format:check
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run test:e2e:functional
npm run test:e2e:a11y
```

> [!NOTE]
> `E2E_REUTILIZAR_SERVIDOR=1` agiliza a iteração local, mas uma execução com essa variável
> **não vale como aceite**: o servidor reaproveitado pode estar servindo outra versão.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/pt-br/), com descrição em
português no imperativo:

```text
feat(projetos): exibir decisões relevantes no estudo de caso
fix(build): corrigir validação de links de repositório privado
docs: registrar evidências do preview
chore(deps): atualizar dependências de teste
```

Escopos comuns: `visual`, `build`, `conteudo`, `projetos`, `a11y`, `seo`, `deps`, `ci`.

## Pull requests

Descreva no PR:

- **O quê e por quê** — o problema resolvido e a tarefa de `tasks.md` relacionada.
- **Como validar** — comandos executados e resultados (cole saídas resumidas).
- **Evidências visuais** — capturas em 390 px e 1280 px quando a interface mudar.
- **Riscos e pendências** — o que não foi verificado e por quê.

Checklist:

- [ ] A mudança segue a constituição e não altera requisitos aprovados.
- [ ] Todos os gates do CI passam localmente.
- [ ] Nenhum teste foi removido ou afrouxado.
- [ ] Conteúdo novo não contém métricas ou evidências inventadas.
- [ ] Documentação e `docs/ACTIVE_CONTEXT.md` atualizados quando aplicável.
- [ ] Nenhum segredo, token ou arquivo `.env*` foi versionado.

## Uso de inteligência artificial

Assistentes de IA podem ser usados, desde que de forma responsável (princípio X da
constituição): toda saída gerada é revisada por uma pessoa, validada pelos mesmos gates e de
responsabilidade de quem a submete. Não use IA para produzir evidências, métricas ou
resultados que não existam.
