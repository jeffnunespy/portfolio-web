import { emailConfigurado, estadoRepositorio } from "../../lib/labels";
import type { Projeto } from "../../lib/types";

export interface EvidenceLinkProps {
  contatoEmail: string;
  linkDemonstracao?: Projeto["linkDemonstracao"];
  linkRepositorio?: Projeto["linkRepositorio"];
  linkGithub?: string;
}

export default function EvidenceLink({
  contatoEmail,
  linkDemonstracao,
  linkRepositorio,
  linkGithub,
}: EvidenceLinkProps) {
  const repositorio = estadoRepositorio(linkRepositorio);
  const podeContatar = emailConfigurado(contatoEmail);

  // O que está disponível vem primeiro. A versão anterior abria com até três
  // indisponibilidades seguidas antes de qualquer destino navegável, e uma
  // ficha que começa por aquilo que não tem lê como acervo vazio mesmo quando
  // há evidência real logo abaixo.
  const temDestinoDireto = Boolean(linkDemonstracao) || repositorio === "publico";

  return (
    <div className="evidence-links">
      {linkDemonstracao ? (
        <a
          className="button button--secondary"
          href={linkDemonstracao}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir demonstração
        </a>
      ) : null}

      {repositorio === "publico" ? (
        <a
          className="button button--secondary"
          href={linkRepositorio}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver código-fonte
        </a>
      ) : null}

      {/*
        O perfil no GitHub só aparece quando o projeto não tem demonstração nem
        repositório informado, antes da nota "Código não disponível
        publicamente". Ele leva à página do proprietário, não a um código, e o
        rótulo diz isso. Repositório público tem o próprio link; repositório
        privado tem o pedido de acesso, e o perfil ao lado dele sugeriria um
        caminho para o código que o perfil não oferece.
      */}
      {!linkDemonstracao && repositorio === "indisponivel" && linkGithub ? (
        <a
          className="button button--secondary"
          href={linkGithub}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver perfil no GitHub
        </a>
      ) : null}

      {/*
        A ressalva vem depois do que se pode abrir, e uma vez só: declara a
        condição do código e o caminho de acesso, em vez de enumerar cada
        ausência como uma linha própria.
      */}
      {repositorio === "privado" ? (
        <div className="private-code-note">
          <p>
            O código-fonte deste projeto é privado e pode ser disponibilizado para avaliação
            mediante solicitação.
          </p>
          {podeContatar ? (
            <a
              className="text-link"
              href={`mailto:${contatoEmail}?subject=Acesso ao código do projeto`}
            >
              Solicitar acesso ao código
            </a>
          ) : (
            <span className="muted-label">Solicitações pelo LinkedIn, no rodapé desta página</span>
          )}
        </div>
      ) : !temDestinoDireto ? (
        <p className="availability-note">Código não disponível publicamente.</p>
      ) : null}
    </div>
  );
}
