// @vitest-environment node
import { ESLint } from "eslint";
import { describe, it, expect } from "vitest";

// eslint-plugin-react, eslint-plugin-jsx-a11y e eslint-plugin-import (via
// eslint-config-next) ainda não declaram ESLint 10 em peerDependencies. O
// projeto roda com ESLint 10 por exceção documentada em README.md; este teste
// garante que as regras desses plugins continuam carregando e reportando,
// para que uma quebra de compatibilidade não vire um lint silenciosamente vazio.
async function regrasReportadas(codigo: string, filePath: string): Promise<string[]> {
  const eslint = new ESLint({ cwd: process.cwd() });
  const [resultado] = await eslint.lintText(codigo, { filePath });
  expect(resultado.fatalErrorCount).toBe(0);
  return resultado.messages.map((mensagem) => mensagem.ruleId ?? "");
}

describe("plugins do eslint-config-next sob ESLint 10", () => {
  it("reportam violações de react e jsx-a11y", { timeout: 30_000 }, async () => {
    const regras = await regrasReportadas(
      `export default function Lista({ itens }: { itens: string[] }) {
  return (
    <ul>
      {itens.map((item) => <li>{item}</li>)}
      <img src="/x.png" />
      <div aria-inexistente="x" />
    </ul>
  );
}
`,
      "components/fixture-eslint.tsx",
    );

    expect(regras).toEqual(
      expect.arrayContaining(["react/jsx-key", "jsx-a11y/alt-text", "jsx-a11y/aria-props"]),
    );
  });

  it("reporta violação de import", { timeout: 30_000 }, async () => {
    const regras = await regrasReportadas(
      "export default { chave: 1 };\n",
      "lib/fixture-eslint.ts",
    );

    expect(regras).toContain("import/no-anonymous-default-export");
  });
});
