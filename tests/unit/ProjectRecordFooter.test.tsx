import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectRecordFooter from "../../components/project/ProjectRecordFooter";

const projetos = [
  { slug: "primeiro", titulo: "Primeiro projeto" },
  { slug: "intermediario", titulo: "Projeto intermediário" },
  { slug: "ultimo", titulo: "Último projeto" },
];

describe("ProjectRecordFooter", () => {
  it.each([
    {
      atual: projetos[0],
      anterior: undefined,
      proximo: projetos[1],
    },
    {
      atual: projetos[1],
      anterior: projetos[0],
      proximo: projetos[2],
    },
    {
      atual: projetos[2],
      anterior: projetos[1],
      proximo: undefined,
    },
  ])(
    "resolve os vizinhos sem navegação circular para $atual.slug",
    ({ atual, anterior, proximo }) => {
      render(<ProjectRecordFooter projeto={atual} projetos={projetos} />);

      const previousLink = screen.queryByRole("link", {
        name: /Ficha anterior/,
      });
      const nextLink = screen.queryByRole("link", {
        name: /Próxima ficha/,
      });

      if (anterior) {
        expect(previousLink).toHaveAttribute("href", `/projetos/${anterior.slug}`);
        expect(previousLink).toHaveTextContent(anterior.titulo);
      } else {
        expect(previousLink).not.toBeInTheDocument();
      }

      if (proximo) {
        expect(nextLink).toHaveAttribute("href", `/projetos/${proximo.slug}`);
        expect(nextLink).toHaveTextContent(proximo.titulo);
      } else {
        expect(nextLink).not.toBeInTheDocument();
      }
    },
  );

  it("mantém as saídas para a listagem e o currículo", () => {
    render(<ProjectRecordFooter projeto={projetos[1]} projetos={projetos} />);

    expect(screen.getByRole("link", { name: "← Todas as fichas" })).toHaveAttribute(
      "href",
      "/projetos",
    );
    expect(screen.getByRole("link", { name: "Ver currículo" })).toHaveAttribute(
      "href",
      "/curriculo",
    );
    expect(screen.getByText("Ficha 2 de 3")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Navegação entre fichas de projeto" }),
    ).toBeVisible();
  });
});
