import Link from 'next/link';

export interface FooterProps {
  linkCurriculo: string;
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
export default function Footer({
  linkCurriculo,
  linkGithub,
  linkLinkedin,
  contatoEmail,
}: FooterProps): JSX.Element {
  const anoAtual = new Date().getFullYear();

  return (
    <footer>
      <nav aria-label="Links secundários">
        <Link href="/">Início</Link>
        <Link href="/projetos">Projetos</Link>
        <Link href="/sobre">Sobre</Link>
        <Link href={linkCurriculo}>Currículo</Link>
        <a href={linkGithub} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={linkLinkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={`mailto:${contatoEmail}`}>Contato</a>
      </nav>
      <p>
        &copy; {anoAtual} [Nome do Titular]. Todos os direitos reservados.
      </p>
    </footer>
  );
}
