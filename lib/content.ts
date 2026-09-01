import fs from "fs";
import path from "path";
import type { PerfilProfissional, Projeto, ProjetoImplementado } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const STATUS_PROJETO = ["Em andamento", "Concluído", "Pausado", "Arquivado"] as const;
const NATUREZA_PROJETO = ["autoral", "acadêmico", "colaborativo", "profissional"] as const;
const CATEGORIA_PROJETO = [
  "Backend",
  "Web",
  "Frontend",
  "Dados",
  "Automação",
  "Infraestrutura",
  "Mobile",
] as const;

const REQUIRED_PROJETO_FIELDS = [
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
  "real",
] as const satisfies readonly (keyof Projeto)[];

const REQUIRED_PERFIL_FIELDS = [
  "nome",
  "tituloPosicionamento",
  "descricaoPosicionamento",
  "competenciasPorArea",
  "biografiaSobre",
  "linkGithub",
  "linkLinkedin",
  "contato",
] as const satisfies readonly (keyof PerfilProfissional)[];

function validationError(message: string): Error {
  return new Error(`Falha de validação de conteúdo: ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateRequiredFields(
  data: Record<string, unknown>,
  fields: readonly string[],
  fileName: string,
): void {
  for (const field of fields) {
    const value = data[field];
    if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
      throw validationError(
        `(FR-011a): campo obrigatório "${field}" ausente ou vazio em ${fileName}.`,
      );
    }
  }
}

function validateStringField(data: Record<string, unknown>, field: string, fileName: string): void {
  if (!isNonEmptyString(data[field])) {
    throw validationError(`campo "${field}" deve ser uma string não vazia em ${fileName}.`);
  }
}

function validateStringArray(data: Record<string, unknown>, field: string, fileName: string): void {
  const value = data[field];
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => !isNonEmptyString(item))
  ) {
    throw validationError(
      `campo "${field}" deve ser um array não vazio de strings em ${fileName}.`,
    );
  }
}

function validateHttpsUrl(value: unknown, field: string, fileName: string): void {
  if (!isNonEmptyString(value)) {
    throw validationError(`campo "${field}" deve ser uma URL HTTPS válida em ${fileName}.`);
  }

  try {
    if (new URL(value).protocol !== "https:") {
      throw new Error("protocolo inválido");
    }
  } catch {
    throw validationError(`campo "${field}" deve ser uma URL HTTPS válida em ${fileName}.`);
  }
}

function validatePublicAsset(value: unknown, field: string, fileName: string): void {
  if (!isNonEmptyString(value) || !value.startsWith("/")) {
    throw validationError(
      `campo "${field}" deve referenciar um caminho público absoluto em ${fileName}.`,
    );
  }

  const assetPath = path.resolve(PUBLIC_DIR, `.${value}`);
  if (!assetPath.startsWith(`${PUBLIC_DIR}${path.sep}`) || !fs.existsSync(assetPath)) {
    throw validationError(
      `arquivo referenciado por "${field}" não existe em ${fileName}: ${value}.`,
    );
  }
}

function validateProjeto(data: unknown, fileName: string): Projeto {
  if (!isRecord(data)) {
    throw validationError(`conteúdo deve ser um objeto JSON em ${fileName}.`);
  }

  validateRequiredFields(data, REQUIRED_PROJETO_FIELDS, fileName);
  for (const field of [
    "slug",
    "titulo",
    "resumo",
    "problemaTratado",
    "categoria",
    "contexto",
    "objetivo",
    "responsabilidadeProprietario",
  ]) {
    validateStringField(data, field, fileName);
  }
  for (const field of [
    "tecnologias",
    "competenciasDemonstradas",
    "funcionalidadesPrincipais",
    "stack",
    "limitacoesConhecidas",
    "proximosPassos",
  ]) {
    validateStringArray(data, field, fileName);
  }

  if (!isNonEmptyString(data.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    throw validationError(
      `campo "slug" deve usar somente minúsculas, números e hífens em ${fileName}.`,
    );
  }
  if (!STATUS_PROJETO.includes(data.status as (typeof STATUS_PROJETO)[number])) {
    throw validationError(`campo "status" possui valor inválido em ${fileName}.`);
  }
  if (!NATUREZA_PROJETO.includes(data.natureza as (typeof NATUREZA_PROJETO)[number])) {
    throw validationError(`campo "natureza" possui valor inválido em ${fileName}.`);
  }
  if (!CATEGORIA_PROJETO.includes(data.categoria as (typeof CATEGORIA_PROJETO)[number])) {
    throw validationError(
      `(FR-006): campo "categoria" possui valor inválido em ${fileName}. Valores permitidos: ${CATEGORIA_PROJETO.join(", ")}.`,
    );
  }
  if (typeof data.destaque !== "boolean") {
    throw validationError(`campo "destaque" deve ser booleano em ${fileName}.`);
  }
  if (typeof data.real !== "boolean") {
    throw validationError(`campo "real" deve ser booleano em ${fileName}.`);
  }

  validatePublicAsset(data.imagemApresentacao, "imagemApresentacao", fileName);

  if (!Array.isArray(data.decisoesRelevantes) || data.decisoesRelevantes.length < 2) {
    throw validationError(
      `(FR-011a): "decisoesRelevantes" deve conter ao menos 2 itens em ${fileName}.`,
    );
  }
  if (
    data.decisoesRelevantes.some(
      (decisao) =>
        !isRecord(decisao) ||
        !isNonEmptyString(decisao.titulo) ||
        !isNonEmptyString(decisao.descricao),
    )
  ) {
    throw validationError(
      `campo "decisoesRelevantes" deve conter título e descrição não vazios em ${fileName}.`,
    );
  }

  if (data.linkDemonstracao !== undefined) {
    validateHttpsUrl(data.linkDemonstracao, "linkDemonstracao", fileName);
  }
  if (data.linkRepositorio !== undefined && data.linkRepositorio !== "privado") {
    validateHttpsUrl(data.linkRepositorio, "linkRepositorio", fileName);
  }

  return data as unknown as Projeto;
}

function validatePerfil(data: unknown): PerfilProfissional {
  const fileName = "profile.json";
  if (!isRecord(data)) {
    throw validationError(`conteúdo deve ser um objeto JSON em ${fileName}.`);
  }

  validateRequiredFields(data, REQUIRED_PERFIL_FIELDS, fileName);
  for (const field of ["tituloPosicionamento", "descricaoPosicionamento", "biografiaSobre"]) {
    validateStringField(data, field, fileName);
  }

  /*
    O PDF é opcional, mas quando declarado precisa existir de fato em public/:
    um link de download quebrado é pior que a ausência do botão. A página
    /curriculo degrada sozinha quando o campo não vem.
  */
  if (data.linkCurriculo !== undefined) {
    validatePublicAsset(data.linkCurriculo, "linkCurriculo", fileName);
  }
  validateHttpsUrl(data.linkGithub, "linkGithub", fileName);
  validateHttpsUrl(data.linkLinkedin, "linkLinkedin", fileName);

  const contato = data.contato;
  if (!isRecord(contato) || contato.tipo !== "email" || !isNonEmptyString(contato.valor)) {
    throw validationError(
      `campo "contato" deve conter tipo "email" e valor não vazio em ${fileName}.`,
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato.valor)) {
    throw validationError(`campo "contato.valor" deve ser um e-mail válido em ${fileName}.`);
  }

  if (
    !Array.isArray(data.competenciasPorArea) ||
    data.competenciasPorArea.length === 0 ||
    data.competenciasPorArea.some(
      (area) =>
        !isRecord(area) ||
        !isNonEmptyString(area.area) ||
        !Array.isArray(area.competencias) ||
        area.competencias.length === 0 ||
        area.competencias.some((competencia) => !isNonEmptyString(competencia)),
    )
  ) {
    throw validationError(
      `campo "competenciasPorArea" deve conter áreas e competências não vazias em ${fileName}.`,
    );
  }

  return data as unknown as PerfilProfissional;
}

function validateProjetosCollection(projetos: Projeto[]): void {
  if (projetos.length === 0) {
    throw validationError("ao menos um projeto publicado é obrigatório.");
  }

  const slugs = new Set<string>();
  for (const projeto of projetos) {
    if (slugs.has(projeto.slug)) {
      throw validationError(`slug duplicado entre projetos: "${projeto.slug}".`);
    }
    slugs.add(projeto.slug);
  }

  const destaques = projetos.filter((projeto) => projeto.destaque);
  if (destaques.length > 6) {
    throw validationError("não pode haver mais de 6 projetos marcados como destaque.");
  }
}

function validateCompetenciasComEvidencia(perfil: PerfilProfissional, projetos: Projeto[]): void {
  // Só projeto implementado conta como evidência: uma ficha de escopo planejado
  // descreve software que ainda não existe e não comprova competência alguma
  // (FR-024/SC-007, princípio "evidências acima de afirmações"). Sem o filtro,
  // o gate aceita conteúdo ficcional como prova e deixa de cumprir sua função.
  const competenciasComEvidencia = new Set(
    projetos.filter((projeto) => projeto.real).flatMap((p) => p.competenciasDemonstradas),
  );
  const semEvidencia = perfil.competenciasPorArea
    .flatMap((area) => area.competencias)
    .filter((competencia) => !competenciasComEvidencia.has(competencia));

  if (semEvidencia.length > 0) {
    throw validationError(
      `(FR-024, SC-007): competência(s) sem projeto que a(s) referencie em "competenciasDemonstradas": ${semEvidencia.join(", ")}.`,
    );
  }
}

// O conteúdo vem de arquivos versionados, lidos em tempo de build e imutáveis
// durante o processo: memoizar evita releituras de disco sem alterar semântica.
let perfilCache: PerfilProfissional | undefined;
let projetosCache: Projeto[] | undefined;
let projetosPorSlugCache: Map<string, Projeto> | undefined;

export function getPerfil(): PerfilProfissional {
  if (perfilCache) {
    return perfilCache;
  }

  const raw = fs.readFileSync(path.join(CONTENT_DIR, "profile.json"), "utf-8");
  perfilCache = validatePerfil(JSON.parse(raw) as unknown);
  return perfilCache;
}

export function getProjetos(): Projeto[] {
  if (projetosCache) {
    return projetosCache;
  }

  const projectsDir = path.join(CONTENT_DIR, "projects");
  const fileNames = fs
    .readdirSync(projectsDir)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort();
  const projetos = fileNames.map((fileName) => {
    const raw = fs.readFileSync(path.join(projectsDir, fileName), "utf-8");
    return validateProjeto(JSON.parse(raw) as unknown, fileName);
  });

  validateProjetosCollection(projetos);
  validateCompetenciasComEvidencia(getPerfil(), projetos);

  projetosCache = projetos;
  projetosPorSlugCache = new Map(projetos.map((projeto) => [projeto.slug, projeto]));
  return projetosCache;
}

export function getProjetoBySlug(slug: string): Projeto | undefined {
  getProjetos();
  return projetosPorSlugCache?.get(slug);
}

/**
 * Fichas de projeto implementado: o acervo de /projetos.
 *
 * Um estudo de caso afirma trabalho entregue, então só software que existe
 * entra nessa rota. O escopo planejado tem superfície própria (getRoadmap) com
 * vocabulário e peso visual distintos, para que a distinção não dependa de o
 * leitor notar um selo.
 */
export function getProjetosImplementados(): ProjetoImplementado[] {
  return getProjetos().filter((projeto): projeto is ProjetoImplementado => projeto.real);
}

/** Escopo planejado: descreve intenção, não entrega. Nunca vira estudo de caso. */
export function getRoadmap(): Projeto[] {
  return getProjetos().filter((projeto) => !projeto.real);
}
