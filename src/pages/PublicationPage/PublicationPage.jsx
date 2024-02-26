import React from 'react';
import { Link } from 'react-router-dom';
import styles from'./Publication.module.css'; 

const PublicationPage = () => {
  return (
    <div className={styles.publication}>
      <h2>O que deseja publicar?</h2>
      <p className={styles.p_publication}>Faça uma publicação e ajude a comunidade.</p>
      <div>
        <Link to="/posts/create">
          <div className={styles.cardEscolha}>
          <h3>Criar Publicação ✨</h3>
          <p>Escolha caso queira criar uma nova publicação e compartilhar algo</p>
          </div>
        </Link>
        <Link to="/project/create">

        <div className={styles.cardEscolha}>
         <h3>Criar Projeto 📝</h3>
         <p>Escolha caso queira criar um novo projeto para desenvolver sozinho ou com amigos.</p>
         </div>
        </Link>
      </div>
    </div>
  );
};

export default PublicationPage;