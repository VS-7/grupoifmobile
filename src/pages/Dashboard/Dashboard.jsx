import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuthValue } from "../../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";
import { collection, getDocs, getDoc, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config'; // Ajuste o caminho conforme necessário
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
  const [userDetails, setUserDetails] = useState({ bio: '', profileImage: '' });
  const [interestRequests, setInterestRequests] = useState([]);


  useEffect(() => {
    const fetchInterestRequests = async () => {
      const projectIds = projects ? projects.map(p => p.id) : [];
      const querySnapshot = await getDocs(query(collection(db, "projectInterests"), where("projectId", "in", projectIds.length > 0 ? projectIds : ["dummy"])));
      const interests = [];
      const userFetchPromises = [];
      
      querySnapshot.forEach((doc) => {
        // Para cada solicitação, buscamos os detalhes do usuário
        userFetchPromises.push(fetchUserDetailsById(doc.data().userId).then(userName => {
          interests.push({ id: doc.id, ...doc.data(), userName: userName });
        }));
      });
      
      // Aguardamos todas as buscas de usuários
      await Promise.all(userFetchPromises);
  
      setInterestRequests(interests);
    };
  
    if (projects && projects.length > 0) {
      fetchInterestRequests();
    }
  }, [projects]);
  
  // Função auxiliar para buscar detalhes do usuário pelo ID
  const fetchUserDetailsById = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      // Supondo que o nome do usuário está armazenado sob a chave 'displayName'
      return docSnap.data().displayName;
    } else {
      console.log("No such document!");
      return "Usuário Desconhecido";
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchUserDetails();
  }, [user.uid]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAccept = async (requestId) => {
    const interestRef = doc(db, "projectInterests", requestId);
    await updateDoc(interestRef, {
      status: 'accepted'
    });
    // Atualiza a lista de solicitações para refletir a mudança
    setInterestRequests(interests => interests.map(i => i.id === requestId ? { ...i, status: 'accepted' } : i));
  };
  
  const handleReject = async (requestId) => {
    const interestRef = doc(db, "projectInterests", requestId);
    await updateDoc(interestRef, {
      status: 'rejected'
    });
    // Atualiza a lista de solicitações para refletir a mudança
    setInterestRequests(interests => interests.map(i => i.id === requestId ? { ...i, status: 'rejected' } : i));
  };

  const deleteDocument = activeTab === "posts" ? deletePost : deleteProject;
  const documents = activeTab === "posts" ? posts : projects;
  const loading = activeTab === "posts" ? postsLoading : projectsLoading;

  return (
    <div className={styles.dashboard}>
       <div className={styles.profile_section}>
        <img src={userDetails.profileImage || '/path/to/default/avatar.png'} alt="Profile" className={styles.profile_avatar} />
        <h2>{user.displayName}</h2>
        <span>{user.email}</span>
        <p>{userDetails.bio || 'Nenhuma biografia adicionada.'}</p>
        <div className={styles.profile_actions}>
          <Link to="/dashboard/edit-profile" className={styles.btn}>Editar Perfil</Link>
          <Link to="/dashboard/settings" className={styles.btnConfig}><FaGear /></Link>
        </div>
              <div className={styles.interestRequestsSection}>
        <h2>Solicitações de Participação</h2>
            {interestRequests.map(request => (
        <div key={request.id} className={styles.interestRequest}>
          <p>{request.userName}: {request.reason}</p>
          <div>
            <button onClick={() => handleAccept(request.id)}>Aceitar</button>
            <button onClick={() => handleReject(request.id)}>Rejeitar</button>
          </div>
        </div>
      ))}
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