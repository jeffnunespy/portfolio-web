import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectCard from "../../components/project/ProjectCard";
import type { ProjetoImplementado } from "../../lib/types";
import { EMAIL_PLACEHOLDER } from "../../lib/labels";

const projeto: ProjetoImplementado = {
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
  describe.each([
    { estado: "público", linkRepositorio: "https://github.com/example/projeto" },
    { estado: "privado", linkRepositorio: "privado" },
    { estado: "ausente", linkRepositorio: undefined },
  ])("AUD03-005: repositório $estado", ({ estado, linkRepositorio }) => {
    it.each([false, true])("preserva indicação e ações com demonstração=%s", (temDemo) => {
      render(
        <ProjectCard
          projeto={{
            ...projeto,
            linkRepositorio,
            linkDemonstracao: temDemo ? "https://demo.example.com" : undefined,
          }}
          contatoEmail="contato@example.com"
        />,
      );

      expect(screen.getByRole("link", { name: "Ver detalhes de Projeto Teste" })).toHaveAttribute(
        "href",
        "/projetos/projeto-teste",
      );
      const demonstracoes = screen.queryAllByRole("link", { name: "Ver demonstração" });
      expect(demonstracoes).toHaveLength(temDemo ? 1 : 0);
      if (temDemo) {
        expect(demonstracoes[0]).toHaveAttribute("href", "https://demo.example.com");
      }
      const codigo = screen.queryAllByRole("link", { name: "Ver código-fonte" });
      expect(codigo).toHaveLength(estado === "público" ? 1 : 0);
      if (estado === "público") {
        expect(codigo[0]).toHaveAttribute("href", linkRepositorio);
      }
      expect(
        screen.queryAllByText("Código privado — disponível mediante solicitação"),
      ).toHaveLength(estado === "privado" ? 1 : 0);
      expect(screen.queryAllByText("Código não disponível publicamente")).toHaveLength(
        estado === "ausente" ? 1 : 0,
      );
      const acesso = screen.queryAllByRole("link", { name: "Solicitar acesso ao código" });
      expect(acesso).toHaveLength(estado === "privado" ? 1 : 0);
      if (estado === "privado") {
        expect(acesso[0]).toHaveAttribute(
          "href",
          "mailto:contato@example.com?subject=Acesso ao código do projeto",
        );
      }
    });
  });

  it.each([undefined, EMAIL_PLACEHOLDER])(
    "não cria mailto inválido para cartão privado com contato=%s",
    (contatoEmail) => {
      render(
        <ProjectCard
          projeto={{ ...projeto, linkRepositorio: "privado" }}
          contatoEmail={contatoEmail}
        />,
      );
      expect(
        screen.getByText("Código privado — disponível mediante solicitação"),
      ).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Solicitar acesso ao código" })).toBeNull();
    },
  );

  it("agrupa competências por área sem perder evidências fora do perfil", () => {
    const { container } = render(
      <ProjectCard
        projeto={{
          ...projeto,
          competenciasDemonstradas: ["Node.js", "Testes automatizados", "Astro"],
        }}
        competenciasPorArea={[
          { area: "Qualidade", competencias: ["Testes automatizados", "Acessibilidade"] },
          { area: "Operação", competencias: ["Node.js"] },
        ]}
      />,
    );
    const grupos = container.querySelectorAll(".project-card__competencies > div");
    expect(Array.from(grupos, (grupo) => grupo.querySelector("dt")?.textContent)).toEqual([
      "Qualidade",
      "Operação",
      "Outras competências",
    ]);
    for (const competencia of ["Node.js", "Testes automatizados", "Astro"]) {
      expect(within(container).getByText(competencia, { exact: true })).toBeInTheDocument();
    }
    expect(screen.queryByText("Acessibilidade")).not.toBeInTheDocument();
  });
  it("preserva os dados e o acesso ao código de Nana sem renderizar prévia (FR-006a)", () => {
    const { container } = render(
      <ProjectCard
        projeto={{
          ...projeto,
          slug: "nana-silva",
          titulo: "Nana Silva",
          linkRepositorio: "privado",
        }}
        contatoEmail="contato@portfolio.dev"
      />,
    );
    expect(container.querySelector(".project-image")).toBeNull();
    expect(screen.queryByRole("link", { name: /Ler descrição de Nana/ })).toBeNull();
    expect(screen.getByRole("heading", { name: "Nana Silva" })).toBeInTheDocument();
    expect(screen.getByText("Em validação")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitar acesso ao código" })).toHaveAttribute(
      "href",
      "mailto:contato@portfolio.dev?subject=Acesso ao código do projeto",
    );
  });
  it("exibe os campos obrigatórios e links públicos disponíveis", () => {
    const { container } = render(
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
    const fichaDeIndice = container.querySelector(".project-image__surface");
    expect(fichaDeIndice).toHaveStyle({ backgroundImage: `url("${projeto.imagemApresentacao}")` });
    expect(fichaDeIndice).toHaveAttribute("aria-hidden", "true");
    expect(
      screen.getByRole("link", { name: `Ler descrição de ${projeto.titulo}` }),
    ).toHaveAttribute("href", `/projetos/${projeto.slug}#contexto`);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByRole("link", { name: "Ver demonstração" })).toHaveAttribute(
      "href",
      "https://demo.example.com",
    );
    expect(screen.getByRole("link", { name: "Ver código-fonte" })).toHaveAttribute(
      "href",
      "https://github.com/example/projeto",
    );
  });

  it("declara código privado ou indisponível sem criar link inválido", () => {
    const { rerender } = render(
      <ProjectCard projeto={{ ...projeto, linkRepositorio: "privado" }} />,
    );

    expect(
      screen.getByText("Código privado — disponível mediante solicitação"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Ver código-fonte" })).not.toBeInTheDocument();

    rerender(<ProjectCard projeto={projeto} />);
    expect(screen.getByText("Código não disponível publicamente")).toBeInTheDocument();
  });

  // A ficha só publica software implementado; escopo planejado tem superfície
  // própria em /roadmap (DESIGN.md, "duas superfícies, nunca uma"). A garantia
  // é do tipo ProjetoImplementado — um `real: false` aqui não compila —, então
  // resta afirmar que o cartão não carrega mais vocabulário de planejamento.
  it("apresenta as competências como demonstradas, sem vocabulário de planejamento", () => {
    render(<ProjectCard projeto={projeto} />);

    expect(screen.getByText("Competências:")).toBeInTheDocument();
    expect(screen.queryByText("Competências planejadas:")).not.toBeInTheDocument();
    expect(screen.queryByText("Estrutura de conteúdo")).not.toBeInTheDocument();
  });
});
