// CSS
import styles from "./Home.module.css";

// Hooks
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";

// Components
import PostDetail from "../../components/PostDetail";
import ProjectDetail from "../../components/ProjectDetail"; // Certifique-se de importar
import { CiSearch } from "react-icons/ci";

const Home = () => {
  const [query, setQuery] = useState();
  const { documents: posts, loading: loadingPosts } = useFetchDocuments("posts");
  const { documents: projects, loading: loadingProjects } = useFetchDocuments("projects"); // Simula um hook para buscar projetos

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className={styles.home}>
    <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Busque por tags..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <button onClick={handleSubmit} className={styles.searchButton}>
          <CiSearch />
        </button>
      </div>
      <div className={styles.projects_section}>
        <h3 className={styles.h3}>Veja nossos projetos</h3>
        <div className={styles.projects_scroll}>
          {loadingProjects && <p>Carregando projetos...</p>}
          {projects && projects.map((project) => <ProjectDetail key={project.id} project={project} />)}
        </div>
      </div>
      <div>
        <h3 className={styles.h3}>Publicações</h3>
        {loadingPosts && <p>Carregando...</p>}
        {posts && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts</p>
            <Link to="/posts/create" className="btn">Seja o primeiro a publicar!</Link>
          </div>
        )}
        {posts && posts.map((post) => <PostDetail key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default Home;