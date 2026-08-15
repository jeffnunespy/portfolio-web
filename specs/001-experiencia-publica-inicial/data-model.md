# Data Model: Experiência Pública Inicial do Portfólio

Fonte: seção "Key Entities" de [spec.md](./spec.md). Todos os dados são estáticos (arquivos JSON
em `content/`), sem persistência dinâmica nesta fase — ver [research.md](./research.md).

## Projeto

Representa um estudo de caso apresentado no portfólio. Um arquivo `content/projects/<slug>.json`
por projeto.

| Campo                          | Tipo                                    | Obrigatório | Regras                                                                                                                                                                               |
| ------------------------------ | --------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `slug`                         | string                                  | Sim         | Identificador de URL definido pelo proprietário na publicação; estável, imutável após publicado (FR-013a). Chave primária de fato (nome do arquivo).                                 |
| `titulo`                       | string                                  | Sim         | —                                                                                                                                                                                    |
| `resumo`                       | string                                  | Sim         | —                                                                                                                                                                                    |
| `problemaTratado`              | string                                  | Sim         | —                                                                                                                                                                                    |
| `status`                       | enum                                    | Sim         | Conjunto fechado: `"Em andamento"` \| `"Concluído"` \| `"Pausado"` \| `"Arquivado"` (FR-011).                                                                                        |
| `categoria`                    | enum                                    | Sim         | Conjunto fechado: `"Backend"` \| `"Web"` \| `"Frontend"` \| `"Dados"` \| `"Automação"` \| `"Infraestrutura"` \| `"Mobile"` (FR-006).                                                 |
| `natureza`                     | enum                                    | Sim         | `"autoral"` \| `"acadêmico"` \| `"colaborativo"` \| `"profissional"` (FR-010).                                                                                                       |
| `tecnologias`                  | string[]                                | Sim         | Tecnologias/áreas técnicas.                                                                                                                                                          |
| `imagemApresentacao`           | string (path)                           | Sim         | Se ausente no momento da publicação, projeto não deve ser publicado (evita Edge Case de imagem quebrada por dado ausente; falha de carregamento em runtime é tratada separadamente). |
| `competenciasDemonstradas`     | string[]                                | Sim         | Referenciadas por nome; usadas para montar evidência de Competência.                                                                                                                 |
| `contexto`                     | string                                  | Sim         | —                                                                                                                                                                                    |
| `objetivo`                     | string                                  | Sim         | —                                                                                                                                                                                    |
| `funcionalidadesPrincipais`    | string[]                                | Sim         | —                                                                                                                                                                                    |
| `responsabilidadeProprietario` | string                                  | Sim         | —                                                                                                                                                                                    |
| `decisoesRelevantes`           | { titulo: string; descricao: string }[] | Sim         | Mínimo de 2 itens (spec Clarifications).                                                                                                                                             |
| `stack`                        | string[]                                | Sim         | Formato informativo, não link para gerenciador de pacotes.                                                                                                                           |
| `limitacoesConhecidas`         | string[]                                | Sim         | —                                                                                                                                                                                    |
| `proximosPassos`               | string[]                                | Sim         | —                                                                                                                                                                                    |
| `linkDemonstracao`             | string (URL)                            | Não         | Omitido no card/página quando ausente (FR-008, Edge Cases).                                                                                                                          |
| `linkRepositorio`              | string (URL) \| `"privado"`             | Não         | Quando `"privado"`, renderiza CTA de contato em vez de link (FR-009a).                                                                                                               |
| `destaque`                     | boolean                                 | Sim         | Seleção manual do proprietário para a home; respeita teto de 6 (FR-004).                                                                                                             |

**Validação de publicação**: um projeto só pode ser incluído em `content/projects/` se todos os
campos obrigatórios estiverem presentes — não há estado de rascunho nesta fase (sem área
administrativa).

## Perfil profissional

Arquivo único `content/profile.json`.

| Campo                     | Tipo                                       | Obrigatório | Regras                                                                                                    |
| ------------------------- | ------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------- |
| `tituloPosicionamento`    | string                                     | Sim         | Valor fixo por FR-002: "Desenvolvedor Full-Stack em Formação".                                            |
| `descricaoPosicionamento` | string                                     | Sim         | Valor fixo por FR-002.                                                                                    |
| `competenciasPorArea`     | { area: string; competencias: string[] }[] | Sim         | Área de profundidade (backend/engenharia de software) distinta de complementares (cloud/DevOps) — FR-003. |
| `biografiaSobre`          | string                                     | Sim         | Página Sobre; deve ser consistente (não contraditória) com posicionamento da home (FR-014).               |
| `linkCurriculo`           | string (path do arquivo para download)     | Sim         | Página de currículo também usa este conteúdo (FR-015).                                                    |
| `linkGithub`              | string (URL)                               | Sim         | —                                                                                                         |
| `linkLinkedin`            | string (URL)                               | Sim         | —                                                                                                         |
| `contato`                 | { tipo: "email"; valor: string }           | Sim         | Mínimo um meio de contato direto (FR-017).                                                                |

## Competência

Não é um arquivo separado — é derivada de `competenciasPorArea` (Perfil) e validada contra
`competenciasDemonstradas` (Projeto) em build time.

