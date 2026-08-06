# Pré-Implementação Checklist: Experiência Pública Inicial do Portfólio

**Purpose**: Validar a qualidade dos requisitos da especificação antes de avançar para o planejamento/implementação
**Created**: 2026-08-06
**Feature**: [spec.md](../spec.md)

**Note**: Este checklist avalia se os REQUISITOS estão bem escritos (completos, claros, consistentes,
mensuráveis e com cobertura adequada) — não valida se a implementação funciona.

## Clareza do posicionamento profissional

- [x] CHK001 - É especificado exatamente qual conteúdo deve permanecer inalterado (título e descrição de posicionamento) versus o que pode variar por página? [Clarity, Spec §FR-002]
- [x] CHK002 - A relação de prioridade entre "área de profundidade" (backend/engenharia de software) e "competências complementares" (cloud/DevOps) está definida de forma que seja objetivamente verificável na hierarquia visual? [Measurability, Spec §FR-003]
- [x] CHK003 - Os requisitos de posicionamento profissional são consistentes entre a página inicial e a página Sobre, sem contradição de ênfase ou conteúdo? [Consistency, Spec §FR-002, §FR-014]

## Credibilidade das afirmações

- [x] CHK004 - O critério para determinar se uma afirmação de competência "possui evidência correspondente" está definido de forma objetiva (ex.: tipos de evidência aceitos)? [Clarity, Spec §FR-024]
- [x] CHK005 - Existe um requisito que impeça a publicação de qualquer competência sem ao menos uma evidência associável, cobrindo todas as páginas públicas (não só a inicial)? [Coverage, Spec §FR-024, §SC-007]
- [x] CHK006 - Os termos "resultado", "métrica" e "validação de usuário" usados em FR-023 estão definidos o suficiente para distinguir o que é proibido de o que é permitido (ex.: descrição qualitativa de responsabilidade vs. número de usuários atendidos)? [Ambiguity, Spec §FR-023]

## Transparência sobre experiência e projetos

- [x] CHK007 - A distinção entre projeto autoral, acadêmico, colaborativo e profissional possui definição de cada categoria, ou apenas a exigência de "distinguir claramente" sem critério? [Gap, Spec §FR-010]
- [x] CHK008 - Está especificado onde (em quais dos elementos de card/página) a natureza do projeto (autoral/acadêmico/colaborativo/profissional) deve aparecer para ser considerada "visível", conforme exigido em SC-004? [Clarity, Spec §SC-004]
- [x] CHK009 - Os requisitos definem o que fazer quando a natureza de um projeto é mista (ex.: iniciado como acadêmico e continuado como autoral)? [Edge Case, Gap]

## Completude dos estudos de caso

- [x] CHK010 - Todos os campos obrigatórios da página resumida de projeto (FR-012) possuem definição do que constitui conteúdo mínimo aceitável (ex.: "decisões relevantes" — quantas, que profundidade)? [Clarity, Spec §FR-012]
- [x] CHK011 - Os requisitos definem um limite mínimo/máximo de projetos em destaque na página inicial, ou isso depende inteiramente da Assumption sobre os 4 projetos iniciais? [Gap, Spec §Assumptions]
- [x] CHK012 - Está especificado o que acontece quando um dos campos obrigatórios do card de projeto (FR-006) não está disponível no momento da publicação (ex.: imagem de apresentação ainda não produzida)? [Edge Case, Gap]
- [x] CHK013 - Os requisitos de "próximos passos" e "limitações conhecidas" (FR-012) diferenciam obrigatoriedade de conteúdo de projetos concluídos versus projetos em andamento? [Consistency, Gap]

## Acessibilidade

- [x] CHK014 - Os critérios de "estrutura semântica" (FR-022) referenciam um padrão ou nível de conformidade verificável (ex.: WCAG e nível), ou permanecem genéricos? [Measurability, Spec §FR-022]
- [x] CHK015 - O requisito de navegação por teclado (FR-021, SC-005) define a ordem de foco esperada ou apenas a alcançabilidade dos elementos? [Completeness, Spec §FR-021]
- [x] CHK016 - Existe requisito de contraste de cor mínimo mensurável, ou a acessibilidade visual permanece implícita? [Gap]
- [x] CHK017 - O requisito de texto alternativo para imagens de projeto está vinculado ao edge case de falha de carregamento de imagem, garantindo que ambos sejam tratados de forma consistente? [Consistency, Spec §Edge Cases]

## Responsividade

- [x] CHK018 - SC-006 define "larguras de tela típicas de celular, tablet e desktop" com valores concretos (breakpoints) ou permanece um termo qualitativo não verificável? [Measurability, Spec §SC-006]
- [x] CHK019 - Os requisitos de responsividade cobrem tanto a página inicial quanto a página de projeto e a página de currículo, ou apenas mencionam "páginas públicas" de forma agregada? [Coverage, Spec §FR-020]

