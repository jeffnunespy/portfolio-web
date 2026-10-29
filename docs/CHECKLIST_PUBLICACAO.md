# Checklist de publicação do portfólio

Este roteiro operacionaliza T055 e o
[contrato de compatibilidade](../specs/001-experiencia-publica-inicial/contracts/next16-compatibility.md).
Marcar uma inspeção humana somente depois de executá-la. Testes automatizados e capturas
do agente são evidências complementares.

## Versão a validar

| Campo                                   | Registro em 2026-10-27                                      |
| --------------------------------------- | ----------------------------------------------------------- |
| Branch local                            | `docs/visual-oficial-minimalismo-escuro`                    |
| Último commit local                     | `9a901660731ad91d5d03fa33b5a51a52fa852439`                  |
| Alterações locais posteriores ao commit | Presentes; ainda sem commit/push                            |
| Configuração da Vercel                  | Não iniciada, conforme informação do proprietário           |
| URL de preview desta versão             | Pendente                                                    |
| CI associado ao SHA acima               | Nenhuma execução ou status encontrado na consulta ao GitHub |

O CI de um commit anterior não valida alterações locais posteriores. Ao preparar o candidato,
registrar o SHA que contém o código revisado, a URL do preview e o link da execução de CI
correspondente. Revisar também as alterações preexistentes antes de escolher o conteúdo do commit.

## Evidência técnica já disponível

- T110: tipos, lint, build de produção, 46 unitários e 90 E2E aprovados em 2026-10-27.
  A suíte inclui teclado, ausência de JavaScript, axe, metadados, fontes e refluxo.
- T110: home/catálogo em 320/390/768/1280px com texto a 100% e 200%, sem recortes
  nos 16 cenários medidos; inspeção visual de desktop/celular registrada no contexto ativo.
- T111: manutenção restrita a metadados visuais, sidecar e documentação. Os arquivos da
  aplicação e `DESIGN.md` são conferidos por hash para preservar a validade da evidência de T110.

Os resultados e as pendências atualizados ficam em [ACTIVE_CONTEXT.md](ACTIVE_CONTEXT.md).

## Inspeção humana local — T055

Usar o build de produção local e registrar pessoa, data, navegador, sistema e resultado.

| Estado   | Inspeção              | Procedimento e critério de aceite                                                                                                                                                                    |
| -------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pendente | Teclado e foco        | Percorrer home, catálogo, ambas as fichas, roadmap, Sobre, currículo e 404 usando Tab, Shift+Tab e Enter. Primeiro Tab revela o salto ao conteúdo; foco visível, ordem coerente e nenhuma armadilha. |
| Pendente | Percurso aos projetos | Ativar “Ver projetos em destaque”: o título recebe foco. Seguir até uma ficha e voltar. Todos os links e expansões devem continuar alcançáveis.                                                      |
| Pendente | Expansões             | Abrir e fechar escolhas/limites e “Ver comprovação” com Enter/Espaço; foco permanece compreensível e o conteúdo é legível.                                                                           |
| Pendente | Zoom real             | Ampliar para 200% no navegador. Conferir nome, menu, cartões, detalhes abertos e rodapé, sem perda de texto ou controles.                                                                            |
| Pendente | Celular físico        | Conferir leitura, rolagem, orientação e toque em aparelho real. Registrar modelo, sistema e navegador; incluir Android/Chrome e iOS/Safari quando disponíveis.                                       |
| Pendente | Leitor de tela real   | Usar NVDA ou VoiceOver. Conferir landmarks, nome completo, um h1 por rota, sequência de headings, nomes dos links e anúncio das expansões. Registrar a combinação leitor/navegador.                  |
| Pendente | Conteúdo no leitor    | Nana é anunciada como em validação, com código privado e contato; o roadmap permanece planejamento. O diagrama anuncia três etapas em lista; pontos e imagens decorativos não repetem informação.    |
| Pendente | Currículo e links     | Abrir o PDF, conferir uma página e consistência com o perfil. Seguir GitHub, LinkedIn e demonstração de Nana; conferir o destino do e-mail e identificar eventual bloqueio de acesso.                |

Modelo de registro: `data · pessoa · dispositivo/SO · navegador/leitor · cenário · resultado · evidência ou problema`.

## Primeira configuração da Vercel

O projeto usa Next.js com pré-renderização; não usa exportação estática. O build já está
configurado em `package.json` e o runtime em `engines.node`/`.nvmrc`.

### Configurações deste repositório

| Campo            | Valor a conferir                                                      |
| ---------------- | --------------------------------------------------------------------- |
| Repositório      | `jeffnunespy/portfolio-web`                                           |
| Framework Preset | Next.js                                                               |
| Root Directory   | Raiz do repositório (`./`)                                            |
| Node.js Version  | 24.x (`engines.node` `^24.22.1`; `.nvmrc` fixa 24.22.2 para local/CI) |
| Install Command  | `npm ci`                                                              |
| Build Command    | `npm run build`                                                       |
| Output Directory | Padrão do preset Next.js; sem override para `public` ou `out`         |

