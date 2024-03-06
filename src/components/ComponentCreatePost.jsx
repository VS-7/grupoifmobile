// Importações necessárias
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../hooks/useInsertDocument';
import { useUploadDocument } from '../hooks/useUploadDocument';
import { FiImage, FiLink, FiTag } from 'react-icons/fi';
import { BiFontFamily } from "react-icons/bi";
import styles from './ComponentCreatePost.module.css';

const ComponentCreatePost = () => {
  // Estados do componente
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [links, setLinks] = useState("");
  const [formError, setFormError] = useState("");

  // Hooks personalizados e de roteamento
  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument("posts");

  const navigate = useNavigate();

  // Novos estados para controlar a exibição dos inputs
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinksInput, setShowLinksInput] = useState(false);
  const [showTagsInput, setShowTagsInput] = useState(false);

  // Funções para alternar a visibilidade dos inputs
  const toggleTitleInput = () => setShowTitleInput(!showTitleInput);
  const toggleImageInput = () => setShowImageInput(!showImageInput);
  const toggleLinksInput = () => setShowLinksInput(!showLinksInput);
  const toggleTagsInput = () => setShowTagsInput(!showTagsInput);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate image
    if (!image) {
      setFormError("Por favor, selecione uma imagem.");
      return;
    }

    // Create tags array
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    const linksArray = links.split(",").map((link) => link.trim());

    // Upload image to Firebase Storage
    try {
      const imageUrl = await useUploadDocument(image, "posts"); // assumindo que "posts" é o caminho no storage
      insertDocument({
        title,
        image: imageUrl,
        body,
        tagsArray,
        linksArray, // Incluído links no documento
        uid: user.uid,
        createdBy: user.displayName,
      });
      navigate("/");
    } catch (error) {
      setFormError("Erro ao fazer upload da imagem. Tente novamente.");
    }
  };

  // JSX do componente
  return (
    <div className={styles.create_post}>
      <form onSubmit={handleSubmit}>
        {/* Conteúdo */}
        {showTitleInput && (
        <input 
          type="text" 
          required 
          placeholder="Título da publicação" 
          onChange={(e) => setTitle(e.target.value)} 
          value={title}
          className={styles.input}
        />
        )}
        <textarea 
          required 
          placeholder="O que anda pesquisando?" 
          onChange={(e) => setBody(e.target.value)} 
          value={body}
          className={styles.textarea}
        ></textarea>
        
        {/* Botões para exibir inputs */}
        <div className={styles.buttons}>
        <button type="button" onClick={toggleTitleInput} className={styles.iconButton}><BiFontFamily /></button>
          <button type="button" onClick={toggleImageInput} className={styles.iconButton}><FiImage /></button>
          <button type="button" onClick={toggleLinksInput} className={styles.iconButton}><FiLink /></button>
          <button type="button" onClick={toggleTagsInput} className={styles.iconButton}><FiTag /></button>
          
          
        
  
        {/* Inputs que aparecem ao clicar nos botões correspondentes */}
        {showImageInput && (
          <input 
            type="file" 
            className={styles.fileInput} 
            accept="image/*" 
            onChange={handleImageChange}
          />
        )}
        {showLinksInput && (
          <input 
            type="text" 
            placeholder="Insira os links separados por vírgula" 
            onChange={(e) => setLinks(e.target.value)} 
            value={links}
          />
        )}
        {showTagsInput && (
          <input 
            type="text" 
            required 
            placeholder="Insira as tags separadas por vírgula" 
            onChange={(e) => setTags(e.target.value)} 
            value={tags}
          />
        )}
  
            
        {/* Botões e Erros */}
        {!response.loading && <button type="submit" className={styles.button}>Publicar</button>}
        {response.loading && <button className="btn" disabled>Publicando...</button>}
        </div>
        {(response.error || formError) && <p className="error">{response.error || formError}</p>}
        
      </form>
    </div>
  );
};

export default ComponentCreatePost;