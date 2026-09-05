import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import type { Projeto, PerfilProfissional } from "../../lib/types";

vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof fs>("fs");
  return {
    ...actual,
    default: {
      ...actual,
      readFileSync: vi.fn(actual.readFileSync),
      readdirSync: vi.fn(actual.readdirSync),
    },
    readFileSync: vi.fn(actual.readFileSync),
    readdirSync: vi.fn(actual.readdirSync),
  };
});

const mockedReadFileSync = vi.mocked(fs.readFileSync);
const mockedReaddirSync = vi.mocked(fs.readdirSync);

function buildPerfil(overrides: Partial<PerfilProfissional> = {}): PerfilProfissional {
  return {
    nome: "Pessoa Exemplo",
    tituloPosicionamento: "Desenvolvedor Web em Formação",
    descricaoPosicionamento: "Descrição de posicionamento.",
    competenciasPorArea: [{ area: "Backend", competencias: ["Node.js"] }],
    biografiaSobre: "Bio.",
    formacao: [
      { periodo: "2026 — presente", titulo: "Formação", descricao: "Descrição da formação." },
    ],
    trajetoria: [
      { periodo: "2026 — presente", titulo: "Trajetória", descricao: "Descrição da trajetória." },
    ],
    linkGithub: "https://github.com",
    linkLinkedin: "https://linkedin.com",
    contato: { tipo: "email", valor: "contato@portfolio.local" },
    ...overrides,
  };
}

function buildProjeto(overrides: Partial<Projeto> = {}): Projeto {
  return {
    slug: "projeto-teste",
    titulo: "Projeto Teste",
    resumo: "Resumo",
    problemaTratado: "Problema",
    status: "Em andamento",
    categoria: "Web",
    natureza: "autoral",
    tecnologias: ["Next.js"],
    imagemApresentacao: "/images/projects/plataforma-portfolio.svg",
    competenciasDemonstradas: ["Node.js"],
    contexto: "Contexto",
    objetivo: "Objetivo",
    funcionalidadesPrincipais: ["F1"],
    responsabilidadeProprietario: "Responsável",
    decisoesRelevantes: [
      { titulo: "D1", descricao: "Descrição" },
      { titulo: "D2", descricao: "Descrição" },
    ],
    stack: ["Next.js"],
    limitacoesConhecidas: ["Limite"],
    proximosPassos: ["Passo"],
    destaque: false,
    real: true,
    ...overrides,
  };
}

function mockFileSystem(perfil: PerfilProfissional, projetos: Record<string, Partial<Projeto>>) {
  const fileNames = Object.keys(projetos);

  mockedReaddirSync.mockImplementation(((dirPath: fs.PathLike) => {
    if (dirPath.toString().endsWith("projects")) {
      return fileNames;
    }
    throw new Error(`readdirSync mock: caminho inesperado ${dirPath.toString()}`);
  }) as typeof fs.readdirSync);

  mockedReadFileSync.mockImplementation(((filePath: fs.PathOrFileDescriptor) => {
    const filePathStr = filePath.toString();
    if (filePathStr.endsWith("profile.json")) {
      return JSON.stringify(perfil);
    }
    const fileName = fileNames.find((name) => filePathStr.endsWith(name));
    if (fileName) {
      return JSON.stringify(projetos[fileName]);
    }
    throw new Error(`readFileSync mock: caminho inesperado ${filePathStr}`);
  }) as typeof fs.readFileSync);
}

