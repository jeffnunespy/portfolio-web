import { emailConfigurado, estadoRepositorio } from "../../lib/labels";
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
  const repositorio = estadoRepositorio(linkRepositorio);
  const podeContatar = emailConfigurado(contatoEmail);

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

      {repositorio === "privado" ? (
        <div className="private-code-note">
          <p>código privado — disponível mediante solicitação</p>
          {podeContatar ? (
            <a
              className="text-link"
              href={`mailto:${contatoEmail}?subject=Acesso ao código do projeto`}
            >
              Solicitar acesso ao código
            </a>
          ) : (
            <span className="muted-label">Contato para solicitação em configuração</span>
          )}
        </div>
      ) : repositorio === "publico" ? (
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