A Vercel suporta Node.js 24.x e respeita a versão principal declarada no manifesto.
[Referência de runtime](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
Conferir nos logs o patch efetivo de build/runtime e o npm: exigir Node 24.22.1 ou superior
na linha 24 e npm >=11.16.0. A seleção 24.x no painel não comprova o patch de segurança.

### Criar o primeiro preview

1. Entrar na conta Vercel e escolher o escopo correto do projeto. A autenticação ocorre
   diretamente na Vercel; não compartilhar tokens ou senhas no chat.
2. A partir da raiz local, usar a CLI de forma interativa para vincular/criar o projeto.
   Não há CLI instalada neste ambiente; `npx` permite seu uso temporário sem dependência
   no aplicativo nem instalação global. Conferir conta, nome, raiz e preset antes de confirmar.

   ```sh
   rtk proxy npx vercel login
   rtk proxy npx vercel link
   ```

   O comando `link` associa a pasta ao projeto; a implantação é uma etapa posterior.
   [Referência de vinculação](https://vercel.com/docs/cli/link).

3. Conferir as configurações da tabela no painel. No ambiente Preview, deixar
   `NEXT_PUBLIC_SITE_URL` sem um domínio definitivo forçado e confirmar a exposição de
   `VERCEL_ENV=preview` e `VERCEL_URL`: `lib/site.ts` só aceita esse fallback no preview
   declarado e valida o hostname `*.vercel.app`.
   Na preparação de produção, definir `NEXT_PUBLIC_SITE_URL` com a origem HTTPS final
   confirmada, sem credenciais, caminho, query ou fragmento. Produção sem origem explícita
   falha no build; não usa host de preview ou localhost silenciosamente. Loopback é permitido
   apenas para execução local, nunca em deployments Vercel de produção/preview.
   Conferir os headers na hospedagem: HSTS, domínio, subdomínios e proteção de previews
   permanecem pendentes de verificação; a auditoria local não comprova esses controles.
   [Variáveis de sistema](https://vercel.com/docs/environment-variables/system-environment-variables).
4. Depois da revisão do candidato e da autorização de implantação, criar explicitamente
   o ambiente de teste:

   ```sh
   rtk proxy npx vercel deploy --target=preview
   ```

   Conferir no painel o ambiente **Preview** e copiar a URL do deployment específico.
   O parâmetro `--target` seleciona o ambiente de destino.
   [Referência de deploy](https://vercel.com/docs/cli/deploy).

5. Conectar o repositório GitHub ao projeto para os próximos previews. Definir conscientemente
   a branch de produção: pushes nessa branch geram produção; branches de trabalho geram
   previews. A importação inicial pelo painel pode criar produção, por isso revisar o destino
   antes de acionar Deploy. [Integração Git](https://vercel.com/docs/git).

Não é necessário adicionar `vercel.json`, secrets de backend ou um framework novo para essa
configuração. Uma URL de preview ainda não foi criada nem validada nesta sessão.

## Validação do preview e do CI

| Estado   | Verificação              | Critério                                                                                                                                                              |
| -------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pendente | Identidade da versão     | URL do deployment e SHA/revisão candidata registrados; o site corresponde aos arquivos revisados.                                                                     |
| Pendente | Rotas                    | Abrir diretamente `/`, `/projetos`, `/projetos/nana-silva`, `/projetos/plataforma-portfolio`, `/roadmap`, `/sobre` e `/curriculo`; navegação cliente também funciona. |
| Pendente | Recuperação              | Abrir rota inexistente e slug inexistente: 404 amigável com retorno válido.                                                                                           |
| Pendente | Recursos                 | Fonte, imagem da plataforma, ícone e PDF carregam; Nana continua textual.                                                                                             |
| Pendente | Metadados                | Títulos próprios, canonical/OG com host correto, sem `localhost` em deployment hospedado.                                                                             |
| Pendente | Acessibilidade hospedada | Repetir os percursos de teclado, leitor e zoom; conferir celular físico.                                                                                              |
| Pendente | Console e rede           | Ausência de erro de hidratação, recursos quebrados ou falhas inesperadas.                                                                                             |
| Pendente | CI do candidato          | Workflow CI aprovado no SHA com todas as alterações, sem gates ignorados.                                                                                             |

O workflow atual dispara por push e pull request. Commit e push precisam abranger o diff revisado
e estar autorizados; não foram executados nesta sessão. A aprovação de build da Vercel é distinta
do workflow de qualidade do GitHub.

## Encerramento

- [ ] Evidências humanas registradas em `docs/ACTIVE_CONTEXT.md`.
- [ ] Preview desta versão aprovado e identificado.
- [ ] CI do commit candidato aprovado.
- [ ] T055 concluída somente após os três itens anteriores.
- [ ] Promoção para produção autorizada separadamente, com referência do artefato aprovado
      e estratégia de rollback do contrato.
