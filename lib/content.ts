import fs from "fs";
import path from "path";
import type { Projeto, PerfilProfissional } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

const REQUIRED_PROJETO_FIELDS: (keyof Projeto)[] = [
  "slug",
  "titulo",
  "resumo",
  "problemaTratado",
  "status",
  "categoria",
  "natureza",
  "tecnologias",
  "imagemApresentacao",
  "competenciasDemonstradas",
  "contexto",
  "objetivo",
  "funcionalidadesPrincipais",
  "responsabilidadeProprietario",
  "decisoesRelevantes",
  "stack",
  "limitacoesConhecidas",
  "proximosPassos",
  "destaque",
];

const REQUIRED_PERFIL_FIELDS: (keyof PerfilProfissional)[] = [
  "tituloPosicionamento",
  "descricaoPosicionamento",
  "competenciasPorArea",
  "biografiaSobre",
  "linkCurriculo",
  "linkGithub",
  "linkLinkedin",
  "contato",
];

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function validateProjeto(data: Partial<Projeto>, fileName: string): Projeto {
  for (const field of REQUIRED_PROJETO_FIELDS) {
    if (isEmptyValue(data[field])) {
      throw new Error(
        `Falha de validação de conteúdo (FR-011a): campo obrigatório "${field}" ausente ou vazio em ${fileName}.`,
      );
    }
  }
  if ((data.decisoesRelevantes?.length ?? 0) < 2) {
    throw new Error(
      `Falha de validação de conteúdo (FR-011a): "decisoesRelevantes" deve conter ao menos 2 itens em ${fileName}.`,
    );
  }
  return data as Projeto;
}

function validatePerfil(data: Partial<PerfilProfissional>): PerfilProfissional {
  for (const field of REQUIRED_PERFIL_FIELDS) {
    if (isEmptyValue(data[field])) {
      throw new Error(
        `Falha de validação de conteúdo (FR-011a): campo obrigatório "${field}" ausente ou vazio em profile.json.`,
      );
    }
  }
  if (isEmptyValue(data.contato?.valor)) {
    throw new Error(
      `Falha de validação de conteúdo (FR-011a): campo obrigatório "contato.valor" ausente ou vazio em profile.json.`,
    );
  }
  return data as PerfilProfissional;
}

function validateCompetenciasComEvidencia(perfil: PerfilProfissional, projetos: Projeto[]): void {
  const competenciasComEvidencia = new Set(projetos.flatMap((p) => p.competenciasDemonstradas));
  const semEvidencia = perfil.competenciasPorArea
    .flatMap((area) => area.competencias)
    .filter((competencia) => !competenciasComEvidencia.has(competencia));

  if (semEvidencia.length > 0) {
    throw new Error(
      `Falha de validação de conteúdo (FR-024, SC-007): competência(s) sem projeto que a(s) referencie em "competenciasDemonstradas": ${semEvidencia.join(", ")}.`,
    );
  }
}

export function getPerfil(): PerfilProfissional {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "profile.json"), "utf-8");
  const data = JSON.parse(raw) as Partial<PerfilProfissional>;
  return validatePerfil(data);
}

export function getProjetos(): Projeto[] {
  const projectsDir = path.join(CONTENT_DIR, "projects");
  const fileNames = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".json"));

  const projetos = fileNames.map((fileName) => {
    const raw = fs.readFileSync(path.join(projectsDir, fileName), "utf-8");
    const data = JSON.parse(raw) as Partial<Projeto>;
    return validateProjeto(data, fileName);
  });

  const perfil = getPerfil();
  validateCompetenciasComEvidencia(perfil, projetos);

  return projetos;
}

export function getProjetoBySlug(slug: string): Projeto | undefined {
  return getProjetos().find((p) => p.slug === slug);
}
