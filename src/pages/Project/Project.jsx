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
                    <p>{project.description}</p>
                    <div className={styles.tags}>
                        {project.tagsArray.map((tag) => (
                            <p key={tag}><span>#</span>{tag}</p>
                        ))}
                    </div>
                    <button onClick={joinProject} className="btn btn-outline">Participar do Projeto </button>
                    <h3>Participantes</h3>
                    <ul className={styles.ul}>
                        {/* Supondo que project.participants seja uma lista de IDs de usuário */}
                        {project.participants && project.participants.map((participantId) => (
                            <li key={participantId}>{user.displayName}</li> // Idealmente, substitua participantId por nome ou email
                        ))}
                    </ul>
                    <Link to="/" className="btn btn-dark"><IoIosArrowBack size="1em"/> Voltar</Link>
                </div>
            )}
           
        </div>
    );
}

export default Project;