# Auditoria 02 — Etapa 4: Next.js e superfície HTTP

Data: 2026-10-28. Trabalho em clone isolado, sem commit, push, PR ou deploy.

## Referência e escopo autorizado

- Original: `/home/jeff/projetos/portfolio`, branch
  `docs/visual-oficial-minimalismo-escuro`, HEAD
  `8b3377a295e7325ff18709c1f52c4eb7eaef104c`, sem alterações rastreadas e com
  24 arquivos não rastreados. Hashes registrados fora do repositório para conferência final.
- Etapa 3: [PR #31](https://github.com/jeffnunespy/portfolio-web/pull/31) incorporado à
  `master` em `e82ff186a05d963ae26476a5c4e4ccc4db6b3ba2`, tree
  `1f80a7f7d92bcabc37bdbf8aa9495f53c0a79c08`; segundo pai
  `bc16b814e5a357adab7c59fbe4fc84e3343ea23b`.
- CI do [PR](https://github.com/jeffnunespy/portfolio-web/actions/runs/40730891993) e
  [merge](https://github.com/jeffnunespy/portfolio-web/actions/runs/40731521771): sucesso.
- Clone: `/tmp/portfolio-auditoria-02-next-http-hardening`, branch
  `security/auditoria-02-next-http-hardening`, criado dessa referência remota.
- Constituição, spec, plan e tasks da experiência pública consultados. Esta auditoria
  implementa a solicitação da Etapa 4, sem encerrar T055 nem alterar requisitos profissionais,
  visuais ou de navegação. Versões históricas no plano não substituem o lockfile atual.
- Node 24.19.0, npm 11.17.0, Next.js 16.4.2, React 19.2.8. Sem novas dependências.

## Decisões anteriores à implementação

1. Aplicar headers estáticos por `headers()` em `next.config.js`; nenhum Proxy/Middleware
   para isso. Desabilitar `X-Powered-By` e o otimizador de imagens, após confirmar que só há
   `<img>` local e SVG. Não alterar caches nem tipos MIME.
2. Aplicar CSP estática em produção. O HTML observado contém bootstrap/Flight inline do
   Next.js; `unsafe-inline` para scripts tem risco residual e não representa CSP estrita.
   Bloquear handlers inline separadamente. Permitir `data:` apenas para imagens, pois o CSS
   contém máscaras SVG. Fontes e recursos do navegador são da própria origem.
3. Não usar nonces por requisição: exigiriam renderização dinâmica. Não habilitar SRI
   experimental nem trocar Turbopack. Hashes de arquivos externos não autorizam os scripts
   Flight inline; manter hashes por página/build/erro exigiria integração adicional de build.
   Report-Only não será o controle final, pois não bloqueia recursos; usar navegador e testes
   negativos controlados para validar a política aplicada.
4. Avaliar `dynamicParams = false` nas fichas e OG. Todos os slugs válidos são conhecidos no
   build. Preservar o contrato aprovado de 404 específico de projeto e seus metadados; a
   configuração só será mantida onde a regressão confirmar esse comportamento.
5. Validar a URL como origem HTTP(S), sem credenciais, caminho, query ou fragmento; HTTPS
   obrigatório fora de loopback. Em produção exigir origem explícita, evitando localhost
   silencioso e host de preview como domínio de produção. `VERCEL_URL` apenas em preview
   declarado, validado como hostname Vercel. Desenvolvimento/teste local pode usar loopback.
6. Não habilitar HSTS, `includeSubDomains`, `preload` ou `upgrade-insecure-requests` sem
   domínio/HTTPS/hospedagem confirmados. COOP/CORP/COEP não são requisitos de isolamento desta
   aplicação pública sem dados sensíveis; não impor restrições sem necessidade comprovada.
7. Evidências temporárias em `/tmp/portfolio-audit02-step4-evidence/`; nenhuma variável
   secreta ou manifesto interno completo será incluído no relatório.

## Inventário da superfície HTTP

| Superfície                                                         | Localização                                                           | Finalidade                                                     | Necessária?                | Risco                                                                  |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------- |
| Páginas estáticas                                                  | `app/{page,projetos/page,roadmap/page,sobre/page,curriculo/page}.tsx` | Apresentação pública                                           | Sim                        | Conteúdo intencionalmente público                                      |
| Fichas SSG                                                         | `app/projetos/[slug]/page.tsx`                                        | Dois estudos de caso conhecidos no build                       | Sim                        | Fallback permite executar o tratamento de slugs desconhecidos          |
| 404 de projeto                                                     | `app/projetos/[slug]/not-found.tsx`                                   | Mensagem, metadados e retorno específicos                      | Sim, contrato aprovado     | `dynamicParams=false` suprime esse comportamento nesta versão          |
| Imagens OG de projeto                                              | `app/projetos/[slug]/opengraph-image.tsx`                             | Dois PNGs gerados em build                                     | Sim; geração adicional não | Fallback de imagem desconhecida desnecessário; fechado                 |
| OG geral e ícone                                                   | `app/**/opengraph-image.tsx`, `app/icon.tsx`, `lib/og-image.tsx`      | PNGs locais                                                    | Sim                        | Sem URL/imagem remota ou entrada arbitrária para `ImageResponse`       |
| Metadados                                                          | `app/layout.tsx`, `lib/site.ts`, `app/sitemap.ts`, `app/robots.ts`    | Origem e índices públicos                                      | Sim                        | Origem de ambiente precisava de validação                              |
| JavaScript/React Flight                                            | `/_next/static/**`, respostas RSC do App Router                       | Hidratação, navegação e prefetch                               | Sim                        | Scripts Flight inline exigem exceção na CSP estática                   |
| CSS                                                                | `app/globals.css`, `/_next/static/**.css`                             | Estilos locais e máscaras SVG `data:`                          | Sim                        | Não requer CSS de terceiros em runtime                                 |
| Fontes                                                             | `next/font/google` em `app/layout.tsx`                                | Geologica baixada no build e servida em `/_next/static/media/` | Sim                        | Google acessado no build, não pelo navegador                           |
| Imagens da interface                                               | `components/project/ProjectImage.tsx`, `public/images/projects/*.svg` | `<img>` local e fallback de erro                               | Sim                        | Seis SVGs públicos, sem conteúdo ativo identificado                    |
| Otimizador                                                         | `/_next/image`                                                        | Processar imagens por requisição                               | Não                        | Endpoint processava `/icon`, apesar de não existir uso de `next/image` |
| PDF                                                                | `public/curriculo.pdf`, `app/curriculo/page.tsx`                      | Visualização/download                                          | Sim                        | Dados profissionais públicos; sem conteúdo ativo identificado          |
| Links externos/contato                                             | Conteúdo JSON, `EvidenceLink`, rodapé                                 | GitHub, LinkedIn, demonstração, `mailto:`                      | Sim                        | Navegação externa; não são origens de recursos da página               |
| API própria/Route Handlers de negócio                              | Nenhum `route.ts` de aplicação                                        | Nenhuma                                                        | Não aplicável              | Ausentes; metadados são endpoints gerados pelo Next.js                 |
| Server Actions                                                     | Nenhuma diretiva `use server`; manifestos com zero ações Node/Edge    | Nenhuma                                                        | Não aplicável              | Não confundir recursos disponíveis do framework com funções usadas     |
| Autenticação, banco e formulários de servidor                      | Nenhuma implementação/dependência correspondente                      | Nenhuma                                                        | Não aplicável              | Nenhum processamento de dados de visitantes                            |
| Cookies e headers de requisição                                    | Nenhum uso em `app/`, `components/`, `lib/`                           | Nenhuma                                                        | Não aplicável              | Nenhum `Set-Cookie` observado                                          |
| Middleware/Proxy, redirects e rewrites próprios                    | Ausentes no código/configuração                                       | Nenhuma                                                        | Não                        | Somente normalização e roteamento nativos do framework                 |
| Analytics, scripts terceiros, iframes e APIs externas no navegador | Ausentes no código e na navegação observada                           | Nenhuma                                                        | Não                        | Nenhum domínio externo precisa entrar na CSP                           |
| Arquivos internos/source maps                                      | Fora de `public/`                                                     | Build e ferramentas                                            | Não devem ser servidos     | Caminhos internos consultados retornam 404; sem maps públicos          |

Não existe requisito/integração de incorporação do portfólio por iframe na especificação ou
no código inspecionado. Por isso `DENY` e `frame-ancestors 'none'` são coerentes.

## Headers: referência e política aplicada

Valores abaixo referem-se ao `next start` local. A infraestrutura remota não foi comprovada.

| Header                              | Valor atual na referência                                           | Risco                                                   | Valor recomendado/aplicado                                     | Justificativa                                                               |
| ----------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Content-Security-Policy             | Ausente em HTML, assets e `public/`; otimizador tinha CSP própria   | Sem restrição explícita de origens/objetos/frames       | Política estática descrita abaixo                              | Defesa adicional compatível com SSG, com exceção inline documentada         |
| Content-Security-Policy-Report-Only | Ausente                                                             | Ausência não é falha por si só                          | Não adicionado                                                 | A política final é aplicada; não há coletor de relatórios                   |
| X-Frame-Options                     | Ausente                                                             | Incorporação indevida/clickjacking                      | `DENY`                                                         | Sem necessidade de iframe, alinhado com CSP                                 |
| X-Content-Type-Options              | Ausente                                                             | MIME sniffing desnecessário                             | `nosniff`                                                      | PDF, SVG, JS, CSS e fontes têm MIME correto                                 |
| Referrer-Policy                     | Ausente                                                             | Depender do padrão do navegador                         | `strict-origin-when-cross-origin`                              | Restringe caminho/query enviados a outras origens; mantém links externos    |
| Permissions-Policy                  | Ausente                                                             | Funcionalidades disponíveis sem necessidade             | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | APIs não usadas; nenhuma interação legítima depende delas                   |
| Strict-Transport-Security           | Ausente no HTTP local                                               | HTTPS remoto desconhecido                               | Pendente na hospedagem                                         | Não habilitar subdomínios/preload sem inventário e domínio confirmado       |
| Cache-Control                       | HTML SSG `s-maxage=31536000`; detalhes na tabela seguinte           | Nenhum dado privado; caches são parte da arquitetura    | Preservado                                                     | Não impor `no-store` global nem prejudicar assets imutáveis                 |
| Content-Type                        | MIME adequado nos recursos válidos                                  | Tipos incorretos seriam risco com conteúdo ativo        | Preservado                                                     | Não substituir tipos definidos pelo Next.js                                 |
| Content-Disposition                 | Ausente no PDF/SVG; `attachment; filename="icon.png"` no otimizador | Sem necessidade de forçar download de todos os recursos | Preservado no PDF/SVG; otimizador passa a 404                  | Link de currículo já oferece download nativo                                |
| X-Powered-By                        | `Next.js` nas respostas HTML                                        | Fingerprint de baixo risco                              | Ausente por `poweredByHeader: false`                           | Redução de identificação desnecessária, sem fingir ocultar todo o framework |
| Server                              | Ausente localmente                                                  | Depende do provedor                                     | Nenhum header artificial                                       | Não controlar identificação da infraestrutura pela aplicação                |
| Cross-Origin-Opener-Policy          | Ausente                                                             | Sem fluxo sensível que exija isolamento                 | Sem alteração                                                  | Links externos já usam proteção de abertura; sem requisito de isolamento    |
| Cross-Origin-Resource-Policy        | Ausente                                                             | Recursos profissionais já são públicos                  | Sem alteração                                                  | Não impedir consumo legítimo de imagens OG/arquivos públicos                |
| Cross-Origin-Embedder-Policy        | Ausente                                                             | Ausência não implica vulnerabilidade                    | Sem alteração                                                  | Não há `SharedArrayBuffer` ou necessidade de contexto isolado               |

Os cinco headers configurados são enviados uma única vez nas respostas normais HTML, 404,
assets e arquivos públicos, em GET/HEAD. Não houve mudança global em MIME/cache. Uma falha
de parsing anterior à aplicação, detalhada nas limitações, não passa por essa garantia.

### Diferenças entre recursos

| Resposta                                                        | Status/MIME observado                       | Cache-Control antes/depois                                          | Observação                                            |
| --------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| Home, listagem, Sobre, Roadmap, currículo e duas fichas válidas | 200, `text/html; charset=utf-8`             | `s-maxage=31536000`                                                 | Pré-renderização preservada                           |
| 404 genérico                                                    | 404, HTML                                   | `private, no-cache, no-store, max-age=0, must-revalidate`           | Headers aplicados                                     |
| 404 específico de projeto                                       | 404, HTML                                   | `s-maxage=31536000`                                                 | Tratamento próprio preservado; não é resposta privada |
| JavaScript/CSS/fontes com hash                                  | 200, JavaScript / `text/css` / `font/woff2` | `public, max-age=31536000, immutable`                               | Headers não removem cache imutável                    |
| PDF                                                             | 200, `application/pdf`                      | `public, max-age=0`                                                 | GET/HEAD e range 206 funcionam; bytes preservados     |
| SVGs                                                            | 200, `image/svg+xml`                        | `public, max-age=0`                                                 | Mesmo conteúdo público, sem forçar download           |
| OG e ícone                                                      | 200, `image/png`                            | `public, max-age=0, must-revalidate`                                | Não dependem do otimizador                            |
| `robots.txt` / `sitemap.xml`                                    | 200, `text/plain` / `application/xml`       | `public, max-age=0, must-revalidate`                                | Sem alteração de regras de indexação                  |
| Otimizador com `/icon` válido                                   | Antes 200 PNG; depois 404 HTML              | Antes `public, max-age=14400, must-revalidate`; depois cache de 404 | Processamento deixou de ocorrer localmente            |
| OG com slug desconhecido                                        | 404 antes/depois                            | Pode variar entre fallback e 404 do roteador                        | Agora `fallback:false`, sem gerar imagem adicional    |

## CSP: decisão, alcance e risco residual

| Estratégia                | Segurança                                                        | Compatibilidade/SSG/desempenho                                                           | Manutenção                                                                        | Decisão                         |
| ------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------- |
| A — estática              | Restringe origens, objetos, frames, base, formulários e handlers | Mantém SSG, navegação, cache e Turbopack                                                 | Configuração nativa pequena                                                       | Aplicada                        |
| B — hashes                | Pode restringir scripts inline específicos                       | Exigiria hashes dos scripts Flight/bootstrap reais, inclusive erros e variações de build | Geração/distribuição por build e rota; SRI de arquivo externo não autoriza inline | Não adicionada nesta etapa      |
| C — nonces por requisição | Permite CSP estrita com scripts autorizados                      | Requer renderização dinâmica; conflita com o objetivo desta aplicação                    | Proxy, propagação de nonce e novos custos operacionais                            | Rejeitada para esta arquitetura |
| D — Report-Only           | Observa violações, sem bloqueá-las                               | Compatível, mas não satisfaz proteção aplicada sozinho                                   | Exigiria monitoramento/coletor para operação remota                               | Não usada como política final   |

```text
default-src 'self'; script-src 'self' 'unsafe-inline'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; frame-src 'none'
```

- `unsafe-inline` de **scripts** autoriza o bootstrap e os dados Flight inline observados em
  todas as páginas; logo a política **não impede todo XSS inline** e não deve ser apresentada
  como CSP estrita. Entradas continuam limitadas ao conteúdo versionado validado e escapado
  pelo React; não há `dangerouslySetInnerHTML` ou HTML recebido de visitantes.
- `script-src-attr 'none'` bloqueia handlers HTML inline independentemente da exceção para
  blocos `<script>`. Não bloqueia os eventos React usados na interface.
- `unsafe-inline` de **estilos** é necessário também pelos atributos inline de infraestrutura
  observados no HTML do Next.js. Nenhum domínio externo de estilos é liberado.
- `img-src data:` atende às máscaras SVG do CSS. Não há necessidade de `blob:`, `*`, origens
  externas, `unsafe-eval` ou `wasm-unsafe-eval` na política de produção.
- `connect-src 'self'` mantém requisições RSC e prefetch. Downloads e links `mailto:` não são
  submissões de formulário; `form-action 'none'` não os impede.
- `upgrade-insecure-requests` não foi imposto a um servidor local HTTP nem usado como prova
  de HTTPS. Deve ser reavaliado com a hospedagem e o domínio reais.
- Em `next dev`, os outros quatro headers continuam configurados e a CSP é omitida para
  HMR/debug. Configuração conferida nos modos `development` e `production`; essa leitura
  de configuração não foi apresentada como teste de um servidor de desenvolvimento.
- Em previews com build de produção, a CSP é a mesma. Injeções do provedor, como eventual
  toolbar de preview, precisam ser verificadas no ambiente real; não foram liberados domínios
  especulativos.

Playwright navegou por nove destinos, incluindo os dois 404, sem violações inesperadas, erros
de hidratação/execução, falhas de recursos ou requisições externas. Os erros de console por
documentos 404 solicitados intencionalmente são esperados e foram distinguidos de assets
quebrados. Nos testes negativos, houve os bloqueios esperados de `script-src-elem`,
`script-src-attr`, `connect-src`, `object-src`, `base-uri` e `frame-ancestors`.

O teste de incorporação usa um segundo servidor temporário de loopback, sem tocar terceiros.
A primeira instrumentação com documento interceptado encontrou a permissão de rede local
do Chromium antes da CSP; foi corrigida para observar efetivamente `frame-ancestors`.

## Rotas dinâmicas e processamento de imagens

Os dois slugs válidos são `nana-silva` e `plataforma-portfolio`, derivados de conteúdo local
validado. A resolução usa igualdade exata sobre essa lista; o slug da requisição não vira
caminho de leitura de arquivo ou URL remota. Projetos planejados não viram fichas.

`dynamicParams = false` foi aplicado **somente** às imagens OG de projeto. O manifesto final
registra `fallback:false` para `/projetos/[slug]/opengraph-image`; ambas as imagens válidas
continuam pré-renderizadas. Não são gerados PNGs para slugs adicionais.

Nas fichas HTML, testar essa configuração fez o Next.js 16.4.2 devolver o 404 global e seus
metadados. Isso contraria FR-025, a clarificação de projeto inexistente da especificação e os testes existentes que exigem "Projeto não encontrado",
o retorno à listagem e o registro de acervo/planejamento. A tentativa foi removida antes da
regressão final: mantém-se `generateStaticParams` e o fallback necessário para executar o
`notFound()` específico. **Não se declara eliminação de toda renderização sob demanda.**
Não foram adicionados catch-alls, Proxy ou páginas artificiais para contornar esse contrato.

Testados slugs inexistentes/planejados, maiúsculas, caracteres especiais, Unicode codificado,
NUL codificado, separador codificado e segmento adicional: 404. O slug válido com `p`
codificado (`%70lataforma-portfolio`) mantém 200. Os dois slugs válidos mantêm 200 e o
tratamento amigável de projeto inexistente passa nos testes originais.

`images.unoptimized = true` é justificado pela ausência de `next/image`, imagens remotas e
patterns customizados. No `next start` desta versão, `/_next/image` passou de processamento
real de `/icon` (200 PNG) para 404, inclusive com URL local válida e parâmetros corretos.
Requisições sem parâmetros, SVG e URL externa também retornam 404. Isso é uma observação do
servidor local desta versão, não garantia universal de toda plataforma de hospedagem.

SVG direto, imagens de projeto, proporção responsiva, PNGs OG e ícone permanecem funcionais.
Não se habilitou `dangerouslyAllowSVG`, remote patterns ou outro loader.

## URL pública e variáveis de ambiente

Existe uma única variável `NEXT_PUBLIC_*` usada pelo código: `NEXT_PUBLIC_SITE_URL`. Ela é
configuração pública, usada em metadados, canonical, OG, robots e sitemap; não é segredo nem
entrada de visitante. `Host`, cookies e headers da requisição não determinam essa origem.

Antes, o código apenas aparava espaços/barra final, aceitava strings arbitrárias, utilizava
`VERCEL_URL` em qualquer ambiente e terminava em localhost silenciosamente.

| Ambiente/entrada                                                                                   | Comportamento final                                                          |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Desenvolvimento/teste sem origem                                                                   | `http://localhost:3000`                                                      |
| Build de produção sem origem                                                                       | Falha explícita; não publica fallback localhost                              |
| Origem HTTPS explícita                                                                             | Valida e normaliza para `URL.origin`                                         |
| HTTP remoto                                                                                        | Rejeitado                                                                    |
| HTTP de loopback explícito                                                                         | Permitido em execução/build local, inclusive `next start`                    |
| `VERCEL_ENV=preview` sem origem explícita                                                          | Usa somente `VERCEL_URL` validada em `*.vercel.app`; sem valor válido, falha |
| `VERCEL_ENV=production` sem origem explícita                                                       | Falha, mesmo havendo `VERCEL_URL`                                            |
| Deployment Vercel de preview/produção com loopback                                                 | Rejeitado                                                                    |
| Credenciais, caminho, query, fragmento, protocolos não HTTP(S), sintaxe ambígua ou vazio explícito | Rejeitados, sem fallback silencioso                                          |

Mensagens de erro não repetem a entrada inválida, que poderia conter credenciais por engano.
Nenhum domínio real de produção foi inventado. `https://portfolio.example` é uma origem
reservada de validação já usada no CI; não é apresentado como endereço publicado.

Os 40 testes novos cobrem essa matriz. Além dos unitários, builds reais sem URL e com
`http://portfolio.example` falharam pelo motivo esperado; o build final com a origem HTTPS
de validação passou. Não se alteraram variáveis remotas. Ajustes de conteúdo/SEO da Auditoria
06 continuam fora do escopo.

## Arquivos públicos e informações internas

- `public/` contém sete arquivos: um PDF e seis SVGs de projetos. Nenhum `.env`, backup,
  relatório, diretório temporário, arquivo de configuração ou dependência está nesse diretório.
- SVGs parseados como XML: sem `script`, event handlers, `foreignObject`, objetos/iframes,
  referências externas ou animações ativas. Imagens legítimas preservadas, inclusive as de
  conteúdo planejado que já eram públicas. Contexto da interface é `<img>`.
- PDF de uma página A4, MIME `application/pdf`, não criptografado, sem formulários,
  JavaScript, ações automáticas, `Launch`, anexos ou RichMedia identificados. Metadados:
  título/autor profissionais, datas e produtor ReportLab; nenhum caminho interno/segredo
  identificado. Três links intencionais: e-mail, GitHub e LinkedIn. Inspeção com `pdfinfo`,
  `pdfinfo -url`, busca estrutural e renderização Poppler. Conteúdo profissional inalterado.
- Arquivos públicos comparados por hash antes/depois. O PDF tem SHA-256
  `055b402c4f785c9da78b6739b71ec122cbc6c55a63d23fc304b3671c00439103`.
- Sem `.map` em `.next/static`, sem `sourceMappingURL` nos JS/CSS públicos. `productionBrowserSourceMaps`
  não foi habilitado. Caminho de map de um chunk real também retorna 404.
- Busca nos bundles enviados ao navegador não encontrou caminhos `/home/jeff`, caminho do
  clone, nomes das variáveis Vercel ou acessos `process.env`. Não se conclui ausência absoluta
  de segredos por simples busca textual; nenhuma fonte de segredo foi adicionada ao build.
- `.env`, `.env.local`, `.git/config`, configurações npm/Next, código de biblioteca/teste,
  `node_modules` e relatório Playwright consultados por HTTP retornam 404.
- Restam identificadores legítimos do Next.js: URLs `/_next`, Flight/RSC, `Vary` e headers
  como `X-Nextjs-Cache`/`X-Nextjs-Prerender`. São metadados técnicos de baixo risco, não segredo.
  Desabilitar `X-Powered-By` não torna o framework irreconhecível.

## Hospedagem, HTTPS e previews

O código/documentação contempla Vercel. O contexto versionado informa preparação de
publicação, com T055 ainda aberta. Consulta GET pública a
`/repos/jeffnunespy/portfolio-web/deployments?per_page=10` retornou `[]`; o status combinado
do commit também não trouxe status de provedor. Isso comprova ausência desses registros
nessas consultas, **não ausência de qualquer hospedagem externa**.

O conector GitHub não oferece o endpoint de deployments. A leitura alternativa por `gh`
falhou por conexão; o GET público por `curl` foi bem-sucedido. Nenhuma configuração de
provedor foi acessada ou modificada.

| Item                                                 | Classificação                             | Evidência/limite                                     |
| ---------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| Modelo local Next.js/SSG                             | Verificado                                | Código, build e `next start`                         |
| Vercel como opção documentada                        | Verificado                                | README e checklist de publicação                     |
| Deployment registrado no GitHub                      | Não configurado nos registros consultados | Lista de deployments vazia; não prova estado externo |
| Provedor efetivo de produção                         | Não verificado                            | Sem deployment/domínio confirmado                    |
| Domínio público e subdomínios                        | Não verificado                            | Nenhum endereço de produção confirmado               |
| HTTPS e redirecionamento HTTP→HTTPS remoto           | Não verificado                            | HTTP local não valida TLS do provedor                |
| Headers/HSTS da infraestrutura                       | Não verificado                            | Sem origem remota confirmada                         |
| `includeSubDomains`/preload                          | Não aplicável à configuração implementada | Não habilitados sem evidências de domínio/HTTPS      |
| Previews ativos e proteção de acesso                 | Não verificado                            | Sem URL de preview do portfólio confirmada           |
| Indexação no código                                  | Verificado                                | `robots` permite indexação; não é controle de acesso |
| Indexação efetiva/proteção de preview                | Não verificado                            | Pode depender de headers/configurações do provedor   |
| Valores públicos remotos                             | Não verificado                            | Nenhuma variável remota lida/alterada                |
| Alterar hospedagem/DNS/variáveis/secrets ou publicar | Depende de autorização                    | Fora desta execução; nenhum deploy                   |

## Validação e regressão

Sem dependências, lockfile, workflow, conteúdo profissional ou arquivos de design alterados.
Servidores temporários controlados, com verificação de porta e encerramento após os testes.
O build final é o mesmo artefato servido pelos E2E funcionais, a11y e comparação HTTP final.
BUILD_ID de referência: `12ppwo-hF4DNdswTILkU2`; BUILD_ID final:
`-l9xJtNlAXOqIiiOWdLJO`. O manifesto preservou exatamente as mesmas 18 entradas estáticas
(incluindo metadados/estados internos); as rotas públicas não foram convertidas em SSR.

| Verificação executada                                              | Resultado                                                                        |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `npm ci --cache /tmp/portfolio-audit02-npm-cache`                  | Sucesso, 439 pacotes; lockfile preservado                                        |
| `npm audit --cache /tmp/portfolio-audit02-npm-cache`               | Zero vulnerabilidades                                                            |
| `npm audit signatures --cache /tmp/portfolio-audit02-npm-cache`    | 439 assinaturas e 124 attestations verificadas                                   |
| `npm run format:check`                                             | Sucesso                                                                          |
| `npm run lint`                                                     | Sucesso                                                                          |
| `npm run typecheck`                                                | Sucesso                                                                          |
| `npm test -- --run`                                                | 93 testes aprovados, 10 arquivos; 53 anteriores + 40 novos                       |
| `NEXT_PUBLIC_SITE_URL=https://portfolio.example npm run build`     | Sucesso; 18 páginas estáticas/SSG, sem página convertida em dinâmica             |
| Builds com URL ausente/HTTP remoto inválido                        | Falha esperada e confirmada, mensagens acionáveis                                |
| `E2E_BUILD_EXISTENTE=1 npm run test:e2e:functional -- --workers=2` | 84 aprovados; 73 anteriores + 11 novos, sem retries                              |
| `E2E_BUILD_EXISTENTE=1 npm run test:e2e:a11y -- --workers=2`       | 27 aprovados, sem retries                                                        |
| GET/HEAD antes/depois                                              | 116 requisições por versão, tabela/evidências locais                             |
| CSP no Chromium                                                    | Sem violações inesperadas; testes negativos confirmam bloqueios                  |
| Navegação, PDF, imagens, fontes, cache, responsividade e a11y      | Aprovados nas suítes e verificações específicas                                  |
| Comparação visual antes/depois                                     | Home 1280px e 390px, ficha de projeto e currículo 1280px idênticos pixel a pixel |

Total final: **204 testes automatizados aprovados**, mantendo os 153 testes históricos.
Os comandos E2E usaram `NEXT_PUBLIC_SITE_URL=https://portfolio.example`,
`E2E_BUILD_EXISTENTE=1` e `PLAYWRIGHT_HTML_OPEN=never`; cada suíte iniciou seu próprio
`next start`, sem reutilizar um servidor desconhecido.

Evidências locais adicionais, fora do Git: `/tmp/portfolio-audit02-step4-evidence/`, com
`before-http.json`, `after-http.json`, `before-browser.json`, `after-browser.json`, capturas,
`build-matrix.json` e logs de build/servidor. Os relatórios funcionais/a11y ficam nos diretórios
ignorados `playwright-report/{funcional,a11y}/` do clone. Os 24 arquivos não rastreados e o
HEAD/branch do diretório original foram reconferidos por hash ao final, sem alteração.

Os avisos de peer dependencies do ESLint 10 já documentados no README persistem no `npm ci`.
Vitest emite aviso sobre um futuro loader nativo do Vite para a configuração atual; Playwright
emite aviso de `NO_COLOR`/`FORCE_COLOR`. Nenhum foi ocultado ou exigiu mudança de dependências.
Uma falha inicial de tipos na nova instrumentação foi corrigida; os testes de navegação e
iframe foram corrigidos pela causa identificada antes da regressão completa, sem afrouxar os
controles ou remover testes.

## Limitações e riscos residuais

1. **CSP com scripts inline permitidos:** não resolve XSS inline em geral. É defesa
   proporcional à aplicação atual e deve ser revista se entrar HTML não confiável, CMS,
   autenticação, scripts de terceiros ou outro mecanismo de injeção.
2. **Fallback de fichas HTML mantido:** necessário nesta versão para preservar o contrato
   de 404 específico. Não se declara aplicação inteiramente sem execução de servidor.
3. **URL com percent-encoding malformado:** `/projetos/%E0%A4%A` retornou **500** em GET/HEAD,
   antes e depois, com corpo genérico de 21 bytes e sem headers configurados pela aplicação.
   O parsing/roteamento falha antes de chegar à página; o framework tem tratamento de
   `DecodeError` e fallback genérico em `server/lib/router-server.js`. Não houve exposição
   de stack/caminhos/segredos na resposta. Continua como limitação de tratamento de erro do
   Next.js 16.4.2; o resultado desejável é 400. Não foi mascarado com redirect, patch em
   `node_modules`, Proxy ou alteração não fundamentada de dependências.
4. **NUL codificado:** `/projetos/%00` retorna 404, mas o Next.js tenta gravar o cache desse
   404 e registra `ERR_INVALID_ARG_VALUE` no servidor por byte nulo. Já ocorre na referência;
   não há leitura arbitrária nem divulgação do caminho no HTTP. Mantido explicitamente como
   limitação de cache/log do framework, sem silenciar o erro.
5. **Hospedagem remota:** HTTPS, HSTS, domínio/subdomínios, headers de infraestrutura,
   variáveis públicas e proteção/indexação dos previews permanecem sem confirmação. Nenhum
   resultado local é apresentado como validação de produção remota. Reavaliar o otimizador,
   CSP e demais headers depois de existir ambiente confirmado e autorizado.
6. **Validação de navegador:** Chromium conforme a suíte do projeto. Não executados novos
   testes em Safari/Firefox nem inspeções humanas de T055; isso não reduz a cobertura anterior.

## Antes e depois

| Critério                 | Antes                                        | Depois                                               | Avaliação                             |
| ------------------------ | -------------------------------------------- | ---------------------------------------------------- | ------------------------------------- |
| CSP                      | Ausente no HTML                              | Política estática aplicada, exceção inline explícita | Risco mitigado; não é CSP estrita     |
| X-Frame-Options          | Ausente                                      | `DENY`                                               | Risco de incorporação mitigado        |
| X-Content-Type-Options   | Ausente                                      | `nosniff`                                            | Configuração fortalecida              |
| Referrer-Policy          | Ausente                                      | `strict-origin-when-cross-origin`                    | Configuração fortalecida              |
| Permissions-Policy       | Ausente                                      | Câmera/microfone/geolocalização/payment/USB negados  | Superfície do navegador reduzida      |
| HSTS                     | Não verificado remotamente                   | Sem alteração automática; pendência documentada      | Limitação não verificada              |
| X-Powered-By             | `Next.js` em HTML                            | Ausente                                              | Identificação desnecessária reduzida  |
| Rotas dinâmicas          | Fichas e OG com fallback                     | OG fechado; fallback HTML preserva 404 aprovado      | Redução parcial, justificada          |
| Gerador de imagens       | Otimizador processava imagem local           | `unoptimized`, endpoint 404 no servidor auditado     | Superfície reduzida                   |
| Validação da URL pública | Strings sem validação e fallbacks implícitos | Origem validada; produção exige configuração         | Configuração fortalecida              |
| Arquivos públicos        | PDF e seis SVGs legítimos                    | Bytes preservados, MIME correto e headers            | Sem remoção necessária                |
| Páginas estáticas        | 18 no build                                  | 18; mesmas rotas/modos                               | Geração estática preservada           |
| Vulnerabilidades npm     | 0 na Etapa 3/instalação desta referência     | 0 na consulta atual                                  | Sem vulnerabilidade nova identificada |
| Testes unitários         | 53 históricos                                | 93 aprovados                                         | Cobertura ampliada                    |
| Testes E2E funcionais    | 73 históricos                                | 84 aprovados                                         | Cobertura ampliada                    |
| Acessibilidade           | 27 históricos                                | 27 aprovados                                         | Cobertura preservada                  |
| Build                    | Sucesso                                      | Sucesso                                              | Sem regressão de renderização         |

Classificação dos resultados:

- **Vulnerabilidade corrigida:** não foi confirmada exploração de uma vulnerabilidade no
  código atual; não confundir ausência de headers ou fingerprint com XSS/RCE demonstrado.
- **Risco mitigado:** incorporação indevida, carregamento de recursos externos não autorizados,
  objetos/base/formulários e handlers HTML inline.
- **Superfície reduzida:** processamento de imagens, fallback das imagens OG, permissões do
  navegador e identificação explícita por `X-Powered-By`.
- **Configuração fortalecida:** validação/previsibilidade da URL e headers HTTP.
- **Questão sem alteração necessária:** arquivos públicos legítimos, MIME/cache, conteúdo,
  COOP/CORP/COEP e arquitetura estática.
- **Limitação não verificada:** controles remotos e provedores/previews.
- **Limitação verificada e remanescente:** percent-encoding malformado com 500, aviso de cache
  para NUL, fallback HTML e permissão de scripts inline.

AUD02-006 mitigado com risco residual de CSP; AUD02-007 tratado; AUD02-008 reduzido com
exceção de rotas HTML justificada; AUD02-014 fortalecido; AUD02-013 permanece pendente de
verificação da hospedagem.

**Veredito:** hardening local implementado e regressão aprovada, **com as ressalvas acima**.
Não equivale a aprovação da hospedagem nem a autorização de publicação.

## Referências técnicas

Guias locais da versão instalada lidos em `node_modules/next/dist/docs/`: CSP, headers,
poweredByHeader, Image/unoptimized e generateStaticParams. Conferência complementar em fontes
primárias: [CSP no Next.js](https://nextjs.org/docs/app/guides/content-security-policy),
[headers no Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers),
[CSP no MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) e
[HSTS no MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security).

## Revisão final de segurança antes do commit — 2026-10-28

**Veredito: APROVADA COM RESSALVAS.** A candidata está pronta para commit do hardening local,
sem bloqueador novo identificado nesta revisão. Isso não autoriza commit, integração remota
ou publicação; nenhuma dessas ações foi executada.

### Preservação e validade das evidências

- Branch `security/auditoria-02-next-http-hardening`, HEAD/base
  `e82ff186a05d963ae26476a5c4e4ccc4db6b3ba2`, sem commit adicional.
- O BUILD_ID continua `-l9xJtNlAXOqIiiOWdLJO`. Configuração compilada e manifesto conferidos:
  18 entradas pré-renderizadas, `poweredByHeader:false`, `images.unoptimized:true` e a mesma
  CSP. Nenhum arquivo de código/configuração foi alterado nesta revisão.
- Relatórios HTML anteriores conferidos: funcional 84/84 e a11y 27/27, sem testes ignorados,
  falhas ou flaky. `.last-run.json` de ambas as suítes indica sucesso. Permanecem válidas as
  evidências anteriores de 93 unitários, build, TypeScript, lint, formato e npm audit.
- Snapshot SHA-256 dos oito arquivos da candidata registrado antes da revisão para conferir
  que somente este documento recebeu alterações. Nenhuma dependência/conteúdo visual mudou.
- Original em `/home/jeff/projetos/portfolio`: branch
  `docs/visual-oficial-minimalismo-escuro`, HEAD `8b3377a295e7325ff18709c1f52c4eb7eaef104c`;
  alterações rastreadas vazias e os 24 arquivos não rastreados preservados por hash.

### CSP examinada diretiva por diretiva

| Diretiva          | Valor efetivo            | Avaliação final                                                                      |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| `default-src`     | `'self'`                 | Fallback restrito à origem; sem wildcard ou origens externas                         |
| `script-src`      | `'self' 'unsafe-inline'` | Runtime local e bootstrap/Flight inline; risco residual de blocos inline arbitrários |
| `script-src-attr` | `'none'`                 | Já implementada; handlers HTML inline bloqueados sem impedir eventos React           |
| `style-src`       | `'self' 'unsafe-inline'` | CSS local e atributos inline de infraestrutura do Next.js                            |
| `img-src`         | `'self' data:`           | Imagens locais e máscaras SVG do CSS; sem `blob:` ou imagem remota                   |
| `font-src`        | `'self'`                 | Fontes servidas pelo site; Google não precisa ser liberado em runtime                |
| `connect-src`     | `'self'`                 | RSC/prefetch local; conexão externa negativa bloqueada                               |
| `object-src`      | `'none'`                 | Objetos incorporados bloqueados; PDF continua por link/download                      |
| `base-uri`        | `'none'`                 | Alteração de base bloqueada                                                          |
| `form-action`     | `'none'`                 | Sem formulários de servidor; não interfere em links `mailto:`                        |
| `frame-ancestors` | `'none'`                 | Bloqueio de incorporação confirmado entre duas origens locais reais                  |
| `frame-src`       | `'none'`                 | Nenhum iframe necessário no portfólio                                                |

`unsafe-eval` está ausente. Um script experimental inserido no HTML pelo parser conseguiu
executar código inline, mas seu `eval()` foi bloqueado com `EvalError` e violação `script-src`.
Isso comprova a distinção entre as duas permissões e também o risco inline residual. A
instrumentação final evita usar a execução privilegiada do depurador para medir `eval`.

Foi testada uma alternativa mais restritiva **apenas na resposta interceptada do navegador**,
sem modificar a candidata: `script-src 'self'`, retirando `unsafe-inline`. Os três scripts
inline da home foram bloqueados (`script-src-elem`), e `__next_f` deixou de inicializar.
Com a política atual, Flight inicializa e não há violações inesperadas. Portanto remover a
exceção sem um mecanismo de autorização adicional provocaria regressão de hidratação.

Hashes continuam tecnicamente possíveis sem converter páginas estáticas em dinâmicas, mas
não são substituição simples nesta aplicação: o hash do payload Flight do 404 mudou entre
`/projetos/slug-inexistente` e `/projetos/slug-revisao-final`. Uma lista fixa dos hashes do build
não cobriria todo esse fallback. SRI de arquivo externo não resolve scripts inline; nonces
por requisição alterariam a arquitetura de renderização, conforme o guia da versão instalada.
A política atual permanece a escolha proporcional para este escopo.

É possível refinar a política de estilos separando atributos de blocos `<style>`; isso não
elimina o risco principal dos scripts inline e não foi identificado como correção necessária.
Não há liberação de domínios, esquemas ou eval sem uso demonstrado. A política não é
apresentada como proteção completa contra XSS.

Referência complementar: [`script-src-attr` no MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src-attr).

### Reproduções controladas de URLs malformadas

Servidor `next start` conhecido em `http://127.0.0.1:43145`, sobre o mesmo build aprovado.
Reprodução mínima: `curl --path-as-is -i 'http://127.0.0.1:43145/projetos/%E0%A4%A'`;
para HEAD, usar `-I` no lugar de `-i`. O servidor temporário foi encerrado ao concluir.

| Entrada              | GET | Corpo GET                         | HEAD             | Evidência anterior                                                                      |
| -------------------- | --- | --------------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| `/projetos/%E0%A4%A` | 500 | `Internal Server Error`, 21 bytes | 500, corpo vazio | Mesmo resultado em `before-http.json`, antes do hardening                               |
| `/projetos/%FF`      | 500 | `Internal Server Error`, 21 bytes | 500, corpo vazio | Novo representante da mesma classe; não foi reproduzido separadamente no build anterior |

Os corpos e headers examinados não expõem stack, diretórios internos, conteúdo de outra
página ou segredo. Esses erros precoces não recebem os headers customizados da aplicação.
As requisições válidas seguintes continuam respondendo 200, com hashes de corpo idênticos
aos anteriores.

Camada responsável: decodificação/roteamento do Next.js, antes da página. O helper instalado
`server/lib/router-utils/decode-path-params.js` lança `DecodeError` para ambas as entradas.
`server/lib/router-server.js` possui tratamento de `DecodeError` e fallback para 500 caso a
resposta de erro não seja concluída. A aplicação não tem parser de URL customizado ou código
de negócio recebendo esses parâmetros antes do roteador.

Severidade **baixa, de robustez/observabilidade**, pelos efeitos demonstrados: status 500
inadequado para entrada inválida, sem divulgação de informação ou falha persistente observada.
400 seria o tratamento desejável. Não se demonstrou exploração de indisponibilidade; não
foram feitos testes de carga. Não há correção localizada proporcional identificada na aplicação.
Não se justifica Proxy, mudança de arquitetura ou patch de dependência apenas para recodificar
essa resposta. Acompanhar correção suportada do framework, sem alterar o lockfile nesta revisão.

### Cache e NUL

| Entrada examinada                          | Resultado HTTP              | Resultado observado                                             |
| ------------------------------------------ | --------------------------- | --------------------------------------------------------------- |
| `/projetos/%00`                            | 404, inclusive na repetição | Erro de persistência do cache; página de projeto não encontrado |
| `/projetos/plataforma-portfolio%00`        | 404, inclusive na repetição | Não entrega a ficha válida pelo prefixo                         |
| `/projetos/%00plataforma-portfolio`        | 404                         | Não entrega ficha pela remoção do NUL                           |
| `/projetos/plataforma-portfolio%00revisao` | 404                         | Não trunca no NUL para selecionar a ficha                       |
| `/projetos/%2500`                          | 404                         | Codificação dupla não seleciona outra rota                      |

No navegador, os três primeiros caminhos exibem **"Projeto não encontrado"**, mantendo o
tratamento aprovado. O byte nulo é preservado na chave interna; não é removido/truncado.
O `getRouteCacheKey` instalado produz seis chaves distintas para os caminhos de controle,
incluindo o slug válido, variações com NUL e `%00` literal. O cache em memória usa a chave
completa. No disco, a API de filesystem do Node recusa caminhos com NUL e o Next registra
`ERR_INVALID_ARG_VALUE` ao tentar persistir o 404.

Verificações de integridade adicionais:

- Home, currículo e as duas fichas válidas foram consultados antes/depois: todos mantêm 200 e
  o mesmo SHA-256 do corpo.
- Artefatos compilados HTML/RSC/metadados/imagens em `.next/server/app` permaneceram idênticos.
- Nenhum corpo malformado/NUL examinado revelou os caminhos internos presentes no log local.
- Não foi observada colisão, substituição de resposta, leitura de outra rota ou envenenamento
  de cache. A comparação local não prova comportamento de um cache de provedor ainda não verificado.

Severidade **baixa, operacional**, limitada ao tratamento/persistência de um 404 e ao aviso de
log observados. O caso é alcançável no portfólio porque o fallback HTML de projeto permanece
habilitado. Não há evidência para classificá-lo como cache poisoning. Sem correção de código
necessária para este commit; limitação conhecida do framework, já registrada na referência.

### Revisão dos testes e verificações desta revisão

| Controle                    | Cobertura examinada                                                       | Parecer                                                                    |
| --------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Headers e identificação     | GET/HEAD, valores, duplicações, ausência de `X-Powered-By`                | Comportamental e pertinente                                                |
| CSP/hidratação              | Navegação e recursos legítimos, eventos de violação, erros/falhas de rede | Complementa a inspeção textual da política                                 |
| Recursos proibidos/handlers | Tentativas reais de script/conexão externos, object, base, onclick        | Bloqueios observados; não deriva a política do config para afirmar sucesso |
| Clickjacking                | Segundo servidor local com iframe e resposta real do Next.js              | Sem dependência de rede externa; verificação de `frame-ancestors`          |
| Rotas e respostas de erro   | Slugs inválidos/planejados/codificados, 404, arquivos internos            | Mantém testes anteriores e adiciona verificações reais                     |
| Imagens/OG                  | Endpoint de otimização, PNG válido, SVG/PDF e tipos/caches                | Confirma resultado HTTP, não apenas configuração                           |
| URL pública                 | 40 casos unitários e builds negativos registrados                         | Ambiente, protocolos e fallbacks cobertos                                  |
| Geração estática            | Manifesto e rotas geradas, somados ao build registrado                    | Uso de detalhe do framework justificado pelo requisito explícito de SSG    |

Não foram encontrados testes inválidos que precisassem de remoção. A igualdade exata da
string CSP cria acoplamento à ordem das diretivas, mas funciona como contrato explícito de
headers e é complementada pelos bloqueios no navegador; não é bloqueador. Os testes com
`networkidle` se restringem à aplicação local sem analytics/polling. Não houve flaky nas
execuções examinadas. O filtro de erro de console de 404 é acompanhado por verificação de
falhas/status de recursos, evitando aprovar assets quebrados por esse filtro.

Executado novamente somente o conjunto necessário para as ressalvas:

```sh
NEXT_PUBLIC_SITE_URL=https://portfolio.example E2E_BUILD_EXISTENTE=1 E2E_GRUPO=revisao-final PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/e2e/security-http.spec.ts --workers=2
```

Resultado: **11/11 aprovados**, sem retries, em relatório separado
`playwright-report/revisao-final/`. As reproduções adicionais registram 19 requisições HTTP
dirigidas, consultas no navegador, comparação de chaves/artefatos e experiências CSP em
`/tmp/portfolio-audit02-step4-evidence/final-review-probes.json` e `final-review-server.log`.
Isso não é um novo total de 215 testes distintos: os 11 testes já fazem parte dos 204 anteriores.

Não se repetiram instalação, audit, assinaturas, build, lint, TypeScript, 93 unitários,
84 funcionais completos ou 27 a11y, porque código/configuração/build permaneceram iguais.
Formatação documental, `git diff --check` e revisão do diff completo complementam o aceite.
A busca direcionada por padrões de chaves privadas, tokens GitHub/AWS/Bearer não encontrou
credenciais nos oito arquivos da candidata; não há arquivo `.env` no diff. Credenciais
`user:password` em domínio reservado são fixtures negativas explícitas dos testes.

A auditoria constitucional prevista no `AGENTS.md` não encontrou violações ou bloqueadores.
Corrigiu-se apenas a referência documental ao contrato do 404: **FR-025**, em lugar de FR-013.
Nenhum teste, requisito, código, dependência ou configuração foi alterado nesta revisão.

### Matriz final de riscos

| Questão              | Risco identificado                                                                               | Correção necessária?                                            | Situação final                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| CSP e scripts inline | Blocos inline arbitrários continuam autorizados; handlers/eval/origens externas estão bloqueados | Não para este escopo; hashes/nonces exigem integração adicional | Política proporcional preservada, sem regressão de hidratação/SSG                    |
| URLs malformadas     | 500 genérico para duas entradas inválidas; ausência de headers customizados nessa camada         | Sem correção proporcional identificada na aplicação             | Limitação baixa de framework; caso histórico confirmado, sem vazamento               |
| Cache e NUL          | Falha de persistência de 404 e log no servidor                                                   | Não; acompanhar framework                                       | 404 correto; sem colisão/conteúdo cruzado demonstrados, severidade operacional baixa |
| Testes de segurança  | Pequeno acoplamento sintático na igualdade da CSP; nenhuma fragilidade bloqueante identificada   | Não                                                             | 11 testes reexecutados e aprovados; cobertura anterior válida                        |
| Hospedagem           | HTTPS, HSTS, domínio, previews e headers efetivos ainda desconhecidos                            | Verificação remota antes de publicar, fora deste commit         | Ressalva remota mantida; nenhuma configuração/deploy alterado                        |

Arquivo alterado **nesta revisão**: somente `docs/audits/auditoria-02-etapa4-next-http.md`.
O conjunto completo da candidata permanece com oito arquivos: este relatório, `README.md`,
`docs/CHECKLIST_PUBLICACAO.md`, `next.config.js`, `lib/site.ts`,
`app/projetos/[slug]/opengraph-image.tsx`, `tests/e2e/security-http.spec.ts` e
`tests/unit/site.test.ts`.

Mensagem de commit sugerida:

```text
security: fortalecer headers HTTP e superfície do Next.js
```

**APROVADA COM RESSALVAS — pronta para commit local após autorização expressa.** Não há
autorização implícita para push, PR, merge, deploy ou alteração da hospedagem.
