import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import type { Projeto, PerfilProfissional } from '../../lib/types';

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof fs>('fs');
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
    tituloPosicionamento: 'Desenvolvedor Full-Stack em Formação',
    descricaoPosicionamento: 'Descrição de posicionamento.',
    competenciasPorArea: [{ area: 'Backend', competencias: ['Node.js'] }],
    biografiaSobre: 'Bio.',
    linkCurriculo: '/curriculo.pdf',
    linkGithub: 'https://github.com',
    linkLinkedin: 'https://linkedin.com',
    contato: { tipo: 'email', valor: 'contato@portfolio.local' },
    ...overrides,
  };
}

function buildProjeto(overrides: Partial<Projeto> = {}): Projeto {
  return {
    slug: 'projeto-teste',
    titulo: 'Projeto Teste',
    resumo: 'Resumo',
    problemaTratado: 'Problema',
    status: 'Em andamento',
    categoria: 'Web',
    natureza: 'autoral',
    tecnologias: ['Next.js'],
    imagemApresentacao: '/images/test.png',
    competenciasDemonstradas: ['Node.js'],
    contexto: 'Contexto',
    objetivo: 'Objetivo',
    funcionalidadesPrincipais: ['F1'],
    responsabilidadeProprietario: 'Responsável',
    decisoesRelevantes: [
      { titulo: 'D1', descricao: 'Descrição' },
      { titulo: 'D2', descricao: 'Descrição' },
    ],
    stack: ['Next.js'],
    limitacoesConhecidas: ['Limite'],
    proximosPassos: ['Passo'],
    destaque: false,
    ...overrides,
  };
}

function mockFileSystem(perfil: PerfilProfissional, projetos: Record<string, Partial<Projeto>>) {
  const fileNames = Object.keys(projetos);

  mockedReaddirSync.mockImplementation(((dirPath: fs.PathLike) => {
    if (dirPath.toString().endsWith('projects')) {
      return fileNames;
    }
    throw new Error(`readdirSync mock: caminho inesperado ${dirPath.toString()}`);
  }) as typeof fs.readdirSync);

  mockedReadFileSync.mockImplementation(((filePath: fs.PathOrFileDescriptor) => {
    const filePathStr = filePath.toString();
    if (filePathStr.endsWith('profile.json')) {
      return JSON.stringify(perfil);
    }
    const fileName = fileNames.find((name) => filePathStr.endsWith(name));
    if (fileName) {
      return JSON.stringify(projetos[fileName]);
    }
    throw new Error(`readFileSync mock: caminho inesperado ${filePathStr}`);
  }) as typeof fs.readFileSync);
}

describe('lib/content', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('com dados reais do repositório', () => {
    it('getPerfil retorna o perfil com a estrutura esperada', async () => {
      const { getPerfil } = await import('../../lib/content');
      const perfil = getPerfil();

      expect(perfil.tituloPosicionamento).toBeTruthy();
      expect(perfil.descricaoPosicionamento).toBeTruthy();
      expect(perfil.competenciasPorArea.length).toBeGreaterThan(0);
      expect(perfil.contato.tipo).toBe('email');
      expect(perfil.contato.valor).toBeTruthy();
    });

    it('getProjetos retorna todos os projetos válidos sem lançar erro', async () => {
      const { getProjetos } = await import('../../lib/content');
      const projetos = getProjetos();

      expect(projetos.length).toBeGreaterThan(0);
      for (const projeto of projetos) {
        expect(projeto.slug).toBeTruthy();
        expect(projeto.titulo).toBeTruthy();
        expect(projeto.decisoesRelevantes.length).toBeGreaterThanOrEqual(2);
        expect(Array.isArray(projeto.competenciasDemonstradas)).toBe(true);
      }
    });

    it('getProjetoBySlug retorna o projeto correto ou undefined', async () => {
      const { getProjetos, getProjetoBySlug } = await import('../../lib/content');
      const projetos = getProjetos();

      const encontrado = getProjetoBySlug(projetos[0].slug);
      expect(encontrado?.slug).toBe(projetos[0].slug);
      expect(getProjetoBySlug('slug-que-nao-existe')).toBeUndefined();
    });
  });

  describe('com filesystem mockado', () => {
    beforeEach(() => {
      vi.resetModules();
      mockedReadFileSync.mockReset();
      mockedReaddirSync.mockReset();
    });

    it('getProjetos lança erro quando um campo obrigatório está ausente', async () => {
      const perfil = buildPerfil();
      const projetoInvalido = buildProjeto();
      delete (projetoInvalido as Partial<Projeto>).responsabilidadeProprietario;

      mockFileSystem(perfil, { 'invalido.json': projetoInvalido });

      const { getProjetos } = await import('../../lib/content');
      expect(() => getProjetos()).toThrow(
        /campo obrigatório "responsabilidadeProprietario" ausente ou vazio em invalido\.json/,
      );
    });

    it('getProjetos lança erro quando decisoesRelevantes tem menos de 2 itens', async () => {
      const perfil = buildPerfil();
      const projetoInvalido = buildProjeto({
        decisoesRelevantes: [{ titulo: 'D1', descricao: 'Descrição' }],
      });

      mockFileSystem(perfil, { 'invalido.json': projetoInvalido });

      const { getProjetos } = await import('../../lib/content');
      expect(() => getProjetos()).toThrow(/"decisoesRelevantes" deve conter ao menos 2 itens/);
    });

    it('getProjetos lança erro mencionando competência sem projeto que a evidencie', async () => {
      const perfil = buildPerfil({
        competenciasPorArea: [
          { area: 'Backend', competencias: ['Node.js'] },
          { area: 'Cloud', competencias: ['AWS avançado'] },
        ],
      });
      const projeto = buildProjeto({ competenciasDemonstradas: ['Node.js'] });

      mockFileSystem(perfil, { 'valido.json': projeto });

      const { getProjetos } = await import('../../lib/content');
      expect(() => getProjetos()).toThrow(/competência\(s\) sem projeto que a\(s\) referencie.*AWS avançado/);
    });
  });
});
