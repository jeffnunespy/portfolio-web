import type { Metadata } from "next";
import { getPerfil } from "../../lib/content";
import { emailConfigurado } from "../../lib/labels";

/*
  Aviso de privacidade (FR-030, AUD13-001). O texto descreve somente práticas
  confirmadas pelo proprietário em 2026-11-23 e o que as políticas oficiais dos
  provedores declaram. Não atribui à Vercel ou ao Google papel de operador nem
  prazos de retenção que essas fontes não informam. Ao mudar qualquer prática,
  atualize o texto e ULTIMA_ATUALIZACAO juntos.
*/
const ULTIMA_ATUALIZACAO = { iso: "2026-11-23", texto: "23 de novembro de 2026" };

const LINKS = {
  lgpd: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm",
  anpd: "https://www.gov.br/anpd/pt-br/assuntos/denuncia-de-descumprimento-da-lgpd",
  vercel: "https://vercel.com/legal/privacy-notice",
  google: "https://policies.google.com/privacy?hl=pt-BR",
} as const;

const externo = { target: "_blank", rel: "noopener noreferrer" } as const;

export function generateMetadata(): Metadata {
  const perfil = getPerfil();

  const descricao = `Aviso de privacidade do portfólio de ${perfil.nome}: dados técnicos da hospedagem, mensagens por e-mail, conservação e direitos previstos na LGPD.`;

  return {
    title: "Privacidade",
    description: descricao,
    alternates: { canonical: "/privacidade" },
    openGraph: {
      type: "website",
      title: "Privacidade",
      description: descricao,
      url: "/privacidade",
    },
  };
}

