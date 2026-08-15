---
name: novo-projeto-conteudo
description: Cria ou edita um estudo de caso em content/projects/*.json seguindo o schema validado por lib/content.ts. Use quando o usuário quiser adicionar um projeto novo ao portfólio, atualizar um existente, ou quando a validação de conteúdo (FR-011a, FR-024) estiver falhando.
---

# novo-projeto-conteudo

Todo projeto do portfólio é um JSON em `content/projects/`, validado em tempo de
build por `lib/content.ts`. Um campo faltando derruba o build inteiro, não só a
página do projeto. Esta skill garante um JSON válido na primeira tentativa.

## 1. Coletar informação real do usuário

Princípio X da constituição: **nunca invente** contexto, métricas, decisões,
responsabilidades ou resultados. Se faltar informação para um campo obrigatório,
pergunte ao usuário. Não preencha com texto plausível.

Perguntas mínimas se o usuário não forneceu: qual problema o projeto resolve,
qual foi a responsabilidade dele especificamente, e duas decisões técnicas reais
com a justificativa.

## 2. Schema obrigatório

Fonte da verdade: `lib/types.ts` (interface `Projeto`) e
`REQUIRED_PROJETO_FIELDS` em `lib/content.ts`. Leia ambos antes de escrever —
o schema pode ter mudado desde esta skill.

Campos obrigatórios (nenhum pode ser `""`, `null` ou `[]`):

```
slug, titulo, resumo, problemaTratado, status, categoria, natureza,
tecnologias, imagemApresentacao, competenciasDemonstradas, contexto,
objetivo, funcionalidadesPrincipais, responsabilidadeProprietario,
decisoesRelevantes, stack, limitacoesConhecidas, proximosPassos, destaque
```

Opcionais: `linkDemonstracao`, `linkRepositorio`.

Restrições que a validação impõe além da presença:

- `status` ∈ `"Em andamento" | "Concluído" | "Pausado" | "Arquivado"`
- `natureza` ∈ `"autoral" | "acadêmico" | "colaborativo" | "profissional"`
- `decisoesRelevantes` precisa de **no mínimo 2 itens**, cada um com
  `titulo` e `descricao`
- `linkRepositorio` usa a string literal `"privado"` quando o repositório não
  é público (FR-009a) — não omita o campo nem use `null`
- `destaque: true` faz o projeto aparecer na home
- `slug` deve ser kebab-case e **igual ao nome do arquivo** sem `.json`

## 3. Regra crítica: competências precisam de evidência

`validateCompetenciasComEvidencia` exige que **toda** competência listada em
`content/profile.json` (`competenciasPorArea[].competencias`) apareça em
`competenciasDemonstradas` de pelo menos um projeto. Isso é o Princípio I
(evidências acima de afirmações) codificado, e vale nos dois sentidos do fluxo:

- Ao **adicionar** competência ao perfil: garanta que algum projeto a demonstre.
- Ao **remover ou renomear** uma competência de um projeto: verifique se ela
  ainda tem evidência em outro, senão o build quebra.

As strings precisam bater **exatamente** (acentuação e maiúsculas incluídas).
Antes de escrever, leia `content/profile.json` e reutilize as strings existentes
em vez de criar variantes ("APIs REST" ≠ "API REST").

## 4. Imagem de apresentação

`imagemApresentacao` é um caminho a partir de `public/`, no padrão
`/images/projects/<slug>.<ext>`. O arquivo precisa existir de fato em
`public/images/projects/`. Os atuais são `.svg`; se o usuário fornecer raster,
prefira `.webp` e confirme que o arquivo foi colocado no lugar certo.

Nunca aponte para uma imagem inexistente — a página renderiza quebrada e o E2E
de detalhe falha.

## 5. Escrever e validar

Crie `content/projects/<slug>.json` espelhando a formatação dos arquivos
existentes (2 espaços de indentação, chaves na ordem do schema acima).

Depois valide, nesta ordem:

```bash
npx vitest run tests/unit/content.test.ts
npx playwright test tests/e2e/home.spec.ts tests/e2e/project-detail.spec.ts
```

Se a validação falhar, a mensagem de erro nomeia o campo e o arquivo — corrija
o JSON, não a validação em `lib/content.ts`.

## 6. Reportar

Diga qual arquivo foi criado, se `profile.json` precisou de ajuste, se a imagem
existe, e o resultado dos testes. Liste explicitamente qualquer campo que você
teve de pedir ao usuário e que ainda esteja pendente.
