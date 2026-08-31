import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectCard from "../../components/project/ProjectCard";
import type { Projeto } from "../../lib/types";

const projeto: Projeto = {
  slug: "projeto-teste",
  titulo: "Projeto Teste",
  resumo: "Resumo do projeto.",
  problemaTratado: "Um problema concreto.",
  status: "Em andamento",
  categoria: "Backend",
  natureza: "autoral",
  tecnologias: ["Next.js", "TypeScript"],
  imagemApresentacao: "/images/projects/plataforma-portfolio.svg",
  competenciasDemonstradas: ["Node.js"],
  contexto: "Contexto.",
  objetivo: "Objetivo.",
  funcionalidadesPrincipais: ["Funcionalidade"],
  responsabilidadeProprietario: "Responsabilidade.",
  decisoesRelevantes: [
    { titulo: "Decisão 1", descricao: "Descrição 1." },
    { titulo: "Decisão 2", descricao: "Descrição 2." },
  ],
  stack: ["Next.js"],
  limitacoesConhecidas: ["Limitação."],
  proximosPassos: ["Próximo passo."],
  destaque: true,
  real: true,
};

describe("ProjectCard", () => {
  it("exibe os campos obrigatórios e links públicos disponíveis", () => {
    render(
      <ProjectCard
        projeto={{
          ...projeto,
          linkDemonstracao: "https://demo.example.com",
          linkRepositorio: "https://github.com/example/projeto",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: projeto.titulo })).toBeInTheDocument();
    expect(screen.getByText("Um problema concreto.")).toBeInTheDocument();
    expect(screen.getByText("Autoral")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /imagem de apresentação/i })).toHaveAttribute(
      "src",
      projeto.imagemApresentacao,
    );
    expect(screen.getByRole("link", { name: "Ver demonstração" })).toHaveAttribute(
      "href",
      "https://demo.example.com",
    );
    expect(screen.getByRole("link", { name: "Ver código" })).toHaveAttribute(
      "href",
      "https://github.com/example/projeto",
    );
  });

  it("declara código privado ou indisponível sem criar link inválido", () => {
    const { rerender } = render(
      <ProjectCard projeto={{ ...projeto, linkRepositorio: "privado" }} />,
    );

    expect(screen.getByText("Código privado")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Ver código" })).not.toBeInTheDocument();

    rerender(<ProjectCard projeto={projeto} />);
    expect(screen.getByText("Código não disponível publicamente")).toBeInTheDocument();
  });
});