export default function PrivacyPage() {
  const perfil = getPerfil();
  const email = perfil.contato.valor;

  // Sem canal confirmado o aviso não cumpre FR-030; falhar no build é
  // preferível a publicar um endereço de modelo como canal do titular.
  if (!emailConfigurado(email)) {
    throw new Error("Aviso de privacidade exige o e-mail de contato real em content/profile.json.");
  }

  const linkEmail = <a href={`mailto:${email}`}>{email}</a>;

  return (
    <article className="privacy-page">
      <header>
        <h1>Privacidade</h1>
        <p className="privacy-page__lead">
          O que a hospedagem registra quando você acessa este portfólio e o que acontece com as
          mensagens que você decide enviar por e-mail.
        </p>
        <p className="page-intro__meta">
          Última atualização:{" "}
          <time dateTime={ULTIMA_ATUALIZACAO.iso}>{ULTIMA_ATUALIZACAO.texto}</time>
        </p>
      </header>

      <section aria-labelledby="privacy-summary">
        <h2 id="privacy-summary">Em resumo</h2>
        <div className="privacy-page__body">
          <p>
            O código do portfólio não define cookies e não usa formulários, cadastro, analytics nem
            ferramentas de rastreamento. Dados pessoais chegam por dois caminhos: os dados técnicos
            que a hospedagem recebe para entregar as páginas e as mensagens que você escolhe enviar
            por e-mail.
          </p>
        </div>
      </section>

      <section aria-labelledby="privacy-controller">
        <h2 id="privacy-controller">Quem é o responsável</h2>
        <div className="privacy-page__body">
          <p>
            {perfil.nome}, autor do portfólio, decide sobre os dados pessoais tratados por este site
            e sobre as mensagens recebidas no e-mail de contato. É o papel que a{" "}
            <a href={LINKS.lgpd} {...externo}>
              Lei Geral de Proteção de Dados Pessoais
            </a>{" "}
            (LGPD, Lei nº&nbsp;13.709/2018) chama de controlador.
          </p>
          <p>Contato: {linkEmail}</p>
        </div>
      </section>

      <section aria-labelledby="privacy-access">
        <h2 id="privacy-access">Dados técnicos do acesso</h2>
        <div className="privacy-page__body">
          <p>
            A Vercel hospeda e entrega as páginas e, para isso, recebe dados técnicos da conexão.
            Segundo o aviso de privacidade da provedora, eles incluem o endereço IP, a cidade e o
            país estimados a partir do IP e informações de configuração do sistema usado no acesso.
          </p>
          <p>
            O portfólio usa a hospedagem apenas para publicar e entregar as páginas. O aviso da
            Vercel descreve as finalidades próprias da provedora e seus critérios gerais de
            conservação.
          </p>
        </div>
      </section>

      <section aria-labelledby="privacy-email">
        <h2 id="privacy-email">Mensagens por e-mail</h2>
        <div className="privacy-page__body">
          <p>
            Os links de e-mail do portfólio (<code>mailto:</code>) apenas abrem uma nova mensagem no
            seu aplicativo de e-mail. Nada é enviado até você decidir enviar.
          </p>
          <p>
            Se você enviar, o endereço do remetente, o conteúdo e eventuais anexos chegam à caixa do
            Gmail usada como contato. Somente {perfil.nome} tem acesso direto a essa caixa, e as
            mensagens são usadas exclusivamente para responder a contatos e propostas profissionais.
          </p>
        </div>
      </section>

      <section aria-labelledby="privacy-retention">
        <h2 id="privacy-retention">Conservação das mensagens</h2>
        <div className="privacy-page__body">
          <p>
            As mensagens de contatos sem continuidade são conservadas por até 12 meses após a última
            interação. A caixa também é revisada a cada seis meses para identificar e excluir
            mensagens desnecessárias.
          </p>
          <p>
            Mensagens ligadas a negociações, projetos ou obrigações legais podem ser conservadas
            pelo período necessário a essas finalidades.
          </p>
        </div>
      </section>

      <section aria-labelledby="privacy-providers">
        <h2 id="privacy-providers">Provedores</h2>
        <div className="privacy-page__body">
          <dl className="privacy-providers">
            <div>
              <dt>Vercel</dt>
              <dd>
                Hospedagem e entrega das páginas. A Vercel informa que pode armazenar e tratar dados
                fora do país de residência de quem acessa.{" "}
                <a href={LINKS.vercel} hrefLang="en" {...externo}>
                  Aviso de privacidade da Vercel (em inglês)
                </a>
              </dd>
            </div>
            <div>
              <dt>Google</dt>
              <dd>
                Gmail, a caixa do e-mail de contato.{" "}
                <a href={LINKS.google} {...externo}>
                  Política de Privacidade do Google
                </a>
              </dd>
            </div>
          </dl>
          <p>
            Cada política descreve como o provedor trata os dados. Este aviso não define se cada
            provedor atua como controlador ou operador: isso depende dos termos de cada serviço.
          </p>
        </div>
      </section>

      <section aria-labelledby="privacy-rights">
        <h2 id="privacy-rights">Seus direitos</h2>
        <div className="privacy-page__body">
          <p>A LGPD garante ao titular dos dados, entre outros, os direitos de:</p>
          <ul className="privacy-rights" role="list">
            <li>confirmar se há tratamento dos seus dados e ter acesso a eles;</li>
            <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>
              pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários, excessivos
              ou tratados em desconformidade com a lei;
            </li>
            <li>saber com quais entidades públicas e privadas os dados foram compartilhados.</li>
          </ul>
          <p>
            Para exercer esses direitos, escreva para {linkEmail}, o mesmo endereço de contato do
            portfólio. A LGPD prevê que o atendimento seja sem custo para o titular.
          </p>
          <p>
            A eliminação pode não alcançar dados que a lei permite conservar, por exemplo para
            cumprir obrigação legal ou regulatória.
          </p>
          <p>
            Se a solicitação não for atendida, você pode apresentar uma{" "}
            <a href={LINKS.anpd} {...externo}>
              petição à Agência Nacional de Proteção de Dados (ANPD)
            </a>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="privacy-links">
        <h2 id="privacy-links">Links externos</h2>
        <div className="privacy-page__body">
          <p>
            Os links para GitHub, LinkedIn, sites de projetos e políticas de terceiros abrem outros
            serviços em uma nova aba, configurados para não informar ao destino de qual página você
            veio. A partir daí, vale a política de privacidade do serviço de destino.
          </p>
          <p>
            O portfólio não carrega conteúdo desses serviços para exibir os links: enquanto você
            navega por aqui, nada é solicitado a eles.
          </p>
          <p>
            Os links de e-mail são diferentes: não abrem um site, e sim o seu aplicativo de e-mail,
            como descrito acima.
          </p>
        </div>
      </section>
    </article>
  );
}
