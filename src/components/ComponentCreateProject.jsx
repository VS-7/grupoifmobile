// Importações necessárias
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../hooks/useInsertDocument';
import { useUploadDocument } from '../hooks/useUploadDocument';
import { FiImage, FiLink, FiTag, FiType } from 'react-icons/fi';
import { BiFontFamily } from "react-icons/bi";
import styles from './ComponentCreatePost.module.css'; // Pode ser necessário ajustar o caminho do CSS

const ComponentCreateProject = () => {
  // Estados do componente
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [links, setLinks] = useState("");
  const [formError, setFormError] = useState("");

  // Hooks personalizados e de roteamento
  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument("projects"); // Alterado para "projects"
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

    // Validar imagem
    if (!image) {
      setFormError("Por favor, selecione uma imagem.");
      return;
    }

    // Criar arrays de tags e links
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
    const linksArray = links.split(",").map((link) => link.trim());

    // Upload da imagem para o Firebase Storage
    try {
      const imageUrl = await useUploadDocument(image, "projects"); // Alterado para "projects"
      insertDocument({
        title,
        image: imageUrl,
        description,
        tagsArray,
        linksArray,
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
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Input para o título do projeto */}
        {showTitleInput && (
        <input 
          type="text" 
          required 
          placeholder="Título do projeto" 
          onChange={(e) => setTitle(e.target.value)} 
          value={title}
          className={styles.input}
        />
        )}

        {/* Input para a descrição do projeto */}
        <textarea 
          required 
          placeholder="Descreva como será seu projeto..." 
          onChange={(e) => setDescription(e.target.value)} 
          value={description}
          className={styles.textarea}
        ></textarea>

        {/* Botões para exibir inputs de imagem, links e tags */}
        <div className={styles.buttons}>
        <button type="button" onClick={toggleTitleInput} className={styles.iconButton}><FiType /></button>
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
        </div>

        {/* Botões e Erros */}
        {!response.loading && <button type="submit" className={styles.button}>Publicar</button>}
        {response.loading && <button className="btn" disabled>Publicando...</button>}
        {(response.error || formError) && <p className="error">{response.error || formError}</p>}
      </form>
    </div>
  );
};

export default ComponentCreateProject;
