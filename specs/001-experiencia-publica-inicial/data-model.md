# Data Model: Experiência Pública Inicial do Portfólio

Fonte: seção "Key Entities" de [spec.md](./spec.md). Todos os dados são estáticos (arquivos JSON
em `content/`), sem persistência dinâmica nesta fase — ver [research.md](./research.md).

## Projeto

Representa um estudo de caso apresentado no portfólio. Um arquivo `content/projects/<slug>.json`
por projeto.

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `slug` | string | Sim | Identificador de URL definido pelo proprietário na publicação; estável, imutável após publicado (FR-013a). Chave primária de fato (nome do arquivo). |
| `titulo` | string | Sim | — |
| `resumo` | string | Sim | — |
| `problemaTratado` | string | Sim | — |
| `status` | enum | Sim | Conjunto fechado: `"Em andamento"` \| `"Concluído"` \| `"Pausado"` \| `"Arquivado"` (FR-011). |
| `categoria` | string | Sim | — |
| `natureza` | enum | Sim | `"autoral"` \| `"acadêmico"` \| `"colaborativo"` \| `"profissional"` (FR-010). |
| `tecnologias` | string[] | Sim | Tecnologias/áreas técnicas. |
| `imagemApresentacao` | string (path) | Sim | Se ausente no momento da publicação, projeto não deve ser publicado (evita Edge Case de imagem quebrada por dado ausente; falha de carregamento em runtime é tratada separadamente). |
| `competenciasDemonstradas` | string[] | Sim | Referenciadas por nome; usadas para montar evidência de Competência. |
| `contexto` | string | Sim | — |
| `objetivo` | string | Sim | — |
| `funcionalidadesPrincipais` | string[] | Sim | — |
| `responsabilidadeProprietario` | string | Sim | — |
| `decisoesRelevantes` | { titulo: string; descricao: string }[] | Sim | Mínimo de 2 itens (spec Clarifications). |
| `stack` | string[] | Sim | Formato informativo, não link para gerenciador de pacotes. |
| `limitacoesConhecidas` | string[] | Sim | — |
| `proximosPassos` | string[] | Sim | — |
| `linkDemonstracao` | string (URL) | Não | Omitido no card/página quando ausente (FR-008, Edge Cases). |
| `linkRepositorio` | string (URL) \| `"privado"` | Não | Quando `"privado"`, renderiza CTA de contato em vez de link (FR-009a). |
| `destaque` | boolean | Sim | Seleção manual do proprietário para a home; respeita teto de 6 (FR-004). |

**Validação de publicação**: um projeto só pode ser incluído em `content/projects/` se todos os
campos obrigatórios estiverem presentes — não há estado de rascunho nesta fase (sem área
administrativa).

## Perfil profissional

Arquivo único `content/profile.json`.

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `tituloPosicionamento` | string | Sim | Valor fixo por FR-002: "Desenvolvedor Full-Stack em Formação". |
| `descricaoPosicionamento` | string | Sim | Valor fixo por FR-002. |
| `competenciasPorArea` | { area: string; competencias: string[] }[] | Sim | Área de profundidade (backend/engenharia de software) distinta de complementares (cloud/DevOps) — FR-003. |
| `biografiaSobre` | string | Sim | Página Sobre; deve ser consistente (não contraditória) com posicionamento da home (FR-014). |
| `linkCurriculo` | string (path do arquivo para download) | Sim | Página de currículo também usa este conteúdo (FR-015). |
| `linkGithub` | string (URL) | Sim | — |
| `linkLinkedin` | string (URL) | Sim | — |
| `contato` | { tipo: "email"; valor: string } | Sim | Mínimo um meio de contato direto (FR-017). |

## Competência

Não é um arquivo separado — é derivada de `competenciasPorArea` (Perfil) e validada contra
`competenciasDemonstradas` (Projeto) em build time.

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `nome` | string | Sim | — |
| `area` | string | Sim | Ex.: backend, engenharia de software, cloud, DevOps. |
| `evidencias` | referência a Projeto[] | Sim | Toda competência exibida DEVE ter ao menos um projeto que a referencie em `competenciasDemonstradas`, ou build falha (FR-024, SC-007). |

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
