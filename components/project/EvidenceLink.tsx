import type { Projeto } from "../../lib/types";

export interface EvidenceLinkProps {
  contatoEmail: string;
  linkDemonstracao?: Projeto["linkDemonstracao"];
  linkRepositorio?: Projeto["linkRepositorio"];
}

export default function EvidenceLink({
  contatoEmail,
  linkDemonstracao,
  linkRepositorio,
}: EvidenceLinkProps) {
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
      ) : (
        <p className="availability-note">Demonstração pública não disponível.</p>
      )}

      {linkRepositorio === "privado" ? (
        <div className="private-code-note">
          <p>código privado — disponível mediante solicitação</p>
          <a
            className="text-link"
            href={`mailto:${contatoEmail}?subject=Acesso ao código do projeto`}
          >
            Solicitar acesso ao código
          </a>
        </div>
      ) : linkRepositorio ? (
        <a
          className="button button--secondary"
          href={linkRepositorio}
          target="_blank"
          rel="noopener noreferrer"
        >
          Acessar repositório
        </a>
      ) : (
        <p className="availability-note">Código não disponível publicamente.</p>
      )}
    </div>
  );
}
