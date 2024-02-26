import styles from "./EditProject.module.css"; // Certifique-se de ajustar o caminho do CSS
import { MdEdit } from "react-icons/md";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthValue } from "../../../context/AuthContext";
import { useUpdateDocument } from "../../hooks/useUpadateDocument"; // Corrija o nome se necessário
import { useFetchDocument } from "../../hooks/useFetchDocument";

const EditProject = () => {
  const { id } = useParams();
  const { document: project } = useFetchDocument("projects", id);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [maxParticipants, setMaxParticipants] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setImage(project.image);
      setDescription(project.description);
      setMaxParticipants(project.maxParticipants);
      const textTags = project.tagsArray.join(",");
      setTags(textTags);
    }
  }, [project]);

  const { user } = useAuthValue();

  const { updateDocument, response } = useUpdateDocument("projects");

  const navigate = useNavigate();

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!isValidUrl(image)) {
      setFormError("A imagem precisa ser uma URL válida.");
      return;
    }

    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    if (!title || !image || !tags || !description) {
      setFormError("Por favor, preencha todos os campos.");
    }

    if (formError) return;

    const data = {
      title,
      image,
      description,
      tagsArray,
      maxParticipants: parseInt(maxParticipants, 10),
      uid: user.uid,
      createdBy: user.displayName,
    };

    updateDocument(id, data);

    navigate("/dashboard");
  };

  return (
    <div className={styles.edit_project}>
      {project && (
        <>
          <h2>Editando Projeto: {project.title}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Título:</span>
              <input
                type="text"
                name="title"
                required
                placeholder="Insira o título do projeto..."
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </label>
            {/* Remova a seção de URL da imagem se a imagem for carregada de outra forma */}
            <label>
              <span>Descrição:</span>
              <textarea
                name="description"
                required
                placeholder="Descreva o projeto"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              ></textarea>
            </label>
            <label>
              <span>Tags:</span>
              <input
                type="text"
                name="tags"
                required
                placeholder="Insira as tags separadas por vírgula"
                onChange={(e) => setTags(e.target.value)}
                value={tags}
              />
            </label>
            <label>
              <span>Máximo de Participantes:</span>
              <input
                type="number"
                name="maxParticipants"
                placeholder="Número máximo de participantes"
                onChange={(e) => setMaxParticipants(e.target.value)}
                value={maxParticipants}
              />
            </label>
            {!response.loading && <button className="btn btn-dark"><MdEdit size="1.5em"/></button>}
            {response.loading && <button className="btn" disabled>Aguarde...</button>}
            {(response.error || formError) && <p className="error">{response.error || formError}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default EditProject;