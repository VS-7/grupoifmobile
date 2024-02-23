import React from 'react';
import { Link } from "react-router-dom";

import { useAuthValue } from "../../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import styles from "./Dashboard.module.css";



const Dashboard = () => {
  const { user } = useAuthValue();
  const { documents: posts, loading } = useFetchDocuments("posts", null, user.uid);
  const { deleteDocument } = useDeleteDocument("posts");

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.profile_section}>
        <img src={user.photoURL || "../assets/default.webp" } alt="Perfil" className={styles.profile_photo} />
        <div className={styles.profile_actions}>
          <Link to="/edit-profile" className="btn btn-dark">Editar Perfil</Link>
          <Link to="/settings" className="btn btn-dark"><FaGear /></Link>
        </div>
      </div>
      <h2>Suas Publicações</h2>
      <div className={styles.posts_grid}>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div className={styles.post_item} key={post.id}>
              <img src={post.image} alt={post.title} className={styles.post_image} />
              <div className={styles.post_actions}>
                <Link to={`/posts/${post.id}`} className="btn btn-dark">
                  <MdVisibility size="1em" /> {/* Ícone Ver */}
                </Link>
                <Link to={`/posts/edit/${post.id}`} className="btn btn-dark">
                  <MdEdit size="1em" /> {/* Ícone Editar */}
                </Link>
                <button
                  onClick={() => deleteDocument(post.id, post.image)}
                  className="btn btn-dark"
                >
                  <MdDelete size="1em" /> {/* Ícone Excluir */}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noposts}>
            <p>Não foram encontrados publicações</p>
            <Link to="/posts/create" className="btn">
              Criar publicação
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;