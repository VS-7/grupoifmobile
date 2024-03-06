// CSS
import styles from "./Home.module.css";

// Hooks
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";

// Components
import PostDetail from "../../components/PostDetail";
import ProjectDetail from "../../components/ProjectDetail"; // Certifique-se de importar
import CreatePost from "../../components/ComponentCreatePost";
import CreateProject from "../../components/ComponentCreateProject";

import { FaGear } from "react-icons/fa6";

const Home = () => {
  const [query, setQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(true); // Inicializa como true para exibir por padrão
  const [showCreateProject, setShowCreateProject] = useState(false); // Mantém oculto até ser solicitado

  const { documents: posts, loading: loadingPosts } = useFetchDocuments("posts");
  const { documents: projects, loading: loadingProjects } = useFetchDocuments("projects");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      navigate(`/search?q=${query}`);
    }
  };

  // Funções para alternar a visibilidade dos componentes
  const toggleCreatePostVisibility = () => {
    setShowCreatePost(true);
    setShowCreateProject(false); // Esconde CreateProject quando CreatePost é mostrado
  };

  const toggleCreateProjectVisibility = () => {
    setShowCreateProject(true);
    setShowCreatePost(false); // Esconde CreatePost quando CreateProject é mostrado
  };

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        {/* Botões atualizados para controlar a visibilidade dos componentes */}
        <button className={styles.btnHeader} onClick={toggleCreatePostVisibility}>Publicação</button>
        <button className={styles.btnHeader} onClick={toggleCreateProjectVisibility}>Projeto</button>
        <Link to="/config" className={styles.btnConfig}><FaGear /></Link>
      </div>
      {/* Renderiza condicionalmente os componentes baseado no estado */}
      {showCreatePost && <CreatePost />}
      {showCreateProject && <CreateProject />}
      <form onSubmit={handleSubmit} className={styles.search_form}>
        <input className={styles.input} type="text" placeholder="Busque por tags..." onChange={(e) => setQuery(e.target.value)} />
        <button className={styles.btnSearch}>Pesquisar</button>
      </form>
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
