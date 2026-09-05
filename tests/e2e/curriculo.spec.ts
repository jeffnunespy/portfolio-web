import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

// FR-017 exige um meio de contato em toda página pública. O rodapé expõe o
// mailto quando há um e-mail real em content/profile.json; enquanto o valor for
// o placeholder, ele cai para o LinkedIn — contato real e verificável — em vez
// de fabricar um endereço. A página de currículo, que exibiria o endereço em si,
// declara o estado explicitamente e não oferece ação.
const EMAIL_PLACEHOLDER = "SEU-EMAIL@exemplo.com";

const perfil = JSON.parse(
  readFileSync(path.join(process.cwd(), "content", "profile.json"), "utf8"),
) as {
  nome: string;
  contato: { valor: string };
  formacao: { periodo: string; titulo: string; descricao: string }[];
  linkLinkedin: string;
  tituloPosicionamento: string;
  trajetoria: { periodo: string; titulo: string; descricao: string }[];
  linkCurriculo?: string;
};

const emailConfigurado = perfil.contato.valor !== EMAIL_PLACEHOLDER;
const temPdf = typeof perfil.linkCurriculo === "string" && perfil.linkCurriculo.length > 0;

// Marcadores de template que já chegaram à produção dentro do PDF uma vez.
// O teste anterior só verificava status e content-type, então um arquivo de
// modelo passava como currículo válido.
const MARCADORES_DE_TEMPLATE = ["[SUBSTITUIR]", EMAIL_PLACEHOLDER, "placeholder"];

for (const route of [
  "/",
  "/projetos",
  "/projetos/plataforma-portfolio",
  "/roadmap",
  "/sobre",
  "/curriculo",
  "/rota-inexistente",
  "/projetos/slug-inexistente",
]) {
  test(`US3 - currículo, redes e contato acessíveis em ${route}`, async ({ page }) => {
    await page.goto(route);

    const header = page.getByRole("banner");
    const signature = header.getByRole("link", { name: `${perfil.nome} — Início` });
    await expect(signature).toBeVisible();
    await expect(signature).toHaveAttribute("href", "/");

    const signatureBox = await signature.boundingBox();
    expect(signatureBox).not.toBeNull();
    expect(signatureBox!.y + signatureBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height);

    await expect(header.getByRole("link", { name: "Currículo" })).toHaveAttribute(
      "href",
      "/curriculo",
    );

    const footer = page.getByRole("contentinfo");
    const contact = footer.getByRole("region", { name: "Contato e perfis" });
    await expect(contact.getByRole("link", { name: "Ver GitHub" })).toHaveAttribute(
      "href",
      /^https:\/\//,
    );
    await expect(contact.getByRole("link", { name: "Falar pelo LinkedIn" })).toHaveAttribute(
      "href",
      /^https:\/\//,
    );

    if (emailConfigurado) {
      await expect(contact.getByRole("link", { name: "Contato", exact: true })).toHaveAttribute(
        "href",
        /^mailto:/,
      );
    } else {
      await expect(contact.getByText("E-mail em configuração")).toBeVisible();
      await expect(footer.locator('a[href^="mailto:"]')).toHaveCount(0);
    }
  });
}

test("US3 - página de currículo é visualizável e oferece PDF para download", async ({ page }) => {
  await page.goto("/curriculo");

  await expect(page.getByRole("heading", { level: 1, name: perfil.nome })).toBeVisible();
  await expect(page.getByText(perfil.tituloPosicionamento, { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Formação" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Trajetória técnica" })).toBeVisible();

  for (const item of [...perfil.formacao, ...perfil.trajetoria]) {
    await expect(page.getByText(item.periodo, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: item.titulo })).toBeVisible();
    await expect(page.getByText(item.descricao, { exact: true })).toBeVisible();
  }

  const downloadLink = page.getByRole("link", { name: "Baixar currículo em PDF" });

  if (!temPdf) {
    // Sem PDF definitivo o site não oferece download algum: a página em HTML
    // é o currículo, e um arquivo divergente do conteúdo validado circularia
    // fora do alcance da validação de build.
    await expect(downloadLink).toHaveCount(0);
    await expect(
      page.getByText(
        "PDF final ainda não disponível. O currículo completo pode ser consultado nesta página.",
      ),
    ).toBeVisible();
    return;
  }

  await expect(downloadLink).toHaveAttribute("href", perfil.linkCurriculo!);
  await expect(downloadLink).toHaveAttribute("download");

  const pdfResponse = await page.request.get(perfil.linkCurriculo!);
  expect(pdfResponse.ok()).toBe(true);
  expect(pdfResponse.headers()["content-type"]).toContain("application/pdf");

  // O conteúdo importa, não só o status: um PDF de modelo é pior que nenhum.
  const texto = (await pdfResponse.body()).toString("latin1");
  for (const marcador of MARCADORES_DE_TEMPLATE) {
    expect(texto.toLowerCase()).not.toContain(marcador.toLowerCase());
  }
});

test("US3 - o meio de contato do currículo acompanha o estado do perfil", async ({ page }) => {
  await page.goto("/curriculo");

  const contatos = page.locator(".resume-contact");

  if (emailConfigurado) {
    await expect(contatos.getByRole("link", { name: perfil.contato.valor })).toHaveAttribute(
      "href",
      `mailto:${perfil.contato.valor}`,
    );
  } else {
    await expect(contatos.getByText("E-mail em configuração")).toBeVisible();
    await expect(contatos.locator('a[href^="mailto:"]')).toHaveCount(0);
  }
});
