import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EvidenceLink from "../../components/project/EvidenceLink";

describe("EvidenceLink", () => {
  it("oferece acesso direto quando o repositório é público", () => {
    render(
      <EvidenceLink
        contatoEmail="contato@example.com"
        linkRepositorio="https://github.com/example/projeto"
        linkGithub="https://github.com/example"
      />,
    );

    expect(screen.getByRole("link", { name: "Ver código-fonte" })).toHaveAttribute(
      "href",
      "https://github.com/example/projeto",
    );
    expect(screen.queryByRole("link", { name: "Solicitar acesso ao código" })).toBeNull();
    expect(screen.queryByText(/O código-fonte deste projeto é privado/)).toBeNull();
  });

  it("preserva o pedido de acesso para outros repositórios privados", () => {
    render(
      <EvidenceLink
        contatoEmail="contato@example.com"
        linkRepositorio="privado"
        linkGithub="https://github.com/example"
      />,
    );

    expect(screen.getByText(/O código-fonte deste projeto é privado/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitar acesso ao código" })).toHaveAttribute(
      "href",
      "mailto:contato@example.com?subject=Acesso ao código do projeto",
    );
    expect(screen.queryByRole("link", { name: "Ver código-fonte" })).toBeNull();
  });
});
