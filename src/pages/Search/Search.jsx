import styles from "./Search.module.css";
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useQuery } from '../../hooks/useQuery';
import { Link } from 'react-router-dom';
import ProjectDetail from '../../components/ProjectDetail'; // Importe o componente ProjectDetail
import PostDetail from "../../components/PostDetail";
import { CiCamera } from "react-icons/ci";

const Search = () => {
  const query = useQuery();
  const search = query.get("q");

  // Use o hook useFetchDocuments para buscar documentos de projetos
  const { documents: posts, loading } = useFetchDocuments("posts", search);
  const { documents: projects, loading: loadingProjects } = useFetchDocuments("projects", search);

  return (
    <div className={styles.search_container}>
      <h2>Pesquisar</h2>
      <div>
        {loading || loadingProjects ? ( // Verifique se algum dos dois está carregando
          <p>Carregando...</p>
        ) : (
          <>
            {(!posts || posts.length === 0) && (!projects || projects.length === 0) && ( // Verifique se ambos os resultados de pesquisa estão vazios
              <div className={styles.noposts}>
                <p>Não foram encontrados posts ou projetos a partir da sua busca...</p>
                <p><CiCamera size="15em" color="gray"/></p>
                <Link to="/" className='btn btn-dark'>
                  Voltar
                </Link>
              </div>
            )}
            {/* Mapeie e exiba os resultados dos posts */}
            {posts && posts.map((post) => (
              <PostDetail key={post.id} post={post} />
            ))}
            {/* Mapeie e exiba os resultados dos projetos */}
            {projects && projects.map((project) => (
              <ProjectDetail key={project.id} project={project} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Search;