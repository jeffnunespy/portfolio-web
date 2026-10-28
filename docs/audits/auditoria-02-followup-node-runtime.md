# Auditoria 02 — Follow-up de segurança do runtime Node.js

**Data:** 2026-10-28. **Achado:** AUD02-E5-001.

## 1. Resumo executivo

O runtime fixado Node.js 24.19.0 estava nas faixas afetadas por oito CVEs oficiais:
quatro altas, três médias e uma baixa no componente. A Etapa 5 classificou a Auditoria 02
como **APROVAÇÃO CONDICIONADA**, exigindo atualização e revalidação do runtime para o
encerramento técnico recomendado. Não foi demonstrada exploração pelo portfólio.

A candidata fixa **Node 24.22.2, com npm 11.19.1**, e admite **Node `^24.22.1`** como
faixa mínima de segurança. A linha principal continua 24. Instalação limpa, auditorias,
assinaturas, tipos, lint, os 204 testes e o build foram aprovados localmente. Formatação
global e `git diff --check` também aprovados. Não foram alteradas resoluções npm,
código de aplicação, testes, headers ou políticas de CI.

**Classificação do follow-up: CORRIGIDA E VALIDADA LOCALMENTE.** A correção não está
incorporada à master. Commit, push, PR, merge e validação remota permanecem pendentes de
autorização; a Auditoria 02 **não está formalmente encerrada**.

Este é o adendo à condição registrada no relatório final da Etapa 5. Os relatórios
[da Etapa 3](auditoria-02-etapa3-dependencias.md) e
[da Etapa 4](auditoria-02-etapa4-next-http.md) mantêm seus ambientes e resultados históricos.

## 2. Referência Git e ambiente isolado

