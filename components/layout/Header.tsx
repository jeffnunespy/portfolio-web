"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS_NAVEGACAO = [
  { href: "/", rotulo: "Início", rotuloCompacto: "Início", prioritario: true },
  { href: "/projetos", rotulo: "Projetos", rotuloCompacto: "Projetos", prioritario: true },
  { href: "/roadmap", rotulo: "Roadmap", rotuloCompacto: "Plano", prioritario: false },
  { href: "/sobre", rotulo: "Sobre", rotuloCompacto: "Sobre", prioritario: false },
  { href: "/curriculo", rotulo: "Currículo", rotuloCompacto: "CV", prioritario: false },
] as const;

/**
 * Cabeçalho com navegação principal do portfólio.
 *
 * FR-005: fornece acesso, a partir de qualquer página pública, a página inicial,
 * listagem de projetos, roadmap, página Sobre e currículo, nesta ordem.
 * FR-021: não customiza ordem de tabulação (sem tabIndex positivo).
 * FR-022: usa marcos de navegação semânticos (<header>/<nav aria-label>).
 */
export default function Header({ nome }: { nome: string }) {
  // usePathname devolve null fora de um contexto de rotas; sem rota conhecida,
  // nenhum item é marcado como atual e o destaque do currículo permanece.
  const pathname = usePathname() ?? "";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/" aria-label={`${nome} — Início`}>
          {nome}
        </Link>
        <nav className="site-nav" aria-label="Navegação principal">
          {ITENS_NAVEGACAO.map(({ href, rotulo, rotuloCompacto, prioritario }) => {
            // "/" só casa exato; as demais também cobrem suas subrotas,
            // para /projetos/<slug> continuar marcando "Projetos".
            const ativo = href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-label={rotulo}
                aria-current={ativo ? "page" : undefined}
                // O destaque do currículo é a saída principal do fichário e só
                // aparece quando ele não é a página atual — assim o realce de
                // "aba ativa" nunca compete com o do item em que se está.
                className={`${prioritario ? "site-nav__item--primary" : "site-nav__item--secondary"}${href === "/curriculo" && !ativo ? " nav-curriculo-destaque" : ""}`}
              >
                <span className="site-nav__label--full">{rotulo}</span>
                <span className="site-nav__label--compact" aria-hidden="true">
                  {rotuloCompacto}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
