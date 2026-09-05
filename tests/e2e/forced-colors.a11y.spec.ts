import { expect, test } from "@playwright/test";

// O roadmap fica fora: registra intenção, não oferece ação primária. Sua
// sobrevivência a forced-colors é coberta pelo caso de estrutura abaixo.
const rotasComAcaoPrimaria = ["/", "/projetos/plataforma-portfolio", "/rota-inexistente"];

for (const route of rotasComAcaoPrimaria) {
  test(`@a11y ${route} preserva estrutura e foco em forced-colors`, async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto(route);

    expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
    await expect(page.locator("body")).toHaveCSS("background-image", "none");

    const primaryAction = page.locator(".button--primary").first();
    await expect(primaryAction).toBeVisible();

    const primaryStyles = await primaryAction.evaluate((element) => {
      const styles = getComputedStyle(element);

      return {
        backgroundColor: styles.backgroundColor,
        borderStyle: styles.borderStyle,
        borderWidth: Number.parseFloat(styles.borderWidth),
        color: styles.color,
        forcedColorAdjust: styles.forcedColorAdjust,
      };
    });

    expect(primaryStyles.forcedColorAdjust).toBe("none");
    expect(primaryStyles.borderStyle).not.toBe("none");
    expect(primaryStyles.borderWidth).toBeGreaterThanOrEqual(1);
    expect(primaryStyles.color).not.toBe(primaryStyles.backgroundColor);

    await primaryAction.focus();
    await expect(primaryAction).toBeFocused();

    const focusStyles = await primaryAction.evaluate((element) => {
      const styles = getComputedStyle(element);

      return {
        outlineStyle: styles.outlineStyle,
        outlineWidth: Number.parseFloat(styles.outlineWidth),
      };
    });

    expect(focusStyles.outlineStyle).toBe("solid");
    expect(focusStyles.outlineWidth).toBeGreaterThanOrEqual(3);
  });
}

test("@a11y /roadmap preserva estrutura e foco em forced-colors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/roadmap");

  expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
  await expect(page.locator("body")).toHaveCSS("background-image", "none");

  // A moldura tracejada é o que separa uma entrada de roadmap do fundo; sem
  // cor de fundo em forced-colors ela é o único delimitador restante.
  const bordas = await page.locator(".roadmap-entry").evaluateAll((elements) =>
    elements.map((element) => {
      const styles = getComputedStyle(element);
      return {
        borderStyle: styles.borderStyle,
        borderWidth: Number.parseFloat(styles.borderWidth),
      };
    }),
  );
  expect(bordas.length).toBeGreaterThan(0);
  expect(bordas.every(({ borderStyle }) => borderStyle !== "none")).toBe(true);
  expect(bordas.every(({ borderWidth }) => borderWidth >= 1)).toBe(true);

  const linkDeSaida = page.getByRole("link", { name: "consulte as fichas de projeto" });
  await linkDeSaida.focus();
  await expect(linkDeSaida).toBeFocused();

  const focusStyles = await linkDeSaida.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      outlineStyle: styles.outlineStyle,
      outlineWidth: Number.parseFloat(styles.outlineWidth),
    };
  });

  expect(focusStyles.outlineStyle).toBe("solid");
  expect(focusStyles.outlineWidth).toBeGreaterThanOrEqual(3);
});

test("@a11y navegação atual e estados continuam distinguíveis em forced-colors", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/projetos");

  const currentNavigationItem = page.locator('.site-nav a[aria-current="page"]');
  await expect(currentNavigationItem).toHaveCSS("text-decoration-line", /underline/);

  await page.locator("main").evaluate((main) => {
    const fixture = document.createElement("div");
    fixture.dataset.testid = "forced-colors-status-fixture";

    for (const [modifier, label] of [
      ["concluído", "Concluído"],
      ["em-andamento", "Em andamento"],
      ["pausado", "Pausado"],
      ["arquivado", "Arquivado"],
    ]) {
      const badge = document.createElement("span");
      badge.className = `project-status-badge project-status-badge--${modifier}`;
      badge.textContent = label;
      fixture.append(badge);
    }

    main.append(fixture);
  });

  const badges = page.getByTestId("forced-colors-status-fixture").locator(".project-status-badge");
  await expect(badges).toHaveCount(4);

  const statusCues = await badges.evaluateAll((elements) =>
    elements.map((element) => {
      const styles = getComputedStyle(element);
      // Os glifos usam `content: "X" / ""` — o alternativo vazio os mantém fora
      // do nome acessível. O valor computado traz as duas partes, então o
      // marcador visível é o que vem antes da barra.
      const rawContent = getComputedStyle(element, "::before").content;
      const marker = rawContent.split("/")[0].replaceAll('"', "").trim();
      const alternativeText = rawContent.includes("/")
        ? rawContent.split("/").slice(1).join("/").replaceAll('"', "").trim()
        : null;

      return {
        borderStyle: styles.borderStyle,
        forcedColorAdjust: styles.forcedColorAdjust,
        marker,
        alternativeText,
      };
    }),
  );

  expect(new Set(statusCues.map(({ marker }) => marker))).toEqual(new Set(["✓", "▶", "‖", "▣"]));
  // O glifo é sinal visual, não conteúdo: nenhum deles pode entrar no nome acessível.
  expect(statusCues.every(({ alternativeText }) => alternativeText === "")).toBe(true);
  expect(statusCues.every(({ borderStyle }) => borderStyle !== "none")).toBe(true);
  expect(statusCues.every(({ forcedColorAdjust }) => forcedColorAdjust === "none")).toBe(true);
});
