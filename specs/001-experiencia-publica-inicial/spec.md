# Feature Specification: Experiência Pública Inicial do Portfólio

**Feature Branch**: `001-experiencia-publica-inicial`

**Created**: 2026-08-06

**Status**: Draft

**Input**: User description: "Criar a primeira experiência pública utilizável de uma plataforma profissional de portfólio para um desenvolvedor full-stack em formação, com foco em backend e engenharia de software. Objetivo: permitir que recrutadores, gestores técnicos e desenvolvedores avaliadores entendam o posicionamento profissional do proprietário, conheçam projetos selecionados e encontrem formas de consultar seu currículo, código e contato. Inclui página inicial, apresentação profissional, competências, projetos em destaque, página resumida de projeto, página Sobre, currículo, links de GitHub/LinkedIn e contato. Sem área administrativa, sem cadastro de visitantes, sem interações sociais."

## Clarifications

### Session 2026-08-06

- Q: Quando o repositório de um projeto é privado (código existe, mas não é público), o que a página do projeto deve mostrar em vez do link de repositório? → A: Indicação explícita "código privado — disponível mediante solicitação" com link/CTA para contato.
- Q: Quando um link externo (demonstração, GitHub, LinkedIn) está quebrado ou fora do ar no momento em que o visitante clica, o que a plataforma deve fazer? → A: A plataforma não verifica disponibilidade em tempo real; exibe o link normalmente e a falha, se houver, é tratada pelo destino externo, fora do controle do portfólio.
- Q: O currículo deve ser disponibilizado como um arquivo para download (ex.: PDF) ou como uma página visualizável no próprio site? → A: Ambos — página visualizável no site com opção de download do arquivo.
- Q: Quais são os valores possíveis para o campo "status" de um projeto, de forma que "transparente" tenha significado objetivo e verificável? → A: Conjunto fechado: "Em andamento", "Concluído", "Pausado", "Arquivado".
- Q: A plataforma deve coletar algum dado de navegação do visitante (ex.: analytics de audiência, cookies de rastreamento), mesmo que básico, nesta primeira versão? → A: Nenhuma coleta de dados de navegação do visitante nesta versão.
- Q: Quantos projetos, no mínimo e no máximo, a seção "projetos em destaque" da página inicial deve exibir, à medida que o portfólio cresce além dos 4 projetos iniciais? → A: Teto fixo de até 6 projetos em destaque, selecionados manualmente pelo proprietário; o excedente fica disponível apenas na listagem/página de projetos.
- Q: Quais larguras de tela mínimas devem ser garantidas para "celular", "tablet" e "desktop" no critério de responsividade (SC-006)? → A: Celular a partir de 320px, tablet a partir de 768px, desktop a partir de 1280px.
- Q: A seção "decisões relevantes" na página resumida de projeto deve ter uma quantidade mínima de decisões documentadas por projeto? → A: Mínimo de 2 decisões relevantes documentadas por projeto.
- Q: Quais tipos de conteúdo contam como "evidência" válida para sustentar uma competência exibida no portfólio (FR-024)? → A: Evidência = vínculo a um projeto do portfólio, ou a código/documentação/testes/diagrama/decisão arquitetural/aplicação publicada dentro dele.
- Q: Os links de currículo, GitHub e LinkedIn devem aparecer obrigatoriamente tanto no cabeçalho quanto no rodapé, ou basta estarem em um dos dois de forma consistente em todas as páginas? → A: Cabeçalho traz navegação de páginas (Início, Projetos, Sobre) e currículo em destaque; GitHub, LinkedIn e contato ficam garantidos no rodapé, presente em todas as páginas.
- Q: Cada projeto deve ter um identificador de URL amigável e estável, definido pelo proprietário, ou o sistema pode gerar/alterar esse identificador automaticamente? → A: Identificador definido pelo proprietário na publicação, permanece estável (não muda após publicado).
- Q: O que a plataforma deve fazer quando um visitante acessa a URL de um projeto que não existe ou foi removido? → A: Página "não encontrado" com mensagem amigável e link para a listagem de projetos.
- Q: O conteúdo das páginas públicas é carregado de forma síncrona/estática, ou pode haver espera perceptível que exija um estado de carregamento visível? → A: Conteúdo estático/pré-carregado; não há espera perceptível, logo não é necessário estado de loading nesta versão.
- Q: A ordem de navegação por teclado (tab) nas páginas públicas deve seguir estritamente a ordem visual/de leitura do conteúdo, ou pode haver uma ordem customizada para elementos específicos? → A: Ordem de tabulação segue estritamente a ordem visual/de leitura do conteúdo (topo-base, esquerda-direita), sem customização.
- Q: Como o critério "10 segundos de leitura" do SC-001 pode ser verificado objetivamente, já que tempo de leitura humano não é testável automaticamente? → A: Substituído por critério estrutural verificável: título, descrição e competências por área visíveis na primeira dobra em 1280px, sem rolagem nem navegação.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Avaliar o posicionamento profissional na página inicial (Priority: P1)

