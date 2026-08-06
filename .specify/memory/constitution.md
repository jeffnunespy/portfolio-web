<!--
Sync Impact Report
Version change: TEMPLATE → 1.0.0
Modified principles: N/A (initial ratification from template placeholders)
Added sections:
  - I. Evidências acima de afirmações
  - II. Entregas verticais e incrementais
  - III. Simplicidade proporcional
  - IV. Backend como área de profundidade
  - V. Qualidade verificável
  - VI. Segurança e privacidade desde o início
  - VII. Acessibilidade e experiência consistente
  - VIII. Documentação como parte da entrega
  - IX. Operação responsável
  - X. Uso responsável de inteligência artificial
  - Governança
Removed sections: [SECTION_2_NAME] / [SECTION_3_NAME] placeholders (não utilizados
  neste projeto; a constituição adota 10 princípios em vez da estrutura de 5
  princípios + 2 seções do template original)
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): data de ratificação original não informada pelo
    usuário; usar a data desta sessão (2026-08-06) como data de adoção, a menos
    que o proprietário informe outra data retroativa.
-->

# Portfólio Profissional Constitution

## Contexto e Objetivos

Esta constituição rege o desenvolvimento de uma plataforma profissional de
portfólio para um desenvolvedor full-stack em formação, com foco em backend e
engenharia de software, utilizando cloud e práticas de DevOps como
diferenciais.

A plataforma tem como objetivos:

1. Apresentar projetos como estudos de caso completos.
2. Registrar a evolução técnica do proprietário.
3. Apoiar candidaturas para estágio, trainee e vagas júnior.
4. Demonstrar capacidade de conduzir aplicações da especificação ao deploy.
5. Servir também como projeto demonstrável de engenharia de software.

## Core Principles

### I. Evidências acima de afirmações

Toda competência apresentada no portfólio DEVE ser sustentada por evidências
verificáveis, como código, documentação, testes, diagramas, aplicação
publicada, decisões arquiteturais ou resultados observáveis. Afirmações sem
evidência associada não podem ser publicadas.

### II. Entregas verticais e incrementais

As funcionalidades DEVEM ser desenvolvidas em pequenas fatias completas,
incluindo interface, regra de negócio, persistência, autorização quando
aplicável, testes, documentação e operação. NÃO é permitido desenvolver todo o
frontend, todo o backend ou toda a infraestrutura isoladamente antes de
integrar as partes.

### III. Simplicidade proporcional

A solução mais simples que cumpra os requisitos atuais DEVE ser preferida.
Novos serviços, bibliotecas, camadas e abstrações DEVEM possuir justificativa
documentada. Microsserviços, filas, caches ou padrões complexos DEVEM ser
evitados quando o problema ainda não exigir essas soluções.

### IV. Backend como área de profundidade

A modelagem de domínio, integridade dos dados, regras de negócio, segurança,
autorização, APIs, desempenho e tratamento de falhas DEVEM receber atenção
especial. O frontend DEVE permanecer profissional, acessível, responsivo e
funcional, mesmo não sendo a principal especialização demonstrada.

### V. Qualidade verificável

Toda funcionalidade DEVE possuir critérios de aceite. Regras de negócio e
fluxos críticos DEVEM possuir testes automatizados. Correções de defeitos
DEVEM incluir teste de regressão quando aplicável. Lint, formatação,
verificação de tipos e testes DEVEM ser executados pelo pipeline de integração
contínua.

### VI. Segurança e privacidade desde o início

DEVE-SE aplicar mínimo privilégio, validação de entradas, proteção de
credenciais, gestão de segredos, atualizações de dependências, proteção contra
abuso, registros de segurança e tratamento adequado de dados pessoais.
Visitantes não devem precisar criar conta no MVP. Somente o proprietário terá
acesso à administração inicial.

### VII. Acessibilidade e experiência consistente

As páginas públicas DEVEM ser responsivas, navegáveis por teclado, possuir
estrutura semântica, contraste adequado, textos alternativos e estados claros
de carregamento, vazio, sucesso e erro.

### VIII. Documentação como parte da entrega

Cada funcionalidade relevante DEVE manter documentação compatível com sua
complexidade. Projetos apresentados DEVEM registrar problema, escopo,
requisitos, arquitetura, decisões, testes, segurança, deploy, limitações e
próximos passos.

### IX. Operação responsável

Funcionalidades somente podem ser consideradas prontas quando houver condições
de identificar erros, versão implantada e estado básico da aplicação. Deploys
DEVEM ser reproduzíveis e possuir estratégia de rollback adequada ao risco.

### X. Uso responsável de inteligência artificial

Código, especificações e decisões produzidos com assistência de IA DEVEM ser
revisados e compreendidos pelo proprietário. A IA NÃO PODE inventar resultados,
métricas, experiência profissional, validações de usuário ou evidências
inexistentes.

## Governança

- A constituição prevalece sobre preferências ocasionais da implementação.
- Exceções DEVEM ser justificadas e registradas.
- Nenhuma implementação começa antes de existir uma especificação revisada.
- Nenhuma especificação avança para implementação sem critérios de aceite.
- Mudanças relevantes de arquitetura DEVEM ser registradas.
- Cada tarefa DEVE alterar uma parte limitada e verificável do sistema.
- A definição de pronto exige código, testes, documentação e validação dos
  critérios de aceite.

**Version**: 1.0.0 | **Ratified**: 2026-08-06 | **Last Amended**: 2026-08-06
