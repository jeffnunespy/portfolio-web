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
- Q: Os links de currículo, GitHub e LinkedIn devem aparecer obrigatoriamente tanto no cabeçalho quanto no rodapé, ou basta estarem em um dos dois de forma consistente em todas as páginas? → A: Cabeçalho traz navegação de páginas (Início, Projetos, Sobre) e currículo em destaque; GitHub, LinkedIn e contato ficam garantidos no rodapé, presente em todas as páginas. **Superada em 2026-09-01 apenas quanto à navegação:** Roadmap foi incluído entre Projetos e Sobre.
- Q: Cada projeto deve ter um identificador de URL amigável e estável, definido pelo proprietário, ou o sistema pode gerar/alterar esse identificador automaticamente? → A: Identificador definido pelo proprietário na publicação, permanece estável (não muda após publicado).
- Q: O que a plataforma deve fazer quando um visitante acessa a URL de um projeto que não existe ou foi removido? → A: Página "não encontrado" com mensagem amigável e link para a listagem de projetos.
- Q: O conteúdo das páginas públicas é carregado de forma síncrona/estática, ou pode haver espera perceptível que exija um estado de carregamento visível? → A: Conteúdo estático/pré-carregado; não há espera perceptível, logo não é necessário estado de loading nesta versão.
- Q: A ordem de navegação por teclado (tab) nas páginas públicas deve seguir estritamente a ordem visual/de leitura do conteúdo, ou pode haver uma ordem customizada para elementos específicos? → A: Ordem de tabulação segue estritamente a ordem visual/de leitura do conteúdo (topo-base, esquerda-direita), sem customização.
- Q: Como o critério "10 segundos de leitura" do SC-001 pode ser verificado objetivamente, já que tempo de leitura humano não é testável automaticamente? → A: Substituído por critério estrutural verificável: título, descrição e competências por área visíveis na primeira dobra em 1280px, sem rolagem nem navegação.
- Q: Quando um dos campos obrigatórios de um projeto ainda não está pronto, o projeto pode ser publicado com esse campo pendente, ou a publicação deve esperar até que todos os campos estejam completos? → A: Projeto só é publicado quando todos os campos obrigatórios estão completos; não existe estado parcial/rascunho.
- Q: Cada página pública deve ter um título de página e uma descrição meta próprios, ou um único título/descrição genéricos servem para todas as páginas nesta primeira versão? → A: Cada página pública tem título e descrição meta próprios, derivados do seu conteúdo (ex.: título do projeto, "Sobre — Nome").
- Q: FR-023 proíbe apresentar "métricas, resultados ou validações de usuário" sem evidência — isso bloqueia apenas números/dados quantitativos, ou também impede frases qualitativas de responsabilidade? → A: FR-023 proíbe apenas dados quantitativos (números, percentuais, métricas de impacto) sem evidência; descrições qualitativas de responsabilidade são permitidas livremente.
- Q: Quando um projeto começou com uma natureza (ex.: acadêmico) e depois continuou de forma diferente (ex.: virou pessoal/autoral), qual natureza deve ser exibida? → A: Exibir a natureza predominante/atual do projeto; a origem pode ser mencionada em texto livre no campo "contexto", sem campo estruturado adicional.
- Q: As páginas públicas devem atender a um nível de contraste de cor mensurável, ou basta a diretriz genérica de "contraste adequado"? → A: WCAG 2.1 nível AA (contraste mínimo 4.5:1 texto normal, 3:1 texto grande), verificado via axe-core.
- Q: Qual critério objetivo deve marcar a área de profundidade (backend/engenharia de software) como visualmente prioritária sobre as competências complementares (cloud/DevOps)? → A: Ordem de apresentação — área de profundidade é renderizada antes das competências complementares (verificável pela ordem no DOM). **Superada em 2026-09-01:** a ordem continua sendo o critério, mas as áreas demonstráveis passaram a Front-end, Engenharia de Software, Qualidade e Operação.
- Q: Onde exatamente a natureza do projeto (autoral/acadêmico/colaborativo/profissional) deve aparecer para contar como "visível", conforme exige SC-004? → A: Visível no card de projeto (inicial/listagem) E na página de detalhe do projeto.
- Q: O formulário/link de contato deve armazenar ou registrar de alguma forma os dados que o visitante envia (nome, e-mail, mensagem)? → A: Apenas link `mailto:` direto — nenhum dado é armazenado ou processado pelo portfólio.
- Q: A indicação de "código privado — mediante solicitação" (FR-009a) deve registrar de alguma forma quem solicitou acesso? → A: Não — usa o mesmo link `mailto:` direto do contato geral, sem qualquer registro pelo portfólio, mantendo consistência com FR-017 e sem exigir backend/persistência.

