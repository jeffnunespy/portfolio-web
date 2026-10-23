/**
 * Etapas de verificação da integração contínua, na ordem configurada em
 * `.github/workflows/ci.yml`. A home as apresenta como evidência da
 * plataforma; `tests/unit/ci.test.ts` falha se a ordem ou os comandos
 * divergirem do workflow, para a ilustração não virar afirmação sem lastro.
 */
export const ETAPAS_INTEGRACAO_CONTINUA = [
  { rotulo: "audit", comando: "npm audit --omit=dev --audit-level=high" },
  { rotulo: "format", comando: "npm run format:check" },
  { rotulo: "lint", comando: "npm run lint" },
  { rotulo: "typecheck", comando: "npm run typecheck" },
  { rotulo: "vitest", comando: "npm test -- --run" },
  { rotulo: "build", comando: "npm run build" },
  { rotulo: "e2e", comando: "npm run test:e2e:functional" },
  { rotulo: "axe", comando: "npm run test:e2e:a11y" },
] as const;
