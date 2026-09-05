import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

describe("Header", () => {
  it("mantém a navegação principal na ordem pública definida", () => {
    render(<Header nome="Pessoa Exemplo" />);

    expect(screen.getByRole("link", { name: "Pessoa Exemplo — Início" })).toHaveAttribute(
      "href",
      "/",
    );

    const navigation = screen.getByRole("navigation", { name: "Navegação principal" });
    expect(
      within(navigation)
        .getAllByRole("link")
        .map((link) => link.getAttribute("aria-label")),
    ).toEqual(["Início", "Projetos", "Roadmap", "Sobre", "Currículo"]);
  });
});

describe("Footer", () => {
  it("oferece currículo, perfis e contato direto", () => {
    render(
      <Footer
        nome="Pessoa Exemplo"
        contatoEmail="contato@portfolio.dev"
        linkGithub="https://github.com/portfolio"
        linkLinkedin="https://linkedin.com/in/portfolio"
      />,
    );

    const navigation = screen.getByRole("navigation", { name: "Links secundários" });
    expect(within(navigation).getByRole("link", { name: "Currículo" })).toHaveAttribute(
      "href",
      "/curriculo",
    );
    const contact = screen.getByRole("region", { name: "Contato e perfis" });
    expect(within(contact).getByRole("link", { name: "Ver GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/portfolio",
    );
    expect(within(contact).getByRole("link", { name: "Falar pelo LinkedIn" })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/portfolio",
    );
    expect(within(contact).getByRole("link", { name: "Contato" })).toHaveAttribute(
      "href",
      "mailto:contato@portfolio.dev",
    );
  });
});
