# Contrato de Compatibilidade: Next.js 16

Este contrato define o comportamento público e os gates técnicos que devem permanecer válidos após
a migração. Ele não cria uma API nova nem altera os requisitos de [spec.md](../spec.md).

## Rotas públicas

| Rota                           | Contrato preservado                                                          |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `/`                            | Home estática com posicionamento, competências e até 6 projetos em destaque  |
| `/projetos`                    | Listagem estática somente dos projetos implementados                         |
| `/roadmap`                     | Listagem estática de escopo planejado, sem links para fichas de projeto      |
| `/projetos/<slug>`             | Página estática para cada slug implementado, com metadados derivados do projeto |
| `/projetos/<slug-inexistente>` | Resposta 404 amigável com retorno à listagem                                 |
| `/sobre`                       | Página estática Sobre com metadados próprios                                 |
| `/curriculo`                   | Currículo visualizável e download do PDF                                     |
| Qualquer rota inexistente      | 404 global sem erro técnico bruto                                            |

O cabeçalho segue Início, Projetos, Roadmap, Sobre e Currículo. Rodapé, links externos, ordem de
tabulação, breakpoints de 320/768/1280px e requisitos WCAG 2.1 AA permanecem válidos.

## Contrato de build e runtime

- Runtime padronizado: Node.js 24 LTS; nunca abaixo de 20.9.0. A mesma versão principal DEVE valer
  para ambiente local (`.nvmrc`), `engines` do manifesto, CI, Vercel e documentação.
- Modelo de entrega: Next.js hospedado na Vercel com páginas pré-renderizadas em build time.
  `output: "export"` NÃO é usado nesta fase.
- Build de aceite: `next build` com Turbopack, sem configuração Webpack customizada.
- Todas as páginas acima permanecem estáticas ou pré-renderizadas; a migração não introduz API,
  middleware, Server Actions, busca remota ou estado de loading.
- `params` da rota dinâmica é aguardado tanto na página quanto em `generateMetadata`.
- Navegação cliente não produz erro de hidratação e mantém foco, scroll e 404 observavelmente
  equivalentes ao baseline.

## Contrato de dependências

- `next` e `eslint-config-next`: 16.3.1 na entrega planejada.
- `react` e `react-dom`: mesma versão na linha 19.2.x, com tipos React 19 correspondentes.
- `postcss`: 8.5.23 ou superior; `nanoid`: 3.3.18 ou superior.
- O lockfile é regenerado e versionado; instalação de validação usa `npm ci`.
- `npm audit --omit=dev --audit-level=high` termina com sucesso, sem vulnerabilidade crítica ou alta.
- Não é permitido encerrar a tarefa usando `npm audit fix --force` ou suprimindo advisory.
- `vitest`: 4.x após a estabilização do framework; Testing Library, Playwright 1.62 e
  `@axe-core/playwright` permanecem nas versões atuais.
- Dependabot habilitado, com atualizações major revisadas em PR separado.

## Contrato de integração contínua

O pipeline em `.github/workflows/ci.yml` é disparado por push e pull request e DEVE reprovar o PR
quando qualquer etapa falhar. Ordem obrigatória:

```text
npm ci
  -> lint | typecheck | unit   (podem correr em paralelo)
  -> build
  -> E2E
  -> acessibilidade
```

- A instalação usa `npm ci` a partir do `package-lock.json` versionado — nunca `npm install`.
- O runner fixa Node.js 24 LTS, a mesma versão do ambiente local e da Vercel.
- Nenhum gate pode ser marcado como `continue-on-error` para "destravar" um PR.

## Contrato de validação de conteúdo

O build DEVE falhar, com mensagem identificando o arquivo e o campo, quando qualquer regra da matriz
de validação em [data-model.md](../data-model.md) for violada. Em particular: campo obrigatório
ausente, tipo inesperado, slug duplicado ou malformado, `status`/`natureza`/`categoria` fora do
conjunto permitido, URL inválida, imagem referenciada inexistente, competência sem projeto
implementado que a sustente ou mais de 6 projetos reais marcados como destaque. Itens `real: false`
nunca contam como evidência.

## Contrato de conteúdo publicado

Antes da publicação, o conteúdo DEVE satisfazer, de forma verificável:

- nenhum valor placeholder remanescente em `content/profile.json` ou nos projetos;
- nenhum projeto incompleto apresentado como concluído;
- nenhum repositório privado apresentado como acessível;
- nenhuma tecnologia não utilizada apresentada como competência comprovada;
- nenhum dado fictício apresentado como real;
- `public/curriculo.pdf` presente, atualizado e consistente com o conteúdo do site.

## Gates de aceite

Todos os itens abaixo são cumulativos:

1. Prettier, ESLint CLI e TypeScript passam sem erro.
2. Testes unitários/componentes passam uma única vez em modo não interativo.
3. Playwright e axe-core passam para todas as rotas cobertas pela feature.
4. O build Turbopack conclui e lista todas as rotas esperadas.
5. O smoke test em preview/canário confirma home, projetos, roadmap, detalhe, 404, Sobre,
   currículo/PDF, metadados, links globais, teclado e larguras responsivas.
6. A auditoria de produção não reporta severidade crítica ou alta.
7. O pipeline de CI conclui com sucesso no commit promovido — nenhum gate ignorado ou desativado.
8. As verificações manuais de acessibilidade que o axe não cobre (fluxo somente por teclado, foco
   visível, sequência de foco, semântica de headings, links compreensíveis, textos alternativos,
   zoom, leitor de tela, skip link) foram executadas e registradas.
9. O contrato de conteúdo publicado acima está satisfeito.

## Rollback

O deploy deve promover o mesmo artefato aprovado em preview. Se qualquer gate observável falhar no
canário ou após a promoção, retirar o tráfego da nova versão e redeployar o artefato anterior. A
reversão de código deve ser atômica para `package.json`, `package-lock.json`, configuração ESLint,
rota dinâmica e ajustes de tipos; não se deve manter uma combinação parcial de Next.js 14 e React
19/ESLint 10.
