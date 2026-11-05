# Política de segurança

## Escopo

Este repositório contém o código-fonte de um portfólio profissional público: um site estático em
Next.js, sem autenticação, banco de dados, formulários ou coleta de dados de visitantes. O
conteúdo vem de arquivos JSON versionados e é validado no build.

Estão no escopo o código deste repositório, a configuração do build e o pipeline de integração
contínua (`.github/workflows/`). Serviços de terceiros e os projetos externos citados no
portfólio estão fora do escopo; relate problemas neles diretamente aos responsáveis.

## Versões suportadas

Só existe uma versão mantida: a da branch `master`, que é a publicada. Correções de segurança
entram nela; não há versões anteriores com suporte.

## Como relatar uma vulnerabilidade

Use o relato privado do GitHub: na aba **Security** do repositório, clique em
**Report a vulnerability**
([link direto](https://github.com/jeffnunespy/portfolio-web/security/advisories/new)).
O relato fica visível só para quem o enviou e para o mantenedor.

Não publique a vulnerabilidade em issues, discussões, pull requests ou outros canais públicos
antes que ela seja analisada e, se for o caso, corrigida.

## O que incluir

Quando aplicável:

- descrição do problema e componente afetado (arquivo, rota ou etapa do pipeline);
- condições necessárias para que ele ocorra;
- impacto esperado;
- passos de reprodução seguros, executáveis localmente;
- evidências pertinentes (logs, capturas, trechos de código);
- sugestão de mitigação, se houver.

Teste apenas contra uma cópia local do projeto. Não explore sistemas de terceiros nem a
hospedagem do site, e não acesse ou altere dados que não sejam seus.

## Informações sensíveis

Envie evidências sensíveis (credenciais encontradas, dados pessoais, detalhes de exploração)
somente pelo relato privado. Se encontrar um segredo exposto, informe onde ele está, sem copiar o
valor.

## Tratamento

Cada relato é avaliado e priorizado conforme a gravidade e o impacto. O andamento é comunicado
pelo próprio relato privado. Quando a correção é publicada, o advisory pode ser divulgado com
crédito a quem relatou, se a pessoa quiser. Não há programa de recompensas.