### Session 2026-09-01

- Q: Como distinguir um projeto entregue de uma ideia ainda não implementada? → A: Somente conteúdo marcado como implementação real pode aparecer em `/projetos`, contar como evidência e possuir ficha própria. Escopo ainda planejado vive exclusivamente em `/roadmap`, sem imagem de projeto, status de entrega, competências demonstradas ou link de detalhe.
- Q: Qual posicionamento profissional pode ser publicado enquanto a única implementação verificável é esta plataforma? → A: "Desenvolvedor Web em Formação", com Front-end e Engenharia de Software antes de Qualidade e Operação. Backend com Python e Django permanece declarado como interesse e escopo planejado, não como profundidade já demonstrada.
- Q: Como a nova superfície de planejamento entra na navegação? → A: O cabeçalho apresenta, nesta ordem: Início, Projetos, Roadmap, Sobre e Currículo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Avaliar o posicionamento profissional na página inicial (Priority: P1)

Um recrutador ou gestor técnico chega à página inicial do portfólio e, sem navegar para nenhuma outra página, consegue identificar quem é o proprietário, o posicionamento profissional sustentado pela implementação atual, as competências agrupadas por área e os projetos implementados em destaque.

**Why this priority**: É o primeiro contato e a evidência mínima que decide se o visitante continua explorando o portfólio. Sem isso, nenhuma outra funcionalidade tem valor.

**Independent Test**: Pode ser testado inteiramente carregando a página inicial e verificando que título, descrição de posicionamento, competências por área e projetos em destaque estão visíveis, sem depender de nenhuma outra página.

**Acceptance Scenarios**:

1. **Given** um visitante acessa a página inicial, **When** a página carrega, **Then** ele vê o título "Desenvolvedor Web em Formação" e uma descrição que separa trabalho implementado de interesse futuro.
2. **Given** um visitante está na página inicial, **When** ele observa a seção de competências, **Then** as competências estão organizadas por área, com Front-end e Engenharia de Software antes de Qualidade e Operação.
3. **Given** um visitante está na página inicial, **When** ele observa a seção de projetos, **Then** ele vê somente projetos implementados em destaque, com título, resumo, status e categoria.
4. **Given** um visitante está na página inicial, **When** ele usa apenas o teclado para navegar, **Then** todos os elementos interativos (menu, links de projeto, links de contato) são alcançáveis e operáveis via teclado.

---

### User Story 2 - Consultar detalhes de um projeto específico (Priority: P1)

Um desenvolvedor avaliador ou gestor técnico, interessado em um projeto implementado em destaque, acessa a página resumida daquele projeto para entender contexto, decisões técnicas, situação atual e links relacionados (demonstração, repositório).

**Why this priority**: Projetos como estudos de caso são a principal evidência de competência técnica exigida pela constituição do produto; sem esta página, os projetos em destaque são apenas texto sem prova.

