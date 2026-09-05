import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectImage from "../../components/project/ProjectImage";

describe("ProjectImage", () => {
  it("marca a imagem como decorativa, sem duplicar o título da ficha", () => {
    const { container } = render(<ProjectImage src="/imagem.svg" />);

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("alt", "");
    // alt="" tira a imagem da árvore de acessibilidade: nenhum papel img exposto.
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("substitui uma imagem com falha por um estado visual sem ruído para leitor de tela", () => {
    const { container } = render(<ProjectImage src="/imagem-indisponivel.svg" />);

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    fireEvent.error(img!);

    expect(screen.getByText("Imagem indisponível")).toBeInTheDocument();
    expect(screen.getByText("Imagem indisponível").closest("div")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("tenta carregar novamente quando a origem da imagem muda", () => {
    const { container, rerender } = render(<ProjectImage src="/primeira-imagem.svg" />);

    fireEvent.error(container.querySelector("img")!);
    rerender(<ProjectImage src="/segunda-imagem.svg" />);

    expect(container.querySelector("img")).toHaveAttribute("src", "/segunda-imagem.svg");
  });
});
