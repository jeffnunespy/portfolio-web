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
        {/* Rotas globais já estão disponíveis no cabeçalho. Evitar o prefetch
            duplicado do rodapé reduz trabalho especulativo em páginas curtas. */}
        <nav className="footer-nav" aria-label="Links secundários">
          <Link href="/" prefetch={false}>
            Início
          </Link>
          <Link href="/projetos" prefetch={false}>
            Projetos
          </Link>
          <Link href="/roadmap" prefetch={false}>
            Roadmap
          </Link>
          <Link href="/sobre" prefetch={false}>
            Sobre
          </Link>
          <Link href="/curriculo" prefetch={false}>
            Currículo
          </Link>
        </nav>
        <section className="footer-contact" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">Vamos conversar.</h2>
          <p>
            {podeContatar
              ? "Para conversar sobre os projetos ou oportunidades, envie um e-mail ou fale pelo LinkedIn."
              : "Conheça o código no GitHub ou converse pelo LinkedIn."}
          </p>
          <div className="footer-contact__actions">
            {podeContatar ? (
              <a className="button button--primary" href={`mailto:${contatoEmail}`}>
                Enviar e-mail
              </a>
            ) : (
              <span className="muted-label">E-mail em configuração</span>
            )}
            <a href={linkLinkedin} target="_blank" rel="noopener noreferrer">
              Falar pelo LinkedIn
            </a>
            <a href={linkGithub} target="_blank" rel="noopener noreferrer">
              Ver GitHub
            </a>
          </div>
        </section>
        <p>
          &copy; {anoAtual} {nome}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
