import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import styles from "./SearchPage.module.css"

const SearchPage = () => {
  // Use os hooks useFetchDocuments para buscar os posts e os projetos
  const [query, setQuery] = useState();
  const { documents: posts } = useFetchDocuments('posts');
  const { documents: projects } = useFetchDocuments('projects');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.search_form}>
        <input type="text" placeholder="Busque por tags..." onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn-dark">Pesquisar</button>
      </form>
      <h3 className={styles.h3}>Todas as Publicações</h3>
      <div className={styles.publication_grid}>
        {/* Renderize os posts */}
        {posts && posts.map((post) => (
          <Link to={`/posts/${post.id}`} key={post.id} className={styles.publication_card}>
            <img  src={post.image} alt={post.title} />
            
            {/* Adicione mais informações do post se necessário */}
          </Link>
        ))}
        {/* Renderize os projetos */}
        {projects && projects.map((project) => (
          <Link to={`/project/${project.id}`} key={project.id} className={styles.publication_card}>
            <img src={project.image} alt={project.title} />
            {/* Adicione mais informações do projeto se necessário */}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
