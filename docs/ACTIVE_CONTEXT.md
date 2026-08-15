# Active Context

## Feature

Experiência Pública Inicial do Portfólio (`001-experiencia-publica-inicial`).

## Status

Convergência técnica concluída para as fases 1–7 e itens técnicos da Fase 8. A publicação continua
bloqueada por conteúdo profissional que precisa ser confirmado pelo proprietário e por validações
manuais/de preview.

## Entregues

- Runtime Node.js 24, Next.js 16.3.1, React 19, ESLint flat config e CI com Dependabot.
- Rotas públicas estáticas de home, projetos, detalhe, Sobre, currículo e ambos os estados 404.
- Validação de conteúdo em build para tipos, campos obrigatórios, enums, slugs, URLs HTTPS, e-mail,
  imagens publicadas, evidências de competência e limite de seis destaques.
- Cobertura Vitest de validação e componentes; cobertura Playwright de fluxos, links globais,
  metadados, responsividade, teclado e axe-core em todas as rotas públicas.
- Metadados próprios para os dois estados 404.

## Validação executada em 2026-08-15

- `node --version` → `v24.19.0`
- `npm ci` → concluído
- `npm audit --omit=dev --audit-level=high` → 0 vulnerabilidades
- `npm exec prettier -- --check .` → concluído
- `npm run lint` → concluído
- `npm run typecheck` → concluído
- `npm test -- --run` → 26 testes aprovados
- `npm run build` → Turbopack concluído; rotas estáticas e SSG geradas
- `npm run test:e2e` → 36 testes Playwright aprovados

## Pendências e riscos conhecidos

- `content/profile.json` ainda contém biografia, GitHub, LinkedIn e e-mail placeholder. Não publicar
  enquanto os dados reais não forem fornecidos e revisados.
- Os estudos de caso e `public/curriculo.pdf` exigem confirmação do proprietário antes de serem
  declarados conteúdo profissional publicado.
- O asset-fonte `original-8696facb39b0641248efdeb31bc641db.webp` não está no workspace; portanto
  `assets/portfolio-source.webp` não pode ser criado sem receber o arquivo original.
- Faltam as verificações manuais de teclado completo, zoom, leitor de tela e preview/canário.
- `npm ci` emite avisos de peer dependency porque plugins transitivos do `eslint-config-next` ainda
  declaram suporte até ESLint 9; o lint em ESLint 10.8.1 passa. Não foi feita troca de versões fora
  do plano aprovado.

## Próximos passos

1. Fornecer e revisar perfil, links, e-mail, currículo, conteúdo/evidências reais dos projetos e o
   asset-fonte ausente.
2. Atualizar os arquivos de conteúdo sem introduzir métricas ou experiências não verificadas.
3. Executar e registrar as inspeções manuais de acessibilidade e o preview/canário antes da promoção.