**Independent Test**: Pode ser testado acessando diretamente a página de um projeto (a partir do link na página inicial ou por URL direta) e verificando a presença de todas as seções obrigatórias: contexto, objetivo, funcionalidades principais, responsabilidade do proprietário, decisões relevantes, stack, situação atual, limitações e próximos passos.

**Acceptance Scenarios**:

1. **Given** um visitante está na página inicial, **When** ele clica em um projeto em destaque, **Then** é levado à página resumida daquele projeto.
2. **Given** um visitante está na página de um projeto, **When** a página carrega, **Then** ele vê contexto, objetivo, principais funcionalidades, responsabilidade do proprietário, decisões relevantes, stack, situação atual, limitações conhecidas e próximos passos.
3. **Given** um projeto possui link de demonstração pública, **When** o visitante observa a página do projeto, **Then** o link de demonstração está visível e acessível.
4. **Given** um projeto não possui repositório público, **When** o visitante observa a página do projeto, **Then** existe uma indicação explícita de que o código não está disponível, em vez de um link quebrado ou ausência silenciosa.
5. **Given** um visitante acessou diretamente a página de um projeto, **When** chega ao fim da ficha, **Then** encontra acesso à listagem completa, navegação para as fichas anterior e próxima quando existirem e uma chamada para continuar a avaliação pelo currículo.
6. **Given** um item ainda é escopo planejado, **When** o visitante consulta `/roadmap`, **Then** ele vê o item apenas como intenção, sem aparência ou link de ficha entregue.
7. **Given** um item ainda é escopo planejado, **When** o visitante tenta abrir `/projetos/<slug-planejado>`, **Then** nenhuma ficha é publicada e a resposta oferece retorno à listagem de projetos.

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
2. **Given** um visitante está na página Sobre, **When** a página carrega, **Then** ele vê uma apresentação consistente com a página inicial, baseada no método e nas competências demonstráveis nesta plataforma, sem promover interesses planejados a experiência entregue.

---

### Edge Cases

- O que acontece quando um projeto está com status "em andamento" ou "incompleto"? O sistema DEVE exibir o status de forma transparente, sem ocultar nem apresentar como concluído.
- O que acontece quando um projeto não possui link de demonstração pública? O sistema DEVE omitir o botão de demonstração ou indicar claramente sua ausência, sem exibir link quebrado.
- O que acontece quando um projeto não possui repositório público (ex.: código proprietário de cliente)? O sistema DEVE exibir uma indicação explícita de indisponibilidade do código, nunca um link inválido.
- O que acontece quando o visitante acessa a plataforma em um dispositivo móvel? Todo o conteúdo e navegação DEVEM permanecer utilizáveis e legíveis sem rolagem horizontal.
- O que acontece quando o visitante navega exclusivamente por teclado? Todos os elementos interativos DEVEM ser alcançáveis em ordem lógica, com foco visível.
- O que acontece quando uma imagem de apresentação de projeto não carrega? O sistema DEVE exibir um estado alternativo claro (texto alternativo ou espaço reservado), nunca um ícone de erro quebrado sem contexto.
- O que acontece quando não há projetos suficientes para preencher a seção de destaque? A seção DEVE se adaptar ao número real de projetos disponíveis (exibindo apenas os projetos publicados existentes, em quantidade menor que o teto de 6), sem exibir placeholders vazios, espaços reservados ou dados fictícios como se fossem reais.
- O que acontece quando o visitante acessa a URL de um projeto inexistente ou removido? O sistema DEVE exibir uma página "não encontrado" com mensagem amigável e um link para a listagem de projetos, nunca um erro técnico bruto.
- O que acontece quando um projeto ainda não possui todos os campos obrigatórios prontos? O sistema NÃO DEVE publicá-lo; não existe estado de rascunho ou publicação parcial visível ao visitante.
- O que acontece quando um projeto ainda não tem imagem de apresentação disponível no momento da publicação? Pelo mesmo motivo (FR-011a), esse projeto NÃO DEVE ser publicado até que a imagem esteja disponível — o campo é obrigatório (FR-006), não há espaço reservado publicado sem conteúdo real.
- O que acontece quando um item existe apenas como plano? Ele DEVE aparecer somente em `/roadmap`, com linguagem de intenção e sem imagem, status, competências demonstradas ou página de detalhe que o façam parecer entregue.