| Item                      | Referência                                                              |
| ------------------------- | ----------------------------------------------------------------------- |
| Repositório               | `jeffnunespy/portfolio-web`                                             |
| Base confirmada da master | `1572d3603951097bde6191673cb8ce03d4222201`                              |
| Tree da base              | `2f6d119ce0226d6a8d8ff9e31dbf8c72eaba24f3`                              |
| PR incorporado            | [#34](https://github.com/jeffnunespy/portfolio-web/pull/34)             |
| Branch local da candidata | `security/auditoria-02-node-runtime`                                    |
| Clone independente        | `/tmp/portfolio-auditoria-02-node-runtime`                              |
| Evidências desta execução | `/tmp/portfolio-auditoria-02-node-runtime-evidencias`                   |
| Distribuição portátil     | `/tmp/portfolio-auditoria-02-node-runtime-dist/node-v24.22.2-linux-x64` |

A master não tinha commits posteriores à base aprovada na leitura inicial. A instalação
portátil foi selecionada por `PATH` somente nos processos de validação; `process.execPath`,
`node --version`, `npm --version` e `process.versions` identificam a distribuição selecionada.
Não houve instalação global nem substituição do Node do usuário.

O diretório original permanece na branch `docs/visual-oficial-minimalismo-escuro`, HEAD
`8b3377a295e7325ff18709c1f52c4eb7eaef104c`, com os 24 arquivos não rastreados preservados.
Hashes e estado Git foram registrados para comparação final fora do projeto original.

## 3. Inventário, seleção e integridade do Node

| Local/critério                 | Antes                       | Candidata                  | Finalidade e alteração                                                       |
| ------------------------------ | --------------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| `.nvmrc`                       | 24.19.0                     | 24.22.2                    | Patch exato de desenvolvimento/CI                                            |
| `engines.node`                 | `^24.15.0`                  | `^24.22.1`                 | Primeiro patch corrigido na linha 24; exclui versões anteriores e Node 25/26 |
| `engines.npm`                  | `>=11.16.0`                 | Inalterado                 | Piso funcional da política de scripts                                        |
| Raiz de `package-lock.json`    | Node `^24.15.0`             | Node `^24.22.1`            | Coerência com o manifesto; demais entradas idênticas                         |
| npm executado                  | 11.17.0                     | 11.19.1                    | Versão incluída na distribuição oficial selecionada                          |
| GitHub Actions                 | `node-version-file: .nvmrc` | Inalterado                 | Consumirá 24.22.2 após integração; ainda não executado remotamente           |
| `.github/dependabot.yml`       | Sem pin próprio de Node     | Inalterado                 | Não é mecanismo de seleção do runtime do CI                                  |
| Documentação operacional       | Piso 24.15.0 e pin 24.19.0  | Piso 24.22.1 e pin 24.22.2 | README, contribuição, contexto, publicação, guia e contrato                  |
| Auditorias/research anteriores | Ambientes históricos        | Preservados                | Não reescrever resultados passados                                           |

### Comparação das versões

| Versão                  | Situação                                                             | Decisão                                                     |
| ----------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------- |
| 24.19.0                 | Versão anterior, afetada pelos oito registros examinados             | Recusada pelo novo requisito                                |
| 24.22.1                 | Primeiro lançamento de segurança que corrige os registros            | Piso mínimo, sem elevá-lo além do necessário                |
| 24.22.2                 | Manutenção estável posterior, com correções V8/streams e npm 11.19.1 | Patch fixado para desenvolvimento/CI e efetivamente testado |
| Linha 26 / pré-releases | Fora do escopo autorizado                                            | Não selecionadas                                            |

O índice oficial consultado não apresentava versão estável mais recente da linha 24. A
nota de publicação de 24.22.2 é de 28 de outubro; o índice de distribuição registra 27 de
outubro. Essa diferença de metadados não foi usada como prova de integridade: a seleção
foi sustentada pela distribuição disponível, assinatura, checksum e execução verificados.

### Distribuição verificada

- Origem: `https://nodejs.org/dist/v24.22.2/node-v24.22.2-linux-x64.tar.xz`.
- SHA-256: `48cc0e21e048790e54c0cf5749c2725005313d652651c40b7a21feb9697aaf75`.
- `SHASUMS256.txt.asc` teve assinatura GPG válida do releaser Antoine du Hamel.
- Fingerprint completo: `5BE8A3F6C8A5C01D106C0AD820B1A390B168D356`, confirmado no README
  oficial da tag e na chave do repositório oficial `nodejs/release-keys`.
- Chave obtida no commit `481637f813e912c4aa3622d7964ab426c97b8e8d`; keyring isolado.
- Os registros do checksum assinado e do arquivo não assinado são idênticos; o texto
  assinado tem somente uma linha vazia adicional no fim. O hash do tarball conferiu com
  o registro assinado antes da extração e execução.
- Binário Linux x64 executado com sucesso neste ambiente; npm incluído confirmou 11.19.1.

Fontes primárias: [índice de distribuição](https://nodejs.org/dist/index.json),
[release 24.22.2](https://nodejs.org/en/blog/release/v24.22.2),
[chaves oficiais](https://github.com/nodejs/release-keys) e
[release de segurança 24.22.1](https://nodejs.org/en/blog/release/v24.22.1).

## 4. Vulnerabilidades corrigidas e aplicabilidade

Os registros foram lidos em um commit identificado de `nodejs/security-wg`. A comparação
semântica confirma que 24.19.0 pertence à faixa vulnerável sem estar na faixa corrigida;
24.22.1 e 24.22.2 satisfazem a faixa corrigida em todos os oito casos. Na linha 24, os
registros indicam `24.x` com correção a partir de `^24.22.1`.

| CVE             | Severidade Node | Superfície relevante                | 24.19.0 | 24.22.2   |
| --------------- | --------------- | ----------------------------------- | ------- | --------- |
| CVE-2026-111497 | Alta            | Descompressão Brotli no processo    | Afetado | Corrigido |
| CVE-2026-105482 | Alta            | Resolução DNS de nomes com NUL      | Afetado | Corrigido |
| CVE-2026-105483 | Alta            | Verificação de hostname TLS         | Afetado | Corrigido |
| CVE-2026-106069 | Alta            | Verificação TLS de IP não canônico  | Afetado | Corrigido |
| CVE-2026-105481 | Média           | Reuso de conexão do cliente HTTP    | Afetado | Corrigido |
| CVE-2026-106072 | Média           | Identidade TLS para IP não canônico | Afetado | Corrigido |
| CVE-2026-106074 | Média           | Entropia em snapshots/SEA           | Afetado | Corrigido |
| CVE-2026-106073 | Baixa           | Permission Model e realpathSync     | Afetado | Corrigido |

O portfólio não oferece API de descompressão/hostname arbitrário, autenticação ou dados
persistidos de visitantes. O otimizador está desativado; snapshots/SEA e Permission Model
não são usados como arquitetura de execução. Isso reduz a exposição observada, mas o
runtime também é usado por build, instalação e testes. Não houve PoC perigosa nem alegação
de exploração do portfólio.

`process.versions.brotli` continua mostrando 1.2.0: o release de segurança aplica um
backport da correção. Não se conclui que o binário esteja vulnerável apenas por esse
identificador de biblioteca; a versão oficial do Node e os registros corrigidos são a
referência. [Aviso oficial de outubro](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).

## 5. Arquivos modificados e preservação do escopo

| Arquivo                                                                   | Justificativa                                                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `.nvmrc`                                                                  | Fixar o patch selecionado                                                                  |
| `package.json`                                                            | Elevar apenas `engines.node` ao piso corrigido                                             |
| `package-lock.json`                                                       | Refletir apenas o engine da raiz                                                           |
| `README.md`                                                               | Atualizar setup, requisito e orientação de npm/Node                                        |
| `CLAUDE.md`                                                               | Evitar orientação operacional com o piso antigo                                            |
| `CONTRIBUTING.md`                                                         | Diagnóstico de EBADENGINE e seleção correta do runtime                                     |
| `docs/CHECKLIST_PUBLICACAO.md`                                            | Exigir conferência do patch real da hospedagem                                             |
| `docs/ACTIVE_CONTEXT.md`                                                  | Registrar a candidata, evidências e pendências remotas                                     |
| `specs/001-experiencia-publica-inicial/quickstart.md`                     | Atualizar pré-requisitos operacionais                                                      |
| `specs/001-experiencia-publica-inicial/contracts/next16-compatibility.md` | Registrar a manutenção autorizada do piso, preservando a linha 24 e os requisitos públicos |
| Este adendo                                                               | Rastrear AUD02-E5-001, decisão e validações                                                |

Não se alteraram workflow, Dependabot, `.npmrc`, política `allowScripts`, Next, React,
React DOM, Vitest, Playwright, TypeScript, ESLint, código, conteúdo ou testes da aplicação.
Os requisitos funcionais e a arquitetura da spec permanecem vigentes. A manutenção atualiza
o runtime tratado em T003/T004 e sua orientação de validação em T017, sem encerrar T055
nem marcar integração remota como concluída.

O lockfile tem 523 entradas de dependência (514 pares nome/versão distintos). A comparação
estrutural mostrou como única mudança `packages[""].engines.node`. Versões, integrities,
origens, opcionais e flags de todos os pacotes foram preservados. SHA-256 da serialização
canônica das entradas não raiz, antes e depois:

```text
a7589b69efb3b286075fa7d986e3e034c4b24cf255d3f8d8990a8ae5864aa541
```

## 6. Política npm e cadeia de suprimentos

- `engines.npm >=11.16.0`, `engine-strict=true` e `strict-allow-scripts=true` preservados.
- `allowScripts` continua negando `unrs-resolver` e autorizando apenas `fsevents` 2.3.2/2.3.3.
- Configurações efetivas true/true confirmadas com npm 11.19.1.
- Instalação nova, sem reutilizar `node_modules` anterior: 439 pacotes adicionados.
- Audits completo e produção: zero alertas em todas as severidades nas consultas realizadas.
- `npm audit signatures`: 439 assinaturas e 124 attestations verificadas, exit 0.
- Todos os `resolved` e `integrity` permanecem os do lockfile aprovado; registry npm oficial.
- Os warnings de peers ESLint já documentados se repetem; não foram usados force,
  legacy-peer-deps ou desativação de proteções para instalar.

As fixtures locais usam tarballs próprios sem rede. A inspeção do matcher confirmou que
pacote `file:` é autorizado pela origem resolvida exata, não pelo nome declarado dentro
do tarball. A fixture foi ajustada a essa identidade, sem alterar a política do projeto.
Uma fixture com identidade incorreta foi recusada, sem executar scripts; isso não foi
tratado como regressão do aplicativo nem motivo para relaxar o modo estrito.

Assinatura/attestation não garante ausência de código malicioso. A política limita scripts
de instalação, não o código importado por build/testes. macOS/fsevents não foi exercitado.
Nenhuma atualização foi realizada para remover avisos preexistentes fora do escopo.

## 7. Testes negativos e positivos de compatibilidade

| Cenário descartável                                            | Resultado efetivo                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Node 24.19.0 + npm 11.17.0, manifesto/lock/.npmrc da candidata | Exit 1, EBADENGINE; nenhum node_modules, nenhum script, hashes de entrada preservados |
| Node 24.19.0 + CLI npm 11.19.1                                 | Mesmo bloqueio; atualizar só npm não contorna o piso Node                             |
| Semver de Node 24.19.0, 24.22.0, 25.0.0 e 26.0.0               | Fora de `^24.22.1`; teste de faixa, sem instalar Node 26                              |
| Semver de Node 24.22.1 e 24.22.2                               | Admitidos pelo engine e corrigidos nos oito registros                                 |
| Node 24.22.2 + npm 11.19.1, npm ci real no clone               | Exit 0, lockfile preservado                                                           |
| Fixture com um script aprovado e um negado                     | Instalação exit 0; só o aprovado criou marcador                                       |
| Fixture com script sem decisão                                 | ESTRICTALLOWSCRIPTS; nenhum marcador, inclusive do script aprovado; lock preservado   |

Os testes negativos de runtime usam `npm ci --offline --no-audit --no-fund` para evitar
consultas desnecessárias de peers antes da checagem de engines. Uma tentativa inicial sem
offline ficou em retries de DNS do sandbox e foi encerrada; não foi usada como resultado
de aprovação/reprovação. Nenhuma proteção de engines/scripts foi desativada.

Nas fixtures, `--ignore-scripts` foi usado somente para gerar o lock de preparação sem
executar código. As instalações de prova não usam esse flag; a instalação real do projeto
foi `npm ci` com os controles originais. O piso 24.22.1 foi verificado por faixa/advisories;
a regressão completa foi executada na versão fixada 24.22.2.

## 8. Regressão completa com o runtime corrigido

| Verificação                 | Resultado local                                          |
| --------------------------- | -------------------------------------------------------- |
| Node / npm                  | v24.22.2 / 11.19.1, executáveis da distribuição portátil |
| npm ci                      | Aprovado; instalação limpa e lock preservado             |
| npm audit --json            | Zero alertas                                             |
| npm audit --omit=dev --json | Zero alertas                                             |
| npm audit signatures        | 439 assinaturas / 124 attestations verificadas           |
| Formatação                  | Aprovada no gate global npm run format:check             |
| TypeScript                  | Aprovado                                                 |
| ESLint                      | Aprovado                                                 |
| Unitários                   | 93 aprovados, 10 arquivos                                |
| Build Turbopack             | Aprovado; Next.js 16.4.2; 18 entradas estáticas/SSG      |
| E2E funcional               | 84 aprovados; zero falhas, flaky ou ignorados            |
| Acessibilidade              | 27 aprovados; zero falhas, flaky ou ignorados            |

**204 testes distintos aprovados**, preservando a quantidade histórica. Os 11 testes de
segurança HTTP já estão nos 84 funcionais e não são somados novamente.

O build foi produzido uma única vez com `NEXT_PUBLIC_SITE_URL=https://portfolio.example`
e `NEXT_TELEMETRY_DISABLED=1`. As duas suítes usaram `E2E_BUILD_EXISTENTE=1`, `--workers=2`
e o mesmo BUILD_ID, sem recompilar. A porta livre foi ocupada pelo servidor da própria
suíte; não foi habilitado reaproveitamento de servidor antigo. O domínio `.example` é
apenas origem reservada para testes, não domínio de produção.

## 9. Regressão HTTP, CSP e limitações conhecidas

Os testes existentes verificaram GET/HEAD de páginas, erros e arquivos, CSP/hidratação,
bloqueios de recursos externos/handlers/iframe, MIME/cache, URL pública, PNGs OG e 404 do
otimizador. Uma verificação adicional de 22 respostas usou servidor novo, explicitamente
iniciado pelo binário Node 24.22.2 em loopback.

| Controle                                                                          | Resultado                                                                                 |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy | Preservados nas respostas normais e 404                                                   |
| X-Powered-By                                                                      | Ausente                                                                                   |
| Rotas válidas/inexistentes                                                        | 200/404 esperados                                                                         |
| OG válido/desconhecido                                                            | PNG/404; fallback OG fechado                                                              |
| Otimizador com imagem local válida                                                | 404                                                                                       |
| Hidratação/navegação sob CSP                                                      | Sem violações novas inesperadas nos testes                                                |
| Origem pública                                                                    | 40 casos unitários preservados; nenhuma mudança em lib/site.ts                            |
| Geração estática                                                                  | 18 entradas; sem renderização dinâmica nova                                               |
| `/projetos/%E0%A4%A` e `/projetos/%FF`                                            | Continuam 500 genérico, sem stack/caminho no corpo; sem headers customizados nessa camada |
| NUL e variantes/codificação dupla                                                 | Continuam 404; aviso de persistência de cache com NUL                                     |

Home, currículo e duas fichas válidas mantiveram status e hash de corpo antes/depois das
entradas inválidas. Artefatos compilados HTML/RSC/metadados/corpos permaneceram idênticos.
Não foram demonstrados cache poisoning, confusão de rotas ou vazamento; não houve carga,
PoC de CVE ou teste contra produção. As duas limitações do Next **não foram corrigidas
por esta atualização** e não receberam patch adicional.

## 10. Riscos residuais e revisão

Permanecem os riscos já registrados de CSP com scripts inline, fallback HTML necessário
ao 404 específico, URLs malformadas, persistência de cache/NUL, peers ESLint, tipos Node 26
com runtime 24 e ausência de verificação da hospedagem. A troca de runtime não autoriza
classificar esses itens como corrigidos. A política remota de actions também está fora
do escopo deste follow-up.

Não foi observada regressão funcional, HTTP, de acessibilidade ou SSG. As resoluções de
dependências e os controles das Etapas 1–4 aplicáveis aos arquivos permaneceram intactos.
Não foram editados conteúdo profissional, imagens ou requisitos funcionais; T055 segue
dependente de inspeção humana/preview e não foi encerrada pelos testes automatizados.

A revisão final não encontrou erros em `git diff --check`, alterações fora do escopo ou
padrões de credenciais nos arquivos modificados. Links locais e hashes do lock/históricos
foram conferidos; a preservação do original é registrada nas evidências. A revisão
constitucional do diff não identificou violações dos princípios V/VI/VIII/IX/X.
Os logs e fixtures ficam fora do repositório versionado.

## 11. Integração e verificações remotas pendentes

1. Revisão e autorização do proprietário para criar o commit; nenhum commit foi criado.
2. Após autorização separada, push/PR pela branch isolada, sem alterar a branch original.
3. CI do PR no commit candidato: confirmar Node 24.22.2, npm 11.19.1 e todos os gates.
4. Após revisão e autorização de merge, conferir CI de push da master no merge efetivo.
5. Registrar commit/tree, ancestralidade, versão real nos logs e integridade da master.
6. Só então emitir o follow-up remoto e reavaliar o encerramento formal da Auditoria 02.
7. Quando houver hospedagem, confirmar patch Node, npm, política de scripts e controles
   HTTPS/TLS/HSTS/previews/headers sobre o artefato publicado; não houve deploy nesta tarefa.

Mensagem de commit preparada, sem executá-la:

```text
fix(security): atualizar Node.js para versão corrigida
```

A reversão deve ser deliberada e avaliada como segurança: voltar à 24.19.0 reintroduz a
pendência conhecida. Não recomendar rollback automático para runtime vulnerável apenas
para resolver incompatibilidade; investigar a causa e manter uma versão corrigida da linha 24.

## 12. Evidências e classificação

Evidências principais no diretório externo indicado na seção 2:

- `runtime-distribution-verification.json`, `gpg-verify.log` e checksums oficiais;
- `official-core-advisories.json` e `advisories-version-assessment.json`;
- `baseline.json`, `lockfile-comparison.json` e `versions-and-controls.json`;
- `compatibility-results.json`, logs EBADENGINE e fixtures de scripts;
- resultados `*-result.json`, logs da instalação, audits, assinaturas e gates;
- resumos dos relatórios funcional/a11y, `e2e-build-identity.json` e `http-regression.json`;
- `final-review.json`, comparação final do original e `manifesto-evidencias.sha256`.

**CORRIGIDA E VALIDADA LOCALMENTE — candidata pronta para revisão e autorização de commit.**
Integração e validação remota ainda pendentes. Não declarar a Auditoria 02 formalmente encerrada.
