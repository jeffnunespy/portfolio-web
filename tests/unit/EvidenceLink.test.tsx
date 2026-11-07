import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EvidenceLink from "../../components/project/EvidenceLink";
import { EMAIL_PLACEHOLDER } from "../../lib/labels";

describe("EvidenceLink", () => {
  describe.each([
    { estado: "público", linkRepositorio: "https://github.com/example/projeto" },
    { estado: "privado", linkRepositorio: "privado" },
    { estado: "ausente", linkRepositorio: undefined },
  ])("AUD03-002: repositório $estado", ({ estado, linkRepositorio }) => {
    it.each([false, true])("preserva aviso e ações com demonstração=%s", (temDemo) => {
      render(
        <EvidenceLink
          contatoEmail="contato@example.com"
          linkRepositorio={linkRepositorio}
          linkDemonstracao={temDemo ? "https://demo.example.com" : undefined}
          linkGithub="https://github.com/example"
        />,
      );

      const demonstracoes = screen.queryAllByRole("link", { name: "Abrir demonstração" });
      expect(demonstracoes).toHaveLength(temDemo ? 1 : 0);
      if (temDemo) {
        expect(demonstracoes[0]).toHaveAttribute("href", "https://demo.example.com");
      }

      const codigo = screen.queryAllByRole("link", { name: "Ver código-fonte" });
      expect(codigo).toHaveLength(estado === "público" ? 1 : 0);
      if (estado === "público") {
        expect(codigo[0]).toHaveAttribute("href", linkRepositorio);
      }

      expect(screen.queryAllByText("Código não disponível publicamente.")).toHaveLength(
        estado === "ausente" ? 1 : 0,
      );
      expect(screen.queryAllByText(/O código-fonte deste projeto é privado/)).toHaveLength(
        estado === "privado" ? 1 : 0,
      );
      const acesso = screen.queryAllByRole("link", { name: "Solicitar acesso ao código" });
      expect(acesso).toHaveLength(estado === "privado" ? 1 : 0);
      if (estado === "privado") {
        expect(acesso[0]).toHaveAttribute(
          "href",
          "mailto:contato@example.com?subject=Acesso ao código do projeto",
        );
      }

      expect(screen.queryAllByRole("link", { name: "Ver perfil no GitHub" })).toHaveLength(
        estado === "ausente" && !temDemo ? 1 : 0,
      );
      for (const link of screen.queryAllByRole("link")) {
        if (link.getAttribute("href")?.startsWith("https:")) {
          expect(link).toHaveAttribute("target", "_blank");
          expect(link).toHaveAttribute("rel", "noopener noreferrer");
        }
      }
    });
  });

  it.each([false, true])(
    "preserva a alternativa de contato privado sem e-mail configurado, demonstração=%s",
    (temDemo) => {
      render(
        <EvidenceLink
          contatoEmail={EMAIL_PLACEHOLDER}
          linkRepositorio="privado"
          linkDemonstracao={temDemo ? "https://demo.example.com" : undefined}
        />,
      );

      expect(screen.getByText(/O código-fonte deste projeto é privado/)).toBeInTheDocument();
      expect(
        screen.getByText("Solicitações pelo LinkedIn, no rodapé desta página"),
      ).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Solicitar acesso ao código" })).toBeNull();
    },
  );

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
