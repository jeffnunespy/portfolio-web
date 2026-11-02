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

  it("privado e sem demonstração, oferece só o pedido de acesso, sem o perfil", () => {
    render(
      <EvidenceLink
        contatoEmail="contato@example.com"
        linkRepositorio="privado"
        linkGithub="https://github.com/example"
      />,
    );

    expect(screen.queryByRole("link", { name: /perfil|GitHub/ })).toBeNull();
    expect(screen.queryByRole("link", { name: /público|código-fonte/ })).toBeNull();
    expect(screen.getByRole("link", { name: "Solicitar acesso ao código" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("sem repositório nem demonstração, oferece o perfil nomeado como perfil e não como código", () => {
    render(
      <EvidenceLink contatoEmail="contato@example.com" linkGithub="https://github.com/example" />,
    );

    const perfil = screen.getByRole("link", { name: "Ver perfil no GitHub" });
    expect(perfil).toHaveAttribute("href", "https://github.com/example");
    expect(perfil).toHaveAttribute("target", "_blank");
    expect(perfil).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("Código não disponível publicamente.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /público|código-fonte|acesso/ })).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("com demonstração, o repositório privado não traz o perfil como destino", () => {
    render(
      <EvidenceLink
        contatoEmail="contato@example.com"
        linkDemonstracao="https://demo.example.com"
        linkRepositorio="privado"
        linkGithub="https://github.com/example"
      />,
    );

    expect(screen.getByRole("link", { name: "Abrir demonstração" })).toHaveAttribute(
      "href",
      "https://demo.example.com",
    );
    expect(screen.queryByRole("link", { name: "Ver perfil no GitHub" })).toBeNull();
    expect(screen.getByRole("link", { name: "Solicitar acesso ao código" })).toBeInTheDocument();
  });
});
