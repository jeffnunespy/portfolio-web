import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "../../app/page";
import { getPerfil, getProjetosImplementados, getRoadmap } from "../../lib/content";
import type { ProjetoImplementado } from "../../lib/types";
import perfil from "../../content/profile.json";
import plataforma from "../../content/projects/plataforma-portfolio.json";

vi.mock("../../lib/content", () => ({
  getPerfil: vi.fn(),
  getProjetosImplementados: vi.fn(),
  getRoadmap: vi.fn(),
}));

function projeto(slug: string, destaque: boolean): ProjetoImplementado {
  return {
    ...plataforma,
    slug,
    titulo: slug,
    status: "Em andamento",
    natureza: "autoral",
    real: true,
    destaque,
  };
}

describe("Home — seleção de destaques (FR-004)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getPerfil).mockReturnValue({
      ...perfil,
      contato: { ...perfil.contato, tipo: "email" },
    });
    vi.mocked(getRoadmap).mockReturnValue([]);
  });

  it("exibe somente implementados destacados, preservando a ordem fornecida", () => {
    vi.mocked(getProjetosImplementados).mockReturnValue([
      projeto("destaque-b", true),
      projeto("fora-da-vitrine", false),
      projeto("destaque-a", true),
    ]);

    render(<Home />);

    const cards = screen.getAllByTestId("project-card");
    expect(
      cards.map((card) => within(card).getByRole("heading", { level: 3 }).textContent),
    ).toEqual(["destaque-b", "destaque-a"]);
    expect(screen.queryByRole("link", { name: "Ver detalhes de fora-da-vitrine" })).toBeNull();
    expect(screen.queryByText("Nenhum projeto em destaque no momento.")).toBeNull();
    expect(
      within(cards[0]).getByRole("link", { name: "Ver detalhes de destaque-b" }),
    ).toHaveAttribute("href", "/projetos/destaque-b");
  });

  it("oferece estado vazio e saída para o catálogo quando não há destaques", () => {
    // O acervo continua válido e não vazio; somente a seleção de destaque está vazia.
    vi.mocked(getProjetosImplementados).mockReturnValue([projeto("fora-da-vitrine", false)]);

    render(<Home />);

    expect(screen.queryAllByTestId("project-card")).toHaveLength(0);
    expect(screen.getByText("Nenhum projeto em destaque no momento.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Consultar todos os projetos" })).toHaveAttribute(
      "href",
      "/projetos",
    );
  });
});
