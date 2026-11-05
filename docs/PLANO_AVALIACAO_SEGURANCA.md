# Adoção futura de ferramentas de avaliação de segurança

**Data do registro:** 2026-10-31  
**Última atualização:** 2026-11-01 — comparação de adequação das ferramentas ao projeto.  
**Estado:** planejado; ferramentas não integradas e varreduras não executadas nesta iniciativa.

## Objetivo e classificação

Adotar uma rotina de avaliação de segurança da aplicação web, com análise dinâmica
(DAST), revisão manual orientada pelo OWASP WSTG e verificações automatizadas
complementares. Trata-se de adoção e integração de ferramentas existentes, não do
desenvolvimento de uma ferramenta de pentest própria.

Este registro documenta trabalho futuro solicitado pelo proprietário. Não altera os
requisitos aprovados da experiência pública inicial, não cria um novo gate de
publicação e não representa um pentest realizado ou uma certificação de segurança.
Antes da implementação, especificar a iniciativa em `specs/`, com plano técnico,
tarefas e critérios de aceite revisados conforme a constituição do projeto.

## Contexto que orienta a escolha

O portfólio atual usa Next.js 16, React 19 e TypeScript, com páginas pré-renderizadas
e conteúdo em JSON versionado. Não há autenticação, administração, banco de dados,
API própria ou formulário com processamento de dados; o contato usa `mailto:`.
A hospedagem usa o preset Next.js da Vercel, sem `output: "export"`.

O CI já possui auditoria de dependências de produção por
`npm audit --omit=dev --audit-level=high`, além de lint, tipos, testes, build e
acessibilidade. Essas verificações serão preservadas: a análise das respostas HTTP
complementa a auditoria de dependências e os testes existentes.

Fontes locais: [especificação](../specs/001-experiencia-publica-inicial/spec.md),
[plano técnico](../specs/001-experiencia-publica-inicial/plan.md),
[CI](../.github/workflows/ci.yml) e [configuração Next.js](../next.config.js).

## Ferramentas avaliadas e decisão proposta

