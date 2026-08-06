import { getPerfil, getProjetos } from '../lib/content';
import ProjectCard from '../components/project/ProjectCard';

export default function Home() {
  const perfil = getPerfil();
  const projetos = getProjetos().filter((p) => p.destaque).slice(0, 6);

  return (
    <main>
      <h1>{perfil.tituloPosicionamento}</h1>
      <p>{perfil.descricaoPosicionamento}</p>

      <section>
        <h2>Competências</h2>
        {perfil.competenciasPorArea.map((area) => (
          <div key={area.area}>
            <h3>{area.area}</h3>
            <ul>
              {area.competencias.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Projetos em destaque</h2>
        {projetos.length === 0 ? (
          <p>Nenhum projeto em destaque no momento.</p>
        ) : (
          <div>
            {projetos.map((projeto) => (
              <ProjectCard key={projeto.slug} projeto={projeto} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