Um recrutador ou gestor técnico chega à página inicial do portfólio e, sem navegar para nenhuma outra página, consegue identificar quem é o proprietário, sua área de profundidade (backend e engenharia de software), suas competências complementares (cloud e DevOps) e visualizar projetos em destaque.

**Why this priority**: É o primeiro contato e a evidência mínima que decide se o visitante continua explorando o portfólio. Sem isso, nenhuma outra funcionalidade tem valor.

**Independent Test**: Pode ser testado inteiramente carregando a página inicial e verificando que título, descrição de posicionamento, competências por área e projetos em destaque estão visíveis, sem depender de nenhuma outra página.

**Acceptance Scenarios**:

1. **Given** um visitante acessa a página inicial, **When** a página carrega, **Then** ele vê o título "Desenvolvedor Full-Stack em Formação" e a descrição de posicionamento profissional.
2. **Given** um visitante está na página inicial, **When** ele observa a seção de competências, **Then** as competências estão organizadas por área (ex.: backend, engenharia de software, cloud, DevOps).
3. **Given** um visitante está na página inicial, **When** ele observa a seção de projetos, **Then** ele vê os projetos em destaque com título, resumo, status e categoria.
4. **Given** um visitante está na página inicial, **When** ele usa apenas o teclado para navegar, **Then** todos os elementos interativos (menu, links de projeto, links de contato) são alcançáveis e operáveis via teclado.

---

### User Story 2 - Consultar detalhes de um projeto específico (Priority: P1)

Um desenvolvedor avaliador ou gestor técnico, interessado em um projeto em destaque, acessa a página resumida daquele projeto para entender contexto, decisões técnicas, situação atual e links relacionados (demonstração, repositório).

**Why this priority**: Projetos como estudos de caso são a principal evidência de competência técnica exigida pela constituição do produto; sem esta página, os projetos em destaque são apenas texto sem prova.

**Independent Test**: Pode ser testado acessando diretamente a página de um projeto (a partir do link na página inicial ou por URL direta) e verificando a presença de todas as seções obrigatórias: contexto, objetivo, funcionalidades principais, responsabilidade do proprietário, decisões relevantes, stack, situação atual, limitações e próximos passos.

**Acceptance Scenarios**:

1. **Given** um visitante está na página inicial, **When** ele clica em um projeto em destaque, **Then** é levado à página resumida daquele projeto.
2. **Given** um visitante está na página de um projeto, **When** a página carrega, **Then** ele vê contexto, objetivo, principais funcionalidades, responsabilidade do proprietário, decisões relevantes, stack, situação atual, limitações conhecidas e próximos passos.
3. **Given** um projeto possui link de demonstração pública, **When** o visitante observa a página do projeto, **Then** o link de demonstração está visível e acessível.
4. **Given** um projeto não possui repositório público, **When** o visitante observa a página do projeto, **Then** existe uma indicação explícita de que o código não está disponível, em vez de um link quebrado ou ausência silenciosa.

---

### User Story 3 - Encontrar currículo, código-fonte e contato (Priority: P2)

Um recrutador decidido a avançar com uma candidatura busca rapidamente o currículo, os perfis de GitHub e LinkedIn, e uma forma de contato, a partir de qualquer página do site.

**Why this priority**: Sustenta o objetivo de negócio de apoiar candidaturas; sem acesso fácil a esses meios, o portfólio não converte interesse em contato.

**Independent Test**: Pode ser testado a partir de qualquer página pública, verificando que o cabeçalho expõe o link de currículo e o rodapé expõe links para currículo, GitHub, LinkedIn e um meio de contato, todos funcionais.

**Acceptance Scenarios**:

