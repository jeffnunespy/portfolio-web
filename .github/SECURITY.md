# Política de segurança

A segurança e a privacidade fazem parte do projeto desde o início (princípio VI da
[constituição](../.specify/memory/constitution.md)). Agradeço a quem dedica tempo a relatar
problemas de forma responsável.

## Superfície do projeto

Nesta fase, o portfólio é um site pré-renderizado com Next.js, publicado na Vercel:

- **sem backend dinâmico**, banco de dados ou API própria;
- **sem autenticação** nem área administrativa;
- **sem coleta de dados de navegação** nem dependências externas em runtime;
- conteúdo versionado em JSON e validado em tempo de build.

Ainda assim, problemas podem existir — por exemplo, em cabeçalhos HTTP, dependências,
configuração de publicação, links externos ou vazamento acidental de informações no
repositório.

## Versões suportadas

| Versão                                  | Suporte                |
| --------------------------------------- | ---------------------- |
| `master` (publicada em produção)        | ✅ Correções aplicadas |
| Branches de trabalho e previews antigos | ❌ Sem suporte         |

## Como relatar uma vulnerabilidade

> [!WARNING]
> **Não abra issues, discussões ou pull requests públicos** para relatar vulnerabilidades.

1. **Preferencial:** use o relato privado do GitHub em
   [**Security → Report a vulnerability**](https://github.com/jeffnunespy/portfolio-web/security/advisories/new).
2. **Alternativa:** envie um e-mail para **jeffnunesxavier@gmail.com** com o assunto
   `[SEGURANÇA] portfolio-web`.

Inclua, sempre que possível:

- descrição do problema e impacto esperado;
- URL, rota ou arquivo afetado;
- passos para reproduzir ou prova de conceito mínima;
- versão (commit, deployment ou data) em que o problema foi observado;
- sugestão de correção, se houver.

## O que esperar

| Etapa                      | Prazo alvo         |
| -------------------------- | ------------------ |
| Confirmação de recebimento | até 5 dias úteis   |
| Avaliação inicial          | até 10 dias úteis  |
| Correção ou mitigação      | conforme gravidade |

Os prazos são metas de um projeto mantido por uma pessoa, não garantias contratuais. Você
será informado sobre o andamento e, se quiser, receberá crédito no registro da correção.

## Escopo

**Dentro do escopo:**

- o código deste repositório e o workflow de CI;
- o site publicado em https://portfolio-web-three-zeta.vercel.app;
- dependências declaradas em `package.json` com impacto real no site.

**Fora do escopo:**

- vulnerabilidades da própria plataforma Vercel ou do GitHub (relate aos respectivos
  programas);
- ataques de negação de serviço, engenharia social ou testes físicos;
- relatórios automatizados sem demonstração de impacto;
- ausência de boas práticas sem cenário de exploração concreto.

## Diretrizes para pesquisa

Ao investigar, por favor:

- não acesse, modifique nem destrua dados de terceiros;
- não degrade a disponibilidade do site (sem varreduras agressivas ou carga excessiva);
- dê tempo razoável para correção antes de qualquer divulgação pública.

Pesquisa conduzida de boa-fé e dentro destas diretrizes não será tratada como abuso.

## Práticas adotadas

- `npm audit --omit=dev --audit-level=high` como gate obrigatório do CI;
- Dependabot semanal para dependências npm e GitHub Actions;
- instalação reproduzível com `npm ci` e `engine-strict`;
- `.env*` e `.vercel/` fora do controle de versão;
- avaliação de segurança futura planejada em
  [`docs/PLANO_AVALIACAO_SEGURANCA.md`](../docs/PLANO_AVALIACAO_SEGURANCA.md) (OWASP ZAP,
  WSTG e Nuclei).
