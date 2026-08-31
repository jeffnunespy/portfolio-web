export type StatusProjeto = "Em andamento" | "Concluído" | "Pausado" | "Arquivado";

export type NaturezaProjeto = "autoral" | "acadêmico" | "colaborativo" | "profissional";

export interface DecisaoRelevante {
  titulo: string;
  descricao: string;
}

export interface Projeto {
  slug: string;
  titulo: string;
  resumo: string;
  problemaTratado: string;
  status: StatusProjeto;
  categoria: string;
  natureza: NaturezaProjeto;
  tecnologias: string[];
  imagemApresentacao: string;
  competenciasDemonstradas: string[];
  contexto: string;
  objetivo: string;
  funcionalidadesPrincipais: string[];
  responsabilidadeProprietario: string;
  decisoesRelevantes: DecisaoRelevante[];
  stack: string[];
  limitacoesConhecidas: string[];
  proximosPassos: string[];
  linkDemonstracao?: string;
  // "privado" substitui o link quando o repositório não é público (FR-009a).
  linkRepositorio?: string | "privado";
  destaque: boolean;
  // false identifica rascunho de estrutura de conteúdo: o software descrito
  // ainda não existe. Evita apresentar placeholder como entrega real
  // (princípio "evidências acima de afirmações").
  real: boolean;
}

export interface CompetenciaPorArea {
  area: string;
  competencias: string[];
}

export interface ContatoPerfil {
  tipo: "email";
  valor: string;
}

export interface PerfilProfissional {
  tituloPosicionamento: string;
  descricaoPosicionamento: string;
  competenciasPorArea: CompetenciaPorArea[];
  biografiaSobre: string;
  linkCurriculo: string;
  linkGithub: string;
  linkLinkedin: string;
  contato: ContatoPerfil;
}