1. **Given** um visitante está em qualquer página pública, **When** ele observa o cabeçalho ou rodapé, **Then** encontra links para currículo, GitHub e LinkedIn.
2. **Given** um visitante quer contatar o proprietário, **When** ele busca meios de contato, **Then** encontra ao menos uma forma clara de contato (ex.: e-mail) no rodapé ou em página dedicada.
3. **Given** um link externo (GitHub, LinkedIn, demonstração) está temporariamente indisponível, **When** o visitante tenta acessá-lo, **Then** o sistema não afirma disponibilidade falsa; o link aponta para o destino real e eventual indisponibilidade é do destino externo, não do portfólio.

---

### User Story 4 - Conhecer o proprietário na página Sobre (Priority: P2)

Um gestor técnico ou colaborador em potencial acessa a página Sobre para entender a trajetória, o método de trabalho e o posicionamento profissional do proprietário com mais profundidade do que a página inicial oferece.

**Why this priority**: Aprofunda a evidência de posicionamento após o interesse inicial ter sido despertado pela página inicial; não bloqueia o fluxo primário de avaliação de projetos.

**Independent Test**: Pode ser testado acessando a página Sobre diretamente e verificando que o conteúdo amplia (sem contradizer) o posicionamento apresentado na página inicial.

**Acceptance Scenarios**:

1. **Given** um visitante está na navegação principal, **When** ele seleciona "Sobre", **Then** é levado à página Sobre.
2. **Given** um visitante está na página Sobre, **When** a página carrega, **Then** ele vê uma apresentação profissional consistente com a página inicial (backend como área de profundidade, engenharia de software como método, cloud e DevOps como diferenciais).

---

### Edge Cases

- O que acontece quando um projeto está com status "em andamento" ou "incompleto"? O sistema DEVE exibir o status de forma transparente, sem ocultar nem apresentar como concluído.
- O que acontece quando um projeto não possui link de demonstração pública? O sistema DEVE omitir o botão de demonstração ou indicar claramente sua ausência, sem exibir link quebrado.
- O que acontece quando um projeto não possui repositório público (ex.: código proprietário de cliente)? O sistema DEVE exibir uma indicação explícita de indisponibilidade do código, nunca um link inválido.
- O que acontece quando o visitante acessa a plataforma em um dispositivo móvel? Todo o conteúdo e navegação DEVEM permanecer utilizáveis e legíveis sem rolagem horizontal.
- O que acontece quando o visitante navega exclusivamente por teclado? Todos os elementos interativos DEVEM ser alcançáveis em ordem lógica, com foco visível.
- O que acontece quando uma imagem de apresentação de projeto não carrega? O sistema DEVE exibir um estado alternativo claro (texto alternativo ou espaço reservado), nunca um ícone de erro quebrado sem contexto.
- O que acontece quando não há projetos suficientes para preencher a seção de destaque? A seção DEVE se adaptar ao número real de projetos disponíveis, sem exibir placeholders vazios ou dados fictícios como se fossem reais.
- O que acontece quando o visitante acessa a URL de um projeto inexistente ou removido? O sistema DEVE exibir uma página "não encontrado" com mensagem amigável e um link para a listagem de projetos, nunca um erro técnico bruto.

## Requirements *(mandatory)*

### Functional Requirements

**Página inicial**

- **FR-001**: O sistema DEVE exibir uma página inicial pública, acessível sem autenticação, contendo cabeçalho com navegação principal, apresentação profissional resumida, competências por área, projetos em destaque e rodapé.
- **FR-002**: A página inicial DEVE apresentar o título "Desenvolvedor Full-Stack em Formação" e a descrição "Com foco em backend e engenharia de software, construo aplicações web completas da especificação ao deploy, aplicando cloud e práticas de DevOps."
- **FR-003**: A página inicial DEVE organizar as competências por área, distinguindo claramente backend/engenharia de software (área de profundidade) de cloud/DevOps (competências complementares).
- **FR-004**: A página inicial DEVE listar projetos em destaque, cada um com link para sua página resumida, respeitando um teto de até 6 projetos exibidos na página inicial.
- **FR-004a**: O sistema DEVE fornecer uma listagem de projetos, acessível pela navegação principal, contendo todos os projetos publicados, incluindo os que excedem o teto de destaque da página inicial.
- **FR-005**: A navegação principal (cabeçalho) DEVE fornecer acesso, a partir de qualquer página pública, a: página inicial, listagem de projetos, página Sobre e currículo. Os links de GitHub, LinkedIn e contato não são obrigatórios no cabeçalho, desde que garantidos no rodapé conforme FR-018.

