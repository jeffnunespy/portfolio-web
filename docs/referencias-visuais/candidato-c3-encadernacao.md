# A considerar — C3 · Encadernação interativa

## Decisão do proprietário

Em 2026-10-09, ao revisar as direções não escolhidas, o proprietário pediu para manter a **C3 — Encadernação interativa** como alternativa **a considerar**. Ela fica abaixo do candidato principal, [Levantamento e sondagem](candidato-levantamento-sondagem.md). Isso é preferência registrada, não aprovação: o layout não está aprovado, o frontend não deve ser implementado e o `DESIGN.md` não deve ser substituído.

Protótipo navegável: [c3-encadernacao-interativa.html](c3-encadernacao-interativa.html). É um HTML autocontido; só as fontes vêm do Google Fonts.

## Versão clara mantida — C · Encadernação exposta

Na mesma data, ao revisar as referências restantes, o proprietário pediu para manter também a **C — Encadernação exposta**, a versão original e clara da mesma família, como algo a considerar. Valem os mesmos limites: não é aprovação nem autorização para implementar.

Protótipo navegável: [c-encadernacao-exposta.html](c-encadernacao-exposta.html). Usa fundo linho claro `#e2dfd8`, folha `#f3f1ec`, capa `#5e4f3c` e as mesmas fontes, Commissioner e Gelasio. A lombada fica fixa na lateral; o roadmap aparece como "Cadernos ainda não costurados". Como o pedido inicial era de tema escuro, a C serve de referência para a estrutura da metáfora, e a C3 para a versão escura e as interações.

## Ideia central

O portfólio é um livro encadernado. Cada projeto implementado é um caderno costurado à lombada. As competências aparecem "costuradas" aos cadernos que as demonstram. O roadmap são folhas soltas, fora da lombada até existirem como código. A metáfora traduz a validação que quebra o build: competência sem projeto é um elo rompido.

## Linguagem visual

- **Cores:** fundo linho escuro `#121110`, folha `#191714`, caderno `#201d19` e cartão `#2a2118`; texto `#ece6da`.
  - Linha de costura `#e6dcc6`.
  - Ruptura `#e39a7f`, reservada ao estado de falha.
- **Tipografia:** Commissioner (sem serifa) no texto, Gelasio (serifa) em destaques e monoespaçada do sistema em rótulos e código.

## Interações de assinatura

- **Navegação lateral em forma de lombada:** pontos de costura em SVG. A seção de roadmap aparece como costura solta.
- **Caderno 1, Plataforma de Portfólio:** furos de costura e animação de costura (`@keyframes sew`). Os detalhes do projeto se desdobram (`@keyframes unfold`).
- **Botão "Simular um elo rompido":** mostra a mensagem real de falha de validação (FR-024/SC-007) com uma competência hipotética. Avisa explicitamente que é simulação e que o conteúdo real passa na verificação.
- **Seção de competências:** cada área (Front-end, Engenharia de software, Qualidade, Operação) aparece costurada aos cadernos que a comprovam.

## Limites e decisões pendentes

- **Simulação de falha:** a mensagem simulada precisa continuar claramente marcada como simulação e usar competência hipotética. Nunca pode sugerir que o conteúdo real falha.
- **Coerência com o conteúdo:** competências e cadernos precisam vir do conteúdo real, nunca escritos fixos.
- **Celular:** falta validar a lombada lateral em telas estreitas, além de contraste, foco visível e `prefers-reduced-motion`.
- **Fontes:** no Next.js, usar `next/font` para servi-las pelo próprio site.
- **Fonte de verdade:** os requisitos em `specs/` e a constituição continuam valendo. Registrar divergências antes de implementar.

## Proveniência

Protótipos construídos em código numa exploração anterior com o skill Impeccable, a série "referências" em `.impeccable/mocks/`, fora do versionamento. A C3 e a C foram versionadas em `docs/referencias-visuais/` sem alterações de conteúdo; só a formatação foi ajustada pelo Prettier.
