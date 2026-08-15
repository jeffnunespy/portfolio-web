import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

describe("Header", () => {
  it("mantém a navegação principal na ordem pública definida", () => {
    render(<Header />);

    const navigation = screen.getByRole("navigation", { name: "Navegação principal" });
    expect(
      within(navigation)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["Início", "Projetos", "Sobre", "Currículo"]);
  });
});

describe("Footer", () => {
  it("oferece currículo, perfis e contato direto", () => {
    render(
      <Footer
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
    expect(within(navigation).getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/portfolio",
    );
    expect(within(navigation).getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/portfolio",
    );
    expect(within(navigation).getByRole("link", { name: "Contato" })).toHaveAttribute(
      "href",
      "mailto:contato@portfolio.dev",
    );
  });
});
