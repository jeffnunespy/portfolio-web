import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { ETAPAS_INTEGRACAO_CONTINUA } from "../../lib/ci";

describe("etapas da integração contínua", () => {
  it("seguem os comandos e a ordem configurados no workflow", () => {
    const workflow = readFileSync(
      path.join(process.cwd(), ".github", "workflows", "ci.yml"),
      "utf8",
    );
    const comandosDoWorkflow = [...workflow.matchAll(/^\s*- run: (.+)$/gm)].map(([, comando]) =>
      comando.trim(),
    );
    const comandosApresentados = ETAPAS_INTEGRACAO_CONTINUA.map((etapa) => etapa.comando);

    // Instalação e preparo do navegador não são verificações e ficam de fora da home.
    expect(
      comandosDoWorkflow.filter((comando) =>
        (comandosApresentados as readonly string[]).includes(comando),
      ),
    ).toEqual(comandosApresentados);
  });
});