**Projetos em destaque**

- **FR-006**: Cada projeto em destaque DEVE exibir título, resumo, problema tratado, status, categoria, tecnologias ou áreas técnicas, imagem de apresentação e principais competências demonstradas.
- **FR-007**: Cada projeto em destaque DEVE fornecer um link para sua página resumida de detalhes.
- **FR-008**: Cada projeto em destaque DEVE exibir link de demonstração quando existente, e link de repositório quando o código for público.
- **FR-009**: Quando o código de um projeto não estiver disponível publicamente, o sistema DEVE exibir uma indicação explícita dessa indisponibilidade, em vez de omitir a informação silenciosamente ou exibir um link inválido.
- **FR-009a**: Quando o repositório de um projeto for privado (código existente, porém não público), o sistema DEVE exibir a indicação explícita "código privado — disponível mediante solicitação" acompanhada de um link ou chamada para ação que direcione ao meio de contato.
- **FR-010**: O sistema DEVE distinguir claramente a natureza de cada projeto entre autoral, acadêmico, colaborativo e profissional.
- **FR-011**: O sistema DEVE permitir que projetos com status incompleto ou em andamento sejam apresentados, desde que o status seja exibido de forma transparente, usando exclusivamente um dos valores do conjunto fechado: "Em andamento", "Concluído", "Pausado" ou "Arquivado".

**Página resumida de projeto**

- **FR-012**: O sistema DEVE fornecer uma página dedicada para cada projeto em destaque, contendo contexto, objetivo, principais funcionalidades, responsabilidade do proprietário no projeto, decisões relevantes (no mínimo 2 por projeto), stack em formato informativo, situação atual, limitações conhecidas, próximos passos e links relacionados.
- **FR-013**: A página do projeto DEVE ser acessível diretamente por link/URL própria, sem depender de navegação prévia pela página inicial.
- **FR-013a**: Cada projeto DEVE possuir um identificador de URL definido pelo proprietário no momento da publicação, que permanece estável e não é alterado após a publicação, mesmo que o título do projeto seja editado.

**Página Sobre**

- **FR-014**: O sistema DEVE fornecer uma página "Sobre" com apresentação profissional do proprietário, consistente com o posicionamento exibido na página inicial.

**Acesso a currículo e redes**

- **FR-015**: O sistema DEVE fornecer acesso ao currículo do proprietário a partir da navegação principal ou do rodapé, como uma página visualizável no próprio site com opção de download do arquivo (ex.: PDF).
- **FR-016**: O sistema DEVE fornecer links para os perfis de GitHub e LinkedIn do proprietário, visíveis a partir de qualquer página pública.
- **FR-017**: O sistema DEVE fornecer ao menos um meio de contato direto (ex.: e-mail) visível a partir de qualquer página pública.

**Rodapé**

- **FR-018**: O rodapé DEVE conter informações essenciais: links de navegação, links de currículo/GitHub/LinkedIn, meio de contato e informação de titularidade/direitos do conteúdo.

**Regras gerais de conteúdo e acesso**

- **FR-019**: O sistema NÃO DEVE exigir cadastro ou login para qualquer conteúdo público descrito nesta especificação.
- **FR-020**: O sistema DEVE ser utilizável em dispositivos móveis e desktop, sem perda de conteúdo ou funcionalidade.
- **FR-021**: O sistema DEVE permitir navegação completa por teclado em todos os elementos interativos das páginas públicas, com ordem de tabulação seguindo estritamente a ordem visual/de leitura do conteúdo (topo-base, esquerda-direita), sem customização.
- **FR-022**: O sistema DEVE usar estrutura semântica de conteúdo (hierarquia de títulos, marcos de navegação, texto alternativo em imagens) nas páginas públicas.
- **FR-023**: O sistema NÃO DEVE apresentar métricas, resultados ou validações de usuário que não possuam evidência correspondente registrada.
- **FR-024**: O sistema NÃO DEVE apresentar competências no portfólio sem evidência correspondente associável. Conta como evidência válida o vínculo a um projeto do portfólio, ou a código, documentação, testes, diagrama, decisão arquitetural ou aplicação publicada dentro desse projeto.
- **FR-025**: O sistema DEVE exibir mensagens claras quando conteúdo estiver ausente ou um link estiver indisponível, em vez de falhar silenciosamente ou exibir erros técnicos brutos.
- **FR-026**: Durante o desenvolvimento, o sistema PODE utilizar conteúdo fictício ou dados iniciais controlados, desde que nunca apresentados como resultados, métricas ou validações reais.
- **FR-027**: O sistema NÃO DEVE coletar nenhum dado de navegação do visitante (ex.: analytics de audiência, cookies de rastreamento) nesta primeira versão.
- **FR-028**: O conteúdo das páginas públicas DEVE ser entregue de forma estática/pré-carregada, sem espera perceptível ao visitante; estados de carregamento (loading) não são exigidos nesta primeira versão.

