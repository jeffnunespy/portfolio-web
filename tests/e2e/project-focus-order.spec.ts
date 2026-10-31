import { test, expect } from "@playwright/test";

const routes = ["/", "/projetos", "/projetos/plataforma-portfolio"];

for (const width of [320, 390, 768, 1024, 1280]) {
  for (const javaScriptEnabled of [true, false]) {
    for (const route of routes) {
      test(`FR-021 ${route} ${width}px JS=${javaScriptEnabled}`, async ({ browser }, info) => {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          javaScriptEnabled,
        });
        const page = await context.newPage();
        try {
          await page.goto(route);
          await expect
            .poll(() =>
              page.evaluate(
                () =>
                  Array.from(document.fonts).some((f) => f.status === "loaded") &&
                  Array.from(document.fonts).every((f) => f.status !== "loading"),
              ),
            )
            .toBe(true);
          const area = route.endsWith("plataforma-portfolio")
            ? page.locator(".project-detail__visual-index")
            : page.getByTestId("project-card").filter({
                has: page.getByRole("heading", { name: "Plataforma de Portfólio", exact: true }),
              });
          const stops = area.locator("a[href], summary");
          const geometry = await stops.evaluateAll((elements) =>
            elements.map((element) => {
              const box = element.getBoundingClientRect();
              return {
                label: element.textContent?.trim(),
                x: box.x + scrollX,
                y: box.y + scrollY,
                width: box.width,
                height: box.height,
              };
            }),
          );
          await info.attach("ordem-dom-visual", {
            body: JSON.stringify({ route, width, javaScriptEnabled, geometry }, null, 2),
            contentType: "application/json",
          });
          for (let i = 1; i < geometry.length; i++) {
            expect(
              geometry[i].y,
              `${geometry[i - 1].label} → ${geometry[i].label}`,
            ).toBeGreaterThanOrEqual(geometry[i - 1].y);
            if (geometry[i].y === geometry[i - 1].y)
              expect(geometry[i].x).toBeGreaterThanOrEqual(geometry[i - 1].x);
          }
          // Enter the group through real Tab traversal, without setting focus on its links.
          for (let i = 0; i < 80; i++) {
            await page.keyboard.press("Tab");
            if (await stops.first().evaluate((element) => element === document.activeElement))
              break;
          }
          await expect(stops.first()).toBeFocused();
          for (let i = 0; i < geometry.length; i++) {
            await expect(stops.nth(i)).toBeFocused();
            expect(await stops.nth(i).evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe(
              "none",
            );
            if (i < geometry.length - 1) await page.keyboard.press("Tab");
          }
          for (let i = geometry.length - 2; i >= 0; i--) {
            await page.keyboard.press("Shift+Tab");
            await expect(stops.nth(i)).toBeFocused();
          }
          await page.keyboard.press("Enter");
          await expect(page.locator("h2#contexto")).toBeFocused();
          await expect(page.locator("h2#contexto")).toBeInViewport();
          expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          ).toBe(true);
        } finally {
          await context.close();
        }
      });
    }
  }
}
