import Link from 'next/link';
import type { Projeto } from '../../lib/types';
import ProjectStatusBadge from './ProjectStatusBadge';

export interface ProjectCardProps {
  projeto: Projeto;
}

export default function ProjectCard({ projeto }: ProjectCardProps) {
  return (
    <article data-testid="project-card">
      <h2>{projeto.titulo}</h2>
      <p>{projeto.resumo}</p>
      <ProjectStatusBadge status={projeto.status} />
      <span>{projeto.categoria}</span>
      <Link href={`/projetos/${projeto.slug}`}>Ver detalhes</Link>
    </article>
  );
}