### Key Entities *(include if feature involves data)*

- **Projeto**: Representa um estudo de caso apresentado no portfólio. Atributos: título, identificador de URL (estável, definido na publicação), resumo, problema tratado, status (valores possíveis: "Em andamento", "Concluído", "Pausado", "Arquivado"), categoria, natureza (autoral, acadêmico, colaborativo, profissional), tecnologias/áreas técnicas, imagem de apresentação, competências demonstradas, contexto, objetivo, funcionalidades principais, responsabilidade do proprietário, decisões relevantes, stack informativa, limitações conhecidas, próximos passos, link de demonstração (opcional), link de repositório (opcional).
- **Perfil profissional**: Representa a apresentação do proprietário. Atributos: título de posicionamento, descrição de posicionamento, competências agrupadas por área, biografia da página Sobre, link de currículo, link de GitHub, link de LinkedIn, meio(s) de contato.
- **Competência**: Representa uma habilidade ou área técnica exibida no portfólio. Atributos: nome, área (ex.: backend, engenharia de software, cloud, DevOps), evidência(s) associada(s) — vínculo a projeto do portfólio e/ou a código, documentação, testes, diagrama, decisão arquitetural ou aplicação publicada dentro desse projeto.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Título, descrição de posicionamento e competências por área (profundidade e complementares) estão visíveis e legíveis na primeira dobra da página inicial em viewport desktop (1280px), sem rolagem e sem necessidade de navegar para outra página — verificável por inspeção visual/snapshot, sem depender de medição de tempo de leitura humano.
- **SC-002**: Um visitante consegue chegar da página inicial até a página detalhada de um projeto em no máximo 1 clique/toque.
- **SC-003**: Um visitante consegue localizar o currículo a partir de qualquer página pública em no máximo 1 clique/toque sem rolagem, e o GitHub, o LinkedIn ou o contato a partir de qualquer página pública em no máximo 1 clique/toque a partir do rodapé.
- **SC-004**: 100% dos projetos exibidos em destaque apresentam status, categoria e natureza (autoral/acadêmico/colaborativo/profissional) de forma visível, sem exceção.
- **SC-005**: 100% dos elementos interativos das páginas públicas (menu, links de projeto, links de currículo/redes/contato) são operáveis exclusivamente por teclado.
- **SC-006**: A experiência pública inicial permanece totalmente utilizável (sem rolagem horizontal, sem sobreposição de conteúdo, sem texto cortado) a partir das larguras mínimas: 320px (celular), 768px (tablet) e 1280px (desktop).
- **SC-007**: Nenhuma competência exibida na página inicial ou Sobre carece de ao menos um projeto, link ou evidência associada que a sustente.

## Assumptions

- O conteúdo inicial de projetos apresentados nesta primeira versão é: a própria plataforma de portfólio, um sistema de suporte/helpdesk, um sistema de gerenciamento de filas e uma plataforma de transcrição e análise de áudio.
- "Projetos em destaque" na página inicial corresponde, nesta fase inicial, a todos os 4 projetos do conteúdo inicial (abaixo do teto de 6); a seleção manual do proprietário passa a ser relevante apenas quando o número total de projetos publicados ultrapassar o teto.
- O currículo é disponibilizado como página visualizável no site com opção de download do arquivo, sem exigir geração dinâmica ou formulário.
- O meio de contato mínimo aceitável é um endereço de e-mail exibido ou acionável; formulários de contato complexos estão fora do escopo, conforme informado pelo usuário.
- Não há gestão de conteúdo dinâmica nesta especificação (sem área administrativa); o conteúdo de projetos e perfil é tratado como dado inicial fornecido, não como funcionalidade a ser especificada aqui.
- "Página resumida de projeto" é uma página própria por projeto, não um modal ou seção expansível dentro da página inicial, dado que a especificação pede link direto e acesso independente.
- Idioma único (português), já que múltiplos idiomas estão explicitamente fora do escopo.
