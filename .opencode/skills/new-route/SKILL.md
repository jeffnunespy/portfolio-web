---
name: new-route
provider: local
model: "claude-3-5-sonnet"
description: Gera uma nova rota App Router Next.js com tudo que o projeto exige: layout, metadata, componentes, e2e tests, a11y tests, seguimento de sitemap. Use para cada página nova (app/**/page.tsx).
compatibility: opencode
metadata:
  audience: developers
  workflow: route-creation
---

# new-route

Este é um modelo de starter que garante que cada rota atenda ao Princípio VII (Acessibilidade) + Princípio X (Veracidade), Princípio II (Entregas verticais) e Princípio VIII (Documentação como entrega). O roteiro completo de 10 etapas inclui criação de diretório, construção de componentes, escrita de testes e geração de documentação.

## 1. Planejar a rota (antes de escrever qualquer código)

- Path: `app/<slug>/page.tsx` (slug kebab-case, sem acentos)
- Parent: `<layout>` que exibe `<Header>` e `<Footer>` (já em `app/layout.tsx`)
- Componente da página: componentNamePage
- Home: rota estática, caso não-estático: `generateMetadata` + not-found.tsx

## 2. Escrever o componente da página

```tsx
// app/nome-pagina/page.tsx
import type { Metadata } from "next";
import { getPerfil } from "../../lib/content";
import ComponenteNovo from "../../components/NovoComponente";

export const metadata: Metadata = {
  title: "Título específico da página",
  description: "Descrição da página (110-160 chars)",
  openGraph: {
    title: "Título OG",
    description: "Descrição OG",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/images/og.png", alt: "Descrição" }],
  },
  alternates: { canonical: "/nome-pagina" },
};

export default function NomePaginaPage() {
  const perfil = getPerfil();
  return (
    <div className="nome-pagina">
      <h1>Título específico da página</h1>
      <p>Descrição da página.</p>
      <ComponenteNovo perfil={perfil} />
    </div>
  );
}
```

## 3. Componentes necessários

Reutilize componentes já criados em `components/` (status badge, links de
evidência, visualização de imagem, breadcrumbs) sempre que possível. Imediatamente:

```bash
# Componente de status (para badge de status)
# Componente de links de evidência (para projetos)
# Componente de visualização de imagem (para evidências)
# Componente de título/ícone (para breadcrumbs)
```

Se o componente não existir:

1. Extrair de `app/projetos/[slug]/page.tsx` ou `app/page.tsx`
2. Adaptar para as necessidades da nova página
3. Adicionar `.a11y.spec.ts` baseado no padrão de `home.a11y.spec.ts`

## 4. Escrever o padrão de e2e (Playwright)

```bash
# Para a página nova:
npx playwright test tests/e2e/<nomenpaginahome>.spec.ts
# Para acessibilidade da página nova:
npx playwright test tests/e2e/<nomenpaginahome>.a11y.spec.ts
# Para metadata da página nova:
npx playwright test tests/e2e/metadata.spec.ts
```

**Padrão de spec:**

```ts
// tests/e2e/<nomenpaginahome>.spec.ts
import { test, expect } from "@playwright/test";

test("carrega o título específico", async ({ page }) => {
  await page.goto("/nome-pagina");
  await expect(page).toHaveTitle("Título específico da página | Portfólio");
  await expect(page.locator("h1")).toContainText("Título específico da página");
});

// tests/e2e/<nomenpaginahome>.a11y.spec.ts
import { test } from "@playwright/test";

test.use({ a11ySuiteOnly: true });
test("axe A/AA passa", async ({ page }) => {
  await page.goto("/nome-pagina");
  await expect(page).toHaveNoAccessibilityIssues();
});

// tests/e2e/metadata.spec.ts (adicionar entrada):
// No array 'pages', adicionar:
// {
//   route: "/nome-pagina",
//   title: /Título específico da página/,
//   description: /Descrição da página/,
// },
```

## 5. Escrever o not-found (caso dinâmico)

Se a rota usa `generateMetadata` ou é dinâmica (`[slug]`), crie um `not-found.tsx`:

```tsx
// app/nome-pagina/not-found.tsx
export default function PaginaNaoEncontrada() {
  return (
    <div className="not-found">
      <h1>Página não encontrada</h1>
      <p>A página solicitada não está disponível.</p>
      <Link href="/">Voltar ao início</Link>
    </div>
  );
}
```

## 6. Rodar os testes relevantes antes de commit

```bash
npx playwright test tests/e2e/<nomenpaginahome>.spec.ts tests/e2e/<nomenpaginahome>.a11y.spec.ts tests/e2e/metadata.spec.ts
```

## 7. Adicionar ao sitemap (se não for estático)

Em `lib/content.ts` (se for dinâmico), adicionar `generateStaticParams` para slugs existentes, atualizar `sitemap.ts` (se existir), adicionar rota no `sitemap.xml` (se gerar manualmente)

## 8. Adicionar documentação

```markdown
# docs/nome-pagina.md

## Descrição
Renderiza a página de <Nome da página>, exibindo <resumo do que é>.

## Componentes
- ComponenteNovo: descrição

## Fluxo do usuário
1. Usuário acessa /nome-pagina
2. Layout carrega (Header/Footer)
3. Componente da página renderiza título + conteúdo
4. Se houver formulário/interação, fluxo de ações...

## Implementação técnica
- Usado: componente X, hooks Y, estilos Z
- Decisões de arquitetura: por quê esse componente?
- Testes cobertos: home.spec, home.a11y.spec, metadata

## Próximos passos
- [ ] Adicionar sessão de análise de acessibilidade após o MVP
- [ ] Adicionar estado de carregamento/skeleton UI
```

## 9. Adicionar ao README (opcional)

Se a página faz parte do core:

```
## Páginas

- **Início**: Página principal / `/
- **Projetos**: Listagem de casos de estudo / `/projetos`
- **Sobre**: Trajetória e experiências / `/sobre`
- **Currículo**: Competências e carreira / `/curriculo`
- **Página Nova**: ...
```

## 10. Atualizar tasks.md

Se estiver seguindo tasks.md:

```markdown
- [x] Roteiro para página nova: criar diretório app/<slug> + page.tsx + component
- [x] Escrever o componente da página, layout, metadata
- [x] Escrever os testes e2e e a11y relevantes
- [x] Adicionar ao sitemap.xml
- [x] Documentação no docs/<nomenpaginahome>.md
- [ ] Testes alfa: open/close do modal bem-sucedido
```

## 11. Checklist final

- [ ] Componentes reutilizáveis compartilhados com outros
- [ ] Componente de status acessível com suporte a reader de tela
- [ ] Links semânticos que fazem sentido fora de contexto
- [ ] Alt e texto de link para componentes de imagem
- [ ] Altura de toque adequada e unidades relativas para texto
- [ ] Estados vazio, erro, not-found anunciados e navegáveis
- [ ] MD em pt-BR com acentuação correta, linguagem clara

Quando tudo estiver íntegro, gerar o veredito e confirmar pronto para merge.

Se algum step não puder ser completado, registrar tarefa no tasks.md e continuar com o restante.