## Requirements *(mandatory)*

### Functional Requirements

**Página inicial**

- **FR-001**: O sistema DEVE exibir uma página inicial pública, acessível sem autenticação, contendo cabeçalho com navegação principal, apresentação profissional resumida, competências por área, projetos em destaque e rodapé.
- **FR-002**: A página inicial DEVE apresentar o título "Desenvolvedor Web em Formação" e uma descrição factual que identifique esta plataforma como o trabalho implementado e backend com Python/Django como escopo planejado, não como entrega.
- **FR-003**: A página inicial DEVE organizar as competências demonstráveis por área. Front-end e Engenharia de Software DEVEM ser apresentadas/renderizadas antes de Qualidade e Operação, servindo como critério verificável de prioridade visual.
- **FR-004**: A página inicial DEVE listar somente projetos implementados em destaque, cada um com link para sua página resumida, respeitando um teto de até 6 projetos exibidos.
- **FR-004a**: O sistema DEVE fornecer uma listagem de projetos, acessível pela navegação principal, contendo todos os projetos implementados e publicados, incluindo os que excedam o teto de destaque da página inicial.
- **FR-004b**: O sistema DEVE fornecer `/roadmap` para itens ainda não implementados. Esses itens DEVEM usar linguagem de intenção e NÃO DEVEM exibir imagem de projeto, status de entrega, competências demonstradas, demonstração, repositório ou link para `/projetos/<slug>`.
- **FR-005**: A navegação principal (cabeçalho) DEVE fornecer acesso, a partir de qualquer página pública, a: página inicial, listagem de projetos, roadmap, página Sobre e currículo, nesta ordem da esquerda para a direita (ou de cima para baixo em layout mobile). Os links de GitHub, LinkedIn e contato não são obrigatórios no cabeçalho, desde que garantidos no rodapé conforme FR-018.

**Projetos em destaque**

- **FR-006**: Cada projeto implementado em destaque DEVE exibir título, resumo, problema tratado, status, categoria, natureza (autoral/acadêmico/colaborativo/profissional), tecnologias ou áreas técnicas, imagem de apresentação e principais competências demonstradas. A natureza DEVE estar visível tanto no card de projeto (página inicial/listagem) quanto na página de detalhe do projeto.
- **FR-007**: Cada projeto implementado em destaque DEVE fornecer um link para sua página resumida de detalhes.
- **FR-008**: Cada projeto em destaque DEVE exibir link de demonstração quando existente, e link de repositório quando o código for público.
- **FR-009**: Quando o código de um projeto não estiver disponível publicamente, o sistema DEVE exibir uma indicação explícita dessa indisponibilidade, em vez de omitir a informação silenciosamente ou exibir um link inválido.
- **FR-009a**: Quando o repositório de um projeto for privado (código existente, porém não público), o sistema DEVE exibir a indicação explícita "código privado — disponível mediante solicitação" acompanhada de um link ou chamada para ação que direcione ao mesmo meio de contato definido em FR-017 (link `mailto:` direto). O sistema NÃO DEVE registrar ou armazenar dados do solicitante.
- **FR-010**: O sistema DEVE distinguir claramente a natureza de cada projeto entre autoral (idealizado e desenvolvido pelo proprietário por iniciativa própria), acadêmico (desenvolvido no contexto de curso/instituição de ensino), colaborativo (desenvolvido em conjunto com outras pessoas, sem vínculo empregatício) e profissional (desenvolvido no contexto de emprego/contrato remunerado). Quando um projeto evoluiu entre naturezas ao longo do tempo, o campo DEVE refletir a natureza predominante/atual; a origem histórica pode ser mencionada em texto livre no campo de contexto (FR-012), sem necessidade de um campo estruturado adicional.
- **FR-011**: O sistema DEVE permitir que projetos com status incompleto ou em andamento sejam apresentados, desde que o status seja exibido de forma transparente, usando exclusivamente um dos valores do conjunto fechado: "Em andamento", "Concluído", "Pausado" ou "Arquivado".
- **FR-011a**: O sistema NÃO DEVE publicar um projeto até que todos os seus campos obrigatórios (FR-006, FR-012) estejam completos; não há estado de rascunho ou publicação parcial. O status "Em andamento" (FR-011) descreve o progresso do projeto em si, não a completude dos dados publicados sobre ele.

