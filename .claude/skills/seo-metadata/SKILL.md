---
name: seo-metadata
description: Define e valida os metadados (title, description, Open Graph, canonical) de uma rota do App Router. Use ao criar uma página nova, quando tests/e2e/metadata.spec.ts falhar, ou quando o usuário pedir para melhorar SEO, compartilhamento em redes sociais ou preview de link.
---

# seo-metadata

Toda rota pública precisa de metadados próprios — o `metadata.spec.ts` verifica
isso. Uma página que herda só o título padrão do layout é considerada incompleta.

## 1. Como o projeto organiza metadados

- `app/layout.tsx` define o `title.template` (`"%s | Portfólio"`) e o `default`.
  Cada página fornece **apenas** o `title` curto; o template acrescenta o sufixo.
  Nunca repita "| Portfólio" no título da página.
- Rotas estáticas exportam `export const metadata: Metadata = {...}`.
- `app/projetos/[slug]/page.tsx` usa `export function generateMetadata()`, que
  deriva do JSON do projeto (`titulo` → title, `resumo` → description) e trata o
  caso de slug inexistente.

Siga esses dois padrões conforme a rota seja estática ou dinâmica. Não introduza
uma terceira forma.

## 2. Regras de conteúdo

- **title**: 30–60 caracteres já contando o sufixo do template. Específico da
  página, em português com acentuação correta.
- **description**: 110–160 caracteres, uma frase completa que descreve o que a
  pessoa encontra ali. Sem repetir o título literalmente e sem enumerar
  palavras-chave.
- **Nada de invenção** (Princípio X): a description de um projeto vem do
  `resumo` real do JSON; não crie afirmações de resultado ou métrica.

## 3. Open Graph e canonical

Ao adicionar OG a uma rota, defina no mesmo objeto `Metadata`:

```ts
openGraph: {
  title: <mesmo title da página>,
  description: <mesma description>,
  type: "website",       // "article" em páginas de projeto
  locale: "pt_BR",
  images: [{ url: projeto.imagemApresentacao, alt: projeto.titulo }],
},
alternates: { canonical: "/projetos/<slug>" },
```

Antes de usar `metadataBase` ou URLs absolutas, confirme com o usuário qual é o
domínio de produção — não invente um. Sem `metadataBase`, imagens OG relativas
não resolvem em crawlers; se o domínio ainda não existe, registre isso como
pendência em vez de chutar.

Imagens OG devem apontar para arquivos que existem em `public/`.

## 4. Validar

Ao criar uma rota nova, adicione a entrada correspondente ao array `pages` de
`tests/e2e/metadata.spec.ts` (rota + regex de title + regex de description).
Depois:

```bash
npx playwright test tests/e2e/metadata.spec.ts
```

Se adicionou OG, verifique também a renderização real das tags:

```bash
npx playwright test tests/e2e/metadata.spec.ts --headed
```

ou inspecione via `page.locator('meta[property="og:title"]')` num teste novo.

## 5. Reportar

Liste as rotas alteradas, os metadados definidos, o que foi acrescentado ao
`metadata.spec.ts` e o resultado do teste. Sinalize se `metadataBase`/domínio
de produção continua pendente.
