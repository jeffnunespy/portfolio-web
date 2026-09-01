import type { NaturezaProjeto, Projeto } from "./types";

// Valor de template em content/profile.json ainda não substituído por um
// e-mail real; usado para suprimir CTAs de mailto que falhariam silenciosamente.
export const EMAIL_PLACEHOLDER = "SEU-EMAIL@exemplo.com";

export function emailConfigurado(email: string): boolean {
  return email !== EMAIL_PLACEHOLDER;
}

/*
  O PDF só é oferecido quando existe um arquivo definitivo declarado no perfil.
  Um currículo desatualizado circula fora do site e contradiz o conteúdo que a
  validação de build garante — o mesmo raciocínio que suprime o e-mail de
  template. A rota /curriculo já apresenta o currículo por inteiro em HTML.
*/
export function curriculoConfigurado(linkCurriculo: string | undefined): linkCurriculo is string {
  return typeof linkCurriculo === "string" && linkCurriculo.length > 0;
}

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