**Página resumida de projeto**

- **FR-012**: O sistema DEVE fornecer uma página dedicada para cada projeto implementado em destaque, contendo contexto, objetivo, principais funcionalidades, responsabilidade do proprietário no projeto, decisões relevantes (no mínimo 2 por projeto), stack em formato informativo, situação atual, limitações conhecidas, próximos passos e links relacionados. Os campos "limitações conhecidas" e "próximos passos" são obrigatórios independentemente do status do projeto (FR-011): para projetos "Concluído" ou "Arquivado", "próximos passos" pode declarar explicitamente a ausência de evolução planejada (ex.: "Nenhuma evolução planejada"), em vez de ficar ausente.
- **FR-013**: A página do projeto DEVE ser acessível diretamente por link/URL própria, sem depender de navegação prévia pela página inicial.
- **FR-013a**: Cada projeto DEVE possuir um identificador de URL definido pelo proprietário no momento da publicação, que permanece estável e não é alterado após a publicação, mesmo que o título do projeto seja editado.
- **FR-013b**: A página do projeto DEVE terminar com um rodapé de ficha que ofereça acesso à listagem completa, navegação para a ficha anterior e a próxima segundo uma ordem de catálogo determinística (com os limites do catálogo comunicados sem links inválidos) e uma chamada para a página de currículo.

**Página Sobre**

- **FR-014**: O sistema DEVE fornecer uma página "Sobre" com apresentação profissional do proprietário, consistente com o posicionamento exibido na página inicial.

**Acesso a currículo e redes**

- **FR-015**: O sistema DEVE fornecer acesso ao currículo do proprietário a partir da navegação principal ou do rodapé, como uma página visualizável no próprio site com opção de download do arquivo (ex.: PDF).
- **FR-016**: O sistema DEVE fornecer links para os perfis de GitHub e LinkedIn do proprietário, visíveis a partir de qualquer página pública.
- **FR-017**: O sistema DEVE fornecer ao menos um meio de contato direto (ex.: e-mail via link `mailto:`) visível a partir de qualquer página pública. O sistema NÃO DEVE armazenar, processar ou registrar nenhum dado pessoal do visitante através desse meio de contato; o envio ocorre inteiramente fora da plataforma (ex.: cliente de e-mail do próprio visitante).

**Rodapé**

- **FR-018**: O rodapé DEVE conter informações essenciais: links de navegação, links de currículo/GitHub/LinkedIn, meio de contato e informação de titularidade/direitos do conteúdo.

**Regras gerais de conteúdo e acesso**

