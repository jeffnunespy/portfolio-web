import { StatusProjeto } from "../../lib/types";

export interface ProjectStatusBadgeProps {
  status: StatusProjeto;
}

export default function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const modifier = status.toLocaleLowerCase("pt-BR").replaceAll(" ", "-");

  return <span className={`project-status-badge project-status-badge--${modifier}`}>{status}</span>;
}
