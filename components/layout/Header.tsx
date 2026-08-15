import Link from "next/link";

/**
 * Cabeçalho com navegação principal do portfólio.
 *
 * FR-005: fornece acesso, a partir de qualquer página pública, a página inicial,
 * listagem de projetos, página Sobre e currículo, nesta ordem da esquerda para a direita.
 * FR-021: não customiza ordem de tabulação (sem tabIndex positivo).
 * FR-022: usa marcos de navegação semânticos (<header>/<nav aria-label>).
 */
export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <span className="site-brand" aria-hidden="true">
          portfólio<span>.</span>
        </span>
        <nav className="site-nav" aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/projetos">Projetos</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/curriculo" className="nav-curriculo-destaque">
            Currículo
          </Link>
        </nav>
      </div>
    </header>
  );
}