- **FR-019**: O sistema NÃO DEVE exigir cadastro ou login para qualquer conteúdo público descrito nesta especificação.
- **FR-020**: O sistema DEVE ser utilizável em dispositivos móveis e desktop, sem perda de conteúdo ou funcionalidade.
- **FR-021**: O sistema DEVE permitir navegação completa por teclado em todos os elementos interativos das páginas públicas, com ordem de tabulação seguindo estritamente a ordem visual/de leitura do conteúdo (topo-base, esquerda-direita), sem customização.
- **FR-022**: O sistema DEVE atender ao nível de conformidade WCAG 2.1 AA nas páginas públicas, incluindo estrutura semântica de conteúdo (hierarquia de títulos, marcos de navegação, texto alternativo em imagens — este último vinculado ao mesmo estado alternativo exigido no Edge Case de falha de carregamento de imagem) e contraste de cor (mínimo 4.5:1 para texto normal, 3:1 para texto grande).
- **FR-023**: O sistema NÃO DEVE apresentar métricas, resultados quantificados ou validações de usuário (ex.: números, percentuais, contagem de usuários atendidos) que não possuam evidência correspondente registrada. Descrições qualitativas de responsabilidade e contexto (ex.: "implementei o sistema de filas") são permitidas livremente, sustentadas pelo vínculo ao projeto como um todo (FR-024).
- **FR-024**: O sistema NÃO DEVE apresentar competências no portfólio sem evidência correspondente associável. Conta como evidência válida somente o vínculo a um projeto implementado do portfólio, ou a código, documentação, testes, diagrama, decisão arquitetural ou aplicação publicada dentro desse projeto. Um item de roadmap não conta como evidência.
- **FR-025**: O sistema DEVE exibir mensagens claras quando conteúdo estiver ausente ou um link estiver indisponível, em vez de falhar silenciosamente ou exibir erros técnicos brutos. Essas mensagens DEVEM usar linguagem simples e direta (sem jargão técnico), em tom consistente com o restante do portfólio, e sempre oferecer ao visitante uma ação alternativa (ex.: link para a listagem de projetos ou para a página inicial).
- **FR-026**: Durante o desenvolvimento, o sistema PODE utilizar conteúdo fictício ou dados iniciais controlados, desde que nunca apresentados como resultados, métricas ou validações reais.
- **FR-027**: O sistema NÃO DEVE coletar nenhum dado de navegação do visitante (ex.: analytics de audiência, cookies de rastreamento) nesta primeira versão. Esta restrição cobre tanto ferramentas de analytics próprias quanto qualquer conteúdo incorporado de terceiros (ex.: player de vídeo embutido, botões de compartilhamento social); nenhum desses recursos deve ser incluído nesta versão caso implique carregar cookies ou rastreamento de terceiros.
- **FR-028**: O conteúdo das páginas públicas DEVE ser entregue de forma estática/pré-carregada, sem espera perceptível ao visitante; estados de carregamento (loading) não são exigidos nesta primeira versão.
- **FR-029**: Cada página pública DEVE possuir título de página e descrição meta próprios, derivados do seu conteúdo específico (ex.: título do projeto na página de projeto, "Sobre — [Nome]" na página Sobre), em vez de um título/descrição genéricos compartilhados por todas as páginas.

### Key Entities *(include if feature involves data)*

