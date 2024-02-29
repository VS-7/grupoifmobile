import styles from "./Project.module.css"; // Ajuste conforme necessário
import { IoIosArrowBack } from "react-icons/io";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useAuthValue } from "../../../context/AuthContext"; // Importe o contexto de autenticação
import { db } from "../../firebase/config";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const Project = () => {
    const { id } = useParams();
    const { document: project, loading, error } = useFetchDocument("projects", id);
    const { user } = useAuthValue();
    const navigate = useNavigate();

    const joinProject = async () => {
        if (!project || !user) return;

        const projectRef = doc(db, "projects", id);

        try {
            await updateDoc(projectRef, {
                participants: arrayUnion(user.uid) // Adicione o UID do usuário atual aos participantes
            });
            navigate(`/project/${id}`); // Redirecione ou atualize a página para refletir as mudanças
        } catch (err) {
            console.error("Erro ao entrar no projeto", err);
        }
    };

    // Ajuste para abrir diretamente o link único do projeto
    const openLink = () => {
        if(project.link) {
            window.open(project.link, '_blank');
        }
    };

    return (
        <div className={styles.project_container}>
            {loading && <div className="loading-container">
                             <div className="loader"></div>
                            <p className="loading-text">Carregando projeto...</p>
                         </div>}
            {error && <p>{error}</p>}
            {project && (
                <div>
                    <h1>{project.title}</h1>
                    <img src={project.image} alt={project.title} />
                    <h3>Descrição do projeto</h3>
                    <p className={styles.p_body}>{project.description}</p>
                    <div className={styles.tags}>
                        {project.tagsArray.map((tag) => (
                            <p key={tag}><span>#</span>{tag}</p>
                        ))}
                    </div>
                    <button onClick={joinProject} className="btn btn-outline">Participar do Projeto</button>
                    {project.link && (
                        <div>
                            <h3>Link do Projeto</h3>
                            <button onClick={openLink} className="btn btn-light">Acessar Projeto</button>
                        </div>
                    )}
                    <h3>Participantes</h3>
                    <ul className={styles.ul}>
                        {project.participants && project.participants.map((participantId) => (
                            <li key={participantId}>{/* Aqui deveria idealmente buscar o nome do participante usando o participantId */}</li>
                        ))}
                    </ul>
                    <Link to="/" className="btn btn-dark"><IoIosArrowBack size="1em"/> Voltar</Link>
                </div>
            )}
        </div>
    );
}

export default Project;