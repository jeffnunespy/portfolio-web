import Link from "next/link";
import { emailConfigurado } from "../../lib/labels";

export interface FooterProps {
  nome: string;
  linkGithub: string;
  linkLinkedin: string;
  contatoEmail: string;
}

/**
 * Rodapé com links essenciais e informação de titularidade do conteúdo.
 *
 * FR-017: contato via link mailto direto, sem formulário.
 * FR-018: rodapé contém links de navegação, currículo/GitHub/LinkedIn,
 * meio de contato e informação de titularidade/direitos do conteúdo.
 * FR-021: não customiza ordem de tabulação (sem tabIndex positivo).
 * FR-022: usa marcos de navegação semânticos (<footer>/<nav aria-label>).
 */
export default function Footer({ nome, linkGithub, linkLinkedin, contatoEmail }: FooterProps) {
  const anoAtual = new Date().getFullYear();
  const podeContatar = emailConfigurado(contatoEmail);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <nav className="footer-nav" aria-label="Links secundários">
          <Link href="/">Início</Link>
          <Link href="/projetos">Projetos</Link>
          <Link href="/roadmap">Roadmap</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/curriculo">Currículo</Link>
          <a href={linkGithub} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={linkLinkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          {podeContatar ? (
            <a href={`mailto:${contatoEmail}`}>Contato</a>
          ) : (
            <a href={linkLinkedin} target="_blank" rel="noopener noreferrer">
              Contato pelo LinkedIn
            </a>
          )}
        </nav>
        <p>
          &copy; {anoAtual} {nome}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