- **Projeto implementado**: Representa um estudo de caso entregue e apresentado no portfólio. Atributos: título, identificador de URL (estável, definido na publicação), marcador de implementação real, resumo, problema tratado, status (valores possíveis: "Em andamento", "Concluído", "Pausado", "Arquivado"), categoria, natureza (autoral, acadêmico, colaborativo, profissional), tecnologias/áreas técnicas, imagem de apresentação, competências demonstradas, contexto, objetivo, funcionalidades principais, responsabilidade do proprietário, decisões relevantes, stack informativa, limitações conhecidas, próximos passos, link de demonstração (opcional), link de repositório (opcional).
- **Escopo planejado**: Representa uma intenção futura exibida no roadmap. Possui título, identificador estável, resumo, problema e descrição prospectiva, mas não publica ficha, imagem, status de entrega, competências demonstradas nem links de evidência.
- **Perfil profissional**: Representa a apresentação do proprietário. Atributos: título de posicionamento, descrição de posicionamento, competências agrupadas por área, biografia da página Sobre, link de currículo, link de GitHub, link de LinkedIn, meio(s) de contato.
- **Competência**: Representa uma habilidade ou área técnica exibida no portfólio. Atributos: nome, área (Front-end, Engenharia de Software, Qualidade ou Operação) e evidência(s) associada(s) — vínculo a projeto implementado e/ou a código, documentação, testes, diagrama, decisão arquitetural ou aplicação publicada dentro dele.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Título, descrição de posicionamento e competências por área (profundidade e complementares) estão visíveis e legíveis na primeira dobra da página inicial em viewport desktop (1280px), sem rolagem e sem necessidade de navegar para outra página — verificável por inspeção visual/snapshot, sem depender de medição de tempo de leitura humano.
- **SC-002**: Um visitante consegue chegar da página inicial até a página detalhada de um projeto implementado em no máximo 1 clique/toque.
- **SC-003**: Um visitante consegue localizar o currículo a partir de qualquer página pública em no máximo 1 clique/toque sem rolagem, e o GitHub, o LinkedIn ou o contato a partir de qualquer página pública em no máximo 1 clique/toque a partir do rodapé.
- **SC-004**: 100% dos projetos implementados exibidos em destaque apresentam status, categoria e natureza (autoral/acadêmico/colaborativo/profissional) de forma visível, sem exceção.
- **SC-005**: 100% dos elementos interativos das páginas públicas (menu, links de projeto, links de currículo/redes/contato) são operáveis exclusivamente por teclado.
- **SC-006**: A experiência pública inicial permanece totalmente utilizável (sem rolagem horizontal, sem sobreposição de conteúdo, sem texto cortado) a partir das larguras mínimas: 320px (celular), 768px (tablet) e 1280px (desktop).
- **SC-007**: Nenhuma competência exibida na página inicial ou Sobre carece de ao menos um projeto implementado, link ou evidência associada que a sustente; itens de roadmap são desconsiderados.
- **SC-008**: 100% dos itens não implementados aparecem somente em `/roadmap` e não possuem ficha resolvível em `/projetos/<slug>`.

## Assumptions

- O conteúdo inicial contém uma implementação verificável, a própria plataforma de portfólio, e quatro itens de escopo planejado: Hayyanu, sistema de suporte/helpdesk, sistema de gerenciamento de filas e plataforma de transcrição e análise de áudio.
- "Projetos em destaque" corresponde somente às implementações reais selecionadas pelo proprietário; nesta fase inicial há uma. Os quatro itens ainda planejados ficam exclusivamente em `/roadmap` e não consomem o teto de 6 destaques.
- O currículo é disponibilizado como página visualizável no site com opção de download do arquivo, sem exigir geração dinâmica ou formulário.
- O meio de contato mínimo aceitável é um endereço de e-mail exibido ou acionável; formulários de contato complexos estão fora do escopo, conforme informado pelo usuário.
- Não há gestão de conteúdo dinâmica nesta especificação (sem área administrativa); o conteúdo de projetos e perfil é tratado como dado inicial fornecido, não como funcionalidade a ser especificada aqui.
- "Página resumida de projeto" é uma página própria por projeto, não um modal ou seção expansível dentro da página inicial, dado que a especificação pede link direto e acesso independente.
- Idioma único (português), já que múltiplos idiomas estão explicitamente fora do escopo.
- Os itens fora de escopo (área administrativa, cadastro/login de visitantes, interações sociais, analytics, múltiplos idiomas, formulário de contato com persistência) são exclusões desta primeira versão, não decisões permanentes; nenhuma versão futura é comprometida ou negada por esta especificação — apenas não fazem parte do escopo atual.
- Nenhum requisito funcional desta especificação depende de uma funcionalidade fora de escopo para ser cumprido; por exemplo, o teto de 6 projetos em destaque (FR-004) usa seleção manual pelo proprietário sobre dados versionados no repositório, sem exigir um mecanismo de curadoria dinâmica.
