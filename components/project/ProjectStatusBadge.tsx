import { StatusProjeto } from '../../lib/types';

export interface ProjectStatusBadgeProps {
  status: StatusProjeto;
}

export default function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  return <span className="project-status-badge">{status}</span>;
}
