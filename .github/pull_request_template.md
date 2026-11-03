<!-- Processo: docs/audits/PROCESSO.md. Apague o que não se aplica; não deixe seção vazia. -->

## Problema

<!-- O que está errado ou falta, e para quem. Achado/tarefa de origem (ex.: AUD03-001, T055). -->

## Escopo

<!-- Arquivos e comportamentos alterados. O que fica de fora de propósito. -->

## Risco

Nível: <!-- 1, 2 ou 3 --> — <!-- por quê, pelo impacto potencial, não pelo tamanho -->

## Testes

<!-- Testes novos ou ajustados e o que cobrem. Controle negativo no nível 3. Comandos locais executados. -->

## Evidências

- Base: `<sha>` · Head: `<sha>`
- CI: <!-- link da execução do `quality`; o resumo traz commit, head, base e BUILD_ID -->
- Preview: <!-- URL e commit do deploy, ou "não se aplica" -->
- Reaproveitadas: <!-- evidência anterior e por que continua válida (PROCESSO.md, seção 4), ou "nenhuma" -->

## Ressalvas

<!-- Limitações e riscos residuais aceitos ou a aceitar. Teste instável, se houver. -->

## Parecer

<!-- Revisão independente: revisor, head avaliado, nível revisado, achados P0–P3. Nível 1: "dispensada" ou o parecer. -->

## Gates de merge

- [ ] `quality` verde no head atual
- [ ] Testes pertinentes executados
- [ ] Nenhum P0/P1 aberto sem decisão formal do proprietário
- [ ] Revisão independente (obrigatória nos níveis 2 e 3; adversarial no 3)
- [ ] Preview homologado conforme o nível
- [ ] Autorização expressa do proprietário para este PR e este head
