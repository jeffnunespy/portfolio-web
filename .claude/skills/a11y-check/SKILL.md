---
name: a11y-check
description: Roda os testes axe/Playwright de acessibilidade, interpreta as violações WCAG 2.1 A/AA e aplica as correções. Use ao criar uma página ou componente novo, quando um teste *.a11y.spec.ts falhar, ou quando o usuário pedir para verificar acessibilidade, contraste, navegação por teclado ou leitores de tela.
---

# a11y-check

Acessibilidade é o Princípio VII da constituição: páginas públicas devem ser
responsivas, navegáveis por teclado, semânticas, com contraste adequado, textos
alternativos e estados claros.

## 1. Rodar a verificação automática

```bash
npm run test:e2e:a11y
```

Isso roda todos os testes marcados `@a11y` — hoje `home.a11y.spec.ts`,
`project-detail.a11y.spec.ts` e `accessibility.a11y.spec.ts`, este último
cobrindo **todas** as rotas públicas mais a ordem de tabulação do skip link.
Não liste os arquivos manualmente: rotas como `/projetos`, `/sobre` e
`/curriculo` só são verificadas por `accessibility.a11y.spec.ts`.

Os specs usam `AxeBuilder` com `withTags(["wcag2a", "wcag2aa"])` e esperam
`violations` vazio. O primeiro run sobe o servidor via build (~1 min).

Se a rota alterada ainda não tem spec de a11y, crie um seguindo exatamente o
padrão de `tests/e2e/home.a11y.spec.ts` — mesmo import, mesmas tags, mesma
asserção. Rotas atuais: `/`, `/projetos`, `/projetos/[slug]`, `/sobre`,
`/curriculo`.

## 2. Interpretar as violações

Cada violação traz `id`, `impact`, `help` e `nodes[].html`. Corrija por ordem de
`impact` (critical → serious → moderate → minor). Correções padrão para os IDs
que aparecem neste projeto:

| ID axe | Causa provável aqui | Correção |
|---|---|---|
| `color-contrast` | Token de cor em `app/globals.css` | Ajuste a variável CSS, não o componente. Mínimo 4.5:1 texto normal, 3:1 texto grande e bordas de foco |
| `image-alt` | `ProjectImage.tsx` sem `alt` | `alt` descritivo com o título do projeto; `alt=""` só se for puramente decorativa |
| `link-name` | `EvidenceLink.tsx` com ícone sem texto | Texto visível ou `aria-label` que faça sentido fora de contexto (nunca "clique aqui" / "saiba mais") |
| `heading-order` | Página pulando de `h1` para `h3` | Um `h1` por página, hierarquia sem saltos |
| `landmark-*`, `region` | Conteúdo fora de landmark | `Header` em `<header>`, `Footer` em `<footer>`, conteúdo em `<main>` — verifique `app/layout.tsx` |
| `html-has-lang` | `app/layout.tsx` | `<html lang="pt-BR">` |
| `list` | `<li>` fora de `<ul>`/`<ol>` | Envolva listas de tecnologias/stack corretamente |

Corrija a causa no componente ou no CSS. **Nunca** silencie a violação com
`disableRules`, `exclude` ou `aria-hidden` para fazer o teste passar.

## 3. Verificar o que o axe não detecta

O axe cobre ~30% dos critérios WCAG. Depois que os testes passarem, revise
manualmente na página alterada:

- **Foco visível**: todo elemento interativo tem indicador de foco perceptível
  (`:focus-visible` em `globals.css`), com contraste ≥ 3:1 contra o fundo.
- **Ordem de tabulação**: segue a ordem visual; nada interativo é inalcançável
  por teclado; sem `tabIndex` positivo.
- **Texto de link fora de contexto**: `ProjectCard` e `EvidenceLink` devem
  dizer para onde levam ("Ver estudo de caso: Sistema de Helpdesk"), não "ver mais".
- **Alt semântico**: descreve a função/conteúdo da imagem, não o arquivo.
- **Estados**: vazio, erro e not-found (`app/not-found.tsx`,
  `app/projetos/[slug]/not-found.tsx`) são anunciáveis e navegáveis.
- **Responsivo**: `tests/e2e/responsive.spec.ts` cobre os breakpoints — sem
  scroll horizontal e sem conteúdo cortado ao ampliar para 200%.

## 4. Revalidar e reportar

Rode os specs de a11y de novo, mais os funcionais das rotas tocadas (uma
correção de semântica pode quebrar um seletor de teste).

Reporte: violações encontradas (id + impact), o que foi corrigido e onde, o que
foi verificado manualmente, e qualquer item que precise de decisão do usuário
(ex.: mudança de paleta por contraste insuficiente).
