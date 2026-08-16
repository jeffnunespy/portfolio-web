import type { NaturezaProjeto, Projeto } from "./types";

export const NATUREZA_LABEL: Record<NaturezaProjeto, string> = {
  autoral: "Autoral",
  acadêmico: "Acadêmico",
  colaborativo: "Colaborativo",
  profissional: "Profissional",
};

export type EstadoRepositorio = "publico" | "privado" | "indisponivel";

// Centraliza a decisão dos três estados de repositório (FR-009a); a
// apresentação fica a cargo de cada componente.
export function estadoRepositorio(link: Projeto["linkRepositorio"]): EstadoRepositorio {
  if (link === "privado") {
    return "privado";
  }
  return link ? "publico" : "indisponivel";
}
