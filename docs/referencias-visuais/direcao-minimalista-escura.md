# Direção oficial — Minimalismo escuro

**Status: visual oficial aprovado pelo proprietário em 2026-10-23.**

## Decisão e referência

O proprietário aprovou a versão final com a mensagem **“aprovado como novo visual oficial do
projeto”**, após definir **“sem prévia”** para Nana Silva. Esta decisão substitui a direção
**Levantamento e sondagem** como referência normativa do portfólio.

Fonte executável:
[`prototipo-minimalista-escuro.html`](prototipo-minimalista-escuro.html).
Sistema global: [`DESIGN.md`](../../DESIGN.md).
Composição e validação da referência:
[`prototipo-minimalista-escuro.md`](prototipo-minimalista-escuro.md).

O novo visual foi construído e verificado no protótipo HTML. Em 2026-10-24, a execução
integrada de T102–T105 aplica a direção às rotas Next.js, conforme a fase 17 de
[`tasks.md`](../../specs/001-experiencia-publica-inicial/tasks.md) e as decisões em
[`plan.md`](../../specs/001-experiencia-publica-inicial/plan.md). A validação da aplicação é
registrada separadamente em [`correções do audit`](../audits/impeccable-2026-10-24-correcoes.md).
A aprovação original e esta migração local não registram commit, push, deploy ou publicação.

## Identidade aprovada

- Tema escuro esverdeado, texto marfim, apoio neutro, filetes finos e laranja discreto.
- Geologica leve para o nome, os títulos e a leitura; hierarquia construída com tamanho,
  peso e espaço. Martian Mono deixa de ser compromisso obrigatório de identidade.
- Assinatura “Jefferson / Nunes.”, com recuo da segunda linha e ponto laranja recorrente.
  O nome acessível permanece “Jefferson Nunes”.
- Composição aberta, assimetria discreta entre projetos e separação por espaço e filetes.
- Decisões em primeira pessoa apoiadas em fontes reais, com limitações explícitas.
- Nana Silva em apresentação textual, com tecnologias, estado de validação, link e decisões;
  sem imagem, captura, legenda de captura ou link para PNG.
- Diagrama semântico simplificado da plataforma: conteúdo JSON → validação → páginas
  estáticas. Ícones e setas são SVG geométrico; o texto continua HTML acessível.
- Interações simples, âncoras, links e divulgações nativas. Apenas a transição de cor de 160ms
  observada no protótipo; movimento reduzido remove essa transição.
- A nova direção não usa terreno topográfico, isolinhas, paralaxe, varredura, lente ou
  animações de entrada/rolagem como linguagem do site.

Os valores exatos e as regras reutilizáveis vivem em `DESIGN.md`. A composição específica da
home vive no documento e no brief da superfície; não determina a organização de todas as rotas.

## Conteúdo e contratos preservados

A aprovação é visual. Perfil e projetos da aplicação continuam vindo de `content/` por
`lib/content.ts`, com a validação de build e as evidências atuais. O posicionamento
“Desenvolvedor Web em Formação” permanece. Nana Silva continua em validação, com repositório
privado e limites registrados.

**Acervo e Intervalo são exemplos fictícios exclusivos do protótipo.** Não serão copiados
para `content/`, competências, fichas ou projetos em destaque. A implementação deve preservar
a separação entre projetos reais e `/roadmap`, além das páginas de estudo de caso, currículo
HTML/PDF, metadados, links e estados previstos na especificação.

O menu por âncoras do exemplo não substitui as rotas e a navegação obrigatórias da aplicação.
A home deve conservar o posicionamento e as competências por área exigidos em FR-001–FR-003
e SC-001, adaptando a composição ao contrato funcional. A apresentação textual de Nana Silva
é a exceção visual explícita de **FR-006a** à exibição de imagem exigida por FR-006.
Os demais campos e ações permanecem obrigatórios; a imagem de Nana continua no modelo,
no disco e nos metadados, sem ser exibida como prévia na interface. Os demais projetos
continuam sujeitos à regra geral de exibição de FR-006.

## Validação e limites

O HTML final sem prévia foi conferido em 320, 390, 768 e 1280px: sem transbordamento,
erros de página ou violações axe WCAG 2.1 A/AA, incluindo os detalhes abertos em desktop e
celular. Abertura offline por `file://`, teclado, movimento reduzido e cores forçadas foram
verificados. Prettier, `git diff --check` e detector nativo passaram.

A revisão independente final retornou **`ship`**, sem correções materiais. As evidências
estão em `.impeccable/review/prototipo-minimalista-sem-previa/`. Esses resultados pertencem
ao protótipo; os gates da aplicação foram repetidos na migração local. T055, relativo às
inspeções humanas/de publicação, continua pendente.

## Histórico

O [registro de Levantamento e sondagem](candidato-levantamento-sondagem.md) e seu protótipo
permanecem como histórico. O sistema aplicado às rotas antes desta nova migração está em
[`design-levantamento-sondagem.md`](design-levantamento-sondagem.md). Não usar as curvas e
animações anteriores como requisito de novas superfícies.
