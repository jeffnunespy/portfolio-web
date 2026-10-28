import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Cada suíte (funcional, a11y ou completo, via E2E_GRUPO nos scripts) grava
// relatório e artefatos em diretório próprio: a segunda execução não apaga a
// evidência da primeira.
const grupo = process.env.E2E_GRUPO ?? "completo";

// Origem conhecida para validar canonical, Open Graph, sitemap e robots sem
// depender do domínio definitivo. Ela entra no HTML em tempo de build, então
// o build servido aos testes precisa ter usado o mesmo valor (o CI a define
// no job inteiro).
process.env.NEXT_PUBLIC_SITE_URL ??= "https://portfolio.example";

// No CI o build é um gate próprio, executado sobre o mesmo checkout logo antes
// dos E2E; E2E_BUILD_EXISTENTE=1 serve esse artefato em vez de recompilar.
const usarBuildExistente = process.env.E2E_BUILD_EXISTENTE === "1";
if (usarBuildExistente && !existsSync(".next/BUILD_ID")) {
  throw new Error("E2E_BUILD_EXISTENTE=1 exige um build prévio: rode `npm run build` antes.");
}

// Servidor já aberto na porta só é reaproveitado por opt-in explícito e nunca
// no CI: a versão servida não é verificada, então essa execução não vale como
// aceite. Sem o opt-in, porta ocupada faz a execução falhar.
const reutilizarServidor = !process.env.CI && process.env.E2E_REUTILIZAR_SERVIDOR === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: `test-results/${grupo}`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { outputFolder: `playwright-report/${grupo}` }]],
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: usarBuildExistente
      ? "PORT=3001 npm run start"
      : "npm run build && PORT=3001 npm run start",
    url: "http://localhost:3001",
    reuseExistingServer: reutilizarServidor,
    timeout: usarBuildExistente ? 60_000 : 180_000,
  },
});