| Campo        | Tipo                   | Obrigatório | Regras                                                                                                                                 |
| ------------ | ---------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nome`       | string                 | Sim         | —                                                                                                                                      |
| `area`       | string                 | Sim         | Ex.: backend, engenharia de software, cloud, DevOps.                                                                                   |
| `evidencias` | referência a Projeto[] | Sim         | Toda competência exibida DEVE ter ao menos um projeto que a referencie em `competenciasDemonstradas`, ou build falha (FR-024, SC-007). |

**Regra de build**: um script de validação (`lib/content.ts`) DEVE rejeitar o build se qualquer
competência listada em `profile.json` não tiver nenhum projeto publicado que a referencie —
aplicação automatizada de FR-024/SC-007, evitando publicação de afirmação sem evidência.

## Relacionamentos

```text
Perfil profissional 1 ── N Competência (via competenciasPorArea)
Competência          N ── N Projeto   (via competenciasDemonstradas)
Projeto               1 ── 1 página própria (rota /projetos/[slug])
```

Não há entidades de usuário/visitante, sessão ou dado transacional — consistente com "sem
autenticação, sem cadastro de visitantes" (FR-019, spec Input).

## Impacto da migração para Next.js 16

A migração não cria, remove nem altera entidades, campos, validações, relacionamentos ou arquivos de
conteúdo. `Perfil profissional`, `Projeto` e `Competência` mantêm o contrato acima.

As únicas transições técnicas são de execução e tipagem:

```text
Rota /projetos/[slug]
params síncrono (Next.js 14) -> Promise<{ slug: string }> (Next.js 16)

Conteúdo JSON validado em build
mesmo esquema -> mesmo esquema
```

Qualquer mudança observável nos JSONs, slugs ou ordem de destaque fica fora do escopo desta
migração e deve ser tratada por requisito próprio.

## Impacto da convergência de stack

A convergência (Fase 8) **não altera a estrutura das entidades**: nenhum campo é criado, removido,
renomeado ou tem seu tipo alterado. Duas coisas mudam:

1. **Rigor da validação** — as mesmas regras já expressas nas tabelas acima passam a ser verificadas
   de forma completa em build time (ver P1/Etapa 5 do [plan.md](./plan.md)).
2. **Valores de conteúdo** — placeholders em `content/profile.json` e nos projetos são substituídos
   por conteúdo real (P3). Estrutura idêntica, dados verdadeiros.

### Matriz de validação em build time

Estado atual de `lib/content.ts` e cobertura alvo:

| Regra                                                            | Requisito       | Hoje | Alvo |
| ---------------------------------------------------------------- | --------------- | ---- | ---- |
| Campos obrigatórios de Projeto presentes e não vazios            | FR-006, FR-011a | Sim  | Sim  |
| Campos obrigatórios de Perfil presentes e não vazios             | FR-011a         | Sim  | Sim  |
| Mínimo de 2 decisões relevantes por projeto                      | FR-012          | Sim  | Sim  |
| Competência sem projeto que a referencie                         | FR-024, SC-007  | Sim  | Sim  |
| Tipo esperado de cada campo (não apenas presença)                | FR-006          | Não  | Sim  |
| Unicidade e formato do slug entre projetos                       | FR-013a         | Não  | Sim  |
| `status` pertencente ao conjunto fechado                         | FR-011          | Não  | Sim  |
| `natureza` pertencente ao conjunto fechado                       | FR-010          | Não  | Sim  |
| `categoria` com valor válido                                     | FR-006          | Não  | Sim  |
| Formato de URL em links de demonstração/repositório              | FR-008          | Não  | Sim  |
| Formato de URL/`mailto:` em currículo, GitHub, LinkedIn, contato | FR-015–FR-017   | Não  | Sim  |
| Imagem de apresentação referenciada existe                       | FR-006          | Não  | Sim  |
| Coerência de link opcional (ausente / `"privado"` / URL)         | FR-009, FR-009a | Não  | Sim  |
| Teto de 6 projetos em destaque                                   | FR-004          | Não  | Sim  |
| Competência demonstrada referenciando projeto existente          | FR-024          | Não  | Sim  |

Cada linha marcada como "Não -> Sim" recebe um teste unitário cobrindo o caso inválido, de modo que
a regra seja verificável e não apenas declarada.

O conjunto fechado de `status` é "Em andamento", "Concluído", "Pausado", "Arquivado" (FR-011); o de
`natureza` é autoral, acadêmico, colaborativo, profissional (FR-010); o de `categoria` é "Backend",
"Web", "Frontend", "Dados", "Automação", "Infraestrutura", "Mobile" (FR-006). A spec não enumerava os
valores de `categoria`; o conjunto acima cobre os valores já publicados e as áreas previstas, e
ampliá-lo exige atualizar este documento, `lib/content.ts` e os testes em conjunto.

### Modelo conceitual preservado

```text
Afirmação profissional -> Competência -> Projeto -> Evidência
```

Nenhuma competência pode ser publicada sem percorrer essa cadeia até uma evidência concreta. A
convergência fortalece a aplicação automatizada dessa regra; não a flexibiliza.
