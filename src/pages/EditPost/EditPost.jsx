import styles from "./EditPost.module.css"
import { MdEdit } from "react-icons/md";

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuthValue } from "../../../context/AuthContext"
import { useUpdateDocument } from "../../hooks/useUpadateDocument"
import { useFetchDocument} from "../../hooks/useFetchDocument"

const EditPost = () => {
  const {id} = useParams()
  const {document: post} = useFetchDocument("posts", id)

  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState([])
  const [link, setLink] = useState(""); // Estado adicionado para o link
  const [formError, setFormError] = useState("");

  useEffect(() =>{
    
    if(post){
      setTitle(post.title)
      setBody(post.body)
      setImage(post.image)
      setLink(post.link); // Atualize com o link do post
      const textTags = post.tagsArray.join(",");

      setTags(textTags);
    }
  }, [post]);

  const { user } = useAuthValue()

  const { updateDocument, response} = useUpdateDocument("posts")

  const navigate = useNavigate()

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

    // criar o array de tags
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase())

    // checar todos os valores
    if(!title || !image || !tags || !body) {
      setFormError("Por favor, preencha todos os campos.")
    }
    if(formError) return;

    const data = {
      title,
      image,
      body,
      tagsArray,
      link, // Inclua o link nos dados atualizados
      uid: user.uid,
      createdBy: user.displayName
    };

    updateDocument(id, data)

    // redirect home page
    navigate("/dashboard")

  }

  return (
    <div className={styles.edit_post}>
      {post && (
        <>
          <h2>Editando publicação: {post.title}</h2>
          <p>Altere os dados do post como desejar!</p>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Titulo:</span>
              <input 
                type="text" 
                name="title" 
                required 
                placeholder="Pense em um bom título..."
                onChange={(e) => setTitle(e.target.value)} 
                value={title}/>
            </label>
            <label>
            {/*  <span>URL da imagem:</span>
              <input 
                type="text" 
                name="image" 
                required 
                placeholder="Insira uma imagem que representa  seu post"
                onChange={(e) => setImage(e.target.value)} 
                value={image}
              /> 
      <p className={styles.preview_title}>Preview da imagem atual:</p> */}
              <img 
                className={styles.image_preview} 
                src={post.image} 
                alt={post.title}/>
            </label>
            <label>
              <span>Conteúdo:</span>
              <textarea 
                name="body" 
                required 
                placeholder="Insira o conteúdo do post"
                onChange={(e) => setBody(e.target.value)}
                value={body}
              ></textarea>
            </label>
             <label>
              <span>Link:</span>
              <input
                type="text"
                name="link"
                required
                placeholder="Insira o link relacionado ao post"
                onChange={(e) => setLink(e.target.value)}
                value={link}
              />
            </label>
            <label>
              <span>Tags:</span>
              <input 
                type="text" 
                name="tags" 
                required 
                placeholder="Insira as tags separadas por vírgula"
                onChange={(e) => setTags(e.target.value)} 
                value={tags}/>
            </label>
            {!response.loading && <button className="btn btn-dark"><MdEdit size="1.5em"/></button>}
            {response.loading && (
            <button className="btn" disabled>
              Aguarde...
            </button>
          )}
          {(response.error || formError) && (
            <p className="error">{response.error || formError}</p>
          )}
          </form>
        </>
      )}
    </div>
  )
}

export default EditPost