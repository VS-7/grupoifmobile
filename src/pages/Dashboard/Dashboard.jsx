import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useAuthValue } from "../../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { FaProjectDiagram } from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user } = useAuthValue();
  const { documents: posts, loading: postsLoading } = useFetchDocuments("posts", null, user.uid);
  const { documents: projects, loading: projectsLoading } = useFetchDocuments("projects", null, user.uid);
  const { deleteDocument: deletePost } = useDeleteDocument("posts");
  const { deleteDocument: deleteProject } = useDeleteDocument("projects");
  
  const [activeTab, setActiveTab] = useState("posts");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const deleteDocument = activeTab === "posts" ? deletePost : deleteProject;
  const documents = activeTab === "posts" ? posts : projects;
  const loading = activeTab === "posts" ? postsLoading : projectsLoading;

  return (
    <div className={styles.dashboard}>
      <div className={styles.profile_section}>
        <img src='..assets/default.webp' alt="Perfil" className={styles.profile_photo} />
        {user.displayName}
        <div className={styles.profile_actions}>
          <Link to="/edit-profile" className="btn btn-dark">Editar Perfil</Link>
          <Link to="/dashboard/settings" className="btn btn-dark"><FaGear /></Link>
        </div>
      </div>
      <h3>Suas Publicações</h3>
      <div className={styles.tab_buttons}>
        <button className={`${styles.tab_button} ${activeTab === "posts" && styles.active}`} onClick={() => handleTabChange("posts")}><BsFillGrid3X3GapFill className={styles.icon}/></button>
        <button className={`${styles.tab_button} ${activeTab === "projects" && styles.active}`} onClick={() => handleTabChange("project")}><FaProjectDiagram className={styles.icon}/></button>
      </div>
      <div className={styles.posts_grid}>
        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : documents && documents.length > 0 ? (
          documents.map((document) => (
            <div className={styles.post_item} key={document.id}>
              <img src={document.image} alt={document.title} className={styles.post_image} />
              <div className={styles.post_actions}>
                <Link to={`/${activeTab}/${document.id}`} className={styles.buttons}>
                  <MdVisibility size="1em" /> {/* Ícone Ver */}
                </Link>
                <Link to={`/${activeTab}/edit/${document.id}`} className={styles.buttons}>
                  <MdEdit size="1em" /> {/* Ícone Editar */}
                </Link>
                <button
                  onClick={() => deleteDocument(document.id, document.image)}
                  className={styles.buttons}
                >
                  <MdDelete size="1em" /> {/* Ícone Excluir */}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noposts}>
            <p>Não foram encontradas publicações</p>
            <Link to={`/${activeTab}/create`} className="btn">
              Criar publicação
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;