## Privacidade

- [x] CHK020 - O requisito de não coleta de dados de navegação (FR-027) cobre explicitamente cookies de terceiros incorporados (ex.: player de vídeo embutido, botões sociais), ou apenas analytics próprio? [Gap, Spec §FR-027]
- [x] CHK021 - Está definido se o formulário/link de contato (FR-017) processa ou armazena dados pessoais do visitante, e se isso está alinhado ao princípio de privacidade da constituição? [Gap, Spec §FR-017]
- [x] CHK022 - O requisito de indicação de "código privado — mediante solicitação" (FR-009a) especifica se a solicitação de acesso implica coleta/registro de dados do solicitante? [Ambiguity, Spec §FR-009a]

## SEO básico

- [x] CHK023 - Existe algum requisito sobre metadados descritivos (título de página, descrição) por página pública, ou o tema SEO está totalmente ausente da especificação? [Gap]
- [x] CHK024 - Está definido se cada página de projeto deve ter identificador/URL único e estável, permitindo referência externa duradoura? [Gap, Spec §FR-013]

## Navegação

- [x] CHK025 - FR-005 lista os destinos da navegação principal, mas define a ordem ou agrupamento esperado desses itens? [Clarity, Spec §FR-005]
- [x] CHK026 - Os requisitos de navegação são consistentes entre cabeçalho e rodapé quanto a quais links são obrigatórios em cada um (FR-005 vs. FR-018)? [Consistency, Spec §FR-005, §FR-018]
- [x] CHK027 - Está especificado o comportamento de navegação quando o visitante acessa uma URL de projeto inexistente ou removida? [Edge Case, Gap]

## Estados vazios e erros

- [x] CHK028 - O requisito de "não exibir placeholders vazios" quando há poucos projetos (Edge Cases) define o comportamento mínimo esperado da seção nesse cenário, além do que não fazer? [Completeness, Spec §Edge Cases]
- [x] CHK029 - FR-025 exige "mensagens claras" para conteúdo ausente ou links indisponíveis, mas especifica o conteúdo mínimo dessas mensagens (ex.: linguagem, tom, se orienta o visitante a uma ação alternativa)? [Clarity, Spec §FR-025]
- [x] CHK030 - Os requisitos definem estado de carregamento (loading) para qualquer conteúdo assíncrono, ou assume-se que todo o conteúdo é estático? [Gap]

## Critérios de aceite verificáveis

- [x] CHK031 - SC-001 ("10 segundos de leitura") define como esse tempo seria observado/medido, ou é uma meta sem método de verificação associável? [Measurability, Spec §SC-001]
- [x] CHK032 - Cada Success Criterion possui rastreabilidade para ao menos um Functional Requirement e um Acceptance Scenario correspondente, sem lacunas? [Traceability]
- [x] CHK033 - Os Acceptance Scenarios de todas as User Stories cobrem tanto o caminho primário quanto ao menos um caminho alternativo/erro, ou alguns cobrem apenas o caminho feliz? [Coverage, Spec §User Scenarios]

## Distinção entre MVP e funcionalidades futuras

- [x] CHK034 - A lista de itens "fora do escopo" está vinculada a alguma indicação de intenção futura (ex.: candidato a versão posterior) versus exclusão permanente, ou trata tudo com o mesmo peso? [Clarity, Spec §Assumptions]
- [x] CHK035 - Existe algum requisito funcional cuja redação dependa implicitamente de uma funcionalidade fora de escopo (ex.: menção a "curadoria" de projetos sem mecanismo definido), criando uma inconsistência entre escopo declarado e requisito? [Conflict, Spec §Assumptions]

## Ausência de decisões técnicas prematuras

- [x] CHK036 - Os requisitos funcionais descrevem capacidades e resultados observáveis, sem prescrever linguagem, framework, banco de dados ou provedor de hospedagem? [Consistency, Spec §Requirements]
- [x] CHK037 - Os Success Criteria permanecem tecnologicamente agnósticos (sem menção a tempos de resposta de API, cache, ou métricas de infraestrutura), conforme exigido pela diretriz da especificação? [Consistency, Spec §Success Criteria]

## Notes

- Itens marcados como [Gap] indicam ausência de requisito, não necessariamente um erro — cada um deve ser
  avaliado e, se aplicável, incorporado ao spec.md ou explicitamente registrado como decisão adiada antes do `/speckit-plan`.
- Itens sem [Gap] apontam requisitos existentes cuja redação pode precisar de reforço de clareza/mensurabilidade.