| Recurso                                                                | Papel previsto                                                                              | Adequação ao projeto atual                                                                                                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ZAP](https://github.com/zaproxy/zaproxy)                              | Ferramenta principal de DAST; começar pelo Baseline e avaliar testes ativos posteriormente. | Prioritário para analisar cabeçalhos, conteúdo misto, respostas de erro e exposição de informações nas páginas e recursos acessados.                           |
| [OWASP WSTG](https://github.com/OWASP/wstg)                            | Metodologia para selecionar cenários e orientar a revisão manual.                           | Prioritário para configuração, implantação, erros e segurança no navegador; registrar como não aplicáveis os cenários dependentes de funcionalidades ausentes. |
| [Nuclei](https://github.com/projectdiscovery/nuclei)                   | Verificação complementar com templates selecionados para a stack e o ambiente.              | Opcional, após o levantamento inicial; avaliar exposições, configurações e vulnerabilidades conhecidas com teste aplicável.                                    |
| [Metasploit Framework](https://github.com/rapid7/metasploit-framework) | Validação pontual caso seja identificada vulnerabilidade com módulo pertinente.             | Sem adoção prevista nesta etapa; reavaliar somente diante de necessidade concreta.                                                                             |
| [OWASP Juice Shop](https://github.com/juice-shop/juice-shop)           | Laboratório separado para treinamento.                                                      | Não integra a avaliação do portfólio; resultados do laboratório não constituem evidência de segurança deste projeto.                                           |

### Comparação com as demais ferramentas sugeridas

A prioridade considera a arquitetura e a superfície atual do portfólio. A
popularidade de uma ferramenta não determina sua necessidade neste projeto.

| Ferramenta ou grupo                                      | Decisão para o portfólio atual       | Justificativa e condição de reavaliação                                                                                                                                          |
| -------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ZAP                                                      | Primeira escolha.                    | Começar pelo Baseline e revisar os alertas antes de avaliar testes ativos ou bloqueios no CI.                                                                                    |
| Nuclei                                                   | Complemento opcional.                | Selecionar templates pertinentes ao Next.js e às configurações expostas, com limites de taxa e concorrência; não executar indiscriminadamente o catálogo.                        |
| ffuf ou feroxbuster                                      | Uso pontual, sem integração inicial. | Investigar caminhos ou arquivos expostos quando houver hipótese concreta. Como as rotas estão no repositório, a descoberta genérica tem menor prioridade.                        |
| Nikto                                                    | Baixa prioridade.                    | Começar pelo ZAP e acrescentar outro scanner somente diante de uma necessidade de cobertura identificada.                                                                        |
| Nmap e Naabu                                             | Sem adoção nesta etapa.              | A avaliação inicial é da aplicação web; varredura de portas da infraestrutura compartilhada da Vercel está fora do escopo. Reavaliar se houver infraestrutura própria a auditar. |
| Subfinder, Amass, BBOT, dnsx e httpx da ProjectDiscovery | Baixa prioridade.                    | A superfície selecionada é pequena e conhecida. Reavaliar se surgirem múltiplos domínios, subdomínios ou serviços que exijam inventário e reconhecimento.                        |
| sqlmap                                                   | Sem aplicação atual.                 | Não há banco SQL nem API própria que justifiquem testes de SQL injection. Reavaliar se forem introduzidas consultas SQL alimentadas por entradas externas.                       |
| WPScan                                                   | Sem aplicação atual.                 | O portfólio não usa WordPress.                                                                                                                                                   |
| Metasploit Framework e Sliver                            | Sem adoção nesta etapa.              | Não há necessidade identificada de exploração com framework ou de comando e controle. A eventual validação pontual com Metasploit depende de achado pertinente.                  |
| Impacket, NetExec, BloodHound e Rubeus                   | Sem aplicação atual.                 | Não há Active Directory ou ambiente Windows/Kerberos no escopo do portfólio.                                                                                                     |
| Hashcat e John the Ripper                                | Sem aplicação atual.                 | Não há autenticação nem conjunto de hashes de senhas a auditar nesta aplicação.                                                                                                  |
| SecLists                                                 | Recurso auxiliar eventual.           | Selecionar listas pequenas e pertinentes apenas se uma investigação com fuzzing for justificada; não adotar listas extensas por padrão.                                          |
| Aircrack-ng e Bettercap                                  | Sem aplicação atual.                 | Auditoria de rede sem fio e testes de interceptação de rede não correspondem à superfície web avaliada.                                                                          |
| Listas awesome-pentest e distribuições como Kali Linux   | Referência e ambiente opcionais.     | Não são requisitos para avaliar este projeto. Selecionar ferramentas conforme os cenários aplicáveis, sem instalar um conjunto completo por conveniência.                        |

Essas decisões não ampliam o escopo operacional nem autorizam execução das
ferramentas. A sequência recomendada permanece: especificação da avaliação,
ZAP Baseline, revisão manual orientada pelo WSTG, correções verificadas, eventual
integração ao CI e Nuclei com templates selecionados. A auditoria de dependências
e os demais gates existentes serão preservados.

## Sequência de implementação futura

- [ ] Especificar objetivos, cenários WSTG aplicáveis, rotas, recursos e ambientes
      abrangidos, incluindo critérios de aceite e limites de execução.
- [ ] Executar um ZAP Baseline inicial, com relatório e identificação do commit,
      artefato e ambiente avaliados. O Baseline combina navegação automatizada com
      análise passiva; não executa os ataques do scanner ativo.
- [ ] Revisar os alertas manualmente, registrar evidências e separar achados
      confirmados, falsos positivos e itens não aplicáveis. A configuração local de
      cabeçalhos não substitui a inspeção das respostas do ambiente hospedado.
- [ ] Definir uma configuração reproduzível do ZAP e avaliar sua integração ao CI,
      com versões fixadas, relatórios como artefatos e política explícita de falha.
      Configurar o tratamento dos alertas antes de tornar a execução um gate.
- [ ] Avaliar Nuclei apenas com uma lista explícita de templates revisados,
      compatíveis com o alvo, versões registradas e limites de taxa e concorrência.
- [ ] Avaliar testes ativos do ZAP em ambiente local ou preview dedicado, com
      escopo e limites definidos, se os resultados iniciais justificarem aprofundar.

## Escopo operacional previsto

Restringir a avaliação às URLs do portfólio explicitamente selecionadas. Links para
GitHub, LinkedIn, demonstrações de outros projetos e outros domínios externos não
autorizam testes desses destinos. A infraestrutura compartilhada da Vercel não é
alvo desta iniciativa.

Usar o build de produção para testes locais. Verificar também o ambiente hospedado
selecionado quando o cenário depender de HTTPS, redirecionamentos ou cabeçalhos da
hospedagem. Caso um preview exija autenticação de acesso, usar o mecanismo seguro
disponível sem desativar sua proteção ou registrar credenciais nos relatórios.

Tratar relatórios como artefatos técnicos: revisar dados sensíveis antes de
versionar ou compartilhar evidências. Identificar versão da ferramenta, configuração,
templates, horário e cobertura; distinguir falha da ferramenta de achado de segurança.

## Critérios de aceite a formalizar na especificação

- Execução reproduzível com ferramentas e configurações identificadas, sem adicionar
  scanners às dependências de runtime do portfólio.
- Cobertura registrada de todas as rotas públicas e recursos selecionados; eventuais
  exclusões, falhas de acesso e cenários não aplicáveis justificados.
- Relatório com evidência, impacto e encaminhamento de cada achado confirmado;
  correções verificadas por nova execução dos cenários afetados.
- Alertas revisados antes da definição de bloqueios do CI; exceções fundamentadas,
  com responsável e condição de revisão, sem supressão genérica para obter sucesso.
- Gates existentes preservados e ausência de declarações de segurança baseadas
  somente em uma varredura sem alertas.

## Referências de execução

- [ZAP Baseline](https://www.zaproxy.org/docs/docker/baseline-scan/): navegação e análise passiva.
- [ZAP Full Scan](https://www.zaproxy.org/docs/docker/full-scan/): inclui testes ativos.
- [Execução e filtros do Nuclei](https://docs.projectdiscovery.io/opensource/nuclei/running).
- [OWASP WSTG](https://owasp.org/projects/web-security-testing-guide): escolher uma versão
  publicada e registrar os identificadores dos cenários utilizados.

Revalidar a documentação e a compatibilidade das versões no momento da implementação.
