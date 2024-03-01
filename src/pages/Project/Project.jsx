import styles from "./Project.module.css"; // Ajuste conforme necessário
import { useEffect, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useAuthValue } from "../../../context/AuthContext"; // Importe o contexto de autenticação
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { MdOutlinePersonPin } from "react-icons/md";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { AiFillLike } from "react-icons/ai";
import confetti from 'canvas-confetti';

const Project = () => {
    const { id } = useParams();
    const { document: project, loading, error } = useFetchDocument("projects", id);
    const [participantsDetails, setParticipantsDetails] = useState([]);
    const { user } = useAuthValue();
    const navigate = useNavigate();



    const joinProject = async () => {
        if (!project || !user) return;
    
        // Checagem se o limite de participantes foi alcançado
        if (project.currentParticipants >= project.maxParticipants) {
            console.error("Limite de participantes alcançado.");
            return; // Não permitir mais participantes
        }
    
        const projectRef = doc(db, "projects", id);
    
        try {
            // Atualiza tanto a lista de participantes quanto o contador de participantes
            await updateDoc(projectRef, {
                participants: arrayUnion(user.uid), // Adiciona usuário aos participantes
                currentParticipants: increment(1) // Usa o operador increment do Firestore para adicionar +1
            });
            navigate(`/project/${id}`); // Redireciona ou atualiza a página
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

    const animateAndConfetti = async (event) => {
        const icon = event.currentTarget; // Obter o botão que foi clicado
        icon.classList.add('animate');
    
        icon.addEventListener('animationend', () => {
            icon.classList.remove('animate');
        });
    
        // Calcular a posição do botão
        const rect = icon.getBoundingClientRect();
        const x = rect.left + rect.width / 2; // Posição X central do botão
        const y = rect.top + rect.height / 2; // Posição Y central do botão na tela
    
        // Ajustar as coordenadas para a origem do confete com base na posição do botão
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { 
                x: x / window.innerWidth, // A posição X como uma fração da largura da janela
                y: y / window.innerHeight // A posição Y como uma fração da altura da janela
            }
        });
    
        await joinProject(); // Supondo que joinProject seja uma função definida
    };

    useEffect(() => {
        const fetchParticipantsDetails = async () => {
            if (project && project.participants && project.participants.length > 0) {
                try {
                    const userDetails = await Promise.all(
                        project.participants.map(async (uid) => {
                            const userDocRef = doc(db, "users", uid);
                            const userDoc = await getDoc(userDocRef);
                            if (userDoc.exists()) {
                                return { uid, displayName: userDoc.data().displayName };
                            } else {
                                console.log(`Documento não encontrado para o uid: ${uid}`);
                                return null;
                            }
                        })
                    );
                    setParticipantsDetails(userDetails.filter(Boolean));
                } catch (error) {
                    console.error("Erro ao buscar detalhes dos participantes:", error);
                }
            }
        };
    
        if (project?.participants?.length > 0) {
            fetchParticipantsDetails();
        }
    }, [project]);

    
    return (
        <div className={styles.project_container}>
            {loading && <div className="loading-container">
                             <div className="loader"></div>
                            <p className="loading-text">Carregando projeto...</p>
                         </div>}
            {error && <p>{error}</p>}
            {project && (
                <div>
                    <Link to="/" className={styles.btnback}><IoIosArrowBack size="1em"/> Voltar</Link>
                    <h3>{project.title}</h3>
                    <img src={project.image} alt={project.title} />
                    <h3>Descrição do projeto</h3>
                    <p className={styles.p_body}>{project.description}</p>
                    <div className={styles.tags}>
                        {project.tagsArray.map((tag) => (
                            <p key={tag}><span>#</span>{tag}</p>
                        ))}
                    </div>
                    <div className={styles.links}>
                    <h3>Participar</h3>
                   <button onClick={(event) => animateAndConfetti(event)} className={styles.icon}>
                        <AiFillLike size="2em"/>
                    </button>
                    </div>
                    {participantsDetails.length > 0 && (
                        <div className={styles.participantsContainer}>
                            <h4>Participantes <MdOutlinePersonPin /></h4>
                            <ul className={styles.ul}>
                                {participantsDetails.map((participant) => (
                                    <li key={participant.uid}>{participant.displayName}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {project.link && (
                        <div className={styles.links}>
                            <h3>Link</h3>
                            <button onClick={openLink} className={styles.btnAcess}>Acessar projeto  <HiOutlineArrowUpRight size="1em"/></button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Project;