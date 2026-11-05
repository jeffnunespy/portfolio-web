import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProjectImage from "../../components/project/ProjectImage";

const description = { descriptionHref: "#contexto", descriptionLabel: "Ler descrição do projeto" };

describe("ProjectImage", () => {
  it("mantém somente a superfície decorativa fora da árvore acessível", () => {
    const { container } = render(<ProjectImage src="/imagem.svg" {...description} />);
    const surface = container.querySelector(".project-image__surface");
    expect(surface).toHaveAttribute("aria-hidden", "true");
    expect(surface).toHaveStyle({ backgroundImage: 'url("/imagem.svg")' });
    expect(container.querySelector("img")).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByRole("link", { name: description.descriptionLabel })).toHaveAttribute(
      "href",
      "#contexto",
    );
    expect(screen.getByText(/Se a prévia não aparecer/).closest("figcaption")).not.toHaveAttribute(
      "aria-hidden",
    );
  });

  it.each(["", "/imagem-inexistente.svg"])(
    "preserva orientação e ação sem classificar %s como erro",
    (src) => {
      const { container } = render(<ProjectImage src={src} {...description} />);
      expect(container.querySelector(".project-image__surface")).toBeInTheDocument();
      expect(screen.getByText(/Se a prévia não aparecer/)).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveAttribute("href", "#contexto");
      expect(screen.queryByText("Imagem indisponível")).toBeNull();
    },
  );

  it("atualiza A→B→A sem conservar falha de uma origem anterior", () => {
    const { container, rerender } = render(<ProjectImage src="/a.svg" {...description} />);
    rerender(<ProjectImage src="/b.svg" {...description} />);
    expect(container.querySelector(".project-image__surface")).toHaveStyle({
      backgroundImage: 'url("/b.svg")',
    });
    rerender(<ProjectImage src="/a.svg" {...description} />);
    expect(container.querySelector(".project-image__surface")).toHaveStyle({
      backgroundImage: 'url("/a.svg")',
    });
    expect(screen.queryByText("Imagem indisponível")).toBeNull();
  });

  it("entrega orientação e link no HTML do servidor, sem depender de evento ou script", () => {
    const html = renderToStaticMarkup(<ProjectImage src="/imagem.svg" {...description} />);
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect(doc.querySelector("figcaption")?.textContent).toContain("Se a prévia não aparecer");
    expect(doc.querySelector("a")?.getAttribute("href")).toBe("#contexto");
    expect(doc.querySelector("script")).toBeNull();
    expect(doc.querySelector("img")).toBeNull();
  });
});
