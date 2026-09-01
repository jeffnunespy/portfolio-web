import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "../../app/error";

describe("ErrorPage", () => {
  it("explica a falha e oferece recuperação", () => {
    const retry = vi.fn();

    render(<ErrorPage error={new Error("falha de teste")} retry={retry} />);

    expect(
      screen.getByRole("heading", { name: "Não foi possível exibir esta página" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Tente carregar o conteúdo novamente");
    expect(screen.getByRole("link", { name: "Voltar para a página inicial" })).toHaveAttribute(
      "href",
      "/",
    );

    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