describe("lib/content", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("com dados reais do repositório", () => {
    it("getPerfil retorna o perfil com a estrutura esperada", async () => {
      const { getPerfil } = await import("../../lib/content");
      const perfil = getPerfil();

      expect(perfil.tituloPosicionamento).toBeTruthy();
      expect(perfil.descricaoPosicionamento).toBeTruthy();
      expect(perfil.competenciasPorArea.length).toBeGreaterThan(0);
      expect(perfil.formacao.length).toBeGreaterThan(0);
      expect(perfil.trajetoria.length).toBeGreaterThan(0);
      expect(perfil.contato.tipo).toBe("email");
      expect(perfil.contato.valor).toBeTruthy();
    });

    it("getProjetos retorna todos os projetos válidos sem lançar erro", async () => {
      const { getProjetos } = await import("../../lib/content");
      const projetos = getProjetos();

      expect(projetos.length).toBeGreaterThan(0);
      for (const projeto of projetos) {
        expect(projeto.slug).toBeTruthy();
        expect(projeto.titulo).toBeTruthy();
        expect(projeto.decisoesRelevantes.length).toBeGreaterThanOrEqual(2);
        expect(Array.isArray(projeto.competenciasDemonstradas)).toBe(true);
      }
    });

    it("getProjetoBySlug retorna o projeto correto ou undefined", async () => {
      const { getProjetos, getProjetoBySlug } = await import("../../lib/content");
      const projetos = getProjetos();

      const encontrado = getProjetoBySlug(projetos[0].slug);
      expect(encontrado?.slug).toBe(projetos[0].slug);
      expect(getProjetoBySlug("slug-que-nao-existe")).toBeUndefined();
    });
  });

  describe("com filesystem mockado", () => {
    beforeEach(() => {
      vi.resetModules();
      mockedReadFileSync.mockReset();
      mockedReaddirSync.mockReset();
    });

    it("getProjetos lança erro quando um campo obrigatório está ausente", async () => {
      const perfil = buildPerfil();
      const projetoInvalido = buildProjeto();
      delete (projetoInvalido as Partial<Projeto>).responsabilidadeProprietario;

      mockFileSystem(perfil, { "invalido.json": projetoInvalido });

      const { getProjetos } = await import("../../lib/content");
      expect(() => getProjetos()).toThrow(
        /campo obrigatório "responsabilidadeProprietario" ausente ou vazio em invalido\.json/,
      );
    });

    it("getProjetos lança erro quando decisoesRelevantes tem menos de 2 itens", async () => {
      const perfil = buildPerfil();
      const projetoInvalido = buildProjeto({
        decisoesRelevantes: [{ titulo: "D1", descricao: "Descrição" }],
      });

      mockFileSystem(perfil, { "invalido.json": projetoInvalido });

      const { getProjetos } = await import("../../lib/content");
      expect(() => getProjetos()).toThrow(/"decisoesRelevantes" deve conter ao menos 2 itens/);
    });

    it("getProjetos lança erro mencionando competência sem projeto que a evidencie", async () => {
      const perfil = buildPerfil({
        competenciasPorArea: [
          { area: "Backend", competencias: ["Node.js"] },
          { area: "Cloud", competencias: ["AWS avançado"] },
        ],
      });
      const projeto = buildProjeto({ competenciasDemonstradas: ["Node.js"] });

      mockFileSystem(perfil, { "valido.json": projeto });

      const { getProjetos } = await import("../../lib/content");
      expect(() => getProjetos()).toThrow(
        /competência\(s\) sem projeto que a\(s\) referencie.*AWS avançado/,
      );
    });

    it.each([
      ["slug malformado", { slug: "Projeto Teste" }, /campo "slug" deve usar/],
      ["status fora do conjunto", { status: "Rascunho" }, /campo "status" possui valor inválido/],
      [
        "natureza fora do conjunto",
        { natureza: "hobby" },
        /campo "natureza" possui valor inválido/,
      ],
      [
        "categoria fora do conjunto",
        { categoria: "Jogos" },
        /campo "categoria" possui valor inválido/,
      ],
      ["destaque com tipo inválido", { destaque: "sim" }, /campo "destaque" deve ser booleano/],
      ["real com tipo inválido", { real: "sim" }, /campo "real" deve ser booleano/],
      [
        "tecnologias com tipo inválido",
        { tecnologias: "Next.js" },
        /campo "tecnologias" deve ser um array/,
      ],
      [
        "imagem inexistente",
        { imagemApresentacao: "/images/projects/ausente.svg" },
        /arquivo referenciado/,
      ],
      [
        "URL de demonstração inválida",
        { linkDemonstracao: "ftp://example.com" },
        /linkDemonstracao/,
      ],
      ["URL de repositório inválida", { linkRepositorio: "not-a-url" }, /linkRepositorio/],
    ])("getProjetos rejeita %s", async (_description, overrides, expectedError) => {
      mockFileSystem(buildPerfil(), {
        "invalido.json": buildProjeto(overrides as Partial<Projeto>),
      });

      const { getProjetos } = await import("../../lib/content");
      expect(() => getProjetos()).toThrow(expectedError);
    });

    it("getProjetos rejeita slugs duplicados", async () => {
      const projeto = buildProjeto();
      mockFileSystem(buildPerfil(), {
        "primeiro.json": projeto,
        "segundo.json": { ...projeto, titulo: "Outro projeto" },
      });

      const { getProjetos } = await import("../../lib/content");
      expect(() => getProjetos()).toThrow(/slug duplicado/);
    });

    it("getProjetos rejeita mais de seis destaques", async () => {
      const projetos = Object.fromEntries(
        Array.from({ length: 7 }, (_, index) => [
          `projeto-${index}.json`,
          buildProjeto({ slug: `projeto-${index}`, destaque: true }),
        ]),
      );
      mockFileSystem(buildPerfil(), projetos);

      const { getProjetos } = await import("../../lib/content");
      expect(() => getProjetos()).toThrow(/mais de 6 projetos marcados como destaque/);
    });

    it("getPerfil rejeita URLs e contato inválidos", async () => {
      mockFileSystem(
        buildPerfil({
          linkGithub: "http://github.com",
          contato: { tipo: "email", valor: "email-inválido" },
        }),
        { "valido.json": buildProjeto() },
      );

      const { getPerfil } = await import("../../lib/content");
      expect(() => getPerfil()).toThrow(/linkGithub/);
    });

    it("aceita perfil sem linkCurriculo: o PDF é opcional", async () => {
      mockFileSystem(buildPerfil(), { "valido.json": buildProjeto() });

      const { getPerfil } = await import("../../lib/content");
      expect(getPerfil().linkCurriculo).toBeUndefined();
    });

    it.each([
      ["nome com tipo inválido", buildPerfil({ nome: 42 as unknown as string }), /campo "nome"/],
      [
        "caminho de currículo relativo",
        buildPerfil({ linkCurriculo: "curriculo.pdf" }),
        /linkCurriculo/,
      ],
      [
        "e-mail malformado",
        buildPerfil({ contato: { tipo: "email", valor: "email-inválido" } }),
        /contato\.valor/,
      ],
      [
        "área de competência inválida",
        buildPerfil({ competenciasPorArea: [{ area: "", competencias: [] }] }),
        /competenciasPorArea/,
      ],
      [
        "formação sem período",
        buildPerfil({
          formacao: [{ periodo: "", titulo: "Formação", descricao: "Descrição" }],
        }),
        /campo "formacao"/,
      ],
      ["trajetória vazia", buildPerfil({ trajetoria: [] }), /campo "trajetoria"/],
    ])("getPerfil rejeita %s", async (_description, perfil, expectedError) => {
      mockFileSystem(perfil, { "valido.json": buildProjeto() });

      const { getPerfil } = await import("../../lib/content");
      expect(() => getPerfil()).toThrow(expectedError);
    });

    it("getProjetos rejeita decisões sem título ou descrição", async () => {
      mockFileSystem(buildPerfil(), {
        "invalido.json": buildProjeto({
          decisoesRelevantes: [
            { titulo: "Decisão válida", descricao: "Descrição válida" },
            { titulo: "", descricao: "Descrição ausente" },
          ],
        }),
      });

      const { getProjetos } = await import("../../lib/content");
      expect(() => getProjetos()).toThrow(/decisoesRelevantes/);
    });

    it("getProjetos exige ao menos um projeto publicado", async () => {
      mockFileSystem(buildPerfil(), {});

      const { getProjetos } = await import("../../lib/content");
      expect(() => getProjetos()).toThrow(/ao menos um projeto publicado/);
    });
  });
});
